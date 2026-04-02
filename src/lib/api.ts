/** Proxied as `/api/*` on Vercel → `identark-cloud.fly.dev/v1/*`; dev server mirrors via Vite proxy. */
export const API_BASE = "/api";

export function apiUrl(path: string) {
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${API_BASE}${p}`;
}

/** OAuth start URL with safe return origin. */
export function oauthStartUrl(provider: "github" | "google"): string {
  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const q = origin ? `?return_to=${encodeURIComponent(origin)}` : "";
  return `${apiUrl(`/auth/${provider}`)}${q}`;
}
