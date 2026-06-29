import type { HistoryLine, Totals } from "../../dr/drTotals";
import type { OuvrageLine } from "../ouvrages/types";
import type { PricingPrices, PricingSummary } from "../pricing/types";
import { buildQuoteLinesFromOuvrageLines } from "./buildQuoteLines";

type QuoteTextPiece = {
  id: string;
  name: string;
  type: string;
  level: string;
};

type QuoteTextChantier = {
  id: string;
  name: string;
  pieces: QuoteTextPiece[];
};

export type HistoryByChantier = {
  chantier: QuoteTextChantier;
  history: HistoryLine[];
};

export type FormatQuoteTextInput = {
  prices: PricingPrices;
  totals: Totals;
  costs: PricingSummary;
  ouvrageLines: OuvrageLine[];
};

export type FormatGlobalQuoteTextInput = FormatQuoteTextInput & {
  historyByChantier: HistoryByChantier[];
};

export type FormatChantierQuoteTextInput = FormatQuoteTextInput & {
  chantier: QuoteTextChantier | null;
  chantierHistory: HistoryLine[];
};

const formatAmount = (value: number) => value.toFixed(2);

const addMaterialRecapLines = (lines: string[], totals: Totals, scopeLabel: string) => {
  lines.push(`RECAPITULATIF MATERIAUX (${scopeLabel}) :`);
  lines.push(` - Carrelage : ${totals.carrelage_m2.toFixed(2)} m2, ${totals.carrelage_cartons} cartons`);
  lines.push(
    `   Colle : ${totals.carrelage_colle_sacs} sac(s), Joints : ${totals.carrelage_joints_kg.toFixed(1)} kg`,
  );
  lines.push(
    ` - Peinture : ${totals.peinture_m2.toFixed(2)} m2, ${totals.peinture_pots} pots (SC : ${totals.peinture_sous_couche_pots} pot(s))`,
  );
  lines.push(
    ` - Placo : ${totals.placo_m2.toFixed(2)} m2, ${totals.placo_plaques} plaques, ${totals.placo_montants} montants, ${totals.placo_rails.toFixed(2)} m rails`,
  );
  lines.push(
    `   Vis : ${totals.placo_vis_boites} boites, Bandes/enduit : ${totals.placo_bandes_sacs.toFixed(1)} sac(s)`,
  );
  lines.push(
    ` - Bardage : ${totals.bardage_m2.toFixed(2)} m2, ${totals.bardage_lames} lames (liteaux ~${totals.bardage_liteaux_ml.toFixed(1)} m)`,
  );
  lines.push(
    ` - Plomberie : alim ${totals.plomberie_alim_ml.toFixed(1)} m, evac ${totals.plomberie_evacu_ml.toFixed(1)} m`,
  );
  lines.push(`   Robinets : ${totals.plomberie_robinets}, Siphons : ${totals.plomberie_siphons}`);
};

const addSellableQuoteLines = (
  lines: string[],
  ouvrageLines: OuvrageLine[],
  costs: PricingSummary,
  prices: PricingPrices,
) => {
  lines.push("LIGNES DEVIS VENDABLES (HT)");
  buildQuoteLinesFromOuvrageLines(ouvrageLines).forEach((entry) => {
    lines.push(
      `${entry.designation}  ${formatAmount(entry.quantity)} x ${formatAmount(entry.unitPriceHT)} = ${formatAmount(
        entry.totalHT,
      )}`,
    );
  });
  lines.push("");
  lines.push(`COUT MATERIAUX HT : ${formatAmount(costs.materialCostHT)} EUR`);
  lines.push(`VENTE HT : ${formatAmount(costs.saleHT)} EUR`);
  lines.push(`Marge (${prices.marge}%) : ${formatAmount(costs.marginAmount)} EUR`);
  lines.push(`TVA (${prices.tva}%) : ${formatAmount(costs.vatAmount)} EUR`);
  lines.push(`TOTAL TTC : ${formatAmount(costs.totalTTC)} EUR`);
};

export const formatGlobalQuoteText = ({
  historyByChantier,
  totals,
  costs,
  prices,
  ouvrageLines,
}: FormatGlobalQuoteTextInput) => {
  const lines: string[] = ["DEVIS GLOBAL ENTREPRISE", ""];

  historyByChantier.forEach(({ chantier, history }) => {
    if (history.length === 0) return;
    lines.push(`CHANTIER : ${chantier.name}`);
    lines.push("-".repeat(30));
    chantier.pieces.forEach((piece) => {
      const pieceHistory = history.filter((line) => line.pieceId === piece.id);
      if (pieceHistory.length === 0) return;
      lines.push(`Piece : ${piece.name} (${piece.type} - ${piece.level})`);
      pieceHistory.forEach((line) => lines.push(`  - ${line.texte}`));
      lines.push("");
    });
  });

  addMaterialRecapLines(lines, totals, "GLOBAL");
  lines.push("");
  addSellableQuoteLines(lines, ouvrageLines, costs, prices);
  lines.push("");
  lines.push("Main d'oeuvre et autres prestations a preciser apres visite de chantier.");

  return lines.join("\n");
};

export const formatChantierQuoteText = ({
  chantier,
  chantierHistory,
  totals,
  costs,
  prices,
  ouvrageLines,
}: FormatChantierQuoteTextInput) => {
  if (!chantier) {
    return "Aucun chantier actif selectionne.";
  }

  const lines: string[] = [`DEVIS CHANTIER : ${chantier.name}`, "-".repeat(30)];

  if (chantierHistory.length === 0) {
    lines.push("Aucune ligne DR pour ce chantier.");
  } else {
    chantier.pieces.forEach((piece) => {
      const pieceHistory = chantierHistory.filter((line) => line.pieceId === piece.id);
      if (pieceHistory.length === 0) return;
      lines.push(`Piece : ${piece.name} (${piece.type} - ${piece.level})`);
      pieceHistory.forEach((line) => lines.push(`  - ${line.texte}`));
      lines.push("");
    });
  }

  addMaterialRecapLines(lines, totals, "CHANTIER");
  lines.push("");
  addSellableQuoteLines(lines, ouvrageLines, costs, prices);
  lines.push("");
  lines.push("Main d'oeuvre et autres prestations a preciser apres visite de chantier.");

  return lines.join("\n");
};
