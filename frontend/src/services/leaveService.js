import apiClient from "../api/client";

export async function getLeaves() {
  const response = await apiClient.get("/leaves");
  return response.data;
}

export async function getLeaveById(leaveId) {
  const response = await apiClient.get(`/leaves/${leaveId}`);
  return response.data;
}

export async function createLeave(leaveData) {
  const response = await apiClient.post("/leaves", leaveData);
  return response.data;
}

export async function approveLeave(leaveId) {
  const response = await apiClient.patch(`/leaves/${leaveId}/approve`);
  return response.data;
}

export async function rejectLeave(leaveId) {
  const response = await apiClient.patch(`/leaves/${leaveId}/reject`);
  return response.data;
}
