import { useState } from "react";
import { Button, Card, Field, NumericInput } from "../../components/ui";
import { CarrelageModule } from "../../dr/drCore";
import { buildCarrelageHistoryDraft } from "../../domain/history/legacyHistory";
import type { ModuleCardProps } from "./moduleCardProps";
import { ValidationErrors } from "./ValidationErrors";
import { useLegacyModuleCalculation } from "./useLegacyModuleCalculation";

export const CarrelageModuleCard = ({ canAddLine, pieceName, onAddLine }: ModuleCardProps) => {
  const [inputs, setInputs] = useState({
    longueur: "4",
    largeur: "3",
    carreauA: "0.60",
    carreauB: "0.60",
    pertesPct: "10",
    m2Carton: "1.2",
  });
  const { result, validationMessages, onCalc, onAdd } = useLegacyModuleCalculation({
    module: CarrelageModule,
    inputs,
    canAddLine,
    pieceName,
    onAddLine,
    buildHistoryDraft: buildCarrelageHistoryDraft,
  });

  return (
    <Card>
      <h2>Carrelage</h2>
      <ValidationErrors messages={validationMessages} />
      <Field label="Longueur piece (m)">
        <NumericInput value={inputs.longueur} onChange={(value) => setInputs({ ...inputs, longueur: value })} />
      </Field>
      <Field label="Largeur piece (m)">
        <NumericInput value={inputs.largeur} onChange={(value) => setInputs({ ...inputs, largeur: value })} />
      </Field>
      <Field label="Carreau A (m)">
        <NumericInput value={inputs.carreauA} onChange={(value) => setInputs({ ...inputs, carreauA: value })} />
      </Field>
      <Field label="Carreau B (m)">
        <NumericInput value={inputs.carreauB} onChange={(value) => setInputs({ ...inputs, carreauB: value })} />
      </Field>
      <Field label="Pertes (%)">
        <NumericInput value={inputs.pertesPct} onChange={(value) => setInputs({ ...inputs, pertesPct: value })} />
      </Field>
      <Field label="m2 par carton">
        <NumericInput value={inputs.m2Carton} onChange={(value) => setInputs({ ...inputs, m2Carton: value })} />
      </Field>
      <div className="row">
        <Button variant="primary" onClick={onCalc}>Calculer</Button>
        <Button onClick={onAdd} variant="default">Ajouter au chantier</Button>
      </div>
      {result && (
        <div className="result">
          <p>Surface : {result.surface.toFixed(2)} m2</p>
          <p>Cartons : {result.nbCartons}</p>
          <p>Colle : {result.colleSacs} sac(s)</p>
        </div>
      )}
    </Card>
  );
};
