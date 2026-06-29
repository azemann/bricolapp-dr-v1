import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { Card } from "../components/ui";
import { useStore } from "../state/storeHooks";

export const PiecePage = () => {
  const { pieceId } = useParams();
  const { state, dispatch } = useStore();

  const pieceContext = (() => {
    for (const chantier of state.chantiers) {
      const piece = chantier.pieces.find((p) => p.id === pieceId);
      if (piece) return { chantier, piece };
    }
    return null;
  })();

  const chantierId = pieceContext?.chantier.id;
  const activePieceId = pieceContext?.piece.id;

  useEffect(() => {
    if (chantierId && activePieceId) {
      dispatch({ type: "CHANTIER_SET_ACTIVE", payload: { chantierId } });
      dispatch({ type: "PIECE_SET_ACTIVE", payload: { pieceId: activePieceId } });
    }
  }, [dispatch, chantierId, activePieceId]);

  if (!pieceContext) {
    return (
      <Card>
        <h2>Piece introuvable</h2>
        <Link className="btn btn-default" to="/">
          Retour
        </Link>
      </Card>
    );
  }

  const { chantier, piece } = pieceContext;
  const history = state.history.filter((h) => h.pieceId === piece.id);

  return (
    <div className="page">
      <Card>
        <p className="muted">Chantier {chantier.name}</p>
        <h2>{piece.name}</h2>
        <p className="muted">
          {piece.type} · {piece.level}
        </p>
        <div className="row">
          <Link className="btn btn-default" to={`/chantier/${chantier.id}`}>
            Retour chantier
          </Link>
          <Link className="btn btn-primary" to="/modules/carrelage">
            Ajouter un poste
          </Link>
        </div>
      </Card>

      <Card>
        <h3>Historique DR</h3>
        {history.length === 0 ? (
          <p className="muted">Aucune ligne pour cette piece.</p>
        ) : (
          <ul className="history">
            {history.map((line) => (
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
    </div>
  );
};
