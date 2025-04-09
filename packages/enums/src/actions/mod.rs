use wasm_bindgen::prelude::wasm_bindgen;

#[wasm_bindgen(js_name = "ActionType")]
#[allow(non_camel_case_types)]
pub enum ActionType {
    DATA_CONTRACT_CREATE = 0,
    DOCUMENTS_BATCH = 1,
    IDENTITY_CREATE = 2,
    IDENTITY_TOP_UP = 3,
    DATA_CONTRACT_UPDATE = 4,
    IDENTITY_UPDATE = 5,
    IDENTITY_CREDIT_WITHDRAWAL = 6,
    IDENTITY_CREDIT_TRANSFER = 7,
    MASTERNODE_VOTE = 8,
}

impl From<ActionType> for String {
    fn from(value: ActionType) -> Self {
        match value {
            ActionType::DATA_CONTRACT_CREATE => String::from("DATA_CONTRACT_CREATE"),
            ActionType::DOCUMENTS_BATCH => String::from("DOCUMENTS_BATCH"),
            ActionType::IDENTITY_CREATE => String::from("IDENTITY_CREATE"),
            ActionType::IDENTITY_TOP_UP => String::from("IDENTITY_TOP_UP"),
            ActionType::DATA_CONTRACT_UPDATE => String::from("DATA_CONTRACT_UPDATE"),
            ActionType::IDENTITY_UPDATE => String::from("IDENTITY_UPDATE"),
            ActionType::IDENTITY_CREDIT_WITHDRAWAL => String::from("IDENTITY_CREDIT_WITHDRAWAL"),
            ActionType::IDENTITY_CREDIT_TRANSFER => String::from("IDENTITY_CREDIT_TRANSFER"),
            ActionType::MASTERNODE_VOTE => String::from("MASTERNODE_VOTE"),
        }
    }
}
