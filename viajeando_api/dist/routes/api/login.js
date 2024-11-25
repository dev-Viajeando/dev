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
exports.loginRouter = void 0;
const mod_ts_1 = require("https://deno.land/x/oak@v17.1.3/mod.ts");
const bcrypt = __importStar(require("https://deno.land/x/bcrypt@v0.4.1/mod.ts"));
const mod_ts_2 = require("https://deno.land/x/djwt@v2.6/mod.ts");
const db_js_1 = require("../../db.js");
exports.loginRouter = new mod_ts_1.Router();
function generateCryptoKey(secret) {
    return __awaiter(this, void 0, void 0, function* () {
        const encoder = new TextEncoder();
        const keyData = encoder.encode(secret);
        const key = yield crypto.subtle.importKey("raw", keyData, { name: "HMAC", hash: { name: "SHA-256" } }, false, ["sign", "verify"]);
        return key;
    });
}
exports.loginRouter.post("/login", (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, contraseña } = yield ctx.request.body.json();
        // Buscar el usuario por el email
        const usuarios = yield db_js_1.client.query("SELECT * FROM usuarios WHERE email = ?", [email]);
        if (usuarios.length === 0) {
            ctx.response.status = 404;
            ctx.response.body = { message: "Usuario no encontrado" };
            return;
        }
        const user = usuarios[0];
        // Verificar la contraseña con bcrypt
        const isPasswordCorrect = yield bcrypt.compare(contraseña, user.contraseña);
        if (!isPasswordCorrect) {
            ctx.response.status = 400;
            ctx.response.body = { message: "Contraseña incorrecta" };
            return;
        }
        // Si la autenticación fue exitosa, generar un token JWT
        const payload = { id: user.id, email: user.email }; // Puedes agregar más información si es necesario
        const secret = "mi_secreto"; // Este es tu "secreto" en forma de string
        const cryptoKey = yield generateCryptoKey(secret); // Convertir el secreto a CryptoKey
        // Generar el token usando la clave criptográfica
        const token = yield (0, mod_ts_2.create)({ alg: "HS256", typ: "JWT" }, payload, cryptoKey);
        // Devolver el token al cliente
        ctx.response.status = 200;
        ctx.response.body = { message: "Login exitoso", token: token };
    }
    catch (_err) {
        ctx.response.status = 500;
        ctx.response.body = { message: "Error al iniciar sesión." };
    }
}));
