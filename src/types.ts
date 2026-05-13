export type TriState = "yes" | "partial" | "no" | null;
export type Level = "alto" | "medio" | "bajo" | null;
export type Verdict = "cuidar" | "mejorar" | "renegociar" | "eliminar" | null;
export type FilterVerdict = "proceder" | "refinar" | "descartar" | null;

export interface MatrixRow {
  c1: TriState;
  c2: TriState;
  c3: TriState;
  c4: TriState;
  note: string;
}

export interface RentRow {
  id: string;
  name: string;
  volumen: string;
  margen: string;
  complejidad: Level;
  cobranza: string;
  desgaste: Level;
  valor: Level;
  veredicto: Verdict;
}

export type IcebergStatus = "red" | "yellow" | "green" | null;

export interface IcebergItem {
  id: string;
  text: string;
  status?: IcebergStatus;
}

export interface MapaState {
  alianzas: string;
  actividades_criticas: string;
  valor: string;
  mercado: string;
  recursos_estrategicos: string;
  core_business: string;
  adquisicion_clientes: string;
}

export interface MatrizState {
  rows: Record<number, MatrixRow>;
  exercise: { m1: string; m2: string; m3: string };
}

export interface RentState {
  rows: RentRow[];
  exercise: { r1: string; r2: string; r3: string; r4: string; r5: string };
}

export interface IcebergState {
  above: IcebergItem[];
  below: IcebergItem[];
  padres: { p1: string; p2: string; p3: string; p4: string; p5: string };
  hijos: { h1: string; h2: string; h3: string; h4: string; h5: string };
}

export interface FiltroState {
  proposal: string;
  questions: { q1: string; q2: string; q3: string; q4: string; q5: string; q6: string; q7: string };
  verdict: FilterVerdict;
}

export interface CierreState {
  deliverable: { d1: string; d2: string; d3: string; d4: string; d5: string; d6: string };
  closure: { conclusion: string; decision: string; eliminacion: string };
  signature: { fecha: string; empresa: string; participantes: string; proxima: string };
}

export interface AppState {
  mapa: MapaState;
  matriz: MatrizState;
  rent: RentState;
  iceberg: IcebergState;
  filtro: FiltroState;
  cierre: CierreState;
}

export type TabId = "t1" | "t2" | "t3" | "t4" | "t5" | "t6";
