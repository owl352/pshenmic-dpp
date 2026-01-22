use dpp::address_funds::PlatformAddress;
use dpp::fee::Credits;
use dpp::state_transition::identity_topup_from_addresses_transition::IdentityTopUpFromAddressesTransition;
use dpp::state_transition::identity_topup_from_addresses_transition::accessors::IdentityTopUpFromAddressesTransitionAccessorsV0;
use dpp::state_transition::identity_topup_from_addresses_transition::v0::IdentityTopUpFromAddressesTransitionV0;
use dpp::state_transition::{
    StateTransition, StateTransitionAddressesFeeStrategy, StateTransitionLike,
    StateTransitionWitnessSigned,
};
use napi_derive::napi;

use crate::address_transitions::entities::address_funds_fee_step::AddressFundsFeeStrategyStepNAPI;
use crate::address_transitions::entities::input_address::InputAddressNAPI;
use crate::address_transitions::entities::output_address::OutputAddressNAPI;
use crate::address_transitions::utils::js_inputs_to_inputs;
use crate::dynamic_value::TryToU64;
use crate::dynamic_value::{IdentifierLikeNAPI, Uint64String};
use crate::identifier::IdentifierNAPI;
use crate::platform_address::address_witness::AddressWitnessNAPI;
use crate::state_transition::StateTransitionNAPI;

#[derive(Clone)]
#[napi(js_name = "IdentityTopUpFromAddressesTransitionNAPI")]
pub struct IdentityTopUpFromAddressesTransitionNAPI(IdentityTopUpFromAddressesTransition);

impl From<IdentityTopUpFromAddressesTransitionNAPI> for IdentityTopUpFromAddressesTransition {
    fn from(val: IdentityTopUpFromAddressesTransitionNAPI) -> Self {
        val.0
    }
}

impl From<IdentityTopUpFromAddressesTransition> for IdentityTopUpFromAddressesTransitionNAPI {
    fn from(val: IdentityTopUpFromAddressesTransition) -> Self {
        IdentityTopUpFromAddressesTransitionNAPI(val)
    }
}

#[napi]
impl IdentityTopUpFromAddressesTransitionNAPI {
    #[napi(constructor)]
    pub fn new(
        js_identifier: IdentifierLikeNAPI,
        js_inputs: Vec<&InputAddressNAPI>,
        js_fee_strategy: Vec<&AddressFundsFeeStrategyStepNAPI>,
        user_fee_increase: u16,
        js_input_witnesses: Vec<&AddressWitnessNAPI>,
        js_output: Option<&OutputAddressNAPI>,
    ) -> Result<Self, napi::Error> {
        let identifier = IdentifierNAPI::try_from(js_identifier)?;

        let inputs = js_inputs_to_inputs(js_inputs)?;

        let input_witnesses = js_input_witnesses
            .into_iter()
            .map(|witness| witness.clone().into())
            .collect();

        let output: Option<(PlatformAddress, Credits)> = js_output
            .map(|output| {
                Ok::<(PlatformAddress, Credits), napi::Error>((
                    PlatformAddress::from(output.address().clone()),
                    output.credits().try_to_u64()?,
                ))
            })
            .transpose()?;

        Ok(IdentityTopUpFromAddressesTransitionNAPI(
            IdentityTopUpFromAddressesTransition::V0(IdentityTopUpFromAddressesTransitionV0 {
                inputs,
                output,
                identity_id: identifier.into(),
                fee_strategy: js_fee_strategy
                    .into_iter()
                    .map(|step| step.clone().into())
                    .collect(),
                user_fee_increase,
                input_witnesses,
            }),
        ))
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

    #[napi(setter, js_name = "inputs")]
    pub fn set_inputs(&mut self, js_inputs: Vec<&InputAddressNAPI>) -> Result<(), napi::Error> {
        let inputs = js_inputs_to_inputs(js_inputs)?;

        self.0.set_inputs(inputs);

        Ok(())
    }

    #[napi(setter, js_name = "output")]
    pub fn set_output(&mut self, js_output: Option<&OutputAddressNAPI>) -> Result<(), napi::Error> {
        let output: Option<(PlatformAddress, Credits)> = js_output
            .map(|output| {
                Ok::<(PlatformAddress, Credits), napi::Error>((
                    PlatformAddress::from(output.address().clone()),
                    output.credits().try_to_u64()?,
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
    pub fn set_input_witness(
        &mut self,
        js_input_witnesses: Vec<&AddressWitnessNAPI>,
    ) -> Result<(), napi::Error> {
        let input_witnesses = js_input_witnesses
            .into_iter()
            .map(|witness| witness.clone().into())
            .collect();

        self.0.set_witnesses(input_witnesses);

        Ok(())
    }

    #[napi(js_name = "fromStateTransition")]
    pub fn from_state_transition(
        st: &StateTransitionNAPI,
    ) -> Result<IdentityTopUpFromAddressesTransitionNAPI, napi::Error> {
        let rs_st: StateTransition = st.clone().into();

        match rs_st {
            StateTransition::IdentityTopUpFromAddresses(st) => {
                Ok(IdentityTopUpFromAddressesTransitionNAPI(st))
            }
            _ => Err(napi::Error::new(
                napi::Status::InvalidArg,
                "Invalid state IdentityTopUpFromAddresses type",
            )),
        }
    }

    #[napi(js_name = "toStateTransition")]
    pub fn to_state_transition(&self) -> StateTransitionNAPI {
        StateTransitionNAPI::from(StateTransition::from(self.0.clone()))
    }
}
