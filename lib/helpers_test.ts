import { assertEquals } from "../deps.ts";
import { to32bytes } from "./helpers.ts";

Deno.test("to32bytes long string", (): void => {
  const input = "just a somewhat longer string that's more than 32 bytes long";
  const expected = new Uint8Array([
    106,
    117,
    115,
    116,
    32,
    97,
    32,
    115,
    111,
    109,
    101,
    119,
    104,
    97,
    116,
    32,
    108,
    111,
    110,
    103,
    101,
    114,
    32,
    115,
    116,
    114,
    105,
    110,
    103,
    32,
    116,
    104,
  ]);
  const actual = to32bytes(input);
  assertEquals(actual, expected);
});

Deno.test("to32bytes short string", (): void => {
  const input = "hello world";
  const expected = new Uint8Array([
    104,
    101,
    108,
    108,
    111,
    32,
    119,
    111,
    114,
    108,
    100,
  ]);
  const actual = to32bytes(input);
  assertEquals(actual, expected);
});
