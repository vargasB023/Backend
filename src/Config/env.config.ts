import dotenv from "dotenv";
import dotenvExpand from "dotenv-expand";

// Carga y expande las variables del archivo .env
const myEnv = dotenv.config();
dotenvExpand.expand(myEnv);

// Solo muestra información sensible en desarrollo
if (process.env.NODE_ENV !== "production") {
  console.log("Variables de entorno cargadas correctamente.");
  console.log("DB_HOST:", process.env.DB_HOST);
  console.log("DB_DATABASE:", process.env.DB_DATABASE);
}

export {};
