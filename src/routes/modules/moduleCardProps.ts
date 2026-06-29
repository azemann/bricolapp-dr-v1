import type { HistoryLine } from "../../dr/drTotals";

export type ModuleCardProps = {
  canAddLine: boolean;
  pieceName: string;
  onAddLine: (texte: string, data: HistoryLine["data"]) => void;
};
