import server from './server'
import {db} from './Config/db'

const port = process.env.PORT || 3000;

async function startServer() {
  try {
    await db.authenticate();
    console.log('Conexión a la base de datos establecida.');

    // Sincroniza los modelos con la base de datos
    await db.sync();
    console.log('Base de datos y modelos sincronizados.');

    server.listen(port, () => {
      console.log(`Servidor escuchando en el puerto ${port}`);
    });
  } catch (error) {
    console.error('Error durante la inicialización:', error);
  }
}

startServer();