import { useCallback, useEffect, useState } from "react";

import LeaveFormModal from "../components/leaves/LeaveFormModal";
import LeaveList from "../components/leaves/LeaveList";
import {
  EmptyState,
  ErrorState,
  LoadingState,
  SuccessAlert,
} from "../components/common/PageFeedback";
import * as leaveService from "../services/leaveService";
import { getApiErrorMessage } from "../utils/apiError";

function LeavesPage() {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const fetchLeaves = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const data = await leaveService.getLeaves();
      setLeaves(data);
    } catch (err) {
      setError(getApiErrorMessage(err, "İzin talepleri yüklenemedi."));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLeaves();
  }, [fetchLeaves]);

  const handleCreateLeave = async (payload) => {
    setIsSubmitting(true);
    setSubmitError("");

    try {
      await leaveService.createLeave(payload);
      setIsFormOpen(false);
      setSuccessMessage("İzin talebiniz başarıyla oluşturuldu.");
      await fetchLeaves();
      return true;
    } catch (err) {
      setSubmitError(getApiErrorMessage(err, "İzin talebi oluşturulamadı."));
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-slate-900">İzinlerim</h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-600">
              Kendi izin taleplerinizi görüntüleyebilir ve yeni izin talebi
              oluşturabilirsiniz.
            </p>
          </div>

          <button
            type="button"
            disabled={isSubmitting}
            onClick={() => {
              setSubmitError("");
              setSuccessMessage("");
              setIsFormOpen(true);
            }}
            className="inline-flex items-center justify-center rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
          >
            Yeni İzin Talebi
          </button>
        </div>
      </section>

      {successMessage ? <SuccessAlert message={successMessage} /> : null}

      <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
        {loading ? <LoadingState message="İzin talepleri yükleniyor..." /> : null}

        {!loading && error ? (
          <ErrorState message={error} onRetry={fetchLeaves} />
        ) : null}

        {!loading && !error && leaves.length === 0 ? (
          <EmptyState
            title="Henüz izin talebiniz bulunmuyor."
            description="Yeni bir izin talebi oluşturmak için yukarıdaki butonu kullanın."
          />
        ) : null}

        {!loading && !error && leaves.length > 0 ? (
          <div className="p-4 sm:p-6">
            <LeaveList leaves={leaves} />
          </div>
        ) : null}
      </section>

      <LeaveFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleCreateLeave}
        isSubmitting={isSubmitting}
        submitError={submitError}
      />
    </div>
  );
}

export default LeavesPage;
