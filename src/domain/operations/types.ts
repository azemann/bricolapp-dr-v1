import type { LaborEstimate } from "../labor/types";
import type { MaterialNeed } from "../materials/types";

export type OperationDefinition<TInputs extends Record<string, unknown> = Record<string, unknown>> = {
  id: string;
  label: string;
  tradeId: string;
  description?: string;
  computeMaterials: (inputs: TInputs) => MaterialNeed[];
  computeLabor: (inputs: TInputs) => LaborEstimate;
};
