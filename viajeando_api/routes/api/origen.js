import express from 'express';
import mysql from 'mysql2';

// Configuración de la base de datos
const connection = mysql.createConnection({
  host: 'viajeando.com.ar',
  user: 'viajeando_viajeando',
  password: '#DA51MA68SO83#',
  database: 'viajeando_database_app',
  port: 3306,
});

const origenRouter = express.Router();

// Endpoint para obtener los orígenes
origenRouter.get("/origen", (_req, res) => {
  connection.query("SELECT * FROM ORIGEN", (err, results) => {
    if (err) {
      console.error("Error al obtener los orígenes:", err);
      return res.status(500).json({ message: "Error al obtener los orígenes." });
    }

    res.status(200).json(results);
  });
});

export default origenRouter;
