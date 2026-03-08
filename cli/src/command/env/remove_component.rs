use crate::command::component::push::parse_package_name;
use crate::command::env::EnvArgs;
use crate::language;
use crate::local_store::LocalStore;
use eyre::{OptionExt, bail};

impl EnvArgs {
    pub async fn remove_component(&self) -> eyre::Result<()> {
        let resource_id = self.resource_id()?;
        let (namespace, name) = match self.is_local_component {
            true => resolve_local_component_id()?,
            false => {
                let component_ref = self
                    .component_ref
                    .as_ref()
                    .ok_or_eyre("missing component")?;
                (component_ref.namespace.clone(), component_ref.name.clone())
            }
        };
        let mut environment = LocalStore::fetch_environment(&resource_id)
            .map_err(|_| eyre::eyre!("environment '{}' not found locally", resource_id))?;
        let removed = environment.remove_component(&namespace, &name);
        if !removed {
            println!("component not found in environment");
        }
        LocalStore::write_environment(&environment)?;
        Ok(())
    }
}

/// Resolve the namespace and name of the local component project.
fn resolve_local_component_id() -> eyre::Result<(String, String)> {
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
    let pkg_bytes = std::fs::read(&package_wasm_path)?;
    let pkg_name = parse_package_name(&pkg_bytes)?;
    Ok((pkg_name.namespace, pkg_name.name))
}
