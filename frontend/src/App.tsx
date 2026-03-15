import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
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
import LotacaoListPage from "./pages/frota/LotacaoListPage";
import LotacaoFormPage from "./pages/frota/LotacaoFormPage";
import UsuarioListPage from "./pages/usuarios/UsuarioListPage";
import UsuarioFormPage from "./pages/usuarios/UsuarioFormPage";
import GuiaAbastecimentoListPage from "./pages/abastecimento/guias/GuiaAbastecimentoListPage";
import GuiaAbastecimentoFormPage from "./pages/abastecimento/guias/GuiaAbastecimentoFormPage";
import { LoginPage } from "./pages/login/LoginPage";
import { RegisterPage } from "./pages/login/RegisterPage";
import { PrivateRoute } from "./components/PrivateRoute";
import { isAuthenticated } from "./auth/auth";
import { RequirePermission } from "./components/RequirePermission";
import UsuariosPermissoesPage from "./pages/usuarios/UsuariosPermissoesPage";
import PerfilPage from "./pages/perfil/PerfilPage";
import PerfilEditPage from "./pages/perfil/PerfilEditPage";
import DatabaseDangerPage from "./pages/sistema/DatabaseDangerPage";

function FallbackRedirect() {
  return isAuthenticated() ? (
    <Navigate to="/home" replace />
  ) : (
    <Navigate to="/login" replace />
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route element={<PrivateRoute />}>
          <Route path="/" element={<Layout />}>
            <Route index element={<Navigate to="home" replace />} />

            <Route path="home" element={<Home />} />

            <Route path="perfil" element={<PerfilPage />} />
            <Route path="perfil/editar" element={<PerfilEditPage />} />

            <Route
              path="sistema/banco"
              element={
                <RequirePermission allow={(me) => Boolean(me.is_superuser)}>
                  <DatabaseDangerPage />
                </RequirePermission>
              }
            />

            <Route path="abastecimento">
              <Route
                path="guias"
                element={<GuiaAbastecimentoListPage />}
              />
              <Route
                path="guias/criar"
                element={
                  <RequirePermission
                    allow={(me) => Boolean(me.is_staff || me.can_create_guia_abastecimento)}
                  >
                    <GuiaAbastecimentoFormPage />
                  </RequirePermission>
                }
              />
              <Route
                path="guias/editar/:id"
                element={
                  <RequirePermission
                    allow={(me) => Boolean(me.is_staff || me.can_edit_guia_abastecimento)}
                  >
                    <GuiaAbastecimentoFormPage />
                  </RequirePermission>
                }
              />
            </Route>

            <Route path="cadastros">
            <Route
              path="secretarias"
              element={<SecretariaListPage />}
            />
              <Route
                path="secretarias/criar"
                element={
                  <RequirePermission
                    allow={(me) => Boolean(me.is_staff || me.can_write_cadastros)}
                  >
                    <SecretariaFormPage />
                  </RequirePermission>
                }
              />
              <Route
                path="secretarias/editar/:id"
                element={
                  <RequirePermission
                    allow={(me) => Boolean(me.is_staff || me.can_write_cadastros)}
                  >
                    <SecretariaFormPage />
                  </RequirePermission>
                }
              />

            <Route
              path="rotas"
              element={<RotaListPage />}
            />
              <Route
                path="rotas/criar"
                element={
                  <RequirePermission
                    allow={(me) => Boolean(me.is_staff || me.can_write_cadastros)}
                  >
                    <RotaFormPage />
                  </RequirePermission>
                }
              />
              <Route
                path="rotas/editar/:id"
                element={
                  <RequirePermission
                    allow={(me) => Boolean(me.is_staff || me.can_write_cadastros)}
                  >
                    <RotaFormPage />
                  </RequirePermission>
                }
              />

            <Route
              path="instituicoes"
              element={<InstituicaoListPage />}
            />
              <Route
                path="instituicoes/criar"
                element={
                  <RequirePermission
                    allow={(me) => Boolean(me.is_staff || me.can_write_cadastros)}
                  >
                    <InstituicaoFormPage />
                  </RequirePermission>
                }
              />
              <Route
                path="instituicoes/editar/:id"
                element={
                  <RequirePermission
                    allow={(me) => Boolean(me.is_staff || me.can_write_cadastros)}
                  >
                    <InstituicaoFormPage />
                  </RequirePermission>
                }
              />
            </Route>

            <Route path="frota">
            <Route
              path="condutores"
              element={<CondutorListPage />}
            />
              <Route
                path="condutores/criar"
                element={
                  <RequirePermission
                    allow={(me) => Boolean(me.is_staff || me.can_write_frota)}
                  >
                    <CondutorFormPage />
                  </RequirePermission>
                }
              />
              <Route
                path="condutores/editar/:id"
                element={
                  <RequirePermission
                    allow={(me) => Boolean(me.is_staff || me.can_write_frota)}
                  >
                    <CondutorFormPage />
                  </RequirePermission>
                }
              />

            <Route
              path="veiculos"
              element={<VeiculoListPage />}
            />
              <Route
                path="veiculos/criar"
                element={
                  <RequirePermission
                    allow={(me) => Boolean(me.is_staff || me.can_write_frota)}
                  >
                    <VeiculoFormPage />
                  </RequirePermission>
                }
              />
              <Route
                path="veiculos/editar/:id"
                element={
                  <RequirePermission
                    allow={(me) => Boolean(me.is_staff || me.can_write_frota)}
                  >
                    <VeiculoFormPage />
                  </RequirePermission>
                }
              />

              <Route path="lotacoes" element={<LotacaoListPage />} />
              <Route
                path="lotacoes/criar"
                element={
                  <RequirePermission
                    allow={(me) => Boolean(me.is_staff || me.can_write_frota)}
                  >
                    <LotacaoFormPage />
                  </RequirePermission>
                }
              />
              <Route
                path="lotacoes/editar/:id"
                element={
                  <RequirePermission
                    allow={(me) => Boolean(me.is_staff || me.can_write_frota)}
                  >
                    <LotacaoFormPage />
                  </RequirePermission>
                }
              />

            </Route>

            <Route path="usuarios">
            <Route
              index
              element={
                <RequirePermission allow={(me) => Boolean(me.is_staff)}>
                  <UsuarioListPage />
                </RequirePermission>
              }
            />
            <Route
              path="criar"
              element={
                <RequirePermission allow={(me) => Boolean(me.is_staff)}>
                  <UsuarioFormPage />
                </RequirePermission>
              }
            />
            <Route
              path="editar/:id"
              element={
                <RequirePermission allow={(me) => Boolean(me.is_staff)}>
                  <UsuarioFormPage />
                </RequirePermission>
              }
            />
            <Route
              path="permissoes"
              element={
                <RequirePermission allow={(me) => Boolean(me.is_staff)}>
                  <UsuariosPermissoesPage />
                </RequirePermission>
              }
            />
            </Route>

          </Route>
        </Route>

        <Route path="*" element={<FallbackRedirect />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
