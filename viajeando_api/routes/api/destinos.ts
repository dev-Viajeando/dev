import { Router } from "https://deno.land/x/oak@v17.1.3/mod.ts";
import { client } from "../../db.ts";

export const destinosRouter = new Router();

destinosRouter
  .get("/destinos", async (ctx) => {
    const destinos = await client.query("SELECT * FROM DESTINOS");
    ctx.response.body = destinos;
  })
  .get("/destinos/:id", async (ctx) => {
    try {
      const { id } = ctx.params;
      const destino = await client.query("SELECT * FROM DESTINOS WHERE ID = ?", [id]);

      if (destino.length === 0) {
        ctx.response.status = 404;
        ctx.response.body = { message: "Destino no encontrado" };
        return;
      }

      ctx.response.status = 200;
      ctx.response.body = destino[0];
    } catch (_err) {
      ctx.response.status = 500;
      ctx.response.body = { message: "Error al obtener el destino." };
    }
  });