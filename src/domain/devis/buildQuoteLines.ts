import type { Totals } from "../../dr/drTotals";
import type { OuvrageLine } from "../ouvrages/types";
import { buildCostLines, parsePriceNumber } from "../pricing/calcPricing";
import type { PricingPrices } from "../pricing/types";
import type { QuoteLine } from "./types";

const roundMoney = (value: number) => Number(value.toFixed(2));

export type BuildQuoteLinesInput = {
  totals: Totals;
  prices: PricingPrices;
};

export const buildQuoteLines = ({ totals, prices }: BuildQuoteLinesInput): QuoteLine[] => {
  const marginRate = parsePriceNumber(prices.marge) / 100;

  return buildCostLines({ totals, prices }).map((line, index) => {
    const totalHT = roundMoney(line.totalHT * (1 + marginRate));

    return {
      id: `legacy-material-${index}`,
      designation: line.label,
      label: line.label,
      unit: "u",
      quantity: line.quantity,
      unitPriceHT: line.quantity > 0 ? roundMoney(totalHT / line.quantity) : 0,
      totalHT,
      materialCostHT: line.totalHT,
      laborCostHT: 0,
      marginAmount: roundMoney(totalHT - line.totalHT),
      marginRate: roundMoney(marginRate * 100),
    };
  });
};

export const buildQuoteLinesFromOuvrageLines = (
  ouvrageLines: OuvrageLine[],
): QuoteLine[] =>
  ouvrageLines.map((line) => ({
    id: `quote-${line.id}`,
    designation: line.label,
    label: line.label,
    unit: line.unit,
    quantity: line.quantity,
    unitPriceHT: line.quantity > 0 ? roundMoney(line.salePriceHT / line.quantity) : line.salePriceHT,
    totalHT: line.salePriceHT,
    materialCostHT: line.materialCostHT,
    laborCostHT: line.laborCostHT,
    marginAmount: line.marginAmount,
    marginRate: line.marginRate,
    ouvrageId: line.ouvrageId,
    materialIds: line.needs.map((need) => need.id),
  }));
