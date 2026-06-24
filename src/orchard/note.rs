use dpp::address_funds::OrchardAddress;
use grovedb_commitment_tree::{
    ExtractedNoteCommitment, Note, NoteValue, PaymentAddress, RandomSeed, Rho,
};
use napi::bindgen_prelude::Uint8Array;
use napi_derive::napi;

use crate::{
    dynamic_value::{BigIntString, TryToU64},
    orchard::orchard_address::OrchardAddressNAPI,
};

/// Reconstructs an Orchard [`Note`] from its parts, validating `rho`/`rseed`
/// and the resulting note commitment.
fn build_note(
    recipient: PaymentAddress,
    value: u64,
    rho_bytes: [u8; 32],
    rseed_bytes: [u8; 32],
) -> Result<Note, napi::Error> {
    let rho = Option::from(Rho::from_bytes(&rho_bytes))
        .ok_or_else(|| napi::Error::new(napi::Status::InvalidArg, "rho is not a valid value"))?;

    let rseed = Option::from(RandomSeed::from_bytes(rseed_bytes, &rho)).ok_or_else(|| {
        napi::Error::new(
            napi::Status::InvalidArg,
            "rseed is not valid for the given rho",
        )
    })?;

    Option::from(Note::from_parts(
        recipient,
        NoteValue::from_raw(value),
        rho,
        rseed,
    ))
    .ok_or_else(|| {
        napi::Error::new(
            napi::Status::InvalidArg,
            "note parameters do not produce a valid note commitment",
        )
    })
}

fn bytes32(value: &Uint8Array, name: &str) -> Result<[u8; 32], napi::Error> {
    if value.len() != 32 {
        return Err(napi::Error::new(
            napi::Status::InvalidArg,
            format!("{name} must be 32 bytes length"),
        ));
    }
    Ok(value.to_vec().as_slice().try_into().unwrap())
}

/// A shielded Orchard note: the funds received by an address, defined by its
/// owner address, value, `rho`, and `rseed`.
#[napi(js_name = "NoteNAPI")]
#[derive(Clone)]
pub struct NoteNAPI(Note);

impl From<Note> for NoteNAPI {
    fn from(value: Note) -> Self {
        NoteNAPI(value)
    }
}

impl From<NoteNAPI> for Note {
    fn from(value: NoteNAPI) -> Self {
        value.0
    }
}

#[napi]
impl NoteNAPI {
    #[napi(constructor)]
    pub fn new(
        js_address: &OrchardAddressNAPI,
        js_value: BigIntString,
        js_rho: Uint8Array,
        js_rseed: Uint8Array,
    ) -> Result<Self, napi::Error> {
        let recipient = OrchardAddress::from(js_address).into_inner();
        let note = build_note(
            recipient,
            js_value.try_to_u64()?,
            bytes32(&js_rho, "rho")?,
            bytes32(&js_rseed, "rseed")?,
        )?;

        Ok(NoteNAPI(note))
    }

    #[napi(getter, js_name = "address")]
    pub fn address(&self) -> OrchardAddressNAPI {
        OrchardAddressNAPI::from(OrchardAddress::from(self.0.recipient()))
    }

    #[napi(getter, js_name = "value")]
    pub fn value(&self) -> BigIntString {
        BigIntString::from_u64(self.0.value().inner())
    }

    #[napi(getter, js_name = "rho")]
    pub fn rho(&self) -> Uint8Array {
        Uint8Array::from(self.0.rho().to_bytes().to_vec())
    }

    #[napi(getter, js_name = "rseed")]
    pub fn rseed(&self) -> Uint8Array {
        Uint8Array::from(self.0.rseed().as_bytes().to_vec())
    }

    /// The extracted note commitment (`cmx`, 32 bytes) — the leaf this note
    /// occupies in the note commitment tree. Append this to a
    /// `CommitmentTreeNAPI` to later produce the note's spend witness.
    #[napi(getter, js_name = "cmx")]
    pub fn cmx(&self) -> Uint8Array {
        let cmx = ExtractedNoteCommitment::from(self.0.commitment());
        Uint8Array::from(cmx.to_bytes().to_vec())
    }

    #[napi(setter, js_name = "address")]
    pub fn set_address(&mut self, js_address: &OrchardAddressNAPI) -> Result<(), napi::Error> {
        let recipient = OrchardAddress::from(js_address).into_inner();
        self.0 = build_note(
            recipient,
            self.0.value().inner(),
            self.0.rho().to_bytes(),
            *self.0.rseed().as_bytes(),
        )?;

        Ok(())
    }

    #[napi(setter, js_name = "value")]
    pub fn set_value(&mut self, js_value: BigIntString) -> Result<(), napi::Error> {
        self.0 = build_note(
            self.0.recipient(),
            js_value.try_to_u64()?,
            self.0.rho().to_bytes(),
            *self.0.rseed().as_bytes(),
        )?;

        Ok(())
    }

    #[napi(setter, js_name = "rho")]
    pub fn set_rho(&mut self, js_rho: Uint8Array) -> Result<(), napi::Error> {
        self.0 = build_note(
            self.0.recipient(),
            self.0.value().inner(),
            bytes32(&js_rho, "rho")?,
            *self.0.rseed().as_bytes(),
        )?;

        Ok(())
    }

    #[napi(setter, js_name = "rseed")]
    pub fn set_rseed(&mut self, js_rseed: Uint8Array) -> Result<(), napi::Error> {
        self.0 = build_note(
            self.0.recipient(),
            self.0.value().inner(),
            self.0.rho().to_bytes(),
            bytes32(&js_rseed, "rseed")?,
        )?;

        Ok(())
    }
}
