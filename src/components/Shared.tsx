import React from "react";
import { C } from "../constants";
import type { TriState, Level, Verdict } from "../types";

export const PaneTitle: React.FC<{ num: string; children: React.ReactNode }> = ({
  num,
  children,
}) => (
  <div
    style={{
      color: C.green,
      fontSize: 12,
      fontWeight: 700,
      letterSpacing: "0.22em",
      textTransform: "uppercase",
      marginBottom: 14,
      paddingBottom: 10,
      borderBottom: `2px solid ${C.green}`,
      display: "flex",
      alignItems: "center",
    }}
  >
    <span
      style={{
        display: "inline-block",
        background: C.green,
        color: C.black,
        fontWeight: 800,
        fontSize: 11,
        padding: "3px 8px",
        borderRadius: 4,
        marginRight: 10,
      }}
    >
      {num}
    </span>
    {children}
  </div>
);

export const Prose: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({
  children,
  style,
}) => (
  <p
    style={{
      color: C.black,
      fontSize: 13.5,
      lineHeight: 1.55,
      margin: "0 0 16px",
      ...style,
    }}
  >
    {children}
  </p>
);

export const MicroLabel: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({
  children,
  style,
}) => (
  <div
    style={{
      fontSize: 10,
      fontWeight: 600,
      letterSpacing: "0.14em",
      textTransform: "uppercase",
      color: C.muted,
      marginBottom: 10,
      ...style,
    }}
  >
    {children}
  </div>
);

interface NextButtonProps {
  onClick: () => void;
  label: string;
  variant?: "default" | "final";
}

export const NextButton: React.FC<NextButtonProps> = ({ onClick, label, variant = "default" }) => {
  const isFinal = variant === "final";
  return (
    <button
      className="no-print"
      onClick={onClick}
      style={{
        marginTop: 24,
        width: "100%",
        background: isFinal ? C.green : "transparent",
        border: `1.5px solid ${isFinal ? C.green : C.black}`,
        color: C.black,
        padding: 12,
        borderRadius: 8,
        fontFamily: "Inter, sans-serif",
        fontSize: 11,
        fontWeight: 600,
        letterSpacing: "0.14em",
        textTransform: "uppercase",
        cursor: "pointer",
        transition: "all 0.15s ease",
      }}
      onMouseEnter={(e) => {
        if (isFinal) {
          e.currentTarget.style.background = C.greenDark;
        } else {
          e.currentTarget.style.background = C.black;
          e.currentTarget.style.color = C.white;
        }
      }}
      onMouseLeave={(e) => {
        if (isFinal) {
          e.currentTarget.style.background = C.green;
        } else {
          e.currentTarget.style.background = "transparent";
          e.currentTarget.style.color = C.black;
        }
      }}
    >
      {label}
    </button>
  );
};

interface TriStateProps {
  value: TriState;
  onChange: (v: TriState) => void;
}

export const TriStateControl: React.FC<TriStateProps> = ({ value, onChange }) => {
  const opts: { val: Exclude<TriState, null>; label: string; bg: string; color: string }[] = [
    { val: "yes", label: "SÍ", bg: C.green, color: C.black },
    { val: "partial", label: "~", bg: C.greenLight, color: C.black },
    { val: "no", label: "NO", bg: C.black, color: C.white },
  ];
  return (
    <div
      style={{
        display: "inline-flex",
        gap: 3,
        background: C.bgSoft,
        border: `1px solid ${C.border}`,
        borderRadius: 5,
        padding: 2,
      }}
    >
      {opts.map((opt) => {
        const active = value === opt.val;
        return (
          <button
            key={opt.val}
            type="button"
            onClick={() => onChange(active ? null : opt.val)}
            style={{
              background: active ? opt.bg : "transparent",
              color: active ? opt.color : C.muted,
              border: "none",
              minWidth: 26,
              height: 22,
              padding: "0 6px",
              borderRadius: 3,
              cursor: "pointer",
              fontFamily: "Inter, sans-serif",
              fontSize: 9.5,
              fontWeight: 700,
              letterSpacing: "0.04em",
              transition: "all 0.12s ease",
            }}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
};

interface Level3Props {
  value: Level;
  onChange: (v: Level) => void;
}

export const Level3Control: React.FC<Level3Props> = ({ value, onChange }) => {
  const opts: { val: Exclude<Level, null>; label: string; bg: string; color: string }[] = [
    { val: "alto", label: "ALTO", bg: C.green, color: C.black },
    { val: "medio", label: "MED", bg: C.greenLight, color: C.black },
    { val: "bajo", label: "BAJO", bg: C.black, color: C.white },
  ];
  return (
    <div
      style={{
        display: "inline-flex",
        gap: 2,
        background: C.bgSoft,
        border: `1px solid ${C.border}`,
        borderRadius: 5,
        padding: 2,
      }}
    >
      {opts.map((opt) => {
        const active = value === opt.val;
        return (
          <button
            key={opt.val}
            type="button"
            onClick={() => onChange(active ? null : opt.val)}
            style={{
              background: active ? opt.bg : "transparent",
              color: active ? opt.color : C.muted,
              border: "none",
              minWidth: 28,
              height: 24,
              padding: "0 6px",
              borderRadius: 3,
              cursor: "pointer",
              fontFamily: "Inter, sans-serif",
              fontSize: 9.5,
              fontWeight: 700,
              letterSpacing: "0.04em",
              transition: "all 0.12s ease",
            }}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
};

interface VerdictProps {
  value: Verdict;
  onChange: (v: Verdict) => void;
}

export const VerdictControl: React.FC<VerdictProps> = ({ value, onChange }) => {
  const opts: { val: Exclude<Verdict, null>; label: string; bg: string; color: string }[] = [
    { val: "cuidar", label: "CUIDAR", bg: C.green, color: C.black },
    { val: "mejorar", label: "MEJORAR", bg: C.greenLight, color: C.black },
    { val: "renegociar", label: "RENEG", bg: C.amber, color: C.black },
    { val: "eliminar", label: "ELIM", bg: C.black, color: C.white },
  ];
  return (
    <div
      style={{
        display: "inline-flex",
        gap: 2,
        background: C.bgSoft,
        border: `1px solid ${C.border}`,
        borderRadius: 5,
        padding: 2,
      }}
    >
      {opts.map((opt) => {
        const active = value === opt.val;
        return (
          <button
            key={opt.val}
            type="button"
            onClick={() => onChange(active ? null : opt.val)}
            style={{
              background: active ? opt.bg : "transparent",
              color: active ? opt.color : C.muted,
              border: "none",
              padding: "4px 9px",
              height: 26,
              borderRadius: 3,
              cursor: "pointer",
              fontFamily: "Inter, sans-serif",
              fontSize: 9.5,
              fontWeight: 700,
              letterSpacing: "0.04em",
              whiteSpace: "nowrap",
              transition: "all 0.12s ease",
            }}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
};

export const Footer: React.FC = () => (
  <div
    style={{
      marginTop: 36,
      paddingTop: 18,
      borderTop: `1px solid ${C.border}`,
      display: "flex",
      justifyContent: "flex-end",
      alignItems: "center",
      flexWrap: "wrap",
      gap: 8,
    }}
  >
    <div
      style={{
        color: C.black,
        fontSize: 12,
        opacity: 0.7,
        display: "flex",
        gap: 18,
      }}
    >
      <span>www.profit120.com</span>
      <span style={{ opacity: 0.4 }}>·</span>
      <span>info@profit120.com</span>
    </div>
  </div>
);
