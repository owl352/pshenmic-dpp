import type * as protocol from '../../../../binaries/bindingsTypes.js'
import {
  GroveAncestor,
  GroveElementEntry,
  GroveElementType,
  GroveElementWrapper,
  GroveLeafInfo
} from '../../types.js'

export function mapGroveElementEntry (entry: protocol.GroveElementEntryNAPI): GroveElementEntry {
  const { element } = entry

  return {
    key: entry.key,
    element: {
      type: element.type as GroveElementType,
      wrapper: element.wrapper != null ? element.wrapper as GroveElementWrapper : undefined,
      value: element.value ?? undefined,
      sum: element.sum != null ? BigInt(element.sum) : undefined,
      count: element.count != null ? BigInt(element.count) : undefined
    }
  }
}

export function mapGroveLeafInfo (info: protocol.GroveLeafInfoNAPI): GroveLeafInfo {
  return {
    key: info.key,
    hash: info.hash,
    count: info.count != null ? BigInt(info.count) : undefined
  }
}

export function mapGroveAncestor (ancestor: protocol.GroveAncestorNAPI): GroveAncestor {
  return {
    levelsUp: ancestor.levelsUp,
    count: BigInt(ancestor.count),
    key: ancestor.key,
    hash: ancestor.hash
  }
}
