import { Link } from "react-router-dom";
import { Button, Card, Field, TextInput } from "../components/ui";
import { useStore } from "../state/store";
import { useState } from "react";

export const Home = () => {
  const { state, dispatch } = useStore();
  const [name, setName] = useState("");

  const addChantier = () => {
    if (!name.trim()) return;
    dispatch({ type: "CHANTIER_ADD", payload: { name } });
    setName("");
  };

  return (
    <div className="page">
      <Card>
        <h2>Chantiers</h2>
        <p className="muted">Crée un chantier, puis ajoute des pieces et calcule tes besoins DR.</p>
        <Field label="Nom du chantier">
          <div className="row">
            <TextInput value={name} onChange={setName} placeholder="Ex: Maison Dupont" />
            <Button variant="primary" onClick={addChantier}>
              Ajouter
            </Button>
          </div>
        </Field>
      </Card>

      <div className="grid">
        {state.chantiers.length === 0 ? (
          <Card>
            <p className="muted">Aucun chantier pour le moment.</p>
          </Card>
        ) : (
          state.chantiers.map((chantier) => (
            <Card key={chantier.id} className="card-row">
              <div>
                <h3>{chantier.name}</h3>
                <p className="muted">{chantier.pieces.length} piece(s)</p>
              </div>
              <div className="row">
                <Button
                  onClick={() => dispatch({ type: "CHANTIER_SET_ACTIVE", payload: { chantierId: chantier.id } })}
                >
                  Activer
                </Button>
                <Link className="btn btn-default" to={`/chantier/${chantier.id}`}>
                  Ouvrir
                </Link>
                <Button
                  variant="danger"
                  onClick={() => dispatch({ type: "CHANTIER_REMOVE", payload: { chantierId: chantier.id } })}
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
