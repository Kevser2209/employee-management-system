import { useCallback, useEffect, useState } from "react";

import OvertimeFormModal from "../components/overtimes/OvertimeFormModal";
import OvertimeList from "../components/overtimes/OvertimeList";
import {
  EmptyState,
  ErrorState,
  LoadingState,
  SuccessAlert,
} from "../components/common/PageFeedback";
import * as overtimeService from "../services/overtimeService";
import { getApiErrorMessage } from "../utils/apiError";

function OvertimesPage() {
  const [overtimes, setOvertimes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const fetchOvertimes = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const data = await overtimeService.getOvertimes();
      setOvertimes(data);
    } catch (err) {
      setError(getApiErrorMessage(err, "Fazla mesai kayıtları yüklenemedi."));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOvertimes();
  }, [fetchOvertimes]);

  const handleCreateOvertime = async (payload) => {
    setIsSubmitting(true);
    setSubmitError("");

    try {
      await overtimeService.createOvertime(payload);
      setIsFormOpen(false);
      setSuccessMessage("Fazla mesai talebiniz başarıyla oluşturuldu.");
      await fetchOvertimes();
      return true;
    } catch (err) {
      setSubmitError(getApiErrorMessage(err, "Fazla mesai talebi oluşturulamadı."));
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
            <h2 className="text-2xl font-semibold text-slate-900">Fazla Mesailerim</h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-600">
              Kendi fazla mesai kayıtlarınızı görüntüleyebilir ve yeni fazla mesai
              talebi oluşturabilirsiniz.
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
            Yeni Fazla Mesai Talebi
          </button>
        </div>
      </section>

      {successMessage ? <SuccessAlert message={successMessage} /> : null}

      <section className="rounded-xl border border-slate-200 bg-white shadow-sm">
        {loading ? <LoadingState message="Fazla mesai kayıtları yükleniyor..." /> : null}

        {!loading && error ? (
          <ErrorState message={error} onRetry={fetchOvertimes} />
        ) : null}

        {!loading && !error && overtimes.length === 0 ? (
          <EmptyState
            title="Henüz fazla mesai kaydınız bulunmuyor."
            description="Yeni bir fazla mesai talebi oluşturmak için yukarıdaki butonu kullanın."
          />
        ) : null}

        {!loading && !error && overtimes.length > 0 ? (
          <div className="p-4 sm:p-6">
            <OvertimeList overtimes={overtimes} />
          </div>
        ) : null}
      </section>

      <OvertimeFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleCreateOvertime}
        isSubmitting={isSubmitting}
        submitError={submitError}
      />
    </div>
  );
}

export default OvertimesPage;
