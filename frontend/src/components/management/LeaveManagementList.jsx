import ApproveRejectActions from "./ApproveRejectActions";
import LeaveStatusBadge from "../leaves/LeaveStatusBadge";
import {
  formatLeaveDate,
  getLeaveTypeLabel,
} from "../../utils/leaveLabels";

function LeaveManagementList({
  leaves,
  onApprove,
  onReject,
  processingId,
  processingAction,
}) {
  return (
    <>
      <div className="hidden overflow-x-auto lg:block">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Çalışan
              </th>
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
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                İşlemler
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 bg-white">
            {leaves.map((leave) => (
              <tr key={leave.id}>
                <td className="px-4 py-4 text-sm text-slate-700">
                  <p className="font-medium text-slate-900">
                    {leave.employee.first_name} {leave.employee.last_name}
                  </p>
                  <p className="text-xs text-slate-500">{leave.employee.email}</p>
                </td>
                <td className="px-4 py-4 text-sm text-slate-700">
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
                <td className="px-4 py-4">
                  <ApproveRejectActions
                    itemId={leave.id}
                    status={leave.status}
                    onApprove={onApprove}
                    onReject={onReject}
                    processingId={processingId}
                    processingAction={processingAction}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="space-y-4 lg:hidden">
        {leaves.map((leave) => (
          <article
            key={leave.id}
            className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-sm font-semibold text-slate-900">
                  {leave.employee.first_name} {leave.employee.last_name}
                </h3>
                <p className="mt-1 text-xs text-slate-500">{leave.employee.email}</p>
                <p className="mt-2 text-sm text-slate-600">
                  {getLeaveTypeLabel(leave.leave_type)}
                </p>
                <p className="text-sm text-slate-600">
                  {formatLeaveDate(leave.start_date)} - {formatLeaveDate(leave.end_date)}
                </p>
              </div>
              <LeaveStatusBadge status={leave.status} />
            </div>
            <p className="mt-3 text-sm text-slate-600">
              <span className="font-medium text-slate-700">Açıklama:</span>{" "}
              {leave.reason || "-"}
            </p>
            <div className="mt-4">
              <ApproveRejectActions
                itemId={leave.id}
                status={leave.status}
                onApprove={onApprove}
                onReject={onReject}
                processingId={processingId}
                processingAction={processingAction}
              />
            </div>
          </article>
        ))}
      </div>
    </>
  );
}

export default LeaveManagementList;
