use dpp::address_funds::AddressFundsFeeStrategyStep;
use napi_derive::napi;

#[derive(Clone)]
#[napi(js_name = "AddressFundsFeeStrategyStepNAPI")]
pub struct AddressFundsFeeStrategyStepNAPI(AddressFundsFeeStrategyStep);

impl From<AddressFundsFeeStrategyStepNAPI> for AddressFundsFeeStrategyStep {
    fn from(step: AddressFundsFeeStrategyStepNAPI) -> Self {
        step.0
    }
}

impl From<AddressFundsFeeStrategyStep> for AddressFundsFeeStrategyStepNAPI {
    fn from(step: AddressFundsFeeStrategyStep) -> Self {
        AddressFundsFeeStrategyStepNAPI(step)
    }
}

#[napi]
impl AddressFundsFeeStrategyStepNAPI {
    #[napi(js_name = "DeductFromInput")]
    pub fn deduct_from_input(input: u16) -> AddressFundsFeeStrategyStepNAPI {
        AddressFundsFeeStrategyStepNAPI(AddressFundsFeeStrategyStep::DeductFromInput(input))
    }

    #[napi(js_name = "ReduceOutput")]
    pub fn reduce_output(output: u16) -> AddressFundsFeeStrategyStepNAPI {
        AddressFundsFeeStrategyStepNAPI(AddressFundsFeeStrategyStep::ReduceOutput(output))
    }

    #[napi(js_name = "getValue")]
    pub fn get_value(&self) -> u16 {
        match self.0 {
            AddressFundsFeeStrategyStep::DeductFromInput(value) => value,
            AddressFundsFeeStrategyStep::ReduceOutput(value) => value,
        }
    }

    #[napi(js_name = "setValue")]
    pub fn set_value(&mut self, value: u16) {
        match self.0 {
            AddressFundsFeeStrategyStep::DeductFromInput(_) => {
                self.0 = AddressFundsFeeStrategyStep::DeductFromInput(value);
            }
            AddressFundsFeeStrategyStep::ReduceOutput(_) => {
                self.0 = AddressFundsFeeStrategyStep::ReduceOutput(value);
            }
        }
    }

    #[napi(js_name = "getValueType")]
    pub fn get_value_type(&self) -> String {
        match self.0 {
            AddressFundsFeeStrategyStep::DeductFromInput(_) => "DeductFromInput",
            AddressFundsFeeStrategyStep::ReduceOutput(_) => "ReduceOutput",
        }
        .to_string()
    }
}
