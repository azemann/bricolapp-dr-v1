import type { HistoryLine } from "../../dr/drTotals";
import type { MaterialNeed } from "../materials/types";
import { calcOuvrageLinePricing, type PricedMaterialNeed } from "../pricing/calcOuvrageLinePricing";
import type { PricingPrices } from "../pricing/types";
import { buildLegacyOuvrageSpec } from "./legacyOuvrageSpecs";
import type { OuvrageLine } from "./types";

const toMaterialNeed = (need: PricedMaterialNeed): MaterialNeed => ({
  id: need.id,
  label: need.label,
  unit: need.unit,
  quantity: need.quantity,
  tradeId: need.tradeId,
});

export const buildOuvrageLineFromHistory = (
  line: HistoryLine,
  prices: PricingPrices,
): OuvrageLine<Record<string, number>> => {
  if (line.data.ouvrageLine) {
    return {
      ...line.data.ouvrageLine,
      id: line.id,
      chantierId: line.chantierId,
      pieceId: line.pieceId,
    };
  }

  const spec = buildLegacyOuvrageSpec(line);
  const pricedNeeds = spec.needs
    .filter((item) => item.quantity > 0)
    .map((item) => ({
      id: item.id,
      label: item.label,
      unit: item.unit,
      quantity: item.quantity,
      tradeId: line.data.type,
      priceKey: item.priceKey,
    }));
  const pricing = calcOuvrageLinePricing({
    needs: pricedNeeds,
    prices,
  });

  return {
    id: line.id,
    chantierId: line.chantierId,
    pieceId: line.pieceId,
    ouvrageId: spec.ouvrageId,
    label: spec.label,
    unit: spec.unit,
    quantity: spec.quantity,
    inputs: line.data.values,
    needs: pricedNeeds.map(toMaterialNeed),
    materialCostHT: pricing.materialCostHT,
    laborCostHT: pricing.laborCostHT,
    overheadCostHT: pricing.overheadCostHT,
    salePriceHT: pricing.salePriceHT,
    marginAmount: pricing.marginAmount,
    marginRate: pricing.marginRate,
    tvaRate: pricing.tvaRate,
  };
};

export const buildOuvrageLinesFromHistory = (
  history: HistoryLine[],
  prices: PricingPrices,
): OuvrageLine<Record<string, number>>[] =>
  history.map((line) => buildOuvrageLineFromHistory(line, prices));
