use dpp::dashcore::secp256k1::hashes::hex::{Case, DisplayHex};
use dpp::platform_value::string_encoding::{decode, encode};
use dpp::serialization::{PlatformDeserializableUntrusted, PlatformSerializable};
use dpp::{
    identity::{
        KeyType, Purpose,
        hash::IdentityPublicKeyHashMethodsV0,
        identity_public_key::{
            accessors::v0::{IdentityPublicKeyGettersV0, IdentityPublicKeySettersV0},
            accessors::v1::IdentityPublicKeyGettersV1,
            v0::IdentityPublicKeyV0,
            v1::IdentityPublicKeyV1,
        },
    },
    platform_value::{BinaryData, string_encoding::Encoding},
    prelude::IdentityPublicKey,
};
use napi::bindgen_prelude::Uint8Array;
use napi::{Either, Status};
use napi_derive::napi;

use crate::contract_bounds::ContractBoundsNAPI;
use crate::dynamic_value::TryToU64;
use crate::private_key::PrivateKeyNAPI;
use crate::{
    dynamic_value::{BigIntString, DynamicValue},
    enums::{
        key_type::KeyTypeNAPI, network::NetworkNAPI, purpose::PurposeNAPI,
        security_level::SecurityLevelNAPI,
    },
    utils::WithJsError,
};

#[derive(Clone)]
#[napi(js_name = "IdentityPublicKeyNAPI")]
pub struct IdentityPublicKeyNAPI(IdentityPublicKey);

impl From<IdentityPublicKey> for IdentityPublicKeyNAPI {
    fn from(public_key: IdentityPublicKey) -> Self {
        IdentityPublicKeyNAPI(public_key)
    }
}

impl From<IdentityPublicKeyNAPI> for IdentityPublicKey {
    fn from(public_key: IdentityPublicKeyNAPI) -> Self {
        public_key.0
    }
}

#[napi]
impl IdentityPublicKeyNAPI {
    #[napi(constructor)]
    pub fn new(
        id: u32,
        js_purpose: &DynamicValue,
        js_security_level: &DynamicValue,
        js_key_type: &DynamicValue,
        read_only: bool,
        binary_data: String,
        js_disabled_at: Option<BigIntString>,
        contract_bounds: Option<&ContractBoundsNAPI>,
        js_total_budget: Option<BigIntString>,
        js_expires_at: Option<BigIntString>,
    ) -> Result<Self, napi::Error> {
        let purpose: PurposeNAPI = js_purpose.try_into()?;
        let security_level: SecurityLevelNAPI = js_security_level.try_into()?;
        let key_type: KeyTypeNAPI = js_key_type.try_into()?;
        let disabled_at = js_disabled_at.map(|val| val.try_to_u64()).transpose()?;
        let total_budget = js_total_budget.map(|val| val.try_to_u64()).transpose()?;
        let expires_at = js_expires_at.map(|val| val.try_to_u64()).transpose()?;

        let mut public_key = IdentityPublicKeyNAPI(IdentityPublicKey::from(IdentityPublicKeyV0 {
            id,
            purpose: purpose.into(),
            security_level: security_level.into(),
            contract_bounds: contract_bounds.map(|bounds| bounds.clone().into()),
            key_type: key_type.into(),
            read_only,
            data: BinaryData::from_string(binary_data.as_str(), Encoding::Hex)
                .map_err(|err| napi::Error::new(Status::GenericFailure, err.to_string()))?,
            disabled_at,
        }));

        if total_budget.is_some() || expires_at.is_some() {
            public_key.set_limits(total_budget, expires_at);
        }

        Ok(public_key)
    }

    #[napi(js_name = "validatePrivateKey")]
    pub fn validate_private_key(
        &self,
        js_private_key: Either<&DynamicValue, &PrivateKeyNAPI>,
        js_network: &DynamicValue,
    ) -> Result<bool, napi::Error> {
        let network = NetworkNAPI::try_from(js_network)?;

        let private_key = PrivateKeyNAPI::from_js_value(js_private_key, js_network)?;

        let mut private_key_bytes = [0u8; 32];
        let len = private_key.get_bytes().len().min(32);
        private_key_bytes[..len].copy_from_slice(&private_key.get_bytes()[..len]);

        let network = network.into();

        self.0
            .validate_private_key_bytes(&private_key_bytes, network)
            .with_js_error()
    }

    #[napi(getter, js_name = "keyId")]
    pub fn get_key_id(&self) -> u32 {
        self.0.id()
    }

    #[napi(getter, js_name = "purpose")]
    pub fn get_purpose(&self) -> String {
        PurposeNAPI::from(self.0.purpose()).into()
    }

    #[napi(getter, js_name = "purposeNumber")]
    pub fn get_purpose_number(&self) -> PurposeNAPI {
        PurposeNAPI::from(self.0.purpose())
    }

    #[napi(getter, js_name = "securityLevel")]
    pub fn get_security_level(&self) -> String {
        SecurityLevelNAPI::from(self.0.security_level()).into()
    }

    #[napi(getter, js_name = "securityLevelNumber")]
    pub fn get_security_level_number(&self) -> SecurityLevelNAPI {
        SecurityLevelNAPI::from(self.0.security_level())
    }

    #[napi(getter, js_name = "keyType")]
    pub fn get_key_type(&self) -> String {
        KeyTypeNAPI::from(self.0.key_type()).into()
    }

    #[napi(getter, js_name = "keyTypeNumber")]
    pub fn get_key_type_number(&self) -> KeyTypeNAPI {
        KeyTypeNAPI::from(self.0.key_type())
    }

    #[napi(getter, js_name = "readOnly")]
    pub fn get_read_only(&self) -> bool {
        self.0.read_only()
    }

    #[napi(getter, js_name = "data")]
    pub fn get_data(&self) -> String {
        self.0.data().to_string(Encoding::Hex)
    }

    #[napi(getter, js_name = "disabledAt")]
    pub fn get_disabled_at(&self) -> Option<BigIntString> {
        self.0.disabled_at().map(|num| BigIntString::from_u64(num))
    }

    #[napi(getter, js_name = "contractBounds")]
    pub fn get_contract_bounds(&self) -> Option<ContractBoundsNAPI> {
        self.0.contract_bounds().map(|bounds| bounds.clone().into())
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

    #[napi(js_name = "isExpiredAt")]
    pub fn is_expired_at(&self, time_ms: BigIntString) -> Result<bool, napi::Error> {
        Ok(self.0.is_expired_at(time_ms.try_to_u64()?))
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

    #[napi(setter, js_name = "keyId")]
    pub fn set_key_id(&mut self, key_id: u32) {
        self.0.set_id(key_id)
    }

    #[napi(setter, js_name = "purpose")]
    pub fn set_purpose(&mut self, purpose: &DynamicValue) -> Result<(), napi::Error> {
        Ok(self
            .0
            .set_purpose(Purpose::from(PurposeNAPI::try_from(purpose)?)))
    }

    #[napi(setter, js_name = "purposeNumber")]
    pub fn set_purpose_number(&mut self, purpose: u32) -> Result<(), napi::Error> {
        self.0
            .set_purpose(PurposeNAPI::try_from(purpose as u64)?.into());

        Ok(())
    }

    #[napi(setter, js_name = "securityLevel")]
    pub fn set_security_level(&mut self, security_level: &DynamicValue) -> Result<(), napi::Error> {
        Ok(self
            .0
            .set_security_level(SecurityLevelNAPI::try_from(security_level)?.into()))
    }

    #[napi(setter, js_name = "securityLevelNumber")]
    pub fn set_security_level_number(&mut self, security_level: u32) -> Result<(), napi::Error> {
        self.0
            .set_security_level(SecurityLevelNAPI::try_from(security_level as u64)?.into());

        Ok(())
    }

    #[napi(setter, js_name = "keyType")]
    pub fn set_key_type(&mut self, key_type: &DynamicValue) -> Result<(), napi::Error> {
        Ok(self
            .0
            .set_key_type(KeyType::from(KeyTypeNAPI::try_from(key_type)?)))
    }

    #[napi(setter, js_name = "keyTypeNumber")]
    pub fn set_key_type_number(&mut self, key_type: u32) -> Result<(), napi::Error> {
        self.0
            .set_key_type(KeyTypeNAPI::try_from(key_type as u64)?.into());

        Ok(())
    }

    #[napi(setter, js_name = "readOnly")]
    pub fn set_read_only(&mut self, read_only: bool) {
        self.0.set_read_only(read_only)
    }

    #[napi(setter, js_name = "data")]
    pub fn set_data(&mut self, binary_data: String) -> Result<(), napi::Error> {
        let data = BinaryData::from_string(binary_data.as_str(), Encoding::Hex)
            .map_err(|err| napi::Error::new(Status::GenericFailure, err.to_string()))?;

        Ok(self.0.set_data(data))
    }

    #[napi(setter, js_name = "disabledAt")]
    pub fn set_disabled_at(&mut self, disabled_at: BigIntString) -> Result<(), napi::Error> {
        self.0.set_disabled_at(disabled_at.try_to_u64()?);
        Ok(())
    }

    #[napi(setter, js_name = "contractBounds")]
    pub fn set_contract_bounds(&mut self, contract_bounds: Option<&ContractBoundsNAPI>) {
        let contract_bounds = contract_bounds.map(|bounds| bounds.clone().into());

        match &mut self.0 {
            IdentityPublicKey::V0(v0) => v0.contract_bounds = contract_bounds,
            IdentityPublicKey::V1(v1) => v1.contract_bounds = contract_bounds,
        }
    }

    #[napi(js_name = "removeDisabledAt")]
    pub fn remove_disabled_at(&mut self) {
        self.0.remove_disabled_at()
    }

    #[napi(js_name = "getPublicKeyHash")]
    pub fn public_key_hash(&self) -> Result<String, napi::Error> {
        let hash = self
            .0
            .public_key_hash()
            .with_js_error()
            .map(|slice| slice.to_vec())?
            .to_hex_string(Case::Lower);

        Ok(hash)
    }

    #[napi(js_name = "isMaster")]
    pub fn is_master(&self) -> bool {
        self.0.is_master()
    }

    #[napi(js_name = "bytes")]
    pub fn to_byes(&self) -> Result<Uint8Array, napi::Error> {
        Ok(self.0.serialize_to_bytes().with_js_error()?.into())
    }

    #[napi(js_name = "hex")]
    pub fn to_hex(&self) -> Result<String, napi::Error> {
        Ok(encode(
            self.0.serialize_to_bytes().with_js_error()?.as_slice(),
            Encoding::Hex,
        ))
    }

    #[napi(js_name = "base64")]
    pub fn to_base64(&self) -> Result<String, napi::Error> {
        Ok(encode(
            self.0.serialize_to_bytes().with_js_error()?.as_slice(),
            Encoding::Base64,
        ))
    }

    #[napi(js_name = "fromBytes")]
    pub fn from_bytes(bytes: Uint8Array) -> Result<IdentityPublicKeyNAPI, napi::Error> {
        Ok(IdentityPublicKeyNAPI(
            IdentityPublicKey::deserialize_from_bytes_untrusted(bytes.to_vec().as_slice())
                .with_js_error()?,
        ))
    }

    #[napi(js_name = "fromHex")]
    pub fn from_hex(hex: String) -> Result<IdentityPublicKeyNAPI, napi::Error> {
        let bytes = decode(&hex, Encoding::Hex)
            .map_err(|err| napi::Error::new(Status::GenericFailure, err.to_string()))?;

        let public_key = IdentityPublicKey::deserialize_from_bytes_untrusted(bytes.as_slice())
            .with_js_error()?;

        Ok(IdentityPublicKeyNAPI(public_key))
    }

    #[napi(js_name = "fromBase64")]
    pub fn from_base64(base64: String) -> Result<IdentityPublicKeyNAPI, napi::Error> {
        let bytes = decode(&base64, Encoding::Base64)
            .map_err(|err| napi::Error::new(Status::GenericFailure, err.to_string()))?;

        let public_key = IdentityPublicKey::deserialize_from_bytes_untrusted(bytes.as_slice())
            .with_js_error()?;

        Ok(IdentityPublicKeyNAPI(public_key))
    }
}

impl IdentityPublicKeyNAPI {
    /// Budget and expiry only exist on V1 keys, so setting either upgrades a V0 key
    fn set_limits(&mut self, total_budget: Option<u64>, expires_at: Option<u64>) {
        match &mut self.0 {
            IdentityPublicKey::V0(v0) => {
                if total_budget.is_some() || expires_at.is_some() {
                    self.0 = IdentityPublicKey::V1(IdentityPublicKeyV1::from_v0_with_limits(
                        v0.clone(),
                        total_budget,
                        expires_at,
                    ));
                }
            }
            IdentityPublicKey::V1(v1) => {
                v1.total_budget = total_budget;
                v1.expires_at = expires_at;
            }
        }
    }
}
