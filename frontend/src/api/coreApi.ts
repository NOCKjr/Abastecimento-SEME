import { client } from "./client";

const API_URL = "/core";

export const coreApi = {
  stats() {
    return client.get(`${API_URL}/db/stats/`);
  },

  seedForce() {
    return client.post(`${API_URL}/db/seed-force/`);
  },

  flushOnly() {
    return client.post(`${API_URL}/db/flush/`);
  },

  resetAndSeed() {
    return client.post(`${API_URL}/db/reset-and-seed/`);
  },

  backupDumpdata() {
    return client.get(`${API_URL}/db/backup/dumpdata/`, { responseType: "blob" });
  },

  backupSqlite() {
    return client.get(`${API_URL}/db/backup/sqlite/`, { responseType: "blob" });
  },
};
