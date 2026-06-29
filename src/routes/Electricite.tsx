import { useMemo, useState } from "react";
import { Button, Card, Field, NumericInput } from "../components/ui";
import { computeElectriciteOuvrage } from "../domain/trades/electricite/engine";
import {
  installationElectriqueCompleteOuvrage,
  type InstallationElectriqueCompleteInputs,
} from "../domain/trades/electricite/ouvrages/installationElectriqueComplete";
import { defaultElectricitePricing } from "../domain/trades/electricite/pricing";

const formatMoney = (value: number) => `${value.toFixed(2)} €`;
const parseNumber = (value: string) => {
  const parsed = Number(value.replace(",", "."));
  return Number.isFinite(parsed) ? parsed : 0;
};

export const ElectricitePage = () => {
  const [inputs, setInputs] = useState({
    surfaceLogementM2: "80",
    nombrePieces: "5",
    nombrePrises: "24",
    nombrePointsLumineux: "10",
    nombreCircuitsSpecialises: "6",
    longueurMoyenneCircuitMl: "12",
    buildingContext: "renovation",
    poseMode: "mixte",
    wallType: "placo",
    ceilingType: "placo",
    accessibility: "moyenne",
    averageHeightM: "2.5",
    avecTableau: true,
    avecGtl: true,
    avecMiseTerre: true,
    requiresConsuel: false,
  });

  const parsedInputs: InstallationElectriqueCompleteInputs = useMemo(
    () => ({
      surfaceLogementM2: parseNumber(inputs.surfaceLogementM2),
      nombrePieces: parseNumber(inputs.nombrePieces),
      nombrePrises: parseNumber(inputs.nombrePrises),
      nombrePointsLumineux: parseNumber(inputs.nombrePointsLumineux),
      nombreCircuitsSpecialises: parseNumber(inputs.nombreCircuitsSpecialises),
      longueurMoyenneCircuitMl: parseNumber(inputs.longueurMoyenneCircuitMl),
      buildingContext: inputs.buildingContext as InstallationElectriqueCompleteInputs["buildingContext"],
      poseMode: inputs.poseMode as InstallationElectriqueCompleteInputs["poseMode"],
      wallType: inputs.wallType as InstallationElectriqueCompleteInputs["wallType"],
      ceilingType: inputs.ceilingType as InstallationElectriqueCompleteInputs["ceilingType"],
      accessibility: inputs.accessibility as InstallationElectriqueCompleteInputs["accessibility"],
      averageHeightM: parseNumber(inputs.averageHeightM),
      avecTableau: inputs.avecTableau,
      avecGtl: inputs.avecGtl,
      avecMiseTerre: inputs.avecMiseTerre,
      requiresConsuel: inputs.requiresConsuel,
    }),
    [inputs],
  );

  const result = useMemo(
    () => computeElectriciteOuvrage(installationElectriqueCompleteOuvrage, parsedInputs, defaultElectricitePricing),
    [parsedInputs],
  );

  const setValue = (key: keyof typeof inputs, value: string | boolean) =>
    setInputs((current) => ({ ...current, [key]: value }));

  return (
    <div className="page">
      <Card>
        <p className="app-kicker">Métier référence</p>
        <h2>Électricité — installation complète</h2>
        <p className="muted">
          Cette page utilise le nouveau moteur métier : ouvrage → matériaux → temps → coût → prix vendu → marge.
        </p>
      </Card>

      <Card>
        <h2>Entrées chantier</h2>
        <div className="grid two-cols">
          <Field label="Surface logement (m²)">
            <NumericInput value={inputs.surfaceLogementM2} onChange={(value) => setValue("surfaceLogementM2", value)} />
          </Field>
          <Field label="Nombre de pièces">
            <NumericInput value={inputs.nombrePieces} onChange={(value) => setValue("nombrePieces", value)} />
          </Field>
          <Field label="Prises">
            <NumericInput value={inputs.nombrePrises} onChange={(value) => setValue("nombrePrises", value)} />
          </Field>
          <Field label="Points lumineux">
            <NumericInput value={inputs.nombrePointsLumineux} onChange={(value) => setValue("nombrePointsLumineux", value)} />
          </Field>
          <Field label="Circuits spécialisés">
            <NumericInput value={inputs.nombreCircuitsSpecialises} onChange={(value) => setValue("nombreCircuitsSpecialises", value)} />
          </Field>
          <Field label="Longueur moyenne circuit (ml)">
            <NumericInput value={inputs.longueurMoyenneCircuitMl} onChange={(value) => setValue("longueurMoyenneCircuitMl", value)} />
          </Field>
          <Field label="Contexte">
            <select className="input" value={inputs.buildingContext} onChange={(event) => setValue("buildingContext", event.target.value)}>
              <option value="neuf">Neuf</option>
              <option value="renovation">Rénovation</option>
            </select>
          </Field>
          <Field label="Pose">
            <select className="input" value={inputs.poseMode} onChange={(event) => setValue("poseMode", event.target.value)}>
              <option value="encastre">Encastré</option>
              <option value="apparent">Apparent</option>
              <option value="mixte">Mixte</option>
            </select>
          </Field>
          <Field label="Mur">
            <select className="input" value={inputs.wallType} onChange={(event) => setValue("wallType", event.target.value)}>
              <option value="placo">Placo</option>
              <option value="brique">Brique</option>
              <option value="beton">Béton</option>
              <option value="pierre">Pierre</option>
              <option value="bois">Bois</option>
              <option value="inconnu">Inconnu</option>
            </select>
          </Field>
          <Field label="Plafond">
            <select className="input" value={inputs.ceilingType} onChange={(event) => setValue("ceilingType", event.target.value)}>
              <option value="placo">Placo</option>
              <option value="dalle_beton">Dalle béton</option>
              <option value="combles_accessibles">Combles accessibles</option>
              <option value="faux_plafond">Faux plafond</option>
              <option value="inconnu">Inconnu</option>
            </select>
          </Field>
          <Field label="Accessibilité">
            <select className="input" value={inputs.accessibility} onChange={(event) => setValue("accessibility", event.target.value)}>
              <option value="simple">Simple</option>
              <option value="moyenne">Moyenne</option>
              <option value="difficile">Difficile</option>
            </select>
          </Field>
          <Field label="Hauteur moyenne (m)">
            <NumericInput value={inputs.averageHeightM} onChange={(value) => setValue("averageHeightM", value)} />
          </Field>
        </div>
        <div className="row">
          <label className="chip">
            <input type="checkbox" checked={inputs.avecTableau} onChange={(event) => setValue("avecTableau", event.target.checked)} />
            Tableau
          </label>
          <label className="chip">
            <input type="checkbox" checked={inputs.avecGtl} onChange={(event) => setValue("avecGtl", event.target.checked)} />
            GTL
          </label>
          <label className="chip">
            <input type="checkbox" checked={inputs.avecMiseTerre} onChange={(event) => setValue("avecMiseTerre", event.target.checked)} />
            Terre
          </label>
          <label className="chip">
            <input type="checkbox" checked={inputs.requiresConsuel} onChange={(event) => setValue("requiresConsuel", event.target.checked)} />
            Consuel
          </label>
        </div>
      </Card>

      <Card>
        <h2>Devis et rentabilité</h2>
        <div className="result-grid">
          <div><p className="muted">Coût matériaux</p><strong>{formatMoney(result.profitability.materialCostHT)}</strong></div>
          <div><p className="muted">Main-d'œuvre</p><strong>{formatMoney(result.profitability.laborCostHT)}</strong></div>
          <div><p className="muted">Vente HT</p><strong>{formatMoney(result.profitability.salePriceHT)}</strong></div>
          <div><p className="muted">Marge</p><strong>{formatMoney(result.profitability.marginAmount)}</strong></div>
          <div><p className="muted">Taux marge</p><strong>{result.profitability.marginRate.toFixed(2)} %</strong></div>
          <div><p className="muted">Temps total</p><strong>{result.labor.hours.toFixed(2)} h</strong></div>
        </div>
      </Card>

      <Card>
        <h2>Temps détaillé</h2>
        <div className="result-grid">
          <div><p className="muted">Préparation</p><strong>{result.laborBreakdown.preparationHours} h</strong></div>
          <div><p className="muted">Pose</p><strong>{result.laborBreakdown.installationHours} h</strong></div>
          <div><p className="muted">Finition</p><strong>{result.laborBreakdown.finishingHours} h</strong></div>
          <div><p className="muted">Contrôle</p><strong>{result.laborBreakdown.controlHours} h</strong></div>
          <div><p className="muted">Nettoyage</p><strong>{result.laborBreakdown.cleanupHours} h</strong></div>
        </div>
      </Card>

      <Card>
        <h2>Matériaux générés</h2>
        <ul className="history-list">
          {result.needs.map((need) => (
            <li key={need.id} className="history-item">
              <strong>{need.label}</strong>
              <span>{need.quantity} {need.unit}</span>
            </li>
          ))}
        </ul>
      </Card>

      <Card>
        <h2>Contraintes et dépendances</h2>
        <div className="grid two-cols">
          <div>
            <h3>Contraintes</h3>
            {result.constraints.length === 0 ? <p className="muted">Aucune contrainte forte détectée.</p> : null}
            {result.constraints.map((constraint) => (
              <p key={constraint.id} className="warning">{constraint.label}</p>
            ))}
          </div>
          <div>
            <h3>Dépendances</h3>
            <ul>
              {result.dependencies.map((dependency) => (
                <li key={dependency.id}>{dependency.label}</li>
              ))}
            </ul>
          </div>
        </div>
      </Card>

      <Card>
        <h2>Ligne vendable</h2>
        <p>
          {result.quoteLine.designation} — {result.quoteLine.quantity} {result.quoteLine.unit} —{" "}
          {formatMoney(result.quoteLine.totalHT)} HT
        </p>
        <Button variant="primary" onClick={() => navigator.clipboard?.writeText(result.quoteLine.designation)}>
          Copier la désignation
        </Button>
      </Card>
    </div>
  );
};
