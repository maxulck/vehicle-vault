const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

export async function request(path, options = {}) {
  const token = localStorage.getItem("vehicle_vault_token");
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers
    }
  });

  if (response.status === 204) return null;

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Request failed");
  }

  return data;
}

export const api = {
  register: (payload) =>
    request("/auth/register", {
      method: "POST",
      body: JSON.stringify(payload)
    }),
  login: (payload) =>
    request("/auth/login", {
      method: "POST",
      body: JSON.stringify(payload)
    }),
  me: () => request("/auth/me"),
  listVehicles: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/vehicles${query ? `?${query}` : ""}`);
  },
  createVehicle: (payload) =>
    request("/vehicles", {
      method: "POST",
      body: JSON.stringify(payload)
    }),
  updateVehicle: (id, payload) =>
    request(`/vehicles/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload)
    }),
  deleteVehicle: (id) =>
    request(`/vehicles/${id}`, {
      method: "DELETE"
    })
};
