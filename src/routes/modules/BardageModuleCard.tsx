import { useState } from "react";
import { Button, Card, Field, NumericInput } from "../../components/ui";
import { BardageModule } from "../../dr/drCore";
import { buildBardageHistoryDraft } from "../../domain/history/legacyHistory";
import type { ModuleCardProps } from "./moduleCardProps";
import { ValidationErrors } from "./ValidationErrors";
import { useLegacyModuleCalculation } from "./useLegacyModuleCalculation";

export const BardageModuleCard = ({ canAddLine, pieceName, onAddLine }: ModuleCardProps) => {
  const [inputs, setInputs] = useState({
    largeur: "6",
    hauteur: "2.8",
    largeurUtile: "0.18",
    longueurLame: "3",
    pertesPct: "10",
  });
  const { result, validationMessages, onCalc, onAdd } = useLegacyModuleCalculation({
    module: BardageModule,
    inputs,
    canAddLine,
    pieceName,
    onAddLine,
    buildHistoryDraft: buildBardageHistoryDraft,
  });

  return (
    <Card>
      <h2>Bardage</h2>
      <ValidationErrors messages={validationMessages} />
      <Field label="Largeur facade (m)">
        <NumericInput value={inputs.largeur} onChange={(value) => setInputs({ ...inputs, largeur: value })} />
      </Field>
      <Field label="Hauteur facade (m)">
        <NumericInput value={inputs.hauteur} onChange={(value) => setInputs({ ...inputs, hauteur: value })} />
      </Field>
      <Field label="Largeur utile (m)">
        <NumericInput value={inputs.largeurUtile} onChange={(value) => setInputs({ ...inputs, largeurUtile: value })} />
      </Field>
      <Field label="Longueur lame (m)">
        <NumericInput value={inputs.longueurLame} onChange={(value) => setInputs({ ...inputs, longueurLame: value })} />
      </Field>
      <Field label="Pertes (%)">
        <NumericInput value={inputs.pertesPct} onChange={(value) => setInputs({ ...inputs, pertesPct: value })} />
      </Field>
      <div className="row">
        <Button variant="primary" onClick={onCalc}>Calculer</Button>
        <Button onClick={onAdd}>Ajouter au chantier</Button>
      </div>
      {result && (
        <div className="result">
          <p>Surface : {result.surface.toFixed(2)} m2</p>
          <p>Lames : {result.nbLames}</p>
          <p>Liteaux : {result.liteauxMl.toFixed(1)} m</p>
        </div>
      )}
    </Card>
  );
};
