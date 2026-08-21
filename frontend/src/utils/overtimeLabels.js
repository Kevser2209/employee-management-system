export const OVERTIME_STATUS_LABELS = {
  pending: "Bekliyor",
  approved: "Onaylandı",
  rejected: "Reddedildi",
};

export const OVERTIME_STATUS_STYLES = {
  pending: "bg-amber-50 text-amber-800 border-amber-200",
  approved: "bg-emerald-50 text-emerald-800 border-emerald-200",
  rejected: "bg-red-50 text-red-800 border-red-200",
};

export function getOvertimeStatusLabel(value) {
  return OVERTIME_STATUS_LABELS[value] || value;
}

export function formatOvertimeDate(value) {
  if (!value) {
    return "-";
  }

  return new Date(`${value}T00:00:00`).toLocaleDateString("tr-TR");
}

export function formatOvertimeHours(value) {
  if (value === null || value === undefined) {
    return "-";
  }

  return `${value} saat`;
}
