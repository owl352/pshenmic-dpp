use dpp::identity::IdentityPublicKey;
use dpp::identity::contract_bounds::ContractBounds;
use dpp::identity::identity_public_key::v0::IdentityPublicKeyV0;
use dpp::platform_value::BinaryData;
use dpp::platform_value::string_encoding::Encoding::Hex;
use dpp::state_transition::public_key_in_creation::IdentityPublicKeyInCreation;
use dpp::state_transition::public_key_in_creation::accessors::{
    IdentityPublicKeyInCreationV0Getters, IdentityPublicKeyInCreationV0Setters,
};
use dpp::state_transition::public_key_in_creation::v0::IdentityPublicKeyInCreationV0;
use napi::Either;
use napi::bindgen_prelude::Uint8Array;
use napi_derive::napi;

use crate::contract_bounds::ContractBoundsNAPI;
use crate::dynamic_value::DynamicValue;
use crate::enums::key_type::KeyTypeNAPI;
use crate::enums::purpose::PurposeNAPI;
use crate::enums::security_level::SecurityLevelNAPI;
use crate::identity_public_key::IdentityPublicKeyNAPI;
use crate::private_key::PrivateKeyNAPI;
use crate::utils::WithJsError;

#[derive(Clone, Debug)]
#[napi(js_name = "IdentityPublicKeyInCreationNAPI")]
pub struct IdentityPublicKeyInCreationNAPI(IdentityPublicKeyInCreation);

impl From<IdentityPublicKeyInCreation> for IdentityPublicKeyInCreationNAPI {
    fn from(value: IdentityPublicKeyInCreation) -> Self {
        IdentityPublicKeyInCreationNAPI(value)
    }
}

impl From<IdentityPublicKeyInCreationNAPI> for IdentityPublicKeyInCreation {
    fn from(value: IdentityPublicKeyInCreationNAPI) -> Self {
        value.0
    }
}

impl From<IdentityPublicKeyInCreationNAPI> for IdentityPublicKey {
    fn from(value: IdentityPublicKeyInCreationNAPI) -> Self {
        let contract_bounds = match value.0.contract_bounds() {
            None => None,
            Some(bounds) => Some(bounds.clone()),
        };

        IdentityPublicKey::V0(IdentityPublicKeyV0 {
            id: value.0.id(),
            purpose: value.0.purpose(),
            security_level: value.0.security_level(),
            contract_bounds,
            key_type: value.0.key_type(),
            read_only: value.0.read_only(),
            data: value.0.data().clone(),
            disabled_at: None,
        })
    }
}

#[napi]
impl IdentityPublicKeyInCreationNAPI {
    #[napi(constructor)]
    pub fn new(
        id: u32,
        js_purpose: DynamicValue,
        js_security_level: DynamicValue,
        js_key_type: DynamicValue,
        read_only: bool,
        binary_data: Uint8Array,
        signature: Option<Uint8Array>,
        js_contract_bounds: Option<&ContractBoundsNAPI>,
    ) -> Result<IdentityPublicKeyInCreationNAPI, napi::Error> {
        Ok(IdentityPublicKeyInCreationNAPI(
            IdentityPublicKeyInCreation::V0(IdentityPublicKeyInCreationV0 {
                id,
                key_type: KeyTypeNAPI::try_from(js_key_type)?.into(),
                purpose: PurposeNAPI::try_from(js_purpose)?.into(),
                security_level: SecurityLevelNAPI::try_from(js_security_level)?.into(),
                contract_bounds: js_contract_bounds
                    .map(|bounds| ContractBounds::from(bounds.clone())),
                read_only,
                data: BinaryData::from(binary_data.to_vec()),
                signature: BinaryData::from(
                    signature.map(|sig| sig.to_vec()).unwrap_or(Vec::new()),
                ),
            }),
        ))
    }

    #[napi(js_name = toIdentityPublicKey)]
    pub fn to_identity_public_key(&self) -> Result<IdentityPublicKeyNAPI, napi::Error> {
        IdentityPublicKeyNAPI::new(
            self.0.id(),
            DynamicValue::Text(PurposeNAPI::from(self.0.purpose()).into()),
            DynamicValue::Text(SecurityLevelNAPI::from(self.0.security_level()).into()),
            DynamicValue::Text(KeyTypeNAPI::from(self.0.key_type()).into()),
            self.0.read_only(),
            self.0.data().to_string(Hex),
            None,
            self.get_contract_bounds().clone().as_ref(),
        )
    }

    #[napi(js_name = "validatePrivateKey")]
    pub fn validate_private_key(
        &self,
        js_private_key: Either<DynamicValue, &PrivateKeyNAPI>,
        js_network: DynamicValue,
    ) -> Result<bool, napi::Error> {
        let public_key: IdentityPublicKeyNAPI = IdentityPublicKey::from(self.clone()).into();

        public_key.validate_private_key(js_private_key, js_network)
    }

    #[napi(js_name = "getHash")]
    pub fn get_hash(&self) -> Result<Uint8Array, napi::Error> {
        Ok(self.0.hash().with_js_error()?.to_vec().into())
    }

    #[napi(getter, js_name = "contractBounds")]
    pub fn get_contract_bounds(&self) -> Option<ContractBoundsNAPI> {
        self.0.contract_bounds().map(|bounds| bounds.clone().into())
    }

    #[napi(getter, js_name = "keyId")]
    pub fn get_key_id(&self) -> u32 {
        self.0.id()
    }

    #[napi(getter, js_name = "purpose")]
    pub fn get_purpose(&self) -> String {
        PurposeNAPI::from(self.0.purpose()).into()
    }

    #[napi(getter, js_name = "securityLevel")]
    pub fn get_security_level(&self) -> String {
        SecurityLevelNAPI::from(self.0.security_level()).into()
    }

    #[napi(getter, js_name = "keyType")]
    pub fn get_key_type(&self) -> String {
        KeyTypeNAPI::from(self.0.key_type()).into()
    }

    #[napi(getter, js_name = "readOnly")]
    pub fn get_read_only(&self) -> bool {
        self.0.read_only()
    }

    #[napi(getter, js_name = "data")]
    pub fn get_data(&self) -> Uint8Array {
        self.0.data().to_vec().into()
    }

    #[napi(getter, js_name = "signature")]
    pub fn get_signature(&self) -> Uint8Array {
        self.0.signature().to_vec().into()
    }

    #[napi(setter, js_name = "keyId")]
    pub fn set_key_id(&mut self, key_id: u32) {
        self.0.set_id(key_id)
    }

    #[napi(setter, js_name = "purpose")]
    pub fn set_purpose(&mut self, js_purpose: DynamicValue) -> Result<(), napi::Error> {
        self.0
            .set_purpose(PurposeNAPI::try_from(js_purpose)?.into());
        Ok(())
    }

    #[napi(setter, js_name = "securityLevel")]
    pub fn set_security_level(
        &mut self,
        js_security_level: DynamicValue,
    ) -> Result<(), napi::Error> {
        self.0
            .set_security_level(SecurityLevelNAPI::try_from(js_security_level)?.into());

        Ok(())
    }

    #[napi(setter, js_name = "keyType")]
    pub fn set_key_type(&mut self, key_type: DynamicValue) -> Result<(), napi::Error> {
        self.0.set_type(KeyTypeNAPI::try_from(key_type)?.into());

        Ok(())
    }

    #[napi(setter, js_name = "readOnly")]
    pub fn set_read_only(&mut self, read_only: bool) {
        self.0.set_read_only(read_only)
    }

    #[napi(setter, js_name = "data")]
    pub fn set_data(&mut self, binary_data: Uint8Array) {
        let data = BinaryData::from(binary_data.to_vec());
        self.0.set_data(data)
    }

    #[napi(setter, js_name = "signature")]
    pub fn set_signature(&mut self, binary_data: Uint8Array) {
        let signature = BinaryData::from(binary_data.to_vec());
        self.0.set_signature(signature)
    }

    #[napi(setter, js_name = "contractBounds")]
    pub fn set_contract_bounds(&mut self, js_bounds: Option<&ContractBoundsNAPI>) {
        self.0
            .set_contract_bounds(js_bounds.map(|bounds| bounds.clone().into()));
    }
}
