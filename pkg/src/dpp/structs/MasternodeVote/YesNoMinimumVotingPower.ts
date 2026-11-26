import type { YesNoMinimumVotingPowerNAPI } from '../../../../binaries/bindingsTypes.js'
import { dppProvider } from '../../provider.js'

/** How a fraction of the total voting power rounds to a whole voting power. */
export type VotingPowerRounding =
  'down'
  | 'up'
  | 'downPlusOne'
  | 'upMinusOne'

/**
 * The least yes plus no voting power a yes/no poll needs to pass (protocol
 * version 15): a fixed voting power, or a share of the masternode list's total
 * voting power when the poll closes.
 */
export class YesNoMinimumVotingPowerWASM {
  /** @private **/
  _rawYesNoMinimumVotingPower: YesNoMinimumVotingPowerNAPI

  private constructor (rawInstance: YesNoMinimumVotingPowerNAPI) {
    this._rawYesNoMinimumVotingPower = rawInstance
  }

  get type (): 'absolute' | 'fractionOfTotal' {
    return this._rawYesNoMinimumVotingPower.type as 'absolute' | 'fractionOfTotal'
  }

  get votingPower (): number | undefined {
    return this._rawYesNoMinimumVotingPower.votingPower ?? undefined
  }

  get numerator (): number | undefined {
    return this._rawYesNoMinimumVotingPower.numerator ?? undefined
  }

  get denominator (): number | undefined {
    return this._rawYesNoMinimumVotingPower.denominator ?? undefined
  }

  get rounding (): VotingPowerRounding | undefined {
    return this._rawYesNoMinimumVotingPower.rounding as VotingPowerRounding | undefined
  }

  static Absolute (votingPower: number): YesNoMinimumVotingPowerWASM {
    return YesNoMinimumVotingPowerWASM.createFromRawInstance(
      dppProvider.dpp.YesNoMinimumVotingPowerNAPI.Absolute(votingPower)
    )
  }

  static FractionOfTotal (
    numerator: number,
    denominator: number,
    rounding: VotingPowerRounding
  ): YesNoMinimumVotingPowerWASM {
    return YesNoMinimumVotingPowerWASM.createFromRawInstance(
      dppProvider.dpp.YesNoMinimumVotingPowerNAPI.FractionOfTotal(
        numerator,
        denominator,
        rounding
      )
    )
  }

  static createFromRawInstance (rawInstance: YesNoMinimumVotingPowerNAPI): YesNoMinimumVotingPowerWASM {
    return new YesNoMinimumVotingPowerWASM(rawInstance)
  }
}
