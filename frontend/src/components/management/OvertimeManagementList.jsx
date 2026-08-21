import ApproveRejectActions from "./ApproveRejectActions";
import OvertimeStatusBadge from "../overtimes/OvertimeStatusBadge";
import {
  formatOvertimeDate,
  formatOvertimeHours,
} from "../../utils/overtimeLabels";

function OvertimeManagementList({
  overtimes,
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
                Tarih
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                Saat
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
            {overtimes.map((overtime) => (
              <tr key={overtime.id}>
                <td className="px-4 py-4 text-sm text-slate-700">
                  <p className="font-medium text-slate-900">
                    {overtime.employee.first_name} {overtime.employee.last_name}
                  </p>
                  <p className="text-xs text-slate-500">{overtime.employee.email}</p>
                </td>
                <td className="px-4 py-4 text-sm text-slate-700">
                  {formatOvertimeDate(overtime.date)}
                </td>
                <td className="px-4 py-4 text-sm text-slate-700">
                  {formatOvertimeHours(overtime.hours)}
                </td>
                <td className="px-4 py-4 text-sm text-slate-600">
                  {overtime.description || "-"}
                </td>
                <td className="px-4 py-4">
                  <OvertimeStatusBadge status={overtime.status} />
                </td>
                <td className="px-4 py-4">
                  <ApproveRejectActions
                    itemId={overtime.id}
                    status={overtime.status}
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
        {overtimes.map((overtime) => (
          <article
            key={overtime.id}
            className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-sm font-semibold text-slate-900">
                  {overtime.employee.first_name} {overtime.employee.last_name}
                </h3>
                <p className="mt-1 text-xs text-slate-500">{overtime.employee.email}</p>
                <p className="mt-2 text-sm text-slate-600">
                  {formatOvertimeDate(overtime.date)} · {formatOvertimeHours(overtime.hours)}
                </p>
              </div>
              <OvertimeStatusBadge status={overtime.status} />
            </div>
            <p className="mt-3 text-sm text-slate-600">
              <span className="font-medium text-slate-700">Açıklama:</span>{" "}
              {overtime.description || "-"}
            </p>
            <div className="mt-4">
              <ApproveRejectActions
                itemId={overtime.id}
                status={overtime.status}
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

export default OvertimeManagementList;
