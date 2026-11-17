import type * as protocol from '../../../../binaries/bindingsTypes.js';
import { GroveAncestor, GroveElement, GroveElementEntry, GroveLeafInfo } from '../../types.js';
export declare function mapGroveElement(element: protocol.GroveElementNAPI): GroveElement;
export declare function mapGroveElementEntry(entry: protocol.GroveElementEntryNAPI): GroveElementEntry;
export declare function mapGroveLeafInfo(info: protocol.GroveLeafInfoNAPI): GroveLeafInfo;
export declare function mapGroveAncestor(ancestor: protocol.GroveAncestorNAPI): GroveAncestor;
