use dpp::address_funds::AddressFundsFeeStrategyStep;
use wasm_bindgen::prelude::wasm_bindgen;

#[derive(Clone)]
#[wasm_bindgen(js_name = "AddressFundsFeeStrategyStepWASM")]
pub struct AddressFundsFeeStrategyStepWASM(AddressFundsFeeStrategyStep);

impl From<AddressFundsFeeStrategyStepWASM> for AddressFundsFeeStrategyStep {
    fn from(step: AddressFundsFeeStrategyStepWASM) -> Self {
        step.0
    }
}

impl From<AddressFundsFeeStrategyStep> for AddressFundsFeeStrategyStepWASM {
    fn from(step: AddressFundsFeeStrategyStep) -> Self {
        AddressFundsFeeStrategyStepWASM(step)
    }
}

#[wasm_bindgen]
impl AddressFundsFeeStrategyStepWASM {
    #[wasm_bindgen(getter = "__type")]
    pub fn type_name(&self) -> String {
        "AddressFundsFeeStrategyStepWASM".to_string()
    }

    #[wasm_bindgen(getter = "__struct")]
    pub fn struct_name() -> String {
        "AddressFundsFeeStrategyStepWASM".to_string()
    }

    #[wasm_bindgen(js_name = "DeductFromInput")]
    pub fn deduct_from_input(input: u16) -> AddressFundsFeeStrategyStepWASM {
        AddressFundsFeeStrategyStepWASM(AddressFundsFeeStrategyStep::DeductFromInput(input))
    }

    #[wasm_bindgen(js_name = "ReduceOutput")]
    pub fn reduce_output(output: u16) -> AddressFundsFeeStrategyStepWASM {
        AddressFundsFeeStrategyStepWASM(AddressFundsFeeStrategyStep::ReduceOutput(output))
    }

    #[wasm_bindgen(js_name = "getValue")]
    pub fn get_value(&self) -> u16 {
        match self.0 {
            AddressFundsFeeStrategyStep::DeductFromInput(value) => value,
            AddressFundsFeeStrategyStep::ReduceOutput(value) => value,
        }
    }

    #[wasm_bindgen(js_name = "setValue")]
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

    #[wasm_bindgen(js_name = "getValueType")]
    pub fn get_value_type(&self) -> String {
        match self.0 {
            AddressFundsFeeStrategyStep::DeductFromInput(_) => "DeductFromInput",
            AddressFundsFeeStrategyStep::ReduceOutput(_) => "ReduceOutput",
        }
        .to_string()
    }
}
