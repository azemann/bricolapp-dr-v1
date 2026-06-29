import type { Totals } from "../../dr/drTotals";

export type PriceKey =
  | "prixCarton"
  | "prixPot"
  | "prixPlaque"
  | "prixMontant"
  | "prixRail"
  | "prixLame"
  | "prixColle"
  | "prixJoints"
  | "prixSousCouche"
  | "prixVis"
  | "prixBandes"
  | "prixLiteau"
  | "prixTubeAlim"
  | "prixTubeEvac"
  | "prixRobinetArret"
  | "prixSiphon"
  | "tva"
  | "marge";

export type PricingPrices = Record<PriceKey, string>;

export type CostLine = {
  label: string;
  quantity: number;
  unitPriceHT: number;
  totalHT: number;
};

export type PricingSummary = {
  materialCostHT: number;
  laborCostHT?: number;
  saleHT: number;
  marginAmount: number;
  marginRate: number;
  vatAmount: number;
  totalTTC: number;
};

export type PricingContext = {
  materialUnitCosts?: Record<string, number>;
  laborHourlyRateHT?: number;
  marginRate?: number;
};

export type PricingInput = {
  totals: Totals;
  prices: PricingPrices;
};
