import { useState } from "react";
import { Button, Card, Field, NumericInput } from "../../components/ui";
import { buildElectriciteInstallationCompleteHistoryDraft } from "../../domain/history/electriciteHistory";
import { computeElectriciteOuvrage } from "../../domain/trades/electricite/engine";
import { installationElectriqueCompleteOuvrage } from "../../domain/trades/electricite/ouvrages/installationElectriqueComplete";
import { defaultElectricitePricing } from "../../domain/trades/electricite/pricing";
import {
  defaultElectriciteFormInputs,
  parseElectriciteInputs,
} from "./electriciteInputs";
import type { HistoryLine } from "../../dr/drTotals";

type ElectriciteModuleCardProps = {
  canAddLine: boolean;
  pieceName: string;
  onAddLine: (texte: string, data: HistoryLine["data"]) => void;
};

export const ElectriciteModuleCard = ({
  canAddLine,
  pieceName,
  onAddLine,
}: ElectriciteModuleCardProps) => {
  const [inputs, setInputs] = useState(defaultElectriciteFormInputs);
  const [result, setResult] = useState<ReturnType<typeof computeElectriciteOuvrage> | null>(null);

  const compute = () =>
    computeElectriciteOuvrage(
      installationElectriqueCompleteOuvrage,
      parseElectriciteInputs(inputs),
      defaultElectricitePricing,
    );

  const onCalc = () => {
    setResult(compute());
  };

  const onAdd = () => {
    if (!canAddLine) return;
    const parsedInputs = parseElectriciteInputs(inputs);
    const computedResult = computeElectriciteOuvrage(
      installationElectriqueCompleteOuvrage,
      parsedInputs,
      defaultElectricitePricing,
    );
    const draft = buildElectriciteInstallationCompleteHistoryDraft(parsedInputs, { pieceName });
    onAddLine(draft.texte, draft.data);
    setResult(computedResult);
  };

  return (
    <Card>
      <h2>Électricité</h2>
      <p className="muted">Installation électrique complète, calculée par le nouveau moteur ouvrage.</p>
      <Field label="Surface logement (m2)">
        <NumericInput
          value={inputs.surfaceLogementM2}
          onChange={(value) => setInputs({ ...inputs, surfaceLogementM2: value })}
        />
      </Field>
      <Field label="Nombre de pièces">
        <NumericInput
          value={inputs.nombrePieces}
          onChange={(value) => setInputs({ ...inputs, nombrePieces: value })}
        />
      </Field>
      <Field label="Prises">
        <NumericInput
          value={inputs.nombrePrises}
          onChange={(value) => setInputs({ ...inputs, nombrePrises: value })}
        />
      </Field>
      <Field label="Points lumineux">
        <NumericInput
          value={inputs.nombrePointsLumineux}
          onChange={(value) => setInputs({ ...inputs, nombrePointsLumineux: value })}
        />
      </Field>
      <Field label="Circuits spécialisés">
        <NumericInput
          value={inputs.nombreCircuitsSpecialises}
          onChange={(value) => setInputs({ ...inputs, nombreCircuitsSpecialises: value })}
        />
      </Field>
      <Field label="Longueur moyenne circuit (m)">
        <NumericInput
          value={inputs.longueurMoyenneCircuitMl}
          onChange={(value) => setInputs({ ...inputs, longueurMoyenneCircuitMl: value })}
        />
      </Field>
      <div className="row">
        <Button variant="primary" onClick={onCalc}>Calculer</Button>
        <Button onClick={onAdd}>Ajouter au chantier</Button>
      </div>
      {result && (
        <div className="result">
          <p>Matériaux : {result.needs.length} postes</p>
          <p>Temps : {result.labor.hours.toFixed(1)} h</p>
          <p>Vente HT : {result.profitability.salePriceHT.toFixed(2)} €</p>
          <p>Marge : {result.profitability.marginAmount.toFixed(2)} €</p>
        </div>
      )}
    </Card>
  );
};
