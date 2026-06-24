use dpp::shielded::builder::OrchardProver;
use grovedb_commitment_tree::ProvingKey;
use napi_derive::napi;

#[napi(js_name = "OrchardProverNAPI")]
pub struct OrchardProverNAPI(ProvingKey);

#[napi]
impl OrchardProverNAPI {
    #[napi(constructor)]
    pub fn new() -> Self {
        OrchardProverNAPI(ProvingKey::build())
    }
}

impl OrchardProver for OrchardProverNAPI {
    fn proving_key(&self) -> &ProvingKey {
        &self.0
    }
}
