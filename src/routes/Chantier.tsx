import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Button, Card, Chip, Field, TextInput } from "../components/ui";
import { computeTotalsForChantier, computeTotalsForPiece, computeTotalsGlobal } from "../dr/drTotals";
import { NIVEAUX, PIECE_TYPES } from "../state/types";
import { useStore } from "../state/storeHooks";

export const ChantierPage = () => {
  const { chantierId } = useParams();
  const { state, dispatch } = useStore();
  const chantier = useMemo(
    () => state.chantiers.find((c) => c.id === chantierId) || null,
    [state.chantiers, chantierId]
  );

  useEffect(() => {
    if (chantier) {
      dispatch({ type: "CHANTIER_SET_ACTIVE", payload: { chantierId: chantier.id } });
    }
  }, [chantier, dispatch]);

  const [name, setName] = useState("");
  const [type, setType] = useState(PIECE_TYPES[0].value);
  const [level, setLevel] = useState(NIVEAUX[0]);
  const [historyScope, setHistoryScope] = useState<"chantier" | "piece" | "global">("chantier");

  if (!chantier) {
    return (
      <Card>
        <h2>Chantier introuvable</h2>
        <Link className="btn btn-default" to="/">
          Retour
        </Link>
      </Card>
    );
  }

  const addPiece = () => {
    if (!name.trim()) return;
    dispatch({
      type: "PIECE_ADD",
      payload: {
        chantierId: chantier.id,
        piece: { name: name.trim(), type, level },
      },
    });
    setName("");
  };

  const activePiece = chantier.pieces.find((piece) => piece.id === state.activePieceId) || null;
  const historyGlobal = state.history;
  const historyChantier = state.history.filter((line) => line.chantierId === chantier.id);
  const historyPiece = activePiece
    ? state.history.filter((line) => line.pieceId === activePiece.id)
    : [];

  const totalsGlobal = computeTotalsGlobal(state.history);
  const totalsChantier = computeTotalsForChantier(state.history, chantier.id);
  const totalsPiece = activePiece ? computeTotalsForPiece(state.history, activePiece.id) : null;

  const scopedHistory =
    historyScope === "global" ? historyGlobal : historyScope === "piece" ? historyPiece : historyChantier;

  return (
    <div className="page">
      <Card>
        <div className="row space-between">
          <div>
            <p className="muted">Chantier</p>
            <h2>{chantier.name}</h2>
          </div>
          <Button
            onClick={() => dispatch({ type: "CHANTIER_SET_ACTIVE", payload: { chantierId: chantier.id } })}
          >
            Marquer actif
          </Button>
        </div>
      </Card>

      <Card>
        <h3>Totaux DR</h3>
        <div className="totals-grid">
          <div>
            <p className="muted">Global</p>
            <p>Carrelage {totalsGlobal.carrelage_m2.toFixed(2)} m2</p>
            <p>Peinture {totalsGlobal.peinture_m2.toFixed(2)} m2</p>
            <p>Placo {totalsGlobal.placo_m2.toFixed(2)} m2</p>
            <p>Bardage {totalsGlobal.bardage_m2.toFixed(2)} m2</p>
            <p>Plomberie {totalsGlobal.plomberie_alim_ml.toFixed(1)} m</p>
          </div>
          <div>
            <p className="muted">Chantier actif</p>
            <p>Carrelage {totalsChantier.carrelage_m2.toFixed(2)} m2</p>
            <p>Peinture {totalsChantier.peinture_m2.toFixed(2)} m2</p>
            <p>Placo {totalsChantier.placo_m2.toFixed(2)} m2</p>
            <p>Bardage {totalsChantier.bardage_m2.toFixed(2)} m2</p>
            <p>Plomberie {totalsChantier.plomberie_alim_ml.toFixed(1)} m</p>
          </div>
          <div>
            <p className="muted">Piece active</p>
            {totalsPiece ? (
              <>
                <p>Carrelage {totalsPiece.carrelage_m2.toFixed(2)} m2</p>
                <p>Peinture {totalsPiece.peinture_m2.toFixed(2)} m2</p>
                <p>Placo {totalsPiece.placo_m2.toFixed(2)} m2</p>
                <p>Bardage {totalsPiece.bardage_m2.toFixed(2)} m2</p>
                <p>Plomberie {totalsPiece.plomberie_alim_ml.toFixed(1)} m</p>
              </>
            ) : (
              <p className="muted">Aucune piece active</p>
            )}
          </div>
        </div>
      </Card>

      <Card>
        <h3>Historique DR</h3>
        <div className="chip-row">
          <Chip
            label="Chantier actif"
            active={historyScope === "chantier"}
            onClick={() => setHistoryScope("chantier")}
          />
          <Chip
            label="Piece active"
            active={historyScope === "piece"}
            onClick={() => setHistoryScope("piece")}
          />
          <Chip
            label="Global"
            active={historyScope === "global"}
            onClick={() => setHistoryScope("global")}
          />
        </div>
        {historyScope === "piece" && !activePiece ? (
          <p className="muted">Selectionne une piece pour afficher son historique.</p>
        ) : scopedHistory.length === 0 ? (
          <p className="muted">Aucune ligne DR pour cette selection.</p>
        ) : (
          <ul className="history-list">
            {scopedHistory.map((line) => (
              <li key={line.id} className="history-item">
                <span>{line.texte}</span>
                <button
                  className="history-delete"
                  onClick={() => dispatch({ type: "HISTORY_REMOVE", payload: { lineId: line.id } })}
                >
                  Supprimer
                </button>
              </li>
            ))}
          </ul>
        )}
      </Card>

      <Card>
        <h3>Ajouter une piece</h3>
        <Field label="Nom">
          <TextInput value={name} onChange={setName} placeholder="Ex: Salon" />
        </Field>
        <Field label="Type">
          <div className="chip-row">
            {PIECE_TYPES.map((item) => (
              <Chip
                key={item.value}
                label={item.label}
                active={item.value === type}
                onClick={() => setType(item.value)}
              />
            ))}
          </div>
        </Field>
        <Field label="Niveau">
          <div className="chip-row">
            {NIVEAUX.map((item) => (
              <Chip
                key={item}
                label={item}
                active={item === level}
                onClick={() => setLevel(item)}
              />
            ))}
          </div>
        </Field>
        <Button variant="primary" onClick={addPiece}>
          Ajouter la piece
        </Button>
      </Card>

      <div className="grid">
        {chantier.pieces.length === 0 ? (
          <Card>
            <p className="muted">Aucune piece pour ce chantier.</p>
          </Card>
        ) : (
          chantier.pieces.map((piece) => (
            <Card key={piece.id} className="card-row">
              <div>
                <h3>{piece.name}</h3>
                <p className="muted">
                  {piece.type} · {piece.level}
                </p>
              </div>
              <div className="row">
                <Button
                  onClick={() => dispatch({ type: "PIECE_SET_ACTIVE", payload: { pieceId: piece.id } })}
                >
                  Activer
                </Button>
                <Link className="btn btn-default" to={`/piece/${piece.id}`}>
                  Ouvrir
                </Link>
                <Button
                  variant="danger"
                  onClick={() =>
                    dispatch({
                      type: "PIECE_REMOVE",
                      payload: { chantierId: chantier.id, pieceId: piece.id },
                    })
                  }
                >
                  Supprimer
                </Button>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};
