use dpp::platform_value::BinaryData;
use dpp::platform_value::string_encoding::{Encoding, decode, encode};
use dpp::serialization::{PlatformDeserializable, PlatformSerializable};
use dpp::state_transition::address_funding_from_asset_lock_transition::AddressFundingFromAssetLockTransition;
use dpp::state_transition::address_funding_from_asset_lock_transition::accessors::AddressFundingFromAssetLockTransitionAccessorsV0;
use dpp::state_transition::address_funding_from_asset_lock_transition::v0::AddressFundingFromAssetLockTransitionV0;
use dpp::state_transition::{
    StateTransition, StateTransitionAddressesFeeStrategy, StateTransitionHasUserFeeIncrease,
    StateTransitionSingleSigned, StateTransitionWitnessSigned,
};
use napi::bindgen_prelude::Uint8Array;
use napi_derive::napi;

use crate::address_transitions::entities::address_funds_fee_step::AddressFundsFeeStrategyStepNAPI;
use crate::address_transitions::entities::input_address::InputAddressNAPI;
use crate::address_transitions::entities::output_address::OutputAddressNullableCreditsNAPI;
use crate::asset_lock_proof::AssetLockProofNAPI;
use crate::dynamic_value::{BigIntString, TryToU64};
use crate::platform_address::address_witness::AddressWitnessNAPI;
use crate::state_transition::StateTransitionNAPI;
use crate::utils::{WithJsError, js_inputs_to_inputs, js_outputs_to_outputs_nullable};

#[napi(js_name = "AddressFundingFromAssetLockTransitionNAPI")]
pub struct AddressFundingFromAssetLockTransitionNAPI(AddressFundingFromAssetLockTransition);

impl From<AddressFundingFromAssetLockTransitionNAPI> for AddressFundingFromAssetLockTransition {
    fn from(v: AddressFundingFromAssetLockTransitionNAPI) -> Self {
        v.0
    }
}

impl From<AddressFundingFromAssetLockTransition> for AddressFundingFromAssetLockTransitionNAPI {
    fn from(v: AddressFundingFromAssetLockTransition) -> Self {
        AddressFundingFromAssetLockTransitionNAPI(v)
    }
}

#[napi]
impl AddressFundingFromAssetLockTransitionNAPI {
    #[napi(constructor)]
    pub fn new(
        asset_lock_proof: &AssetLockProofNAPI,
        js_inputs: Vec<&InputAddressNAPI>,
        js_fee_strategy: Vec<&AddressFundsFeeStrategyStepNAPI>,
        user_fee_increase: u16,
        js_input_witnesses: Vec<&AddressWitnessNAPI>,
        js_outputs: Vec<&OutputAddressNullableCreditsNAPI>,
    ) -> Result<Self, napi::Error> {
        let inputs = js_inputs_to_inputs(js_inputs)?;

        let input_witnesses = js_input_witnesses
            .into_iter()
            .map(|witness| witness.clone().into())
            .collect();

        let outputs = js_outputs_to_outputs_nullable(js_outputs)?;

        Ok(AddressFundingFromAssetLockTransitionNAPI(
            AddressFundingFromAssetLockTransition::V0(AddressFundingFromAssetLockTransitionV0 {
                asset_lock_proof: asset_lock_proof.clone().into(),
                inputs,
                outputs,
                fee_strategy: js_fee_strategy
                    .into_iter()
                    .map(|step| step.clone().into())
                    .collect(),
                user_fee_increase,
                input_witnesses,
                signature: Default::default(),
            }),
        ))
    }

    #[napi(getter, js_name = "assetLockProof")]
    pub fn asset_lock_proof(&self) -> AssetLockProofNAPI {
        AddressFundingFromAssetLockTransitionAccessorsV0::asset_lock_proof(&self.0)
            .clone()
            .into()
    }

    #[napi(getter, js_name = "signature")]
    pub fn signature(&self) -> Uint8Array {
        self.0.signature().clone().to_vec().into()
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

    #[napi(getter, js_name = "outputs")]
    pub fn outputs(&self) -> Vec<OutputAddressNullableCreditsNAPI> {
        self.0
            .outputs()
            .iter()
            .map(|(address, credits)| OutputAddressNullableCreditsNAPI {
                address: address.clone().into(),
                credits: credits.clone().map(|c| BigIntString::from_u64(c)),
            })
            .collect()
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

    #[napi(setter, js_name = "assetLockProof")]
    pub fn set_asset_lock_proof(&mut self, asset_lock_proof: &AssetLockProofNAPI) {
        AddressFundingFromAssetLockTransitionAccessorsV0::set_asset_lock_proof(
            &mut self.0,
            asset_lock_proof.clone().into(),
        )
    }

    #[napi(setter, js_name = "signature")]
    pub fn set_signature(&mut self, sig: Uint8Array) {
        self.0.set_signature(BinaryData(sig.to_vec()))
    }

    #[napi(setter, js_name = "inputs")]
    pub fn set_inputs(&mut self, js_inputs: Vec<&InputAddressNAPI>) -> Result<(), napi::Error> {
        let inputs = js_inputs_to_inputs(js_inputs)?;

        self.0.set_inputs(inputs);

        Ok(())
    }

    #[napi(setter, js_name = "outputs")]
    pub fn set_outputs(
        &mut self,
        js_outputs: Vec<&OutputAddressNullableCreditsNAPI>,
    ) -> Result<(), napi::Error> {
        let outputs = js_outputs_to_outputs_nullable(js_outputs)?;

        self.0.set_outputs(outputs);

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

    #[napi(js_name = "bytes")]
    pub fn bytes(&self) -> Result<Uint8Array, napi::Error> {
        Ok(self.0.serialize_to_bytes().with_js_error()?.into())
    }

    #[napi(js_name = "hex")]
    pub fn hex(&self) -> Result<String, napi::Error> {
        Ok(encode(
            self.0.serialize_to_bytes().with_js_error()?.as_slice(),
            Encoding::Hex,
        ))
    }

    #[napi(js_name = "base64")]
    pub fn base64(&self) -> Result<String, napi::Error> {
        Ok(encode(
            self.0.serialize_to_bytes().with_js_error()?.as_slice(),
            Encoding::Base64,
        ))
    }

    #[napi(js_name = "fromBytes")]
    pub fn from_bytes(data: Uint8Array) -> Result<Self, napi::Error> {
        Ok(Self(
            AddressFundingFromAssetLockTransition::deserialize_from_bytes(data.to_vec().as_slice())
                .with_js_error()?,
        ))
    }

    #[napi(js_name = "fromHex")]
    pub fn from_hex(data: String) -> Result<Self, napi::Error> {
        Ok(Self(
            AddressFundingFromAssetLockTransition::deserialize_from_bytes(
                decode(&data, Encoding::Hex)
                    .map_err(|_| napi::Error::new(napi::Status::InvalidArg, "Invalid hex string"))?
                    .as_slice(),
            )
            .with_js_error()?,
        ))
    }

    #[napi(js_name = "fromBase64")]
    pub fn from_base64(data: String) -> Result<Self, napi::Error> {
        Ok(Self(
            AddressFundingFromAssetLockTransition::deserialize_from_bytes(
                decode(&data, Encoding::Base64)
                    .map_err(|_| {
                        napi::Error::new(napi::Status::InvalidArg, "Invalid Base64 string")
                    })?
                    .as_slice(),
            )
            .with_js_error()?,
        ))
    }

    #[napi(js_name = "fromStateTransition")]
    pub fn from_state_transition(
        st: &StateTransitionNAPI,
    ) -> Result<AddressFundingFromAssetLockTransitionNAPI, napi::Error> {
        let rs_st: StateTransition = st.clone().into();

        match rs_st {
            StateTransition::AddressFundingFromAssetLock(st) => {
                Ok(AddressFundingFromAssetLockTransitionNAPI(st))
            }
            _ => Err(napi::Error::new(
                napi::Status::InvalidArg,
                "Invalid state AddressFundingFromAssetLock type",
            )),
        }
    }

    #[napi(js_name = "toStateTransition")]
    pub fn to_state_transition(&self) -> StateTransitionNAPI {
        StateTransitionNAPI::from(StateTransition::from(self.0.clone()))
    }
}
