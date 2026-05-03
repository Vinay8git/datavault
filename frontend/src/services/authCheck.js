const BACKEND_URL = "http://localhost:4000";

export async function checkAuth() {
  try {
    const res = await fetch(`${BACKEND_URL}/auth/me`, {
      credentials: "include",
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok || !data?.authenticated) {
      return { authenticated: false };
    }

    return {
      authenticated: true,
      user: data.user,
    };
  } catch (_err) {
    return { authenticated: false };
  }
}