export const ROUTES = {

  CADASTROS: "/cadastros",

  SECRETARIAS: "/cadastros/secretarias",

  SECRETARIAS_NOVO: "/cadastros/secretarias/novo",

  SECRETARIAS_EDITAR: (id: number) =>
    `/cadastros/secretarias/editar/${id}`

};