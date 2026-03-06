import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./layouts/Layout";
import Home from "./pages/Home";

import SecretariaFormPage from "./pages/cadastros/secretaria/SecretariaFormPage";
import SecretariaListPage from "./pages/cadastros/secretaria/SecretariaListPage";
import RotaListPage from "./pages/cadastros/rota/RotaListPage";
import RotaFormPage from "./pages/cadastros/rota/RotaFormPage";
import InstituicaoListPage from "./pages/cadastros/instituicao/InstituicaoListPage";
import InstituicaoFormPage from "./pages/cadastros/instituicao/InstituicaoFormPage";
import CondutorListPage from "./pages/frota/condutor/CondutorListPage";
import CondutorFormPage from "./pages/frota/condutor/CondutorFormPage";
import VeiculoListPage from "./pages/frota/veiculo/VeiculoListPage";
import VeiculoFormPage from "./pages/frota/veiculo/VeiculoFormPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>

          <Route index element={<Home />} />

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

            <Route
              path="instituicoes"
              element={<InstituicaoListPage />}
            />
            <Route
              path="instituicoes/criar"
              element={<InstituicaoFormPage />}
            />
            <Route
              path="instituicoes/editar/:id"
              element={<InstituicaoFormPage />}
            />
          </Route>

          <Route path="frota/">
            <Route
              path="condutores"
              element={<CondutorListPage />}
            />
            <Route
              path="condutores/criar"
              element={<CondutorFormPage />}
            />
            <Route
              path="condutores/editar/:id"
              element={<CondutorFormPage />}
            />

            <Route
              path="veiculos"
              element={<VeiculoListPage />}
            />
            <Route
              path="veiculos/criar"
              element={<VeiculoFormPage />}
            />
            <Route
              path="veiculos/editar/:id"
              element={<VeiculoFormPage />}
            />

          </Route>

          <Route path="usuarios/">
          </Route>

        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;