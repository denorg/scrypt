extern crate wasm_bindgen;
extern crate hex;
extern crate crypto;

use crypto::{ scrypt };
use wasm_bindgen::prelude::*;
use std::iter::repeat;

#[wasm_bindgen]
pub fn scrypt(password: &[u8], salt: &[u8],  n: u32, r: u32, p: u32, dklen: usize) -> Vec<u8> {
    let log_n = (32 - n.leading_zeros() - 1) as u8;
    let mut result: Vec<u8> = repeat(0).take(dklen).collect();
     let params = scrypt::ScryptParams::new(log_n,r,p);
     
     scrypt::scrypt(&password, &salt, &params, &mut result);
     result
}
