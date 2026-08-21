import { Link } from "react-router-dom";

import OvertimeStatusBadge from "../overtimes/OvertimeStatusBadge";
import { formatOvertimeDate, formatOvertimeHours } from "../../utils/overtimeLabels";

function DashboardRecentOvertimes({
  overtimes,
  loading,
  error,
  onRetry,
}) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-lg font-semibold text-slate-900">Son Fazla Mesailerim</h3>
        <Link
          to="/overtimes"
          className="text-sm font-medium text-slate-700 hover:text-slate-900 hover:underline"
        >
          Tümünü Gör
        </Link>
      </div>

      {loading ? (
        <p className="mt-4 text-sm text-slate-500">Yükleniyor...</p>
      ) : null}

      {!loading && error ? (
        <div className="mt-4 space-y-2">
          <p className="text-sm text-red-600">{error}</p>
          <button
            type="button"
            onClick={onRetry}
            className="text-sm font-medium text-slate-700 underline hover:text-slate-900"
          >
            Tekrar Dene
          </button>
        </div>
      ) : null}

      {!loading && !error && overtimes.length === 0 ? (
        <p className="mt-4 text-sm text-slate-500">Henüz fazla mesai kaydınız bulunmuyor.</p>
      ) : null}

      {!loading && !error && overtimes.length > 0 ? (
        <ul className="mt-4 divide-y divide-slate-100">
          {overtimes.map((overtime) => (
            <li key={overtime.id} className="flex items-center justify-between gap-3 py-3">
              <div className="min-w-0">
                <p className="text-sm font-medium text-slate-900">
                  {formatOvertimeDate(overtime.date)}
                </p>
                <p className="mt-0.5 text-xs text-slate-500">
                  {formatOvertimeHours(overtime.hours)}
                </p>
              </div>
              <OvertimeStatusBadge status={overtime.status} />
            </li>
          ))}
        </ul>
      ) : null}
    </section>
  );
}

export default DashboardRecentOvertimes;
