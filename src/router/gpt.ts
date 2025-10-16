import "dotenv/config";
import { Router, Request, Response } from "express";
import axios, { AxiosResponse } from "axios";
import OpenAI from "openai";

const router = Router();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

interface Lesion {
  ID_Deportista: number;
  añadir_Lesion_Antes?: string;
  añadir_Lesion_Despues?: string;
  gravedad?: string;
  dolor_Molestia?: string;
  recaidas?: number | string;
}

interface Deportista {
  ID_Deportista: number;
  ID_Equipo?: number;
  nombre_Completo: string;
  no_Documento?: string;
  fecha_Nacimiento?: string;
  genero?: string;
  direccion?: string;
  telefono?: string;
  email?: string;
  posicion?: string;
  dorsal?: string;
  equipo?: {
    ID_Equipo: number;
    nombre_Equipo: string;
    categoria?: string;
    liga?: string;
  }[];
}

interface Entrenador {
  ID_Entrenador: number;
  nombre_Completo: string;
  telefono?: string;
  email?: string;
  especialidad?: string;
  certificacion?: string;
}

interface Plan {
  ID_Plan: number;
  ID_Equipo?: number;
  nombre_Plan: string;
  objetivo?: string;
  fecha_inicio?: string;
  fecha_fin?: string;
  estado?: string;
}

interface Microciclo {
  ID_Plan?: number;
  nombre_Microciclo?: string;
  fecha_Inicio?: string;
  fecha_Fin?: string;
  objetivos?: string;
  intensidad?: string;
}

interface Equipo {
  ID_Equipo: number;
  nombre_Equipo?: string;
  categoria?: string;
  liga?: string;
  deportista?: Deportista[];
  [k: string]: any;
}

const normalize = (s?: string) =>
  (s || "")
    .toString()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, " ")
    .trim();

router.post("/", async (req: Request, res: Response) => {
  try {
    const { message } = req.body as { message?: string };
    if (!message) return res.status(400).json({ error: "El campo 'message' es obligatorio." });

    const [
      lesionesAntesSettled,
      lesionesDespuesSettled,
      deportistasLesionadosSettled,
      planesSettled,
      microciclosSettled,
      deportistasTodosSettled,
      entrenadoresSettled,
      equiposSettled
    ] = (await Promise.allSettled([
      axios.get<Lesion[]>("https://backend-5gwv.onrender.com/api/h_lesiones_antes"),
      axios.get<Lesion[]>("https://backend-5gwv.onrender.com/api/h_lesiones_despues"),
      axios.get<Deportista[]>("https://backend-5gwv.onrender.com/api/deportista/lesionados"),
      axios.get<Plan[]>("https://backend-5gwv.onrender.com/api/plan_de_entrenamiento"),
      axios.get<Microciclo[]>("https://backend-5gwv.onrender.com/api/microciclo"),
      axios.get<Deportista[]>("https://backend-5gwv.onrender.com/api/deportista"),
      axios.get<Entrenador[]>("https://backend-5gwv.onrender.com/api/entrenador"),
      axios.get<Equipo[]>("https://backend-5gwv.onrender.com/api/equipo")
    ])) as [
      PromiseSettledResult<AxiosResponse<Lesion[]>>,
      PromiseSettledResult<AxiosResponse<Lesion[]>>,
      PromiseSettledResult<AxiosResponse<Deportista[]>>,
      PromiseSettledResult<AxiosResponse<Plan[]>>,
      PromiseSettledResult<AxiosResponse<Microciclo[]>>,
      PromiseSettledResult<AxiosResponse<Deportista[]>>,
      PromiseSettledResult<AxiosResponse<Entrenador[]>>,
      PromiseSettledResult<AxiosResponse<Equipo[]>>
    ];

    const lesionesAntes = lesionesAntesSettled.status === "fulfilled" ? lesionesAntesSettled.value.data : [];
    const lesionesDespues = lesionesDespuesSettled.status === "fulfilled" ? lesionesDespuesSettled.value.data : [];
    const deportistasLesionados =
      deportistasLesionadosSettled.status === "fulfilled" ? deportistasLesionadosSettled.value.data : [];
    const planes = planesSettled.status === "fulfilled" ? planesSettled.value.data : [];
    const microciclos = microciclosSettled.status === "fulfilled" ? microciclosSettled.value.data : [];
    const deportistasTodos = deportistasTodosSettled.status === "fulfilled" ? deportistasTodosSettled.value.data : [];
    const entrenadores = entrenadoresSettled.status === "fulfilled" ? entrenadoresSettled.value.data : [];
    const equipos = equiposSettled.status === "fulfilled" ? equiposSettled.value.data : [];

    const todasLasLesiones: Lesion[] = [...lesionesAntes, ...lesionesDespues];

    const mensajeNorm = normalize(message);
    let equipoEncontrado: Equipo | undefined;

    if (Array.isArray(equipos) && equipos.length > 0) {
      equipoEncontrado =
        equipos.find((e) => mensajeNorm.includes(normalize(e.nombre_Equipo))) ||
        equipos.find((e) => normalize(e.nombre_Equipo || "").includes(mensajeNorm)) ||
        equipos.find((e) => {
          const n = normalize(e.nombre_Equipo);
          return (
            n.includes(mensajeNorm) ||
            mensajeNorm.includes(n) ||
            mensajeNorm.includes(n.replace("equipo", "").trim()) ||
            n.replace("equipo", "").trim() === mensajeNorm.replace("equipo", "").trim()
          );
        });
    }

    let teamMemberList: Deportista[] = [];

    if (equipoEncontrado && Array.isArray(deportistasTodos)) {
      const nombreEq = normalize(equipoEncontrado.nombre_Equipo);
      teamMemberList = deportistasTodos.filter((d) =>
        (d.equipo || []).some((eq) => normalize(eq.nombre_Equipo) === nombreEq)
      );
    }

    if (!equipoEncontrado && teamMemberList.length === 0 && equipos.length > 0) {
      const probable = equipos.find((e) => mensajeNorm.includes(normalize(e.nombre_Equipo)));
      if (probable) {
        equipoEncontrado = probable;
        const nombreEq = normalize(probable.nombre_Equipo);
        teamMemberList = deportistasTodos.filter((d) =>
          (d.equipo || []).some((eq) => normalize(eq.nombre_Equipo) === nombreEq)
        );
      }
    }

    if (!equipoEncontrado) {
      console.log("No se encontró equipo, usando contexto general.");
    } else {
      console.log(`Equipo detectado: ${equipoEncontrado.nombre_Equipo}`);
    }

    const injuredIdsSet = new Set<number>();
    deportistasLesionados.forEach((d) => injuredIdsSet.add(d.ID_Deportista));
    todasLasLesiones.forEach((l) => injuredIdsSet.add(l.ID_Deportista));

    const deportistasFiltrados =
      teamMemberList.length > 0
        ? teamMemberList.filter((d) => injuredIdsSet.has(d.ID_Deportista))
        : deportistasTodos.filter((d) => injuredIdsSet.has(d.ID_Deportista));

    const contextoLesiones = deportistasFiltrados
      .map((d) => {
        const lesiones = todasLasLesiones.filter((l) => l.ID_Deportista === d.ID_Deportista);
        const detalle = lesiones
          .map(
            (l) =>
              `• ${l.añadir_Lesion_Antes || l.añadir_Lesion_Despues || "No especificada"} | Gravedad: ${
                l.gravedad || "N/A"
              } | Dolor: ${l.dolor_Molestia || "N/A"} | Recaídas: ${l.recaidas ?? "N/A"}`
          )
          .join("\n");
        return `👤 ${d.nombre_Completo} (${d.posicion || "Sin posición"})\n${detalle || "Sin historial de lesión."}`;
      })
      .join("\n\n");

    const planesFiltrados = equipoEncontrado
      ? planes.filter(
          (p) =>
            normalize(p.nombre_Plan || "").includes(normalize(equipoEncontrado!.nombre_Equipo)) ||
            p.ID_Equipo === equipoEncontrado?.ID_Equipo
        )
      : planes;

    const contextoPlanes = planesFiltrados
      .map((plan) => {
        const microDePlan = microciclos.filter((m) => m.ID_Plan === plan.ID_Plan);
        const microText = microDePlan.length
          ? microDePlan
              .map(
                (m) =>
                  `- ${m.nombre_Microciclo || "Sin nombre"} (${m.fecha_Inicio || "?"} → ${m.fecha_Fin || "?"}) | Objetivo: ${
                    m.objetivos || "N/A"
                  } | Intensidad: ${m.intensidad || "N/A"}`
              )
              .join("\n")
          : "Sin microciclos.";
        return `🏋️ ${plan.nombre_Plan}\n🎯 ${plan.objetivo || "N/A"}\n📅 ${plan.fecha_inicio || "?"} → ${
          plan.fecha_fin || "?"
        }\n📈 ${plan.estado || "N/A"}\n${microText}`;
      })
      .join("\n\n");

    const contextoDeportistas = (teamMemberList.length > 0 ? teamMemberList : deportistasTodos)
      .map(
        (d) =>
          `👟 ${d.nombre_Completo} (${d.genero || "N/A"}) | Equipo: ${
            d.equipo?.[0]?.nombre_Equipo || "?"} | Dorsal: ${d.dorsal || "?"} | 📞 ${
            d.telefono || "N/A"
          } | ✉️ ${d.email || "N/A"}`
      )
      .join("\n");

    const contextoEntrenadores = entrenadores
      .map(
        (e) =>
          `🧑‍🏫 ${e.nombre_Completo} | 📞 ${e.telefono || "N/A"} | ✉️ ${e.email || "N/A"} | Especialidad: ${
            e.especialidad || "N/A"
          }`
      )
      .join("\n");

    const prompt = `
Contexto disponible para el equipo ${equipoEncontrado?.nombre_Equipo ?? "general"}:

=== PLANES ===
${contextoPlanes || "Sin planes registrados."}

=== DEPORTISTAS LESIONADOS ===
${contextoLesiones || "No hay lesiones registradas (para el filtro actual)."}

=== DEPORTISTAS ===
${contextoDeportistas || "No hay deportistas registrados (para el filtro actual)."}

=== ENTRENADORES ===
${contextoEntrenadores || "No hay entrenadores registrados."}

Instrucciones:
- Si el usuario menciona un equipo (por texto o número), usa ese equipo para filtrar.
- Si no hay equipo, responde de forma general.
- Si menciona un entrenamiento externo, analiza compatibilidad con lesiones.
- Si pide lesionados graves/moderados/leves, filtra por 'gravedad'.
- Si pide deportistas o entrenadores, busca por nombre o documento.
- Si pide contacto, incluye teléfono y correo.
- No inventes datos.
- Sé preciso, claro y directo.
- Si falta información, indícalo explícitamente.

👉 Pregunta del usuario:
"${message}"
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.35,
      messages: [
        {
          role: "system",
          content:
            "Eres un asistente experto en gestión deportiva y planificación. Responde con precisión, sin inventar datos.",
        },
        { role: "user", content: prompt },
      ],
    });

    const reply =
      completion?.choices?.[0]?.message?.content?.trim() ||
      "No se pudo generar una respuesta con los datos disponibles.";

    res.json({ reply });
  } catch (error: any) {
    console.error("❌ Error GPT:", error.message || error);
    res.status(500).json({ error: "Error al procesar la solicitud GPT", details: error.message || error });
  }
});

export default router;
