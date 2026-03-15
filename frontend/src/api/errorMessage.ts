import axios from "axios";

function stringifyValue(value: unknown): string {
  if (Array.isArray(value)) return value.map(stringifyValue).join(" ");
  if (typeof value === "string") return value;
  if (value == null) return "";
  return String(value);
}

export function getApiErrorMessage(err: unknown, fallback: string): string {
  if (!axios.isAxiosError(err)) {
    return err instanceof Error ? err.message : fallback;
  }

  const data = err.response?.data as unknown;
  if (!data) return fallback;

  if (typeof data === "string") return data;

  if (typeof data === "object" && data !== null) {
    const anyData = data as Record<string, unknown>;
    if (typeof anyData.detail === "string") return anyData.detail;

    const parts: string[] = [];
    for (const [key, value] of Object.entries(anyData)) {
      const msg = stringifyValue(value).trim();
      if (msg) parts.push(`${key}: ${msg}`);
    }
    if (parts.length) return parts.join("\n");
  }

  return fallback;
}

