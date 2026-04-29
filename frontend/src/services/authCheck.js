const BACKEND_URL = "http://localhost:4000";

export async function checkAuth() {
  try {
    const res = await fetch(`${BACKEND_URL}/auth/me`, {
      credentials: "include",
    });

    if (!res.ok) {
      return { authenticated: false };
    }

    const data = await res.json();
    return data;
  } catch (err) {
    return { authenticated: false };
  }
}