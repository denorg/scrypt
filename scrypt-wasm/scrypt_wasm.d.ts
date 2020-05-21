/* tslint:disable */
/* eslint-disable */
/**
* @param {string} password 
* @param {string} salt 
* @param {number} n 
* @param {number} r 
* @param {number} p 
* @param {number} dklen 
* @returns {string} 
*/
export function scrypt(password: string, salt: string, n: number, r: number, p: number, dklen: number): string;
/**
* @param {string} password 
* @param {number} n 
* @param {number} r 
* @param {number} p 
* @returns {string} 
*/
export function scrypt_simple(password: string, n: number, r: number, p: number): string;
/**
* @param {string} password 
* @param {string} hashed_value 
* @returns {boolean} 
*/
export function scrypt_check(password: string, hashed_value: string): boolean;
