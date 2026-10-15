use dpp::identity::IdentityPublicKey;
use dpp::identity::contract_bounds::ContractBounds;
use dpp::platform_value::BinaryData;
use dpp::state_transition::public_key_in_creation::IdentityPublicKeyInCreation;
use dpp::state_transition::public_key_in_creation::accessors::{
    IdentityPublicKeyInCreationV0Getters, IdentityPublicKeyInCreationV0Setters,
    IdentityPublicKeyInCreationV1Getters,
};
use dpp::state_transition::public_key_in_creation::v0::IdentityPublicKeyInCreationV0;
use dpp::state_transition::public_key_in_creation::v1::IdentityPublicKeyInCreationV1;
use napi::Either;
use napi::bindgen_prelude::Uint8Array;
use napi_derive::napi;

use crate::contract_bounds::ContractBoundsNAPI;
use crate::dynamic_value::{BigIntString, DynamicValue, TryToU64};
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
        value.0.into()
    }
}

#[napi]
impl IdentityPublicKeyInCreationNAPI {
    #[napi(constructor)]
    pub fn new(
        id: u32,
        js_purpose: &DynamicValue,
        js_security_level: &DynamicValue,
        js_key_type: &DynamicValue,
        read_only: bool,
        binary_data: Uint8Array,
        signature: Option<Uint8Array>,
        js_contract_bounds: Option<&ContractBoundsNAPI>,
        js_total_budget: Option<BigIntString>,
        js_expires_at: Option<BigIntString>,
    ) -> Result<IdentityPublicKeyInCreationNAPI, napi::Error> {
        let total_budget = js_total_budget.map(|val| val.try_to_u64()).transpose()?;
        let expires_at = js_expires_at.map(|val| val.try_to_u64()).transpose()?;

        let mut public_key = IdentityPublicKeyInCreationNAPI(IdentityPublicKeyInCreation::V0(
            IdentityPublicKeyInCreationV0 {
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
            },
        ));

        if total_budget.is_some() || expires_at.is_some() {
            public_key.set_limits(total_budget, expires_at);
        }

        Ok(public_key)
    }

    #[napi(js_name = toIdentityPublicKey)]
    pub fn to_identity_public_key(&self) -> IdentityPublicKeyNAPI {
        IdentityPublicKey::from(&self.0).into()
    }

    #[napi(getter, js_name = "totalBudget")]
    pub fn get_total_budget(&self) -> Option<BigIntString> {
        self.0.total_budget().map(BigIntString::from_u64)
    }

    #[napi(getter, js_name = "expiresAt")]
    pub fn get_expires_at(&self) -> Option<BigIntString> {
        self.0.expires_at().map(BigIntString::from_u64)
    }

    #[napi(js_name = "hasLimits")]
    pub fn has_limits(&self) -> bool {
        self.0.has_limits()
    }

    #[napi(setter, js_name = "totalBudget")]
    pub fn set_total_budget(
        &mut self,
        total_budget: Option<BigIntString>,
    ) -> Result<(), napi::Error> {
        let total_budget = total_budget.map(|val| val.try_to_u64()).transpose()?;
        self.set_limits(total_budget, self.0.expires_at());
        Ok(())
    }

    #[napi(setter, js_name = "expiresAt")]
    pub fn set_expires_at(&mut self, expires_at: Option<BigIntString>) -> Result<(), napi::Error> {
        let expires_at = expires_at.map(|val| val.try_to_u64()).transpose()?;
        self.set_limits(self.0.total_budget(), expires_at);
        Ok(())
    }

    #[napi(js_name = "validatePrivateKey")]
    pub fn validate_private_key(
        &self,
        js_private_key: Either<&DynamicValue, &PrivateKeyNAPI>,
        js_network: &DynamicValue,
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
    pub fn set_purpose(&mut self, js_purpose: &DynamicValue) -> Result<(), napi::Error> {
        self.0
            .set_purpose(PurposeNAPI::try_from(js_purpose)?.into());
        Ok(())
    }

    #[napi(setter, js_name = "securityLevel")]
    pub fn set_security_level(
        &mut self,
        js_security_level: &DynamicValue,
    ) -> Result<(), napi::Error> {
        self.0
            .set_security_level(SecurityLevelNAPI::try_from(js_security_level)?.into());

        Ok(())
    }

    #[napi(setter, js_name = "keyType")]
    pub fn set_key_type(&mut self, key_type: &DynamicValue) -> Result<(), napi::Error> {
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

impl IdentityPublicKeyInCreationNAPI {
    /// Budget and expiry only exist on V1 keys, so setting either upgrades a V0 key.
    /// The signature does not cover the limits: sign again afterwards
    fn set_limits(&mut self, total_budget: Option<u64>, expires_at: Option<u64>) {
        match &mut self.0 {
            IdentityPublicKeyInCreation::V0(v0) => {
                if total_budget.is_some() || expires_at.is_some() {
                    self.0 = IdentityPublicKeyInCreation::V1(
                        IdentityPublicKeyInCreationV1::from_v0_with_limits(
                            v0.clone(),
                            total_budget,
                            expires_at,
                        ),
                    );
                }
            }
            IdentityPublicKeyInCreation::V1(v1) => {
                v1.total_budget = total_budget;
                v1.expires_at = expires_at;
            }
        }
    }
}
