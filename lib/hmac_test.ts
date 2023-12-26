import { decodeHex } from "../deps.ts";
import { assertEquals } from "../deps.ts";
import { hmacSHA256 } from "./hmac.ts";

// test data from RFC 4231

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

Deno.test("hmacSHA256 with short key", (): void => {
  const result = hmacSHA256(
    decodeHex("4a656665"),
    decodeHex(
      "7768617420646f2079612077616e7420666f72206e6f7468696e673f",
    ),
  );
  assertEquals(
    result,
    decodeHex(
      "5bdcc146bf60754e6a042426089575c75a003f089d2739839dec58b964ec3843",
    ),
  );
});

Deno.test("hmacSHA256 with combined key and data longer than block size", (): void => {
  const result = hmacSHA256(
    decodeHex(
      "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
    ),
    decodeHex(
      "dddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd",
    ),
  );
  assertEquals(
    result,
    decodeHex(
      "773ea91e36800e46854db8ebd09181a72959098b3ef8c122d9635514ced565fe",
    ),
  );
});

Deno.test("hmacSHA256 with both key and data longer than block size", (): void => {
  const result = hmacSHA256(
    decodeHex(
      "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
    ),
    decodeHex(
      "5468697320697320612074657374207573696e672061206c6172676572207468616e20626c6f636b2d73697a65206b657920616e642061206c6172676572207468616e20626c6f636b2d73697a6520646174612e20546865206b6579206e6565647320746f20626520686173686564206265666f7265206265696e6720757365642062792074686520484d414320616c676f726974686d2e",
    ),
  );
  assertEquals(
    result,
    decodeHex(
      "9b09ffa71b942fcb27635fbcd5b0e944bfdc63644f0713938a7f51535c3a35e2",
    ),
  );
});
