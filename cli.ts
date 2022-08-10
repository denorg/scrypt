import { genSalt, hash, verify } from "./mod.ts";
/**
 * @todo add a proper argument parser ([args](https://deno.land/x/args) perhaps?)
 */
if (import.meta.main) {
  const args = Deno.args.slice();
  const command = args.shift();
  switch (command) {
    case "hash":
      for (const arg of args) {
        console.log(await hash(arg));
      }
      break;
    case "verify":
      console.log(await verify(args[0], args[1]));
      break;
    case "salt":
      if (args.length) {
        for (const arg of args) {
          console.log(await genSalt(parseInt(arg, 10)));
        }
      } else {
        console.log(await genSalt());
      }
      break;
    default: {
	console.log(`usage: hash <password>, verify <password>, <hash>`)
    }
  }
}
