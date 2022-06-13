extern crate scrypt;
extern crate wasm_bindgen;

use cfg_if::cfg_if;
use scrypt::{scrypt, Params};
use std::iter::repeat;
use wasm_bindgen::prelude::*;

cfg_if! {
    if #[cfg(feature = "wee_alloc")] {
        #[global_allocator]
        static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;
    }
}

#[wasm_bindgen]
pub fn scrypt_hash(password: &[u8], salt: &[u8], n: u32, r: u32, p: u32, dklen: usize) -> Vec<u8> {
    let log_n = (32 - n.leading_zeros() - 1) as u8;
    let mut result: Vec<u8> = repeat(0).take(dklen).collect();
    let params = Params::new(log_n, r, p).unwrap();
    scrypt(&password, &salt, &params, &mut result).unwrap();
    result
}
