use dpp::identity::contract_bounds::ContractBounds;
use pshenmic_dpp_identifier::IdentifierWASM;
use wasm_bindgen::JsValue;
use wasm_bindgen::prelude::wasm_bindgen;

#[wasm_bindgen(js_name = "ContractBoundsWASM")]
#[derive(Clone)]
pub struct ContractBoundsWASM(ContractBounds);

impl From<ContractBounds> for ContractBoundsWASM {
    fn from(bounds: ContractBounds) -> Self {
        ContractBoundsWASM(bounds)
    }
}

impl From<ContractBoundsWASM> for ContractBounds {
    fn from(bounds: ContractBoundsWASM) -> Self {
        bounds.0
    }
}

#[wasm_bindgen]
impl ContractBoundsWASM {
    #[wasm_bindgen(getter = __type)]
    pub fn type_name(&self) -> String {
        "ContractBoundsWASM".to_string()
    }

    #[wasm_bindgen(getter = __struct)]
    pub fn struct_name() -> String {
        "ContractBoundsWASM".to_string()
    }

    #[wasm_bindgen(js_name = "SingleContract")]
    pub fn single_contract(js_contract_id: &JsValue) -> Result<ContractBoundsWASM, JsValue> {
        let contract_id = IdentifierWASM::try_from(js_contract_id)?;

        Ok(ContractBoundsWASM(ContractBounds::SingleContract {
            id: contract_id.into(),
        }))
    }

    #[wasm_bindgen(js_name = "SingleContractDocumentType")]
    pub fn single_contract_document_type_name(
        js_contract_id: &JsValue,
        document_type_name: String,
    ) -> Result<ContractBoundsWASM, JsValue> {
        let contract_id = IdentifierWASM::try_from(js_contract_id)?;

        Ok(ContractBoundsWASM(
            ContractBounds::SingleContractDocumentType {
                id: contract_id.into(),
                document_type_name,
            },
        ))
    }

    #[wasm_bindgen(getter = "identifier")]
    pub fn id(&self) -> IdentifierWASM {
        self.0.identifier().clone().into()
    }

    #[wasm_bindgen(getter = "documentTypeName")]
    pub fn document_type_name(&self) -> Option<String> {
        match self.0.document_type() {
            Some(name) => Some(name.clone()),
            None => None,
        }
    }

    #[wasm_bindgen(getter = "contractBoundsType")]
    pub fn contract_bounds_type(&self) -> String {
        self.0.contract_bounds_type_string().into()
    }

    #[wasm_bindgen(getter = "contractBoundsTypeNumber")]
    pub fn contract_bounds_type_number(&self) -> u8 {
        self.0.contract_bounds_type()
    }

    #[wasm_bindgen(setter = "identifier")]
    pub fn set_id(&mut self, js_contract_id: &JsValue) -> Result<(), JsValue> {
        let contract_id = IdentifierWASM::try_from(js_contract_id)?;

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

    #[wasm_bindgen(setter = "documentTypeName")]
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
