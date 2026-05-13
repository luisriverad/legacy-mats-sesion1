import React from "react";
import { C, AREAS, emptyMatrixRow } from "../../constants";
import type { MatrizState, MatrixRow } from "../../types";
import { PaneTitle, Prose, NextButton, TriStateControl } from "../Shared";

interface MatrizModuleProps {
  matriz: MatrizState;
  onChangeRow: (idx: number, patch: Partial<MatrixRow>) => void;
  onChangeExercise: (key: "m1" | "m2" | "m3", value: string) => void;
  onNext: () => void;
}

const HEADERS = [
  "Área",
  "Actualmente, en nuestra empresa, ¿crea valor para el cliente?",
  "Actualmente, en nuestra empresa, ¿protege la rentabilidad?",
  "Actualmente, en nuestra empresa, ¿reduce riesgos?",
  "Actualmente, en nuestra empresa, ¿depende de una persona?",
  "Actualmente, en nuestra empresa, ¿qué pasa si falla?",
  "Score",
];

const triValue = (v: "yes" | "partial" | "no" | null): number => {
  if (v === "yes") return 10;
  if (v === "partial") return 5;
  return 0;
};

const scoreColors = (score: number, max: number): { bg: string; fg: string } => {
  const pct = max === 0 ? 0 : score / max;
  if (pct >= 0.7) return { bg: "#dff5d0", fg: "#2e7d32" };
  if (pct >= 0.4) return { bg: "#fff4cc", fg: "#a06b00" };
  return { bg: "#fde0e0", fg: "#b3261e" };
};

export const MatrizModule: React.FC<MatrizModuleProps> = ({
  matriz,
  onChangeRow,
  onChangeExercise,
  onNext,
}) => (
  <>
    <PaneTitle num="02">Matriz de Valor Real</PaneTitle>
    <Prose>
      Evalúa cada área del negocio bajo cuatro criterios. Selecciona <strong>Sí · Parcial · No</strong> y describe qué pasa si esa actividad falla.
    </Prose>

    <div
      style={{
        border: `1.5px solid ${C.borderStrong}`,
        borderRadius: 10,
        overflow: "auto",
      }}
    >
      <table style={{ width: "100%", minWidth: 900, borderCollapse: "collapse", fontSize: 11.5 }}>
        <thead>
          <tr>
            {HEADERS.map((h, i) => (
              <th
                key={i}
                style={{
                  background: C.black,
                  color: C.white,
                  fontWeight: 600,
                  fontSize: 10,
                  letterSpacing: "0.05em",
                  textTransform: "uppercase",
                  padding: "10px 8px",
                  textAlign: i === 0 ? "left" : "center",
                  paddingLeft: i === 0 ? 12 : undefined,
                  verticalAlign: "middle",
                  borderRight: i < HEADERS.length - 1 ? "1px solid rgba(255,255,255,0.1)" : "none",
                  width: i === 0 ? "18%" : undefined,
                }}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {AREAS.map((area, idx) => {
            const row = matriz.rows[idx] || emptyMatrixRow();
            const isLast = idx === AREAS.length - 1;
            const cellStyle: React.CSSProperties = {
              padding: "7px 8px",
              borderBottom: isLast ? "none" : `1px solid ${C.border}`,
              borderRight: `1px solid ${C.border}`,
              textAlign: "center",
              verticalAlign: "middle",
            };
            const firstStyle: React.CSSProperties = {
              ...cellStyle,
              textAlign: "left",
              paddingLeft: 12,
              fontWeight: 600,
              background: C.bgSoft,
              fontSize: 12,
            };
            const rowScore =
              triValue(row.c1) + triValue(row.c2) + triValue(row.c3) + triValue(row.c4);
            const rowColors = scoreColors(rowScore, 40);
            return (
              <tr key={idx}>
                <td style={firstStyle}>{area}</td>
                {(["c1", "c2", "c3", "c4"] as const).map((crit) => (
                  <td key={crit} style={cellStyle}>
                    <TriStateControl
                      value={row[crit]}
                      onChange={(v) => onChangeRow(idx, { [crit]: v } as Partial<MatrixRow>)}
                    />
                  </td>
                ))}
                <td style={cellStyle}>
                  <input
                    type="text"
                    value={row.note}
                    onChange={(e) => onChangeRow(idx, { note: e.target.value })}
                    placeholder="Describe el impacto…"
                    style={{
                      width: "100%",
                      border: `1px solid ${C.border}`,
                      background: C.white,
                      borderRadius: 5,
                      padding: "7px 9px",
                      fontFamily: "Inter, sans-serif",
                      fontSize: 11.5,
                      color: C.black,
                    }}
                  />
                </td>
                <td
                  style={{
                    ...cellStyle,
                    borderRight: "none",
                    background: rowColors.bg,
                    color: rowColors.fg,
                    fontWeight: 700,
                    fontSize: 13,
                  }}
                >
                  {rowScore}
                </td>
              </tr>
            );
          })}
        </tbody>
        <tfoot>
          {(() => {
            const colScores = (["c1", "c2", "c3", "c4"] as const).map((crit) =>
              AREAS.reduce((sum, _, idx) => {
                const row = matriz.rows[idx] || emptyMatrixRow();
                return sum + triValue(row[crit]);
              }, 0)
            );
            const totalScore = colScores.reduce((a, b) => a + b, 0);
            const colMax = AREAS.length * 10;
            const totalMax = colMax * 4;
            const footCellBase: React.CSSProperties = {
              padding: "9px 8px",
              borderTop: `2px solid ${C.borderStrong}`,
              borderRight: `1px solid ${C.border}`,
              textAlign: "center",
              verticalAlign: "middle",
              fontWeight: 700,
              fontSize: 13,
            };
            const totalColors = scoreColors(totalScore, totalMax);
            return (
              <tr>
                <td
                  style={{
                    ...footCellBase,
                    textAlign: "left",
                    paddingLeft: 12,
                    background: C.bgSoft,
                    fontSize: 11,
                    letterSpacing: "0.05em",
                    textTransform: "uppercase",
                    color: C.muted,
                  }}
                >
                  Score
                </td>
                {colScores.map((s, i) => {
                  const c = scoreColors(s, colMax);
                  return (
                    <td key={i} style={{ ...footCellBase, background: c.bg, color: c.fg }}>
                      {s}
                    </td>
                  );
                })}
                <td style={{ ...footCellBase, background: C.bgSoft }} />
                <td
                  style={{
                    ...footCellBase,
                    borderRight: "none",
                    background: totalColors.bg,
                    color: totalColors.fg,
                  }}
                >
                  {totalScore}
                </td>
              </tr>
            );
          })()}
        </tfoot>
      </table>
    </div>

    <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 14 }}>
      <Prose style={{ marginTop: 18, marginBottom: 0 }}>
        <strong>Ejercicio aplicado:</strong> 3 actividades que parecen "normales" pero que si fallan ponen en riesgo el negocio.
      </Prose>
      {(["m1", "m2", "m3"] as const).map((k, i) => (
        <div key={k} style={{ display: "flex", alignItems: "stretch", gap: 10 }}>
          <div
            style={{
              flexShrink: 0,
              width: 36,
              background: C.black,
              color: C.green,
              borderRadius: 6,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 800,
              fontSize: 14,
            }}
          >
            {i + 1}
          </div>
          <input
            type="text"
            value={matriz.exercise[k]}
            onChange={(e) => onChangeExercise(k, e.target.value)}
            placeholder={`${i === 0 ? "Primera" : i === 1 ? "Segunda" : "Tercera"} actividad crítica aparentemente normal…`}
            style={{
              flex: 1,
              border: `1.5px solid ${C.borderStrong}`,
              borderRadius: 6,
              padding: "10px 14px",
              fontFamily: "Inter, sans-serif",
              fontSize: 13,
              color: C.black,
              background: C.white,
            }}
          />
        </div>
      ))}
    </div>

    <NextButton onClick={onNext} label="Siguiente módulo · Mapa de Rentabilidad →" />
  </>
);
