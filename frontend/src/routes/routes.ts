export const ROUTES = {

  CADASTROS: "/cadastros",

  // -----------------------
  // /CADASTROS/SECRETARIAS
  // -----------------------
  
  SECRETARIAS: "/cadastros/secretarias",
  
  SECRETARIA_CREATE: "/cadastros/secretarias/criar",
  
  SECRETARIA_EDIT: (id: number) =>
    `/cadastros/secretarias/editar/${id}`,
  
  // -----------------------
  // /CADASTROS/ROTAS
  // -----------------------
  
  ROTAS: "/cadastros/rotas",

  ROTA_CREATE: "/cadastros/rotas/criar",

  ROTA_EDIT: (id: number) =>
    `/cadastros/rotas/editar/${id}`,
  
  // -----------------------
  // /CADASTROS/INSTITUICOES
  // -----------------------
  
  INSTITUICOES: "/cadastros/instituicoes",

  INSTITUICAO_CREATE: "/cadastros/instituicoes/criar",

  INSTITUICAO_EDIT: (id: number) =>
    `/cadastros/instituicoes/editar/${id}`,

  // -----------------------
  // /FROTA/CONDUTORES
  // -----------------------
  
  CONDUTORES: "/frota/condutores",

  CONDUTOR_CREATE: "/frota/condutores/criar",

  CONDUTOR_EDIT: (id: number) =>
    `/frota/condutores/editar/${id}`,

  // -----------------------
  // /FROTA/VEICULOS
  // -----------------------
  
  VEICULOS: "/frota/veiculos",

  VEICULO_CREATE: "/frota/veiculos/criar",

  VEICULO_EDIT: (id: number) =>
    `/frota/veiculos/editar/${id}`,

};