use dpp::address_funds::AddressWitness;
use dpp::platform_value::BinaryData;
use js_sys::{Object, Reflect, Uint8Array};
use wasm_bindgen::JsValue;
use wasm_bindgen::prelude::wasm_bindgen;

#[derive(Clone)]
#[wasm_bindgen(js_name = "AddressWitnessWASM")]
pub struct AddressWitnessWASM(AddressWitness);

impl From<AddressWitness> for AddressWitnessWASM {
    fn from(value: AddressWitness) -> Self {
        AddressWitnessWASM(value)
    }
}

impl From<AddressWitnessWASM> for AddressWitness {
    fn from(value: AddressWitnessWASM) -> Self {
        value.0
    }
}

#[wasm_bindgen]
impl AddressWitnessWASM {
    #[wasm_bindgen(getter = __type)]
    pub fn type_name(&self) -> String {
        "AddressWitnessWASM".to_string()
    }

    #[wasm_bindgen(getter = __struct)]
    pub fn struct_name() -> String {
        "AddressWitnessWASM".to_string()
    }

    #[wasm_bindgen(js_name = "P2PKH")]
    pub fn p2pkh(&self, signature: Uint8Array) -> AddressWitnessWASM {
        AddressWitnessWASM(AddressWitness::P2pkh {
            signature: BinaryData(signature.to_vec()),
        })
    }

    #[wasm_bindgen(js_name = "P2SH")]
    pub fn p2sh(
        &self,
        signatures: Vec<Uint8Array>,
        redeem_script: Uint8Array,
    ) -> AddressWitnessWASM {
        AddressWitnessWASM(AddressWitness::P2sh {
            signatures: signatures
                .iter()
                .map(|sig| BinaryData(sig.to_vec().clone()))
                .collect(),
            redeem_script: BinaryData(redeem_script.to_vec()),
        })
    }

    #[wasm_bindgen(js_name = "getType")]
    pub fn get_type(&self) -> String {
        match self.0 {
            AddressWitness::P2pkh { .. } => "P2PKH",
            AddressWitness::P2sh { .. } => "P2SH",
        }
        .to_string()
    }

    #[wasm_bindgen(js_name = "getValue")]
    pub fn get_value(&self) -> Result<JsValue, JsValue> {
        let obj = Object::new();

        match self.0.clone() {
            AddressWitness::P2pkh { signature } => {
                Reflect::set(
                    &obj,
                    &JsValue::from("signature"),
                    &Uint8Array::new_from_slice(signature.0.as_slice()).into(),
                )?;
            }
            AddressWitness::P2sh {
                signatures,
                redeem_script,
            } => {
                let js_signatures: Vec<Uint8Array> = signatures
                    .iter()
                    .map(|sig| Uint8Array::new_from_slice(sig.as_slice()))
                    .collect();
                let js_redeem_script = Uint8Array::from(redeem_script.as_slice());

                Reflect::set(&obj, &"signatures".into(), &js_signatures.into())?;
                Reflect::set(&obj, &"redeemScript".into(), &js_redeem_script.into())?;
            }
        };

        Ok(obj.into())
    }
}
