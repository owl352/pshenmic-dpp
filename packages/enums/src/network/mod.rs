use dpp::dashcore::Network;
use wasm_bindgen::prelude::wasm_bindgen;

#[wasm_bindgen(js_name = "Network")]
pub enum NetworkWASM {
    Dash,
    Testnet,
    Devnet,
    Regtest,
}

impl From<Network> for NetworkWASM {
    fn from(value: Network) -> Self {
        match value {
            Network::Dash => NetworkWASM::Dash,
            Network::Testnet => NetworkWASM::Testnet,
            Network::Devnet => NetworkWASM::Devnet,
            Network::Regtest => NetworkWASM::Regtest,
            _ => NetworkWASM::Testnet,
        }
    }
}

impl From<NetworkWASM> for Network {
    fn from(value: NetworkWASM) -> Self {
        match value {
            NetworkWASM::Dash => Network::Dash,
            NetworkWASM::Testnet => Network::Testnet,
            NetworkWASM::Devnet => Network::Devnet,
            NetworkWASM::Regtest => Network::Regtest,
        }
    }
}
