import express from 'express';
import cors from 'cors'; // Importa cors
import destinosRouter from './routes/api/destinos.js';
import loginRouter from './routes/api/login.js';
import registerRouter from './routes/api/register.js';
import favoritosRouter from './routes/api/favoritos.js';
import origenRouter from './routes/api/origen.js';

const app = express();

// Configuración de CORS
const corsOptions = {
  origin: 'http://localhost:3000', // Permitir solicitudes desde el frontend
  methods: ['GET', 'POST', 'PATCH', 'DELETE'], // Métodos permitidos
  allowedHeaders: ['Content-Type', 'Authorization'], // Encabezados permitidos
};

// Habilitar CORS con las opciones configuradas
app.use(cors(corsOptions));

// Middleware para parsear el cuerpo de las peticiones en formato JSON
app.use(express.json());

// Configurar las rutas
app.use('/api', destinosRouter);
app.use('/api', loginRouter);
app.use('/api', registerRouter);
app.use('/api', favoritosRouter);
app.use('/api', origenRouter);

// Configurar el puerto del servidor
const PORT = 8000;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});



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


