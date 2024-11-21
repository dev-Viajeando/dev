import { Router } from "https://deno.land/x/oak@v17.1.3/mod.ts";
import * as bcrypt from "https://deno.land/x/bcrypt@v0.4.1/mod.ts";
import { create } from "https://deno.land/x/djwt@v2.6/mod.ts";
import { client } from "../../db.ts";

export const loginRouter = new Router();

async function generateCryptoKey(secret: string) {
    const encoder = new TextEncoder();
    const keyData = encoder.encode(secret);
    const key = await crypto.subtle.importKey(
        "raw",
        keyData,
        { name: "HMAC", hash: { name: "SHA-256" } },
        false,
        ["sign", "verify"],
    );
    return key;
}

loginRouter.post("/login", async (ctx) => {
    try {
        const { email, contraseña } = await ctx.request.body.json();

        // Buscar el usuario por el email
        const usuarios = await client.query(
            "SELECT * FROM usuarios WHERE email = ?",
            [email],
        );

        if (usuarios.length === 0) {
            ctx.response.status = 404;
            ctx.response.body = { message: "Usuario no encontrado" };
            return;
        }

        const user = usuarios[0];

        // Verificar la contraseña con bcrypt
        const isPasswordCorrect = await bcrypt.compare(
            contraseña,
            user.contraseña,
        );

        if (!isPasswordCorrect) {
            ctx.response.status = 400;
            ctx.response.body = { message: "Contraseña incorrecta" };
            return;
        }

        // Si la autenticación fue exitosa, generar un token JWT
        const payload = { id: user.id, email: user.email }; // Puedes agregar más información si es necesario
        const secret = "mi_secreto"; // Este es tu "secreto" en forma de string
        const cryptoKey = await generateCryptoKey(secret); // Convertir el secreto a CryptoKey

        // Generar el token usando la clave criptográfica
        const token = await create(
            { alg: "HS256", typ: "JWT" },
            payload,
            cryptoKey,
        );

        // Devolver el token al cliente
        ctx.response.status = 200;
        ctx.response.body = { message: "Login exitoso", token: token };
    } catch (_err) {
        ctx.response.status = 500;
        ctx.response.body = { message: "Error al iniciar sesión." };
    }
});
