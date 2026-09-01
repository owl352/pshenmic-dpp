use grovedb_commitment_tree::Scope;
use napi::Status;
use napi_derive::napi;

use crate::dynamic_value::DynamicValue;

/// The scope of an Orchard viewing key or address (ZIP-32).
///
/// `External` addresses are the ones you hand out to receive funds; `Internal`
/// is the wallet's own scope, used for change and note management.
#[napi(js_name = "ScopeNAPI")]
#[allow(non_camel_case_types)]
#[derive(Clone, Copy)]
pub enum ScopeNAPI {
    External = 0,
    Internal = 1,
}

impl From<Scope> for ScopeNAPI {
    fn from(value: Scope) -> Self {
        match value {
            Scope::External => ScopeNAPI::External,
            Scope::Internal => ScopeNAPI::Internal,
        }
    }
}

impl From<ScopeNAPI> for Scope {
    fn from(value: ScopeNAPI) -> Self {
        match value {
            ScopeNAPI::External => Scope::External,
            ScopeNAPI::Internal => Scope::Internal,
        }
    }
}

impl From<ScopeNAPI> for String {
    fn from(value: ScopeNAPI) -> Self {
        match value {
            ScopeNAPI::External => "External".to_string(),
            ScopeNAPI::Internal => "Internal".to_string(),
        }
    }
}

impl TryFrom<u64> for ScopeNAPI {
    type Error = napi::Error;

    fn try_from(value: u64) -> Result<Self, Self::Error> {
        match value {
            0 => Ok(ScopeNAPI::External),
            1 => Ok(ScopeNAPI::Internal),
            _ => Err(napi::Error::new(Status::InvalidArg, "Invalid scope value")),
        }
    }
}

impl TryFrom<String> for ScopeNAPI {
    type Error = napi::Error;

    fn try_from(value: String) -> Result<Self, Self::Error> {
        match value.to_lowercase().as_str() {
            "external" => Ok(ScopeNAPI::External),
            "internal" => Ok(ScopeNAPI::Internal),
            _ => Err(napi::Error::new(Status::InvalidArg, "Invalid scope value")),
        }
    }
}

impl TryFrom<&DynamicValue> for ScopeNAPI {
    type Error = napi::Error;

    fn try_from(value: &DynamicValue) -> Result<Self, Self::Error> {
        if value.is_number() {
            ScopeNAPI::try_from(value.try_to_u64()?)
        } else if value.is_string() {
            ScopeNAPI::try_from(value.as_string().unwrap())
        } else {
            Err(napi::Error::new(Status::InvalidArg, "Invalid scope value"))
        }
    }
}

/// Resolves an optional JS scope argument, defaulting to `External` — the scope
/// used for addresses and viewing keys shared with other parties.
pub fn scope_or_external(js_scope: Option<&DynamicValue>) -> Result<Scope, napi::Error> {
    match js_scope {
        Some(value) if !value.is_undefined_or_null() => Ok(ScopeNAPI::try_from(value)?.into()),
        _ => Ok(Scope::External),
    }
}
