import { useMemo, useState } from "react";
import { Button, Card, Field, NumericInput } from "../components/ui";
import { formatChantierQuoteText, formatGlobalQuoteText } from "../domain/devis/formatQuoteText";
import { buildOuvrageLinesFromHistory } from "../domain/ouvrages/fromHistory";
import { calcPricing, hasInvalidPrices } from "../domain/pricing/calcPricing";
import { computeTotalsForChantier, computeTotalsGlobal, emptyTotals } from "../dr/drTotals";
import { useActiveContext, useStore } from "../state/storeHooks";

const formatEuros = (value: number) => `${value.toFixed(2)} €`;

type GeneratedQuoteText = {
  sourceKey: string;
  text: string;
};

export const DevisPage = () => {
  const { state, dispatch } = useStore();
  const { chantier } = useActiveContext();
  const [devisGlobalDraft, setDevisGlobalDraft] = useState<GeneratedQuoteText>({
    sourceKey: "",
    text: "",
  });
  const [devisChantierDraft, setDevisChantierDraft] = useState<GeneratedQuoteText>({
    sourceKey: "",
    text: "",
  });

  const totalsGlobal = computeTotalsGlobal(state.history);
  const totalsChantier = chantier
    ? computeTotalsForChantier(state.history, chantier.id)
    : emptyTotals();

  const prices = state.prices;
  const chantierId = chantier?.id || null;

  const totalGlobalCosts = calcPricing({ totals: totalsGlobal, prices });
  const totalChantierCosts = calcPricing({ totals: totalsChantier, prices });
  const pricesHaveInvalidValues = hasInvalidPrices(prices);
  const ouvrageLinesGlobal = useMemo(
    () => buildOuvrageLinesFromHistory(state.history, prices),
    [state.history, prices],
  );
  const ouvrageLinesChantier = useMemo(
    () =>
      chantier
        ? buildOuvrageLinesFromHistory(
            state.history.filter((line) => line.chantierId === chantier.id),
            prices,
          )
        : [],
    [chantier, state.history, prices],
  );

  const historyByChantier = useMemo(() => {
    return state.chantiers.map((c) => ({
      chantier: c,
      history: state.history.filter((line) => line.chantierId === c.id),
    }));
  }, [state.chantiers, state.history]);
  const globalQuoteSourceKey = useMemo(
    () => JSON.stringify({ history: state.history, prices }),
    [state.history, prices],
  );
  const chantierQuoteSourceKey = useMemo(
    () =>
      JSON.stringify({
        chantierId,
        history: chantier
          ? state.history.filter((line) => line.chantierId === chantier.id)
          : [],
        prices,
      }),
    [chantier, chantierId, state.history, prices],
  );
  const devisGlobalText =
    devisGlobalDraft.sourceKey === globalQuoteSourceKey ? devisGlobalDraft.text : "";
  const devisChantierText =
    devisChantierDraft.sourceKey === chantierQuoteSourceKey ? devisChantierDraft.text : "";

  const generateDevisText = (scope: "global" | "chantier") => {
    if (scope === "global") {
      setDevisGlobalDraft({
        sourceKey: globalQuoteSourceKey,
        text: formatGlobalQuoteText({
          historyByChantier,
          totals: totalsGlobal,
          costs: totalGlobalCosts,
          prices,
          ouvrageLines: ouvrageLinesGlobal,
        }),
      });
      return;
    }

    const chantierHistory = chantier
      ? state.history.filter((line) => line.chantierId === chantier.id)
      : [];
    setDevisChantierDraft({
      sourceKey: chantierQuoteSourceKey,
      text: formatChantierQuoteText({
        chantier,
        chantierHistory,
        totals: totalsChantier,
        costs: totalChantierCosts,
        prices,
        ouvrageLines: ouvrageLinesChantier,
      }),
    });
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
        {pricesHaveInvalidValues ? (
          <p className="warning">Certains prix ne sont pas numeriques et seront comptes a 0.</p>
        ) : null}
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
            <strong>{formatEuros(totalGlobalCosts.materialCostHT)}</strong>
          </div>
          <div>
            <p className="muted">Vente HT</p>
            <strong>{formatEuros(totalGlobalCosts.saleHT)}</strong>
          </div>
          <div>
            <p className="muted">Marge brute</p>
            <strong>{formatEuros(totalGlobalCosts.marginAmount)}</strong>
          </div>
          <div>
            <p className="muted">TVA</p>
            <strong>{formatEuros(totalGlobalCosts.vatAmount)}</strong>
          </div>
          <div>
            <p className="muted">Total TTC</p>
            <strong>{formatEuros(totalGlobalCosts.totalTTC)}</strong>
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
          onChange={(event) =>
            setDevisGlobalDraft({
              sourceKey: globalQuoteSourceKey,
              text: event.target.value,
            })
          }
          rows={10}
        />
      </Card>

      <Card>
        <h2>Devis chantier actif</h2>
        <p className="muted">{chantier ? chantier.name : "Aucun chantier actif"}</p>
        <div className="result-grid">
          <div>
            <p className="muted">Materiaux HT</p>
            <strong>{formatEuros(totalChantierCosts.materialCostHT)}</strong>
          </div>
          <div>
            <p className="muted">Vente HT</p>
            <strong>{formatEuros(totalChantierCosts.saleHT)}</strong>
          </div>
          <div>
            <p className="muted">Marge brute</p>
            <strong>{formatEuros(totalChantierCosts.marginAmount)}</strong>
          </div>
          <div>
            <p className="muted">Taux marge</p>
            <strong>{totalChantierCosts.marginRate.toFixed(2)} %</strong>
          </div>
          <div>
            <p className="muted">TVA</p>
            <strong>{formatEuros(totalChantierCosts.vatAmount)}</strong>
          </div>
          <div>
            <p className="muted">Total TTC</p>
            <strong>{formatEuros(totalChantierCosts.totalTTC)}</strong>
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
          onChange={(event) =>
            setDevisChantierDraft({
              sourceKey: chantierQuoteSourceKey,
              text: event.target.value,
            })
          }
          rows={10}
        />
      </Card>
    </div>
  );
};
