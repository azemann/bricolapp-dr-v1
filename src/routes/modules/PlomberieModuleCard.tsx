import { useState } from "react";
import { Button, Card, Field, NumericInput } from "../../components/ui";
import { PlomberieModule } from "../../dr/drCore";
import { buildPlomberieHistoryDraft } from "../../domain/history/legacyHistory";
import type { ModuleCardProps } from "./moduleCardProps";
import { ValidationErrors } from "./ValidationErrors";
import { useLegacyModuleCalculation } from "./useLegacyModuleCalculation";

export const PlomberieModuleCard = ({ canAddLine, pieceName, onAddLine }: ModuleCardProps) => {
  const [inputs, setInputs] = useState({
    nbLavabos: "1",
    nbDouches: "1",
    nbWC: "1",
    nbEviers: "1",
    nbLL: "0",
    nbLV: "0",
    nbExt: "0",
    longAlimMoy: "8",
    longEvacMoy: "5",
    margePct: "20",
  });
  const { result, validationMessages, onCalc, onAdd } = useLegacyModuleCalculation({
    module: PlomberieModule,
    inputs,
    canAddLine,
    pieceName,
    onAddLine,
    buildHistoryDraft: buildPlomberieHistoryDraft,
  });

  return (
    <Card>
      <h2>Plomberie</h2>
      <ValidationErrors messages={validationMessages} />
      <Field label="Lavabos">
        <NumericInput value={inputs.nbLavabos} onChange={(value) => setInputs({ ...inputs, nbLavabos: value })} />
      </Field>
      <Field label="Douches">
        <NumericInput value={inputs.nbDouches} onChange={(value) => setInputs({ ...inputs, nbDouches: value })} />
      </Field>
      <Field label="WC">
        <NumericInput value={inputs.nbWC} onChange={(value) => setInputs({ ...inputs, nbWC: value })} />
      </Field>
      <Field label="Eviers">
        <NumericInput value={inputs.nbEviers} onChange={(value) => setInputs({ ...inputs, nbEviers: value })} />
      </Field>
      <Field label="Lave-linge">
        <NumericInput value={inputs.nbLL} onChange={(value) => setInputs({ ...inputs, nbLL: value })} />
      </Field>
      <Field label="Lave-vaisselle">
        <NumericInput value={inputs.nbLV} onChange={(value) => setInputs({ ...inputs, nbLV: value })} />
      </Field>
      <Field label="Points exterieurs">
        <NumericInput value={inputs.nbExt} onChange={(value) => setInputs({ ...inputs, nbExt: value })} />
      </Field>
      <Field label="Longueur alim moyenne (m)">
        <NumericInput value={inputs.longAlimMoy} onChange={(value) => setInputs({ ...inputs, longAlimMoy: value })} />
      </Field>
      <Field label="Longueur evac moyenne (m)">
        <NumericInput value={inputs.longEvacMoy} onChange={(value) => setInputs({ ...inputs, longEvacMoy: value })} />
      </Field>
      <Field label="Marge (%)">
        <NumericInput value={inputs.margePct} onChange={(value) => setInputs({ ...inputs, margePct: value })} />
      </Field>
      <div className="row">
        <Button variant="primary" onClick={onCalc}>Calculer</Button>
        <Button onClick={onAdd}>Ajouter au chantier</Button>
      </div>
      {result && (
        <div className="result">
          <p>Alim : {result.alimMl.toFixed(1)} m</p>
          <p>Evac : {result.evacMl.toFixed(1)} m</p>
          <p>Robinets : {result.robinets}</p>
        </div>
      )}
    </Card>
  );
};
