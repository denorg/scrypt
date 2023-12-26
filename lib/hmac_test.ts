import { hmacSHA256 } from "./hmac.ts";
import { decodeHex } from "../deps.ts";
import { assertEquals } from "../deps.ts";

const encoder = new TextEncoder();

Deno.test("basic hmacSHA256", (): void => {
  const result = hmacSHA256(
    decodeHex("0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b"),
    decodeHex("4869205468657265"),
  );
  assertEquals(
    result,
    decodeHex(
      "b0344c61d8db38535ca8afceaf0bf12b881dc200c9833da726e9376c2e32cff7",
    ),
  );
});
