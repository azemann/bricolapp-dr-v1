import { useMemo, useState } from "react";
import { Button, Card, Field, NumericInput } from "../components/ui";
import { computeTotalsForChantier, computeTotalsGlobal, emptyTotals } from "../dr/drTotals";
import { useActiveContext, useStore } from "../state/store";

const toNumber = (value: string) => {
  const parsed = parseFloat(value.replace(",", "."));
  return Number.isNaN(parsed) ? 0 : parsed;
};

const formatEuros = (value: number) => `${value.toFixed(2)} €`;
const formatAmount = (value: number) => value.toFixed(2);

export const DevisPage = () => {
  const { state, dispatch } = useStore();
  const { chantier } = useActiveContext();
  const [devisGlobalText, setDevisGlobalText] = useState("");
  const [devisChantierText, setDevisChantierText] = useState("");

  const totalsGlobal = computeTotalsGlobal(state.history);
  const totalsChantier = chantier
    ? computeTotalsForChantier(state.history, chantier.id)
    : emptyTotals();

  const prices = state.prices;

  const calcCosts = (totals: typeof totalsGlobal) => {
    const pc = toNumber(prices.prixCarton);
    const pp = toNumber(prices.prixPot);
    const ppl = toNumber(prices.prixPlaque);
    const pm = toNumber(prices.prixMontant);
    const pr = toNumber(prices.prixRail);
    const pl = toNumber(prices.prixLame);
    const pColle = toNumber(prices.prixColle);
    const pJoints = toNumber(prices.prixJoints);
    const pSC = toNumber(prices.prixSousCouche);
    const pVis = toNumber(prices.prixVis);
    const pBandes = toNumber(prices.prixBandes);
    const pLiteau = toNumber(prices.prixLiteau);
    const pAlim = toNumber(prices.prixTubeAlim);
    const pEvac = toNumber(prices.prixTubeEvac);
    const pRob = toNumber(prices.prixRobinetArret);
    const pSiph = toNumber(prices.prixSiphon);
    const tvaVal = toNumber(prices.tva) / 100;
    const margeVal = toNumber(prices.marge) / 100;

    let mat = 0;
    mat += totals.carrelage_cartons * pc;
    mat += totals.peinture_pots * pp;
    mat += totals.placo_plaques * ppl;
    mat += totals.placo_montants * pm;
    mat += totals.placo_rails * pr;
    mat += totals.bardage_lames * pl;
    mat += totals.carrelage_colle_sacs * pColle;
    mat += totals.carrelage_joints_kg * pJoints;
    mat += totals.peinture_sous_couche_pots * pSC;
    mat += totals.placo_vis_boites * pVis;
    mat += totals.placo_bandes_sacs * pBandes;
    mat += totals.bardage_liteaux_ml * pLiteau;
    mat += totals.plomberie_alim_ml * pAlim;
    mat += totals.plomberie_evacu_ml * pEvac;
    mat += totals.plomberie_robinets * pRob;
    mat += totals.plomberie_siphons * pSiph;

    const matHT = Number(mat.toFixed(2));
    const avecMarge = Number((matHT * (1 + margeVal)).toFixed(2));
    const tva = Number((avecMarge * tvaVal).toFixed(2));
    const ttc = Number((avecMarge + tva).toFixed(2));

    return { matHT, avecMarge, tva, ttc };
  };

  const totalGlobalCosts = calcCosts(totalsGlobal);
  const totalChantierCosts = calcCosts(totalsChantier);

  const historyByChantier = useMemo(() => {
    return state.chantiers.map((c) => ({
      chantier: c,
      history: state.history.filter((line) => line.chantierId === c.id),
    }));
  }, [state.chantiers, state.history]);

  const generateDevisText = (scope: "global" | "chantier") => {
    const addDetailLines = (totals: typeof totalsGlobal, costs: typeof totalGlobalCosts) => {
      const entries = [
        { label: "Carrelage (cartons)", qty: totals.carrelage_cartons, pu: toNumber(prices.prixCarton) },
        { label: "Colle carrelage (sacs)", qty: totals.carrelage_colle_sacs, pu: toNumber(prices.prixColle) },
        { label: "Joints carrelage (kg)", qty: totals.carrelage_joints_kg, pu: toNumber(prices.prixJoints) },
        { label: "Peinture (pots)", qty: totals.peinture_pots, pu: toNumber(prices.prixPot) },
        { label: "Sous-couche (pots)", qty: totals.peinture_sous_couche_pots, pu: toNumber(prices.prixSousCouche) },
        { label: "Placo (plaques)", qty: totals.placo_plaques, pu: toNumber(prices.prixPlaque) },
        { label: "Montants", qty: totals.placo_montants, pu: toNumber(prices.prixMontant) },
        { label: "Rails (m)", qty: totals.placo_rails, pu: toNumber(prices.prixRail) },
        { label: "Vis (boites)", qty: totals.placo_vis_boites, pu: toNumber(prices.prixVis) },
        { label: "Bandes/enduit (sacs)", qty: totals.placo_bandes_sacs, pu: toNumber(prices.prixBandes) },
        { label: "Bardage (lames)", qty: totals.bardage_lames, pu: toNumber(prices.prixLame) },
        { label: "Liteaux (m)", qty: totals.bardage_liteaux_ml, pu: toNumber(prices.prixLiteau) },
        { label: "Plomberie alim (m)", qty: totals.plomberie_alim_ml, pu: toNumber(prices.prixTubeAlim) },
        { label: "Plomberie evac (m)", qty: totals.plomberie_evacu_ml, pu: toNumber(prices.prixTubeEvac) },
        { label: "Robinets", qty: totals.plomberie_robinets, pu: toNumber(prices.prixRobinetArret) },
        { label: "Siphons", qty: totals.plomberie_siphons, pu: toNumber(prices.prixSiphon) },
      ];

      lines.push("DETAIL MATERIAUX (HT)");
      entries.forEach((entry) => {
        if (entry.qty <= 0) return;
        const montant = entry.qty * entry.pu;
        lines.push(
          `${entry.label}  ${formatAmount(entry.qty)} x ${formatAmount(entry.pu)} = ${formatAmount(montant)}`
        );
      });
      lines.push("");
      lines.push(`TOTAL MATERIAUX HT : ${formatAmount(costs.matHT)} EUR`);
      lines.push(`Marge (${prices.marge}%) : ${formatAmount(costs.avecMarge - costs.matHT)} EUR`);
      lines.push(`TVA (${prices.tva}%) : ${formatAmount(costs.tva)} EUR`);
      lines.push(`TOTAL TTC : ${formatAmount(costs.ttc)} EUR`);
    };

    const lines: string[] = [];
    if (scope === "global") {
      lines.push("DEVIS GLOBAL ENTREPRISE");
      lines.push("");
      historyByChantier.forEach(({ chantier: ch, history }) => {
        if (history.length === 0) return;
        lines.push(`CHANTIER : ${ch.name}`);
        lines.push("-".repeat(30));
        ch.pieces.forEach((piece) => {
          const pieceHistory = history.filter((line) => line.pieceId === piece.id);
          if (pieceHistory.length === 0) return;
          lines.push(`Piece : ${piece.name} (${piece.type} - ${piece.level})`);
          pieceHistory.forEach((line) => lines.push(`  - ${line.texte}`));
          lines.push("");
        });
      });

      lines.push("RECAPITULATIF MATERIAUX (GLOBAL) :");
      lines.push(
        ` - Carrelage : ${totalsGlobal.carrelage_m2.toFixed(2)} m2, ${totalsGlobal.carrelage_cartons} cartons`
      );
      lines.push(
        `   Colle : ${totalsGlobal.carrelage_colle_sacs} sac(s), Joints : ${totalsGlobal.carrelage_joints_kg.toFixed(
          1
        )} kg`
      );
      lines.push(
        ` - Peinture : ${totalsGlobal.peinture_m2.toFixed(2)} m2, ${totalsGlobal.peinture_pots} pots (SC : ${totalsGlobal.peinture_sous_couche_pots} pot(s))`
      );
      lines.push(
        ` - Placo : ${totalsGlobal.placo_m2.toFixed(2)} m2, ${totalsGlobal.placo_plaques} plaques, ${totalsGlobal.placo_montants} montants, ${totalsGlobal.placo_rails.toFixed(
          2
        )} m rails`
      );
      lines.push(
        `   Vis : ${totalsGlobal.placo_vis_boites} boites, Bandes/enduit : ${totalsGlobal.placo_bandes_sacs.toFixed(
          1
        )} sac(s)`
      );
      lines.push(
        ` - Bardage : ${totalsGlobal.bardage_m2.toFixed(2)} m2, ${totalsGlobal.bardage_lames} lames (liteaux ~${totalsGlobal.bardage_liteaux_ml.toFixed(
          1
        )} m)`
      );
      lines.push(
        ` - Plomberie : alim ${totalsGlobal.plomberie_alim_ml.toFixed(1)} m, evac ${totalsGlobal.plomberie_evacu_ml.toFixed(
          1
        )} m`
      );
      lines.push(
        `   Robinets : ${totalsGlobal.plomberie_robinets}, Siphons : ${totalsGlobal.plomberie_siphons}`
      );
      lines.push("");
      addDetailLines(totalsGlobal, totalGlobalCosts);
      lines.push("");
      lines.push("Main d'oeuvre et autres prestations a preciser apres visite de chantier.");
      setDevisGlobalText(lines.join("\n"));
      return;
    }

    if (!chantier) {
      setDevisChantierText("Aucun chantier actif selectionne.");
      return;
    }

    const chantierHistory = state.history.filter((line) => line.chantierId === chantier.id);

    lines.push(`DEVIS CHANTIER : ${chantier.name}`);
    lines.push("-".repeat(30));
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

    lines.push("RECAPITULATIF MATERIAUX (CHANTIER) :");
    lines.push(
      ` - Carrelage : ${totalsChantier.carrelage_m2.toFixed(2)} m2, ${totalsChantier.carrelage_cartons} cartons`
    );
    lines.push(
      `   Colle : ${totalsChantier.carrelage_colle_sacs} sac(s), Joints : ${totalsChantier.carrelage_joints_kg.toFixed(
        1
      )} kg`
    );
    lines.push(
      ` - Peinture : ${totalsChantier.peinture_m2.toFixed(2)} m2, ${totalsChantier.peinture_pots} pots (SC : ${totalsChantier.peinture_sous_couche_pots} pot(s))`
    );
    lines.push(
      ` - Placo : ${totalsChantier.placo_m2.toFixed(2)} m2, ${totalsChantier.placo_plaques} plaques, ${totalsChantier.placo_montants} montants, ${totalsChantier.placo_rails.toFixed(
        2
      )} m rails`
    );
    lines.push(
      `   Vis : ${totalsChantier.placo_vis_boites} boites, Bandes/enduit : ${totalsChantier.placo_bandes_sacs.toFixed(
        1
      )} sac(s)`
    );
    lines.push(
      ` - Bardage : ${totalsChantier.bardage_m2.toFixed(2)} m2, ${totalsChantier.bardage_lames} lames (liteaux ~${totalsChantier.bardage_liteaux_ml.toFixed(
        1
      )} m)`
    );
    lines.push(
      ` - Plomberie : alim ${totalsChantier.plomberie_alim_ml.toFixed(1)} m, evac ${totalsChantier.plomberie_evacu_ml.toFixed(
        1
      )} m`
    );
    lines.push(
      `   Robinets : ${totalsChantier.plomberie_robinets}, Siphons : ${totalsChantier.plomberie_siphons}`
    );
    lines.push("");
    addDetailLines(totalsChantier, totalChantierCosts);
    lines.push("");
    lines.push("Main d'oeuvre et autres prestations a preciser apres visite de chantier.");

    setDevisChantierText(lines.join("\n"));
  };

  const copyToClipboard = async (text: string) => {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // Ignore clipboard failures.
    }
  };

  return (
    <div className="page">
      <Card>
        <h2>Parametres prix</h2>
        <div className="grid two-cols">
          <Field label="Prix / carton carrelage">
            <NumericInput
              value={prices.prixCarton}
              onChange={(value) => dispatch({ type: "PRICES_UPDATE", payload: { prixCarton: value } })}
            />
          </Field>
          <Field label="Prix / pot peinture">
            <NumericInput
              value={prices.prixPot}
              onChange={(value) => dispatch({ type: "PRICES_UPDATE", payload: { prixPot: value } })}
            />
          </Field>
          <Field label="Prix / plaque placo">
            <NumericInput
              value={prices.prixPlaque}
              onChange={(value) => dispatch({ type: "PRICES_UPDATE", payload: { prixPlaque: value } })}
            />
          </Field>
          <Field label="Prix / montant">
            <NumericInput
              value={prices.prixMontant}
              onChange={(value) => dispatch({ type: "PRICES_UPDATE", payload: { prixMontant: value } })}
            />
          </Field>
          <Field label="Prix / rail">
            <NumericInput
              value={prices.prixRail}
              onChange={(value) => dispatch({ type: "PRICES_UPDATE", payload: { prixRail: value } })}
            />
          </Field>
          <Field label="Prix / lame bardage">
            <NumericInput
              value={prices.prixLame}
              onChange={(value) => dispatch({ type: "PRICES_UPDATE", payload: { prixLame: value } })}
            />
          </Field>
          <Field label="Prix / sac colle">
            <NumericInput
              value={prices.prixColle}
              onChange={(value) => dispatch({ type: "PRICES_UPDATE", payload: { prixColle: value } })}
            />
          </Field>
          <Field label="Prix / kg joints">
            <NumericInput
              value={prices.prixJoints}
              onChange={(value) => dispatch({ type: "PRICES_UPDATE", payload: { prixJoints: value } })}
            />
          </Field>
          <Field label="Prix / pot sous-couche">
            <NumericInput
              value={prices.prixSousCouche}
              onChange={(value) => dispatch({ type: "PRICES_UPDATE", payload: { prixSousCouche: value } })}
            />
          </Field>
          <Field label="Prix / boite vis">
            <NumericInput
              value={prices.prixVis}
              onChange={(value) => dispatch({ type: "PRICES_UPDATE", payload: { prixVis: value } })}
            />
          </Field>
          <Field label="Prix / sac bandes">
            <NumericInput
              value={prices.prixBandes}
              onChange={(value) => dispatch({ type: "PRICES_UPDATE", payload: { prixBandes: value } })}
            />
          </Field>
          <Field label="Prix / m liteau">
            <NumericInput
              value={prices.prixLiteau}
              onChange={(value) => dispatch({ type: "PRICES_UPDATE", payload: { prixLiteau: value } })}
            />
          </Field>
          <Field label="Prix / m tube alim">
            <NumericInput
              value={prices.prixTubeAlim}
              onChange={(value) => dispatch({ type: "PRICES_UPDATE", payload: { prixTubeAlim: value } })}
            />
          </Field>
          <Field label="Prix / m tube evac">
            <NumericInput
              value={prices.prixTubeEvac}
              onChange={(value) => dispatch({ type: "PRICES_UPDATE", payload: { prixTubeEvac: value } })}
            />
          </Field>
          <Field label="Prix / robinet arret">
            <NumericInput
              value={prices.prixRobinetArret}
              onChange={(value) => dispatch({ type: "PRICES_UPDATE", payload: { prixRobinetArret: value } })}
            />
          </Field>
          <Field label="Prix / siphon">
            <NumericInput
              value={prices.prixSiphon}
              onChange={(value) => dispatch({ type: "PRICES_UPDATE", payload: { prixSiphon: value } })}
            />
          </Field>
          <Field label="TVA (%)">
            <NumericInput
              value={prices.tva}
              onChange={(value) => dispatch({ type: "PRICES_UPDATE", payload: { tva: value } })}
            />
          </Field>
          <Field label="Marge (%)">
            <NumericInput
              value={prices.marge}
              onChange={(value) => dispatch({ type: "PRICES_UPDATE", payload: { marge: value } })}
            />
          </Field>
        </div>
      </Card>

      <Card>
        <h2>Devis global</h2>
        <div className="result-grid">
          <div>
            <p className="muted">Materiaux HT</p>
            <strong>{formatEuros(totalGlobalCosts.matHT)}</strong>
          </div>
          <div>
            <p className="muted">Avec marge</p>
            <strong>{formatEuros(totalGlobalCosts.avecMarge)}</strong>
          </div>
          <div>
            <p className="muted">TVA</p>
            <strong>{formatEuros(totalGlobalCosts.tva)}</strong>
          </div>
          <div>
            <p className="muted">Total TTC</p>
            <strong>{formatEuros(totalGlobalCosts.ttc)}</strong>
          </div>
        </div>
      </Card>

      <Card>
        <h2>Devis texte global</h2>
        <div className="row">
          <Button variant="primary" onClick={() => generateDevisText("global")}>
            Generer le devis global
          </Button>
          <Button onClick={() => copyToClipboard(devisGlobalText)}>Copier</Button>
        </div>
        <textarea
          className="textarea"
          value={devisGlobalText}
          onChange={(event) => setDevisGlobalText(event.target.value)}
          rows={10}
        />
      </Card>

      <Card>
        <h2>Devis chantier actif</h2>
        <p className="muted">{chantier ? chantier.name : "Aucun chantier actif"}</p>
        <div className="result-grid">
          <div>
            <p className="muted">Materiaux HT</p>
            <strong>{formatEuros(totalChantierCosts.matHT)}</strong>
          </div>
          <div>
            <p className="muted">Avec marge</p>
            <strong>{formatEuros(totalChantierCosts.avecMarge)}</strong>
          </div>
          <div>
            <p className="muted">TVA</p>
            <strong>{formatEuros(totalChantierCosts.tva)}</strong>
          </div>
          <div>
            <p className="muted">Total TTC</p>
            <strong>{formatEuros(totalChantierCosts.ttc)}</strong>
          </div>
        </div>
      </Card>

      <Card>
        <h2>Devis texte chantier</h2>
        <div className="row">
          <Button variant="primary" onClick={() => generateDevisText("chantier")}>
            Generer le devis chantier
          </Button>
          <Button onClick={() => copyToClipboard(devisChantierText)}>Copier</Button>
        </div>
        <textarea
          className="textarea"
          value={devisChantierText}
          onChange={(event) => setDevisChantierText(event.target.value)}
          rows={10}
        />
      </Card>
    </div>
  );
};
