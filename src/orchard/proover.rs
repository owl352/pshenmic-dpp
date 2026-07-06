use std::sync::Arc;

use dpp::shielded::builder::OrchardProver;
use grovedb_commitment_tree::ProvingKey;
use napi_derive::napi;

#[napi(js_name = "OrchardProverNAPI")]
pub struct OrchardProverNAPI(Arc<ProvingKey>);

#[napi]
impl OrchardProverNAPI {
    #[napi(js_name = "init")]
    pub async fn new() -> Self {
        OrchardProverNAPI(Arc::new(ProvingKey::build()))
    }
}

impl OrchardProverNAPI {
    /// Cheap `Arc` handle to the proving key for futures spawned off the JS
    /// thread (the proving methods run there so browsers' main thread never
    /// blocks on the rayon pool).
    pub(crate) fn shared(&self) -> SharedProver {
        SharedProver(self.0.clone())
    }
}

impl OrchardProver for OrchardProverNAPI {
    fn proving_key(&self) -> &ProvingKey {
        &self.0
    }
}

pub(crate) struct SharedProver(Arc<ProvingKey>);

impl OrchardProver for SharedProver {
    fn proving_key(&self) -> &ProvingKey {
        &self.0
    }
}
