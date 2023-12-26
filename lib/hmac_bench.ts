import { HmacSha256 } from "https://deno.land/std@0.160.0/hash/sha256.ts";
import { decodeHex } from "../deps.ts";
import { hmacSHA256 } from "./hmac.ts";

Deno.bench("hmac - subtle", { group: "small hmac", baseline: true }, () => {
  hmacSHA256(
    decodeHex("0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b"),
    decodeHex("4869205468657265"),
  );
});
Deno.bench("hmac - old", { group: "small hmac" }, () => {
  const hmac = new HmacSha256(
    decodeHex("0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b0b"),
  );
  hmac.update(decodeHex("4869205468657265"));
  hmac.digest();
});

Deno.bench("hmac - subtle", { group: "larger hmac", baseline: true }, () => {
  hmacSHA256(
    decodeHex(
      "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
    ),
    decodeHex(
      "5468697320697320612074657374207573696e672061206c6172676572207468616e20626c6f636b2d73697a65206b657920616e642061206c6172676572207468616e20626c6f636b2d73697a6520646174612e20546865206b6579206e6565647320746f20626520686173686564206265666f7265206265696e6720757365642062792074686520484d414320616c676f726974686d2e",
    ),
  );
});
Deno.bench("hmac - old", { group: "larger hmac" }, () => {
  const hmac = new HmacSha256(
    decodeHex(
      "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
    ),
  );
  hmac.update(
    decodeHex(
      "5468697320697320612074657374207573696e672061206c6172676572207468616e20626c6f636b2d73697a65206b657920616e642061206c6172676572207468616e20626c6f636b2d73697a6520646174612e20546865206b6579206e6565647320746f20626520686173686564206265666f7265206265696e6720757365642062792074686520484d414320616c676f726974686d2e",
    ),
  );
  hmac.digest();
});

// appears to be comparable to the old implementation in practice
Deno.bench("hmac - subtle", { group: "hmac as used", baseline: true }, () => {
  hmacSHA256(
    decodeHex(
      "834680896aab19cf86a4c0edf4cef4db8af5bd05a40d42e768e658057ee521e63acadefa59fb2f3133def01d2c3dd5d1",
    ).subarray(0, 48),
    decodeHex(
      "024b5b12a8b3d622c289ad69536a30cda848074c82d06ff05775d653bf0fc48033ddafba8071b7f119810dd57619553e87aff3bc8c237669523dc6530b8ee267",
    ).subarray(0, 64),
  );
});
Deno.bench("hmac - old", { group: "hmac as used" }, () => {
  const hmac = new HmacSha256(
    decodeHex(
      "834680896aab19cf86a4c0edf4cef4db8af5bd05a40d42e768e658057ee521e63acadefa59fb2f3133def01d2c3dd5d1",
    ).subarray(0, 48),
  );
  hmac.update(
    decodeHex(
      "024b5b12a8b3d622c289ad69536a30cda848074c82d06ff05775d653bf0fc48033ddafba8071b7f119810dd57619553e87aff3bc8c237669523dc6530b8ee267",
    ).subarray(0, 64),
  );
  hmac.digest();
});
