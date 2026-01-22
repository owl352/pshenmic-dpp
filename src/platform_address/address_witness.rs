use dpp::address_funds::AddressWitness;
use dpp::platform_value::BinaryData;
use napi::{Either, bindgen_prelude::Uint8Array};
use napi_derive::napi;

#[derive(Clone)]
#[napi(js_name = "AddressWitnessNAPI")]
pub struct AddressWitnessNAPI(AddressWitness);

impl From<AddressWitness> for AddressWitnessNAPI {
    fn from(value: AddressWitness) -> Self {
        AddressWitnessNAPI(value)
    }
}

impl From<AddressWitnessNAPI> for AddressWitness {
    fn from(value: AddressWitnessNAPI) -> Self {
        value.0
    }
}

#[napi]
impl AddressWitnessNAPI {
    #[napi(js_name = "P2PKH")]
    pub fn p2pkh(&self, signature: Uint8Array) -> AddressWitnessNAPI {
        AddressWitnessNAPI(AddressWitness::P2pkh {
            signature: BinaryData(signature.to_vec()),
        })
    }

    #[napi(js_name = "P2SH")]
    pub fn p2sh(
        &self,
        signatures: Vec<Uint8Array>,
        redeem_script: Uint8Array,
    ) -> AddressWitnessNAPI {
        AddressWitnessNAPI(AddressWitness::P2sh {
            signatures: signatures
                .iter()
                .map(|sig| BinaryData(sig.to_vec().clone()))
                .collect(),
            redeem_script: BinaryData(redeem_script.to_vec()),
        })
    }

    #[napi(js_name = "getType")]
    pub fn get_type(&self) -> String {
        match self.0 {
            AddressWitness::P2pkh { .. } => "P2PKH",
            AddressWitness::P2sh { .. } => "P2SH",
        }
        .to_string()
    }

    #[napi(js_name = "getValue")]
    pub fn get_value(&self) -> Either<AddressWitnessP2pkhNAPI, AddressWitnessP2shNAPI> {
        match self.0.clone() {
            AddressWitness::P2pkh { signature } => Either::A(AddressWitnessP2pkhNAPI {
                signature: signature.to_vec().into(),
            }),
            AddressWitness::P2sh {
                signatures,
                redeem_script,
            } => Either::B(AddressWitnessP2shNAPI {
                signatures: signatures.into_iter().map(|sig| sig.to_vec()).collect(),
                redeem_script: redeem_script.to_vec().into(),
            }),
        }
    }
}

#[napi(js_name = "AddressWitnessP2pkhNAPI")]
pub struct AddressWitnessP2pkhNAPI {
    pub signature: Uint8Array,
}

#[napi(js_name = "AddressWitnessP2shNAPI")]
pub struct AddressWitnessP2shNAPI {
    pub signatures: Vec<Vec<u8>>,
    pub redeem_script: Uint8Array,
}
