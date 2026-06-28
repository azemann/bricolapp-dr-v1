import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Button, Card, Chip, Field, NumericInput } from "../components/ui";
import {
  BardageModule,
  CarrelageModule,
  PeintureModule,
  PlacoModule,
  PlomberieModule,
  validateNumericParams,
} from "../dr/drCore";
import type {
  BardageParams,
  CarrelageParams,
  PeintureParams,
  PlacoParams,
  PlomberieParams,
} from "../dr/drEngine";
import type { HistoryLine } from "../dr/drTotals";
import { useActiveContext, useStore, buildHistoryLine } from "../state/store";

const MODULES = [
  { id: "carrelage", label: "Carrelage" },
  { id: "peinture", label: "Peinture" },
  { id: "placo", label: "Placo" },
  { id: "bardage", label: "Bardage" },
  { id: "plomberie", label: "Plomberie" },
] as const;

type ModuleId = (typeof MODULES)[number]["id"];

export const ModulesPage = () => {
  const { moduleId } = useParams();
  const navigate = useNavigate();
  const activeModule = (moduleId as ModuleId) || "carrelage";
  const { chantier, piece } = useActiveContext();
  const { dispatch } = useStore();
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const handleValidation = (validation: { ok: boolean; errors: { message: string }[] }) => {
    if (!validation.ok) {
      setValidationErrors(validation.errors.map((error) => error.message));
      return false;
    }

    setValidationErrors([]);
    return true;
  };

  const renderValidationErrors = () =>
    validationErrors.length > 0 ? (
      <div className="warning">
        <p>Erreur(s) de validation :</p>
        <ul>
          {validationErrors.map((message) => (
            <li key={message}>{message}</li>
          ))}
        </ul>
      </div>
    ) : null;

  const [carInputs, setCarInputs] = useState({
    longueur: "4",
    largeur: "3",
    carreauA: "0.60",
    carreauB: "0.60",
    pertesPct: "10",
    m2Carton: "1.2",
  });
  const [carResult, setCarResult] = useState<ReturnType<typeof CarrelageModule.compute> | null>(null);

  const [peinInputs, setPeinInputs] = useState({
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
  const [peinResult, setPeinResult] = useState<ReturnType<typeof PeintureModule.compute> | null>(null);

  const [plaInputs, setPlaInputs] = useState({
    longueur: "4",
    hauteur: "2.5",
    entraxe: "0.60",
    longPlaque: "1.2",
    hautPlaque: "2.5",
    doublePeau: "0",
  });
  const [plaResult, setPlaResult] = useState<ReturnType<typeof PlacoModule.compute> | null>(null);

  const [barInputs, setBarInputs] = useState({
    largeur: "6",
    hauteur: "2.8",
    largeurUtile: "0.18",
    longueurLame: "3",
    pertesPct: "10",
  });
  const [barResult, setBarResult] = useState<ReturnType<typeof BardageModule.compute> | null>(null);

  const [plInputs, setPlInputs] = useState({
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
  const [plResult, setPlResult] = useState<ReturnType<typeof PlomberieModule.compute> | null>(null);

  useEffect(() => {
    setValidationErrors([]);
  }, [activeModule]);

  const warning = !chantier || !piece;

  const pieceName = piece ? `${piece.name} (${piece.level})` : "";

  const addLine = (texte: string, data: HistoryLine["data"]) => {
    if (!chantier || !piece) return;
    dispatch({
      type: "HISTORY_ADD",
      payload: {
        line: buildHistoryLine(chantier.id, piece.id, texte, data),
      },
    });
  };

  const renderCarrelage = () => {
    const onCalc = () => {
      const validation = validateNumericParams(CarrelageModule.inputSpec, carInputs);
      if (!handleValidation(validation)) return;
      setCarResult(CarrelageModule.compute(validation.values as CarrelageParams));
    };
    const onAdd = () => {
      const validation = validateNumericParams(CarrelageModule.inputSpec, carInputs);
      if (!handleValidation(validation) || !chantier || !piece) return;
      const result = CarrelageModule.compute(validation.values as CarrelageParams);
      const texte = CarrelageModule.toHistoryText
        ? CarrelageModule.toHistoryText(validation.values as CarrelageParams, result, { pieceName })
        : `Carrelage - ${pieceName}`;
      addLine(texte, {
        type: "carrelage",
        values: {
          surface: result.surface,
          nbCartons: result.nbCartons,
          colleSacs: result.colleSacs,
          jointsKg: result.jointsKg,
        },
      });
      setCarResult(result);
    };

    return (
      <Card>
        <h2>Carrelage</h2>
        {renderValidationErrors()}
        <Field label="Longueur piece (m)">
          <NumericInput value={carInputs.longueur} onChange={(value) => setCarInputs({ ...carInputs, longueur: value })} />
        </Field>
        <Field label="Largeur piece (m)">
          <NumericInput value={carInputs.largeur} onChange={(value) => setCarInputs({ ...carInputs, largeur: value })} />
        </Field>
        <Field label="Carreau A (m)">
          <NumericInput value={carInputs.carreauA} onChange={(value) => setCarInputs({ ...carInputs, carreauA: value })} />
        </Field>
        <Field label="Carreau B (m)">
          <NumericInput value={carInputs.carreauB} onChange={(value) => setCarInputs({ ...carInputs, carreauB: value })} />
        </Field>
        <Field label="Pertes (%)">
          <NumericInput value={carInputs.pertesPct} onChange={(value) => setCarInputs({ ...carInputs, pertesPct: value })} />
        </Field>
        <Field label="m2 par carton">
          <NumericInput value={carInputs.m2Carton} onChange={(value) => setCarInputs({ ...carInputs, m2Carton: value })} />
        </Field>
        <div className="row">
          <Button variant="primary" onClick={onCalc}>Calculer</Button>
          <Button onClick={onAdd} variant="default">Ajouter au chantier</Button>
        </div>
        {carResult && (
          <div className="result">
            <p>Surface : {carResult.surface.toFixed(2)} m2</p>
            <p>Cartons : {carResult.nbCartons}</p>
            <p>Colle : {carResult.colleSacs} sac(s)</p>
          </div>
        )}
      </Card>
    );
  };

  const renderPeinture = () => {
    const onCalc = () => {
    const validation = validateNumericParams(PeintureModule.inputSpec, peinInputs);
    if (!handleValidation(validation)) return;
    setPeinResult(PeintureModule.compute(validation.values as PeintureParams));
  };
    const onAdd = () => {
      const validation = validateNumericParams(PeintureModule.inputSpec, peinInputs);
      if (!handleValidation(validation) || !chantier || !piece) return;
      const result = PeintureModule.compute(validation.values as PeintureParams);
      const texte = PeintureModule.toHistoryText
        ? PeintureModule.toHistoryText(validation.values as PeintureParams, result, { pieceName })
        : `Peinture - ${pieceName}`;
      addLine(texte, {
        type: "peinture",
        values: {
          surfacePeinte: result.surfacePeinte,
          nbPots: result.nbPots,
          sousCouchePots: result.sousCouchePots,
        },
      });
      setPeinResult(result);
    };

    return (
      <Card>
        <h2>Peinture</h2>
        {renderValidationErrors()}
        <Field label="Longueur (m)">
          <NumericInput value={peinInputs.longueur} onChange={(value) => setPeinInputs({ ...peinInputs, longueur: value })} />
        </Field>
        <Field label="Largeur (m)">
          <NumericInput value={peinInputs.largeur} onChange={(value) => setPeinInputs({ ...peinInputs, largeur: value })} />
        </Field>
        <Field label="Hauteur (m)">
          <NumericInput value={peinInputs.hauteur} onChange={(value) => setPeinInputs({ ...peinInputs, hauteur: value })} />
        </Field>
        <Field label="Ouvertures (m2)">
          <NumericInput value={peinInputs.ouvertures} onChange={(value) => setPeinInputs({ ...peinInputs, ouvertures: value })} />
        </Field>
        <Field label="Rendement (m2/L)">
          <NumericInput value={peinInputs.rendement} onChange={(value) => setPeinInputs({ ...peinInputs, rendement: value })} />
        </Field>
        <Field label="Couches">
          <NumericInput value={peinInputs.couches} onChange={(value) => setPeinInputs({ ...peinInputs, couches: value })} />
        </Field>
        <Field label="Contenance pot (L)">
          <NumericInput value={peinInputs.pot} onChange={(value) => setPeinInputs({ ...peinInputs, pot: value })} />
        </Field>
        <Field label="Nombre de murs (1-4)">
          <NumericInput value={peinInputs.nbMurs} onChange={(value) => setPeinInputs({ ...peinInputs, nbMurs: value })} />
        </Field>
        <Field label="Surface a peindre">
          <div className="chip-row">
            <Chip
              label="Murs"
              active={peinInputs.surfaceType === "0"}
              onClick={() => setPeinInputs({ ...peinInputs, surfaceType: "0" })}
            />
            <Chip
              label="Plafond"
              active={peinInputs.surfaceType === "1"}
              onClick={() => setPeinInputs({ ...peinInputs, surfaceType: "1" })}
            />
            <Chip
              label="Murs + plafond"
              active={peinInputs.surfaceType === "2"}
              onClick={() => setPeinInputs({ ...peinInputs, surfaceType: "2" })}
            />
          </div>
        </Field>
        <div className="row">
          <Button variant="primary" onClick={onCalc}>Calculer</Button>
          <Button onClick={onAdd}>Ajouter au chantier</Button>
        </div>
        {peinResult && (
          <div className="result">
            <p>Surface murs : {peinResult.surfaceMurs.toFixed(2)} m2</p>
            <p>Surface plafond : {peinResult.surfacePlafond.toFixed(2)} m2</p>
            <p>Surface peinte : {peinResult.surfacePeinte.toFixed(2)} m2</p>
            <p>Pots : {peinResult.nbPots}</p>
            <p>Sous-couche : {peinResult.sousCouchePots}</p>
          </div>
        )}
      </Card>
    );
  };

  const renderPlaco = () => {
    const onCalc = () => {
      const validation = validateNumericParams(PlacoModule.inputSpec, plaInputs);
      if (!handleValidation(validation)) return;
      setPlaResult(PlacoModule.compute(validation.values as PlacoParams));
    };
    const onAdd = () => {
      const validation = validateNumericParams(PlacoModule.inputSpec, plaInputs);
      if (!handleValidation(validation) || !chantier || !piece) return;
      const result = PlacoModule.compute(validation.values as PlacoParams);
      const texte = PlacoModule.toHistoryText
        ? PlacoModule.toHistoryText(validation.values as PlacoParams, result, { pieceName })
        : `Placo - ${pieceName}`;
      addLine(texte, {
        type: "placo",
        values: {
          surface: result.surface,
          nbPlaques: result.nbPlaques,
          nbMontants: result.nbMontants,
          rails: result.rails,
          visBoites: result.visBoites,
          bandesSacs: result.bandesSacs,
        },
      });
      setPlaResult(result);
    };

    return (
      <Card>
        <h2>Placo</h2>
        {renderValidationErrors()}
        <Field label="Longueur (m)">
          <NumericInput value={plaInputs.longueur} onChange={(value) => setPlaInputs({ ...plaInputs, longueur: value })} />
        </Field>
        <Field label="Hauteur (m)">
          <NumericInput value={plaInputs.hauteur} onChange={(value) => setPlaInputs({ ...plaInputs, hauteur: value })} />
        </Field>
        <Field label="Entraxe (m)">
          <NumericInput value={plaInputs.entraxe} onChange={(value) => setPlaInputs({ ...plaInputs, entraxe: value })} />
        </Field>
        <Field label="Longueur plaque (m)">
          <NumericInput value={plaInputs.longPlaque} onChange={(value) => setPlaInputs({ ...plaInputs, longPlaque: value })} />
        </Field>
        <Field label="Hauteur plaque (m)">
          <NumericInput value={plaInputs.hautPlaque} onChange={(value) => setPlaInputs({ ...plaInputs, hautPlaque: value })} />
        </Field>
        <Field label="Double peau (0/1)">
          <NumericInput value={plaInputs.doublePeau} onChange={(value) => setPlaInputs({ ...plaInputs, doublePeau: value })} />
        </Field>
        <div className="row">
          <Button variant="primary" onClick={onCalc}>Calculer</Button>
          <Button onClick={onAdd}>Ajouter au chantier</Button>
        </div>
        {plaResult && (
          <div className="result">
            <p>Surface : {plaResult.surface.toFixed(2)} m2</p>
            <p>Plaques : {plaResult.nbPlaques}</p>
            <p>Montants : {plaResult.nbMontants}</p>
          </div>
        )}
      </Card>
    );
  };

  const renderBardage = () => {
    const onCalc = () => {
      const validation = validateNumericParams(BardageModule.inputSpec, barInputs);
      if (!handleValidation(validation)) return;
      setBarResult(BardageModule.compute(validation.values as BardageParams));
    };
    const onAdd = () => {
      const validation = validateNumericParams(BardageModule.inputSpec, barInputs);
      if (!handleValidation(validation) || !chantier || !piece) return;
      const result = BardageModule.compute(validation.values as BardageParams);
      const texte = BardageModule.toHistoryText
        ? BardageModule.toHistoryText(validation.values as BardageParams, result, { pieceName })
        : `Bardage - ${pieceName}`;
      addLine(texte, {
        type: "bardage",
        values: {
          surface: result.surface,
          nbLames: result.nbLames,
          liteauxMl: result.liteauxMl,
        },
      });
      setBarResult(result);
    };

    return (
      <Card>
        <h2>Bardage</h2>
        {renderValidationErrors()}
        <Field label="Largeur facade (m)">
          <NumericInput value={barInputs.largeur} onChange={(value) => setBarInputs({ ...barInputs, largeur: value })} />
        </Field>
        <Field label="Hauteur facade (m)">
          <NumericInput value={barInputs.hauteur} onChange={(value) => setBarInputs({ ...barInputs, hauteur: value })} />
        </Field>
        <Field label="Largeur utile (m)">
          <NumericInput value={barInputs.largeurUtile} onChange={(value) => setBarInputs({ ...barInputs, largeurUtile: value })} />
        </Field>
        <Field label="Longueur lame (m)">
          <NumericInput value={barInputs.longueurLame} onChange={(value) => setBarInputs({ ...barInputs, longueurLame: value })} />
        </Field>
        <Field label="Pertes (%)">
          <NumericInput value={barInputs.pertesPct} onChange={(value) => setBarInputs({ ...barInputs, pertesPct: value })} />
        </Field>
        <div className="row">
          <Button variant="primary" onClick={onCalc}>Calculer</Button>
          <Button onClick={onAdd}>Ajouter au chantier</Button>
        </div>
        {barResult && (
          <div className="result">
            <p>Surface : {barResult.surface.toFixed(2)} m2</p>
            <p>Lames : {barResult.nbLames}</p>
            <p>Liteaux : {barResult.liteauxMl.toFixed(1)} m</p>
          </div>
        )}
      </Card>
    );
  };

  const renderPlomberie = () => {
    const onCalc = () => {
      const validation = validateNumericParams(PlomberieModule.inputSpec, plInputs);
      if (!handleValidation(validation)) return;
      setPlResult(PlomberieModule.compute(validation.values as PlomberieParams));
    };
    const onAdd = () => {
      const validation = validateNumericParams(PlomberieModule.inputSpec, plInputs);
      if (!handleValidation(validation) || !chantier || !piece) return;
      const result = PlomberieModule.compute(validation.values as PlomberieParams);
      const texte = PlomberieModule.toHistoryText
        ? PlomberieModule.toHistoryText(validation.values as PlomberieParams, result, { pieceName })
        : `Plomberie - ${pieceName}`;
      addLine(texte, {
        type: "plomberie",
        values: {
          alimMl: result.alimMl,
          evacMl: result.evacMl,
          robinets: result.robinets,
          siphons: result.siphons,
        },
      });
      setPlResult(result);
    };

    return (
      <Card>
        <h2>Plomberie</h2>
        {renderValidationErrors()}
        <Field label="Lavabos">
          <NumericInput value={plInputs.nbLavabos} onChange={(value) => setPlInputs({ ...plInputs, nbLavabos: value })} />
        </Field>
        <Field label="Douches">
          <NumericInput value={plInputs.nbDouches} onChange={(value) => setPlInputs({ ...plInputs, nbDouches: value })} />
        </Field>
        <Field label="WC">
          <NumericInput value={plInputs.nbWC} onChange={(value) => setPlInputs({ ...plInputs, nbWC: value })} />
        </Field>
        <Field label="Eviers">
          <NumericInput value={plInputs.nbEviers} onChange={(value) => setPlInputs({ ...plInputs, nbEviers: value })} />
        </Field>
        <Field label="Lave-linge">
          <NumericInput value={plInputs.nbLL} onChange={(value) => setPlInputs({ ...plInputs, nbLL: value })} />
        </Field>
        <Field label="Lave-vaisselle">
          <NumericInput value={plInputs.nbLV} onChange={(value) => setPlInputs({ ...plInputs, nbLV: value })} />
        </Field>
        <Field label="Points exterieurs">
          <NumericInput value={plInputs.nbExt} onChange={(value) => setPlInputs({ ...plInputs, nbExt: value })} />
        </Field>
        <Field label="Longueur alim moyenne (m)">
          <NumericInput value={plInputs.longAlimMoy} onChange={(value) => setPlInputs({ ...plInputs, longAlimMoy: value })} />
        </Field>
        <Field label="Longueur evac moyenne (m)">
          <NumericInput value={plInputs.longEvacMoy} onChange={(value) => setPlInputs({ ...plInputs, longEvacMoy: value })} />
        </Field>
        <Field label="Marge (%)">
          <NumericInput value={plInputs.margePct} onChange={(value) => setPlInputs({ ...plInputs, margePct: value })} />
        </Field>
        <div className="row">
          <Button variant="primary" onClick={onCalc}>Calculer</Button>
          <Button onClick={onAdd}>Ajouter au chantier</Button>
        </div>
        {plResult && (
          <div className="result">
            <p>Alim : {plResult.alimMl.toFixed(1)} m</p>
            <p>Evac : {plResult.evacMl.toFixed(1)} m</p>
            <p>Robinets : {plResult.robinets}</p>
          </div>
        )}
      </Card>
    );
  };

  let moduleContent = renderCarrelage();
  if (activeModule === "peinture") moduleContent = renderPeinture();
  if (activeModule === "placo") moduleContent = renderPlaco();
  if (activeModule === "bardage") moduleContent = renderBardage();
  if (activeModule === "plomberie") moduleContent = renderPlomberie();

  return (
    <div className="page">
      <Card>
        <div className="row space-between">
          <div>
            <h2>Modules DR</h2>
            <p className="muted">Selectionne un module puis ajoute la ligne dans la piece active.</p>
          </div>
          {warning ? (
            <Link className="btn btn-default" to="/">
              Choisir un chantier
            </Link>
          ) : null}
        </div>
        <div className="segmented">
          {MODULES.map((item) => (
            <Chip
              key={item.id}
              label={item.label}
              active={activeModule === item.id}
              onClick={() => navigate(`/modules/${item.id}`)}
            />
          ))}
        </div>
        {warning ? (
          <p className="warning">Selectionne un chantier et une piece pour ajouter des lignes.</p>
        ) : null}
      </Card>

      {moduleContent}
    </div>
  );
};
