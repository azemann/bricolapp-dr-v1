import type { PricingContext } from "../../pricing/types";

export const electriciteMaterialUnitCosts = {
  "tableau-electrique": 120,
  "inter-differentiel-30ma": 45,
  "disjoncteur-16a": 12,
  "disjoncteur-20a": 14,
  "peigne-tableau": 8,
  "etiquette-tableau": 6,
  gtl: 90,
  "barrette-terre": 12,
  "piquet-terre": 18,
  prise: 8,
  dcl: 6,
  interrupteur: 9,
  "boite-encastrement": 2,
  "cable-3g15": 0.85,
  "cable-3g25": 1.25,
  "gaine-icta": 0.45,
  moulure: 2.2,
  "boite-derivation": 4,
  wago: 0.35,
  visserie: 10,
  cheville: 8,
  collier: 6,
};

export const defaultElectricitePricing: PricingContext = {
  materialUnitCosts: electriciteMaterialUnitCosts,
  laborHourlyRateHT: 42,
  marginRate: 0.35,
};
