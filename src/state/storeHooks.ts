import { useContext } from "react";
import type { HistoryLine } from "../dr/drTotals";
import { createId } from "./ids";
import { StoreContext } from "./storeContext";

export const useStore = () => {
  const ctx = useContext(StoreContext);
  if (!ctx) {
    throw new Error("useStore must be used within StoreProvider");
  }
  return ctx;
};

export const useActiveContext = () => {
  const { state } = useStore();
  const chantier = state.chantiers.find((c) => c.id === state.activeChantierId) || null;
  const piece = chantier?.pieces.find((p) => p.id === state.activePieceId) || null;
  return { chantier, piece };
};

export const buildHistoryLine = (
  chantierId: string,
  pieceId: string,
  texte: string,
  data: HistoryLine["data"]
): HistoryLine => ({
  id: createId(),
  chantierId,
  pieceId,
  texte,
  data,
});
