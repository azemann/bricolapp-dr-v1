import { Link, useNavigate, useParams } from "react-router-dom";
import { Card, Chip } from "../components/ui";
import type { HistoryLine } from "../dr/drTotals";
import { useActiveContext, useStore, buildHistoryLine } from "../state/storeHooks";
import { BardageModuleCard } from "./modules/BardageModuleCard";
import { CarrelageModuleCard } from "./modules/CarrelageModuleCard";
import { ElectriciteModuleCard } from "./modules/ElectriciteModuleCard";
import { MODULES, type ModuleId } from "./modules/moduleList";
import { PeintureModuleCard } from "./modules/PeintureModuleCard";
import { PlacoModuleCard } from "./modules/PlacoModuleCard";
import { PlomberieModuleCard } from "./modules/PlomberieModuleCard";

export const ModulesPage = () => {
  const { moduleId } = useParams();
  const navigate = useNavigate();
  const activeModule = (moduleId as ModuleId) || "carrelage";
  const { chantier, piece } = useActiveContext();
  const { dispatch } = useStore();

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

  const moduleCardProps = {
    canAddLine: !warning,
    pieceName,
    onAddLine: addLine,
  };

  const moduleContent = (() => {
    switch (activeModule) {
      case "peinture":
        return <PeintureModuleCard {...moduleCardProps} />;
      case "placo":
        return <PlacoModuleCard {...moduleCardProps} />;
      case "bardage":
        return <BardageModuleCard {...moduleCardProps} />;
      case "plomberie":
        return <PlomberieModuleCard {...moduleCardProps} />;
      case "electricite":
        return <ElectriciteModuleCard {...moduleCardProps} />;
      case "carrelage":
      default:
        return <CarrelageModuleCard {...moduleCardProps} />;
    }
  })();

  return (
    <div className="page">
      <Card>
        <div className="row space-between">
          <div>
            <h2>Ouvrages DR</h2>
            <p className="muted">Selectionne un ouvrage puis ajoute la ligne dans la piece active.</p>
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
