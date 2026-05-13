import type { MapaState, MatrixRow, RentRow, AppState } from "./types";

export const STORAGE_KEY = "profit120_sesion_diagnostico_v1";

export const C = {
  black: "#1F2225",
  green: "#71B248",
  greenDark: "#5fa03e",
  greenLight: "#a8d088",
  amber: "#C8A85A",
  white: "#FFFFFF",
  bgSoft: "#F6F7F5",
  border: "#E3E5E0",
  borderStrong: "#1F2225",
  muted: "#5A5E62",
  sky: "#EAF0F2",
  water: "#1F2A30",
  waterMid: "#2C3A42",
};

export const AREAS = [
  "Ventas",
  "Producción / operación",
  "Compras",
  "Administración",
  "Finanzas",
  "Servicio al cliente",
  "Dirección",
  "Logística",
  "Tecnología",
  "Personas clave",
];

export const DEFAULT_ABOVE = [
  "Ventas",
  "Clientes",
  "Oficinas",
  "Productos",
  "Marca",
  "Redes sociales",
  "Personal",
];

export const DEFAULT_BELOW = [
  "Flujo",
  "Márgenes",
  "Deuda",
  "Riesgos laborales",
  "Problemas fiscales",
  "Conflictos internos",
  "Dependencia del fundador",
  "Errores operativos",
  "Inventario",
  "Cobranza",
  "Decisiones históricas",
];

export const DEFAULTS_CLOSURE = {
  conclusion: "No se puede dirigir lo que no se entiende.",
  decision: "Antes de opinar, la siguiente generación debe aprender a leer el negocio completo.",
  eliminacion: "Se elimina la crítica superficial sin evidencia, sin contexto y sin responsabilidad.",
};

export const MAPA_HINTS: Record<keyof MapaState, string> = {
  alianzas: "Los aliados clave que potencian o sostienen el negocio.",
  actividades_criticas:
    '"Si dejas de hacer esto, el negocio se cae. Si lo haces mal, se nota. Si lo haces bien, el cliente lo agradece."',
  valor: 'Es el "núcleo" de la empresa. El "core", lo que realmente hace la empresa. Comienza diciendo "Nuestra empresa se dedica a..."',
  mercado: "El cliente ideal: a quién atiendes y por qué te eligen a ti.",
  recursos_estrategicos:
    '"Si mañana pierdes este recurso… ¿el negocio sigue en pie o se desploma?"',
  core_business:
    'Es la segunda parte, es decir "a través de...". Aquí viene la lista de productos y servicios a los que se dedica la empresa',
  adquisicion_clientes:
    '"Los caminos clave para llegar al cliente ideal, comunicar tu propuesta de valor, entregarla y mantener la relación viva."',
};

export const newId = (): string =>
  `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

export const emptyMatrixRow = (): MatrixRow => ({
  c1: null,
  c2: null,
  c3: null,
  c4: null,
  note: "",
});

export const emptyRentRow = (): RentRow => ({
  id: newId(),
  name: "",
  volumen: "",
  margen: "",
  complejidad: null,
  cobranza: "",
  desgaste: null,
  valor: null,
  veredicto: null,
});

export const defaultState = (): AppState => ({
  mapa: {
    alianzas: "",
    actividades_criticas: "",
    valor: "",
    mercado: "",
    recursos_estrategicos: "",
    core_business: "",
    adquisicion_clientes: "",
  },
  matriz: {
    rows: AREAS.reduce(
      (acc, _, i) => ({ ...acc, [i]: emptyMatrixRow() }),
      {} as Record<number, MatrixRow>
    ),
    exercise: { m1: "", m2: "", m3: "" },
  },
  rent: {
    rows: [emptyRentRow(), emptyRentRow(), emptyRentRow()],
    exercise: { r1: "", r2: "", r3: "", r4: "", r5: "" },
  },
  iceberg: {
    above: DEFAULT_ABOVE.map((text) => ({ id: newId(), text })),
    below: DEFAULT_BELOW.map((text) => ({ id: newId(), text })),
    padres: { p1: "", p2: "", p3: "", p4: "", p5: "" },
    hijos: { h1: "", h2: "", h3: "", h4: "", h5: "" },
  },
  filtro: {
    proposal: "",
    questions: { q1: "", q2: "", q3: "", q4: "", q5: "", q6: "", q7: "" },
    verdict: null,
  },
  cierre: {
    deliverable: { d1: "", d2: "", d3: "", d4: "", d5: "", d6: "" },
    closure: { ...DEFAULTS_CLOSURE },
    signature: { fecha: "", empresa: "", participantes: "", proxima: "" },
  },
});
