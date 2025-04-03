use dpp::dashcore::network::constants::Network;
use wasm_bindgen::prelude::wasm_bindgen;
#[wasm_bindgen(js_name = "NetworkWASM")]
#[allow(non_camel_case_types)]
pub enum NetworkWASM {
    DASH,
    Testnet,
    Devnet,
    Regtest,
}

impl From<NetworkWASM> for Network {
    fn from(network: NetworkWASM) -> Self {
        match network {
            NetworkWASM::DASH => Network::Dash,
            NetworkWASM::Testnet => Network::Testnet,
            NetworkWASM::Devnet => Network::Devnet,
            NetworkWASM::Regtest => Network::Regtest,
        }
    }
}
