use dpp::version::PlatformVersion;
use dpp::version::v1::PLATFORM_V1;
use dpp::version::v2::PLATFORM_V2;
use dpp::version::v3::PLATFORM_V3;
use dpp::version::v4::PLATFORM_V4;
use dpp::version::v5::PLATFORM_V5;
use dpp::version::v6::PLATFORM_V6;
use dpp::version::v7::PLATFORM_V7;
use dpp::version::v8::PLATFORM_V8;
use wasm_bindgen::prelude::wasm_bindgen;

#[wasm_bindgen(js_name = "PlatformVersionWASM")]
#[derive(Default)]
#[allow(non_camel_case_types)]
pub enum PlatformVersionWASM {
    #[default]
    PLATFORM_V1,
    PLATFORM_V2,
    PLATFORM_V3,
    PLATFORM_V4,
    PLATFORM_V5,
    PLATFORM_V6,
    PLATFORM_V7,
    PLATFORM_V8,
}

impl From<PlatformVersionWASM> for PlatformVersion {
    fn from(value: PlatformVersionWASM) -> Self {
        match value {
            PlatformVersionWASM::PLATFORM_V1 => PLATFORM_V1,
            PlatformVersionWASM::PLATFORM_V2 => PLATFORM_V2,
            PlatformVersionWASM::PLATFORM_V3 => PLATFORM_V3,
            PlatformVersionWASM::PLATFORM_V4 => PLATFORM_V4,
            PlatformVersionWASM::PLATFORM_V5 => PLATFORM_V5,
            PlatformVersionWASM::PLATFORM_V6 => PLATFORM_V6,
            PlatformVersionWASM::PLATFORM_V7 => PLATFORM_V7,
            PlatformVersionWASM::PLATFORM_V8 => PLATFORM_V8,
        }
    }
}
