const DEFAULT_BASE_URL = "http://localhost:8080";

export const BASE_URL = import.meta.env.VITE_API_BASE_URL || DEFAULT_BASE_URL;

export const buildUrl = (path) => {
  const normalizedPath = path?.startsWith("/") ? path : `/${path || ""}`;
  return `${BASE_URL}${normalizedPath}`;
};
