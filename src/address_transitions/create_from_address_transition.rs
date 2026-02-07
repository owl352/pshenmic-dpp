use dpp::address_funds::PlatformAddress;
use dpp::fee::Credits;
use dpp::state_transition::identity_create_from_addresses_transition::IdentityCreateFromAddressesTransition;
use dpp::state_transition::identity_create_from_addresses_transition::accessors::IdentityCreateFromAddressesTransitionAccessorsV0;
use dpp::state_transition::identity_create_from_addresses_transition::v0::IdentityCreateFromAddressesTransitionV0;
use dpp::state_transition::public_key_in_creation::IdentityPublicKeyInCreation;
use dpp::state_transition::{
    StateTransition, StateTransitionAddressesFeeStrategy, StateTransitionLike,
    StateTransitionWitnessSigned,
};
use napi_derive::napi;

use crate::address_transitions::entities::address_funds_fee_step::AddressFundsFeeStrategyStepNAPI;
use crate::address_transitions::entities::input_address::InputAddressNAPI;
use crate::address_transitions::entities::output_address::OutputAddressNAPI;
use crate::address_transitions::utils::js_inputs_to_inputs;
use crate::dynamic_value::{BigIntString, TryToU64};
use crate::identity_public_key_in_creation::IdentityPublicKeyInCreationNAPI;
use crate::platform_address::address_witness::AddressWitnessNAPI;
use crate::state_transition::StateTransitionNAPI;

#[napi(js_name = "IdentityCreateFromAddressesTransitionNAPI")]
pub struct IdentityCreateFromAddressesTransitionNAPI(IdentityCreateFromAddressesTransition);

impl From<IdentityCreateFromAddressesTransition> for IdentityCreateFromAddressesTransitionNAPI {
    fn from(val: IdentityCreateFromAddressesTransition) -> Self {
        Self(val)
    }
}

impl From<IdentityCreateFromAddressesTransitionNAPI> for IdentityCreateFromAddressesTransition {
    fn from(val: IdentityCreateFromAddressesTransitionNAPI) -> Self {
        val.0
    }
}

#[napi]
impl IdentityCreateFromAddressesTransitionNAPI {
    #[napi(constructor)]
    pub fn new(
        js_identity_public_key_in_creation: Vec<&IdentityPublicKeyInCreationNAPI>,
        js_inputs: Vec<&InputAddressNAPI>,
        js_fee_strategy: Vec<&AddressFundsFeeStrategyStepNAPI>,
        user_fee_increase: u16,
        js_input_witnesses: Vec<&AddressWitnessNAPI>,
        js_output: Option<&OutputAddressNAPI>,
    ) -> Result<IdentityCreateFromAddressesTransitionNAPI, napi::Error> {
        let public_keys: Vec<IdentityPublicKeyInCreation> = js_identity_public_key_in_creation
            .into_iter()
            .map(|key| key.clone().into())
            .collect();

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

        Ok(IdentityCreateFromAddressesTransitionNAPI(
            IdentityCreateFromAddressesTransition::V0(IdentityCreateFromAddressesTransitionV0 {
                public_keys,
                inputs,
                output,
                fee_strategy: js_fee_strategy
                    .into_iter()
                    .map(|step| step.clone().into())
                    .collect(),
                user_fee_increase,
                input_witnesses,
            }),
        ))
    }

    #[napi(getter, js_name = "publicKeys")]
    pub fn public_keys(&self) -> Vec<IdentityPublicKeyInCreationNAPI> {
        self.0
            .public_keys()
            .iter()
            .map(|key| key.clone().into())
            .collect()
    }

    #[napi(getter, js_name = "inputs")]
    pub fn inputs(&self) -> Vec<InputAddressNAPI> {
        self.0
            .inputs()
            .iter()
            .map(|(address, (nonce, credits))| InputAddressNAPI {
                address: address.clone().into(),
                nonce: nonce.clone(),
                credits: BigIntString::from_u64(credits.clone()),
            })
            .collect()
    }

    #[napi(getter, js_name = "output")]
    pub fn output(&self) -> Option<OutputAddressNAPI> {
        self.0.output().map(|(address, credits)| OutputAddressNAPI {
            address: address.clone().into(),
            credits: BigIntString::from_u64(credits.clone()),
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

    #[napi(setter, js_name = "publicKeys")]
    pub fn set_public_keys(
        &mut self,
        js_identity_public_key_in_creation: Vec<&IdentityPublicKeyInCreationNAPI>,
    ) {
        let public_keys: Vec<IdentityPublicKeyInCreation> = js_identity_public_key_in_creation
            .into_iter()
            .map(|key| key.clone().into())
            .collect();

        self.0.set_public_keys(public_keys);
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
    ) -> Result<IdentityCreateFromAddressesTransitionNAPI, napi::Error> {
        let rs_st: StateTransition = st.clone().into();

        match rs_st {
            StateTransition::IdentityCreateFromAddresses(st) => {
                Ok(IdentityCreateFromAddressesTransitionNAPI(st))
            }
            _ => Err(napi::Error::new(
                napi::Status::InvalidArg,
                "Invalid state IdentityCreateFromAddresses type",
            )),
        }
    }

    #[napi(js_name = "toStateTransition")]
    pub fn to_state_transition(&self) -> StateTransitionNAPI {
        StateTransitionNAPI::from(StateTransition::from(self.0.clone()))
    }
}
