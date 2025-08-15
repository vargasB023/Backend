import { Router, Request, Response } from 'express';

const router = Router();

router.get('/', (req: Request, res: Response) => {
  const baseUrl = `${req.protocol}://${req.get('host')}/api`;

  res.json({
    entrenador: `${baseUrl}/entrenador`,
    perfil_entrenador: `${baseUrl}/perfil_entrenador`,
    deportista: `${baseUrl}/deportista`,
    perfil_deportista: `${baseUrl}/perfil_deportista`,
    equipo: `${baseUrl}/equipo`,
    asistencia: `${baseUrl}/asistencia`,
    ejercicio: `${baseUrl}/ejercicio`,
    sesion: `${baseUrl}/sesion`,
    microciclo: `${baseUrl}/microciclo`,
    h_lesiones_antes: `${baseUrl}/h_lesiones_antes`,
    h_lesiones_despues: `${baseUrl}/h_lesiones_despues`,
    plan_de_entrenamiento: `${baseUrl}/plan_de_entrenamiento`,
    evaluacion: `${baseUrl}/evaluacion`,
    evaluacion_tecnica: `${baseUrl}/evacluacion_Tecnica`,
    evaluacion_fisica: `${baseUrl}/evaluacion_Fisica`,
    cronograma: `${baseUrl}/cronograma`
  });
});

export default router;
