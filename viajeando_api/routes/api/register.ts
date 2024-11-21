import { Router } from "https://deno.land/x/oak@v17.1.3/mod.ts";
import * as bcrypt from "https://deno.land/x/bcrypt@v0.4.1/mod.ts";
import { client } from "../../db.ts";

export const registerRouter = new Router();

registerRouter.post("/register", async (ctx) => {
    try {
      // Obtener solo email y contraseña del cuerpo de la solicitud
      const { email, contraseña } = await ctx.request.body.json();
  
      // Validar si el email ya está registrado
      const existingUser = await client.query(
        "SELECT * FROM usuarios WHERE email = ?",
        [email]
      );
  
      if (existingUser.length > 0) {
        ctx.response.status = 400;
        ctx.response.body = {
          message: "El email ya está en uso.",
        };
        return;
      }
  
      // Encriptar la contraseña
      const hashedPassword = await bcrypt.hash(contraseña);
  
      // Insertar el nuevo usuario en la base de datos
      await client.query(
        "INSERT INTO usuarios (email, contraseña) VALUES (?, ?)",
        [email, hashedPassword]
      );
  
      ctx.response.status = 201;
      ctx.response.body = { message: "Usuario registrado exitosamente." };
    } catch (_err) {
      ctx.response.status = 500;
      ctx.response.body = { message: "Error al registrar el usuario." };
    }
  });