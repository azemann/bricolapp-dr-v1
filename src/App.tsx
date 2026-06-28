import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Layout } from "./components/Layout";
import { Home } from "./routes/Home";
import { ChantierPage } from "./routes/Chantier";
import { PiecePage } from "./routes/Piece";
import { ModulesPage } from "./routes/Modules";
import { DevisPage } from "./routes/Devis";

const App = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="chantier/:chantierId" element={<ChantierPage />} />
        <Route path="piece/:pieceId" element={<PiecePage />} />
        <Route path="modules">
          <Route index element={<Navigate to="/modules/carrelage" replace />} />
          <Route path=":moduleId" element={<ModulesPage />} />
        </Route>
        <Route path="devis" element={<DevisPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  </BrowserRouter>
);

export default App;
