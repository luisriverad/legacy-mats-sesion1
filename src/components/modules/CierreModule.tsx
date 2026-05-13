import React from "react";
import { C, AREAS, DEFAULT_ABOVE, DEFAULT_BELOW } from "../../constants";
import type { AppState, CierreState } from "../../types";
import { PaneTitle, Prose, MicroLabel } from "../Shared";

interface CierreModuleProps {
  state: AppState;
  onChangeDeliverable: (key: keyof CierreState["deliverable"], value: string) => void;
  onChangeClosure: (key: keyof CierreState["closure"], value: string) => void;
  onChangeSignature: (key: keyof CierreState["signature"], value: string) => void;
}

const DELIVERABLES = [
  { key: "d1", num: "01", title: "Cómo genera valor la empresa", placeholder: "Conclusión clave del Mapa del Negocio Familiar…" },
  { key: "d2", num: "02", title: "Cómo gana dinero", placeholder: "Conclusión clave del Mapa de Rentabilidad…" },
  { key: "d3", num: "03", title: "Cuáles son sus procesos críticos", placeholder: "Conclusión clave de la Matriz de Valor Real…" },
  { key: "d4", num: "04", title: "Qué áreas sostienen la rentabilidad", placeholder: "Las áreas que más impactan el margen real…" },
  { key: "d5", num: "05", title: "Qué riesgos no son visibles desde afuera", placeholder: "Conclusión clave del Iceberg…" },
  { key: "d6", num: "06", title: "Qué debe entender la siguiente generación antes de opinar", placeholder: "Conclusión clave del Filtro de Criterio…" },
] as const;

const CLOSURE_CARDS = [
  { key: "conclusion", label: "Conclusión", borderColor: C.green, labelColor: C.greenDark },
  { key: "decision", label: "Decisión", borderColor: C.amber, labelColor: "#8a7138" },
  { key: "eliminacion", label: "Eliminación", borderColor: C.black, labelColor: C.black },
] as const;

const SIG_FIELDS = [
  { key: "fecha", label: "Fecha", placeholder: "DD / MM / AAAA" },
  { key: "empresa", label: "Empresa", placeholder: "Nombre de la empresa familiar" },
  { key: "participantes", label: "Participantes", placeholder: "Padres, hijos, consultor…" },
  { key: "proxima", label: "Próxima sesión", placeholder: "Fecha y foco" },
] as const;

export const CierreModule: React.FC<CierreModuleProps> = ({
  state, onChangeDeliverable, onChangeClosure, onChangeSignature,
}) => {
  const countFilled = (obj: Record<string, string>, keys: string[]) =>
    keys.filter((k) => obj[k] && obj[k].trim()).length;

  const mapaCount = countFilled(state.mapa as unknown as Record<string, string>, Object.keys(state.mapa));
  const mapaTotal = Object.keys(state.mapa).length;
  const matrizCount = Object.values(state.matriz.rows).filter(
    (r) => r.c1 || r.c2 || r.c3 || r.c4 || (r.note && r.note.trim())
  ).length;
  const rentCount = state.rent.rows.filter((r) => r.name && r.name.trim()).length;
  const rentCritical = state.rent.rows.filter(
    (r) => r.veredicto === "eliminar" || r.veredicto === "renegociar"
  ).length;
  const iceAboveCount = state.iceberg.above.filter(
    (i, idx) => i.text && i.text.trim() && i.text !== DEFAULT_ABOVE[idx]
  ).length + state.iceberg.above.filter((i, idx) => idx >= DEFAULT_ABOVE.length && i.text.trim()).length;
  const iceBelowCount = state.iceberg.below.filter(
    (i, idx) => i.text && i.text.trim()
  ).length;
  const verdictLabel: Record<string, string> = {
    proceder: "Proceder", refinar: "Refinar", descartar: "Descartar",
  };
  const verdict = state.filtro.verdict ? verdictLabel[state.filtro.verdict] : "—";

  const snapCards = [
    { label: "Mapa", value: `${mapaCount}/${mapaTotal}`, detail: "bloques completados", full: mapaCount === mapaTotal },
    { label: "Matriz de Valor", value: `${matrizCount}/${AREAS.length}`, detail: "áreas evaluadas", full: matrizCount >= 5 },
    { label: "Rentabilidad", value: `${rentCount}`, detail: `líneas · ${rentCritical} con veredicto crítico`, full: rentCount > 0 },
    { label: "Iceberg", value: `${iceBelowCount}`, detail: "elementos invisibles", full: iceBelowCount >= 5 },
    { label: "Filtro", value: verdict, detail: "veredicto de propuesta", full: !!state.filtro.verdict, small: true },
  ];

  return (
    <>
      <PaneTitle num="✦">Cierre Estratégico de la Sesión</PaneTitle>

      <MicroLabel style={{ marginTop: 18 }}>Snapshot del diagnóstico</MicroLabel>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 10, marginBottom: 24 }}>
        {snapCards.map((card, i) => (
          <div key={i} style={{
            background: card.full ? "rgba(113,178,72,0.08)" : C.bgSoft,
            border: `1px solid ${card.full ? C.green : C.border}`,
            borderRadius: 8, padding: "12px 14px",
          }}>
            <div style={{
              fontSize: 9, fontWeight: 700, letterSpacing: "0.14em",
              textTransform: "uppercase", color: C.muted, marginBottom: 6,
            }}>{card.label}</div>
            <div style={{
              fontSize: card.small ? 14 : 18, fontWeight: 800,
              color: card.full ? C.greenDark : C.black,
              lineHeight: 1.1, marginBottom: 3,
            }}>{card.value}</div>
            <div style={{ fontSize: 10.5, color: C.muted, lineHeight: 1.35 }}>{card.detail}</div>
          </div>
        ))}
      </div>

      <MicroLabel style={{ marginTop: 24 }}>Diagnóstico inicial en una página</MicroLabel>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 14 }}>
        {DELIVERABLES.map((d) => (
          <div key={d.key} style={{
            background: C.white, border: `1.5px solid ${C.borderStrong}`,
            borderRadius: 8, padding: "14px 16px",
            display: "flex", flexDirection: "column",
          }}>
            <span style={{
              display: "inline-block", background: C.green, color: C.black,
              fontWeight: 800, fontSize: 9.5, padding: "2px 7px", borderRadius: 3,
              letterSpacing: "0.08em", marginBottom: 6, width: "fit-content",
            }}>{d.num}</span>
            <h4 style={{ margin: "0 0 8px", fontSize: 13, fontWeight: 700, color: C.black, lineHeight: 1.3 }}>
              {d.title}
            </h4>
            <textarea
              value={state.cierre.deliverable[d.key as keyof CierreState["deliverable"]]}
              onChange={(e) => onChangeDeliverable(d.key as keyof CierreState["deliverable"], e.target.value)}
              placeholder={d.placeholder}
              style={{
                flex: 1, width: "100%", border: "none", background: "transparent",
                padding: 0, fontFamily: "Inter, sans-serif", fontSize: 12,
                color: C.black, resize: "vertical", minHeight: 60, lineHeight: 1.5,
              }}
            />
          </div>
        ))}
      </div>

      <MicroLabel style={{ marginTop: 24 }}>Cierre · Las 3C</MicroLabel>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginTop: 14 }}>
        {CLOSURE_CARDS.map((c) => (
          <div key={c.key} style={{
            borderRadius: 10, padding: "18px 20px", background: C.bgSoft,
            border: `1.5px solid ${C.border}`, borderTop: `5px solid ${c.borderColor}`,
            transition: "all 0.15s ease",
          }}>
            <div style={{
              fontSize: 9.5, fontWeight: 800, letterSpacing: "0.2em",
              textTransform: "uppercase", marginBottom: 8, color: c.labelColor,
            }}>{c.label}</div>
            <textarea
              value={state.cierre.closure[c.key]}
              onChange={(e) => onChangeClosure(c.key, e.target.value)}
              style={{
                width: "100%", border: "1.5px solid transparent",
                background: C.white, borderRadius: 6, padding: "10px 12px",
                fontFamily: "Inter, sans-serif", fontSize: 12.5, fontWeight: 500,
                color: C.black, resize: "vertical", minHeight: 88, lineHeight: 1.5,
              }}
            />
          </div>
        ))}
      </div>

      <MicroLabel style={{ marginTop: 24 }}>Firma de sesión</MicroLabel>
      <div style={{
        display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginTop: 14,
        padding: "18px 20px", background: C.bgSoft, border: `1px solid ${C.border}`, borderRadius: 10,
      }}>
        {SIG_FIELDS.map((f) => (
          <div key={f.key} style={{ display: "flex", flexDirection: "column", gap: 5 }}>
            <label style={{
              fontSize: 9.5, fontWeight: 700, letterSpacing: "0.12em",
              textTransform: "uppercase", color: C.muted,
            }}>{f.label}</label>
            <input
              type="text"
              value={state.cierre.signature[f.key]}
              onChange={(e) => onChangeSignature(f.key, e.target.value)}
              placeholder={f.placeholder}
              style={{
                border: `1px solid ${C.border}`, background: C.white,
                borderRadius: 5, padding: "8px 10px",
                fontFamily: "Inter, sans-serif", fontSize: 12, color: C.black,
              }}
            />
          </div>
        ))}
      </div>
    </>
  );
};
