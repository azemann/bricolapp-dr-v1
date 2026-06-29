import { useState } from "react";
import type { DRModuleSpec } from "../../dr/drCore";
import { validateNumericParams } from "../../dr/drCore";
import type { HistoryLine } from "../../dr/drTotals";
import { getValidationMessages } from "./validationMessages";

type HistoryDraft = {
  texte: string;
  data: HistoryLine["data"];
};

type UseLegacyModuleCalculationOptions<
  TParams extends Record<string, number>,
  TResult extends Record<string, number>,
> = {
  module: DRModuleSpec<TParams, TResult>;
  inputs: Partial<Record<keyof TParams, unknown>>;
  canAddLine: boolean;
  pieceName: string;
  onAddLine: (texte: string, data: HistoryLine["data"]) => void;
  buildHistoryDraft: (params: TParams, result: TResult, context: { pieceName: string }) => HistoryDraft;
};

export const useLegacyModuleCalculation = <
  TParams extends Record<string, number>,
  TResult extends Record<string, number>,
>({
  module,
  inputs,
  canAddLine,
  pieceName,
  onAddLine,
  buildHistoryDraft,
}: UseLegacyModuleCalculationOptions<TParams, TResult>) => {
  const [result, setResult] = useState<TResult | null>(null);
  const [validationMessages, setValidationMessages] = useState<string[]>([]);

  const validate = () => {
    const validation = validateNumericParams(module.inputSpec, inputs);
    setValidationMessages(validation.ok ? [] : getValidationMessages(validation));
    return validation;
  };

  const onCalc = () => {
    const validation = validate();
    if (!validation.ok || !validation.values) return;
    setResult(module.compute(validation.values));
  };

  const onAdd = () => {
    const validation = validate();
    if (!validation.ok || !validation.values || !canAddLine) return;
    const computedResult = module.compute(validation.values);
    const draft = buildHistoryDraft(validation.values, computedResult, { pieceName });
    onAddLine(draft.texte, draft.data);
    setResult(computedResult);
  };

  return {
    result,
    validationMessages,
    onCalc,
    onAdd,
  };
};
