"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mod_ts_1 = require("https://deno.land/x/oak@v17.1.3/mod.ts");
const mod_ts_2 = require("https://deno.land/x/cors@v1.2.2/mod.ts");
const destinos_js_1 = require("./routes/api/destinos.js");
const login_js_1 = require("./routes/api/login.js");
const register_js_1 = require("./routes/api/register.js");
const favoritos_js_1 = require("./routes/api/favoritos.js");
const origen_js_1 = require("./routes/api/origen.js");
// Aplicación Oak
const app = new mod_ts_1.Application();
app.use((0, mod_ts_2.oakCors)()); // Habilitar CORS
app.use(register_js_1.registerRouter.routes());
app.use(register_js_1.registerRouter.allowedMethods());
app.use(login_js_1.loginRouter.routes());
app.use(login_js_1.loginRouter.allowedMethods());
app.use(destinos_js_1.destinosRouter.routes());
app.use(destinos_js_1.destinosRouter.allowedMethods());
app.use(favoritos_js_1.favoritosRouter.routes());
app.use(favoritos_js_1.favoritosRouter.allowedMethods());
app.use(origen_js_1.origenRouter.routes());
app.use(origen_js_1.origenRouter.allowedMethods());
// Iniciar servidor
console.log("Servidor escuchando en http://localhost:8000");
await app.listen({ port: 8000 });
// Crear el enrutador y definir las rutas
// const router = new Router();
// Ruta para obtener todos los usuarios
// router.get("/usuarios", async (ctx) => {
//   try {
//     const usuarios = await client.query("SELECT * FROM usuarios");
//     ctx.response.body = usuarios;
//   } catch (_err) {
//     ctx.response.status = 500;
//     ctx.response.body = { message: "Error al obtener los usuarios." };
//   }
// });
// Ruta para obtener un usuario por id
// Ruta para crear un nuevo usuario (POST)
// router.post("/usuarios", async (ctx) => {
//   try {
//     const { nombre, apellido, email, nombre_u, contraseña } = await ctx.request
//       .body.json();
//     // Validar si el usuario ya existe
//     const existingUser = await client.query(
//       "SELECT * FROM usuarios WHERE nombre_u = ? OR email = ?",
//       [nombre_u, email],
//     );
//     if (existingUser.length > 0) {
//       ctx.response.status = 400;
//       ctx.response.body = {
//         message: "El nombre de usuario o el email ya están en uso.",
//       };
//       return;
//     }
//     // Encriptar la contraseña
//     const hashedPassword = await bcrypt.hash(contraseña);
//     // Insertar el nuevo usuario en la base de datos
//     await client.query(
//       "INSERT INTO usuarios (nombre, apellido, email, nombre_u, contraseña) VALUES (?, ?, ?, ?, ?)",
//       [nombre, apellido, email, nombre_u, hashedPassword],
//     );
//     ctx.response.status = 201;
//     ctx.response.body = { message: "Usuario creado exitosamente." };
//   } catch (_err) {
//     ctx.response.status = 500;
//     ctx.response.body = { message: "Error al crear el usuario." };
//   }
// });
