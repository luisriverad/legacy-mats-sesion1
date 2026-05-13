import React, { useState, useCallback, useMemo } from "react";
import type {
  TabId, MapaState, MatrixRow, RentRow, IcebergState,
  FiltroState, FilterVerdict, CierreState,
} from "./types";
import { C, newId, emptyRentRow, DEFAULT_ABOVE, DEFAULT_BELOW } from "./constants";
import { useSessionState } from "./hooks/useSessionState";
import { Header } from "./components/Header";
import { Tabs } from "./components/Tabs";
import { Footer } from "./components/Shared";
import { MapaModule } from "./components/modules/MapaModule";
import { MatrizModule } from "./components/modules/MatrizModule";
import { RentabilidadModule } from "./components/modules/RentabilidadModule";
import { IcebergModule } from "./components/modules/IcebergModule";
import { FiltroModule } from "./components/modules/FiltroModule";
import { CierreModule } from "./components/modules/CierreModule";

const App: React.FC = () => {
  const { state, setState, resetAll } = useSessionState();
  const [activeTab, setActiveTab] = useState<TabId>("t1");

  const handleTabChange = useCallback((tab: TabId) => {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const updateMapa = useCallback((key: keyof MapaState, value: string) => {
    setState((s) => ({ ...s, mapa: { ...s.mapa, [key]: value } }));
  }, [setState]);

  const updateMatrizRow = useCallback((idx: number, patch: Partial<MatrixRow>) => {
    setState((s) => ({
      ...s,
      matriz: {
        ...s.matriz,
        rows: { ...s.matriz.rows, [idx]: { ...s.matriz.rows[idx], ...patch } },
      },
    }));
  }, [setState]);

  const updateMatrizExercise = useCallback((key: "m1" | "m2" | "m3", value: string) => {
    setState((s) => ({
      ...s,
      matriz: { ...s.matriz, exercise: { ...s.matriz.exercise, [key]: value } },
    }));
  }, [setState]);

  const updateRentRow = useCallback((id: string, patch: Partial<RentRow>) => {
    setState((s) => ({
      ...s,
      rent: {
        ...s.rent,
        rows: s.rent.rows.map((r) => (r.id === id ? { ...r, ...patch } : r)),
      },
    }));
  }, [setState]);

  const addRentRow = useCallback(() => {
    setState((s) => ({ ...s, rent: { ...s.rent, rows: [...s.rent.rows, emptyRentRow()] } }));
  }, [setState]);

  const deleteRentRow = useCallback((id: string) => {
    setState((s) => {
      if (s.rent.rows.length === 1) {
        window.alert("Necesitas al menos una línea en el mapa.");
        return s;
      }
      return { ...s, rent: { ...s.rent, rows: s.rent.rows.filter((r) => r.id !== id) } };
    });
  }, [setState]);

  const updateRentExercise = useCallback((key: "r1"|"r2"|"r3"|"r4"|"r5", value: string) => {
    setState((s) => ({
      ...s,
      rent: { ...s.rent, exercise: { ...s.rent.exercise, [key]: value } },
    }));
  }, [setState]);

  const updateIcebergItem = useCallback((zone: "above"|"below", id: string, text: string) => {
    setState((s) => ({
      ...s,
      iceberg: {
        ...s.iceberg,
        [zone]: s.iceberg[zone].map((i) => (i.id === id ? { ...i, text } : i)),
      },
    }));
  }, [setState]);

  const deleteIcebergItem = useCallback((zone: "above"|"below", id: string) => {
    setState((s) => ({
      ...s,
      iceberg: { ...s.iceberg, [zone]: s.iceberg[zone].filter((i) => i.id !== id) },
    }));
  }, [setState]);

  const addIcebergItem = useCallback((zone: "above"|"below") => {
    setState((s) => ({
      ...s,
      iceberg: { ...s.iceberg, [zone]: [...s.iceberg[zone], { id: newId(), text: "" }] },
    }));
  }, [setState]);

  const updateIcebergItemStatus = useCallback(
    (zone: "above"|"below", id: string, status: import("./types").IcebergStatus) => {
      setState((s) => ({
        ...s,
        iceberg: {
          ...s.iceberg,
          [zone]: s.iceberg[zone].map((i) => (i.id === id ? { ...i, status } : i)),
        },
      }));
    },
    [setState],
  );

  const moveIcebergItem = useCallback(
    (fromZone: "above"|"below", id: string, toZone: "above"|"below", toIndex: number) => {
      setState((s) => {
        const fromArr = s.iceberg[fromZone];
        const item = fromArr.find((i) => i.id === id);
        if (!item) return s;
        const fromIndex = fromArr.findIndex((i) => i.id === id);
        const fromFiltered = fromArr.filter((i) => i.id !== id);
        if (fromZone === toZone) {
          const adjusted = fromIndex < toIndex ? toIndex - 1 : toIndex;
          const newArr = [...fromFiltered];
          newArr.splice(adjusted, 0, item);
          return { ...s, iceberg: { ...s.iceberg, [fromZone]: newArr } };
        }
        const toArr = [...s.iceberg[toZone]];
        toArr.splice(toIndex, 0, item);
        return {
          ...s,
          iceberg: {
            ...s.iceberg,
            [fromZone]: fromFiltered,
            [toZone]: toArr,
          },
        };
      });
    },
    [setState],
  );

  const updatePadre = useCallback((key: keyof IcebergState["padres"], value: string) => {
    setState((s) => ({
      ...s,
      iceberg: { ...s.iceberg, padres: { ...s.iceberg.padres, [key]: value } },
    }));
  }, [setState]);

  const updateHijo = useCallback((key: keyof IcebergState["hijos"], value: string) => {
    setState((s) => ({
      ...s,
      iceberg: { ...s.iceberg, hijos: { ...s.iceberg.hijos, [key]: value } },
    }));
  }, [setState]);

  const updateProposal = useCallback((v: string) => {
    setState((s) => ({ ...s, filtro: { ...s.filtro, proposal: v } }));
  }, [setState]);

  const updateQuestion = useCallback((key: keyof FiltroState["questions"], value: string) => {
    setState((s) => ({
      ...s,
      filtro: { ...s.filtro, questions: { ...s.filtro.questions, [key]: value } },
    }));
  }, [setState]);

  const updateFiltroVerdict = useCallback((v: FilterVerdict) => {
    setState((s) => ({ ...s, filtro: { ...s.filtro, verdict: v } }));
  }, [setState]);

  const updateDeliverable = useCallback((key: keyof CierreState["deliverable"], value: string) => {
    setState((s) => ({
      ...s,
      cierre: { ...s.cierre, deliverable: { ...s.cierre.deliverable, [key]: value } },
    }));
  }, [setState]);

  const updateClosure = useCallback((key: keyof CierreState["closure"], value: string) => {
    setState((s) => ({
      ...s,
      cierre: { ...s.cierre, closure: { ...s.cierre.closure, [key]: value } },
    }));
  }, [setState]);

  const updateSignature = useCallback((key: keyof CierreState["signature"], value: string) => {
    setState((s) => ({
      ...s,
      cierre: { ...s.cierre, signature: { ...s.cierre.signature, [key]: value } },
    }));
  }, [setState]);

  const filledMap = useMemo((): Record<TabId, boolean> => {
    const countFilled = (obj: Record<string, string>, keys: string[]) =>
      keys.filter((k) => obj[k] && obj[k].trim && obj[k].trim()).length > 0;

    const t1 = countFilled(state.mapa as unknown as Record<string, string>, Object.keys(state.mapa));
    const t2 = Object.values(state.matriz.rows).some(
      (r) => r.c1 || r.c2 || r.c3 || r.c4 || (r.note && r.note.trim())
    ) || countFilled(state.matriz.exercise, ["m1", "m2", "m3"]);
    const t3 = state.rent.rows.some((r) => r.name || r.volumen || r.margen || r.veredicto) ||
      countFilled(state.rent.exercise, ["r1", "r2", "r3", "r4", "r5"]);
    const t4 = state.iceberg.above.some((i, idx) => i.text && i.text !== DEFAULT_ABOVE[idx]) ||
      state.iceberg.below.some((i, idx) => i.text && i.text !== DEFAULT_BELOW[idx]) ||
      countFilled(state.iceberg.padres, ["p1","p2","p3","p4","p5"]) ||
      countFilled(state.iceberg.hijos, ["h1","h2","h3","h4","h5"]);
    const t5 = !!state.filtro.proposal ||
      countFilled(state.filtro.questions, ["q1","q2","q3","q4","q5","q6","q7"]) ||
      !!state.filtro.verdict;
    const t6 = countFilled(state.cierre.deliverable, ["d1","d2","d3","d4","d5","d6"]) ||
      countFilled(state.cierre.signature, ["fecha","empresa","participantes","proxima"]);

    return { t1, t2, t3, t4, t5, t6 };
  }, [state]);

  const noop = () => {};

  return (
    <div style={{ background: C.white, minHeight: "100vh", fontFamily: "Inter, sans-serif" }}>
      <div className="screen-only" style={{ maxWidth: 1380, margin: "0 auto", padding: "32px 24px" }}>
        <Header onPrint={() => window.print()} onClear={resetAll} />
        <Tabs active={activeTab} onChange={handleTabChange} filledMap={filledMap} />

        {activeTab === "t1" && (
          <MapaModule
            mapa={state.mapa}
            onChange={updateMapa}
            onNext={() => handleTabChange("t2")}
          />
        )}
        {activeTab === "t2" && (
          <MatrizModule
            matriz={state.matriz}
            onChangeRow={updateMatrizRow}
            onChangeExercise={updateMatrizExercise}
            onNext={() => handleTabChange("t3")}
          />
        )}
        {activeTab === "t3" && (
          <RentabilidadModule
            rent={state.rent}
            onChangeRow={updateRentRow}
            onAddRow={addRentRow}
            onDeleteRow={deleteRentRow}
            onChangeExercise={updateRentExercise}
            onNext={() => handleTabChange("t4")}
          />
        )}
        {activeTab === "t4" && (
          <IcebergModule
            iceberg={state.iceberg}
            onChangeItem={updateIcebergItem}
            onChangeItemStatus={updateIcebergItemStatus}
            onDeleteItem={deleteIcebergItem}
            onAddItem={addIcebergItem}
            onMoveItem={moveIcebergItem}
            onChangePadre={updatePadre}
            onChangeHijo={updateHijo}
            onNext={() => handleTabChange("t5")}
          />
        )}
        {activeTab === "t5" && (
          <FiltroModule
            filtro={state.filtro}
            onChangeProposal={updateProposal}
            onChangeQuestion={updateQuestion}
            onChangeVerdict={updateFiltroVerdict}
            onNext={() => handleTabChange("t6")}
          />
        )}
        {activeTab === "t6" && (
          <CierreModule
            state={state}
            onChangeDeliverable={updateDeliverable}
            onChangeClosure={updateClosure}
            onChangeSignature={updateSignature}
          />
        )}

        <Footer />
      </div>

      <div className="print-only">
        <div className="tab-pane">
          <div className="tab-pane-inner">
            <MapaModule mapa={state.mapa} onChange={updateMapa} onNext={noop} />
          </div>
        </div>
        <div className="tab-pane">
          <div className="tab-pane-inner">
            <MatrizModule
              matriz={state.matriz}
              onChangeRow={updateMatrizRow}
              onChangeExercise={updateMatrizExercise}
              onNext={noop}
            />
          </div>
        </div>
        <div className="tab-pane">
          <div className="tab-pane-inner">
            <RentabilidadModule
              rent={state.rent}
              onChangeRow={updateRentRow}
              onAddRow={addRentRow}
              onDeleteRow={deleteRentRow}
              onChangeExercise={updateRentExercise}
              onNext={noop}
            />
          </div>
        </div>
        <div className="tab-pane">
          <div className="tab-pane-inner">
            <IcebergModule
              iceberg={state.iceberg}
              onChangeItem={updateIcebergItem}
              onChangeItemStatus={updateIcebergItemStatus}
              onDeleteItem={deleteIcebergItem}
              onAddItem={addIcebergItem}
              onMoveItem={moveIcebergItem}
              onChangePadre={updatePadre}
              onChangeHijo={updateHijo}
              onNext={noop}
            />
          </div>
        </div>
        <div className="tab-pane">
          <div className="tab-pane-inner">
            <FiltroModule
              filtro={state.filtro}
              onChangeProposal={updateProposal}
              onChangeQuestion={updateQuestion}
              onChangeVerdict={updateFiltroVerdict}
              onNext={noop}
            />
          </div>
        </div>
        <div className="tab-pane">
          <div className="tab-pane-inner">
            <CierreModule
              state={state}
              onChangeDeliverable={updateDeliverable}
              onChangeClosure={updateClosure}
              onChangeSignature={updateSignature}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
