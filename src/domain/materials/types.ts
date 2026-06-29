export type MaterialNeed = {
  id: string;
  label: string;
  unit: string;
  quantity: number;
  wasteRate?: number;
  tradeId?: string;
  operationId?: string;
};
