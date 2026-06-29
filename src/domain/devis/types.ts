import type { CostLine, PricingSummary } from "../pricing/types";

export type QuoteLine = {
  id: string;
  designation: string;
  label: string;
  unit: string;
  quantity: number;
  unitPriceHT: number;
  totalHT: number;
  materialCostHT?: number;
  laborCostHT?: number;
  marginAmount?: number;
  marginRate?: number;
  tradeId?: string;
  ouvrageId?: string;
  operationId?: string;
  materialIds?: string[];
  laborHours?: number;
};

export type QuoteSection = {
  id: string;
  title: string;
  lines: QuoteLine[];
};

export type Quote = {
  id: string;
  chantierId: string;
  version: number;
  status: "draft" | "sent" | "accepted" | "refused";
  sections: QuoteSection[];
  costLines: CostLine[];
  pricing: PricingSummary;
  createdAt: string;
  updatedAt: string;
};
