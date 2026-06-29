import type { Trade } from "./types";
import { electriciteTrade } from "./electricite/catalog";

export const tradeCatalog: Trade[] = [
  {
    id: "carrelage",
    label: "Carrelage",
    description: "Ouvrages de sols et faience lies aux surfaces carrees.",
    ouvrages: [],
  },
  {
    id: "peinture",
    label: "Peinture",
    description: "Ouvrages de peinture murs, plafonds et sous-couches.",
    ouvrages: [],
  },
  {
    id: "placo",
    label: "Placo",
    description: "Ouvrages plaques, montants, rails, vis et bandes.",
    ouvrages: [],
  },
  {
    id: "bardage",
    label: "Bardage",
    description: "Ouvrages de facade, lames et liteaux.",
    ouvrages: [],
  },
  {
    id: "plomberie",
    label: "Plomberie",
    description: "Ouvrages d'alimentation, evacuation et accessoires.",
    ouvrages: [],
  },
  electriciteTrade,
  {
    id: "etancheite",
    label: "Etancheite",
    description: "Ouvrages de protection a l'eau, SPEC, nattes et membranes.",
    ouvrages: [],
  },
];

export const findTradeById = (tradeId: string) =>
  tradeCatalog.find((trade) => trade.id === tradeId) || null;
