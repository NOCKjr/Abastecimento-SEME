export const ROUTES = {

  CADASTROS: "/cadastros",

  SECRETARIAS: "/cadastros/secretarias",

  SECRETARIA_CREATE: "/cadastros/secretarias/criar",

  SECRETARIA_EDIT: (id: number) =>
    `/cadastros/secretarias/editar/${id}`

};