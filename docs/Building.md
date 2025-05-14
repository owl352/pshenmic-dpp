# How to Build

---
## Set packages for build
Optional you can choose packages for build in `src/lib.rs`
by `pub use`

Default value:
````rust 
#![no_std]
#![no_main]

extern crate wee_alloc;

// allows to save 7 kb
#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

pub use pshenmic_dpp_data_contract;
pub use pshenmic_dpp_data_contract_transitions;
pub use pshenmic_dpp_document_search;
pub use pshenmic_dpp_documents_batch;
pub use pshenmic_dpp_enums;
pub use pshenmic_dpp_identifier;
pub use pshenmic_dpp_identity;
pub use pshenmic_dpp_identity_transitions;
pub use pshenmic_dpp_state_transition;
````
___
## Install dependencies
```yarn```

### OSX
```brew install llvm```

___
## Build
```yarn build:full```
___
## CJS
By default, the module is built in ES6.
If you need CommonJS (CJS), simply run:

```yarn babel```
___
## UNIT TESTS
For unit tests, you need to [convert module to CJS](#cjs)
and then run:

```yarn tests```