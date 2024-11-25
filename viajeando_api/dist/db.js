"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.client = void 0;
const mod_ts_1 = require("https://deno.land/x/mysql@v2.12.1/mod.ts");
exports.client = await new mod_ts_1.Client().connect({
    hostname: "viajeando.com.ar",
    username: "viajeando_viajeando",
    password: "#DA51MA68SO83#",
    db: "viajeando_database_app",
    port: 3306,
});
