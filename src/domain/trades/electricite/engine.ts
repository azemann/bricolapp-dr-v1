import type { LaborEstimate } from "../../labor/types";
import type { MaterialNeed } from "../../materials/types";
import type { PricingContext } from "../../pricing/types";
import type {
  ElectriciteLaborBreakdown,
  ElectriciteOuvrageDefinition,
  ElectriciteOuvrageResult,
  ElectriciteProfitabilitySummary,
} from "./types";

const roundMoney = (value: number) => Number(value.toFixed(2));
const roundHours = (value: number) => Number(value.toFixed(2));

export const sumElectriciteLabor = (breakdown: ElectriciteLaborBreakdown): LaborEstimate => ({
  hours: roundHours(
    breakdown.preparationHours +
      breakdown.installationHours +
      breakdown.finishingHours +
      breakdown.controlHours +
      breakdown.cleanupHours,
  ),
  label: "Main-d'œuvre électricité",
  tradeId: "electricite",
});

export const computeElectriciteMaterialCost = (
  needs: MaterialNeed[],
  pricing?: PricingContext,
) =>
  roundMoney(
    needs.reduce((total, need) => {
      const unitCost = pricing?.materialUnitCosts?.[need.id] || 0;
      return total + need.quantity * unitCost;
    }, 0),
  );

export const computeElectriciteProfitability = (
  needs: MaterialNeed[],
  labor: LaborEstimate,
  pricing?: PricingContext,
): ElectriciteProfitabilitySummary => {
  const materialCostHT = computeElectriciteMaterialCost(needs, pricing);
  const laborCostHT = roundMoney(labor.hours * (pricing?.laborHourlyRateHT || 0));
  const overheadCostHT = 0;
  const totalCostHT = roundMoney(materialCostHT + laborCostHT + overheadCostHT);
  const marginRateInput = pricing?.marginRate || 0;
  const salePriceHT = roundMoney(totalCostHT * (1 + marginRateInput));
  const marginAmount = roundMoney(salePriceHT - totalCostHT);

  return {
    materialCostHT,
    laborCostHT,
    overheadCostHT,
    totalCostHT,
    salePriceHT,
    marginAmount,
    marginRate: roundMoney(marginRateInput * 100),
  };
};

export const computeElectriciteOuvrage = <
  TInputs extends Record<string, unknown>,
>(
  ouvrage: ElectriciteOuvrageDefinition<TInputs>,
  inputs: TInputs,
  pricing?: PricingContext,
): ElectriciteOuvrageResult => {
  const needs = ouvrage.computeNeeds(inputs);
  const labor = ouvrage.computeLabor(inputs);

  return {
    needs,
    labor,
    laborBreakdown: ouvrage.computeLaborBreakdown(inputs),
    dependencies: ouvrage.computeDependencies(inputs),
    constraints: ouvrage.computeConstraints(inputs),
    quoteLine: ouvrage.computeQuote(inputs, needs, labor, pricing),
    profitability: ouvrage.computeProfitability(inputs, needs, labor, pricing),
  };
};
