import { useCallback, useEffect, useState } from "react";

import ConfirmDialog from "./ConfirmDialog";
import OvertimeManagementList from "./OvertimeManagementList";
import StatusFilter from "./StatusFilter";
import { ErrorState, LoadingState, SuccessAlert } from "../common/PageFeedback";
import * as managementService from "../../services/managementService";
import { getApiErrorMessage } from "../../utils/apiError";
import { OVERTIME_STATUS_FILTERS } from "../../utils/managementFilters";

function OvertimeManagementPanel() {
  const [overtimes, setOvertimes] = useState([]);
  const [statusFilter, setStatusFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [processingId, setProcessingId] = useState(null);
  const [processingAction, setProcessingAction] = useState(null);
  const [confirmState, setConfirmState] = useState(null);

  const fetchOvertimes = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const data = await managementService.getManagementOvertimes(statusFilter || undefined);
      setOvertimes(data);
    } catch (err) {
      setError(getApiErrorMessage(err, "Fazla mesai talepleri yüklenemedi."));
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => {
    fetchOvertimes();
  }, [fetchOvertimes]);

  const runConfirmedAction = async () => {
    if (!confirmState) {
      return;
    }

    const { id, action } = confirmState;
    setProcessingId(id);
    setProcessingAction(action);
    setSuccessMessage("");

    try {
      if (action === "approve") {
        await managementService.approveOvertime(id);
        setSuccessMessage("Fazla mesai talebi başarıyla onaylandı.");
      } else {
        await managementService.rejectOvertime(id);
        setSuccessMessage("Fazla mesai talebi başarıyla reddedildi.");
      }

      setConfirmState(null);
      await fetchOvertimes();
    } catch (err) {
      setError(getApiErrorMessage(err, "İşlem tamamlanamadı."));
      setConfirmState(null);
    } finally {
      setProcessingId(null);
      setProcessingAction(null);
    }
  };

  const requestApprove = (id) => {
    setConfirmState({
      id,
      action: "approve",
      title: "Fazla Mesai Talebini Onayla",
      message: "Bu fazla mesai talebini onaylamak istediğinize emin misiniz?",
      confirmLabel: "Onayla",
    });
  };

  const requestReject = (id) => {
    setConfirmState({
      id,
      action: "reject",
      title: "Fazla Mesai Talebini Reddet",
      message: "Bu fazla mesai talebini reddetmek istediğinize emin misiniz?",
      confirmLabel: "Reddet",
    });
  };

  return (
    <div className="space-y-4">
      <StatusFilter
        value={statusFilter}
        onChange={setStatusFilter}
        options={OVERTIME_STATUS_FILTERS}
      />

      {successMessage ? <SuccessAlert message={successMessage} /> : null}

      {loading ? <LoadingState message="Talepler yükleniyor..." /> : null}

      {!loading && error ? <ErrorState message={error} onRetry={fetchOvertimes} /> : null}

      {!loading && !error && overtimes.length === 0 ? (
        <p className="py-12 text-center text-sm text-slate-600" role="status">
          Gösterilecek talep bulunamadı.
        </p>
      ) : null}

      {!loading && !error && overtimes.length > 0 ? (
        <OvertimeManagementList
          overtimes={overtimes}
          onApprove={requestApprove}
          onReject={requestReject}
          processingId={processingId}
          processingAction={processingAction}
        />
      ) : null}

      <ConfirmDialog
        isOpen={Boolean(confirmState)}
        title={confirmState?.title || ""}
        message={confirmState?.message || ""}
        confirmLabel={confirmState?.confirmLabel || "Onayla"}
        onConfirm={runConfirmedAction}
        onCancel={() => {
          if (!processingId) {
            setConfirmState(null);
          }
        }}
        isProcessing={Boolean(processingId)}
      />
    </div>
  );
}

export default OvertimeManagementPanel;
