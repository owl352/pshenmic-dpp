use dpp::address_funds::PlatformAddress;
use dpp::fee::Credits;
use dpp::state_transition::address_credit_withdrawal_transition::AddressCreditWithdrawalTransition;
use dpp::state_transition::address_credit_withdrawal_transition::accessors::AddressCreditWithdrawalTransitionAccessorsV0;
use dpp::state_transition::address_credit_withdrawal_transition::v0::AddressCreditWithdrawalTransitionV0;
use dpp::state_transition::{
    StateTransition, StateTransitionAddressesFeeStrategy, StateTransitionLike,
    StateTransitionWitnessSigned,
};
use napi_derive::napi;

use crate::address_transitions::entities::address_funds_fee_step::AddressFundsFeeStrategyStepNAPI;
use crate::address_transitions::entities::input_address::InputAddressNAPI;
use crate::address_transitions::entities::output_address::OutputAddressNAPI;
use crate::address_transitions::utils::js_inputs_to_inputs;
use crate::core_script::CoreScriptNAPI;
use crate::dynamic_value::{DynamicValue, TryToU64, Uint64String};
use crate::enums::pooling::PoolingNAPI;
use crate::platform_address::PlatformAddressNAPI;
use crate::platform_address::address_witness::AddressWitnessNAPI;
use crate::state_transition::StateTransitionNAPI;

#[derive(Clone)]
#[napi(js_name = "AddressCreditWithdrawalTransitionNAPI")]
pub struct AddressCreditWithdrawalTransitionNAPI(AddressCreditWithdrawalTransition);

impl From<AddressCreditWithdrawalTransition> for AddressCreditWithdrawalTransitionNAPI {
    fn from(v: AddressCreditWithdrawalTransition) -> Self {
        AddressCreditWithdrawalTransitionNAPI(v)
    }
}

impl From<AddressCreditWithdrawalTransitionNAPI> for AddressCreditWithdrawalTransition {
    fn from(v: AddressCreditWithdrawalTransitionNAPI) -> Self {
        v.0
    }
}

#[napi]
impl AddressCreditWithdrawalTransitionNAPI {
    #[napi(constructor)]
    pub fn new(
        js_inputs: Vec<&InputAddressNAPI>,
        js_fee_strategy: Vec<&AddressFundsFeeStrategyStepNAPI>,
        core_fee_per_byte: u32,
        js_pooling: &DynamicValue,
        js_output_script: &CoreScriptNAPI,
        user_fee_increase: u16,
        js_input_witnesses: Vec<&AddressWitnessNAPI>,
        js_output: Option<&OutputAddressNAPI>,
    ) -> Result<AddressCreditWithdrawalTransitionNAPI, napi::Error> {
        let pooling = PoolingNAPI::try_from(js_pooling)?;

        let inputs = js_inputs_to_inputs(js_inputs)?;

        let input_witnesses = js_input_witnesses
            .into_iter()
            .map(|witness| witness.clone().into())
            .collect();

        let output: Option<(PlatformAddress, Credits)> = js_output
            .map(|output| {
                Ok::<(PlatformAddress, Credits), napi::Error>((
                    output.address().clone().into(),
                    output.credits().clone().try_to_u64()?,
                ))
            })
            .transpose()?;

        Ok(AddressCreditWithdrawalTransitionNAPI(
            AddressCreditWithdrawalTransition::V0(AddressCreditWithdrawalTransitionV0 {
                inputs,
                output,
                fee_strategy: js_fee_strategy
                    .into_iter()
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

    #[napi(getter, js_name = "coreFeePerByte")]
    pub fn core_fee_per_byte(&self) -> u32 {
        self.0.core_fee_per_byte()
    }

    #[napi(getter, js_name = "pooling")]
    pub fn pooling(&self) -> String {
        PoolingNAPI::from(self.0.pooling()).into()
    }

    #[napi(getter, js_name = "outputScript")]
    pub fn output_script(&self) -> CoreScriptNAPI {
        self.0.output_script().clone().into()
    }

    #[napi(getter, js_name = "inputs")]
    pub fn inputs(&self) -> Vec<InputAddressNAPI> {
        self.0
            .inputs()
            .iter()
            .map(|(address, (nonce, credits))| InputAddressNAPI {
                address: address.clone().into(),
                nonce: nonce.clone(),
                credits: Uint64String::from_u64(credits.clone()),
            })
            .collect()
    }

    #[napi(getter, js_name = "output")]
    pub fn output(&self) -> Option<OutputAddressNAPI> {
        self.0.output().map(|(address, credits)| OutputAddressNAPI {
            address: address.clone().into(),
            credits: Uint64String::from_u64(credits.clone()),
        })
    }

    #[napi(getter, js_name = "feeStrategy")]
    pub fn fee_strategy(&self) -> Vec<AddressFundsFeeStrategyStepNAPI> {
        self.0
            .fee_strategy()
            .iter()
            .map(|step| AddressFundsFeeStrategyStepNAPI::from(step.clone()))
            .collect()
    }

    #[napi(getter, js_name = "userFeeIncrease")]
    pub fn user_fee_increase(&self) -> u16 {
        self.0.user_fee_increase()
    }

    #[napi(getter, js_name = "inputWitness")]
    pub fn input_witness(&self) -> Vec<AddressWitnessNAPI> {
        self.0
            .witnesses()
            .iter()
            .map(|witness| AddressWitnessNAPI::from(witness.clone()))
            .collect()
    }

    #[napi(setter, js_name = "coreFeePerByte")]
    pub fn set_core_fee_per_byte(&mut self, core_fee_per_byte: u32) {
        self.0.set_core_fee_per_byte(core_fee_per_byte)
    }

    #[napi(setter, js_name = "pooling")]
    pub fn set_pooling(&mut self, js_pooling: &DynamicValue) -> Result<(), napi::Error> {
        let pooling = PoolingNAPI::try_from(js_pooling)?;
        self.0.set_pooling(pooling.into());
        Ok(())
    }

    #[napi(setter, js_name = "outputScript")]
    pub fn set_output_script(&mut self, output_script: &CoreScriptNAPI) {
        self.0.set_output_script(output_script.clone().into())
    }

    #[napi(setter, js_name = "inputs")]
    pub fn set_inputs(&mut self, js_inputs: Vec<&InputAddressNAPI>) -> Result<(), napi::Error> {
        let inputs = js_inputs_to_inputs(js_inputs)?;

        self.0.set_inputs(inputs);

        Ok(())
    }

    #[napi(setter, js_name = "output")]
    pub fn set_output(
        &mut self,
        js_output: Option<(&PlatformAddressNAPI, Uint64String)>,
    ) -> Result<(), napi::Error> {
        let output: Option<(PlatformAddress, Credits)> = js_output
            .map(|(address, credits)| {
                Ok::<(PlatformAddress, Credits), napi::Error>((
                    address.clone().into(),
                    credits.try_to_u64()?,
                ))
            })
            .transpose()?;

        self.0.set_output(output);

        Ok(())
    }

    #[napi(setter, js_name = "feeStrategy")]
    pub fn set_fee_strategy(&mut self, js_fee_strategy: Vec<&AddressFundsFeeStrategyStepNAPI>) {
        self.0.set_fee_strategy(
            js_fee_strategy
                .into_iter()
                .map(|step| step.clone().into())
                .collect(),
        )
    }

    #[napi(setter, js_name = "userFeeIncrease")]
    pub fn set_user_fee_increase(&mut self, user_fee_increase: u16) {
        self.0.set_user_fee_increase(user_fee_increase)
    }

    #[napi(setter, js_name = "inputWitness")]
    pub fn set_input_witness(&mut self, js_input_witnesses: Vec<&AddressWitnessNAPI>) {
        let input_witnesses = js_input_witnesses
            .into_iter()
            .map(|witness| witness.clone().into())
            .collect();

        self.0.set_witnesses(input_witnesses);
    }

    #[napi(js_name = "fromStateTransition")]
    pub fn from_state_transition(
        st: &StateTransitionNAPI,
    ) -> Result<AddressCreditWithdrawalTransitionNAPI, napi::Error> {
        let rs_st: StateTransition = st.clone().into();

        match rs_st {
            StateTransition::AddressCreditWithdrawal(st) => {
                Ok(AddressCreditWithdrawalTransitionNAPI(st))
            }
            _ => Err(napi::Error::new(
                napi::Status::InvalidArg,
                "Invalid state AddressCreditWithdrawal type",
            )),
        }
    }

    #[napi(js_name = "toStateTransition")]
    pub fn to_state_transition(&self) -> StateTransitionNAPI {
        StateTransitionNAPI::from(StateTransition::from(self.0.clone()))
    }
}
