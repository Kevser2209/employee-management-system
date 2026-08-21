import { useState } from "react";

import { useEscapeKey } from "../../hooks/useEscapeKey";

const initialFormData = {
  date: "",
  hours: "",
  description: "",
};

function OvertimeFormModal({ isOpen, onClose, onSubmit, isSubmitting, submitError }) {
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
    const hoursValue = Number(formData.hours);

    if (!formData.date) {
      nextErrors.date = "Tarih zorunludur.";
    }

    if (!formData.hours) {
      nextErrors.hours = "Saat değeri zorunludur.";
    } else if (Number.isNaN(hoursValue) || hoursValue <= 0) {
      nextErrors.hours = "Saat değeri 0'dan büyük olmalıdır.";
    } else if (hoursValue > 24) {
      nextErrors.hours = "Saat değeri en fazla 24 olabilir.";
    }

    if (formData.description.length > 500) {
      nextErrors.description = "Açıklama en fazla 500 karakter olabilir.";
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
      date: formData.date,
      hours: Number(formData.hours),
      description: formData.description.trim() || null,
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
        aria-labelledby="overtime-form-title"
        className="relative z-10 max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl border border-slate-200 bg-white p-6 shadow-lg"
      >
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h3 id="overtime-form-title" className="text-lg font-semibold text-slate-900">
              Yeni Fazla Mesai Talebi
            </h3>
            <p className="mt-1 text-sm text-slate-600">
              Yeni fazla mesai kaydınızı oluşturmak için formu doldurun.
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
            <label htmlFor="date" className="mb-1.5 block text-sm font-medium text-slate-700">
              Tarih
            </label>
            <input
              id="date"
              name="date"
              type="date"
              value={formData.date}
              onChange={handleChange}
              disabled={isSubmitting}
              aria-invalid={Boolean(errors.date)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200 disabled:bg-slate-50"
            />
            {errors.date ? (
              <p className="mt-1 text-sm text-red-600">{errors.date}</p>
            ) : null}
          </div>

          <div>
            <label htmlFor="hours" className="mb-1.5 block text-sm font-medium text-slate-700">
              Saat
            </label>
            <input
              id="hours"
              name="hours"
              type="number"
              min="0.01"
              max="24"
              step="0.5"
              value={formData.hours}
              onChange={handleChange}
              disabled={isSubmitting}
              placeholder="Örn. 2.5"
              aria-invalid={Boolean(errors.hours)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200 disabled:bg-slate-50"
            />
            {errors.hours ? (
              <p className="mt-1 text-sm text-red-600">{errors.hours}</p>
            ) : null}
          </div>

          <div>
            <label
              htmlFor="description"
              className="mb-1.5 block text-sm font-medium text-slate-700"
            >
              Açıklama <span className="font-normal text-slate-500">(isteğe bağlı)</span>
            </label>
            <textarea
              id="description"
              name="description"
              rows={4}
              value={formData.description}
              onChange={handleChange}
              disabled={isSubmitting}
              maxLength={500}
              placeholder="İsteğe bağlı açıklama"
              aria-invalid={Boolean(errors.description)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200 disabled:bg-slate-50"
            />
            {errors.description ? (
              <p className="mt-1 text-sm text-red-600">{errors.description}</p>
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

export default OvertimeFormModal;
