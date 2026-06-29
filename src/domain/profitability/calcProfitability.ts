import type { ProfitabilitySummary } from "./types";

export type ProfitabilityInput = {
  costHT: number;
  saleHT: number;
};

const roundMoney = (value: number) => Number(value.toFixed(2));

export const calcProfitability = ({
  costHT,
  saleHT,
}: ProfitabilityInput): ProfitabilitySummary => {
  const marginAmount = roundMoney(saleHT - costHT);
  const marginRate = costHT > 0 ? roundMoney((marginAmount / costHT) * 100) : 0;

  return {
    costHT: roundMoney(costHT),
    saleHT: roundMoney(saleHT),
    marginAmount,
    marginRate,
  };
};
