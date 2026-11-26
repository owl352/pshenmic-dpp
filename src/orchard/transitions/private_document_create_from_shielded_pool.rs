use dpp::platform_value::BinaryData;
use dpp::platform_value::string_encoding::Encoding::{Base64, Hex};
use dpp::platform_value::string_encoding::{decode, encode};
use dpp::serialization::{PlatformDeserializableUntrusted, PlatformSerializable};
use dpp::shielded::SerializedAction;
use dpp::state_transition::StateTransition;
use dpp::state_transition::private_document_create_from_shielded_pool_transition::PrivateDocumentCreateFromShieldedPoolTransition;
use dpp::state_transition::private_document_create_from_shielded_pool_transition::accessors::PrivateDocumentCreateFromShieldedPoolTransitionAccessorsV0;
use dpp::state_transition::private_document_create_from_shielded_pool_transition::v0::PrivateDocumentCreateFromShieldedPoolTransitionV0;
use napi::bindgen_prelude::Uint8Array;
use napi_derive::napi;

use crate::dynamic_value::{BigIntString, IdentifierLikeNAPI, TryToU64};
use crate::identifier::IdentifierNAPI;
use crate::orchard::serialized_action::SerializedActionNAPI;
use crate::state_transition::StateTransitionNAPI;
use crate::utils::{WithJsError, js_bytes_to_anchor, js_bytes_to_binding_signature};

/// Appends entries to a private document type's store, paying from the credit
/// shielded pool (protocol version 15). The bundle is an Orchard spend whose value
/// balance is the fee and whose binding signature commits to the contract, the
/// document type name and every entry; there is no platform signature.
#[derive(Debug, Clone)]
#[napi(js_name = "PrivateDocumentCreateFromShieldedPoolTransitionNAPI")]
pub struct PrivateDocumentCreateFromShieldedPoolTransitionNAPI(
    PrivateDocumentCreateFromShieldedPoolTransition,
);

impl From<PrivateDocumentCreateFromShieldedPoolTransition>
    for PrivateDocumentCreateFromShieldedPoolTransitionNAPI
{
    fn from(value: PrivateDocumentCreateFromShieldedPoolTransition) -> Self {
        Self(value)
    }
}

impl From<PrivateDocumentCreateFromShieldedPoolTransitionNAPI>
    for PrivateDocumentCreateFromShieldedPoolTransition
{
    fn from(value: PrivateDocumentCreateFromShieldedPoolTransitionNAPI) -> Self {
        value.0
    }
}

#[napi]
impl PrivateDocumentCreateFromShieldedPoolTransitionNAPI {
    #[napi(constructor)]
    pub fn new(
        js_data_contract_id: IdentifierLikeNAPI,
        document_type_name: String,
        js_entries: Vec<Uint8Array>,
        js_actions: Vec<&SerializedActionNAPI>,
        js_value_balance: BigIntString,
        js_anchor: Uint8Array,
        js_proof: Uint8Array,
        js_binding_signature: Uint8Array,
    ) -> Result<Self, napi::Error> {
        let actions: Vec<SerializedAction> =
            js_actions.into_iter().map(|a| a.clone().into()).collect();

        let entries: Vec<BinaryData> = js_entries
            .into_iter()
            .map(|entry| BinaryData::from(entry.to_vec()))
            .collect();

        Ok(Self(PrivateDocumentCreateFromShieldedPoolTransition::V0(
            PrivateDocumentCreateFromShieldedPoolTransitionV0 {
                data_contract_id: IdentifierNAPI::try_from(js_data_contract_id)?.into(),
                document_type_name,
                entries,
                actions,
                value_balance: js_value_balance.try_to_u64()?,
                anchor: js_bytes_to_anchor(js_anchor)?,
                proof: js_proof.to_vec(),
                binding_signature: js_bytes_to_binding_signature(js_binding_signature)?,
            },
        )))
    }

    #[napi(getter, js_name = "dataContractId")]
    pub fn data_contract_id(&self) -> IdentifierNAPI {
        self.0.data_contract_id().into()
    }

    #[napi(getter, js_name = "documentTypeName")]
    pub fn document_type_name(&self) -> String {
        self.0.document_type_name().to_string()
    }

    /// The entries, in the order they are appended.
    #[napi(getter, js_name = "entries")]
    pub fn entries(&self) -> Vec<Uint8Array> {
        self.0
            .entries()
            .iter()
            .map(|entry| entry.0.clone().into())
            .collect()
    }

    #[napi(getter, js_name = "actions")]
    pub fn actions(&self) -> Vec<SerializedActionNAPI> {
        self.0
            .actions()
            .iter()
            .cloned()
            .map(SerializedActionNAPI::from)
            .collect()
    }

    /// Credits leaving the credit pool: the bundle's value balance, which is the fee.
    #[napi(getter, js_name = "valueBalance")]
    pub fn value_balance(&self) -> BigIntString {
        BigIntString::from_u64(self.0.value_balance())
    }

    #[napi(getter, js_name = "anchor")]
    pub fn anchor(&self) -> Uint8Array {
        self.0.anchor().into()
    }

    #[napi(getter, js_name = "proof")]
    pub fn proof(&self) -> Uint8Array {
        self.0.proof().to_vec().into()
    }

    #[napi(getter, js_name = "bindingSignature")]
    pub fn binding_signature(&self) -> Uint8Array {
        self.0.binding_signature().into()
    }

    #[napi(js_name = "bytes")]
    pub fn to_bytes(&self) -> Result<Uint8Array, napi::Error> {
        let bytes = StateTransition::PrivateDocumentCreateFromShieldedPool(self.0.clone())
            .serialize_to_bytes()
            .with_js_error()?;

        Ok(bytes.into())
    }

    #[napi(js_name = "hex")]
    pub fn to_hex(&self) -> Result<String, napi::Error> {
        Ok(encode(self.to_bytes()?.to_vec().as_slice(), Hex))
    }

    #[napi(js_name = "base64")]
    pub fn to_base64(&self) -> Result<String, napi::Error> {
        Ok(encode(self.to_bytes()?.to_vec().as_slice(), Base64))
    }

    #[napi(js_name = "fromBytes")]
    pub fn from_bytes(js_bytes: Uint8Array) -> Result<Self, napi::Error> {
        let st = StateTransition::deserialize_from_bytes_untrusted(js_bytes.to_vec().as_slice())
            .with_js_error()?;

        match st {
            StateTransition::PrivateDocumentCreateFromShieldedPool(inner) => Ok(inner.into()),
            _ => Err(napi::Error::new(
                napi::Status::InvalidArg,
                "Invalid state transition type: expected PrivateDocumentCreateFromShieldedPool",
            )),
        }
    }

    #[napi(js_name = "fromHex")]
    pub fn from_hex(hex: String) -> Result<Self, napi::Error> {
        let bytes = decode(&hex, Hex)
            .map_err(|err| napi::Error::new(napi::Status::InvalidArg, err.to_string()))?;

        Self::from_bytes(bytes.into())
    }

    #[napi(js_name = "fromBase64")]
    pub fn from_base64(base64: String) -> Result<Self, napi::Error> {
        let bytes = decode(&base64, Base64)
            .map_err(|err| napi::Error::new(napi::Status::InvalidArg, err.to_string()))?;

        Self::from_bytes(bytes.into())
    }

    #[napi(js_name = "toStateTransition")]
    pub fn to_state_transition(&self) -> StateTransitionNAPI {
        StateTransitionNAPI::from(StateTransition::PrivateDocumentCreateFromShieldedPool(
            self.0.clone(),
        ))
    }

    #[napi(js_name = "fromStateTransition")]
    pub fn from_state_transition(
        st: &StateTransitionNAPI,
    ) -> Result<PrivateDocumentCreateFromShieldedPoolTransitionNAPI, napi::Error> {
        let rs_st: StateTransition = st.clone().into();

        match rs_st {
            StateTransition::PrivateDocumentCreateFromShieldedPool(inner) => Ok(inner.into()),
            _ => Err(napi::Error::new(
                napi::Status::InvalidArg,
                "Invalid state transition type: expected PrivateDocumentCreateFromShieldedPool",
            )),
        }
    }

    #[napi(js_name = "computeMinimumFee")]
    pub fn compute_minimum_fee(
        js_num_actions: u32,
        js_entry_count: u32,
        js_entry_size: u32,
        js_platform_version: Option<crate::enums::platform_version::PlatformVersionNAPI>,
    ) -> Result<BigIntString, napi::Error> {
        let platform_version: dpp::version::PlatformVersion =
            js_platform_version.unwrap_or_default().into();

        dpp::shielded::compute_private_document_create_from_shielded_pool_fee(
            js_num_actions as usize,
            js_entry_count as usize,
            js_entry_size,
            &platform_version,
        )
        .map(BigIntString::from_u64)
        .with_js_error()
    }
}
