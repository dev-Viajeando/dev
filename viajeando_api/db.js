import mysql from "mysql2/promise";

// Crear la conexión con la base de datos
export const client = await mysql.createConnection({
  host: "viajeando.com.ar",
  user: "viajeando_viajeando",
  password: "#DA51MA68SO83#",
  database: "viajeando_database_app",
  port: 3306,
});
