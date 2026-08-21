import apiClient from "../api/client";

import * as leaveService from "./leaveService";
import * as overtimeService from "./overtimeService";

export const approveLeave = leaveService.approveLeave;
export const rejectLeave = leaveService.rejectLeave;
export const approveOvertime = overtimeService.approveOvertime;
export const rejectOvertime = overtimeService.rejectOvertime;

export async function getManagementLeaves(status) {
  const params = status ? { status } : undefined;
  const response = await apiClient.get("/leaves/management", { params });
  return response.data;
}

export async function getManagementOvertimes(status) {
  const params = status ? { status } : undefined;
  const response = await apiClient.get("/overtimes/management", { params });
  return response.data;
}
