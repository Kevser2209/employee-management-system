import apiClient from "../api/client";

export async function login(credentials) {
  const response = await apiClient.post("/auth/login", credentials);
  return response.data;
}

export async function register(userData) {
  const response = await apiClient.post("/auth/register", userData);
  return response.data;
}

export async function getCurrentUser() {
  const response = await apiClient.get("/users/me");
  return response.data;
}
