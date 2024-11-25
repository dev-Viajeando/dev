import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { client } from '../../db.js';

const registerRouter = express.Router();

// Endpoint para registrar un nuevo usuario
registerRouter.post("/", async (req, res) => {
  try {
    const { email, contraseña } = req.body;

    // Buscar si el email ya está registrado
    const [usuarios] = await client.query("SELECT * FROM usuarios WHERE email = ?", [email]);

    if (usuarios.length > 0) {
      return res.status(400).json({ message: "El email ya está en uso." });
    }

    // Encriptar la contraseña antes de insertarla en la base de datos
    const hashedPassword = await bcrypt.hash(contraseña, 10);

    // Insertar el nuevo usuario en la base de datos
    const [result] = await client.query(
      "INSERT INTO usuarios (email, contraseña) VALUES (?, ?)",
      [email, hashedPassword]
    );

    // Generar token JWT para el nuevo usuario
    const payload = { email, id: result.insertId }; // Usamos el id recién insertado
    const secret = "mi_secreto";  // Debes usar un secreto más seguro en producción
    const token = jwt.sign(payload, secret, { expiresIn: '1h' });

    // Enviar la respuesta con el token
    res.status(201).json({
      message: "Usuario registrado exitosamente.",
      token,
    });

  } catch (err) {
    console.error("Error al registrar el usuario:", err);
    res.status(500).json({ message: "Error al registrar el usuario." });
  }
});

export default registerRouter;
