import React, { useEffect, useMemo, useReducer } from "react";
import type { AppAction, AppState, Chantier, Piece } from "./types";
import { defaultPrices } from "./types";
import { createId } from "./ids";
import { StoreContext } from "./storeContext";

const STORAGE_KEY = "bricochantier_state_v0";

const emptyState = (): AppState => ({
  chantiers: [],
  history: [],
  activeChantierId: null,
  activePieceId: null,
  prices: defaultPrices(),
});

const isLocalStorageAvailable = () => {
  try {
    return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
  } catch {
    return false;
  }
};

const loadState = (): AppState => {
  if (!isLocalStorageAvailable()) {
    return emptyState();
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyState();

    const parsed = JSON.parse(raw) as Partial<AppState>;
    if (!parsed || typeof parsed !== "object") {
      throw new Error("Invalid persisted state");
    }

    return {
      ...emptyState(),
      chantiers: Array.isArray(parsed.chantiers) ? parsed.chantiers : [],
      history: Array.isArray(parsed.history) ? parsed.history : [],
      activeChantierId:
        typeof parsed.activeChantierId === "string" ? parsed.activeChantierId : null,
      activePieceId:
        typeof parsed.activePieceId === "string" ? parsed.activePieceId : null,
      prices: { ...defaultPrices(), ...(parsed.prices || {}) },
    };
  } catch (error) {
    console.warn("Failed to load saved state, resetting localStorage", error);
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Ignore cleanup failures.
    }
    return emptyState();
  }
};

const saveState = (state: AppState) => {
  if (!isLocalStorageAvailable()) return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Ignore persistence failures (private mode, quota, etc.).
  }
};

const reducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case "CHANTIER_ADD": {
      const chantier: Chantier = {
        id: createId(),
        name: action.payload.name.trim(),
        pieces: [],
      };
      return {
        ...state,
        chantiers: [...state.chantiers, chantier],
        activeChantierId: chantier.id,
        activePieceId: null,
      };
    }
    case "CHANTIER_REMOVE": {
      const { chantierId } = action.payload;
      const nextChantiers = state.chantiers.filter((c) => c.id !== chantierId);
      const nextHistory = state.history.filter((h) => h.chantierId !== chantierId);
      const nextActive = state.activeChantierId === chantierId ? null : state.activeChantierId;
      const nextPiece = state.activeChantierId === chantierId ? null : state.activePieceId;
      return {
        ...state,
        chantiers: nextChantiers,
        history: nextHistory,
        activeChantierId: nextActive,
        activePieceId: nextPiece,
      };
    }
    case "CHANTIER_SET_ACTIVE": {
      return {
        ...state,
        activeChantierId: action.payload.chantierId,
        activePieceId: null,
      };
    }
    case "PIECE_ADD": {
      const { chantierId, piece } = action.payload;
      const newPiece: Piece = { ...piece, id: createId() };
      return {
        ...state,
        chantiers: state.chantiers.map((c) =>
          c.id === chantierId ? { ...c, pieces: [...c.pieces, newPiece] } : c
        ),
        activePieceId: newPiece.id,
      };
    }
    case "PIECE_REMOVE": {
      const { chantierId, pieceId } = action.payload;
      return {
        ...state,
        chantiers: state.chantiers.map((c) =>
          c.id === chantierId
            ? { ...c, pieces: c.pieces.filter((p) => p.id !== pieceId) }
            : c
        ),
        history: state.history.filter((h) => h.pieceId !== pieceId),
        activePieceId: state.activePieceId === pieceId ? null : state.activePieceId,
      };
    }
    case "PIECE_SET_ACTIVE": {
      return { ...state, activePieceId: action.payload.pieceId };
    }
    case "HISTORY_ADD": {
      return { ...state, history: [...state.history, action.payload.line] };
    }
    case "HISTORY_REMOVE": {
      const { lineId } = action.payload;
      return { ...state, history: state.history.filter((line) => line.id !== lineId) };
    }
    case "HISTORY_REMOVE_BY_CHANTIER": {
      const { chantierId } = action.payload;
      return { ...state, history: state.history.filter((h) => h.chantierId !== chantierId) };
    }
    case "HISTORY_REMOVE_BY_PIECE": {
      const { pieceId } = action.payload;
      return { ...state, history: state.history.filter((h) => h.pieceId !== pieceId) };
    }
    case "PRICES_UPDATE": {
      return { ...state, prices: { ...state.prices, ...action.payload } };
    }
    case "RESET_ALL": {
      return emptyState();
    }
    default:
      return state;
  }
};

export const StoreProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(reducer, undefined, loadState);

  useEffect(() => {
    saveState(state);
  }, [state]);

  const value = useMemo(() => ({ state, dispatch }), [state]);

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
};
