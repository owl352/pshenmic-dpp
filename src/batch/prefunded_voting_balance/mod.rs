use dpp::fee::Credits;
use napi_derive::napi;

use crate::dynamic_value::{TryToU64, Uint64String};

#[napi(js_name = "PrefundedVotingBalanceNAPI")]
#[derive(Clone)]
pub struct PrefundedVotingBalanceNAPI {
    index_name: String,
    credits: Credits,
}

impl From<(String, Credits)> for PrefundedVotingBalanceNAPI {
    fn from((index_name, credits): (String, Credits)) -> Self {
        PrefundedVotingBalanceNAPI {
            index_name,
            credits,
        }
    }
}

impl From<PrefundedVotingBalanceNAPI> for (String, Credits) {
    fn from(value: PrefundedVotingBalanceNAPI) -> Self {
        (value.index_name, value.credits)
    }
}

#[napi]
impl PrefundedVotingBalanceNAPI {
    #[napi(constructor)]
    pub fn new(
        index_name: String,
        credits: Uint64String,
    ) -> Result<PrefundedVotingBalanceNAPI, napi::Error> {
        Ok(PrefundedVotingBalanceNAPI {
            index_name,
            credits: credits.try_to_u64()?,
        })
    }

    #[napi(getter, js_name = "indexName")]
    pub fn index_name(&self) -> String {
        self.index_name.clone()
    }

    #[napi(getter, js_name = "credits")]
    pub fn credits(&self) -> Uint64String {
        Uint64String::from_u64(self.credits.clone())
    }
}
