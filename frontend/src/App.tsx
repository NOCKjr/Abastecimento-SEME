import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./layouts/Layout";
import Home from "./pages/Home";

import Abastecimentos from "./pages/Abastecimentos";
import NovoAbastecimento from "./pages/NovoAbastecimento";
import SecretariaPage from "./pages/cadastros/secretaria/SecretariaPage";
import NovaSecretariaPage from "./pages/cadastros/secretaria/NovaSecretariaPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="abastecimentos" element={<Abastecimentos />} />
          <Route path="/abastecimentos/novo" element={<NovoAbastecimento />} />
          <Route path="/cadastros/secretarias" element={<SecretariaPage />} />
          <Route path="/cadastros/secretarias/novo" element={<NovaSecretariaPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;