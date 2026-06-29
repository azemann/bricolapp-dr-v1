import {
  BardageModule,
  CarrelageModule,
  PeintureModule,
  PlacoModule,
  PlomberieModule,
} from "../../dr/drCore";
import type {
  BardageParams,
  BardageResult,
  CarrelageParams,
  CarrelageResult,
  PeintureParams,
  PeintureResult,
  PlacoParams,
  PlacoResult,
  PlomberieParams,
  PlomberieResult,
} from "../../dr/drEngine";
import type { HistoryLine } from "../../dr/drTotals";

type LegacyHistoryDraft = {
  texte: string;
  data: HistoryLine["data"];
};

type HistoryContext = {
  pieceName: string;
};

export const buildCarrelageHistoryDraft = (
  params: CarrelageParams,
  result: CarrelageResult,
  context: HistoryContext,
): LegacyHistoryDraft => ({
  texte: CarrelageModule.toHistoryText
    ? CarrelageModule.toHistoryText(params, result, context)
    : `Carrelage - ${context.pieceName}`,
  data: {
    type: "carrelage",
    values: {
      surface: result.surface,
      nbCartons: result.nbCartons,
      colleSacs: result.colleSacs,
      jointsKg: result.jointsKg,
    },
  },
});

export const buildPeintureHistoryDraft = (
  params: PeintureParams,
  result: PeintureResult,
  context: HistoryContext,
): LegacyHistoryDraft => ({
  texte: PeintureModule.toHistoryText
    ? PeintureModule.toHistoryText(params, result, context)
    : `Peinture - ${context.pieceName}`,
  data: {
    type: "peinture",
    values: {
      surfacePeinte: result.surfacePeinte,
      nbPots: result.nbPots,
      sousCouchePots: result.sousCouchePots,
    },
  },
});

export const buildPlacoHistoryDraft = (
  params: PlacoParams,
  result: PlacoResult,
  context: HistoryContext,
): LegacyHistoryDraft => ({
  texte: PlacoModule.toHistoryText
    ? PlacoModule.toHistoryText(params, result, context)
    : `Placo - ${context.pieceName}`,
  data: {
    type: "placo",
    values: {
      surface: result.surface,
      nbPlaques: result.nbPlaques,
      nbMontants: result.nbMontants,
      rails: result.rails,
      visBoites: result.visBoites,
      bandesSacs: result.bandesSacs,
    },
  },
});

export const buildBardageHistoryDraft = (
  params: BardageParams,
  result: BardageResult,
  context: HistoryContext,
): LegacyHistoryDraft => ({
  texte: BardageModule.toHistoryText
    ? BardageModule.toHistoryText(params, result, context)
    : `Bardage - ${context.pieceName}`,
  data: {
    type: "bardage",
    values: {
      surface: result.surface,
      nbLames: result.nbLames,
      liteauxMl: result.liteauxMl,
    },
  },
});

export const buildPlomberieHistoryDraft = (
  params: PlomberieParams,
  result: PlomberieResult,
  context: HistoryContext,
): LegacyHistoryDraft => ({
  texte: PlomberieModule.toHistoryText
    ? PlomberieModule.toHistoryText(params, result, context)
    : `Plomberie - ${context.pieceName}`,
  data: {
    type: "plomberie",
    values: {
      alimMl: result.alimMl,
      evacMl: result.evacMl,
      robinets: result.robinets,
      siphons: result.siphons,
    },
  },
});
