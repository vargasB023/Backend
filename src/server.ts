import express from 'express';
import colors from 'colors';
import morgan from 'morgan';
import {db} from './Config/db';
import cors from 'cors'
import indexRouter from './router_index';
import entrenador_Router from './router/entrenador_Router'
import perfil_Entrenador_Router from './router/perfil_Entrenador_Router'
import deportista_Router from './router/deportista_Router'
import perfil_Deportista_Router from './router/perfil_Deportista_Router'
import equipo_Router from './router/equipo_Router'
import ejercicio_Router from './router/ejercicio_Router'
import sesion_Router from './router/sesion_Router'
import microciclo_Router from './router/microciclo_Router'
import plan_de_entrenamiento_Router from './router/plan_de_entrenamiento_Router'
import h_Lesiones_Antes_Router from './router/h_Lesiones_Antes_Router'
import h_Lesiones_Despues_Router from './router/h_Lesiones_Despues_Router'
import asistencia_Router from './router/asistencia_Router'
import evaluacion_Deportiva_Router from './router/evaluacion_Deportiva_Router'
import evaluacion_Tecnica_Router from './router/evaluacion_Fisica_Router'
import evaluacion_Fisica_Router from './router/evaluacion_Tecnica_Router'
import cronograma_Router from './router/Cronograma_Router'

import fileUpload from 'express-fileupload'

async function connectDB() {
  try {
    await db.authenticate(); // Verifica la conexión a la base de datos
    console.log(colors.blue.bold('Conexión exitosa a la BD'));

    // Ejemplo de consulta utilizando Sequelize
    try {
      const [results, metadata] = await db.query('SELECT * FROM Entrenador LIMIT 5');
      console.log('Datos de ejemplo:', results);
    } catch (error) {
      console.error('Error al ejecutar la consulta:', error);
    }

  } catch (error) {
    console.error('Error al conectar a la BD:', error);
    console.log(colors.red.bold('Falló la conexión a la BD'));
  }
}

connectDB();
const app = express();

app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true  
}));


app.use(fileUpload({
  useTempFiles:true,
  tempFileDir:"./uploads",
  limits: { fileSize: 100 * 1024 * 1024 } // 
}));

app.use(morgan('dev'))
app.use(express.json())

app.use('/api', indexRouter);
app.use('/api/entrenador', entrenador_Router)
app.use('/api/perfil_entrenador',perfil_Entrenador_Router)
app.use('/api/deportista', deportista_Router)
app.use('/api/perfil_deportista', perfil_Deportista_Router)
app.use('/api/equipo', equipo_Router)
app.use('/api/asistencia', asistencia_Router)
app.use('/api/ejercicio',ejercicio_Router )
app.use('/api/sesion',sesion_Router)
app.use('/api/microciclo', microciclo_Router)
app.use('/api/deportista',deportista_Router)
app.use('/api/h_lesiones_antes', h_Lesiones_Antes_Router)
app.use('/api/h_lesiones_despues', h_Lesiones_Despues_Router)
app.use('/api/plan_de_entrenamiento',plan_de_entrenamiento_Router)
app.use('/api/evaluacion',evaluacion_Deportiva_Router)
app.use('/api/evacluacion_Tecnica',evaluacion_Tecnica_Router)
app.use('/api/evaluacion_Fisica',evaluacion_Fisica_Router)
app.use('/api/cronograma',cronograma_Router)


export default app;

