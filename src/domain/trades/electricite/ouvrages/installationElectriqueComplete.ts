import type { MaterialNeed } from "../../../materials/types";
import type { PricingContext } from "../../../pricing/types";
import { computeElectriciteProfitability, sumElectriciteLabor } from "../engine";
import type {
  ElectriciteLaborBreakdown,
  ElectriciteOuvrageDefinition,
  ElectriciteWorkContext,
} from "../types";

export type InstallationElectriqueCompleteInputs = ElectriciteWorkContext & {
  surfaceLogementM2: number;
  nombrePieces: number;
  nombrePrises: number;
  nombrePointsLumineux: number;
  nombreCircuitsSpecialises: number;
  longueurMoyenneCircuitMl: number;
  avecTableau: boolean;
  avecGtl: boolean;
  avecMiseTerre: boolean;
};

const roundQuantity = (value: number) => Number(value.toFixed(2));

const installationDifficultyFactor = (inputs: InstallationElectriqueCompleteInputs) => {
  const renovationFactor = inputs.buildingContext === "renovation" ? 1.25 : 1;
  const poseFactor = inputs.poseMode === "encastre" ? 1.3 : inputs.poseMode === "mixte" ? 1.15 : 1;
  const accessFactor =
    inputs.accessibility === "difficile" ? 1.25 : inputs.accessibility === "moyenne" ? 1.1 : 1;
  const heightFactor = inputs.averageHeightM > 2.8 ? 1.1 : 1;

  return renovationFactor * poseFactor * accessFactor * heightFactor;
};

const cableLength = (inputs: InstallationElectriqueCompleteInputs) =>
  roundQuantity(
    (inputs.nombrePrises + inputs.nombrePointsLumineux + inputs.nombreCircuitsSpecialises) *
      inputs.longueurMoyenneCircuitMl,
  );

export const installationElectriqueCompleteOuvrage: ElectriciteOuvrageDefinition<InstallationElectriqueCompleteInputs> = {
  id: "electricite-installation-complete",
  tradeId: "electricite",
  category: "alimentation-generale",
  label: "Installation électrique complète",
  unit: "forfait",
  description:
    "Ouvrage global qui orchestre tableau, protections, circuits, appareillages, mise à la terre et contrôles.",
  inputFields: [
    { id: "surfaceLogementM2", label: "Surface logement", kind: "number", unit: "m2", defaultValue: 80, min: 0 },
    { id: "nombrePieces", label: "Nombre de pièces", kind: "number", unit: "u", defaultValue: 5, min: 0 },
    { id: "nombrePrises", label: "Nombre de prises", kind: "number", unit: "u", defaultValue: 24, min: 0 },
    {
      id: "nombrePointsLumineux",
      label: "Nombre de points lumineux",
      kind: "number",
      unit: "u",
      defaultValue: 10,
      min: 0,
    },
    {
      id: "nombreCircuitsSpecialises",
      label: "Circuits spécialisés",
      kind: "number",
      unit: "u",
      defaultValue: 6,
      min: 0,
    },
    {
      id: "longueurMoyenneCircuitMl",
      label: "Longueur moyenne circuit",
      kind: "number",
      unit: "ml",
      defaultValue: 12,
      min: 0,
    },
    {
      id: "buildingContext",
      label: "Contexte logement",
      kind: "choice",
      defaultValue: "renovation",
      options: [
        { value: "neuf", label: "Neuf" },
        { value: "renovation", label: "Rénovation" },
      ],
    },
    {
      id: "poseMode",
      label: "Mode de pose",
      kind: "choice",
      defaultValue: "mixte",
      options: [
        { value: "encastre", label: "Encastré" },
        { value: "apparent", label: "Apparent" },
        { value: "mixte", label: "Mixte" },
      ],
    },
    {
      id: "accessibility",
      label: "Accessibilité",
      kind: "choice",
      defaultValue: "moyenne",
      options: [
        { value: "simple", label: "Simple" },
        { value: "moyenne", label: "Moyenne" },
        { value: "difficile", label: "Difficile" },
      ],
    },
    {
      id: "wallType",
      label: "Type de mur",
      kind: "choice",
      defaultValue: "placo",
      options: [
        { value: "placo", label: "Placo" },
        { value: "brique", label: "Brique" },
        { value: "beton", label: "Béton" },
        { value: "pierre", label: "Pierre" },
        { value: "bois", label: "Bois" },
        { value: "inconnu", label: "Inconnu" },
      ],
    },
    {
      id: "ceilingType",
      label: "Type de plafond",
      kind: "choice",
      defaultValue: "placo",
      options: [
        { value: "placo", label: "Placo" },
        { value: "dalle_beton", label: "Dalle béton" },
        { value: "combles_accessibles", label: "Combles accessibles" },
        { value: "faux_plafond", label: "Faux plafond" },
        { value: "inconnu", label: "Inconnu" },
      ],
    },
    { id: "averageHeightM", label: "Hauteur moyenne", kind: "number", unit: "m", defaultValue: 2.5, min: 0 },
    { id: "avecTableau", label: "Prévoir tableau", kind: "boolean", defaultValue: true },
    { id: "avecGtl", label: "Prévoir GTL", kind: "boolean", defaultValue: true },
    { id: "avecMiseTerre", label: "Prévoir mise à la terre", kind: "boolean", defaultValue: true },
    { id: "requiresConsuel", label: "Prévoir Consuel", kind: "boolean", defaultValue: false },
  ],
  computeNeeds: (inputs): MaterialNeed[] => {
    const totalCableMl = cableLength(inputs);
    const cheminementId = inputs.poseMode === "apparent" ? "moulure" : "gaine-icta";
    const cheminementLabel = inputs.poseMode === "apparent" ? "Moulure" : "Gaine ICTA";

    return [
      ...(inputs.avecTableau
        ? [
            { id: "tableau-electrique", label: "Tableau électrique", unit: "u", quantity: 1, tradeId: "electricite" },
            {
              id: "inter-differentiel-30ma",
              label: "Interrupteur différentiel 30mA",
              unit: "u",
              quantity: Math.max(2, Math.ceil(inputs.surfaceLogementM2 / 40)),
              tradeId: "electricite",
            },
            {
              id: "disjoncteur-16a",
              label: "Disjoncteur 16A",
              unit: "u",
              quantity: Math.ceil(inputs.nombrePointsLumineux / 8),
              tradeId: "electricite",
            },
            {
              id: "disjoncteur-20a",
              label: "Disjoncteur 20A",
              unit: "u",
              quantity: Math.ceil(inputs.nombrePrises / 8) + inputs.nombreCircuitsSpecialises,
              tradeId: "electricite",
            },
            { id: "peigne-tableau", label: "Peigne tableau", unit: "u", quantity: 2, tradeId: "electricite" },
            { id: "etiquette-tableau", label: "Étiquettes tableau", unit: "lot", quantity: 1, tradeId: "electricite" },
          ]
        : []),
      ...(inputs.avecGtl
        ? [{ id: "gtl", label: "GTL", unit: "u", quantity: 1, tradeId: "electricite" }]
        : []),
      ...(inputs.avecMiseTerre
        ? [
            { id: "barrette-terre", label: "Barrette de terre", unit: "u", quantity: 1, tradeId: "electricite" },
            { id: "piquet-terre", label: "Piquet de terre", unit: "u", quantity: 1, tradeId: "electricite" },
          ]
        : []),
      { id: "prise", label: "Prise simple", unit: "u", quantity: inputs.nombrePrises, tradeId: "electricite" },
      { id: "dcl", label: "DCL", unit: "u", quantity: inputs.nombrePointsLumineux, tradeId: "electricite" },
      { id: "interrupteur", label: "Interrupteur simple", unit: "u", quantity: inputs.nombrePointsLumineux, tradeId: "electricite" },
      { id: "boite-encastrement", label: "Boîte d'encastrement", unit: "u", quantity: inputs.nombrePrises + inputs.nombrePointsLumineux, tradeId: "electricite" },
      { id: "cable-3g15", label: "Câble 3G1.5", unit: "ml", quantity: roundQuantity(totalCableMl * 0.45), tradeId: "electricite" },
      { id: "cable-3g25", label: "Câble 3G2.5", unit: "ml", quantity: roundQuantity(totalCableMl * 0.55), tradeId: "electricite" },
      { id: cheminementId, label: cheminementLabel, unit: "ml", quantity: totalCableMl, tradeId: "electricite" },
      { id: "boite-derivation", label: "Boîte de dérivation", unit: "u", quantity: Math.ceil(inputs.nombrePieces / 2), tradeId: "electricite" },
      { id: "wago", label: "Connecteur Wago", unit: "u", quantity: Math.ceil((inputs.nombrePrises + inputs.nombrePointsLumineux) * 1.5), tradeId: "electricite" },
      { id: "visserie", label: "Visserie", unit: "lot", quantity: 1, tradeId: "electricite" },
      { id: "cheville", label: "Chevilles", unit: "lot", quantity: 1, tradeId: "electricite" },
      { id: "collier", label: "Colliers", unit: "lot", quantity: 1, tradeId: "electricite" },
    ].filter((need) => need.quantity > 0);
  },
  computeLaborBreakdown: (inputs): ElectriciteLaborBreakdown => {
    const factor = installationDifficultyFactor(inputs);
    const circuitCount = inputs.nombrePrises + inputs.nombrePointsLumineux + inputs.nombreCircuitsSpecialises;

    return {
      preparationHours: roundQuantity((2 + inputs.nombrePieces * 0.25) * factor),
      installationHours: roundQuantity((circuitCount * 0.55 + inputs.surfaceLogementM2 * 0.05) * factor),
      finishingHours: roundQuantity((inputs.nombrePrises + inputs.nombrePointsLumineux) * 0.12 * factor),
      controlHours: roundQuantity((2 + circuitCount * 0.08 + (inputs.requiresConsuel ? 1.5 : 0)) * factor),
      cleanupHours: roundQuantity((1 + inputs.surfaceLogementM2 * 0.01) * factor),
    };
  },
  computeLabor: (inputs) => sumElectriciteLabor(installationElectriqueCompleteOuvrage.computeLaborBreakdown(inputs)),
  computeDependencies: (inputs) => [
    { id: "norme-nf-c-15-100", label: "Respect NF C 15-100", kind: "norm", required: true },
    { id: "protection-tableau", label: "Protections au tableau", kind: "ouvrage", required: inputs.avecTableau },
    { id: "mise-terre", label: "Mise à la terre", kind: "ouvrage", required: inputs.avecMiseTerre },
    { id: "controle-continuite", label: "Contrôle continuité et repérage", kind: "control", required: true },
    { id: "cheminement-cables", label: "Cheminement câbles/gaines", kind: "operation", required: true },
  ],
  computeConstraints: (inputs) => [
    ...(inputs.buildingContext === "renovation"
      ? [{ id: "renovation", label: "Rénovation : prévoir aléas de passage et reprises", severity: "warning" as const }]
      : []),
    ...(inputs.wallType === "beton" || inputs.wallType === "pierre"
      ? [{ id: "support-dur", label: "Support dur : temps de saignée/perçage majoré", severity: "warning" as const }]
      : []),
    ...(inputs.averageHeightM > 3
      ? [{ id: "hauteur", label: "Hauteur importante : accès spécifique à prévoir", severity: "warning" as const }]
      : []),
    ...(inputs.requiresConsuel
      ? [{ id: "consuel", label: "Contrôle Consuel à prévoir", severity: "info" as const }]
      : []),
  ],
  computeProfitability: (_inputs: InstallationElectriqueCompleteInputs, needs, labor, pricing) =>
    computeElectriciteProfitability(needs, labor, pricing),
  computeQuote: (inputs, needs, labor, pricing) =>
    installationElectriqueCompleteOuvrage.buildQuoteLine(inputs, needs, labor, pricing),
  buildQuoteLine: (_inputs, needs, labor, pricing?: PricingContext) => {
    const profitability = computeElectriciteProfitability(needs, labor, pricing);

    return {
      id: "quote-electricite-installation-complete",
      designation: "Installation électrique complète",
      label: "Installation électrique complète",
      unit: "forfait",
      quantity: 1,
      unitPriceHT: profitability.salePriceHT,
      totalHT: profitability.salePriceHT,
      materialCostHT: profitability.materialCostHT,
      laborCostHT: profitability.laborCostHT,
      marginAmount: profitability.marginAmount,
      marginRate: profitability.marginRate,
      tradeId: "electricite",
      ouvrageId: "electricite-installation-complete",
      materialIds: needs.map((need) => need.id),
      laborHours: labor.hours,
    };
  },
};
