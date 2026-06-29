import type { CostLine } from "./types";

const roundMoney = (value: number) => Number(value.toFixed(2));

export type CostSummaryInput = {
  materialLines: CostLine[];
  laborCostHT?: number;
  overheadCostHT?: number;
};

export type CostSummary = {
  materialCostHT: number;
  laborCostHT: number;
  overheadCostHT: number;
  totalCostHT: number;
};

export const calcCosts = ({
  materialLines,
  laborCostHT = 0,
  overheadCostHT = 0,
}: CostSummaryInput): CostSummary => {
  const materialCostHT = roundMoney(
    materialLines.reduce((total, line) => total + line.totalHT, 0),
  );
  const roundedLaborCostHT = roundMoney(laborCostHT);
  const roundedOverheadCostHT = roundMoney(overheadCostHT);

  return {
    materialCostHT,
    laborCostHT: roundedLaborCostHT,
    overheadCostHT: roundedOverheadCostHT,
    totalCostHT: roundMoney(materialCostHT + roundedLaborCostHT + roundedOverheadCostHT),
  };
};
