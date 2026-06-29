import { useState } from "react";
import { Button, Card, Chip, Field, NumericInput } from "../../components/ui";
import { PeintureModule } from "../../dr/drCore";
import { buildPeintureHistoryDraft } from "../../domain/history/legacyHistory";
import type { ModuleCardProps } from "./moduleCardProps";
import { ValidationErrors } from "./ValidationErrors";
import { useLegacyModuleCalculation } from "./useLegacyModuleCalculation";

export const PeintureModuleCard = ({ canAddLine, pieceName, onAddLine }: ModuleCardProps) => {
  const [inputs, setInputs] = useState({
    longueur: "4",
    largeur: "3",
    hauteur: "2.5",
    ouvertures: "1.5",
    rendement: "10",
    couches: "2",
    pot: "2.5",
    nbMurs: "4",
    surfaceType: "0",
  });
  const { result, validationMessages, onCalc, onAdd } = useLegacyModuleCalculation({
    module: PeintureModule,
    inputs,
    canAddLine,
    pieceName,
    onAddLine,
    buildHistoryDraft: buildPeintureHistoryDraft,
  });

  return (
    <Card>
      <h2>Peinture</h2>
      <ValidationErrors messages={validationMessages} />
      <Field label="Longueur (m)">
        <NumericInput value={inputs.longueur} onChange={(value) => setInputs({ ...inputs, longueur: value })} />
      </Field>
      <Field label="Largeur (m)">
        <NumericInput value={inputs.largeur} onChange={(value) => setInputs({ ...inputs, largeur: value })} />
      </Field>
      <Field label="Hauteur (m)">
        <NumericInput value={inputs.hauteur} onChange={(value) => setInputs({ ...inputs, hauteur: value })} />
      </Field>
      <Field label="Ouvertures (m2)">
        <NumericInput value={inputs.ouvertures} onChange={(value) => setInputs({ ...inputs, ouvertures: value })} />
      </Field>
      <Field label="Rendement (m2/L)">
        <NumericInput value={inputs.rendement} onChange={(value) => setInputs({ ...inputs, rendement: value })} />
      </Field>
      <Field label="Couches">
        <NumericInput value={inputs.couches} onChange={(value) => setInputs({ ...inputs, couches: value })} />
      </Field>
      <Field label="Contenance pot (L)">
        <NumericInput value={inputs.pot} onChange={(value) => setInputs({ ...inputs, pot: value })} />
      </Field>
      <Field label="Nombre de murs (1-4)">
        <NumericInput value={inputs.nbMurs} onChange={(value) => setInputs({ ...inputs, nbMurs: value })} />
      </Field>
      <Field label="Surface a peindre">
        <div className="chip-row">
          <Chip label="Murs" active={inputs.surfaceType === "0"} onClick={() => setInputs({ ...inputs, surfaceType: "0" })} />
          <Chip label="Plafond" active={inputs.surfaceType === "1"} onClick={() => setInputs({ ...inputs, surfaceType: "1" })} />
          <Chip label="Murs + plafond" active={inputs.surfaceType === "2"} onClick={() => setInputs({ ...inputs, surfaceType: "2" })} />
        </div>
      </Field>
      <div className="row">
        <Button variant="primary" onClick={onCalc}>Calculer</Button>
        <Button onClick={onAdd}>Ajouter au chantier</Button>
      </div>
      {result && (
        <div className="result">
          <p>Surface murs : {result.surfaceMurs.toFixed(2)} m2</p>
          <p>Surface plafond : {result.surfacePlafond.toFixed(2)} m2</p>
          <p>Surface peinte : {result.surfacePeinte.toFixed(2)} m2</p>
          <p>Pots : {result.nbPots}</p>
          <p>Sous-couche : {result.sousCouchePots}</p>
        </div>
      )}
    </Card>
  );
};
