use dpp::prelude::Identifier;
use dpp::tokens::gas_fees_paid_by::GasFeesPaidBy;
use dpp::tokens::token_payment_info::TokenPaymentInfo;
use dpp::tokens::token_payment_info::v0::TokenPaymentInfoV0;
use dpp::tokens::token_payment_info::v0::v0_accessors::TokenPaymentInfoAccessorsV0;
use napi_derive::napi;

use crate::dynamic_value::{BigIntString, DynamicValue, IdentifierLikeNAPI, TryToU64};
use crate::enums::gas_fees_paid_by::GasFeesPaidByNAPI;
use crate::identifier::IdentifierNAPI;

#[derive(Clone)]
#[napi(js_name = "TokenPaymentInfoNAPI")]
pub struct TokenPaymentInfoNAPI(TokenPaymentInfo);

impl From<TokenPaymentInfo> for TokenPaymentInfoNAPI {
    fn from(info: TokenPaymentInfo) -> Self {
        TokenPaymentInfoNAPI(info)
    }
}

impl From<TokenPaymentInfoNAPI> for TokenPaymentInfo {
    fn from(info: TokenPaymentInfoNAPI) -> Self {
        info.0
    }
}

#[napi]
impl TokenPaymentInfoNAPI {
    #[napi(constructor)]
    pub fn new(
        js_payment_token_contract_id: Option<IdentifierLikeNAPI>,
        token_contract_position: u16,
        minimum_token_cost: Option<BigIntString>,
        maximum_token_cost: Option<BigIntString>,
        js_gas_fees_paid_by: &DynamicValue,
    ) -> Result<Self, napi::Error> {
        let payment_token_contract_id: Option<Identifier> = js_payment_token_contract_id
            .map(IdentifierNAPI::try_from)
            .transpose()?
            .map(Into::into);

        let gas_fees_paid_by = match js_gas_fees_paid_by.is_undefined_or_null() {
            false => GasFeesPaidByNAPI::try_from(js_gas_fees_paid_by)?
                .clone()
                .into(),
            true => GasFeesPaidBy::default(),
        };

        Ok(TokenPaymentInfoNAPI(TokenPaymentInfo::V0(
            TokenPaymentInfoV0 {
                payment_token_contract_id,
                token_contract_position,
                minimum_token_cost: minimum_token_cost.map(|n| n.try_to_u64()).transpose()?,
                maximum_token_cost: maximum_token_cost.map(|n| n.try_to_u64()).transpose()?,
                gas_fees_paid_by,
            },
        )))
    }

    #[napi(getter, js_name = "paymentTokenContractId")]
    pub fn payment_token_contract_id(&self) -> Option<IdentifierNAPI> {
        self.0.payment_token_contract_id().map(|id| id.into())
    }

    #[napi(getter, js_name = "tokenContractPosition")]
    pub fn token_contract_position(&self) -> u16 {
        self.0.token_contract_position()
    }

    #[napi(getter, js_name = "minimumTokenCost")]
    pub fn minimum_token_cost(&self) -> Option<BigIntString> {
        self.0.minimum_token_cost().map(BigIntString::from_u64)
    }

    #[napi(getter, js_name = "maximumTokenCost")]
    pub fn maximum_token_cost(&self) -> Option<BigIntString> {
        self.0.maximum_token_cost().map(BigIntString::from_u64)
    }

    #[napi(getter, js_name = "gasFeesPaidBy")]
    pub fn gas_fees_paid_by(&self) -> String {
        GasFeesPaidByNAPI::from(self.0.gas_fees_paid_by()).into()
    }

    #[napi(setter, js_name = "paymentTokenContractId")]
    pub fn set_payment_token_contract_id(
        &mut self,
        js_payment_token_contract_id: Option<IdentifierLikeNAPI>,
    ) -> Result<(), napi::Error> {
        let payment_token_contract_id: Option<Identifier> = js_payment_token_contract_id
            .map(IdentifierNAPI::try_from)
            .transpose()?
            .map(Into::into);

        self.0
            .set_payment_token_contract_id(payment_token_contract_id);

        Ok(())
    }

    #[napi(setter, js_name = "tokenContractPosition")]
    pub fn set_token_contract_position(&mut self, token_contract_position: u16) {
        self.0.set_token_contract_position(token_contract_position)
    }

    #[napi(setter, js_name = "minimumTokenCost")]
    pub fn set_minimum_token_cost(
        &mut self,
        minimum_cost: Option<BigIntString>,
    ) -> Result<(), napi::Error> {
        self.0
            .set_maximum_token_cost(minimum_cost.map(|n| n.try_to_u64()).transpose()?);
        Ok(())
    }

    #[napi(setter, js_name = "maximumTokenCost")]
    pub fn set_maximum_token_cost(
        &mut self,
        maximum_cost: Option<BigIntString>,
    ) -> Result<(), napi::Error> {
        self.0
            .set_maximum_token_cost(maximum_cost.map(|n| n.try_to_u64()).transpose()?);
        Ok(())
    }

    #[napi(setter, js_name = "gasFeesPaidBy")]
    pub fn set_gas_fees_paid_by(
        &mut self,
        js_gas_fees_paid_by: &DynamicValue,
    ) -> Result<(), napi::Error> {
        let gas_fees_paid_by = match js_gas_fees_paid_by.is_undefined_or_null() {
            true => GasFeesPaidBy::default(),
            false => GasFeesPaidByNAPI::try_from(js_gas_fees_paid_by)?.into(),
        };

        self.0.set_gas_fees_paid_by(gas_fees_paid_by);

        Ok(())
    }
}
