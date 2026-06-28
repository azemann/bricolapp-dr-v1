import type { HistoryLine } from "../dr/drTotals";

export type PieceType = "salon" | "chambre" | "sdb" | "cuisine" | "facade" | "autre";

export type Piece = {
  id: string;
  name: string;
  type: PieceType;
  level: string;
};

export type Chantier = {
  id: string;
  name: string;
  pieces: Piece[];
};

export type Prices = {
  prixCarton: string;
  prixPot: string;
  prixPlaque: string;
  prixMontant: string;
  prixRail: string;
  prixLame: string;
  prixColle: string;
  prixJoints: string;
  prixSousCouche: string;
  prixVis: string;
  prixBandes: string;
  prixLiteau: string;
  prixTubeAlim: string;
  prixTubeEvac: string;
  prixRobinetArret: string;
  prixSiphon: string;
  tva: string;
  marge: string;
};

export type AppState = {
  chantiers: Chantier[];
  history: HistoryLine[];
  activeChantierId: string | null;
  activePieceId: string | null;
  prices: Prices;
};

export type AppAction =
  | { type: "CHANTIER_ADD"; payload: { name: string } }
  | { type: "CHANTIER_REMOVE"; payload: { chantierId: string } }
  | { type: "CHANTIER_SET_ACTIVE"; payload: { chantierId: string | null } }
  | { type: "PIECE_ADD"; payload: { chantierId: string; piece: Omit<Piece, "id"> } }
  | { type: "PIECE_REMOVE"; payload: { chantierId: string; pieceId: string } }
  | { type: "PIECE_SET_ACTIVE"; payload: { pieceId: string | null } }
  | { type: "HISTORY_ADD"; payload: { line: HistoryLine } }
  | { type: "HISTORY_REMOVE"; payload: { lineId: string } }
  | { type: "HISTORY_REMOVE_BY_CHANTIER"; payload: { chantierId: string } }
  | { type: "HISTORY_REMOVE_BY_PIECE"; payload: { pieceId: string } }
  | { type: "PRICES_UPDATE"; payload: Partial<Prices> }
  | { type: "RESET_ALL" };

export const PIECE_TYPES: { value: PieceType; label: string }[] = [
  { value: "salon", label: "Salon" },
  { value: "chambre", label: "Chambre" },
  { value: "sdb", label: "Salle de bain" },
  { value: "cuisine", label: "Cuisine" },
  { value: "facade", label: "Facade" },
  { value: "autre", label: "Autre" },
];

export const NIVEAUX = ["RDC", "R+1", "R+2", "Sous-sol", "Combles"];

export const defaultPrices = (): Prices => ({
  prixCarton: "25",
  prixPot: "35",
  prixPlaque: "8",
  prixMontant: "4",
  prixRail: "2",
  prixLame: "6",
  prixColle: "15",
  prixJoints: "5",
  prixSousCouche: "30",
  prixVis: "8",
  prixBandes: "10",
  prixLiteau: "4",
  prixTubeAlim: "3",
  prixTubeEvac: "5",
  prixRobinetArret: "12",
  prixSiphon: "18",
  tva: "20",
  marge: "30",
});
