import type { OuvrageLine } from "../domain/ouvrages/types";

export type Totals = {
  carrelage_m2: number;
  carrelage_cartons: number;
  carrelage_colle_sacs: number;
  carrelage_joints_kg: number;
  peinture_m2: number;
  peinture_pots: number;
  peinture_sous_couche_pots: number;
  placo_m2: number;
  placo_plaques: number;
  placo_montants: number;
  placo_rails: number;
  placo_vis_boites: number;
  placo_bandes_sacs: number;
  bardage_m2: number;
  bardage_lames: number;
  bardage_liteaux_ml: number;
  plomberie_alim_ml: number;
  plomberie_evacu_ml: number;
  plomberie_robinets: number;
  plomberie_siphons: number;
};

export type HistoryLine = {
  id: string;
  chantierId: string;
  pieceId: string;
  texte: string;
  data: {
    type: "carrelage" | "peinture" | "placo" | "bardage" | "plomberie" | "electricite";
    values: Record<string, number>;
    ouvrageLine?: OuvrageLine<Record<string, number>>;
  };
};

export const emptyTotals = (): Totals => ({
  carrelage_m2: 0,
  carrelage_cartons: 0,
  carrelage_colle_sacs: 0,
  carrelage_joints_kg: 0,
  peinture_m2: 0,
  peinture_pots: 0,
  peinture_sous_couche_pots: 0,
  placo_m2: 0,
  placo_plaques: 0,
  placo_montants: 0,
  placo_rails: 0,
  placo_vis_boites: 0,
  placo_bandes_sacs: 0,
  bardage_m2: 0,
  bardage_lames: 0,
  bardage_liteaux_ml: 0,
  plomberie_alim_ml: 0,
  plomberie_evacu_ml: 0,
  plomberie_robinets: 0,
  plomberie_siphons: 0,
});

const accumulateHistoryLine = (totals: Totals, h: HistoryLine): void => {
  const v = h.data.values || {};
  switch (h.data.type) {
    case "carrelage":
      totals.carrelage_m2 += v.surface || 0;
      totals.carrelage_cartons += v.nbCartons || 0;
      totals.carrelage_colle_sacs += v.colleSacs || 0;
      totals.carrelage_joints_kg += v.jointsKg || 0;
      break;
    case "peinture":
      totals.peinture_m2 += v.surfacePeinte || v.surfaceMurs || 0;
      totals.peinture_pots += v.nbPots || 0;
      totals.peinture_sous_couche_pots += v.sousCouchePots || 0;
      break;
    case "placo":
      totals.placo_m2 += v.surface || 0;
      totals.placo_plaques += v.nbPlaques || 0;
      totals.placo_montants += v.nbMontants || 0;
      totals.placo_rails += v.rails || 0;
      totals.placo_vis_boites += v.visBoites || 0;
      totals.placo_bandes_sacs += v.bandesSacs || 0;
      break;
    case "bardage":
      totals.bardage_m2 += v.surface || 0;
      totals.bardage_lames += v.nbLames || 0;
      totals.bardage_liteaux_ml += v.liteauxMl || 0;
      break;
    case "plomberie":
      totals.plomberie_alim_ml += v.alimMl || 0;
      totals.plomberie_evacu_ml += v.evacMl || 0;
      totals.plomberie_robinets += v.robinets || 0;
      totals.plomberie_siphons += v.siphons || 0;
      break;
    case "electricite":
      break;
  }
};

export const computeTotalsGlobal = (history: HistoryLine[]): Totals => {
  const totals = emptyTotals();
  history.forEach((h) => accumulateHistoryLine(totals, h));
  return totals;
};

export const computeTotalsForChantier = (
  history: HistoryLine[],
  chantierId: string
): Totals => {
  const totals = emptyTotals();
  history
    .filter((h) => h.chantierId === chantierId)
    .forEach((h) => accumulateHistoryLine(totals, h));
  return totals;
};

export const computeTotalsForPiece = (
  history: HistoryLine[],
  pieceId: string
): Totals => {
  const totals = emptyTotals();
  history
    .filter((h) => h.pieceId === pieceId)
    .forEach((h) => accumulateHistoryLine(totals, h));
  return totals;
};
