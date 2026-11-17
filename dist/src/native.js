// @ts-ignore
import protocol from '../binaries/node.cjs';
import { dppProvider } from './dpp/provider.js';
// @ts-ignore
dppProvider.setDpp(protocol);
// dpp carries no proving code: the consumer provides the orchard proving module
// explicitly via setShielded(loadShielded()) from pshenmic-orchard (native
// Node-API addon on Node, threaded wasm fallback / browser path).
export { setShielded } from './dpp/shielded.js';
export * from './dpp/enums.js';
export * from './dpp/dpp.js';
export * from './dpp/types.js';
