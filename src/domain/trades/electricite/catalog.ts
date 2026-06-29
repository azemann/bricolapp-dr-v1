import type { OuvrageDefinition } from "../../ouvrages/types";
import type { Trade } from "../types";
import { installationElectriqueCompleteOuvrage } from "./ouvrages/installationElectriqueComplete";
import {
  buildElectriciteQuoteLine,
  calcInterrupteurSimpleLabor,
  calcInterrupteurSimpleNeeds,
  calcLigneDedieeLabor,
  calcLigneDedieeNeeds,
  calcPointLumineuxSimpleLabor,
  calcPointLumineuxSimpleNeeds,
  calcPriseSimpleLabor,
  calcPriseSimpleNeeds,
  calcSpotEncastreLabor,
  calcSpotEncastreNeeds,
  type InterrupteurSimpleInputs,
  type LigneDedieeInputs,
  type PointLumineuxSimpleInputs,
  type PriseSimpleInputs,
  type SpotEncastreInputs,
} from "./calculators";

export const priseSimpleOuvrage: OuvrageDefinition<PriseSimpleInputs> = {
  id: "electricite-prise-simple",
  tradeId: "electricite",
  label: "Prise simple",
  unit: "u",
  inputFields: [
    { id: "nombre", label: "Nombre", kind: "number", unit: "u", defaultValue: 1, min: 0 },
    {
      id: "longueurMoyenneCable",
      label: "Longueur moyenne de câble",
      kind: "number",
      unit: "ml",
      defaultValue: 5,
      min: 0,
    },
    {
      id: "modePose",
      label: "Mode de pose",
      kind: "choice",
      defaultValue: "encastre",
      options: [
        { value: "encastre", label: "Encastré" },
        { value: "apparent", label: "Apparent" },
      ],
    },
  ],
  computeNeeds: calcPriseSimpleNeeds,
  computeLabor: calcPriseSimpleLabor,
  buildQuoteLine: (inputs, needs, labor, pricing) =>
    buildElectriciteQuoteLine(
      "electricite-prise-simple",
      "Installation prise simple",
      "u",
      inputs.nombre,
      needs,
      labor,
      pricing,
    ),
};

export const pointLumineuxSimpleOuvrage: OuvrageDefinition<PointLumineuxSimpleInputs> = {
  id: "electricite-point-lumineux-simple",
  tradeId: "electricite",
  label: "Point lumineux simple",
  unit: "u",
  inputFields: [
    { id: "nombre", label: "Nombre", kind: "number", unit: "u", defaultValue: 1, min: 0 },
    {
      id: "longueurMoyenneCable",
      label: "Longueur moyenne de câble",
      kind: "number",
      unit: "ml",
      defaultValue: 6,
      min: 0,
    },
    {
      id: "typeCommande",
      label: "Type de commande",
      kind: "choice",
      defaultValue: "simple",
      options: [
        { value: "simple", label: "Simple" },
        { value: "vaEtVient", label: "Va-et-vient" },
      ],
    },
  ],
  computeNeeds: calcPointLumineuxSimpleNeeds,
  computeLabor: calcPointLumineuxSimpleLabor,
  buildQuoteLine: (inputs, needs, labor, pricing) =>
    buildElectriciteQuoteLine(
      "electricite-point-lumineux-simple",
      "Installation point lumineux simple",
      "u",
      inputs.nombre,
      needs,
      labor,
      pricing,
    ),
};

export const interrupteurSimpleOuvrage: OuvrageDefinition<InterrupteurSimpleInputs> = {
  id: "electricite-interrupteur-simple",
  tradeId: "electricite",
  label: "Interrupteur simple",
  unit: "u",
  inputFields: [
    { id: "nombre", label: "Nombre", kind: "number", unit: "u", defaultValue: 1, min: 0 },
    {
      id: "longueurMoyenneCable",
      label: "Longueur moyenne de câble",
      kind: "number",
      unit: "ml",
      defaultValue: 3,
      min: 0,
    },
    {
      id: "modePose",
      label: "Mode de pose",
      kind: "choice",
      defaultValue: "encastre",
      options: [
        { value: "encastre", label: "Encastré" },
        { value: "apparent", label: "Apparent" },
      ],
    },
  ],
  computeNeeds: calcInterrupteurSimpleNeeds,
  computeLabor: calcInterrupteurSimpleLabor,
  buildQuoteLine: (inputs, needs, labor, pricing) =>
    buildElectriciteQuoteLine(
      "electricite-interrupteur-simple",
      "Installation interrupteur simple",
      "u",
      inputs.nombre,
      needs,
      labor,
      pricing,
    ),
};

export const ligneDedieeOuvrage: OuvrageDefinition<LigneDedieeInputs> = {
  id: "electricite-ligne-dediee",
  tradeId: "electricite",
  label: "Ligne dédiée 16A/20A",
  unit: "u",
  inputFields: [
    { id: "nombre", label: "Nombre", kind: "number", unit: "u", defaultValue: 1, min: 0 },
    {
      id: "longueurMoyenneCable",
      label: "Longueur moyenne de câble",
      kind: "number",
      unit: "ml",
      defaultValue: 10,
      min: 0,
    },
    {
      id: "calibre",
      label: "Calibre",
      kind: "choice",
      defaultValue: "20A",
      options: [
        { value: "16A", label: "16A" },
        { value: "20A", label: "20A" },
      ],
    },
    {
      id: "modePose",
      label: "Mode de pose",
      kind: "choice",
      defaultValue: "encastre",
      options: [
        { value: "encastre", label: "Encastré" },
        { value: "apparent", label: "Apparent" },
      ],
    },
  ],
  computeNeeds: calcLigneDedieeNeeds,
  computeLabor: calcLigneDedieeLabor,
  buildQuoteLine: (inputs, needs, labor, pricing) =>
    buildElectriciteQuoteLine(
      "electricite-ligne-dediee",
      "Installation ligne dédiée 16A/20A",
      "u",
      inputs.nombre,
      needs,
      labor,
      pricing,
    ),
};

export const spotEncastreOuvrage: OuvrageDefinition<SpotEncastreInputs> = {
  id: "electricite-spot-encastre",
  tradeId: "electricite",
  label: "Spot encastré",
  unit: "u",
  inputFields: [
    { id: "nombre", label: "Nombre", kind: "number", unit: "u", defaultValue: 1, min: 0 },
    {
      id: "longueurMoyenneCable",
      label: "Longueur moyenne de câble",
      kind: "number",
      unit: "ml",
      defaultValue: 4,
      min: 0,
    },
    {
      id: "avecTransformateur",
      label: "Avec transformateur",
      kind: "boolean",
      defaultValue: false,
    },
  ],
  computeNeeds: calcSpotEncastreNeeds,
  computeLabor: calcSpotEncastreLabor,
  buildQuoteLine: (inputs, needs, labor, pricing) =>
    buildElectriciteQuoteLine(
      "electricite-spot-encastre",
      "Installation spot encastré",
      "u",
      inputs.nombre,
      needs,
      labor,
      pricing,
    ),
};

export const electriciteOuvrages = [
  installationElectriqueCompleteOuvrage,
  priseSimpleOuvrage,
  pointLumineuxSimpleOuvrage,
  interrupteurSimpleOuvrage,
  ligneDedieeOuvrage,
  spotEncastreOuvrage,
];

export const electriciteTrade: Trade = {
  id: "electricite",
  label: "Électricité",
  description: "Ouvrages électriques isolés du React et calculés par fonctions pures.",
  ouvrages: electriciteOuvrages as OuvrageDefinition[],
};
