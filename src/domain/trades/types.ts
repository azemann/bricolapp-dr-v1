import type { OuvrageDefinition } from "../ouvrages/types";
import type { OperationDefinition } from "../operations/types";

export type TradeId =
  | "carrelage"
  | "peinture"
  | "placo"
  | "bardage"
  | "plomberie"
  | "electricite"
  | "etancheite"
  | (string & {});

export type TradeLot = {
  id: string;
  tradeId: TradeId;
  label: string;
  operations: OperationDefinition[];
};

export type Trade = {
  id: TradeId;
  label: string;
  description?: string;
  ouvrages: OuvrageDefinition[];
};
