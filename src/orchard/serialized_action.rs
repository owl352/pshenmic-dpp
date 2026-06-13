use dpp::shielded::SerializedAction;
use napi::bindgen_prelude::Uint8Array;
use napi_derive::napi;

#[derive(Debug, Clone)]
#[napi(js_name = "SerializedActionNAPI")]
pub struct SerializedActionNAPI(SerializedAction);

impl From<SerializedAction> for SerializedActionNAPI {
    fn from(value: SerializedAction) -> Self {
        Self(value)
    }
}

impl From<SerializedActionNAPI> for SerializedAction {
    fn from(value: SerializedActionNAPI) -> Self {
        value.0
    }
}

#[napi]
impl SerializedActionNAPI {
    #[napi(constructor)]
    pub fn new(
        js_nullifier: Uint8Array,
        js_rk: Uint8Array,
        js_cmx: Uint8Array,
        js_encrypted_note: Uint8Array,
        js_cv_net: Uint8Array,
        js_spend_auth_sig: Uint8Array,
    ) -> Result<Self, napi::Error> {
        if js_nullifier.len() != 32 {
            return Err(napi::Error::new(
                napi::Status::InvalidArg,
                "nullifier must be 32 bytes length",
            ));
        }

        if js_rk.len() != 32 {
            return Err(napi::Error::new(
                napi::Status::InvalidArg,
                "rk must be 32 bytes length",
            ));
        }

        if js_cmx.len() != 32 {
            return Err(napi::Error::new(
                napi::Status::InvalidArg,
                "cmx must be 32 bytes length",
            ));
        }

        if js_cv_net.len() != 32 {
            return Err(napi::Error::new(
                napi::Status::InvalidArg,
                "cv_net must be 32 bytes length",
            ));
        }

        if js_spend_auth_sig.len() != 64 {
            return Err(napi::Error::new(
                napi::Status::InvalidArg,
                "spend_auth_sig must be 64 bytes length",
            ));
        }

        Ok(Self(SerializedAction {
            nullifier: js_nullifier.to_vec().try_into().unwrap(),
            rk: js_rk.to_vec().try_into().unwrap(),
            cmx: js_cmx.to_vec().try_into().unwrap(),
            encrypted_note: js_encrypted_note.to_vec(),
            cv_net: js_cv_net.to_vec().try_into().unwrap(),
            spend_auth_sig: js_spend_auth_sig.to_vec().try_into().unwrap(),
        }))
    }

    #[napi(getter, js_name = "nullifier")]
    pub fn nullifier(&self) -> Uint8Array {
        self.0.nullifier.into()
    }

    #[napi(getter, js_name = "rk")]
    pub fn rk(&self) -> Uint8Array {
        self.0.rk.into()
    }

    #[napi(getter, js_name = "cmx")]
    pub fn cmx(&self) -> Uint8Array {
        self.0.cmx.into()
    }

    #[napi(getter, js_name = "encrypted_note")]
    pub fn encrypted_note(&self) -> Uint8Array {
        self.0.encrypted_note.clone().into()
    }

    #[napi(getter, js_name = "cvNet")]
    pub fn cv_net(&self) -> Uint8Array {
        self.0.cv_net.into()
    }

    #[napi(getter, js_name = "spendAuthSig")]
    pub fn spend_auth_sig(&self) -> Uint8Array {
        self.0.spend_auth_sig.into()
    }

    #[napi(setter, js_name = "nullifier")]
    pub fn set_nullifier(&mut self, js_nullifier: Uint8Array) -> Result<(), napi::Error> {
        if js_nullifier.len() != 32 {
            return Err(napi::Error::new(
                napi::Status::InvalidArg,
                "nullifier must be 32 bytes length",
            ));
        }

        self.0.nullifier = js_nullifier.to_vec().try_into().unwrap();

        Ok(())
    }

    #[napi(setter, js_name = "rk")]
    pub fn set_rk(&mut self, js_rk: Uint8Array) -> Result<(), napi::Error> {
        if js_rk.len() != 32 {
            return Err(napi::Error::new(
                napi::Status::InvalidArg,
                "rk must be 32 bytes length",
            ));
        }

        self.0.rk = js_rk.to_vec().try_into().unwrap();

        Ok(())
    }

    #[napi(setter, js_name = "cmx")]
    pub fn set_cmx(&mut self, js_cmx: Uint8Array) -> Result<(), napi::Error> {
        if js_cmx.len() != 32 {
            return Err(napi::Error::new(
                napi::Status::InvalidArg,
                "cmx must be 32 bytes length",
            ));
        }

        self.0.cmx = js_cmx.to_vec().try_into().unwrap();

        Ok(())
    }

    #[napi(setter, js_name = "encrypted_note")]
    pub fn set_encrypted_note(&mut self, js_encrypted_note: Uint8Array) {
        self.0.encrypted_note = js_encrypted_note.to_vec();
    }

    #[napi(setter, js_name = "cvNet")]
    pub fn set_cv_net(&mut self, js_cv_net: Uint8Array) -> Result<(), napi::Error> {
        if js_cv_net.len() != 32 {
            return Err(napi::Error::new(
                napi::Status::InvalidArg,
                "cv_net must be 32 bytes length",
            ));
        }

        self.0.cv_net = js_cv_net.to_vec().try_into().unwrap();

        Ok(())
    }

    #[napi(setter, js_name = "spendAuthSig")]
    pub fn set_spend_auth_sig(&mut self, js_spend_auth_sig: Uint8Array) -> Result<(), napi::Error> {
        if js_spend_auth_sig.len() != 64 {
            return Err(napi::Error::new(
                napi::Status::InvalidArg,
                "spend_auth_sig must be 64 bytes length",
            ));
        }

        self.0.spend_auth_sig = js_spend_auth_sig.to_vec().try_into().unwrap();

        Ok(())
    }
}
