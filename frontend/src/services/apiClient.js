const AUTH_BASE_URL = "http://localhost:4000";
const SCHEDULER_BASE_URL = "http://localhost:8080";

function buildUrl(base, path) {
  if (!path.startsWith("/")) return `${base}/${path}`;
  return `${base}${path}`;
}

/**
 * Generic JSON request helper with credentials and 401 normalization.
 */
export async function apiRequest({
  base = "auth", // "auth" | "scheduler"
  path,
  method = "GET",
  headers = {},
  body,
}) {
  const baseUrl = base === "scheduler" ? SCHEDULER_BASE_URL : AUTH_BASE_URL;

  const res = await fetch(buildUrl(baseUrl, path), {
    method,
    credentials: "include",
    headers: {
      ...headers,
    },
    body,
  });

  const contentType = res.headers.get("content-type") || "";
  const isJson = contentType.includes("application/json");

  let data = null;
  if (isJson) {
    data = await res.json().catch(() => null);
  } else {
    data = await res.text().catch(() => null);
  }

  if (res.status === 401) {
    const error = new Error(data?.message || "Unauthorized");
    error.code = "UNAUTHORIZED";
    error.status = 401;
    error.payload = data;
    throw error;
  }

  if (!res.ok) {
    const error = new Error(data?.message || "Request failed");
    error.code = data?.code || "REQUEST_FAILED";
    error.status = res.status;
    error.payload = data;
    throw error;
  }

  return data;
}