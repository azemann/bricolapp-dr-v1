import type { OuvrageDefinition } from "./types";

export type DoucheItalienneInputs = {
  surfaceSolM2: number;
  surfaceMursM2: number;
  longueurAlimentationMl: number;
  longueurEvacuationMl: number;
  avecPointElectrique: boolean;
  avecPeinture: boolean;
};

export const doucheItalienneOuvrage: OuvrageDefinition<DoucheItalienneInputs> = {
  id: "douche-italienne",
  tradeId: "multi",
  label: "Douche italienne",
  unit: "ouvrage",
  description:
    "Ouvrage complet qui déclenche plomberie, carrelage, étanchéité, électricité éventuelle et peinture éventuelle.",
  inputFields: [
    {
      id: "surfaceSolM2",
      label: "Surface sol",
      kind: "number",
      unit: "m2",
      defaultValue: 2,
      min: 0,
    },
    {
      id: "surfaceMursM2",
      label: "Surface murs",
      kind: "number",
      unit: "m2",
      defaultValue: 8,
      min: 0,
    },
    {
      id: "longueurAlimentationMl",
      label: "Longueur alimentation",
      kind: "number",
      unit: "ml",
      defaultValue: 6,
      min: 0,
    },
    {
      id: "longueurEvacuationMl",
      label: "Longueur évacuation",
      kind: "number",
      unit: "ml",
      defaultValue: 3,
      min: 0,
    },
    {
      id: "avecPointElectrique",
      label: "Prévoir un point électrique",
      kind: "boolean",
      defaultValue: false,
    },
    {
      id: "avecPeinture",
      label: "Prévoir reprise peinture",
      kind: "boolean",
      defaultValue: true,
    },
  ],
  buildTradeLots: (inputs) => [
    {
      id: "douche-italienne-plomberie",
      tradeId: "plomberie",
      label: "Lot plomberie",
      operations: [
        {
          id: "pose-alimentation-douche",
          tradeId: "plomberie",
          label: "Pose alimentation douche",
          computeMaterials: () => [
            {
              id: "tube-alimentation",
              label: "Tube alimentation",
              unit: "ml",
              quantity: inputs.longueurAlimentationMl,
              tradeId: "plomberie",
              operationId: "pose-alimentation-douche",
            },
          ],
          computeLabor: () => ({
            hours: Math.max(1.5, inputs.longueurAlimentationMl * 0.25),
            label: "Main-d’œuvre alimentation douche",
            tradeId: "plomberie",
            operationId: "pose-alimentation-douche",
          }),
        },
        {
          id: "pose-evacuation-douche",
          tradeId: "plomberie",
          label: "Pose évacuation douche",
          computeMaterials: () => [
            {
              id: "tube-evacuation",
              label: "Tube évacuation",
              unit: "ml",
              quantity: inputs.longueurEvacuationMl,
              tradeId: "plomberie",
              operationId: "pose-evacuation-douche",
            },
            {
              id: "siphon-douche",
              label: "Siphon / caniveau",
              unit: "u",
              quantity: 1,
              tradeId: "plomberie",
              operationId: "pose-evacuation-douche",
            },
          ],
          computeLabor: () => ({
            hours: Math.max(1, inputs.longueurEvacuationMl * 0.35),
            label: "Main-d’œuvre évacuation douche",
            tradeId: "plomberie",
            operationId: "pose-evacuation-douche",
          }),
        },
      ],
    },
    {
      id: "douche-italienne-etancheite",
      tradeId: "etancheite",
      label: "Lot étanchéité",
      operations: [
        {
          id: "systeme-etancheite-douche",
          tradeId: "etancheite",
          label: "Système d’étanchéité douche",
          computeMaterials: () => [
            {
              id: "kit-etancheite",
              label: "Kit étanchéité SPEC / natte",
              unit: "m2",
              quantity: inputs.surfaceSolM2 + inputs.surfaceMursM2,
              wasteRate: 0.1,
              tradeId: "etancheite",
              operationId: "systeme-etancheite-douche",
            },
          ],
          computeLabor: () => ({
            hours: Math.max(2, (inputs.surfaceSolM2 + inputs.surfaceMursM2) * 0.25),
            label: "Main-d’œuvre étanchéité",
            tradeId: "etancheite",
            operationId: "systeme-etancheite-douche",
          }),
        },
      ],
    },
    {
      id: "douche-italienne-carrelage",
      tradeId: "carrelage",
      label: "Lot carrelage",
      operations: [
        {
          id: "pose-carrelage-douche",
          tradeId: "carrelage",
          label: "Pose carrelage sol et murs",
          computeMaterials: () => [
            {
              id: "carrelage-douche",
              label: "Carrelage douche",
              unit: "m2",
              quantity: inputs.surfaceSolM2 + inputs.surfaceMursM2,
              wasteRate: 0.1,
              tradeId: "carrelage",
              operationId: "pose-carrelage-douche",
            },
            {
              id: "colle-carrelage",
              label: "Colle carrelage",
              unit: "kg",
              quantity: (inputs.surfaceSolM2 + inputs.surfaceMursM2) * 5,
              tradeId: "carrelage",
              operationId: "pose-carrelage-douche",
            },
            {
              id: "joint-carrelage",
              label: "Joint carrelage",
              unit: "kg",
              quantity: (inputs.surfaceSolM2 + inputs.surfaceMursM2) * 0.35,
              tradeId: "carrelage",
              operationId: "pose-carrelage-douche",
            },
          ],
          computeLabor: () => ({
            hours: Math.max(4, (inputs.surfaceSolM2 + inputs.surfaceMursM2) * 0.8),
            label: "Main-d’œuvre carrelage douche",
            tradeId: "carrelage",
            operationId: "pose-carrelage-douche",
          }),
        },
      ],
    },
    ...(inputs.avecPointElectrique
      ? [
          {
            id: "douche-italienne-electricite",
            tradeId: "electricite" as const,
            label: "Lot électricité",
            operations: [
              {
                id: "point-electrique-douche",
                tradeId: "electricite",
                label: "Point électrique hors volume",
                computeMaterials: () => [
                  {
                    id: "point-electrique",
                    label: "Point électrique",
                    unit: "u",
                    quantity: 1,
                    tradeId: "electricite",
                    operationId: "point-electrique-douche",
                  },
                ],
                computeLabor: () => ({
                  hours: 1.5,
                  label: "Main-d’œuvre point électrique",
                  tradeId: "electricite",
                  operationId: "point-electrique-douche",
                }),
              },
            ],
          },
        ]
      : []),
    ...(inputs.avecPeinture
      ? [
          {
            id: "douche-italienne-peinture",
            tradeId: "peinture" as const,
            label: "Lot peinture",
            operations: [
              {
                id: "reprise-peinture-douche",
                tradeId: "peinture",
                label: "Reprise peinture périphérique",
                computeMaterials: () => [
                  {
                    id: "peinture-piece-humide",
                    label: "Peinture pièce humide",
                    unit: "m2",
                    quantity: 4,
                    tradeId: "peinture",
                    operationId: "reprise-peinture-douche",
                  },
                ],
                computeLabor: () => ({
                  hours: 1,
                  label: "Main-d’œuvre reprise peinture",
                  tradeId: "peinture",
                  operationId: "reprise-peinture-douche",
                }),
              },
            ],
          },
        ]
      : []),
  ],
  computeNeeds: (inputs) =>
    doucheItalienneOuvrage
      .buildTradeLots?.(inputs)
      .flatMap((lot) => lot.operations.flatMap((operation) => operation.computeMaterials(inputs))) || [],
  computeLabor: (inputs) => ({
    hours:
      doucheItalienneOuvrage
        .buildTradeLots?.(inputs)
        .reduce(
          (total, lot) =>
            total +
            lot.operations.reduce((lotTotal, operation) => lotTotal + operation.computeLabor(inputs).hours, 0),
          0,
        ) || 0,
    label: "Main-d’œuvre douche italienne",
  }),
  buildQuoteLine: (_inputs, needs, labor) => ({
    id: "quote-douche-italienne",
    designation: "Réalisation douche italienne",
    label: "Réalisation douche italienne",
    unit: "ouvrage",
    quantity: 1,
    unitPriceHT: 0,
    totalHT: 0,
    tradeId: "multi",
    ouvrageId: "douche-italienne",
    materialIds: needs.map((need) => need.id),
    laborHours: labor.hours,
  }),
  buildQuoteLines: (inputs) =>
    (doucheItalienneOuvrage.buildTradeLots?.(inputs) || []).map((lot) => {
      const laborHours = lot.operations.reduce(
        (total, operation) => total + operation.computeLabor(inputs).hours,
        0,
      );

      return {
        id: `quote-${lot.id}`,
        designation: lot.label,
        label: lot.label,
        unit: "forfait",
        quantity: 1,
        unitPriceHT: 0,
        totalHT: 0,
        tradeId: lot.tradeId,
        ouvrageId: "douche-italienne",
        laborHours,
      };
    }),
};

export const experimentalOuvrageCatalog = [doucheItalienneOuvrage];
