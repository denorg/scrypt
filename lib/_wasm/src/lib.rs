#![no_std]
extern crate alloc;
extern crate scrypt;
extern crate talc;
extern crate wasm_bindgen;
use alloc::vec;
use alloc::vec::Vec;
use scrypt::{scrypt, Params};
use wasm_bindgen::prelude::*;
#[cfg(target_arch = "wasm32")]
#[global_allocator]
static TALC: talc::TalckWasm = unsafe { talc::TalckWasm::new_global() };

#[wasm_bindgen]
pub fn scrypt_hash(password: &[u8], salt: &[u8], n: u32, r: u32, p: u32, dklen: usize) -> Vec<u8> {
    let log_n = (32 - n.leading_zeros() - 1) as u8;
    let mut result: Vec<u8> = vec![0; dklen];
    let params = Params::new(log_n, r, p, dklen).unwrap();
    scrypt(&password, &salt, &params, &mut result).unwrap();
    result
}

#[cfg(test)]
mod tests {
    use super::*;
    #[test]
    fn basic_scrypt() {
        let result = scrypt_hash("password".as_bytes(), "NaCl".as_bytes(), 1024, 8, 16, 64);
        assert_eq!(result.len(), 64);

        let expected = vec![
            0xfd, 0xba, 0xbe, 0x1c, 0x9d, 0x34, 0x72, 0x00, 0x78, 0x56, 0xe7, 0x19, 0x0d, 0x01,
            0xe9, 0xfe, 0x7c, 0x6a, 0xd7, 0xcb, 0xc8, 0x23, 0x78, 0x30, 0xe7, 0x73, 0x76, 0x63,
            0x4b, 0x37, 0x31, 0x62, 0x2e, 0xaf, 0x30, 0xd9, 0x2e, 0x22, 0xa3, 0x88, 0x6f, 0xf1,
            0x09, 0x27, 0x9d, 0x98, 0x30, 0xda, 0xc7, 0x27, 0xaf, 0xb9, 0x4a, 0x83, 0xee, 0x6d,
            0x83, 0x60, 0xcb, 0xdf, 0xa2, 0xcc, 0x06, 0x40,
        ];
        assert_eq!(result, expected);
    }
}
