use crate::{dynamic_value::IdentifierLikeNAPI, identifier::IdentifierNAPI};
use dpp::identity::contract_bounds::ContractBounds;
use napi_derive::napi;

#[derive(Clone)]
#[napi(js_name = "ContractBoundsNAPI")]
pub struct ContractBoundsNAPI(ContractBounds);

impl From<ContractBounds> for ContractBoundsNAPI {
    fn from(value: ContractBounds) -> Self {
        ContractBoundsNAPI(value)
    }
}

impl From<ContractBoundsNAPI> for ContractBounds {
    fn from(value: ContractBoundsNAPI) -> Self {
        value.0
    }
}

#[napi]
impl ContractBoundsNAPI {
    #[napi(constructor)]
    pub fn new(
        js_contract_id: IdentifierLikeNAPI,
        document_type_name: Option<String>,
    ) -> Result<ContractBoundsNAPI, napi::Error> {
        let contract_id: IdentifierNAPI = js_contract_id.try_into()?;

        let rs_contract_bounds = match document_type_name {
            Some(document_type_name) => ContractBounds::SingleContractDocumentType {
                id: contract_id.into(),
                document_type_name,
            },
            None => ContractBounds::SingleContract {
                id: contract_id.into(),
            },
        };

        Ok(ContractBoundsNAPI(rs_contract_bounds))
    }

    #[napi(getter, js_name = "identifier")]
    pub fn id(&self) -> IdentifierNAPI {
        self.0.identifier().into()
    }

    #[napi(getter, js_name = "documentTypeName")]
    pub fn document_type_name(&self) -> Option<String> {
        match self.0.document_type() {
            Some(name) => Some(name.clone()),
            None => None,
        }
    }

    #[napi(getter, js_name = "contractBoundsType")]
    pub fn contract_bounds_type(&self) -> String {
        self.0.contract_bounds_type_string().into()
    }

    #[napi(getter, js_name = "contractBoundsTypeNumber")]
    pub fn contract_bounds_type_number(&self) -> u8 {
        self.0.contract_bounds_type()
    }

    #[napi(setter, js_name = "identifier")]
    pub fn set_id(&mut self, js_contract_id: IdentifierLikeNAPI) -> Result<(), napi::Error> {
        let contract_id: IdentifierNAPI = js_contract_id.try_into()?;

        self.0 = match self.clone().0 {
            ContractBounds::SingleContract { .. } => ContractBounds::SingleContract {
                id: contract_id.into(),
            },
            ContractBounds::SingleContractDocumentType {
                document_type_name, ..
            } => ContractBounds::SingleContractDocumentType {
                id: contract_id.into(),
                document_type_name,
            },
        };

        Ok(())
    }

    #[napi(setter, js_name = "documentTypeName")]
    pub fn set_document_type_name(&mut self, document_type_name: String) {
        self.0 = match self.clone().0 {
            ContractBounds::SingleContract { .. } => self.clone().0,
            ContractBounds::SingleContractDocumentType { id, .. } => {
                ContractBounds::SingleContractDocumentType {
                    id,
                    document_type_name,
                }
            }
        }
    }
}
