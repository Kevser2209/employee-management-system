import { getOvertimeStatusLabel, OVERTIME_STATUS_STYLES } from "../../utils/overtimeLabels";

function OvertimeStatusBadge({ status }) {
  return (
    <span
      className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-medium ${
        OVERTIME_STATUS_STYLES[status] || "bg-slate-100 text-slate-700 border-slate-200"
      }`}
    >
      {getOvertimeStatusLabel(status)}
    </span>
  );
}

export default OvertimeStatusBadge;
