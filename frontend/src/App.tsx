import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./layouts/Layout";
import Home from "./pages/Home";

import SecretariaFormPage from "./pages/cadastros/secretaria/SecretariaFormPage";
import SecretariaListPage from "./pages/cadastros/secretaria/SecretariaListPage";
import RotaListPage from "./pages/cadastros/rota/RotaListPage";
import RotaFormPage from "./pages/cadastros/rota/RotaFormPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>

          <Route index element={<Home />}/>
          
          <Route path="abastecimento/">
          </Route>
          
          <Route path="cadastros/">
            <Route
              path="secretarias"
              element={<SecretariaListPage />}
            />
            <Route
              path="secretarias/criar"
              element={<SecretariaFormPage />}
            />
            <Route
              path="secretarias/editar/:id"
              element={<SecretariaFormPage />}
            />

            <Route
              path="rotas"
              element={<RotaListPage />}
            />
            <Route
              path="rotas/criar"
              element={<RotaFormPage />}
            />
            <Route
              path="rotas/editar/:id"
              element={<RotaFormPage />}
            />


          </Route>
          
          <Route path="frota/">
          </Route>

          <Route path="usuarios/">
          </Route>

        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;