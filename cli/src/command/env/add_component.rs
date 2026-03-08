use crate::command::component::push::parse_package_name;
use crate::command::env::EnvArgs;
use crate::config::ARTIFACTS_DIR;
use crate::language;
use crate::local_store::LocalStore;
use crate::registry::RegistryClient;
use asterai_runtime::component::Component;
use asterai_runtime::resource::metadata::ResourceKind;
use eyre::{OptionExt, bail};
use std::fs;
use std::str::FromStr;

impl EnvArgs {
    pub async fn add_component(&self) -> eyre::Result<()> {
        let resource_id = self.resource_id()?;
        let component = match self.is_local_component {
            true => self.resolve_and_cache_local_component()?,
            false => self.resolve_and_fetch_remote_component().await?,
        };
        let mut environment = LocalStore::fetch_environment(&resource_id)
            .map_err(|_| eyre::eyre!("environment '{}' not found locally", resource_id))?;
        environment.add_component(&component);
        LocalStore::write_environment(&environment)?;
        Ok(())
    }

    async fn resolve_and_fetch_remote_component(&self) -> eyre::Result<Component> {
        let component_ref = self
            .component_ref
            .as_ref()
            .ok_or_eyre("missing component")?;
        let resolved = component_ref
            .resolve(&self.api_endpoint, &self.registry_endpoint)
            .await?;
        let component = Component::from_str(&resolved)?;
        if !LocalStore::component_exists(&component) {
            let client = reqwest::Client::new();
            let registry =
                RegistryClient::new(&client, &self.api_endpoint, &self.registry_endpoint);
            registry.pull_component(None, &component, false).await?;
        }
        Ok(component)
    }

    fn resolve_and_cache_local_component(&self) -> eyre::Result<Component> {
        let cwd = std::env::current_dir()?;
        let lang = language::detect(&cwd)
            .ok_or_eyre("current directory is not a recognised component project")?;
        let package_wasm_path = lang.get_package_wasm_path(&cwd);
        if !package_wasm_path.exists() {
            bail!(
                "package.wasm not found (expected {}). \
                 Run: asterai component build",
                package_wasm_path.display()
            );
        }
        let component_wasm_path = lang.get_component_wasm_path(&cwd)?;
        if !component_wasm_path.exists() {
            bail!(
                "component not built yet (expected {}). \
                 Run: asterai component build",
                component_wasm_path.display()
            );
        }
        let pkg_bytes = fs::read(&package_wasm_path)?;
        let pkg_name = parse_package_name(&pkg_bytes)?;
        let version = pkg_name
            .version
            .as_ref()
            .ok_or_eyre("package.wasm has no version")?;
        let comp_ref = format!("{}:{}@{}", pkg_name.namespace, pkg_name.name, version);
        let component = Component::from_str(&comp_ref)
            .map_err(|e| eyre::eyre!("invalid component reference: {e}"))?;
        let component_bytes = fs::read(&component_wasm_path)?;
        cache_local_component(&pkg_name, &pkg_bytes, &component_bytes)?;
        println!(
            "cached local component {}:{}@{}",
            pkg_name.namespace, pkg_name.name, version
        );
        Ok(component)
    }
}

/// Cache a local component's artifacts into the local store.
fn cache_local_component(
    pkg_name: &wit_parser::PackageName,
    pkg_bytes: &[u8],
    component_bytes: &[u8],
) -> eyre::Result<()> {
    let version = pkg_name
        .version
        .as_ref()
        .ok_or_eyre("package.wasm has no version")?;
    let output_dir = ARTIFACTS_DIR
        .join(&pkg_name.namespace)
        .join(format!("{}@{}", pkg_name.name, version));
    fs::create_dir_all(&output_dir)?;
    fs::write(output_dir.join("package.wasm"), pkg_bytes)?;
    fs::write(output_dir.join("component.wasm"), component_bytes)?;
    let metadata = serde_json::json!({
        "kind": ResourceKind::Component.to_string(),
    });
    fs::write(
        output_dir.join("metadata.json"),
        serde_json::to_string_pretty(&metadata)?,
    )?;
    Ok(())
}
