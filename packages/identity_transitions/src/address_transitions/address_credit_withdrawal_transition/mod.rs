use crate::address_transitions::address_funds_fee_step::AddressFundsFeeStrategyStepWASM;
use crate::address_transitions::input_address::InputAddressWASM;
use crate::address_transitions::output_address::OutputAddressWASM;
use dpp::address_funds::{AddressWitness, PlatformAddress};
use dpp::fee::Credits;
use dpp::prelude::{AddressNonce, UserFeeIncrease};
use dpp::state_transition::address_credit_withdrawal_transition::AddressCreditWithdrawalTransition;
use dpp::state_transition::address_credit_withdrawal_transition::accessors::AddressCreditWithdrawalTransitionAccessorsV0;
use dpp::state_transition::address_credit_withdrawal_transition::v0::AddressCreditWithdrawalTransitionV0;
use dpp::state_transition::{
    StateTransition, StateTransitionAddressesFeeStrategy, StateTransitionLike,
    StateTransitionWitnessSigned,
};
use js_sys::Array;
use pshenmic_dpp_core_script::CoreScriptWASM;
use pshenmic_dpp_enums::withdrawal::PoolingWASM;
use pshenmic_dpp_platform_address::address_witness::AddressWitnessWASM;
use pshenmic_dpp_state_transition::StateTransitionWASM;
use pshenmic_dpp_utils::IntoWasm;
use std::collections::BTreeMap;
use wasm_bindgen::JsValue;
use wasm_bindgen::prelude::wasm_bindgen;

#[derive(Clone)]
#[wasm_bindgen(js_name = "AddressCreditWithdrawalTransitionWASM")]
pub struct AddressCreditWithdrawalTransitionWASM(AddressCreditWithdrawalTransition);

impl From<AddressCreditWithdrawalTransition> for AddressCreditWithdrawalTransitionWASM {
    fn from(v: AddressCreditWithdrawalTransition) -> Self {
        AddressCreditWithdrawalTransitionWASM(v)
    }
}

impl From<AddressCreditWithdrawalTransitionWASM> for AddressCreditWithdrawalTransition {
    fn from(v: AddressCreditWithdrawalTransitionWASM) -> Self {
        v.0
    }
}

#[wasm_bindgen]
impl AddressCreditWithdrawalTransitionWASM {
    #[wasm_bindgen(getter = __type)]
    pub fn type_name(&self) -> String {
        "AddressCreditWithdrawalTransitionWASM".to_string()
    }

    #[wasm_bindgen(getter = __struct)]
    pub fn struct_name() -> String {
        "AddressCreditWithdrawalTransitionWASM".to_string()
    }

    #[wasm_bindgen(constructor)]
    pub fn new(
        js_inputs: &JsValue,
        js_fee_strategy: Vec<AddressFundsFeeStrategyStepWASM>,
        core_fee_per_byte: u32,
        js_pooling: &JsValue,
        js_output_script: &CoreScriptWASM,
        user_fee_increase: UserFeeIncrease,
        js_input_witnesses: &JsValue,
        js_output: &JsValue,
    ) -> Result<AddressCreditWithdrawalTransitionWASM, JsValue> {
        let pooling = PoolingWASM::try_from(js_pooling.clone())?;

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

        let output: Option<(PlatformAddress, Credits)> = match js_output.is_null_or_undefined() {
            true => None,
            false => {
                let converted_output = js_output
                    .to_wasm::<OutputAddressWASM>("OutputAddressWASM")?
                    .clone();

                Some((converted_output.address.into(), converted_output.credits))
            }
        };

        Ok(AddressCreditWithdrawalTransitionWASM(
            AddressCreditWithdrawalTransition::V0(AddressCreditWithdrawalTransitionV0 {
                inputs,
                output,
                fee_strategy: js_fee_strategy
                    .iter()
                    .map(|step| step.clone().into())
                    .collect(),
                core_fee_per_byte,
                pooling: pooling.into(),
                output_script: js_output_script.clone().into(),
                user_fee_increase,
                input_witnesses,
            }),
        ))
    }

    #[wasm_bindgen(getter = "coreFeePerByte")]
    pub fn core_fee_per_byte(&self) -> u32 {
        self.0.core_fee_per_byte()
    }

    #[wasm_bindgen(getter = "pooling")]
    pub fn pooling(&self) -> PoolingWASM {
        self.0.pooling().into()
    }

    #[wasm_bindgen(getter = "outputScript")]
    pub fn output_script(&self) -> CoreScriptWASM {
        self.0.output_script().clone().into()
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

    #[wasm_bindgen(getter = "output")]
    pub fn output(&self) -> Option<OutputAddressWASM> {
        self.0.output().map(|(address, credits)| OutputAddressWASM {
            address: address.clone().into(),
            credits: credits.clone(),
        })
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

    #[wasm_bindgen(setter = "coreFeePerByte")]
    pub fn set_core_fee_per_byte(&mut self, core_fee_per_byte: u32) {
        self.0.set_core_fee_per_byte(core_fee_per_byte)
    }

    #[wasm_bindgen(setter = "pooling")]
    pub fn set_pooling(&mut self, js_pooling: &JsValue) -> Result<(), JsValue> {
        let pooling = PoolingWASM::try_from(js_pooling.clone())?;
        self.0.set_pooling(pooling.into());
        Ok(())
    }

    #[wasm_bindgen(setter = "outputScript")]
    pub fn set_output_script(&mut self, output_script: &CoreScriptWASM) {
        self.0.set_output_script(output_script.clone().into())
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

    #[wasm_bindgen(setter = "output")]
    pub fn set_output(&mut self, js_output: &JsValue) -> Result<(), JsValue> {
        let output: Option<(PlatformAddress, Credits)> = match js_output.is_null_or_undefined() {
            true => None,
            false => {
                let converted_output = js_output
                    .to_wasm::<OutputAddressWASM>("OutputAddressWASM")?
                    .clone();

                Some((converted_output.address.into(), converted_output.credits))
            }
        };

        self.0.set_output(output);

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
    ) -> Result<AddressCreditWithdrawalTransitionWASM, JsValue> {
        let rs_st: StateTransition = st.clone().into();

        match rs_st {
            StateTransition::AddressCreditWithdrawal(st) => {
                Ok(AddressCreditWithdrawalTransitionWASM(st))
            }
            _ => Err(JsValue::from_str(&"Invalid state transition type)")),
        }
    }

    #[wasm_bindgen(js_name = "toStateTransition")]
    pub fn to_state_transition(&self) -> StateTransitionWASM {
        StateTransitionWASM::from(StateTransition::from(self.0.clone()))
    }
}
