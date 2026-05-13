import React from "react";
import { C } from "../../constants";
import type { RentState, RentRow } from "../../types";
import { PaneTitle, Prose, NextButton, Level3Control, VerdictControl } from "../Shared";

interface RentModuleProps {
  rent: RentState;
  onChangeRow: (id: string, patch: Partial<RentRow>) => void;
  onAddRow: () => void;
  onDeleteRow: (id: string) => void;
  onChangeExercise: (key: "r1" | "r2" | "r3" | "r4" | "r5", value: string) => void;
  onNext: () => void;
}

const HEADERS = [
  "Producto / Cliente / Línea",
  "Promedio de facturación",
  "Margen",
  "Complejidad",
  "Cobranza",
  "Desgaste",
  "Valor estratégico",
  "Veredicto",
];

const formatPesos = (raw: string): string => {
  const digits = raw.replace(/\D/g, "");
  if (!digits) return "";
  return "$" + Number(digits).toLocaleString("es-MX");
};

const formatPct = (raw: string): string => {
  const cleaned = raw.replace(/[^0-9.]/g, "");
  if (!cleaned) return "";
  return cleaned.endsWith(".") ? cleaned : cleaned + "%";
};

const EXERCISES = [
  { key: "r1", label: "El cliente más rentable", placeholder: "¿Quién deja más utilidad real, no solo volumen?" },
  { key: "r2", label: "El cliente más desgastante", placeholder: "¿Quién consume más recursos del que aporta?" },
  { key: "r3", label: "El producto más peligroso", placeholder: "¿Qué producto vende bien pero erosiona el margen?" },
  { key: "r4", label: "La línea más estratégica", placeholder: "¿Qué línea sostiene el futuro del negocio?" },
  { key: "r5", label: "La venta que se ve buena, pero no conviene", placeholder: "¿Qué venta parece atractiva pero destruye utilidad?" },
] as const;

export const RentabilidadModule: React.FC<RentModuleProps> = ({
  rent, onChangeRow, onAddRow, onDeleteRow, onChangeExercise, onNext,
}) => (
  <>
    <PaneTitle num="03">Mapa de Rentabilidad por Línea / Cliente</PaneTitle>
    <Prose>
      Captura cada producto, cliente o línea de negocio. Compara lo que entra contra lo que cuesta operar. Al final, define un veredicto claro.
    </Prose>

    <div style={{ border: `1.5px solid ${C.borderStrong}`, borderRadius: 10, overflow: "auto" }}>
      <table style={{ width: "100%", minWidth: 1180, borderCollapse: "collapse", fontSize: 11.5 }}>
        <thead>
          <tr>
            {HEADERS.map((h, i) => (
              <th key={i} style={{
                background: C.black, color: C.white, fontWeight: 600, fontSize: 10,
                letterSpacing: "0.05em", textTransform: "uppercase", padding: "10px 8px",
                textAlign: i === 0 ? "left" : "center", paddingLeft: i === 0 ? 12 : undefined,
                borderRight: "1px solid rgba(255,255,255,0.1)",
                width: i === 0 ? "18%" : undefined,
              }}>{h}</th>
            ))}
            <th className="no-print" style={{ background: C.black, width: 40, borderRight: "none" }}></th>
          </tr>
        </thead>
        <tbody>
          {rent.rows.map((row, idx) => {
            const isLast = idx === rent.rows.length - 1;
            const cellStyle: React.CSSProperties = {
              padding: "7px 8px",
              borderBottom: isLast ? "none" : `1px solid ${C.border}`,
              borderRight: `1px solid ${C.border}`,
              textAlign: "center", verticalAlign: "middle",
            };
            const firstStyle: React.CSSProperties = {
              ...cellStyle, textAlign: "left", paddingLeft: 12, background: C.bgSoft,
            };
            const inputBase: React.CSSProperties = {
              width: "100%", border: `1px solid ${C.border}`, background: C.white,
              borderRadius: 5, padding: "7px 9px", fontFamily: "Inter, sans-serif",
              fontSize: 11.5, color: C.black,
            };
            return (
              <tr key={row.id}>
                <td style={firstStyle}>
                  <input type="text" value={row.name} onChange={(e) => onChangeRow(row.id, { name: e.target.value })}
                    placeholder="Ej. Cliente Acme, Producto X…" style={{ ...inputBase, fontWeight: 600 }} />
                </td>
                <td style={cellStyle}>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={row.volumen}
                    onChange={(e) => onChangeRow(row.id, { volumen: formatPesos(e.target.value) })}
                    placeholder="$ 0"
                    style={inputBase}
                  />
                </td>
                <td style={cellStyle}>
                  <input
                    type="text"
                    inputMode="decimal"
                    value={row.margen}
                    onChange={(e) => onChangeRow(row.id, { margen: formatPct(e.target.value) })}
                    placeholder="0%"
                    style={inputBase}
                  />
                </td>
                <td style={cellStyle}>
                  <Level3Control value={row.complejidad} onChange={(v) => onChangeRow(row.id, { complejidad: v })} />
                </td>
                <td style={cellStyle}>
                  <input type="text" value={row.cobranza} onChange={(e) => onChangeRow(row.id, { cobranza: e.target.value })} placeholder="Días" style={inputBase} />
                </td>
                <td style={cellStyle}>
                  <Level3Control value={row.desgaste} onChange={(v) => onChangeRow(row.id, { desgaste: v })} />
                </td>
                <td style={cellStyle}>
                  <Level3Control value={row.valor} onChange={(v) => onChangeRow(row.id, { valor: v })} />
                </td>
                <td style={cellStyle}>
                  <VerdictControl value={row.veredicto} onChange={(v) => onChangeRow(row.id, { veredicto: v })} />
                </td>
                <td className="no-print" style={{ ...cellStyle, borderRight: "none", width: 40 }}>
                  <button type="button" onClick={() => onDeleteRow(row.id)} title="Eliminar"
                    style={{
                      background: "transparent", border: `1px solid ${C.border}`, color: C.muted,
                      width: 24, height: 24, borderRadius: 5, cursor: "pointer",
                      fontSize: 13, lineHeight: 1, transition: "all 0.12s ease",
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = C.black; e.currentTarget.style.color = C.white; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = C.muted; }}
                  >×</button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>

    <button
      type="button" onClick={onAddRow} className="no-print"
      style={{
        marginTop: 12, background: "transparent", border: `1.5px dashed ${C.green}`,
        color: C.greenDark, width: "100%", padding: 10, borderRadius: 8,
        fontFamily: "Inter, sans-serif", fontSize: 10.5, fontWeight: 700,
        letterSpacing: "0.12em", textTransform: "uppercase", cursor: "pointer",
        transition: "all 0.15s ease",
      }}
      onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(113,178,72,0.08)"; e.currentTarget.style.borderStyle = "solid"; }}
      onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.borderStyle = "dashed"; }}
    >
      + Agregar línea
    </button>

    <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 14 }}>
      <Prose style={{ marginTop: 18, marginBottom: 0 }}>
        <strong>Ejercicio aplicado:</strong> Identifica los 5 elementos que más impactan tu rentabilidad real.
      </Prose>
      {EXERCISES.map((ex, i) => (
        <div key={ex.key} style={{ display: "flex", alignItems: "stretch", gap: 10 }}>
          <div style={{
            flexShrink: 0, width: 36, background: C.black, color: C.green,
            borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center",
            fontWeight: 800, fontSize: 14,
          }}>{i + 1}</div>
          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 3 }}>
            <div style={{
              fontSize: 10, fontWeight: 700, letterSpacing: "0.08em",
              textTransform: "uppercase", color: C.greenDark,
            }}>{ex.label}</div>
            <input
              type="text" value={rent.exercise[ex.key]}
              onChange={(e) => onChangeExercise(ex.key, e.target.value)}
              placeholder={ex.placeholder}
              style={{
                width: "100%", border: `1.5px solid ${C.borderStrong}`, borderRadius: 6,
                padding: "10px 14px", fontFamily: "Inter, sans-serif", fontSize: 13,
                color: C.black, background: C.white,
              }}
            />
          </div>
        </div>
      ))}
    </div>

    <NextButton onClick={onNext} label="Siguiente módulo · Iceberg →" />
  </>
);
