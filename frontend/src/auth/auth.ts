export const ACCESS_TOKEN_STORAGE_KEY = "access_token";
export const REFRESH_TOKEN_STORAGE_KEY = "refresh_token";

export function isAuthenticated(): boolean {
  return Boolean(localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY));
}

export function clearAuthTokens() {
  localStorage.removeItem(ACCESS_TOKEN_STORAGE_KEY);
  localStorage.removeItem(REFRESH_TOKEN_STORAGE_KEY);
}

