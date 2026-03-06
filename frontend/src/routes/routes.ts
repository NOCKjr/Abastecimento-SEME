export const ROUTES = {

  CADASTROS: "/cadastros",

  // -----------------------
  // CADASTROS/SECRETARIAS
  // -----------------------
  
  SECRETARIAS: "/cadastros/secretarias",
  
  SECRETARIA_CREATE: "/cadastros/secretarias/criar",
  
  SECRETARIA_EDIT: (id: number) =>
    `/cadastros/secretarias/editar/${id}`,
  
  // -----------------------
  // CADASTROS/ROTAS
  // -----------------------
  
  ROTAS: "/cadastros/rotas",

  ROTA_CREATE: "/cadastros/rotas/criar",

  ROTA_EDIT: (id: number) =>
    `/cadastros/rotas/editar/${id}`,

};