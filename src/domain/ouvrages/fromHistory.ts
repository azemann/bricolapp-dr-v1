import type { HistoryLine } from "../../dr/drTotals";
import type { MaterialNeed } from "../materials/types";
import { parsePriceNumber } from "../pricing/calcPricing";
import type { PriceKey, PricingPrices } from "../pricing/types";
import type { OuvrageLine } from "./types";

type NeedSpec = {
  id: string;
  label: string;
  unit: string;
  quantity: number;
  priceKey: PriceKey;
};

type LegacyOuvrageSpec = {
  ouvrageId: string;
  label: string;
  unit: string;
  quantity: number;
  needs: NeedSpec[];
};

const roundMoney = (value: number) => Number(value.toFixed(2));

const need = (
  id: string,
  label: string,
  unit: string,
  quantity: number,
  priceKey: PriceKey,
): NeedSpec => ({
  id,
  label,
  unit,
  quantity,
  priceKey,
});

const buildLegacyOuvrageSpec = (line: HistoryLine): LegacyOuvrageSpec => {
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

export const buildOuvrageLineFromHistory = (
  line: HistoryLine,
  prices: PricingPrices,
): OuvrageLine<Record<string, number>> => {
  if (line.data.ouvrageLine) {
    return {
      ...line.data.ouvrageLine,
      id: line.id,
      chantierId: line.chantierId,
      pieceId: line.pieceId,
    };
  }

  const spec = buildLegacyOuvrageSpec(line);
  const marginRate = parsePriceNumber(prices.marge) / 100;
  const tvaRate = parsePriceNumber(prices.tva) / 100;

  const materialCostHT = roundMoney(
    spec.needs.reduce((total, item) => total + item.quantity * parsePriceNumber(prices[item.priceKey]), 0),
  );
  const laborCostHT = 0;
  const overheadCostHT = 0;
  const totalCostHT = materialCostHT + laborCostHT + overheadCostHT;
  const salePriceHT = roundMoney(totalCostHT * (1 + marginRate));
  const marginAmount = roundMoney(salePriceHT - totalCostHT);

  return {
    id: line.id,
    chantierId: line.chantierId,
    pieceId: line.pieceId,
    ouvrageId: spec.ouvrageId,
    label: spec.label,
    unit: spec.unit,
    quantity: spec.quantity,
    inputs: line.data.values,
    needs: spec.needs
      .filter((item) => item.quantity > 0)
      .map<MaterialNeed>((item) => ({
        id: item.id,
        label: item.label,
        unit: item.unit,
        quantity: item.quantity,
        tradeId: line.data.type,
      })),
    materialCostHT,
    laborCostHT,
    overheadCostHT,
    salePriceHT,
    marginAmount,
    marginRate: roundMoney(marginRate * 100),
    tvaRate: roundMoney(tvaRate * 100),
  };
};

export const buildOuvrageLinesFromHistory = (
  history: HistoryLine[],
  prices: PricingPrices,
): OuvrageLine<Record<string, number>>[] =>
  history.map((line) => buildOuvrageLineFromHistory(line, prices));
