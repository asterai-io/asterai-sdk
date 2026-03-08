//! OAuth well-known endpoint handlers (RFC 9728, RFC 8414).
//!
//! Serves `/.well-known/oauth-protected-resource/` and
//! `/.well-known/oauth-authorization-server/` metadata for any component
//! with an HTTP route. Responses are deterministic and generated on the
//! fly from the route table — no component execution is involved.
use crate::command::env::call_api::AppState;
use axum::extract::{Path, State};
use axum::response::IntoResponse;
use hyper::StatusCode;
use hyper::header::HeaderMap;

/// GET /.well-known/oauth-protected-resource/{env_ns}/{env_name}/{comp_ns}/{comp_name}
pub async fn handle_protected_resource(
    State(state): State<AppState>,
    headers: HeaderMap,
    Path((env_ns, env_name, comp_ns, comp_name)): Path<(String, String, String, String)>,
) -> impl IntoResponse {
    let route_table = &state.route_table;
    if !is_valid_route(route_table, &env_ns, &env_name, &comp_ns, &comp_name) {
        return (StatusCode::NOT_FOUND, "not found").into_response();
    }
    let base = resolve_base_url(&headers, &env_ns, &env_name, &comp_ns, &comp_name);
    let body = serde_json::json!({
        "resource": base,
        "authorization_servers": [base],
    });
    json_response(body)
}

/// GET /.well-known/oauth-authorization-server/{env_ns}/{env_name}/{comp_ns}/{comp_name}
pub async fn handle_authorization_server(
    State(state): State<AppState>,
    headers: HeaderMap,
    Path((env_ns, env_name, comp_ns, comp_name)): Path<(String, String, String, String)>,
) -> impl IntoResponse {
    let route_table = &state.route_table;
    if !is_valid_route(route_table, &env_ns, &env_name, &comp_ns, &comp_name) {
        return (StatusCode::NOT_FOUND, "not found").into_response();
    }
    let base = resolve_base_url(&headers, &env_ns, &env_name, &comp_ns, &comp_name);
    let body = serde_json::json!({
        "issuer": base,
        "authorization_endpoint": format!("{}/authorize", base),
        "token_endpoint": format!("{}/token", base),
        "token_endpoint_auth_methods_supported": ["client_secret_post"],
        "grant_types_supported": ["authorization_code", "client_credentials"],
        "response_types_supported": ["code"],
    });
    json_response(body)
}

fn is_valid_route(
    route_table: &asterai_runtime::runtime::http::HttpRouteTable,
    env_ns: &str,
    env_name: &str,
    comp_ns: &str,
    comp_name: &str,
) -> bool {
    env_ns == route_table.env_namespace()
        && env_name == route_table.env_name()
        && route_table.lookup(comp_ns, comp_name).is_some()
}

fn json_response(body: serde_json::Value) -> axum::response::Response {
    (
        StatusCode::OK,
        [("content-type", "application/json")],
        serde_json::to_string(&body).unwrap(),
    )
        .into_response()
}

fn resolve_base_url(
    headers: &HeaderMap,
    env_ns: &str,
    env_name: &str,
    comp_ns: &str,
    comp_name: &str,
) -> String {
    let scheme = resolve_scheme(headers);
    let host = resolve_host(headers);
    format!("{scheme}://{host}/{env_ns}/{env_name}/{comp_ns}/{comp_name}")
}

fn resolve_scheme(headers: &HeaderMap) -> &str {
    headers
        .get("x-forwarded-proto")
        .and_then(|v| v.to_str().ok())
        .unwrap_or("http")
}

fn resolve_host(headers: &HeaderMap) -> String {
    if let Some(host) = headers
        .get("x-forwarded-host")
        .and_then(|v| v.to_str().ok())
    {
        return host.to_string();
    }
    headers
        .get("host")
        .and_then(|v| v.to_str().ok())
        .unwrap_or("localhost")
        .to_string()
}
