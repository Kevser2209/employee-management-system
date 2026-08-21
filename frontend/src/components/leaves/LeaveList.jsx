import LeaveStatusBadge from "./LeaveStatusBadge";
import { formatLeaveDate, getLeaveTypeLabel } from "../../utils/leaveLabels";

function LeaveList({ leaves }) {
  return (
    <>
      <div className="hidden overflow-x-auto md:block">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                İzin Türü
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Başlangıç
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Bitiş
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Açıklama
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Durum
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 bg-white">
            {leaves.map((leave) => (
              <tr key={leave.id}>
                <td className="px-4 py-4 text-sm font-medium text-slate-900">
                  {getLeaveTypeLabel(leave.leave_type)}
                </td>
                <td className="px-4 py-4 text-sm text-slate-700">
                  {formatLeaveDate(leave.start_date)}
                </td>
                <td className="px-4 py-4 text-sm text-slate-700">
                  {formatLeaveDate(leave.end_date)}
                </td>
                <td className="px-4 py-4 text-sm text-slate-600">
                  {leave.reason || "-"}
                </td>
                <td className="px-4 py-4">
                  <LeaveStatusBadge status={leave.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="space-y-4 md:hidden">
        {leaves.map((leave) => (
          <article
            key={leave.id}
            className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-sm font-semibold text-slate-900">
                  {getLeaveTypeLabel(leave.leave_type)}
                </h3>
                <p className="mt-1 text-sm text-slate-600">
                  {formatLeaveDate(leave.start_date)} - {formatLeaveDate(leave.end_date)}
                </p>
              </div>
              <LeaveStatusBadge status={leave.status} />
            </div>
            <p className="mt-3 text-sm text-slate-600">
              <span className="font-medium text-slate-700">Açıklama:</span>{" "}
              {leave.reason || "-"}
            </p>
          </article>
        ))}
      </div>
    </>
  );
}

export default LeaveList;
