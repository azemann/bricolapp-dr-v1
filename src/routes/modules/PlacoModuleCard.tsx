import { useState } from "react";
import { Button, Card, Field, NumericInput } from "../../components/ui";
import { PlacoModule } from "../../dr/drCore";
import { buildPlacoHistoryDraft } from "../../domain/history/legacyHistory";
import type { ModuleCardProps } from "./moduleCardProps";
import { ValidationErrors } from "./ValidationErrors";
import { useLegacyModuleCalculation } from "./useLegacyModuleCalculation";

export const PlacoModuleCard = ({ canAddLine, pieceName, onAddLine }: ModuleCardProps) => {
  const [inputs, setInputs] = useState({
    longueur: "4",
    hauteur: "2.5",
    entraxe: "0.60",
    longPlaque: "1.2",
    hautPlaque: "2.5",
    doublePeau: "0",
  });
  const { result, validationMessages, onCalc, onAdd } = useLegacyModuleCalculation({
    module: PlacoModule,
    inputs,
    canAddLine,
    pieceName,
    onAddLine,
    buildHistoryDraft: buildPlacoHistoryDraft,
  });

  return (
    <Card>
      <h2>Placo</h2>
      <ValidationErrors messages={validationMessages} />
      <Field label="Longueur (m)">
        <NumericInput value={inputs.longueur} onChange={(value) => setInputs({ ...inputs, longueur: value })} />
      </Field>
      <Field label="Hauteur (m)">
        <NumericInput value={inputs.hauteur} onChange={(value) => setInputs({ ...inputs, hauteur: value })} />
      </Field>
      <Field label="Entraxe (m)">
        <NumericInput value={inputs.entraxe} onChange={(value) => setInputs({ ...inputs, entraxe: value })} />
      </Field>
      <Field label="Longueur plaque (m)">
        <NumericInput value={inputs.longPlaque} onChange={(value) => setInputs({ ...inputs, longPlaque: value })} />
      </Field>
      <Field label="Hauteur plaque (m)">
        <NumericInput value={inputs.hautPlaque} onChange={(value) => setInputs({ ...inputs, hautPlaque: value })} />
      </Field>
      <Field label="Double peau (0/1)">
        <NumericInput value={inputs.doublePeau} onChange={(value) => setInputs({ ...inputs, doublePeau: value })} />
      </Field>
      <div className="row">
        <Button variant="primary" onClick={onCalc}>Calculer</Button>
        <Button onClick={onAdd}>Ajouter au chantier</Button>
      </div>
      {result && (
        <div className="result">
          <p>Surface : {result.surface.toFixed(2)} m2</p>
          <p>Plaques : {result.nbPlaques}</p>
          <p>Montants : {result.nbMontants}</p>
        </div>
      )}
    </Card>
  );
};
