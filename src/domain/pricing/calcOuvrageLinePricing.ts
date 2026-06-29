import type { MaterialNeed } from "../materials/types";
import type { PriceKey, PricingPrices } from "./types";
import { calcCosts } from "./calcCosts";
import { calcMargin } from "./calcMargin";
import { parsePriceNumber } from "./calcPricing";

export type PricedMaterialNeed = MaterialNeed & {
  priceKey?: PriceKey;
};

export type OuvrageLinePricingInput = {
  needs: PricedMaterialNeed[];
  prices: PricingPrices;
  laborCostHT?: number;
  overheadCostHT?: number;
};

export type OuvrageLinePricingSummary = {
  materialCostHT: number;
  laborCostHT: number;
  overheadCostHT: number;
  salePriceHT: number;
  marginAmount: number;
  marginRate: number;
  tvaRate: number;
};

export const calcOuvrageLinePricing = ({
  needs,
  prices,
  laborCostHT = 0,
  overheadCostHT = 0,
}: OuvrageLinePricingInput): OuvrageLinePricingSummary => {
  const materialLines = needs
    .filter((need) => need.quantity > 0)
    .map((need) => {
      const unitPriceHT = need.priceKey ? parsePriceNumber(prices[need.priceKey]) : 0;

      return {
        label: need.label,
        quantity: need.quantity,
        unitPriceHT,
        totalHT: Number((need.quantity * unitPriceHT).toFixed(2)),
      };
    });

  const costs = calcCosts({
    materialLines,
    laborCostHT,
    overheadCostHT,
  });
  const margin = calcMargin({
    costHT: costs.totalCostHT,
    marginRate: parsePriceNumber(prices.marge) / 100,
  });

  return {
    materialCostHT: costs.materialCostHT,
    laborCostHT: costs.laborCostHT,
    overheadCostHT: costs.overheadCostHT,
    salePriceHT: margin.saleHT,
    marginAmount: margin.marginAmount,
    marginRate: margin.marginRate,
    tvaRate: Number(parsePriceNumber(prices.tva).toFixed(2)),
  };
};
