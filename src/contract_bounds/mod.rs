use crate::identifier::IdentifierNAPI;
use dpp::identity::contract_bounds::ContractBounds;
use napi_derive::napi;

#[derive(Clone)]
#[napi(js_name = "ContractBoundsNAPI")]
pub struct ContractBoundsNAPI {
    contract_bounds: ContractBounds,
}

impl From<ContractBounds> for ContractBoundsNAPI {
    fn from(value: ContractBounds) -> Self {
        ContractBoundsNAPI {
            contract_bounds: value,
        }
    }
}

impl From<ContractBoundsNAPI> for ContractBounds {
    fn from(value: ContractBoundsNAPI) -> Self {
        value.contract_bounds
    }
}

#[napi]
impl ContractBoundsNAPI {
    #[napi(constructor)]
    pub fn new(
        contract_id: &IdentifierNAPI,
        document_type_name: Option<String>,
    ) -> ContractBoundsNAPI {
        let rs_contract_bounds = match document_type_name {
            Some(document_type_name) => ContractBounds::SingleContractDocumentType {
                id: contract_id.into(),
                document_type_name,
            },
            None => ContractBounds::SingleContract {
                id: contract_id.into(),
            },
        };

        ContractBoundsNAPI {
            contract_bounds: rs_contract_bounds,
        }
    }

    #[napi(js_name = "SingleContract")]
    pub fn single_contract(contract_id: &IdentifierNAPI) -> ContractBoundsNAPI {
        ContractBoundsNAPI {
            contract_bounds: ContractBounds::SingleContract {
                id: contract_id.into(),
            },
        }
    }

    #[napi(js_name = "SingleContractDocumentType")]
    pub fn single_contract_document_type_name(
        contract_id: &IdentifierNAPI,
        document_type_name: String,
    ) -> ContractBoundsNAPI {
        ContractBoundsNAPI {
            contract_bounds: ContractBounds::SingleContractDocumentType {
                id: contract_id.into(),
                document_type_name,
            },
        }
    }

    #[napi(getter, js_name = "identifier")]
    pub fn id(&self) -> IdentifierNAPI {
        self.contract_bounds.identifier().into()
    }

    #[napi(getter, js_name = "documentTypeName")]
    pub fn document_type_name(&self) -> Option<String> {
        match self.contract_bounds.document_type() {
            Some(name) => Some(name.clone()),
            None => None,
        }
    }

    #[napi(getter, js_name = "contractBoundsType")]
    pub fn contract_bounds_type(&self) -> String {
        self.contract_bounds.contract_bounds_type_string().into()
    }

    #[napi(getter, js_name = "contractBoundsTypeNumber")]
    pub fn contract_bounds_type_number(&self) -> u8 {
        self.contract_bounds.contract_bounds_type()
    }

    #[napi(setter, js_name = "identifier")]
    pub fn set_id(&mut self, contract_id: &IdentifierNAPI) {
        self.contract_bounds = match self.clone().contract_bounds {
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
    }

    #[napi(setter, js_name = "documentTypeName")]
    pub fn set_document_type_name(&mut self, document_type_name: String) {
        self.contract_bounds = match self.clone().contract_bounds {
            ContractBounds::SingleContract { .. } => self.clone().contract_bounds,
            ContractBounds::SingleContractDocumentType { id, .. } => {
                ContractBounds::SingleContractDocumentType {
                    id,
                    document_type_name,
                }
            }
        }
    }
}
