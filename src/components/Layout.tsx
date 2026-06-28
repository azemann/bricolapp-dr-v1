import { NavLink, Outlet } from "react-router-dom";
import { useActiveContext } from "../state/store";

const NavItem = ({ to, label }: { to: string; label: string }) => (
  <NavLink
    to={to}
    className={({ isActive }) => `nav-item ${isActive ? "nav-item-active" : ""}`.trim()}
  >
    {label}
  </NavLink>
);

export const Layout = () => {
  const { chantier, piece } = useActiveContext();

  return (
    <div className="app-shell">
      <header className="app-header">
        <div>
          <p className="app-kicker">DR BricoChantier</p>
          <h1 className="app-title">Pilotage chantier + calculs DR</h1>
        </div>
        <div className="active-badges">
          <div className="badge">
            <span>Chantier</span>
            <strong>{chantier ? chantier.name : "Aucun"}</strong>
          </div>
          <div className="badge badge-muted">
            <span>Piece</span>
            <strong>{piece ? piece.name : "Aucune"}</strong>
          </div>
        </div>
      </header>

      <main className="app-main">
        <Outlet />
      </main>

      <nav className="bottom-nav">
        <NavItem to="/" label="Chantiers" />
        <NavItem to="/modules/carrelage" label="Modules" />
        <NavItem to="/devis" label="Devis" />
      </nav>
    </div>
  );
};
