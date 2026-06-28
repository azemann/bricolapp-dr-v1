export const DR_CONSTANTS = {
  carrelage: {
    colleKgParM2: 3,
    sacKg: 25,
    jointsKgParM2: 0.4,
  },
  peinture: {
  },
  placo: {
    visParM2: 25,
    visParBoite: 250,
    bandesParPlaque: 0.3,
  },
  bardage: {
    liteauxParM2: 3,
  },
  plomberie: {
  },
};

export interface CarrelageParams extends Record<string, number> {
  longueur: number;
  largeur: number;
  carreauA: number;
  carreauB: number;
  pertesPct: number;
  m2Carton: number;
}

export interface CarrelageResult extends Record<string, number> {
  surface: number;
  surfaceAvecPertes: number;
  nbCarreaux: number;
  nbCartons: number;
  colleSacs: number;
  jointsKg: number;
}

export function calcCarrelageDR(params: CarrelageParams): CarrelageResult {
  const { longueur, largeur, carreauA, carreauB, pertesPct, m2Carton } = params;
  const pertes = pertesPct / 100;

  const surface = longueur * largeur;
  const surfaceAvecPertes = surface * (1 + pertes);
  const surfaceCarreau = carreauA * carreauB;
  const nbCarreaux = Math.ceil(surfaceAvecPertes / surfaceCarreau);
  const nbCartons = Math.ceil(surfaceAvecPertes / m2Carton);

  const { colleKgParM2, sacKg, jointsKgParM2 } = DR_CONSTANTS.carrelage;
  const colleSacs = Math.ceil((surface * colleKgParM2) / sacKg);
  const jointsKg = parseFloat((surface * jointsKgParM2).toFixed(2));

  return {
    surface,
    surfaceAvecPertes,
    nbCarreaux,
    nbCartons,
    colleSacs,
    jointsKg,
  };
}

export interface PeintureParams extends Record<string, number> {
  longueur: number;
  largeur: number;
  hauteur: number;
  ouvertures: number;
  rendement: number;
  couches: number;
  pot: number;
  nbMurs: number;
  surfaceType: number; // 0=murs, 1=plafond, 2=murs+plafond
}

export interface PeintureResult extends Record<string, number> {
  surfaceMurs: number;
  surfacePlafond: number;
  surfacePeinte: number;
  surfaceTotale: number;
  litres: number;
  nbPots: number;
  sousCouchePots: number;
}

export function calcPeintureDR(params: PeintureParams): PeintureResult {
  const {
    longueur,
    largeur,
    hauteur,
    ouvertures,
    rendement,
    couches,
    pot,
    nbMurs,
    surfaceType,
  } = params;

  const perimetre = 2 * (longueur + largeur);
  const ratioMurs = Math.max(Math.min(nbMurs, 4), 0) / 4;
  const surfaceMurs = Math.max(perimetre * hauteur * ratioMurs - ouvertures, 0);
  const surfacePlafond = Math.max(longueur * largeur, 0);

  let surfacePeinte = surfaceMurs;
  if (surfaceType === 1) surfacePeinte = surfacePlafond;
  if (surfaceType === 2) surfacePeinte = surfaceMurs + surfacePlafond;

  const surfaceTotale = surfacePeinte * couches;
  const litres = surfaceTotale / rendement;
  const nbPots = Math.ceil(litres / pot);

  const litresSC = surfacePeinte / rendement;
  const sousCouchePots = Math.ceil(litresSC / pot);

  return {
    surfaceMurs,
    surfacePlafond,
    surfacePeinte,
    surfaceTotale,
    litres,
    nbPots,
    sousCouchePots,
  };
}

export interface PlacoParams extends Record<string, number> {
  longueur: number;
  hauteur: number;
  entraxe: number;
  longPlaque: number;
  hautPlaque: number;
  doublePeau: number;
}

export interface PlacoResult extends Record<string, number> {
  surface: number;
  nbMontants: number;
  rails: number;
  nbPlaques: number;
  visBoites: number;
  bandesSacs: number;
}

export function calcPlacoDR(params: PlacoParams): PlacoResult {
  const { longueur, hauteur, entraxe, longPlaque, hautPlaque, doublePeau } = params;

  const surface = longueur * hauteur;
  const nbMontants = 1 + Math.ceil(longueur / entraxe);
  const rails = 2 * longueur;
  const surfacePlaque = longPlaque * hautPlaque;
  let nbPlaques = Math.ceil(surface / surfacePlaque);
  if (doublePeau === 1) nbPlaques *= 2;

  const { visParM2, visParBoite, bandesParPlaque } = DR_CONSTANTS.placo;
  const visBoites = Math.ceil((surface * visParM2) / visParBoite);
  const bandesSacs = parseFloat((nbPlaques * bandesParPlaque).toFixed(2));

  return {
    surface,
    nbMontants,
    rails,
    nbPlaques,
    visBoites,
    bandesSacs,
  };
}

export interface BardageParams extends Record<string, number> {
  largeur: number;
  hauteur: number;
  largeurUtile: number;
  longueurLame: number;
  pertesPct: number;
}

export interface BardageResult extends Record<string, number> {
  surface: number;
  nbLignes: number;
  nbLamesParLigne: number;
  nbLames: number;
  liteauxMl: number;
}

export function calcBardageDR(params: BardageParams): BardageResult {
  const { largeur, hauteur, largeurUtile, longueurLame, pertesPct } = params;
  const pertes = pertesPct / 100;

  const surface = largeur * hauteur;
  const nbLignes = Math.ceil(hauteur / largeurUtile);
  const nbLamesParLigne = Math.ceil(largeur / longueurLame);
  let nbLames = nbLignes * nbLamesParLigne;
  nbLames = Math.ceil(nbLames * (1 + pertes));

  const { liteauxParM2 } = DR_CONSTANTS.bardage;
  const liteauxMl = parseFloat((surface * liteauxParM2).toFixed(2));

  return {
    surface,
    nbLignes,
    nbLamesParLigne,
    nbLames,
    liteauxMl,
  };
}

export interface PlomberieParams extends Record<string, number> {
  nbLavabos: number;
  nbDouches: number;
  nbWC: number;
  nbEviers: number;
  nbLL: number;
  nbLV: number;
  nbExt: number;
  longAlimMoy: number;
  longEvacMoy: number;
  margePct: number;
}

export interface PlomberieResult extends Record<string, number> {
  pointsAlim: number;
  pointsEvac: number;
  alimMl: number;
  evacMl: number;
  robinets: number;
  siphons: number;
}

export function calcPlomberieDR(params: PlomberieParams): PlomberieResult {
  const {
    nbLavabos,
    nbDouches,
    nbWC,
    nbEviers,
    nbLL,
    nbLV,
    nbExt,
    longAlimMoy,
    longEvacMoy,
    margePct,
  } = params;
  const marge = margePct / 100;

  const pointsAlim = nbLavabos + nbDouches + nbWC + nbEviers + nbLL + nbLV + nbExt;
  const pointsEvac = nbLavabos + nbDouches + nbEviers + nbLL + nbLV;

  let alimMl = pointsAlim * longAlimMoy;
  let evacMl = pointsEvac * longEvacMoy;

  alimMl = alimMl * (1 + marge);
  evacMl = evacMl * (1 + marge);

  const robinets = pointsAlim;
  const siphons = nbLavabos + nbDouches + nbEviers;

  return {
    pointsAlim,
    pointsEvac,
    alimMl,
    evacMl,
    robinets,
    siphons,
  };
}
