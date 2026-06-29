import type { QuoteLine } from "../devis/types";
import type { LaborEstimate } from "../labor/types";
import type { MaterialNeed } from "../materials/types";
import type { PricingContext } from "../pricing/types";
import type { TradeLot } from "../trades/types";

export type FieldKind = "number" | "choice" | "boolean";

export type OuvrageInputField = {
  id: string;
  label: string;
  kind: FieldKind;
  unit?: string;
  defaultValue?: number | string | boolean;
  min?: number;
  max?: number;
  options?: { value: string; label: string }[];
};

export type OuvrageQuoteLine = {
  label: string;
  unit: string;
  quantity: number;
  needs: MaterialNeed[];
  labor: LaborEstimate;
};

export type OuvrageDefinition<TInputs extends Record<string, unknown> = Record<string, unknown>> = {
  id: string;
  tradeId: string;
  label: string;
  unit: string;
  description?: string;
  inputFields: OuvrageInputField[];
  computeNeeds: (inputs: TInputs) => MaterialNeed[];
  computeLabor: (inputs: TInputs) => LaborEstimate;
  buildQuoteLine: (
    inputs: TInputs,
    needs: MaterialNeed[],
    labor: LaborEstimate,
    pricing?: PricingContext,
  ) => QuoteLine;
  buildTradeLots?: (inputs: TInputs) => TradeLot[];
  buildQuoteLines?: (inputs: TInputs, pricing?: PricingContext) => QuoteLine[];
};

export type OuvrageInstance<TInputs extends Record<string, unknown> = Record<string, unknown>> = {
  id: string;
  definitionId: string;
  projectId: string;
  zoneId: string;
  label: string;
  inputs: TInputs;
  tradeLots: TradeLot[];
  quoteLines: QuoteLine[];
  createdAt: string;
  updatedAt: string;
};

export type OuvrageLine<TInputs extends Record<string, unknown> = Record<string, unknown>> = {
  id: string;
  chantierId: string;
  pieceId: string;
  ouvrageId: string;
  label: string;
  unit: string;
  quantity: number;
  inputs: TInputs;
  needs: MaterialNeed[];
  materialCostHT: number;
  laborCostHT: number;
  overheadCostHT: number;
  salePriceHT: number;
  marginAmount: number;
  marginRate: number;
  tvaRate: number;
};
