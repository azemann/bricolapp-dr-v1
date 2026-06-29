import type { HistoryLine } from "../../dr/drTotals";
import type { OuvrageLine } from "../ouvrages/types";
import { computeElectriciteOuvrage } from "../trades/electricite/engine";
import {
  installationElectriqueCompleteOuvrage,
  type InstallationElectriqueCompleteInputs,
} from "../trades/electricite/ouvrages/installationElectriqueComplete";
import { defaultElectricitePricing } from "../trades/electricite/pricing";

type ElectriciteHistoryDraft = {
  texte: string;
  data: HistoryLine["data"];
};

type HistoryContext = {
  pieceName: string;
};

export const buildElectriciteInstallationCompleteHistoryDraft = (
  inputs: InstallationElectriqueCompleteInputs,
  context: HistoryContext,
): ElectriciteHistoryDraft => {
  const result = computeElectriciteOuvrage(
    installationElectriqueCompleteOuvrage,
    inputs,
    defaultElectricitePricing,
  );

  const ouvrageLine: OuvrageLine<Record<string, number>> = {
    id: "electricite-installation-complete-draft",
    chantierId: "",
    pieceId: "",
    ouvrageId: installationElectriqueCompleteOuvrage.id,
    label: installationElectriqueCompleteOuvrage.label,
    unit: installationElectriqueCompleteOuvrage.unit,
    quantity: 1,
    inputs: {
      surfaceLogementM2: inputs.surfaceLogementM2,
      nombrePieces: inputs.nombrePieces,
      nombrePrises: inputs.nombrePrises,
      nombrePointsLumineux: inputs.nombrePointsLumineux,
      nombreCircuitsSpecialises: inputs.nombreCircuitsSpecialises,
      longueurMoyenneCircuitMl: inputs.longueurMoyenneCircuitMl,
    },
    needs: result.needs,
    materialCostHT: result.profitability.materialCostHT,
    laborCostHT: result.profitability.laborCostHT,
    overheadCostHT: result.profitability.overheadCostHT,
    salePriceHT: result.profitability.salePriceHT,
    marginAmount: result.profitability.marginAmount,
    marginRate: result.profitability.marginRate,
    tvaRate: 20,
  };

  return {
    texte: `Électricité - ${context.pieceName} - installation complète, ${result.needs.length} postes matériaux, ${result.labor.hours.toFixed(1)} h, vente ${result.profitability.salePriceHT.toFixed(2)} EUR HT`,
    data: {
      type: "electricite",
      values: ouvrageLine.inputs,
      ouvrageLine,
    },
  };
};
