import { hash, verify, genSalt } from "./mod.ts";

if (import.meta.main) {
  const command = Deno.args.shift();
  switch (command) {
    case "hash":
      for (let arg of Deno.args) {
        console.log(await hash(arg));
      }
      break;
    case "verify":
      console.log(await verify(Deno.args[0], Deno.args[1]));
      break;
    case "salt":
      if (Deno.args.length) {
        for (let arg of Deno.args) {
          console.log(await genSalt(parseInt(arg, 10)));
        }
      }
      else {
        console.log(await genSalt());
      }
  }
  
}
