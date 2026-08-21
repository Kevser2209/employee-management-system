import { useCallback, useEffect, useState } from "react";

import ConfirmDialog from "./ConfirmDialog";
import LeaveManagementList from "./LeaveManagementList";
import StatusFilter from "./StatusFilter";
import { ErrorState, LoadingState, SuccessAlert } from "../common/PageFeedback";
import * as managementService from "../../services/managementService";
import { getApiErrorMessage } from "../../utils/apiError";

function LeaveManagementPanel() {
  const [leaves, setLeaves] = useState([]);
  const [statusFilter, setStatusFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [processingId, setProcessingId] = useState(null);
  const [processingAction, setProcessingAction] = useState(null);
  const [confirmState, setConfirmState] = useState(null);

  const fetchLeaves = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const data = await managementService.getManagementLeaves(statusFilter || undefined);
      setLeaves(data);
    } catch (err) {
      setError(getApiErrorMessage(err, "İzin talepleri yüklenemedi."));
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => {
    fetchLeaves();
  }, [fetchLeaves]);

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
        await managementService.approveLeave(id);
        setSuccessMessage("İzin talebi başarıyla onaylandı.");
      } else {
        await managementService.rejectLeave(id);
        setSuccessMessage("İzin talebi başarıyla reddedildi.");
      }

      setConfirmState(null);
      await fetchLeaves();
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
      title: "İzin Talebini Onayla",
      message: "Bu izin talebini onaylamak istediğinize emin misiniz?",
      confirmLabel: "Onayla",
    });
  };

  const requestReject = (id) => {
    setConfirmState({
      id,
      action: "reject",
      title: "İzin Talebini Reddet",
      message: "Bu izin talebini reddetmek istediğinize emin misiniz?",
      confirmLabel: "Reddet",
    });
  };

  return (
    <div className="space-y-4">
      <StatusFilter value={statusFilter} onChange={setStatusFilter} />

      {successMessage ? <SuccessAlert message={successMessage} /> : null}

      {loading ? <LoadingState message="Talepler yükleniyor..." /> : null}

      {!loading && error ? <ErrorState message={error} onRetry={fetchLeaves} /> : null}

      {!loading && !error && leaves.length === 0 ? (
        <p className="py-12 text-center text-sm text-slate-600" role="status">
          Gösterilecek talep bulunamadı.
        </p>
      ) : null}

      {!loading && !error && leaves.length > 0 ? (
        <LeaveManagementList
          leaves={leaves}
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

export default LeaveManagementPanel;
