export const BASE = "https://v-card2.artimmo.dz";

export async function api(path, opts = {}) {
  const token = localStorage.getItem("vbc_token");
  const res = await fetch(`${BASE}${path}`, {
    ...opts,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(opts.headers || {}),
    },
  });
  if (res.status === 204) return null;
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Request failed");
  return data.data;
}

export async function publicApi(path) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Not found");
  return data.data;
}

// For public, unauthenticated POSTs (e.g. the ad-campaign lead capture form).
export async function publicPost(path, body) {
  const res = await fetch(`${BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) {
    const err = new Error(data.message || "Request failed");
    err.details = data.details;
    throw err;
  }
  return data.data;
}