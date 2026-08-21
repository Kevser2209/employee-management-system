import { getLeaveStatusLabel, LEAVE_STATUS_STYLES } from "../../utils/leaveLabels";

function LeaveStatusBadge({ status }) {
  return (
    <span
      className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-medium ${
        LEAVE_STATUS_STYLES[status] || "bg-slate-100 text-slate-700 border-slate-200"
      }`}
    >
      {getLeaveStatusLabel(status)}
    </span>
  );
}

export default LeaveStatusBadge;
