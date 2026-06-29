import type { InstallationElectriqueCompleteInputs } from "../../domain/trades/electricite/ouvrages/installationElectriqueComplete";

export type ElectriciteFormInputs = {
  surfaceLogementM2: string;
  nombrePieces: string;
  nombrePrises: string;
  nombrePointsLumineux: string;
  nombreCircuitsSpecialises: string;
  longueurMoyenneCircuitMl: string;
};

export const defaultElectriciteFormInputs = (): ElectriciteFormInputs => ({
  surfaceLogementM2: "80",
  nombrePieces: "5",
  nombrePrises: "24",
  nombrePointsLumineux: "10",
  nombreCircuitsSpecialises: "6",
  longueurMoyenneCircuitMl: "12",
});

const toNumber = (value: string) => Number(value.replace(",", ".")) || 0;

export const parseElectriciteInputs = (
  inputs: ElectriciteFormInputs,
): InstallationElectriqueCompleteInputs => ({
  surfaceLogementM2: toNumber(inputs.surfaceLogementM2),
  nombrePieces: toNumber(inputs.nombrePieces),
  nombrePrises: toNumber(inputs.nombrePrises),
  nombrePointsLumineux: toNumber(inputs.nombrePointsLumineux),
  nombreCircuitsSpecialises: toNumber(inputs.nombreCircuitsSpecialises),
  longueurMoyenneCircuitMl: toNumber(inputs.longueurMoyenneCircuitMl),
  buildingContext: "renovation",
  poseMode: "mixte",
  wallType: "placo",
  ceilingType: "placo",
  accessibility: "moyenne",
  averageHeightM: 2.5,
  avecTableau: true,
  avecGtl: true,
  avecMiseTerre: true,
  requiresConsuel: false,
});
