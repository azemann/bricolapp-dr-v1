import type { QuoteLine } from "../../devis/types";
import type { LaborEstimate } from "../../labor/types";
import type { MaterialNeed } from "../../materials/types";
import type { OuvrageDefinition } from "../../ouvrages/types";
import type { PricingContext } from "../../pricing/types";

export type ElectriciteBuildingContext = "neuf" | "renovation";
export type ElectricitePoseMode = "encastre" | "apparent" | "mixte";
export type ElectriciteWallType = "placo" | "brique" | "beton" | "pierre" | "bois" | "inconnu";
export type ElectriciteCeilingType = "placo" | "dalle_beton" | "combles_accessibles" | "faux_plafond" | "inconnu";
export type ElectriciteAccessibility = "simple" | "moyenne" | "difficile";

export type ElectriciteWorkContext = {
  buildingContext: ElectriciteBuildingContext;
  poseMode: ElectricitePoseMode;
  wallType: ElectriciteWallType;
  ceilingType: ElectriciteCeilingType;
  accessibility: ElectriciteAccessibility;
  averageHeightM: number;
  requiresConsuel?: boolean;
};

export type ElectriciteConstraint = {
  id: string;
  label: string;
  severity: "info" | "warning" | "blocking";
};

export type ElectriciteDependency = {
  id: string;
  label: string;
  kind: "ouvrage" | "operation" | "material" | "norm" | "control";
  required: boolean;
};

export type ElectriciteLaborBreakdown = {
  preparationHours: number;
  installationHours: number;
  finishingHours: number;
  controlHours: number;
  cleanupHours: number;
};

export type ElectriciteProfitabilitySummary = {
  materialCostHT: number;
  laborCostHT: number;
  overheadCostHT: number;
  totalCostHT: number;
  salePriceHT: number;
  marginAmount: number;
  marginRate: number;
};

export type ElectriciteOuvrageResult = {
  needs: MaterialNeed[];
  labor: LaborEstimate;
  laborBreakdown: ElectriciteLaborBreakdown;
  dependencies: ElectriciteDependency[];
  constraints: ElectriciteConstraint[];
  quoteLine: QuoteLine;
  profitability: ElectriciteProfitabilitySummary;
};

export type ElectriciteOuvrageDefinition<
  TInputs extends Record<string, unknown> = Record<string, unknown>,
> = OuvrageDefinition<TInputs> & {
  category: string;
  computeLaborBreakdown: (inputs: TInputs) => ElectriciteLaborBreakdown;
  computeDependencies: (inputs: TInputs) => ElectriciteDependency[];
  computeConstraints: (inputs: TInputs) => ElectriciteConstraint[];
  computeProfitability: (
    inputs: TInputs,
    needs: MaterialNeed[],
    labor: LaborEstimate,
    pricing?: PricingContext,
  ) => ElectriciteProfitabilitySummary;
  computeQuote: (
    inputs: TInputs,
    needs: MaterialNeed[],
    labor: LaborEstimate,
    pricing?: PricingContext,
  ) => QuoteLine;
};
