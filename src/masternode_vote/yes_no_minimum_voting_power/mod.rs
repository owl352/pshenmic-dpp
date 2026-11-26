use dpp::voting::vote_polls::yes_no_vote_poll::{VotingPowerRounding, YesNoMinimumVotingPower};
use napi_derive::napi;

/// The least yes plus no voting power a yes/no poll needs to pass: a fixed voting
/// power, or a share of the masternode list's total voting power when the poll
/// closes.
#[derive(Clone)]
#[napi(js_name = "YesNoMinimumVotingPowerNAPI")]
pub struct YesNoMinimumVotingPowerNAPI(YesNoMinimumVotingPower);

impl From<YesNoMinimumVotingPower> for YesNoMinimumVotingPowerNAPI {
    fn from(value: YesNoMinimumVotingPower) -> Self {
        Self(value)
    }
}

impl From<YesNoMinimumVotingPowerNAPI> for YesNoMinimumVotingPower {
    fn from(value: YesNoMinimumVotingPowerNAPI) -> Self {
        value.0
    }
}

#[napi]
impl YesNoMinimumVotingPowerNAPI {
    #[napi(js_name = "Absolute")]
    pub fn absolute(voting_power: u32) -> Self {
        Self(YesNoMinimumVotingPower::Absolute { voting_power })
    }

    #[napi(js_name = "FractionOfTotal")]
    pub fn fraction_of_total(
        numerator: u8,
        denominator: u8,
        rounding: String,
    ) -> Result<Self, napi::Error> {
        Ok(Self(YesNoMinimumVotingPower::FractionOfTotal {
            numerator,
            denominator,
            rounding: parse_rounding(rounding)?,
        }))
    }

    #[napi(getter, js_name = "type")]
    pub fn get_type(&self) -> String {
        match self.0 {
            YesNoMinimumVotingPower::Absolute { .. } => "absolute".to_string(),
            YesNoMinimumVotingPower::FractionOfTotal { .. } => "fractionOfTotal".to_string(),
        }
    }

    #[napi(getter, js_name = "votingPower")]
    pub fn voting_power(&self) -> Option<u32> {
        match self.0 {
            YesNoMinimumVotingPower::Absolute { voting_power } => Some(voting_power),
            YesNoMinimumVotingPower::FractionOfTotal { .. } => None,
        }
    }

    #[napi(getter, js_name = "numerator")]
    pub fn numerator(&self) -> Option<u8> {
        match self.0 {
            YesNoMinimumVotingPower::FractionOfTotal { numerator, .. } => Some(numerator),
            YesNoMinimumVotingPower::Absolute { .. } => None,
        }
    }

    #[napi(getter, js_name = "denominator")]
    pub fn denominator(&self) -> Option<u8> {
        match self.0 {
            YesNoMinimumVotingPower::FractionOfTotal { denominator, .. } => Some(denominator),
            YesNoMinimumVotingPower::Absolute { .. } => None,
        }
    }

    #[napi(getter, js_name = "rounding")]
    pub fn rounding(&self) -> Option<String> {
        match self.0 {
            YesNoMinimumVotingPower::FractionOfTotal { rounding, .. } => {
                Some(rounding_name(rounding).to_string())
            }
            YesNoMinimumVotingPower::Absolute { .. } => None,
        }
    }
}

fn rounding_name(rounding: VotingPowerRounding) -> &'static str {
    match rounding {
        VotingPowerRounding::Down => "down",
        VotingPowerRounding::Up => "up",
        VotingPowerRounding::DownPlusOne => "downPlusOne",
        VotingPowerRounding::UpMinusOne => "upMinusOne",
    }
}

fn parse_rounding(rounding: String) -> Result<VotingPowerRounding, napi::Error> {
    match rounding.to_lowercase().as_str() {
        "down" => Ok(VotingPowerRounding::Down),
        "up" => Ok(VotingPowerRounding::Up),
        "downplusone" => Ok(VotingPowerRounding::DownPlusOne),
        "upminusone" => Ok(VotingPowerRounding::UpMinusOne),
        _ => Err(napi::Error::new(
            napi::Status::InvalidArg,
            format!("unknown voting power rounding: {rounding}"),
        )),
    }
}
