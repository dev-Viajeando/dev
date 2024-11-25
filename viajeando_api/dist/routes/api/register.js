"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.registerRouter = void 0;
const mod_ts_1 = require("https://deno.land/x/oak@v17.1.3/mod.ts");
const bcrypt = __importStar(require("https://deno.land/x/bcrypt@v0.4.1/mod.ts"));
const db_js_1 = require("../../db.js");
exports.registerRouter = new mod_ts_1.Router();
exports.registerRouter.post("/register", (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Obtener solo email y contraseña del cuerpo de la solicitud
        const { email, contraseña } = yield ctx.request.body.json();
        // Validar si el email ya está registrado
        const existingUser = yield db_js_1.client.query("SELECT * FROM usuarios WHERE email = ?", [email]);
        if (existingUser.length > 0) {
            ctx.response.status = 400;
            ctx.response.body = {
                message: "El email ya está en uso.",
            };
            return;
        }
        // Encriptar la contraseña
        const hashedPassword = yield bcrypt.hash(contraseña);
        // Insertar el nuevo usuario en la base de datos
        yield db_js_1.client.query("INSERT INTO usuarios (email, contraseña) VALUES (?, ?)", [email, hashedPassword]);
        ctx.response.status = 201;
        ctx.response.body = { message: "Usuario registrado exitosamente." };
    }
    catch (_err) {
        ctx.response.status = 500;
        ctx.response.body = { message: "Error al registrar el usuario." };
    }
}));
