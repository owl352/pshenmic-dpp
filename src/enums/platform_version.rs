use crate::dynamic_value::DynamicValue;
use dpp::version::{
    PlatformVersion, v1::PLATFORM_V1, v2::PLATFORM_V2, v3::PLATFORM_V3, v4::PLATFORM_V4,
    v5::PLATFORM_V5, v6::PLATFORM_V6, v7::PLATFORM_V7, v8::PLATFORM_V8, v9::PLATFORM_V9,
    v10::PLATFORM_V10, v11::PLATFORM_V11, v12::PLATFORM_V12,
};
use napi::Status;
use napi_derive::napi;

#[napi(js_name = PlatformVersionNAPI)]
#[derive(Default)]
#[allow(non_camel_case_types)]
pub enum PlatformVersionNAPI {
    PLATFORM_V1 = 1,
    PLATFORM_V2 = 2,
    PLATFORM_V3 = 3,
    PLATFORM_V4 = 4,
    PLATFORM_V5 = 5,
    PLATFORM_V6 = 6,
    PLATFORM_V7 = 7,
    PLATFORM_V8 = 8,
    PLATFORM_V9 = 9,
    PLATFORM_V10 = 10,
    PLATFORM_V11 = 11,
    #[default]
    PLATFORM_V12 = 12,
}

impl From<PlatformVersionNAPI> for String {
    fn from(version: PlatformVersionNAPI) -> String {
        match version {
            PlatformVersionNAPI::PLATFORM_V1 => String::from("PLATFORM_V1"),
            PlatformVersionNAPI::PLATFORM_V2 => String::from("PLATFORM_V2"),
            PlatformVersionNAPI::PLATFORM_V3 => String::from("PLATFORM_V3"),
            PlatformVersionNAPI::PLATFORM_V4 => String::from("PLATFORM_V4"),
            PlatformVersionNAPI::PLATFORM_V5 => String::from("PLATFORM_V5"),
            PlatformVersionNAPI::PLATFORM_V6 => String::from("PLATFORM_V6"),
            PlatformVersionNAPI::PLATFORM_V7 => String::from("PLATFORM_V7"),
            PlatformVersionNAPI::PLATFORM_V8 => String::from("PLATFORM_V8"),
            PlatformVersionNAPI::PLATFORM_V9 => String::from("PLATFORM_V9"),
            PlatformVersionNAPI::PLATFORM_V10 => String::from("PLATFORM_V10"),
            PlatformVersionNAPI::PLATFORM_V11 => String::from("PLATFORM_V11"),
            PlatformVersionNAPI::PLATFORM_V12 => String::from("PLATFORM_V12"),
        }
    }
}

impl From<PlatformVersionNAPI> for PlatformVersion {
    fn from(value: PlatformVersionNAPI) -> Self {
        match value {
            PlatformVersionNAPI::PLATFORM_V1 => PLATFORM_V1,
            PlatformVersionNAPI::PLATFORM_V2 => PLATFORM_V2,
            PlatformVersionNAPI::PLATFORM_V3 => PLATFORM_V3,
            PlatformVersionNAPI::PLATFORM_V4 => PLATFORM_V4,
            PlatformVersionNAPI::PLATFORM_V5 => PLATFORM_V5,
            PlatformVersionNAPI::PLATFORM_V6 => PLATFORM_V6,
            PlatformVersionNAPI::PLATFORM_V7 => PLATFORM_V7,
            PlatformVersionNAPI::PLATFORM_V8 => PLATFORM_V8,
            PlatformVersionNAPI::PLATFORM_V9 => PLATFORM_V9,
            PlatformVersionNAPI::PLATFORM_V10 => PLATFORM_V10,
            PlatformVersionNAPI::PLATFORM_V11 => PLATFORM_V11,
            PlatformVersionNAPI::PLATFORM_V12 => PLATFORM_V12,
        }
    }
}

impl TryFrom<u64> for PlatformVersionNAPI {
    type Error = napi::Error;

    fn try_from(value: u64) -> Result<Self, Self::Error> {
        match value {
            1 => Ok(PlatformVersionNAPI::PLATFORM_V1),
            2 => Ok(PlatformVersionNAPI::PLATFORM_V2),
            3 => Ok(PlatformVersionNAPI::PLATFORM_V3),
            4 => Ok(PlatformVersionNAPI::PLATFORM_V4),
            5 => Ok(PlatformVersionNAPI::PLATFORM_V5),
            6 => Ok(PlatformVersionNAPI::PLATFORM_V6),
            7 => Ok(PlatformVersionNAPI::PLATFORM_V7),
            8 => Ok(PlatformVersionNAPI::PLATFORM_V8),
            9 => Ok(PlatformVersionNAPI::PLATFORM_V9),
            10 => Ok(PlatformVersionNAPI::PLATFORM_V10),
            11 => Ok(PlatformVersionNAPI::PLATFORM_V11),
            12 => Ok(PlatformVersionNAPI::PLATFORM_V12),
            _ => Err(napi::Error::new(
                Status::InvalidArg,
                format!("unknown platform version value: {}", value),
            )),
        }
    }
}

impl TryFrom<String> for PlatformVersionNAPI {
    type Error = napi::Error;

    fn try_from(value: String) -> Result<Self, Self::Error> {
        match value.to_lowercase().as_str() {
            "platform_v1" => Ok(PlatformVersionNAPI::PLATFORM_V1),
            "platform_v2" => Ok(PlatformVersionNAPI::PLATFORM_V2),
            "platform_v3" => Ok(PlatformVersionNAPI::PLATFORM_V3),
            "platform_v4" => Ok(PlatformVersionNAPI::PLATFORM_V4),
            "platform_v5" => Ok(PlatformVersionNAPI::PLATFORM_V5),
            "platform_v6" => Ok(PlatformVersionNAPI::PLATFORM_V6),
            "platform_v7" => Ok(PlatformVersionNAPI::PLATFORM_V7),
            "platform_v8" => Ok(PlatformVersionNAPI::PLATFORM_V8),
            "platform_v9" => Ok(PlatformVersionNAPI::PLATFORM_V9),
            "platform_v10" => Ok(PlatformVersionNAPI::PLATFORM_V10),
            "platform_v11" => Ok(PlatformVersionNAPI::PLATFORM_V11),
            "platform_v12" => Ok(PlatformVersionNAPI::PLATFORM_V12),
            _ => Err(napi::Error::new(
                Status::InvalidArg,
                format!("unknown platform version value: {}", value),
            )),
        }
    }
}

impl TryFrom<&DynamicValue> for PlatformVersionNAPI {
    type Error = napi::Error;

    fn try_from(value: &DynamicValue) -> Result<Self, Self::Error> {
        let is_number = value.is_number();
        let is_string = value.is_string();

        if is_number {
            let num = value.try_to_u64()?;
            PlatformVersionNAPI::try_from(num)
        } else if is_string {
            let string = value.as_string().unwrap();

            PlatformVersionNAPI::try_from(string)
        } else {
            Err(napi::Error::new(
                Status::InvalidArg,
                "Invalid platform version value",
            ))
        }
    }
}
