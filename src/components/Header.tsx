import React from "react";
import { C } from "../constants";

interface HeaderProps {
  onPrint: () => void;
  onClear: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onPrint, onClear }) => (
  <div
    style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "flex-end",
      flexWrap: "wrap",
      gap: 16,
      marginBottom: 20,
      paddingBottom: 16,
      borderBottom: `1px solid ${C.border}`,
    }}
  >
    <div>
      <img
        src="/profit120-logo.png"
        alt="Profit120"
        style={{
          display: "block",
          height: 38,
          width: "auto",
          marginBottom: 14,
        }}
      />
      <div
        style={{
          color: C.black,
          fontSize: 10,
          fontWeight: 600,
          letterSpacing: "0.22em",
          textTransform: "uppercase",
          opacity: 0.55,
          marginBottom: 6,
        }}
      >
        Sesión estratégica · Diagnóstico inicial
      </div>
      <h1
        style={{
          margin: 0,
          color: C.green,
          fontSize: 34,
          fontWeight: 800,
          letterSpacing: "-0.02em",
          lineHeight: 1.05,
        }}
      >
        Diagnóstico del Negocio Familiar
      </h1>
    </div>
    <div className="no-print" style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
      <button
        onClick={onPrint}
        style={{
          fontFamily: "Inter, sans-serif",
          fontSize: 11,
          fontWeight: 600,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          padding: "10px 18px",
          borderRadius: 6,
          cursor: "pointer",
          background: "transparent",
          color: C.black,
          border: `1px solid ${C.black}`,
          transition: "all 0.2s ease",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = C.black;
          e.currentTarget.style.color = C.white;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = "transparent";
          e.currentTarget.style.color = C.black;
        }}
      >
        Imprimir / PDF
      </button>
      <button
        onClick={onClear}
        style={{
          fontFamily: "Inter, sans-serif",
          fontSize: 11,
          fontWeight: 600,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          padding: "10px 18px",
          borderRadius: 6,
          cursor: "pointer",
          background: C.green,
          color: C.black,
          border: `1px solid ${C.green}`,
          transition: "all 0.2s ease",
        }}
        onMouseEnter={(e) => { e.currentTarget.style.background = C.greenDark; }}
        onMouseLeave={(e) => { e.currentTarget.style.background = C.green; }}
      >
        Limpiar todo
      </button>
    </div>
  </div>
);
