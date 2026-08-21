import { useCallback, useEffect, useState } from "react";

import * as leaveService from "../services/leaveService";
import * as managementService from "../services/managementService";
import * as overtimeService from "../services/overtimeService";
import { getApiErrorMessage } from "../utils/apiError";

const EMPTY_ERRORS = {
  leaves: "",
  overtimes: "",
  pendingManagementLeaves: "",
  pendingManagementOvertimes: "",
};

export function useDashboardData(hasManagementAccess) {
  const [leaves, setLeaves] = useState([]);
  const [overtimes, setOvertimes] = useState([]);
  const [pendingManagementLeaves, setPendingManagementLeaves] = useState([]);
  const [pendingManagementOvertimes, setPendingManagementOvertimes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState(EMPTY_ERRORS);

  const fetchLeaves = useCallback(async () => {
    try {
      const data = await leaveService.getLeaves();
      setLeaves(data);
      setErrors((prev) => ({ ...prev, leaves: "" }));
      return data;
    } catch (err) {
      setErrors((prev) => ({
        ...prev,
        leaves: getApiErrorMessage(err, "İzin verileri yüklenemedi."),
      }));
      return null;
    }
  }, []);

  const fetchOvertimes = useCallback(async () => {
    try {
      const data = await overtimeService.getOvertimes();
      setOvertimes(data);
      setErrors((prev) => ({ ...prev, overtimes: "" }));
      return data;
    } catch (err) {
      setErrors((prev) => ({
        ...prev,
        overtimes: getApiErrorMessage(err, "Fazla mesai verileri yüklenemedi."),
      }));
      return null;
    }
  }, []);

  const fetchPendingManagementLeaves = useCallback(async () => {
    if (!hasManagementAccess) {
      setPendingManagementLeaves([]);
      return [];
    }

    try {
      const data = await managementService.getManagementLeaves("pending");
      setPendingManagementLeaves(data);
      setErrors((prev) => ({ ...prev, pendingManagementLeaves: "" }));
      return data;
    } catch (err) {
      setErrors((prev) => ({
        ...prev,
        pendingManagementLeaves: getApiErrorMessage(
          err,
          "Bekleyen izin talepleri yüklenemedi.",
        ),
      }));
      return null;
    }
  }, [hasManagementAccess]);

  const fetchPendingManagementOvertimes = useCallback(async () => {
    if (!hasManagementAccess) {
      setPendingManagementOvertimes([]);
      return [];
    }

    try {
      const data = await managementService.getManagementOvertimes("pending");
      setPendingManagementOvertimes(data);
      setErrors((prev) => ({ ...prev, pendingManagementOvertimes: "" }));
      return data;
    } catch (err) {
      setErrors((prev) => ({
        ...prev,
        pendingManagementOvertimes: getApiErrorMessage(
          err,
          "Bekleyen fazla mesai talepleri yüklenemedi.",
        ),
      }));
      return null;
    }
  }, [hasManagementAccess]);

  const fetchAll = useCallback(async () => {
    setLoading(true);

    await Promise.all([
      fetchLeaves(),
      fetchOvertimes(),
      fetchPendingManagementLeaves(),
      fetchPendingManagementOvertimes(),
    ]);

    setLoading(false);
  }, [
    fetchLeaves,
    fetchOvertimes,
    fetchPendingManagementLeaves,
    fetchPendingManagementOvertimes,
  ]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  return {
    leaves,
    overtimes,
    pendingManagementLeaves,
    pendingManagementOvertimes,
    loading,
    errors,
    refetch: fetchAll,
    refetchLeaves: fetchLeaves,
    refetchOvertimes: fetchOvertimes,
    refetchPendingManagementLeaves: fetchPendingManagementLeaves,
    refetchPendingManagementOvertimes: fetchPendingManagementOvertimes,
  };
}
