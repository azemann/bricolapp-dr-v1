const roundMoney = (value: number) => Number(value.toFixed(2));

export type MarginInput = {
  costHT: number;
  marginRate: number;
};

export type MarginSummary = {
  costHT: number;
  saleHT: number;
  marginAmount: number;
  marginRate: number;
};

export const calcMargin = ({ costHT, marginRate }: MarginInput): MarginSummary => {
  const saleHT = roundMoney(costHT * (1 + marginRate));
  const marginAmount = roundMoney(saleHT - costHT);

  return {
    costHT: roundMoney(costHT),
    saleHT,
    marginAmount,
    marginRate: roundMoney(marginRate * 100),
  };
};
