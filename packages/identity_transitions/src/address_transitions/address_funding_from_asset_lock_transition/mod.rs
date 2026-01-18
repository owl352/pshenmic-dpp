use crate::address_transitions::address_funds_fee_step::AddressFundsFeeStrategyStepWASM;
use crate::address_transitions::input_address::InputAddressWASM;
use crate::address_transitions::output_address::OutputAddressWASM;
use dpp::address_funds::{AddressWitness, PlatformAddress};
use dpp::fee::Credits;
use dpp::platform_value::BinaryData;
use dpp::prelude::{AddressNonce, UserFeeIncrease};
use dpp::state_transition::address_funding_from_asset_lock_transition::AddressFundingFromAssetLockTransition;
use dpp::state_transition::address_funding_from_asset_lock_transition::accessors::AddressFundingFromAssetLockTransitionAccessorsV0;
use dpp::state_transition::address_funding_from_asset_lock_transition::v0::AddressFundingFromAssetLockTransitionV0;
use dpp::state_transition::{
    StateTransition, StateTransitionAddressesFeeStrategy, StateTransitionLike,
    StateTransitionSingleSigned, StateTransitionWitnessSigned,
};
use js_sys::Array;
use pshenmic_dpp_asset_lock_proof::AssetLockProofWASM;
use pshenmic_dpp_platform_address::address_witness::AddressWitnessWASM;
use pshenmic_dpp_state_transition::StateTransitionWASM;
use pshenmic_dpp_utils::IntoWasm;
use std::collections::BTreeMap;
use wasm_bindgen::JsValue;
use wasm_bindgen::prelude::wasm_bindgen;

#[wasm_bindgen(js_name = "AddressFundingFromAssetLockTransitionWASM")]
pub struct AddressFundingFromAssetLockTransitionWASM(AddressFundingFromAssetLockTransition);

impl From<AddressFundingFromAssetLockTransitionWASM> for AddressFundingFromAssetLockTransition {
    fn from(v: AddressFundingFromAssetLockTransitionWASM) -> Self {
        v.0
    }
}

impl From<AddressFundingFromAssetLockTransition> for AddressFundingFromAssetLockTransitionWASM {
    fn from(v: AddressFundingFromAssetLockTransition) -> Self {
        AddressFundingFromAssetLockTransitionWASM(v)
    }
}

#[wasm_bindgen]
impl AddressFundingFromAssetLockTransitionWASM {
    #[wasm_bindgen(getter = __type)]
    pub fn type_name(&self) -> String {
        "AddressFundingFromAssetLockTransitionWASM".to_string()
    }

    #[wasm_bindgen(getter = __struct)]
    pub fn struct_name() -> String {
        "AddressFundingFromAssetLockTransitionWASM".to_string()
    }

    #[wasm_bindgen(constructor)]
    pub fn new(
        asset_lock_proof: &AssetLockProofWASM,
        js_inputs: &JsValue,
        js_fee_strategy: Vec<AddressFundsFeeStrategyStepWASM>,
        user_fee_increase: UserFeeIncrease,
        js_input_witnesses: &JsValue,
        js_outputs: &JsValue,
    ) -> Result<Self, JsValue> {
        let js_array_inputs = Array::from(js_inputs);
        let inputs: BTreeMap<PlatformAddress, (AddressNonce, Credits)> = js_array_inputs
            .iter()
            .map(|js_input| {
                let input = js_input
                    .to_wasm::<InputAddressWASM>("InputAddressWASM")?
                    .clone();

                Ok::<(PlatformAddress, (AddressNonce, Credits)), JsValue>((
                    PlatformAddress::from(input.address),
                    (input.nonce, input.credits),
                ))
            })
            .collect::<Result<BTreeMap<PlatformAddress, (AddressNonce, Credits)>, JsValue>>()?;

        let js_array_input_witnesses = Array::from(js_input_witnesses);
        let input_witnesses = js_array_input_witnesses
            .iter()
            .map(|js_input| {
                Ok::<AddressWitness, JsValue>(
                    js_input
                        .to_wasm::<AddressWitnessWASM>("AddressWitnessWASM")?
                        .clone()
                        .into(),
                )
            })
            .collect::<Result<Vec<AddressWitness>, JsValue>>()?;

        let outputs: BTreeMap<PlatformAddress, Option<Credits>> =
            match js_outputs.is_null_or_undefined() {
                true => Err(JsValue::from("outputs must be array"))?,
                false => {
                    let js_arr = Array::from(js_outputs);

                    js_arr
                        .iter()
                        .map(|js_output| {
                            let converted_output = js_output
                                .to_wasm::<OutputAddressWASM>("OutputAddressWASM")?
                                .clone();

                            let raw_credits = converted_output.credits;

                            let mut credits = None;

                            if raw_credits > 0 {
                                credits = Some(raw_credits);
                            }

                            Ok::<(PlatformAddress, Option<Credits>), JsValue>((
                                converted_output.address.into(),
                                credits,
                            ))
                        })
                        .collect::<Result<BTreeMap<PlatformAddress, Option<Credits>>, JsValue>>()?
                }
            };

        Ok(AddressFundingFromAssetLockTransitionWASM(
            AddressFundingFromAssetLockTransition::V0(AddressFundingFromAssetLockTransitionV0 {
                asset_lock_proof: asset_lock_proof.clone().into(),
                inputs,
                outputs,
                fee_strategy: js_fee_strategy
                    .iter()
                    .map(|step| step.clone().into())
                    .collect(),
                user_fee_increase,
                input_witnesses,
                signature: Default::default(),
            }),
        ))
    }

    #[wasm_bindgen(getter = "assetLockProof")]
    pub fn asset_lock_proof(&self) -> AssetLockProofWASM {
        AddressFundingFromAssetLockTransitionAccessorsV0::asset_lock_proof(&self.0)
            .clone()
            .into()
    }

    #[wasm_bindgen(getter = "signature")]
    pub fn signature(&self) -> Vec<u8> {
        self.0.signature().clone().to_vec()
    }

    #[wasm_bindgen(getter = "inputs")]
    pub fn inputs(&self) -> Vec<InputAddressWASM> {
        self.0
            .inputs()
            .iter()
            .map(|(address, (nonce, credits))| InputAddressWASM {
                address: address.clone().into(),
                nonce: nonce.clone(),
                credits: credits.clone(),
            })
            .collect()
    }

    #[wasm_bindgen(getter = "outputs")]
    pub fn outputs(&self) -> Vec<OutputAddressWASM> {
        self.0
            .outputs()
            .iter()
            .map(|(address, credits)| OutputAddressWASM {
                address: address.clone().into(),
                credits: credits.clone().unwrap_or(0),
            })
            .collect()
    }

    #[wasm_bindgen(getter = "feeStrategy")]
    pub fn fee_strategy(&self) -> Vec<AddressFundsFeeStrategyStepWASM> {
        self.0
            .fee_strategy()
            .iter()
            .map(|step| AddressFundsFeeStrategyStepWASM::from(step.clone()))
            .collect()
    }

    #[wasm_bindgen(getter = "userFeeIncrease")]
    pub fn user_fee_increase(&self) -> UserFeeIncrease {
        self.0.user_fee_increase()
    }

    #[wasm_bindgen(getter = "inputWitness")]
    pub fn input_witness(&self) -> Vec<AddressWitnessWASM> {
        self.0
            .witnesses()
            .iter()
            .map(|witness| AddressWitnessWASM::from(witness.clone()))
            .collect()
    }

    #[wasm_bindgen(setter = "assetLockProof")]
    pub fn set_asset_lock_proof(&mut self, asset_lock_proof: &AssetLockProofWASM) {
        AddressFundingFromAssetLockTransitionAccessorsV0::set_asset_lock_proof(
            &mut self.0,
            asset_lock_proof.clone().into(),
        )
    }

    #[wasm_bindgen(setter = "signature")]
    pub fn set_signature(&mut self, sig: Vec<u8>) {
        self.0.set_signature(BinaryData(sig))
    }

    #[wasm_bindgen(setter = "inputs")]
    pub fn set_inputs(&mut self, js_inputs: &JsValue) -> Result<(), JsValue> {
        let js_array_inputs = Array::from(js_inputs);
        let inputs: BTreeMap<PlatformAddress, (AddressNonce, Credits)> = js_array_inputs
            .iter()
            .map(|js_input| {
                let input = js_input
                    .to_wasm::<InputAddressWASM>("InputAddressWASM")?
                    .clone();

                Ok::<(PlatformAddress, (AddressNonce, Credits)), JsValue>((
                    PlatformAddress::from(input.address),
                    (input.nonce, input.credits),
                ))
            })
            .collect::<Result<BTreeMap<PlatformAddress, (AddressNonce, Credits)>, JsValue>>()?;

        self.0.set_inputs(inputs);

        Ok(())
    }

    #[wasm_bindgen(setter = "outputs")]
    pub fn set_outputs(&mut self, js_outputs: &JsValue) -> Result<(), JsValue> {
        let outputs: BTreeMap<PlatformAddress, Option<Credits>> =
            match js_outputs.is_null_or_undefined() {
                true => Err(JsValue::from("outputs must be array"))?,
                false => {
                    let js_arr = Array::from(js_outputs);

                    js_arr
                        .iter()
                        .map(|js_output| {
                            let converted_output = js_output
                                .to_wasm::<OutputAddressWASM>("OutputAddressWASM")?
                                .clone();

                            let raw_credits = converted_output.credits;

                            let mut credits = None;

                            if raw_credits > 0 {
                                credits = Some(raw_credits);
                            }

                            Ok::<(PlatformAddress, Option<Credits>), JsValue>((
                                converted_output.address.into(),
                                credits,
                            ))
                        })
                        .collect::<Result<BTreeMap<PlatformAddress, Option<Credits>>, JsValue>>()?
                }
            };

        self.0.set_outputs(outputs);

        Ok(())
    }

    #[wasm_bindgen(setter = "feeStrategy")]
    pub fn set_fee_strategy(&mut self, js_fee_strategy: Vec<AddressFundsFeeStrategyStepWASM>) {
        self.0.set_fee_strategy(
            js_fee_strategy
                .iter()
                .map(|step| step.clone().into())
                .collect(),
        )
    }

    #[wasm_bindgen(setter = "userFeeIncrease")]
    pub fn set_user_fee_increase(&mut self, user_fee_increase: UserFeeIncrease) {
        self.0.set_user_fee_increase(user_fee_increase)
    }

    #[wasm_bindgen(setter = "inputWitness")]
    pub fn set_input_witness(&mut self, js_input_witnesses: &JsValue) -> Result<(), JsValue> {
        let js_array_input_witnesses = Array::from(js_input_witnesses);
        let input_witnesses = js_array_input_witnesses
            .iter()
            .map(|js_input| {
                Ok::<AddressWitness, JsValue>(
                    js_input
                        .to_wasm::<AddressWitnessWASM>("AddressWitnessWASM")?
                        .clone()
                        .into(),
                )
            })
            .collect::<Result<Vec<AddressWitness>, JsValue>>()?;

        self.0.set_witnesses(input_witnesses);

        Ok(())
    }

    #[wasm_bindgen(js_name = "fromStateTransition")]
    pub fn from_state_transition(
        st: &StateTransitionWASM,
    ) -> Result<AddressFundingFromAssetLockTransitionWASM, JsValue> {
        let rs_st: StateTransition = st.clone().into();

        match rs_st {
            StateTransition::AddressFundingFromAssetLock(st) => {
                Ok(AddressFundingFromAssetLockTransitionWASM(st))
            }
            _ => Err(JsValue::from_str(&"Invalid state transition type)")),
        }
    }

    #[wasm_bindgen(js_name = "toStateTransition")]
    pub fn to_state_transition(&self) -> StateTransitionWASM {
        StateTransitionWASM::from(StateTransition::from(self.0.clone()))
    }
}
