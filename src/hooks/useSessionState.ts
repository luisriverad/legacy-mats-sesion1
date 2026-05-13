import { useState, useEffect, useCallback } from "react";
import type { AppState } from "../types";
import { STORAGE_KEY, defaultState, DEFAULTS_CLOSURE } from "../constants";

export function useSessionState() {
  const [state, setState] = useState<AppState>(defaultState);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const loaded = JSON.parse(raw) as Partial<AppState>;
      setState((s) => ({
        mapa: { ...s.mapa, ...(loaded.mapa || {}) },
        matriz: {
          rows: { ...s.matriz.rows, ...(loaded.matriz?.rows || {}) },
          exercise: { ...s.matriz.exercise, ...(loaded.matriz?.exercise || {}) },
        },
        rent: {
          rows:
            loaded.rent?.rows && loaded.rent.rows.length
              ? loaded.rent.rows
              : s.rent.rows,
          exercise: { ...s.rent.exercise, ...(loaded.rent?.exercise || {}) },
        },
        iceberg: {
          above: loaded.iceberg?.above || s.iceberg.above,
          below: loaded.iceberg?.below || s.iceberg.below,
          padres: { ...s.iceberg.padres, ...(loaded.iceberg?.padres || {}) },
          hijos: { ...s.iceberg.hijos, ...(loaded.iceberg?.hijos || {}) },
        },
        filtro: {
          proposal: loaded.filtro?.proposal || "",
          questions: { ...s.filtro.questions, ...(loaded.filtro?.questions || {}) },
          verdict: loaded.filtro?.verdict || null,
        },
        cierre: {
          deliverable: { ...s.cierre.deliverable, ...(loaded.cierre?.deliverable || {}) },
          closure: { ...DEFAULTS_CLOSURE, ...(loaded.cierre?.closure || {}) },
          signature: { ...s.cierre.signature, ...(loaded.cierre?.signature || {}) },
        },
      }));
    } catch (e) {
      console.warn("Failed to load saved state:", e);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.warn("Failed to save state:", e);
    }
  }, [state]);

  const resetAll = useCallback(() => {
    if (window.confirm("¿Limpiar TODA la sesión (los 5 módulos + cierre)? Esta acción no se puede deshacer.")) {
      try { localStorage.removeItem(STORAGE_KEY); } catch (e) {}
      setState(defaultState());
    }
  }, []);

  return { state, setState, resetAll };
}
