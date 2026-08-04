const API_BASE_URL =
  import.meta.env.VITE_API_URL || `http://${window.location.hostname}:8000`;

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.detail || `Erro na requisição (${response.status})`);
  }

  if (response.status === 204) return null;
  return response.json();
}

export const api = {
  // Transações
  listTransactions: (params = {}) => {
    const query = new URLSearchParams(
      Object.entries(params).filter(([, v]) => v !== undefined && v !== "")
    ).toString();
    return request(`/api/transactions${query ? `?${query}` : ""}`);
  },
  createTransaction: (data) =>
    request("/api/transactions", { method: "POST", body: JSON.stringify(data) }),
  updateTransaction: (id, data) =>
    request(`/api/transactions/${id}`, { method: "PATCH", body: JSON.stringify(data) }),
  deleteTransaction: (id) => request(`/api/transactions/${id}`, { method: "DELETE" }),

  // Metas
  listGoals: () => request("/api/goals"),
  createGoal: (data) => request("/api/goals", { method: "POST", body: JSON.stringify(data) }),
  updateGoal: (id, data) =>
    request(`/api/goals/${id}`, { method: "PATCH", body: JSON.stringify(data) }),
  contributeToGoal: (id, amount) =>
    request(`/api/goals/${id}/contribute`, { method: "POST", body: JSON.stringify({ amount }) }),
  deleteGoal: (id) => request(`/api/goals/${id}`, { method: "DELETE" }),

  // Dashboard
  getDashboardSummary: (params = {}) => {
    const query = new URLSearchParams(
      Object.entries(params).filter(([, v]) => v !== undefined && v !== "")
    ).toString();
    return request(`/api/dashboard/summary${query ? `?${query}` : ""}`);
  },
};
