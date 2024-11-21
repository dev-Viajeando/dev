import { Client } from "https://deno.land/x/mysql@v2.12.1/mod.ts";

export const client = await new Client().connect({
  hostname: "viajeando.com.ar",
  username: "viajeando_viajeando",
  password: "#DA51MA68SO83#",
  db: "viajeando_database_app",
  port: 3306,
});