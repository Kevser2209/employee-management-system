import { useEscapeKey } from "../../hooks/useEscapeKey";

function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmLabel,
  onConfirm,
  onCancel,
  isProcessing,
}) {
  useEscapeKey(isOpen, onCancel, isProcessing);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Onayı kapat"
        className="absolute inset-0 bg-slate-900/40"
        onClick={onCancel}
        disabled={isProcessing}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-dialog-title"
        className="relative z-10 w-full max-w-md rounded-xl border border-slate-200 bg-white p-6 shadow-lg"
      >
        <h3 id="confirm-dialog-title" className="text-lg font-semibold text-slate-900">
          {title}
        </h3>
        <p className="mt-3 text-sm leading-relaxed text-slate-600">{message}</p>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={isProcessing}
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            İptal
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isProcessing}
            className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
          >
            {isProcessing ? "İşleniyor..." : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmDialog;
