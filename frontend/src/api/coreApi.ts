import { client } from "./client";

const API_URL = "/core";

export const coreApi = {
  seedForce() {
    return client.post(`${API_URL}/db/seed-force/`);
  },

  resetAndSeed() {
    return client.post(`${API_URL}/db/reset-and-seed/`);
  },
};

