use dpp::ProtocolError;
use napi::Status;

pub trait WithJsError<T> {
    fn with_js_error(self) -> Result<T, napi::Error>;
}

impl<T> WithJsError<T> for Result<T, napi::Error> {
    fn with_js_error(self) -> Result<T, napi::Error> {
        match self {
            Ok(ok) => Ok(ok),
            Err(error) => Err(error),
        }
    }
}

impl<T> WithJsError<T> for Result<T, ProtocolError> {
    fn with_js_error(self) -> Result<T, napi::Error> {
        match self {
            Ok(ok) => Ok(ok),
            Err(error) => Err(napi::Error::new(Status::GenericFailure, error.to_string())),
        }
    }
}
