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
exports.destinosRouter = void 0;
const mod_ts_1 = require("https://deno.land/x/oak@v17.1.3/mod.ts");
const db_js_1 = require("../../db.js");
exports.destinosRouter = new mod_ts_1.Router();
exports.destinosRouter
    .get("/destinos", (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    const destinos = yield db_js_1.client.query("SELECT * FROM DESTINOS");
    ctx.response.body = destinos;
}))
    .get("/destinos/:id", (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = ctx.params;
        const destino = yield db_js_1.client.query("SELECT * FROM DESTINOS WHERE ID = ?", [id]);
        if (destino.length === 0) {
            ctx.response.status = 404;
            ctx.response.body = { message: "Destino no encontrado" };
            return;
        }
        ctx.response.status = 200;
        ctx.response.body = destino[0];
    }
    catch (_err) {
        ctx.response.status = 500;
        ctx.response.body = { message: "Error al obtener el destino." };
    }
}));
