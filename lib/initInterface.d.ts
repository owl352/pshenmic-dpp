import type {DashPlatformProtocolWASM} from "./index.d.ts";

declare function initModule(): Promise<DashPlatformProtocolWASM>

export default initModule;