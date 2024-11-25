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
exports.favoritosRouter = void 0;
const mod_ts_1 = require("https://deno.land/x/oak@v17.1.3/mod.ts");
const db_js_1 = require("../../db.js");
exports.favoritosRouter = new mod_ts_1.Router();
// Endpoint para sincronizar los favoritos de un usuario
exports.favoritosRouter.patch("/favoritos/sync", (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Obtener los datos del cuerpo de la solicitud (un solo favorito)
        const { id_usuario, id_destino, is_favorited } = yield ctx.request.body.json();
        console.log("Datos recibidos:", { id_usuario, id_destino, is_favorited });
        // Validación: verificar que se reciban todos los datos necesarios
        if (!id_usuario || !id_destino || typeof is_favorited !== 'boolean') {
            const message = "Se requiere un id_usuario, id_destino y el estado is_favorited.";
            console.log(message);
            ctx.response.status = 400;
            ctx.response.body = { message };
            return;
        }
        // Verificar si el destino ya está registrado como favorito para el usuario
        const [existing] = yield db_js_1.client.query("SELECT * FROM FAVORITOS WHERE ID_USUARIO = ? AND ID_DESTINO = ?", [id_usuario, id_destino]);
        if (existing) {
            // Si ya existe la relación, actualizamos el estado de favorito
            console.log(`El destino ${id_destino} ya existe para el usuario ${id_usuario}. Actualizando estado.`);
            yield db_js_1.client.query("UPDATE FAVORITOS SET IS_FAVORITED = ? WHERE ID_USUARIO = ? AND ID_DESTINO = ?", [is_favorited, id_usuario, id_destino]);
        }
        else {
            // Si no existe, lo creamos con el estado proporcionado
            console.log(`El destino ${id_destino} no existe para el usuario ${id_usuario}. Creando relación.`);
            yield db_js_1.client.query("INSERT INTO FAVORITOS (ID_USUARIO, ID_DESTINO, IS_FAVORITED) VALUES (?, ?, ?)", [id_usuario, id_destino, is_favorited]);
        }
        // Responder con éxito
        const message = `El destino ${id_destino} ha sido ${is_favorited ? "marcado" : "desmarcado"} correctamente.`;
        console.log(message);
        ctx.response.status = 200;
        ctx.response.body = { message };
    }
    catch (err) {
        console.error("Error al sincronizar el favorito:", err);
        // Manejar errores inesperados
        ctx.response.status = 500;
        ctx.response.body = { message: "Error al sincronizar el favorito." };
    }
}));
// Endpoint para obtener los favoritos de un usuario por su id
exports.favoritosRouter.get("/favoritos/:id", (ctx) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = ctx.params;
        // Obtener los destinos favoritos del usuario por id
        const favoritos = yield db_js_1.client.query("SELECT d.* FROM FAVORITOS f JOIN DESTINOS d ON f.ID_DESTINO = d.ID WHERE f.ID_USUARIO = ? AND f.IS_FAVORITED = 1", // Filtramos por IS_FAVORITED = 1
        [id]);
        // Si no hay favoritos, devuelve un array vacío
        ctx.response.status = 200;
        ctx.response.body = favoritos.length > 0 ? favoritos : []; // Asegura que siempre se devuelva un array
    }
    catch (err) {
        console.error("Error al obtener favoritos:", err);
        ctx.response.status = 500;
        ctx.response.body = { message: "Error al obtener los favoritos." };
    }
}));
