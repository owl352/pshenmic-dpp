use std::{
    env,
    path::{Path, PathBuf},
    process::Command,
};

fn main() {
    napi_build::setup();

    if env::var("TARGET").as_deref() == Ok("wasm32-wasip1-threads") {
        link_reactor_crt();
    }
}

/// napi-build 2.3 links `crt1-reactor.o` (which defines the `_initialize`
/// export emnapi runs at instantiation) from a path derived from `$RUSTC`
/// alone, and only warns when it is not there — e.g. when Cargo passes a bare
/// `rustc`. A wasm without `_initialize` never runs its constructors, and the
/// main thread deadlocks at import as soon as the tokio runtime spawns its
/// first thread. Resolve the object from the compiler's sysroot instead
/// whenever napi-build's lookup missed it.
fn link_reactor_crt() {
    let rustc = env::var("RUSTC").expect("RUSTC must be set by Cargo");
    let target = env::var("TARGET").expect("TARGET must be set by Cargo");

    // Same path napi-build checks; if it exists napi-build already linked it,
    // and linking it twice fails with a duplicate `_initialize`.
    let napi_build_path = Path::new(&rustc)
        .parent()
        .and_then(Path::parent)
        .map(|toolchain| reactor_crt_path(toolchain, &target));
    if napi_build_path.is_some_and(|path| path.is_file()) {
        return;
    }

    let output = Command::new(&rustc)
        .args(["--print", "sysroot"])
        .output()
        .expect("failed to run `rustc --print sysroot`");
    let sysroot = String::from_utf8(output.stdout).expect("sysroot is not utf-8");
    let crt = reactor_crt_path(Path::new(sysroot.trim()), &target);

    assert!(
        crt.is_file(),
        "crt1-reactor.o not found at {}: install the {target} target for this toolchain",
        crt.display()
    );

    println!("cargo:rustc-link-arg={}", crt.display());
    println!("cargo:rustc-link-arg=--export=_initialize");
}

fn reactor_crt_path(sysroot: &Path, target: &str) -> PathBuf {
    sysroot
        .join("lib/rustlib")
        .join(target)
        .join("lib/self-contained/crt1-reactor.o")
}
