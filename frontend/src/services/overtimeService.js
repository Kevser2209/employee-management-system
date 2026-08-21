import apiClient from "../api/client";

export async function getOvertimes() {
  const response = await apiClient.get("/overtimes");
  return response.data;
}

export async function getOvertimeById(overtimeId) {
  const response = await apiClient.get(`/overtimes/${overtimeId}`);
  return response.data;
}

export async function createOvertime(overtimeData) {
  const response = await apiClient.post("/overtimes", overtimeData);
  return response.data;
}

export async function approveOvertime(overtimeId) {
  const response = await apiClient.patch(`/overtimes/${overtimeId}/approve`);
  return response.data;
}

export async function rejectOvertime(overtimeId) {
  const response = await apiClient.patch(`/overtimes/${overtimeId}/reject`);
  return response.data;
}
