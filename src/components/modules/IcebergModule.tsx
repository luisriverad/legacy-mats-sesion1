import React, { useRef, useState } from "react";
import { C } from "../../constants";
import type { IcebergState, IcebergItem, IcebergStatus } from "../../types";
import { PaneTitle, Prose, NextButton } from "../Shared";

type Zone = "above" | "below";

interface IcebergModuleProps {
  iceberg: IcebergState;
  onChangeItem: (zone: Zone, id: string, text: string) => void;
  onChangeItemStatus: (zone: Zone, id: string, status: IcebergStatus) => void;
  onDeleteItem: (zone: Zone, id: string) => void;
  onAddItem: (zone: Zone) => void;
  onMoveItem: (fromZone: Zone, id: string, toZone: Zone, toIndex: number) => void;
  onChangePadre: (key: keyof IcebergState["padres"], value: string) => void;
  onChangeHijo: (key: keyof IcebergState["hijos"], value: string) => void;
  onNext: () => void;
}

const STATUS_COLORS: Record<Exclude<IcebergStatus, null>, { solid: string; tint: string; border: string }> = {
  green: { solid: "#2e7d32", tint: "#dff5d0", border: "#71b248" },
  yellow: { solid: "#a06b00", tint: "#fff4cc", border: "#e0b84a" },
  red: { solid: "#b3261e", tint: "#fde0e0", border: "#d97570" },
};

interface RowProps {
  item: IcebergItem;
  zone: Zone;
  index: number;
  onChange: (text: string) => void;
  onChangeStatus: (status: IcebergStatus) => void;
  onDelete: () => void;
  onDragStart: (e: React.DragEvent) => void;
  onDragOverItem: (e: React.DragEvent) => void;
  onDragEnd: () => void;
  isDragging: boolean;
  showDropIndicatorBefore: boolean;
}

const IcebergItemRow: React.FC<RowProps> = ({
  item, zone, onChange, onChangeStatus, onDelete,
  onDragStart, onDragOverItem, onDragEnd,
  isDragging, showDropIndicatorBefore,
}) => {
  const ref = useRef<HTMLInputElement>(null);
  const [hover, setHover] = useState(false);
  const isBelow = zone === "below";
  const status = item.status ?? null;
  const statusStyle = status ? STATUS_COLORS[status] : null;

  const computeWidth = (val: string) => {
    const len = (val || "Escribe…").length;
    return Math.max(80, Math.min(280, len * 8 + 28));
  };

  const baseBg = isBelow ? "rgba(255,255,255,0.08)" : C.white;
  const baseBorder = isBelow ? "rgba(255,255,255,0.18)" : C.border;
  const baseColor = isBelow ? C.white : C.black;

  const inputBg = statusStyle ? statusStyle.tint : baseBg;
  const inputBorder = statusStyle ? statusStyle.border : baseBorder;
  const inputColor = statusStyle ? statusStyle.solid : baseColor;

  const dotColors: { key: Exclude<IcebergStatus, null>; color: string }[] = [
    { key: "green", color: STATUS_COLORS.green.border },
    { key: "yellow", color: STATUS_COLORS.yellow.border },
    { key: "red", color: STATUS_COLORS.red.border },
  ];

  const gripColor = isBelow ? "rgba(255,255,255,0.55)" : C.muted;

  return (
    <div
      draggable
      onDragStart={onDragStart}
      onDragOver={onDragOverItem}
      onDragEnd={onDragEnd}
      style={{
        position: "relative",
        display: "flex",
        alignItems: "center",
        gap: 4,
        opacity: isDragging ? 0.4 : 1,
        cursor: "grab",
        transition: "opacity 0.12s ease",
      }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {showDropIndicatorBefore && (
        <div
          style={{
            position: "absolute",
            left: -6,
            top: -2,
            bottom: -2,
            width: 3,
            borderRadius: 2,
            background: C.green,
            boxShadow: `0 0 0 2px rgba(113,178,72,0.35)`,
            pointerEvents: "none",
            zIndex: 10,
          }}
        />
      )}
      <span
        className="no-print"
        title="Arrastra para mover"
        style={{
          color: gripColor,
          fontSize: 14,
          lineHeight: 1,
          padding: "0 2px",
          opacity: hover ? 0.9 : 0.45,
          userSelect: "none",
          cursor: "grab",
          transition: "opacity 0.12s ease",
        }}
      >
        ⋮⋮
      </span>
      <input
        ref={ref}
        type="text"
        value={item.text}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Escribe…"
        draggable={false}
        onDragStart={(e) => e.preventDefault()}
        style={{
          border: `1.5px solid ${inputBorder}`,
          borderRadius: 5, padding: "7px 12px",
          fontFamily: "Inter, sans-serif", fontSize: 12, fontWeight: 500,
          outline: "none", transition: "all 0.15s ease",
          background: inputBg,
          color: inputColor,
          width: computeWidth(item.text), minWidth: 80,
          cursor: "text",
        }}
      />
      <div className="no-print" style={{ display: "flex", alignItems: "center", gap: 3, marginLeft: 2 }}>
        {dotColors.map((d) => {
          const isActive = status === d.key;
          return (
            <button
              key={d.key}
              type="button"
              title={`Marcar ${d.key === "green" ? "bien" : d.key === "yellow" ? "atención" : "crítico"}`}
              onClick={() => onChangeStatus(isActive ? null : d.key)}
              style={{
                width: 12, height: 12, borderRadius: "50%",
                background: isActive ? d.color : "transparent",
                border: `1.5px solid ${d.color}`,
                cursor: "pointer", padding: 0, lineHeight: 0,
                transition: "all 0.12s ease",
                opacity: isActive || hover ? 1 : 0.45,
              }}
            />
          );
        })}
      </div>
      <button
        type="button" onClick={onDelete} title="Eliminar" className="no-print"
        style={{
          background: "transparent", border: "none", width: 20, height: 20,
          borderRadius: "50%", cursor: "pointer", fontSize: 13, lineHeight: 1,
          color: isBelow ? "rgba(255,255,255,0.5)" : C.muted,
          opacity: hover ? 1 : 0, transition: "all 0.15s ease",
        }}
      >×</button>
    </div>
  );
};

interface DragState {
  id: string;
  fromZone: Zone;
}

interface DropTarget {
  zone: Zone;
  index: number;
}

export const IcebergModule: React.FC<IcebergModuleProps> = ({
  iceberg, onChangeItem, onChangeItemStatus, onDeleteItem, onAddItem, onMoveItem,
  onChangePadre, onChangeHijo, onNext,
}) => {
  const [drag, setDrag] = useState<DragState | null>(null);
  const [target, setTarget] = useState<DropTarget | null>(null);

  const handleDragStart = (zone: Zone, id: string) => (e: React.DragEvent) => {
    setDrag({ id, fromZone: zone });
    e.dataTransfer.effectAllowed = "move";
    try { e.dataTransfer.setData("text/plain", id); } catch { /* ignore */ }
  };

  const handleDragOverItem = (zone: Zone, index: number) => (e: React.DragEvent) => {
    if (!drag) return;
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = "move";
    setTarget((prev) => (prev && prev.zone === zone && prev.index === index ? prev : { zone, index }));
  };

  const handleZoneDragOver = (zone: Zone) => (e: React.DragEvent) => {
    if (!drag) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    const endIndex = iceberg[zone].length;
    setTarget((prev) => (prev && prev.zone === zone ? prev : { zone, index: endIndex }));
  };

  const handleDrop = (zone: Zone) => (e: React.DragEvent) => {
    e.preventDefault();
    if (!drag) return;
    const idx = target && target.zone === zone ? target.index : iceberg[zone].length;
    onMoveItem(drag.fromZone, drag.id, zone, idx);
    setDrag(null);
    setTarget(null);
  };

  const handleDragEnd = () => {
    setDrag(null);
    setTarget(null);
  };

  const renderZone = (
    zone: Zone,
    items: IcebergItem[],
  ) => (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 30, minHeight: 40 }}>
      {items.map((item, idx) => (
        <IcebergItemRow
          key={item.id}
          item={item}
          zone={zone}
          index={idx}
          onChange={(t) => onChangeItem(zone, item.id, t)}
          onChangeStatus={(s) => onChangeItemStatus(zone, item.id, s)}
          onDelete={() => onDeleteItem(zone, item.id)}
          onDragStart={handleDragStart(zone, item.id)}
          onDragOverItem={handleDragOverItem(zone, idx)}
          onDragEnd={handleDragEnd}
          isDragging={drag?.id === item.id}
          showDropIndicatorBefore={
            !!drag &&
            !!target &&
            target.zone === zone &&
            target.index === idx &&
            drag.id !== item.id
          }
        />
      ))}
      {drag && target && target.zone === zone && target.index === items.length && (
        <div
          style={{
            width: 3,
            alignSelf: "stretch",
            borderRadius: 2,
            background: C.green,
            boxShadow: `0 0 0 2px rgba(113,178,72,0.35)`,
          }}
        />
      )}
    </div>
  );

  return (
    <>
      <PaneTitle num="04">Iceberg del Negocio Familiar</PaneTitle>
      <Prose>
        Llena los dos niveles del iceberg. Arriba lo que cualquiera puede ver desde afuera. Abajo lo que solo el empresario que ha estado años en la trinchera conoce. Arrastra los elementos entre zonas para reorganizarlos.
      </Prose>

      <div style={{
        position: "relative", border: `1.5px solid ${C.borderStrong}`,
        borderRadius: 12, overflow: "hidden", background: C.sky,
      }}>
        <div
          onDragOver={handleZoneDragOver("above")}
          onDrop={handleDrop("above")}
          style={{
            position: "relative",
            background: "linear-gradient(180deg, #F5F8F9 0%, #E8EFF1 100%)",
            padding: "26px 28px 30px", minHeight: 180,
            outline: drag && target?.zone === "above" ? `2px dashed ${C.green}` : "none",
            outlineOffset: -8,
            transition: "outline-color 0.12s ease",
          }}
        >
          <div style={{
            position: "absolute", top: 14, left: 22, fontSize: 10, fontWeight: 700,
            letterSpacing: "0.2em", textTransform: "uppercase", color: C.muted,
          }}>
            Parte visible{" "}
            <span style={{
              fontWeight: 400, opacity: 0.6, letterSpacing: "0.06em",
              marginLeft: 6, textTransform: "none", fontSize: 10, fontStyle: "italic",
            }}>Lo que se ve desde afuera</span>
          </div>
          {renderZone("above", iceberg.above)}
          <button
            type="button" className="no-print" onClick={() => onAddItem("above")}
            style={{
              marginTop: 12, background: "transparent",
              border: `1.5px dashed ${C.green}`, color: C.greenDark,
              borderRadius: 5, padding: "7px 14px",
              fontFamily: "Inter, sans-serif", fontSize: 10, fontWeight: 700,
              letterSpacing: "0.1em", textTransform: "uppercase",
              cursor: "pointer", transition: "all 0.15s ease",
            }}
          >+ Agregar elemento visible</button>
        </div>

        <div style={{ position: "relative", height: 0, borderTop: "2px dashed rgba(113,178,72,0.55)", zIndex: 5 }}>
          <div style={{
            position: "absolute", top: -10, right: 14,
            background: C.green, color: C.black, fontSize: 9, fontWeight: 700,
            letterSpacing: "0.14em", textTransform: "uppercase",
            padding: "4px 10px", borderRadius: 4,
          }}>Línea de agua</div>
        </div>

        <div
          onDragOver={handleZoneDragOver("below")}
          onDrop={handleDrop("below")}
          style={{
            position: "relative",
            background: `linear-gradient(180deg, ${C.waterMid} 0%, ${C.water} 100%)`,
            padding: "34px 28px 26px", minHeight: 380, color: C.white,
            outline: drag && target?.zone === "below" ? `2px dashed ${C.green}` : "none",
            outlineOffset: -8,
            transition: "outline-color 0.12s ease",
          }}
        >
          <div style={{
            position: "absolute", top: 14, left: 22, fontSize: 10, fontWeight: 700,
            letterSpacing: "0.2em", textTransform: "uppercase", color: C.green,
          }}>
            Parte invisible{" "}
            <span style={{
              fontWeight: 400, opacity: 0.6, letterSpacing: "0.06em",
              marginLeft: 6, textTransform: "none", fontSize: 10,
              fontStyle: "italic", color: C.white,
            }}>Lo que solo el empresario conoce</span>
          </div>
          {renderZone("below", iceberg.below)}
          <button
            type="button" className="no-print" onClick={() => onAddItem("below")}
            style={{
              marginTop: 12, background: "transparent",
              border: `1.5px dashed ${C.green}`, color: C.green,
              borderRadius: 5, padding: "7px 14px",
              fontFamily: "Inter, sans-serif", fontSize: 10, fontWeight: 700,
              letterSpacing: "0.1em", textTransform: "uppercase",
              cursor: "pointer", transition: "all 0.15s ease",
            }}
          >+ Agregar elemento invisible</button>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginTop: 18 }}>
        <div style={{ borderRadius: 10, padding: 18, background: "#f7efdd", border: "1.5px solid #d9c69a" }}>
          <h3 style={{ margin: "0 0 2px", fontSize: 14, fontWeight: 800, color: "#5a4a1f" }}>Padres / Fundadores</h3>
          <div style={{
            fontSize: 10, fontWeight: 600, letterSpacing: "0.08em",
            textTransform: "uppercase", marginBottom: 14, color: "#8a7340",
          }}>5 problemas que los hijos no ven</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {(["p1", "p2", "p3", "p4", "p5"] as const).map((k, i) => (
              <div key={k} style={{ display: "flex", alignItems: "stretch", gap: 8 }}>
                <div style={{
                  flexShrink: 0, width: 28, background: C.black, color: C.green,
                  borderRadius: 5, display: "flex", alignItems: "center",
                  justifyContent: "center", fontWeight: 800, fontSize: 12,
                }}>{i + 1}</div>
                <input
                  type="text" value={iceberg.padres[k]}
                  onChange={(e) => onChangePadre(k, e.target.value)}
                  placeholder="Problema que no se ve desde afuera…"
                  style={{
                    flex: 1, border: `1.5px solid ${C.border}`, background: C.white,
                    borderRadius: 5, padding: "9px 12px", fontSize: 12, color: C.black,
                  }}
                />
              </div>
            ))}
          </div>
        </div>

        <div style={{ borderRadius: 10, padding: 18, background: "#e8f4d6", border: `1.5px solid ${C.green}` }}>
          <h3 style={{ margin: "0 0 2px", fontSize: 14, fontWeight: 800, color: C.black }}>Hijos / Siguiente generación</h3>
          <div style={{
            fontSize: 10, fontWeight: 600, letterSpacing: "0.08em",
            textTransform: "uppercase", marginBottom: 14, color: C.greenDark,
          }}>5 cosas que ellos creen que deberían cambiar</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {(["h1", "h2", "h3", "h4", "h5"] as const).map((k, i) => (
              <div key={k} style={{ display: "flex", alignItems: "stretch", gap: 8 }}>
                <div style={{
                  flexShrink: 0, width: 28, background: C.green, color: C.black,
                  borderRadius: 5, display: "flex", alignItems: "center",
                  justifyContent: "center", fontWeight: 800, fontSize: 12,
                }}>{i + 1}</div>
                <input
                  type="text" value={iceberg.hijos[k]}
                  onChange={(e) => onChangeHijo(k, e.target.value)}
                  placeholder="Lo que creo que debería cambiar…"
                  style={{
                    flex: 1, border: `1.5px solid ${C.border}`, background: C.white,
                    borderRadius: 5, padding: "9px 12px", fontSize: 12, color: C.black,
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      <NextButton onClick={onNext} label="Siguiente módulo · Filtro de Criterio →" />
    </>
  );
};
