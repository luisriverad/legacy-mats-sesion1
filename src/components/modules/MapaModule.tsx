import React, { useState } from "react";
import { C, MAPA_HINTS } from "../../constants";
import type { MapaState } from "../../types";
import { PaneTitle, Prose, NextButton } from "../Shared";

interface MapaModuleProps {
  mapa: MapaState;
  onChange: (key: keyof MapaState, value: string) => void;
  onNext: () => void;
}

interface BlockConfig {
  key: keyof MapaState;
  title: string;
  gridArea: string;
  variant?: "soft" | "core";
}

const BLOCKS: BlockConfig[] = [
  { key: "alianzas", title: "Alianzas", gridArea: "1 / 1 / span 2 / 2", variant: "soft" },
  { key: "actividades_criticas", title: "Actividades Críticas", gridArea: "1 / 2 / 2 / 3" },
  { key: "valor", title: "Valor", gridArea: "1 / 3 / 2 / 4", variant: "core" },
  { key: "mercado", title: "Mercado · Core Market", gridArea: "1 / 4 / 2 / 5" },
  { key: "recursos_estrategicos", title: "Recursos Estratégicos", gridArea: "2 / 2 / 3 / 3" },
  { key: "core_business", title: "Oferta · Core Business", gridArea: "2 / 3 / 3 / 4", variant: "soft" },
  { key: "adquisicion_clientes", title: "Adquisición de Clientes", gridArea: "2 / 4 / 3 / 5" },
];

interface CanvasBlockProps {
  config: BlockConfig;
  value: string;
  hint: string;
  onChange: (v: string) => void;
}

const CanvasBlock: React.FC<CanvasBlockProps> = ({ config, value, hint, onChange }) => {
  const [showHint, setShowHint] = useState(false);
  const isCore = config.variant === "core";
  const isSoft = config.variant === "soft";

  return (
    <div
      style={{
        gridArea: config.gridArea,
        background: isCore ? C.green : isSoft ? C.bgSoft : C.white,
        border: `1.5px solid ${isCore ? C.green : C.borderStrong}`,
        borderRadius: 12,
        padding: 14,
        display: "flex",
        flexDirection: "column",
        minHeight: 220,
        transition: "all 0.15s ease",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8, marginBottom: 8 }}>
        <div
          style={{
            color: isCore ? C.white : C.green,
            fontWeight: 700,
            fontSize: 12,
            letterSpacing: "0.04em",
            textTransform: "uppercase",
            lineHeight: 1.15,
          }}
        >
          {config.title}
        </div>
        <button
          className="no-print"
          onClick={() => setShowHint((s) => !s)}
          style={{
            flexShrink: 0,
            background: showHint ? (isCore ? C.white : C.black) : "transparent",
            border: `1px solid ${isCore ? C.white : C.borderStrong}`,
            borderRadius: 4,
            padding: "3px 7px",
            fontSize: 8.5,
            fontWeight: 700,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: showHint ? (isCore ? C.green : C.white) : isCore ? C.white : C.black,
            cursor: "pointer",
            opacity: isCore ? (showHint ? 1 : 0.8) : showHint ? 1 : 0.55,
            transition: "all 0.15s ease",
          }}
        >
          Descripción
        </button>
      </div>
      {showHint && (
        <div
          style={{
            color: isCore ? C.white : C.muted,
            fontSize: 10,
            fontStyle: "italic",
            lineHeight: 1.4,
            margin: "6px 0 0",
            padding: "7px 9px",
            borderLeft: `2px solid ${isCore ? C.white : C.green}`,
            background: isCore ? "rgba(255,255,255,0.15)" : "rgba(113,178,72,0.06)",
            borderRadius: "0 4px 4px 0",
          }}
        >
          {hint}
        </div>
      )}
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Escribe aquí…"
        style={{
          flex: 1,
          width: "100%",
          background: "transparent",
          border: "none",
          resize: "none",
          color: isCore ? C.white : C.black,
          fontSize: 12.5,
          fontWeight: 500,
          lineHeight: 1.5,
          padding: 0,
          marginTop: 6,
          outline: "none",
        }}
      />
    </div>
  );
};

export const MapaModule: React.FC<MapaModuleProps> = ({ mapa, onChange, onNext }) => (
  <>
    <PaneTitle num="01">Mapa del Negocio Familiar</PaneTitle>
    <Prose>
      Llena cada bloque del mapa. Comienza por <strong>Valor</strong> — es el núcleo de lo que el cliente realmente compra.
    </Prose>

    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1.15fr 1fr 1.15fr",
        gap: 12,
        marginBottom: 6,
      }}
    >
      <div
        style={{
          gridColumn: "1 / span 2",
          textAlign: "center",
          color: C.muted,
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
        }}
      >
        Back Office
      </div>
      <div />
      <div
        style={{
          textAlign: "center",
          color: C.muted,
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
        }}
      >
        Front Office
      </div>
    </div>

    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1.15fr 1fr 1.15fr",
        gridTemplateRows: "1fr 1fr",
        gap: 12,
        minHeight: 480,
      }}
    >
      {BLOCKS.map((cfg) => (
        <CanvasBlock
          key={cfg.key}
          config={cfg}
          value={mapa[cfg.key]}
          hint={MAPA_HINTS[cfg.key]}
          onChange={(v) => onChange(cfg.key, v)}
        />
      ))}
    </div>

    <NextButton onClick={onNext} label="Siguiente módulo · Matriz de Valor Real →" />
  </>
);
