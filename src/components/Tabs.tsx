import React from "react";
import { C } from "../constants";
import type { TabId } from "../types";

interface TabsProps {
  active: TabId;
  onChange: (tab: TabId) => void;
  filledMap: Record<TabId, boolean>;
}

interface TabConfig {
  id: TabId;
  num: string;
  name: string;
  special?: boolean;
}

const TABS: TabConfig[] = [
  { id: "t1", num: "01", name: "Mapa" },
  { id: "t2", num: "02", name: "Matriz de Valor" },
  { id: "t3", num: "03", name: "Rentabilidad" },
  { id: "t4", num: "04", name: "Iceberg" },
  { id: "t5", num: "05", name: "Filtro de Criterio" },
  { id: "t6", num: "✦ Cierre", name: "Estratégico", special: true },
];

export const Tabs: React.FC<TabsProps> = ({ active, onChange, filledMap }) => (
  <div
    className="no-print"
    style={{
      display: "flex",
      gap: 6,
      marginBottom: 24,
      flexWrap: "wrap",
      background: C.bgSoft,
      padding: 6,
      borderRadius: 10,
    }}
  >
    {TABS.map((tab) => {
      const isActive = active === tab.id;
      const hasContent = filledMap[tab.id];
      const isSpecial = tab.special;

      let bg = "transparent";
      let color = C.black;
      let borderColor: string = "transparent";

      if (isSpecial) {
        borderColor = C.green;
        color = isActive ? C.black : C.greenDark;
        if (isActive) bg = C.green;
      } else if (isActive) {
        bg = C.black;
        color = C.white;
        borderColor = C.black;
      }

      const dotColor = isSpecial || hasContent ? C.green : C.border;

      return (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          style={{
            flex: 1,
            minWidth: 120,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 5,
            background: bg,
            border: `1px solid ${borderColor}`,
            borderRadius: 8,
            padding: "11px 8px",
            cursor: "pointer",
            fontFamily: "Inter, sans-serif",
            color,
            transition: "all 0.15s ease",
          }}
          onMouseEnter={(e) => {
            if (!isActive) e.currentTarget.style.background = "rgba(113,178,72,0.08)";
          }}
          onMouseLeave={(e) => {
            if (!isActive) e.currentTarget.style.background = bg;
          }}
        >
          <span
            style={{
              fontSize: 12,
              opacity: isActive || isSpecial ? 1 : 0.55,
              letterSpacing: "0.15em",
              fontWeight: 600,
              color: isActive && isSpecial ? C.black : isSpecial ? C.green : isActive ? C.green : "inherit",
            }}
          >
            {tab.num}
          </span>
          <span style={{ fontSize: 15, fontWeight: 600, letterSpacing: "0.02em" }}>
            {tab.name}
          </span>
          <span
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: dotColor,
            }}
          />
        </button>
      );
    })}
  </div>
);
