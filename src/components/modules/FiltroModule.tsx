import React from "react";
import { C } from "../../constants";
import type { FiltroState, FilterVerdict } from "../../types";
import { PaneTitle, NextButton, MicroLabel } from "../Shared";

interface FiltroModuleProps {
  filtro: FiltroState;
  onChangeProposal: (v: string) => void;
  onChangeQuestion: (key: keyof FiltroState["questions"], value: string) => void;
  onChangeVerdict: (v: FilterVerdict) => void;
  onNext: () => void;
}

const CHIPS = [
  "Hay que meter más redes sociales.",
  "Hay que abrir otra sucursal.",
  "Hay que contratar más gente.",
  "Hay que cambiar el sistema.",
  "Hay que vender online.",
];

const QUESTIONS = [
  { num: "01", q: "¿Qué problema real estoy intentando resolver?", hint: "Define el problema, no el síntoma. No la idea — el dolor que la idea ataca.", placeholder: "El problema real es…" },
  { num: "02", q: "¿Qué evidencia tengo?", hint: "Datos, indicadores, observaciones concretas. No corazonadas.", placeholder: "La evidencia que sustenta esto es…" },
  { num: "03", q: "¿Qué impacto tendría en ventas, utilidad, flujo o riesgo?", hint: "Cuantifica donde puedas. Si no se puede medir, no se puede defender.", placeholder: "Impacto esperado en ventas/utilidad/flujo/riesgo…" },
  { num: "04", q: "¿Qué recursos requiere?", hint: "Dinero, tiempo, talento, atención del dueño. Lo intangible también cuesta.", placeholder: "Necesita…" },
  { num: "05", q: "¿Quién tendría que ejecutarlo?", hint: "Nombres, no funciones. Si no hay un responsable claro, no hay ejecución.", placeholder: "Responsable directo y equipo de apoyo…" },
  { num: "06", q: "¿Qué podría salir mal?", hint: "Riesgos operativos, financieros, de imagen, de equipo. Anticipar, no reaccionar.", placeholder: "Los riesgos principales son…" },
  { num: "07", q: "¿Cómo sabríamos si funcionó?", hint: "Métricas concretas, plazo y umbral de éxito.", placeholder: "Sabremos que funcionó si…" },
] as const;

interface VerdictOption {
  val: Exclude<FilterVerdict, null>;
  title: string;
  sub: string;
  bg: string;
  border: string;
  color: string;
}

const VERDICTS: VerdictOption[] = [
  { val: "proceder", title: "Proceder", sub: "La idea pasó el filtro. Hay evidencia, recursos y responsable. Avanzar.", bg: C.green, border: C.green, color: C.black },
  { val: "refinar", title: "Refinar", sub: "Tiene potencial pero le falta criterio. Volver al filtro antes de ejecutar.", bg: C.amber, border: C.amber, color: C.black },
  { val: "descartar", title: "Descartar", sub: "Era opinión, no decisión. La propuesta no resiste el filtro.", bg: C.black, border: C.black, color: C.white },
];

export const FiltroModule: React.FC<FiltroModuleProps> = ({
  filtro, onChangeProposal, onChangeQuestion, onChangeVerdict, onNext,
}) => (
  <>
    <PaneTitle num="05">Filtro de Criterio Empresarial</PaneTitle>

    <div style={{
      background: C.black, color: C.white, borderRadius: 12,
      padding: "28px 32px", marginBottom: 16, position: "relative", overflow: "hidden",
    }}>
      <div style={{
        position: "absolute", top: 0, left: 0, width: 5,
        height: "100%", background: C.green,
      }} />
      <div style={{
        fontSize: 26, fontWeight: 800, lineHeight: 1.15,
        letterSpacing: "-0.02em", margin: "0 0 12px",
      }}>
        Opinar <span style={{ color: C.green }}>no es lo mismo</span> que decidir.
      </div>
      <p style={{
        fontSize: 13, lineHeight: 1.55, opacity: 0.85,
        margin: 0, maxWidth: 680,
      }}>
        Una buena idea sin criterio puede convertirse en un problema caro. Antes de proponer algo, la siguiente generación debe poder defender la propuesta con evidencia, recursos, riesgos y métricas.
      </p>
    </div>

    <div style={{
      background: C.bgSoft, border: `1.5px solid ${C.borderStrong}`,
      borderRadius: 10, padding: "18px 20px", marginBottom: 18,
    }}>
      <label style={{
        display: "block", fontSize: 10, fontWeight: 700,
        letterSpacing: "0.14em", textTransform: "uppercase",
        color: C.greenDark, marginBottom: 8,
      }}>Propuesta a evaluar</label>
      <textarea
        value={filtro.proposal}
        onChange={(e) => onChangeProposal(e.target.value)}
        placeholder='Ej. "Hay que meter más redes sociales" · "Hay que abrir otra sucursal"…'
        rows={2}
        style={{
          width: "100%", border: `1.5px solid ${C.border}`, background: C.white,
          borderRadius: 6, padding: "12px 14px", fontFamily: "Inter, sans-serif",
          fontSize: 14.5, fontWeight: 600, color: C.black, resize: "vertical",
          minHeight: 48, lineHeight: 1.4,
        }}
      />
      <MicroLabel style={{ marginTop: 10, marginBottom: 6 }}>Propuestas típicas · click para usar</MicroLabel>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
        {CHIPS.map((c) => (
          <button
            key={c} type="button"
            onClick={() => onChangeProposal(c)}
            style={{
              background: C.white, border: `1px solid ${C.borderStrong}`,
              borderRadius: 100, padding: "6px 12px",
              fontFamily: "Inter, sans-serif", fontSize: 11, fontWeight: 500,
              color: C.black, cursor: "pointer", transition: "all 0.15s ease",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = C.black; e.currentTarget.style.color = C.white; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = C.white; e.currentTarget.style.color = C.black; }}
          >{c}</button>
        ))}
      </div>
    </div>

    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {QUESTIONS.map((qc, i) => {
        const key = `q${i + 1}` as keyof FiltroState["questions"];
        return (
          <div key={qc.num} style={{ display: "grid", gridTemplateColumns: "48px 1fr", gap: 14, alignItems: "stretch" }}>
            <div style={{
              background: C.black, color: C.green, borderRadius: 8,
              display: "flex", alignItems: "flex-start", justifyContent: "center",
              paddingTop: 14, fontWeight: 800, fontSize: 17,
            }}>{qc.num}</div>
            <div style={{
              background: C.bgSoft, border: `1.5px solid ${C.border}`,
              borderRadius: 8, padding: "14px 16px", transition: "all 0.15s ease",
            }}>
              <h3 style={{ fontSize: 14, fontWeight: 700, color: C.black, lineHeight: 1.3, margin: "0 0 3px" }}>{qc.q}</h3>
              <p style={{ fontSize: 10.5, fontWeight: 500, color: C.muted, fontStyle: "italic", margin: "0 0 8px" }}>{qc.hint}</p>
              <textarea
                value={filtro.questions[key]}
                onChange={(e) => onChangeQuestion(key, e.target.value)}
                placeholder={qc.placeholder}
                style={{
                  width: "100%", border: "none", background: "transparent",
                  padding: 0, fontFamily: "Inter, sans-serif", fontSize: 12.5,
                  color: C.black, resize: "vertical", minHeight: 38, lineHeight: 1.5,
                }}
              />
            </div>
          </div>
        );
      })}
    </div>

    <div style={{
      background: C.bgSoft, border: `1.5px solid ${C.borderStrong}`,
      borderRadius: 12, padding: "20px 22px", marginTop: 24,
    }}>
      <p style={{ fontSize: 15, fontWeight: 700, color: C.black, margin: "0 0 3px" }}>
        Después de pasar la propuesta por el filtro, ¿qué procede?
      </p>
      <p style={{ fontSize: 11.5, color: C.muted, fontStyle: "italic", margin: "0 0 14px" }}>
        Una decisión, no una opinión. Sin medias tintas.
      </p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
        {VERDICTS.map((v) => {
          const active = filtro.verdict === v.val;
          return (
            <button
              key={v.val} type="button"
              onClick={() => onChangeVerdict(active ? null : v.val)}
              style={{
                cursor: "pointer", borderRadius: 8, padding: "14px 16px",
                textAlign: "left", transition: "all 0.2s ease",
                fontFamily: "Inter, sans-serif",
                border: `2px solid ${v.border}`,
                background: active ? v.bg : C.white,
                color: active ? v.color : C.black,
              }}
              onMouseEnter={(e) => { if (!active) { e.currentTarget.style.background = v.bg; e.currentTarget.style.color = v.color; } }}
              onMouseLeave={(e) => { if (!active) { e.currentTarget.style.background = C.white; e.currentTarget.style.color = C.black; } }}
            >
              <div style={{ fontSize: 13, fontWeight: 800, letterSpacing: "0.04em", textTransform: "uppercase", marginBottom: 3 }}>
                {v.title}
              </div>
              <div style={{ fontSize: 11, lineHeight: 1.4, opacity: 0.85 }}>{v.sub}</div>
            </button>
          );
        })}
      </div>
    </div>

    <NextButton onClick={onNext} label="Ir al Cierre Estratégico ✦" variant="final" />
  </>
);
