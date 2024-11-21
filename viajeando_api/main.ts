import { Application} from "https://deno.land/x/oak@v17.1.3/mod.ts";
import { oakCors } from "https://deno.land/x/cors@v1.2.2/mod.ts";
import { destinosRouter } from "./routes/api/destinos.ts";
import { loginRouter } from "./routes/api/login.ts";
import { registerRouter } from "./routes/api/register.ts";
import { favoritosRouter } from "./routes/api/favoritos.ts"

// Aplicación Oak
const app = new Application();
app.use(oakCors()); // Habilitar CORS
app.use(registerRouter.routes());
app.use(registerRouter.allowedMethods());
app.use(loginRouter.routes());
app.use(loginRouter.allowedMethods());
app.use(destinosRouter.routes());
app.use(destinosRouter.allowedMethods());
app.use(favoritosRouter.routes());
app.use(favoritosRouter.allowedMethods());

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


