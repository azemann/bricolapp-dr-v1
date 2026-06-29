export type ElectriciteMaterialDefinition = {
  id: string;
  label: string;
  unit: string;
  family:
    | "cable"
    | "protection"
    | "tableau"
    | "appareillage"
    | "cheminement"
    | "connexion"
    | "terre"
    | "fixation"
    | "controle";
};

export const electriciteMaterialsCatalog: ElectriciteMaterialDefinition[] = [
  { id: "cable-3g15", label: "Câble 3G1.5", unit: "ml", family: "cable" },
  { id: "cable-3g25", label: "Câble 3G2.5", unit: "ml", family: "cable" },
  { id: "cable-3g6", label: "Câble 3G6", unit: "ml", family: "cable" },
  { id: "gaine-icta", label: "Gaine ICTA", unit: "ml", family: "cheminement" },
  { id: "goulotte", label: "Goulotte", unit: "ml", family: "cheminement" },
  { id: "moulure", label: "Moulure", unit: "ml", family: "cheminement" },
  { id: "boite-encastrement", label: "Boîte d'encastrement", unit: "u", family: "appareillage" },
  { id: "boite-derivation", label: "Boîte de dérivation", unit: "u", family: "connexion" },
  { id: "dcl", label: "DCL", unit: "u", family: "appareillage" },
  { id: "prise", label: "Prise simple", unit: "u", family: "appareillage" },
  { id: "interrupteur", label: "Interrupteur simple", unit: "u", family: "appareillage" },
  { id: "va-et-vient", label: "Va-et-vient", unit: "u", family: "appareillage" },
  { id: "disjoncteur-10a", label: "Disjoncteur 10A", unit: "u", family: "protection" },
  { id: "disjoncteur-16a", label: "Disjoncteur 16A", unit: "u", family: "protection" },
  { id: "disjoncteur-20a", label: "Disjoncteur 20A", unit: "u", family: "protection" },
  { id: "inter-differentiel-30ma", label: "Interrupteur différentiel 30mA", unit: "u", family: "protection" },
  { id: "tableau-electrique", label: "Tableau électrique", unit: "u", family: "tableau" },
  { id: "gtl", label: "GTL", unit: "u", family: "tableau" },
  { id: "peigne-tableau", label: "Peigne tableau", unit: "u", family: "tableau" },
  { id: "wago", label: "Connecteur Wago", unit: "u", family: "connexion" },
  { id: "visserie", label: "Visserie", unit: "lot", family: "fixation" },
  { id: "cheville", label: "Chevilles", unit: "lot", family: "fixation" },
  { id: "collier", label: "Colliers", unit: "lot", family: "fixation" },
  { id: "etiquette-tableau", label: "Étiquettes tableau", unit: "lot", family: "controle" },
  { id: "barrette-terre", label: "Barrette de terre", unit: "u", family: "terre" },
  { id: "piquet-terre", label: "Piquet de terre", unit: "u", family: "terre" },
];

export const findElectriciteMaterial = (id: string) =>
  electriciteMaterialsCatalog.find((material) => material.id === id) || null;
