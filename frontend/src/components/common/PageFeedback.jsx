export function LoadingState({ message }) {
  return (
    <div className="px-6 py-12 text-center text-sm text-slate-600" role="status">
      {message}
    </div>
  );
}

export function ErrorState({ message, onRetry, retryLabel = "Tekrar Dene" }) {
  return (
    <div className="space-y-4 px-6 py-8">
      <div
        className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        role="alert"
      >
        {message}
      </div>
      {onRetry ? (
        <button
          type="button"
          onClick={onRetry}
          className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          {retryLabel}
        </button>
      ) : null}
    </div>
  );
}

export function EmptyState({ title, description }) {
  return (
    <div className="px-6 py-12 text-center">
      <p className="text-sm font-medium text-slate-900">{title}</p>
      {description ? (
        <p className="mt-2 text-sm text-slate-600">{description}</p>
      ) : null}
    </div>
  );
}

export function SuccessAlert({ message }) {
  return (
    <div
      className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800"
      role="status"
    >
      {message}
    </div>
  );
}
