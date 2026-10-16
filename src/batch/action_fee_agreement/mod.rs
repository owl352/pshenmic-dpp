use dpp::data_contract::document_type::accessors::DocumentTypeV2Getters;
use dpp::data_contract::document_type::action_fees::agreement::v0::DocumentActionFeeAgreementV0;
use dpp::data_contract::document_type::action_fees::agreement::{
    AgreedFeeMultiplier, DocumentActionFeeAgreement,
};
use dpp::data_contract::document_type::action_fees::{ActionFeePricing, DocumentActionFee};
use dpp::state_transition::batch_transition::batched_transition::document_transition_action_type::DocumentTransitionActionType;
use napi_derive::napi;

use crate::data_contract::DataContractNAPI;
use crate::dynamic_value::{BigIntString, DynamicValue, TryToU64};
use crate::enums::batch_type::BatchTypeNAPI;

/// The epoch fee multiplier a document transition agrees to pay its action fee at,
/// and how much it may grow before the transition executes
#[derive(Debug, Clone, Copy, PartialEq)]
#[napi(js_name = "AgreedFeeMultiplierNAPI")]
pub struct AgreedFeeMultiplierNAPI(AgreedFeeMultiplier);

impl From<AgreedFeeMultiplier> for AgreedFeeMultiplierNAPI {
    fn from(value: AgreedFeeMultiplier) -> Self {
        Self(value)
    }
}

impl From<AgreedFeeMultiplierNAPI> for AgreedFeeMultiplier {
    fn from(value: AgreedFeeMultiplierNAPI) -> Self {
        value.0
    }
}

#[napi]
impl AgreedFeeMultiplierNAPI {
    #[napi(constructor)]
    pub fn new(
        known_permille: BigIntString,
        increase_tolerance_percent: u16,
    ) -> Result<AgreedFeeMultiplierNAPI, napi::Error> {
        Ok(AgreedFeeMultiplierNAPI(AgreedFeeMultiplier {
            known_permille: known_permille.try_to_u64()?,
            increase_tolerance_percent,
        }))
    }

    #[napi(getter, js_name = "knownPermille")]
    pub fn get_known_permille(&self) -> BigIntString {
        BigIntString::from_u64(self.0.known_permille)
    }

    #[napi(getter, js_name = "increaseTolerancePercent")]
    pub fn get_increase_tolerance_percent(&self) -> u16 {
        self.0.increase_tolerance_percent
    }

    #[napi(setter, js_name = "knownPermille")]
    pub fn set_known_permille(&mut self, known_permille: BigIntString) -> Result<(), napi::Error> {
        self.0.known_permille = known_permille.try_to_u64()?;
        Ok(())
    }

    #[napi(setter, js_name = "increaseTolerancePercent")]
    pub fn set_increase_tolerance_percent(&mut self, increase_tolerance_percent: u16) {
        self.0.increase_tolerance_percent = increase_tolerance_percent
    }

    /// Whether the current epoch fee multiplier (permille) is within the agreed tolerance
    #[napi(js_name = "tolerates")]
    pub fn tolerates(&self, current_permille: BigIntString) -> Result<bool, napi::Error> {
        Ok(self.0.tolerates(current_permille.try_to_u64()?))
    }
}

/// The action fee a document transition agrees to pay to the contract fee pots
#[derive(Debug, Clone, Copy, PartialEq)]
#[napi(js_name = "DocumentActionFeeAgreementNAPI")]
pub struct DocumentActionFeeAgreementNAPI(DocumentActionFeeAgreement);

impl From<DocumentActionFeeAgreement> for DocumentActionFeeAgreementNAPI {
    fn from(value: DocumentActionFeeAgreement) -> Self {
        Self(value)
    }
}

impl From<DocumentActionFeeAgreementNAPI> for DocumentActionFeeAgreement {
    fn from(value: DocumentActionFeeAgreementNAPI) -> Self {
        value.0
    }
}

fn declared_action_fee(
    data_contract: &DataContractNAPI,
    document_type_name: String,
    js_action: &DynamicValue,
) -> Result<Option<(ActionFeePricing, DocumentActionFee)>, napi::Error> {
    let action: DocumentTransitionActionType = BatchTypeNAPI::try_from(js_action)?.into();
    let document_type = data_contract
        .get_document_type_ref_by_name(document_type_name)
        .map_err(|e| napi::Error::new(napi::Status::InvalidArg, e.to_string()))?;

    Ok(document_type
        .action_fees()
        .and_then(|fees| fees.action_fee(action).map(|fee| (fees.pricing(), fee))))
}

#[napi]
impl DocumentActionFeeAgreementNAPI {
    /// A fee multiplier makes the agreement priced by the epoch fee multiplier, none makes it fixed
    #[napi(constructor)]
    pub fn new(
        owner: BigIntString,
        moderators: BigIntString,
        fee_multiplier: Option<&AgreedFeeMultiplierNAPI>,
    ) -> Result<DocumentActionFeeAgreementNAPI, napi::Error> {
        Ok(DocumentActionFeeAgreementNAPI(
            DocumentActionFeeAgreementV0 {
                owner: owner.try_to_u64()?,
                moderators: moderators.try_to_u64()?,
                fee_multiplier: fee_multiplier.map(|m| m.0),
            }
            .into(),
        ))
    }

    /// The agreement to the fee the document type declares for the action,
    /// or undefined when the action charges no fee
    #[napi(js_name = "forDocumentTypeAction")]
    pub fn for_document_type_action(
        data_contract: &DataContractNAPI,
        document_type_name: String,
        js_action: &DynamicValue,
        fee_multiplier: &AgreedFeeMultiplierNAPI,
    ) -> Result<Option<DocumentActionFeeAgreementNAPI>, napi::Error> {
        Ok(
            declared_action_fee(data_contract, document_type_name, js_action)?.map(
                |(pricing, fee)| {
                    DocumentActionFeeAgreementNAPI(DocumentActionFeeAgreement::for_declared_fee(
                        pricing,
                        fee,
                        fee_multiplier.0,
                    ))
                },
            ),
        )
    }

    #[napi(getter, js_name = "owner")]
    pub fn get_owner(&self) -> BigIntString {
        BigIntString::from_u64(self.0.owner())
    }

    #[napi(getter, js_name = "moderators")]
    pub fn get_moderators(&self) -> BigIntString {
        BigIntString::from_u64(self.0.moderators())
    }

    #[napi(getter, js_name = "feeMultiplier")]
    pub fn get_fee_multiplier(&self) -> Option<AgreedFeeMultiplierNAPI> {
        self.0.fee_multiplier().map(Into::into)
    }

    /// `feeMultiplier` or `fixed`
    #[napi(getter, js_name = "pricing")]
    pub fn get_pricing(&self) -> String {
        self.0.pricing().as_str().to_string()
    }

    #[napi(setter, js_name = "owner")]
    pub fn set_owner(&mut self, owner: BigIntString) -> Result<(), napi::Error> {
        let DocumentActionFeeAgreement::V0(v0) = &mut self.0;
        v0.owner = owner.try_to_u64()?;
        Ok(())
    }

    #[napi(setter, js_name = "moderators")]
    pub fn set_moderators(&mut self, moderators: BigIntString) -> Result<(), napi::Error> {
        let DocumentActionFeeAgreement::V0(v0) = &mut self.0;
        v0.moderators = moderators.try_to_u64()?;
        Ok(())
    }

    #[napi(setter, js_name = "feeMultiplier")]
    pub fn set_fee_multiplier(&mut self, fee_multiplier: Option<&AgreedFeeMultiplierNAPI>) {
        let DocumentActionFeeAgreement::V0(v0) = &mut self.0;
        v0.fee_multiplier = fee_multiplier.map(|m| m.0);
    }

    /// Checks the agreement the way the network does before executing the transition:
    /// it must match the fee the document type declares for the action (amounts and pricing),
    /// and, when priced by the fee multiplier, tolerate the current epoch fee multiplier.
    /// An action that charges no fee needs no agreement and always passes.
    /// Agreements to an elected moderators discount are checked against the seated charter
    /// on the network and are not covered here.
    #[napi(js_name = "verify")]
    pub fn verify(
        &self,
        data_contract: &DataContractNAPI,
        document_type_name: String,
        js_action: &DynamicValue,
        current_fee_multiplier_permille: Option<BigIntString>,
    ) -> Result<bool, napi::Error> {
        let Some((pricing, fee)) =
            declared_action_fee(data_contract, document_type_name, js_action)?
        else {
            return Ok(true);
        };

        if !self.0.matches_declared(pricing, fee) {
            return Ok(false);
        }

        match (self.0.fee_multiplier(), current_fee_multiplier_permille) {
            (Some(agreed), Some(current)) => Ok(agreed.tolerates(current.try_to_u64()?)),
            _ => Ok(true),
        }
    }
}
