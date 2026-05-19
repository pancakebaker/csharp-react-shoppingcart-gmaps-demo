const API_BASE = (import.meta.env.VITE_API_BASE ?? "").replace(/\/$/, "");

function apiUrl(path) {
  return `${API_BASE}${path}`;
}

export async function fetchProducts() {
  const res = await fetch(apiUrl("/api/products"));
  if (!res.ok) throw new Error("Failed to fetch products");
  return res.json();
}

export async function createOrder(payload) {
  const res = await fetch(apiUrl("/api/orders"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  // try to parse error body for nicer messages
  let data = null;
  try { data = await res.json(); } catch { /* empty */ }

  if (!res.ok) {
    const msg = data?.message || "Failed to create order";
    throw new Error(msg);
  }

  return data;
}

export async function fetchOrder(orderId) {
  const res = await fetch(apiUrl(`/api/orders/${orderId}`));
  if (!res.ok) throw new Error("Order not found or failed to load.");
  return res.json();
}
