import type { CostLine, PricingInput, PricingPrices, PricingSummary } from "./types";

export const parsePriceNumber = (value: string) => {
  const parsed = parseFloat(value.replace(",", "."));
  return Number.isNaN(parsed) ? 0 : parsed;
};

const roundMoney = (value: number) => Number(value.toFixed(2));

export const buildCostLines = ({ totals, prices }: PricingInput): CostLine[] => {
  const entries = [
    { label: "Carrelage (cartons)", quantity: totals.carrelage_cartons, priceKey: "prixCarton" },
    { label: "Colle carrelage (sacs)", quantity: totals.carrelage_colle_sacs, priceKey: "prixColle" },
    { label: "Joints carrelage (kg)", quantity: totals.carrelage_joints_kg, priceKey: "prixJoints" },
    { label: "Peinture (pots)", quantity: totals.peinture_pots, priceKey: "prixPot" },
    { label: "Sous-couche (pots)", quantity: totals.peinture_sous_couche_pots, priceKey: "prixSousCouche" },
    { label: "Placo (plaques)", quantity: totals.placo_plaques, priceKey: "prixPlaque" },
    { label: "Montants", quantity: totals.placo_montants, priceKey: "prixMontant" },
    { label: "Rails (m)", quantity: totals.placo_rails, priceKey: "prixRail" },
    { label: "Vis (boites)", quantity: totals.placo_vis_boites, priceKey: "prixVis" },
    { label: "Bandes/enduit (sacs)", quantity: totals.placo_bandes_sacs, priceKey: "prixBandes" },
    { label: "Bardage (lames)", quantity: totals.bardage_lames, priceKey: "prixLame" },
    { label: "Liteaux (m)", quantity: totals.bardage_liteaux_ml, priceKey: "prixLiteau" },
    { label: "Plomberie alim (m)", quantity: totals.plomberie_alim_ml, priceKey: "prixTubeAlim" },
    { label: "Plomberie evac (m)", quantity: totals.plomberie_evacu_ml, priceKey: "prixTubeEvac" },
    { label: "Robinets", quantity: totals.plomberie_robinets, priceKey: "prixRobinetArret" },
    { label: "Siphons", quantity: totals.plomberie_siphons, priceKey: "prixSiphon" },
  ] as const;

  return entries
    .filter((entry) => entry.quantity > 0)
    .map((entry) => {
      const unitPriceHT = parsePriceNumber(prices[entry.priceKey]);
      return {
        label: entry.label,
        quantity: entry.quantity,
        unitPriceHT,
        totalHT: roundMoney(entry.quantity * unitPriceHT),
      };
    });
};

export const calcPricing = ({ totals, prices }: PricingInput): PricingSummary => {
  const materialCostHT = roundMoney(
    buildCostLines({ totals, prices }).reduce((sum, line) => sum + line.totalHT, 0)
  );
  const marginRateInput = parsePriceNumber(prices.marge) / 100;
  const vatRateInput = parsePriceNumber(prices.tva) / 100;
  const saleHT = roundMoney(materialCostHT * (1 + marginRateInput));
  const marginAmount = roundMoney(saleHT - materialCostHT);
  const marginRate = materialCostHT > 0 ? roundMoney((marginAmount / materialCostHT) * 100) : 0;
  const vatAmount = roundMoney(saleHT * vatRateInput);
  const totalTTC = roundMoney(saleHT + vatAmount);

  return {
    materialCostHT,
    saleHT,
    marginAmount,
    marginRate,
    vatAmount,
    totalTTC,
  };
};

export const hasInvalidPrices = (prices: PricingPrices) =>
  Object.values(prices).some((value) => value.trim() !== "" && Number.isNaN(parseFloat(value.replace(",", "."))));
