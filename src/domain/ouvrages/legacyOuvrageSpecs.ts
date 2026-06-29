import type { HistoryLine } from "../../dr/drTotals";
import type { PriceKey } from "../pricing/types";

export type LegacyNeedSpec = {
  id: string;
  label: string;
  unit: string;
  quantity: number;
  priceKey: PriceKey;
};

export type LegacyOuvrageSpec = {
  ouvrageId: string;
  label: string;
  unit: string;
  quantity: number;
  needs: LegacyNeedSpec[];
};

const need = (
  id: string,
  label: string,
  unit: string,
  quantity: number,
  priceKey: PriceKey,
): LegacyNeedSpec => ({
  id,
  label,
  unit,
  quantity,
  priceKey,
});

export const buildLegacyOuvrageSpec = (line: HistoryLine): LegacyOuvrageSpec => {
  const values = line.data.values || {};

  switch (line.data.type) {
    case "carrelage":
      return {
        ouvrageId: "legacy-carrelage",
        label: "Carrelage",
        unit: "m2",
        quantity: values.surface || 0,
        needs: [
          need("carrelage-carton", "Carrelage", "carton", values.nbCartons || 0, "prixCarton"),
          need("colle-carrelage", "Colle carrelage", "sac", values.colleSacs || 0, "prixColle"),
          need("joints-carrelage", "Joints carrelage", "kg", values.jointsKg || 0, "prixJoints"),
        ],
      };
    case "peinture":
      return {
        ouvrageId: "legacy-peinture",
        label: "Peinture",
        unit: "m2",
        quantity: values.surfacePeinte || values.surfaceMurs || 0,
        needs: [
          need("peinture-pot", "Peinture", "pot", values.nbPots || 0, "prixPot"),
          need("sous-couche-pot", "Sous-couche", "pot", values.sousCouchePots || 0, "prixSousCouche"),
        ],
      };
    case "placo":
      return {
        ouvrageId: "legacy-placo",
        label: "Placo",
        unit: "m2",
        quantity: values.surface || 0,
        needs: [
          need("plaque-placo", "Plaque placo", "u", values.nbPlaques || 0, "prixPlaque"),
          need("montant-placo", "Montant", "u", values.nbMontants || 0, "prixMontant"),
          need("rail-placo", "Rail", "ml", values.rails || 0, "prixRail"),
          need("vis-placo", "Vis", "boite", values.visBoites || 0, "prixVis"),
          need("bandes-placo", "Bandes/enduit", "sac", values.bandesSacs || 0, "prixBandes"),
        ],
      };
    case "bardage":
      return {
        ouvrageId: "legacy-bardage",
        label: "Bardage",
        unit: "m2",
        quantity: values.surface || 0,
        needs: [
          need("lame-bardage", "Lame bardage", "u", values.nbLames || 0, "prixLame"),
          need("liteau-bardage", "Liteau", "ml", values.liteauxMl || 0, "prixLiteau"),
        ],
      };
    case "plomberie":
      return {
        ouvrageId: "legacy-plomberie",
        label: "Plomberie",
        unit: "forfait",
        quantity: 1,
        needs: [
          need("tube-alimentation", "Tube alimentation", "ml", values.alimMl || 0, "prixTubeAlim"),
          need("tube-evacuation", "Tube évacuation", "ml", values.evacMl || 0, "prixTubeEvac"),
          need("robinet-arret", "Robinet arrêt", "u", values.robinets || 0, "prixRobinetArret"),
          need("siphon", "Siphon", "u", values.siphons || 0, "prixSiphon"),
        ],
      };
    case "electricite":
      return {
        ouvrageId: "legacy-electricite",
        label: "Électricité",
        unit: "forfait",
        quantity: 1,
        needs: [],
      };
  }
};
