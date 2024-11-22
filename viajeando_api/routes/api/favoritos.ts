import { Router } from "https://deno.land/x/oak@v17.1.3/mod.ts";
import { client } from "../../db.ts";

export const favoritosRouter = new Router();

// Endpoint para sincronizar los favoritos de un usuario
favoritosRouter.patch("/favoritos/sync", async (ctx) => {
  try {
    // Obtener los datos del cuerpo de la solicitud
    const { id_usuario, favoritos } = await ctx.request.body.json();

    if (!id_usuario || !Array.isArray(favoritos)) {
      ctx.response.status = 400;
      ctx.response.body = {
        message: "Se requiere un id_usuario y una lista de destinos favoritos.",
      };
      return;
    }

    // Eliminar duplicados en la lista de favoritos
    const uniqueFavoritos = [...new Set(favoritos)];

    // Eliminar los favoritos que ya no están en la lista (marcando como no favoritos)
    if (uniqueFavoritos.length > 0) {
      await client.query(
        `
        UPDATE FAVORITOS
        SET IS_FAVORITED = 0
        WHERE ID_USUARIO = ? AND ID_DESTINO NOT IN (${uniqueFavoritos.map(() => "?").join(", ")})
        `,
        [id_usuario, ...uniqueFavoritos],
      );
    } else {
      // Si la lista está vacía, elimina todos los favoritos del usuario
      await client.query(
        "DELETE FROM FAVORITOS WHERE ID_USUARIO = ?",
        [id_usuario],
      );
    }

    // Insertar o actualizar la relación de favoritos (si no existe, la crea con IS_FAVORITED = 1)
    if (uniqueFavoritos.length > 0) {
      for (const id_destino of uniqueFavoritos) {
        // Verificamos si ya existe la relación, si no, la creamos
        const [existing] = await client.query(
          "SELECT * FROM FAVORITOS WHERE ID_USUARIO = ? AND ID_DESTINO = ?",
          [id_usuario, id_destino],
        );

        if (existing) {
          // Si la relación ya existe, la actualizamos
          await client.query(
            "UPDATE FAVORITOS SET IS_FAVORITED = 1 WHERE ID_USUARIO = ? AND ID_DESTINO = ?",
            [id_usuario, id_destino],
          );
        } else {
          // Si no existe, la creamos con IS_FAVORITED = 1
          await client.query(
            "INSERT INTO FAVORITOS (ID_USUARIO, ID_DESTINO, IS_FAVORITED) VALUES (?, ?, ?)",
            [id_usuario, id_destino, 1], // Marcamos como favorito
          );
        }
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

// Endpoint para obtener los favoritos de un usuario por su id
favoritosRouter.get("/favoritos/:id", async (ctx) => {
  try {
    const { id } = ctx.params;

    // Obtener los destinos favoritos del usuario por id
    const favoritos = await client.query(
      "SELECT d.* FROM FAVORITOS f JOIN DESTINOS d ON f.ID_DESTINO = d.ID WHERE f.ID_USUARIO = ? AND f.IS_FAVORITED = 1", // Filtramos por IS_FAVORITED = 1
      [id],
    );

    // Si no hay favoritos, devuelve un array vacío
    ctx.response.status = 200;
    ctx.response.body = favoritos.length > 0 ? favoritos : []; // Asegura que siempre se devuelva un array
  } catch (err) {
    console.error("Error al obtener favoritos:", err);
    ctx.response.status = 500;
    ctx.response.body = { message: "Error al obtener los favoritos." };
  }
});
