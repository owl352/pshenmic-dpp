use dpp::data_contract::config::moderation::{
    ContractDocumentRemoval, ContractModerationList, ContractModerationReason, ContractTeamAction,
    ContractWarning,
};
use dpp::data_contract::document_type::action_fees::{ContractFeePot, ContractFeePotLastClaim};
use dpp::group::group_action_status::GroupActionStatus;
use dpp::prelude::{Identifier, TimestampMillis};
use drive::drive::Drive;
use drive::drive::contract::fee_pots::types::ContractFeePotState;
use drive::drive::contract::moderation::types::{
    ContractDocumentRemovalEntry, ContractDocumentRemovalsQuery, ContractDocumentRemovalsSelection,
    ContractModerationEntriesQuery, ContractTeamActionsQuery,
};
use napi::bindgen_prelude::Uint8Array;
use napi_derive::napi;

use crate::dynamic_value::{DynamicValue, IdentifierLikeNAPI};
use crate::enums::contract_fee_pot::ContractFeePotNAPI;
use crate::enums::group_action_status::GroupActionStatusNAPI;
use crate::utils::serde_from_js;
use crate::verify::plain::{
    VerifiedProofNAPI, identifier_from_js, platform_version_from_js, verified, verify_error,
};

#[derive(serde::Serialize)]
#[serde(rename_all = "camelCase")]
pub(crate) struct DocumentRemovalEntry<'a> {
    pub(crate) document_id: Identifier,
    pub(crate) removal: &'a ContractDocumentRemoval,
}

impl<'a> From<&'a ContractDocumentRemovalEntry> for DocumentRemovalEntry<'a> {
    fn from(entry: &'a ContractDocumentRemovalEntry) -> Self {
        DocumentRemovalEntry {
            document_id: entry.document_id,
            removal: &entry.removal,
        }
    }
}

#[derive(serde::Deserialize)]
#[serde(rename_all = "camelCase")]
struct RemovalsSelection {
    #[serde(default)]
    document_ids: Option<Vec<Identifier>>,
    #[serde(default)]
    start_after: Option<Identifier>,
    #[serde(default)]
    limit: Option<u16>,
}

/// The records moderators' document deletions left under a contract, for one document type.
/// The selection is `{ documentIds }` or `{ startAfter?, limit }`
#[napi(js_name = "verifyContractDocumentRemovalsProof")]
pub fn verify_contract_document_removals(
    proof: Uint8Array,
    js_contract_id: IdentifierLikeNAPI,
    document_type_name: String,
    js_selection: &DynamicValue,
    verify_subset_of_proof: bool,
    js_platform_version: &DynamicValue,
) -> Result<VerifiedProofNAPI, napi::Error> {
    let contract_id = identifier_from_js(js_contract_id)?;
    let platform_version = platform_version_from_js(js_platform_version)?;

    let selection: RemovalsSelection = serde_from_js(js_selection)?;
    let selection = match selection.document_ids {
        Some(document_ids) => ContractDocumentRemovalsSelection::DocumentIds(document_ids),
        None => ContractDocumentRemovalsSelection::Page {
            start_after: selection.start_after,
            limit: selection.limit.ok_or_else(|| {
                napi::Error::new(
                    napi::Status::InvalidArg,
                    "selection needs documentIds or a limit",
                )
            })?,
        },
    };

    let (root_hash, entries) = Drive::verify_contract_document_removals(
        &proof,
        contract_id,
        &ContractDocumentRemovalsQuery {
            document_type_name,
            selection,
        },
        verify_subset_of_proof,
        &platform_version,
    )
    .map_err(verify_error)?;

    let entries: Vec<DocumentRemovalEntry> = entries.iter().map(Into::into).collect();

    verified(root_hash, &entries)
}

#[derive(serde::Serialize)]
#[serde(rename_all = "camelCase")]
struct FeePotState<'a> {
    credits: u64,
    last_claim: Option<&'a ContractFeePotLastClaim>,
}

impl<'a> From<&'a ContractFeePotState> for FeePotState<'a> {
    fn from(state: &'a ContractFeePotState) -> Self {
        FeePotState {
            credits: state.credits,
            last_claim: state.last_claim.as_ref(),
        }
    }
}

#[derive(serde::Serialize)]
struct FeePots<'a> {
    owner: FeePotState<'a>,
    moderators: FeePotState<'a>,
}

/// The credits in a contract's fee pots and their last claims
#[napi(js_name = "verifyContractFeePotsProof")]
pub fn verify_contract_fee_pots(
    proof: Uint8Array,
    js_contract_id: IdentifierLikeNAPI,
    js_pots: Vec<&DynamicValue>,
    verify_subset_of_proof: bool,
    js_platform_version: &DynamicValue,
) -> Result<VerifiedProofNAPI, napi::Error> {
    let contract_id = identifier_from_js(js_contract_id)?;
    let platform_version = platform_version_from_js(js_platform_version)?;
    let pots = js_pots
        .into_iter()
        .map(|pot| ContractFeePotNAPI::try_from(pot).map(ContractFeePot::from))
        .collect::<Result<Vec<ContractFeePot>, napi::Error>>()?;

    let (root_hash, fee_pots) = Drive::verify_contract_fee_pots(
        &proof,
        contract_id,
        &pots,
        verify_subset_of_proof,
        &platform_version,
    )
    .map_err(verify_error)?;

    verified(
        root_hash,
        &FeePots {
            owner: (&fee_pots.owner).into(),
            moderators: (&fee_pots.moderators).into(),
        },
    )
}

#[derive(serde::Serialize)]
#[serde(rename_all = "camelCase")]
struct ModeratorActionCount {
    moderator_id: Identifier,
    action_count: u32,
}

/// How many moderation actions each moderator of a contract took
#[napi(js_name = "verifyContractModerationActionCountsProof")]
pub fn verify_contract_moderation_action_counts(
    proof: Uint8Array,
    js_contract_id: IdentifierLikeNAPI,
    verify_subset_of_proof: bool,
    js_platform_version: &DynamicValue,
) -> Result<VerifiedProofNAPI, napi::Error> {
    let contract_id = identifier_from_js(js_contract_id)?;
    let platform_version = platform_version_from_js(js_platform_version)?;

    let (root_hash, counts) = Drive::verify_contract_moderation_action_counts(
        &proof,
        contract_id,
        verify_subset_of_proof,
        &platform_version,
    )
    .map_err(verify_error)?;

    let counts: Vec<ModeratorActionCount> = counts
        .into_iter()
        .map(|(moderator_id, action_count)| ModeratorActionCount {
            moderator_id,
            action_count,
        })
        .collect();

    verified(root_hash, &counts)
}

#[derive(serde::Serialize)]
#[serde(rename_all = "camelCase")]
struct ModerationEntry<'a> {
    identity_id: Identifier,
    until: Option<TimestampMillis>,
    reason: &'a ContractModerationReason,
    warnings: &'a [ContractWarning],
}

/// A page of one of a contract's moderation lists (`banlist`, `suspensions`, `warnings`)
#[napi(js_name = "verifyContractModerationEntriesProof")]
pub fn verify_contract_moderation_entries(
    proof: Uint8Array,
    js_contract_id: IdentifierLikeNAPI,
    js_list: &DynamicValue,
    js_start_after: Option<IdentifierLikeNAPI>,
    limit: u16,
    js_platform_version: &DynamicValue,
) -> Result<VerifiedProofNAPI, napi::Error> {
    let contract_id = identifier_from_js(js_contract_id)?;
    let platform_version = platform_version_from_js(js_platform_version)?;
    let list: ContractModerationList = serde_from_js(js_list)?;
    let start_after = js_start_after.map(identifier_from_js).transpose()?;

    let (root_hash, entries) = Drive::verify_contract_moderation_entries(
        &proof,
        contract_id,
        &ContractModerationEntriesQuery {
            list,
            start_after,
            limit,
        },
        &platform_version,
    )
    .map_err(verify_error)?;

    let entries: Vec<ModerationEntry> = entries
        .iter()
        .map(|entry| ModerationEntry {
            identity_id: entry.identity_id,
            until: entry.until,
            reason: &entry.reason,
            warnings: &entry.warnings,
        })
        .collect();

    verified(root_hash, &entries)
}

/// An identity's status on the requested moderation lists of a contract
#[napi(js_name = "verifyContractModerationStatusProof")]
pub fn verify_contract_moderation_status(
    proof: Uint8Array,
    js_contract_id: IdentifierLikeNAPI,
    js_identity_id: IdentifierLikeNAPI,
    js_lists: &DynamicValue,
    verify_subset_of_proof: bool,
    js_platform_version: &DynamicValue,
) -> Result<VerifiedProofNAPI, napi::Error> {
    let contract_id = identifier_from_js(js_contract_id)?;
    let identity_id = identifier_from_js(js_identity_id)?;
    let platform_version = platform_version_from_js(js_platform_version)?;
    let lists: Vec<ContractModerationList> = serde_from_js(js_lists)?;

    let (root_hash, statuses) = Drive::verify_contract_moderation_status(
        &proof,
        contract_id,
        identity_id,
        &lists,
        verify_subset_of_proof,
        &platform_version,
    )
    .map_err(verify_error)?;

    verified(root_hash, &statuses.0)
}

/// Whether a member's approval of a contract team action is proven, and the action's status
#[napi(js_name = "verifyContractTeamActionSignatureProof")]
pub fn verify_contract_team_action_signature(
    proof: Uint8Array,
    js_contract_id: IdentifierLikeNAPI,
    js_action_id: IdentifierLikeNAPI,
    js_signer_id: IdentifierLikeNAPI,
    verify_subset_of_proof: bool,
    js_platform_version: &DynamicValue,
) -> Result<VerifiedProofNAPI, napi::Error> {
    let platform_version = platform_version_from_js(js_platform_version)?;

    let (root_hash, status) = Drive::verify_contract_team_action_signature(
        &proof,
        identifier_from_js(js_contract_id)?,
        identifier_from_js(js_action_id)?,
        identifier_from_js(js_signer_id)?,
        verify_subset_of_proof,
        &platform_version,
    )
    .map_err(verify_error)?;

    verified(root_hash, &status)
}

/// The members who approved a contract team action
#[napi(js_name = "verifyContractTeamActionSignersProof")]
pub fn verify_contract_team_action_signers(
    proof: Uint8Array,
    js_contract_id: IdentifierLikeNAPI,
    js_status: &DynamicValue,
    js_action_id: IdentifierLikeNAPI,
    verify_subset_of_proof: bool,
    js_platform_version: &DynamicValue,
) -> Result<VerifiedProofNAPI, napi::Error> {
    let platform_version = platform_version_from_js(js_platform_version)?;
    let status: GroupActionStatus = GroupActionStatusNAPI::try_from(js_status)?.into();

    let (root_hash, signers) = Drive::verify_contract_team_action_signers(
        &proof,
        identifier_from_js(js_contract_id)?,
        status,
        identifier_from_js(js_action_id)?,
        verify_subset_of_proof,
        &platform_version,
    )
    .map_err(verify_error)?;

    verified(root_hash, &signers)
}

#[derive(serde::Serialize)]
#[serde(rename_all = "camelCase")]
struct TeamActionEntry<'a> {
    action_id: Identifier,
    action: &'a ContractTeamAction,
    approval_count: u32,
}

/// A page of a contract's active or closed team actions
#[napi(js_name = "verifyContractTeamActionsProof")]
pub fn verify_contract_team_actions(
    proof: Uint8Array,
    js_contract_id: IdentifierLikeNAPI,
    js_status: &DynamicValue,
    js_start_at: Option<IdentifierLikeNAPI>,
    start_at_included: bool,
    limit: u16,
    verify_subset_of_proof: bool,
    js_platform_version: &DynamicValue,
) -> Result<VerifiedProofNAPI, napi::Error> {
    let platform_version = platform_version_from_js(js_platform_version)?;
    let status: GroupActionStatus = GroupActionStatusNAPI::try_from(js_status)?.into();
    let start_at = js_start_at
        .map(identifier_from_js)
        .transpose()?
        .map(|id| (id, start_at_included));

    let (root_hash, entries) = Drive::verify_contract_team_actions(
        &proof,
        identifier_from_js(js_contract_id)?,
        &ContractTeamActionsQuery {
            status,
            start_at,
            limit,
        },
        verify_subset_of_proof,
        &platform_version,
    )
    .map_err(verify_error)?;

    let entries: Vec<TeamActionEntry> = entries
        .iter()
        .map(|entry| TeamActionEntry {
            action_id: entry.action_id,
            action: &entry.action,
            approval_count: entry.approval_count,
        })
        .collect();

    verified(root_hash, &entries)
}
