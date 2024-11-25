"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.origenRouter = void 0;
const mod_ts_1 = require("https://deno.land/x/oak@v17.1.3/mod.ts");
const db_js_1 = require("../../db.js");
exports.origenRouter = new mod_ts_1.Router();
exports.origenRouter
    .get("/origen", (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    const origen = yield db_js_1.client.query("SELECT * FROM ORIGEN");
    ctx.response.body = origen;
}));
