import type { QuoteLine } from "../../devis/types";
import type { LaborEstimate } from "../../labor/types";
import type { MaterialNeed } from "../../materials/types";
import type { PricingContext } from "../../pricing/types";

export type ModePose = "encastre" | "apparent";
export type TypeCommande = "simple" | "vaEtVient";
export type CalibreLigneDediee = "16A" | "20A";

export type PriseSimpleInputs = {
  nombre: number;
  longueurMoyenneCable: number;
  modePose: ModePose;
};

export type PointLumineuxSimpleInputs = {
  nombre: number;
  longueurMoyenneCable: number;
  typeCommande: TypeCommande;
};

export type InterrupteurSimpleInputs = {
  nombre: number;
  longueurMoyenneCable: number;
  modePose: ModePose;
};

export type LigneDedieeInputs = {
  nombre: number;
  longueurMoyenneCable: number;
  calibre: CalibreLigneDediee;
  modePose: ModePose;
};

export type SpotEncastreInputs = {
  nombre: number;
  longueurMoyenneCable: number;
  avecTransformateur: boolean;
};

const roundMoney = (value: number) => Number(value.toFixed(2));

const materialCost = (needs: MaterialNeed[], pricing?: PricingContext) =>
  roundMoney(
    needs.reduce((total, need) => {
      const unitCost = pricing?.materialUnitCosts?.[need.id] || 0;
      return total + need.quantity * unitCost;
    }, 0),
  );

const laborCost = (labor: LaborEstimate, pricing?: PricingContext) =>
  roundMoney(labor.hours * (pricing?.laborHourlyRateHT || 0));

export const buildElectriciteQuoteLine = (
  ouvrageId: string,
  designation: string,
  unit: string,
  quantity: number,
  needs: MaterialNeed[],
  labor: LaborEstimate,
  pricing?: PricingContext,
): QuoteLine => {
  const materialCostHT = materialCost(needs, pricing);
  const laborCostHT = laborCost(labor, pricing);
  const costHT = materialCostHT + laborCostHT;
  const marginRate = pricing?.marginRate || 0;
  const marginAmount = roundMoney(costHT * marginRate);
  const totalHT = roundMoney(costHT + marginAmount);

  return {
    id: `quote-${ouvrageId}`,
    designation,
    label: designation,
    unit,
    quantity,
    unitPriceHT: quantity > 0 ? roundMoney(totalHT / quantity) : 0,
    totalHT,
    materialCostHT,
    laborCostHT,
    marginAmount,
    marginRate,
    tradeId: "electricite",
    ouvrageId,
    materialIds: needs.map((need) => need.id),
    laborHours: labor.hours,
  };
};

export const calcPriseSimpleNeeds = (inputs: PriseSimpleInputs): MaterialNeed[] => [
  {
    id: "prise",
    label: "Prise simple",
    unit: "u",
    quantity: inputs.nombre,
    tradeId: "electricite",
  },
  ...(inputs.modePose === "encastre"
    ? [
        {
          id: "boite-encastrement",
          label: "Boîte d'encastrement",
          unit: "u",
          quantity: inputs.nombre,
          tradeId: "electricite",
        },
      ]
    : []),
  {
    id: "cable-3g25",
    label: "Câble 3G2.5",
    unit: "ml",
    quantity: inputs.nombre * inputs.longueurMoyenneCable,
    tradeId: "electricite",
  },
  ...(inputs.modePose === "encastre"
    ? [
        {
          id: "gaine-icta",
          label: "Gaine ICTA",
          unit: "ml",
          quantity: inputs.nombre * inputs.longueurMoyenneCable,
          tradeId: "electricite",
        },
      ]
    : [
        {
          id: "moulure",
          label: "Moulure électrique",
          unit: "ml",
          quantity: inputs.nombre * inputs.longueurMoyenneCable,
          tradeId: "electricite",
        },
      ]),
];

export const calcPriseSimpleLabor = (inputs: PriseSimpleInputs): LaborEstimate => {
  const baseHours = inputs.nombre * 0.45;
  const modeFactor = inputs.modePose === "encastre" ? 1.3 : 1;

  return {
    hours: Number((baseHours * modeFactor).toFixed(2)),
    label: "Main-d'œuvre prise simple",
    tradeId: "electricite",
  };
};

export const calcPointLumineuxSimpleNeeds = (inputs: PointLumineuxSimpleInputs): MaterialNeed[] => [
  {
    id: "dcl",
    label: "DCL",
    unit: "u",
    quantity: inputs.nombre,
    tradeId: "electricite",
  },
  {
    id: "cable-3g15",
    label: "Câble 3G1.5",
    unit: "ml",
    quantity: inputs.nombre * inputs.longueurMoyenneCable,
    tradeId: "electricite",
  },
  ...(inputs.typeCommande === "simple"
    ? [
        {
          id: "interrupteur",
          label: "Interrupteur simple",
          unit: "u",
          quantity: inputs.nombre,
          tradeId: "electricite",
        },
      ]
    : [
        {
          id: "va-et-vient",
          label: "Va-et-vient",
          unit: "u",
          quantity: inputs.nombre * 2,
          tradeId: "electricite",
        },
      ]),
  {
    id: "gaine-icta",
    label: "Gaine ICTA",
    unit: "ml",
    quantity: inputs.nombre * inputs.longueurMoyenneCable,
    tradeId: "electricite",
  },
];

export const calcPointLumineuxSimpleLabor = (inputs: PointLumineuxSimpleInputs): LaborEstimate => ({
  hours: Number((inputs.nombre * (inputs.typeCommande === "simple" ? 0.6 : 0.9)).toFixed(2)),
  label: "Main-d'œuvre point lumineux",
  tradeId: "electricite",
});

export const calcInterrupteurSimpleNeeds = (inputs: InterrupteurSimpleInputs): MaterialNeed[] => [
  {
    id: "interrupteur",
    label: "Interrupteur simple",
    unit: "u",
    quantity: inputs.nombre,
    tradeId: "electricite",
  },
  {
    id: "cable-3g15",
    label: "Câble 3G1.5",
    unit: "ml",
    quantity: inputs.nombre * inputs.longueurMoyenneCable,
    tradeId: "electricite",
  },
  ...(inputs.modePose === "encastre"
    ? [
        {
          id: "boite-encastrement",
          label: "Boîte d'encastrement",
          unit: "u",
          quantity: inputs.nombre,
          tradeId: "electricite",
        },
        {
          id: "gaine-icta",
          label: "Gaine ICTA",
          unit: "ml",
          quantity: inputs.nombre * inputs.longueurMoyenneCable,
          tradeId: "electricite",
        },
      ]
    : [
        {
          id: "moulure",
          label: "Moulure électrique",
          unit: "ml",
          quantity: inputs.nombre * inputs.longueurMoyenneCable,
          tradeId: "electricite",
        },
      ]),
];

export const calcInterrupteurSimpleLabor = (inputs: InterrupteurSimpleInputs): LaborEstimate => ({
  hours: Number((inputs.nombre * (inputs.modePose === "encastre" ? 0.45 : 0.3)).toFixed(2)),
  label: "Main-d'œuvre interrupteur simple",
  tradeId: "electricite",
});

export const calcLigneDedieeNeeds = (inputs: LigneDedieeInputs): MaterialNeed[] => {
  const cableId = inputs.calibre === "20A" ? "cable-3g25" : "cable-3g15";
  const cableLabel = inputs.calibre === "20A" ? "Câble 3G2.5" : "Câble 3G1.5";

  return [
    {
      id: cableId,
      label: cableLabel,
      unit: "ml",
      quantity: inputs.nombre * inputs.longueurMoyenneCable,
      tradeId: "electricite",
    },
    {
      id: `disjoncteur-${inputs.calibre.toLowerCase()}`,
      label: `Disjoncteur ${inputs.calibre}`,
      unit: "u",
      quantity: inputs.nombre,
      tradeId: "electricite",
    },
    ...(inputs.modePose === "encastre"
      ? [
          {
            id: "gaine-icta",
            label: "Gaine ICTA",
            unit: "ml",
            quantity: inputs.nombre * inputs.longueurMoyenneCable,
            tradeId: "electricite",
          },
        ]
      : [
          {
            id: "moulure",
            label: "Moulure électrique",
            unit: "ml",
            quantity: inputs.nombre * inputs.longueurMoyenneCable,
            tradeId: "electricite",
          },
        ]),
  ];
};

export const calcLigneDedieeLabor = (inputs: LigneDedieeInputs): LaborEstimate => {
  const baseHours = inputs.nombre * 1.2 + inputs.longueurMoyenneCable * 0.08;
  const modeFactor = inputs.modePose === "encastre" ? 1.25 : 1;

  return {
    hours: Number((baseHours * modeFactor).toFixed(2)),
    label: "Main-d'œuvre ligne dédiée",
    tradeId: "electricite",
  };
};

export const calcSpotEncastreNeeds = (inputs: SpotEncastreInputs): MaterialNeed[] => [
  {
    id: "spot-encastre",
    label: "Spot encastré",
    unit: "u",
    quantity: inputs.nombre,
    tradeId: "electricite",
  },
  {
    id: "cable-3g15",
    label: "Câble 3G1.5",
    unit: "ml",
    quantity: inputs.nombre * inputs.longueurMoyenneCable,
    tradeId: "electricite",
  },
  {
    id: "gaine-icta",
    label: "Gaine ICTA",
    unit: "ml",
    quantity: inputs.nombre * inputs.longueurMoyenneCable,
    tradeId: "electricite",
  },
  ...(inputs.avecTransformateur
    ? [
        {
          id: "transformateur-spot",
          label: "Transformateur spot",
          unit: "u",
          quantity: inputs.nombre,
          tradeId: "electricite",
        },
      ]
    : []),
];

export const calcSpotEncastreLabor = (inputs: SpotEncastreInputs): LaborEstimate => ({
  hours: Number((inputs.nombre * (inputs.avecTransformateur ? 0.55 : 0.45)).toFixed(2)),
  label: "Main-d'œuvre spot encastré",
  tradeId: "electricite",
});
