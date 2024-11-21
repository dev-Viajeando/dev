import { Router } from "https://deno.land/x/oak@v17.1.3/mod.ts";
import { client } from "../../db.ts";

export const favoritosRouter = new Router();

// Endpoint para marcar un destino como favorito
// Endpoint para marcar un destino como favorito
favoritosRouter.post("/favoritos", async (ctx) => {
  try {
    // Obtener los datos del cuerpo de la solicitud
    const { email, id_destino } = await ctx.request.body.json();

    // Verificar si el usuario existe usando el correo electrónico
    const usuarioExistente = await client.query(
      "SELECT * FROM usuarios WHERE email = ?",
      [email],
    );

    if (usuarioExistente.length === 0) {
      ctx.response.status = 404;
      ctx.response.body = { message: "El usuario no existe." };
      return;
    }

    // Obtener el id del usuario desde el correo
    const id_usuario = usuarioExistente[0].id;

    // Validar si el destino ya fue marcado como favorito por el usuario
    const favoritoExistente = await client.query(
      "SELECT * FROM FAVORITOS WHERE ID_USUARIO = ? AND ID_DESTINO = ?",
      [id_usuario, id_destino],
    );

    if (favoritoExistente.length > 0) {
      ctx.response.status = 400;
      ctx.response.body = { message: "El destino ya está en favoritos." };
      return;
    }

    // Insertar el nuevo favorito en la base de datos
    await client.query(
      "INSERT INTO FAVORITOS (ID_USUARIO, ID_DESTINO, FECHA) VALUES (?, ?, ?)",
      [id_usuario, id_destino, new Date()],
    );

    ctx.response.status = 201;
    ctx.response.body = { message: "Destino agregado a favoritos." };
  } catch (err) {
    console.error("Error al agregar favorito:", err);
    ctx.response.status = 500;
    ctx.response.body = { message: "Error al agregar el destino a favoritos." };
  }
});

// Endpoint para obtener los favoritos de un usuario
favoritosRouter.get("/favoritos/:id_usuario", async (ctx) => {
  try {
    const { id_usuario } = ctx.params;

    // Obtener los favoritos del usuario
    const favoritos = await client.query(
      "SELECT d.* FROM FAVORITOS f JOIN DESTINOS d ON f.ID_DESTINO = d.ID WHERE f.ID_USUARIO = ?",
      [id_usuario],
    );

    ctx.response.status = 200;
    ctx.response.body = favoritos;
  } catch (err) {
    console.error("Error al obtener favoritos:", err);
    ctx.response.status = 500;
    ctx.response.body = { message: "Error al obtener los favoritos." };
  }
});

// Endpoint para quitar un destino de favoritos
favoritosRouter.delete("/favoritos", async (ctx) => {
  try {
    const { email, id_destino } = await ctx.request.body.json();

    // Buscar el ID del usuario basado en su email
    const usuario = await client.query(
      "SELECT id FROM usuarios WHERE email = ?",
      [email],
    );

    if (usuario.length === 0) {
      ctx.response.status = 404;
      ctx.response.body = { message: "Usuario no encontrado." };
      return;
    }

    const id_usuario = usuario[0].id; // Obtener el id_usuario del usuario encontrado

    // Eliminar el favorito
    const resultado = await client.query(
      "DELETE FROM FAVORITOS WHERE ID_USUARIO = ? AND ID_DESTINO = ?",
      [id_usuario, id_destino],
    );

    if (resultado.affectedRows === 0) {
      ctx.response.status = 404;
      ctx.response.body = { message: "El destino no está en favoritos." };
      return;
    }

    ctx.response.status = 200;
    ctx.response.body = { message: "Destino eliminado de favoritos." };
  } catch (err) {
    console.error("Error al eliminar favorito:", err);
    ctx.response.status = 500;
    ctx.response.body = {
      message: "Error al eliminar el destino de favoritos.",
    };
  }
});

// Endpoint para verificar si un destino está en los favoritos de un usuario
favoritosRouter.post("/favoritos/check", async (ctx) => {
  try {
    // Obtener los datos del cuerpo de la solicitud
    const { email, id_destino } = await ctx.request.body.json();

    if (!email || !id_destino) {
      ctx.response.status = 400;
      ctx.response.body = { message: "Se requiere un email y un id_destino." };
      return;
    }

    // Verificar si el usuario existe usando el correo electrónico
    const usuarioExistente = await client.query(
      "SELECT * FROM usuarios WHERE email = ?",
      [email],
    );

    if (usuarioExistente.length === 0) {
      ctx.response.status = 404;
      ctx.response.body = { message: "El usuario no existe." };
      return;
    }

    const id_usuario = usuarioExistente[0].id; // Obtener el id del usuario

    // Verificar si el destino está marcado como favorito por el usuario
    const favoritoExistente = await client.query(
      "SELECT * FROM FAVORITOS WHERE ID_USUARIO = ? AND ID_DESTINO = ?",
      [id_usuario, id_destino],
    );

    // Si el destino está en favoritos, devuelve true, sino false
    ctx.response.status = 200;
    ctx.response.body = { isFavorite: favoritoExistente.length > 0 };
  } catch (err) {
    console.error("Error al verificar favoritos:", err);
    ctx.response.status = 500;
    ctx.response.body = {
      message: "Error al verificar si el destino está en favoritos.",
    };
  }
});

// Endpoint para sincronizar los favoritos de un usuario
favoritosRouter.post("/favoritos/sync", async (ctx) => {
  try {
    // Obtener los datos del cuerpo de la solicitud
    const { email, favoritos } = await ctx.request.body.json();

    if (!email || !Array.isArray(favoritos)) {
      ctx.response.status = 400;
      ctx.response.body = {
        message: "Se requiere un email y una lista de destinos favoritos.",
      };
      return;
    }

    // Verificar si el usuario existe usando el correo electrónico
    const usuarioExistente = await client.query(
      "SELECT * FROM usuarios WHERE email = ?",
      [email],
    );

    if (usuarioExistente.length === 0) {
      ctx.response.status = 404;
      ctx.response.body = { message: "El usuario no existe." };
      return;
    }

    const id_usuario = usuarioExistente[0].id; // Obtener el id del usuario

    // Eliminar los favoritos que ya no están en la lista
    await client.query(
      `DELETE FROM FAVORITOS WHERE ID_USUARIO = ? AND ID_DESTINO NOT IN (${favoritos.map(() => '?').join(', ')})`,
      [id_usuario, ...favoritos]
    );

    // Agregar los nuevos favoritos
    for (const id_destino of favoritos) {
      // Verificar si ya está marcado como favorito
      const favoritoExistente = await client.query(
        "SELECT * FROM FAVORITOS WHERE ID_USUARIO = ? AND ID_DESTINO = ?",
        [id_usuario, id_destino],
      );

      if (favoritoExistente.length === 0) {
        // Insertar el nuevo favorito si no existe
        await client.query(
          "INSERT INTO FAVORITOS (ID_USUARIO, ID_DESTINO, FECHA) VALUES (?, ?, ?)",
          [id_usuario, id_destino, new Date()],
        );
      }
    }

    ctx.response.status = 200;
    ctx.response.body = { message: "Favoritos sincronizados correctamente." };
  } catch (err) {
    console.error("Error al sincronizar favoritos:", err);
    ctx.response.status = 500;
    ctx.response.body = { message: "Error al sincronizar los favoritos." };
  }
});
// Endpoint para obtener los favoritos de un usuario por su email
favoritosRouter.get("/favoritos/email/:email", async (ctx) => {
  try {
    const { email } = ctx.params;

    // Obtener el id del usuario desde el email
    const usuario = await client.query(
      "SELECT id FROM usuarios WHERE email = ?",
      [email]
    );

    if (usuario.length === 0) {
      ctx.response.status = 404;
      ctx.response.body = { message: "Usuario no encontrado." };
      return;
    }

    const id_usuario = usuario[0].id;

    // Obtener los destinos favoritos del usuario
    const favoritos = await client.query(
      "SELECT d.* FROM FAVORITOS f JOIN DESTINOS d ON f.ID_DESTINO = d.ID WHERE f.ID_USUARIO = ?",
      [id_usuario]
    );

    ctx.response.status = 200;
    ctx.response.body = favoritos;
  } catch (err) {
    console.error("Error al obtener favoritos:", err);
    ctx.response.status = 500;
    ctx.response.body = { message: "Error al obtener los favoritos." };
  }
});
