import { useState } from "react";

import { useEscapeKey } from "../../hooks/useEscapeKey";
import { LEAVE_TYPE_OPTIONS } from "../../utils/leaveLabels";

const initialFormData = {
  leave_type: "",
  start_date: "",
  end_date: "",
  reason: "",
};

function LeaveFormModal({ isOpen, onClose, onSubmit, isSubmitting, submitError }) {
  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});

  const handleClose = () => {
    if (isSubmitting) {
      return;
    }

    setFormData(initialFormData);
    setErrors({});
    onClose();
  };

  useEscapeKey(isOpen, handleClose, isSubmitting);

  if (!isOpen) {
    return null;
  }

  const validateForm = () => {
    const nextErrors = {};

    if (!formData.leave_type) {
      nextErrors.leave_type = "İzin türü seçilmelidir.";
    }

    if (!formData.start_date) {
      nextErrors.start_date = "Başlangıç tarihi zorunludur.";
    }

    if (!formData.end_date) {
      nextErrors.end_date = "Bitiş tarihi zorunludur.";
    }

    if (formData.start_date && formData.end_date && formData.end_date < formData.start_date) {
      nextErrors.end_date = "Bitiş tarihi başlangıç tarihinden önce olamaz.";
    }

    if (formData.reason.length > 500) {
      nextErrors.reason = "Açıklama en fazla 500 karakter olabilir.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (isSubmitting || !validateForm()) {
      return;
    }

    const payload = {
      leave_type: formData.leave_type,
      start_date: formData.start_date,
      end_date: formData.end_date,
      reason: formData.reason.trim() || null,
    };

    const success = await onSubmit(payload);

    if (success) {
      setFormData(initialFormData);
      setErrors({});
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Formu kapat"
        className="absolute inset-0 bg-slate-900/40"
        onClick={handleClose}
        disabled={isSubmitting}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="leave-form-title"
        className="relative z-10 max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl border border-slate-200 bg-white p-6 shadow-lg"
      >
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h3 id="leave-form-title" className="text-lg font-semibold text-slate-900">
              Yeni İzin Talebi
            </h3>
            <p className="mt-1 text-sm text-slate-600">
              Yeni izin talebinizi oluşturmak için formu doldurun.
            </p>
          </div>
          <button
            type="button"
            onClick={handleClose}
            disabled={isSubmitting}
            className="rounded-lg border border-slate-300 px-2 py-1 text-sm text-slate-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Kapat
          </button>
        </div>

        {submitError ? (
          <div
            className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
            role="alert"
          >
            {submitError}
          </div>
        ) : null}

        <form className="space-y-4" onSubmit={handleSubmit} noValidate>
          <div>
            <label htmlFor="leave_type" className="mb-1.5 block text-sm font-medium text-slate-700">
              İzin Türü
            </label>
            <select
              id="leave_type"
              name="leave_type"
              value={formData.leave_type}
              onChange={handleChange}
              disabled={isSubmitting}
              aria-invalid={Boolean(errors.leave_type)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200 disabled:bg-slate-50"
            >
              <option value="">Seçiniz</option>
              {LEAVE_TYPE_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {errors.leave_type ? (
              <p className="mt-1 text-sm text-red-600">{errors.leave_type}</p>
            ) : null}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="start_date" className="mb-1.5 block text-sm font-medium text-slate-700">
                Başlangıç Tarihi
              </label>
              <input
                id="start_date"
                name="start_date"
                type="date"
                value={formData.start_date}
                onChange={handleChange}
                disabled={isSubmitting}
                aria-invalid={Boolean(errors.start_date)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200 disabled:bg-slate-50"
              />
              {errors.start_date ? (
                <p className="mt-1 text-sm text-red-600">{errors.start_date}</p>
              ) : null}
            </div>

            <div>
              <label htmlFor="end_date" className="mb-1.5 block text-sm font-medium text-slate-700">
                Bitiş Tarihi
              </label>
              <input
                id="end_date"
                name="end_date"
                type="date"
                value={formData.end_date}
                onChange={handleChange}
                disabled={isSubmitting}
                aria-invalid={Boolean(errors.end_date)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200 disabled:bg-slate-50"
              />
              {errors.end_date ? (
                <p className="mt-1 text-sm text-red-600">{errors.end_date}</p>
              ) : null}
            </div>
          </div>

          <div>
            <label htmlFor="reason" className="mb-1.5 block text-sm font-medium text-slate-700">
              Açıklama <span className="font-normal text-slate-500">(isteğe bağlı)</span>
            </label>
            <textarea
              id="reason"
              name="reason"
              rows={4}
              value={formData.reason}
              onChange={handleChange}
              disabled={isSubmitting}
              maxLength={500}
              placeholder="İsteğe bağlı açıklama"
              aria-invalid={Boolean(errors.reason)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200 disabled:bg-slate-50"
            />
            {errors.reason ? (
              <p className="mt-1 text-sm text-red-600">{errors.reason}</p>
            ) : null}
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={handleClose}
              disabled={isSubmitting}
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              İptal
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
            >
              {isSubmitting ? "Kaydediliyor..." : "Talebi Oluştur"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default LeaveFormModal;
