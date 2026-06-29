// drCore.ts
// =====================================================
// DR-Dev Core : noyau générique pour tes modules DR
// =====================================================
// Objectifs :
// - Valider proprement les entrées numériques
// - Standardiser la définition des modules (carrelage, peinture, plomberie, etc.)
// - Faciliter la génération d'historique et de totaux
// - Ne dépend PAS de React ni de ton App : réutilisable partout
// =====================================================

// ---------- Outils de validation numérique ----------

export type DRNumericFieldSpec = {
  label?: string;
  min?: number;
  max?: number;
  default?: number;
  required?: boolean;
};

export type DRValidationError = {
  field: string;
  message: string;
};

export type DRValidationResult<T extends Record<string, number>> = {
  ok: boolean;
  values: T | null;
  errors: DRValidationError[];
};

export function normalizeNumber(input: unknown): number | null {
  if (typeof input === "number") {
    return isNaN(input) ? null : input;
  }
  if (typeof input === "string") {
    const x = parseFloat(input.replace(",", "."));
    return isNaN(x) ? null : x;
  }
  return null;
}

export function validateNumericParams<
  T extends Record<string, number>
>(
  specMap: Record<keyof T, DRNumericFieldSpec>,
  raw: Partial<Record<keyof T, unknown>>
): DRValidationResult<T> {
  const errors: DRValidationError[] = [];
  const values: Partial<T> = {};

  (Object.keys(specMap) as (keyof T)[]).forEach((key) => {
    const spec = specMap[key];
    const rawValue = raw[key];

    let num = normalizeNumber(rawValue);

    if (num === null || isNaN(num)) {
      if (spec.default !== undefined) {
        num = spec.default;
      } else if (spec.required !== false) {
        errors.push({
          field: String(key),
          message:
            (spec.label || String(key)) + " : valeur numérique invalide.",
        });
        return;
      } else {
        num = 0;
      }
    }

    if (spec.min !== undefined && num < spec.min) {
      errors.push({
        field: String(key),
        message:
          (spec.label || String(key)) +
          ` : doit être ≥ ${spec.min}, reçu ${num}.`,
      });
    }

    if (spec.max !== undefined && num > spec.max) {
      errors.push({
        field: String(key),
        message:
          (spec.label || String(key)) +
          ` : doit être ≤ ${spec.max}, reçu ${num}.`,
      });
    }

    values[key] = num as T[typeof key];
  });

  if (errors.length > 0) {
    return { ok: false, values: null, errors };
  }

  return { ok: true, values: values as T, errors: [] };
}

// ---------- Définition générique d'un module DR ----------

export type DRModuleId =
  | "carrelage"
  | "peinture"
  | "placo"
  | "bardage"
  | "plomberie"
  | (string & {});

export interface DRModuleSpec<
  TParams extends Record<string, number>,
  TResult extends Record<string, number>
> {
  id: DRModuleId;
  label: string;
  inputSpec: Record<keyof TParams, DRNumericFieldSpec>;
  compute: (params: TParams) => TResult;
  toHistoryText?: (params: TParams, result: TResult, context: {
    pieceName?: string;
    chantierName?: string;
  }) => string;
  accumulateTotals?: <TTotals extends Record<string, number>>(
    currentTotals: TTotals,
    result: TResult
  ) => TTotals;
}

export function makeDRModule<
  TParams extends Record<string, number>,
  TResult extends Record<string, number>
>(spec: DRModuleSpec<TParams, TResult>) {
  return spec;
}

// ---------- Helpers pour l'historique et les totaux ----------

export interface DRHistoryPayload<
  TResult extends Record<string, number>
> {
  moduleId: DRModuleId;
  output: TResult;
}

export function buildHistoryTextFromTemplate<
  TParams extends Record<string, number>,
  TResult extends Record<string, number>
>(
  template: (params: TParams, result: TResult, ctx: {
    pieceName?: string;
    chantierName?: string;
  }) => string,
  params: TParams,
  result: TResult,
  ctx: { pieceName?: string; chantierName?: string }
): string {
  return template(params, result, ctx);
}

export function aggregateTotals<
  TTotals extends Record<string, number>,
  TResult extends Record<string, number>
>(
  current: TTotals,
  result: TResult,
  mapper: (acc: TTotals, out: TResult) => TTotals
): TTotals {
  const clone: TTotals = { ...current };
  return mapper(clone, result);
}

// ---------- Imports des fonctions DR ----------

import {
  calcCarrelageDR,
  calcPeintureDR,
  calcPlacoDR,
  calcBardageDR,
  calcPlomberieDR,
} from "./drEngine";
import type {
  CarrelageParams,
  CarrelageResult,
  PeintureParams,
  PeintureResult,
  PlacoParams,
  PlacoResult,
  BardageParams,
  BardageResult,
  PlomberieParams,
  PlomberieResult,
} from "./drEngine";

// ---------- Module Carrelage ----------

export const CarrelageModule = makeDRModule<CarrelageParams, CarrelageResult>({
  id: "carrelage",
  label: "Carrelage",
  inputSpec: {
    longueur: { label: "Longueur pièce (m)", min: 0, required: true },
    largeur: { label: "Largeur pièce (m)", min: 0, required: true },
    carreauA: { label: "Longueur carreau (m)", min: 0, required: true },
    carreauB: { label: "Largeur carreau (m)", min: 0, required: true },
    pertesPct: { label: "Pertes (%)", min: 0, max: 100, default: 10 },
    m2Carton: { label: "m² par carton", min: 0.1, required: true },
  },
  compute: calcCarrelageDR,
  toHistoryText: (_params, result, ctx) => {
    const name = ctx.pieceName || "Pièce";
    return `Carrelage - ${name} - ${result.surface.toFixed(2)} m2, ${result.nbCartons} cartons, colle ~${result.colleSacs} sac(s), joints ~${result.jointsKg.toFixed(1)} kg`;
  },
  accumulateTotals: <TTotals extends Record<string, number>>(acc: TTotals, out: CarrelageResult): TTotals => {
    const a = acc as Record<string, number>;
    a.carrelage_m2 = (a.carrelage_m2 || 0) + out.surface;
    a.carrelage_cartons = (a.carrelage_cartons || 0) + out.nbCartons;
    a.carrelage_colle_sacs = (a.carrelage_colle_sacs || 0) + out.colleSacs;
    a.carrelage_joints_kg = (a.carrelage_joints_kg || 0) + out.jointsKg;
    return acc;
  },
});

// ---------- Module Peinture ----------

export const PeintureModule = makeDRModule<PeintureParams, PeintureResult>({
  id: "peinture",
  label: "Peinture",
  inputSpec: {
    longueur: { label: "Longueur pièce (m)", min: 0, required: true },
    largeur: { label: "Largeur pièce (m)", min: 0, required: true },
    hauteur: { label: "Hauteur murs (m)", min: 0, required: true },
    ouvertures: { label: "Surface ouvertures (m²)", min: 0, default: 0, required: false },
    rendement: { label: "Rendement peinture (m²/L)", min: 0.1, required: true },
    couches: { label: "Nombre de couches", min: 1, max: 5, default: 2 },
    pot: { label: "Contenance pot (L)", min: 0.1, required: true },
    nbMurs: { label: "Nombre de murs (1-4)", min: 1, max: 4, default: 4 },
    surfaceType: { label: "Type surface (0=murs,1=plafond,2=total)", min: 0, max: 2, default: 0 },
  },
  compute: calcPeintureDR,
  toHistoryText: (_params, result, ctx) => {
    const name = ctx.pieceName || "Pièce";
    return `Peinture - ${name} - ${result.surfacePeinte.toFixed(2)} m2, ${result.nbPots} pots + sous-couche ~${result.sousCouchePots} pot(s)`;
  },
  accumulateTotals: <TTotals extends Record<string, number>>(acc: TTotals, out: PeintureResult): TTotals => {
    const a = acc as Record<string, number>;
    a.peinture_m2 = (a.peinture_m2 || 0) + out.surfacePeinte;
    a.peinture_pots = (a.peinture_pots || 0) + out.nbPots;
    a.peinture_sous_couche_pots = (a.peinture_sous_couche_pots || 0) + out.sousCouchePots;
    return acc;
  },
});

// ---------- Module Placo ----------

export const PlacoModule = makeDRModule<PlacoParams, PlacoResult>({
  id: "placo",
  label: "Placo",
  inputSpec: {
    longueur: { label: "Longueur mur (m)", min: 0, required: true },
    hauteur: { label: "Hauteur mur (m)", min: 0, required: true },
    entraxe: { label: "Entraxe montants (m)", min: 0.1, default: 0.6, required: true },
    longPlaque: { label: "Longueur plaque (m)", min: 0.1, required: true },
    hautPlaque: { label: "Hauteur plaque (m)", min: 0.1, required: true },
    doublePeau: { label: "Double peau (0=non, 1=oui)", min: 0, max: 1, default: 0 },
  },
  compute: calcPlacoDR,
  toHistoryText: (_params, result, ctx) => {
    const name = ctx.pieceName || "Pièce";
    return `Placo - ${name} - ${result.surface.toFixed(2)} m2, ${result.nbPlaques} plaques, ${result.nbMontants} montants, vis ~${result.visBoites} boites, bandes ~${result.bandesSacs} sac(s)`;
  },
  accumulateTotals: <TTotals extends Record<string, number>>(acc: TTotals, out: PlacoResult): TTotals => {
    const a = acc as Record<string, number>;
    a.placo_m2 = (a.placo_m2 || 0) + out.surface;
    a.placo_plaques = (a.placo_plaques || 0) + out.nbPlaques;
    a.placo_montants = (a.placo_montants || 0) + out.nbMontants;
    a.placo_rails = (a.placo_rails || 0) + out.rails;
    a.placo_vis_boites = (a.placo_vis_boites || 0) + out.visBoites;
    a.placo_bandes_sacs = (a.placo_bandes_sacs || 0) + out.bandesSacs;
    return acc;
  },
});

// ---------- Module Bardage ----------

export const BardageModule = makeDRModule<BardageParams, BardageResult>({
  id: "bardage",
  label: "Bardage",
  inputSpec: {
    largeur: { label: "Largeur façade (m)", min: 0, required: true },
    hauteur: { label: "Hauteur façade (m)", min: 0, required: true },
    largeurUtile: { label: "Largeur utile lame (m)", min: 0.01, required: true },
    longueurLame: { label: "Longueur lame (m)", min: 0.1, required: true },
    pertesPct: { label: "Pertes (%)", min: 0, max: 50, default: 10 },
  },
  compute: calcBardageDR,
  toHistoryText: (_params, result, ctx) => {
    const name = ctx.pieceName || "Pièce";
    return `Bardage - ${name} - ${result.surface.toFixed(2)} m2, ${result.nbLames} lames, liteaux ~${result.liteauxMl} m`;
  },
  accumulateTotals: <TTotals extends Record<string, number>>(acc: TTotals, out: BardageResult): TTotals => {
    const a = acc as Record<string, number>;
    a.bardage_m2 = (a.bardage_m2 || 0) + out.surface;
    a.bardage_lames = (a.bardage_lames || 0) + out.nbLames;
    a.bardage_liteaux_ml = (a.bardage_liteaux_ml || 0) + out.liteauxMl;
    return acc;
  },
});

// ---------- Module Plomberie ----------

export const PlomberieModule = makeDRModule<PlomberieParams, PlomberieResult>({
  id: "plomberie",
  label: "Plomberie",
  inputSpec: {
    nbLavabos: { label: "Nombre lavabos", min: 0, default: 0 },
    nbDouches: { label: "Nombre douches", min: 0, default: 0 },
    nbWC: { label: "Nombre WC", min: 0, default: 0 },
    nbEviers: { label: "Nombre éviers", min: 0, default: 0 },
    nbLL: { label: "Nombre lave-linge", min: 0, default: 0 },
    nbLV: { label: "Nombre lave-vaisselle", min: 0, default: 0 },
    nbExt: { label: "Points extérieurs", min: 0, default: 0 },
    longAlimMoy: { label: "Long. alim. moyenne (m)", min: 0, default: 8, required: true },
    longEvacMoy: { label: "Long. évac. moyenne (m)", min: 0, default: 5, required: true },
    margePct: { label: "Marge (%)", min: 0, max: 100, default: 20 },
  },
  compute: calcPlomberieDR,
  toHistoryText: (_params, result, ctx) => {
    const name = ctx.pieceName || "Pièce";
    return `Plomberie - ${name} - alim ~${result.alimMl.toFixed(1)} m, evac ~${result.evacMl.toFixed(1)} m, ${result.robinets} robinet(s), ${result.siphons} siphon(s)`;
  },
  accumulateTotals: <TTotals extends Record<string, number>>(acc: TTotals, out: PlomberieResult): TTotals => {
    const a = acc as Record<string, number>;
    a.plomberie_alim_ml = (a.plomberie_alim_ml || 0) + out.alimMl;
    a.plomberie_evacu_ml = (a.plomberie_evacu_ml || 0) + out.evacMl;
    a.plomberie_robinets = (a.plomberie_robinets || 0) + out.robinets;
    a.plomberie_siphons = (a.plomberie_siphons || 0) + out.siphons;
    return acc;
  },
});
