import { assertEquals } from "../deps.ts";

import { decomposeFormat, ScryptParameters } from "./format.ts";

Deno.test("decompose scrypt with format detection", (): void => {
  const params = decomposeFormat(
    "c2NyeXB0AAwAAAAIAAAAAcQ0zwp7QNLklxCn14vB75AYWDIrrT9I/7F9+lVGBfKN/1TH2hs/HboSy1ptzN0YzMmobAXD3CqJJLRLaTK7nOHbjNTWA20LuUmGwEoJtonW",
  );

  const expectedParams = {
    logN: 12,
    r: 8,
    p: 1,
    // dprint-ignore-next-line
    // deno-fmt-ignore
    salt: new Uint8Array([196, 52, 207, 10, 123, 64, 210, 228, 151, 16, 167, 215, 139, 193, 239, 144, 24, 88, 50, 43, 173, 63, 72, 255, 177, 125, 250, 85, 70, 5, 242, 141]),
  } as ScryptParameters;
  assertEquals(params, expectedParams);
});
