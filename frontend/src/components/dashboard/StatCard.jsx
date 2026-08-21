function StatCard({ label, value, loading, error, onRetry }) {
  return (
    <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-sm font-medium text-slate-500">{label}</p>

      {loading ? (
        <p className="mt-2 text-2xl font-semibold text-slate-300">—</p>
      ) : null}

      {!loading && error ? (
        <div className="mt-2 space-y-2">
          <p className="text-xs text-red-600">{error}</p>
          {onRetry ? (
            <button
              type="button"
              onClick={onRetry}
              className="text-xs font-medium text-slate-700 underline hover:text-slate-900"
            >
              Tekrar Dene
            </button>
          ) : null}
        </div>
      ) : null}

      {!loading && !error ? (
        <p className="mt-2 text-2xl font-semibold text-slate-900">{value}</p>
      ) : null}
    </article>
  );
}

export default StatCard;
