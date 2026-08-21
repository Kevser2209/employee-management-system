import { Link } from "react-router-dom";

import LeaveStatusBadge from "../leaves/LeaveStatusBadge";
import { formatLeaveDate, getLeaveTypeLabel } from "../../utils/leaveLabels";

function DashboardRecentLeaves({
  leaves,
  loading,
  error,
  onRetry,
}) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-lg font-semibold text-slate-900">Son İzin Taleplerim</h3>
        <Link
          to="/leaves"
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

      {!loading && !error && leaves.length === 0 ? (
        <p className="mt-4 text-sm text-slate-500">Henüz izin talebiniz bulunmuyor.</p>
      ) : null}

      {!loading && !error && leaves.length > 0 ? (
        <ul className="mt-4 divide-y divide-slate-100">
          {leaves.map((leave) => (
            <li key={leave.id} className="flex items-center justify-between gap-3 py-3">
              <div className="min-w-0">
                <p className="text-sm font-medium text-slate-900">
                  {getLeaveTypeLabel(leave.leave_type)}
                </p>
                <p className="mt-0.5 text-xs text-slate-500">
                  {formatLeaveDate(leave.start_date)} – {formatLeaveDate(leave.end_date)}
                </p>
              </div>
              <LeaveStatusBadge status={leave.status} />
            </li>
          ))}
        </ul>
      ) : null}
    </section>
  );
}

export default DashboardRecentLeaves;
