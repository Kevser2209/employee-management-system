export const LEAVE_TYPE_OPTIONS = [
  { value: "annual", label: "Yıllık İzin" },
  { value: "sick", label: "Hastalık İzni" },
  { value: "maternity", label: "Doğum İzni" },
  { value: "paternity", label: "Babalık İzni" },
  { value: "unpaid", label: "Ücretsiz İzin" },
];

export const LEAVE_STATUS_LABELS = {
  pending: "Bekliyor",
  approved: "Onaylandı",
  rejected: "Reddedildi",
  cancelled: "İptal Edildi",
};

export const LEAVE_STATUS_STYLES = {
  pending: "bg-amber-50 text-amber-800 border-amber-200",
  approved: "bg-emerald-50 text-emerald-800 border-emerald-200",
  rejected: "bg-red-50 text-red-800 border-red-200",
  cancelled: "bg-slate-100 text-slate-700 border-slate-200",
};

export function getLeaveTypeLabel(value) {
  return LEAVE_TYPE_OPTIONS.find((option) => option.value === value)?.label || value;
}

export function getLeaveStatusLabel(value) {
  return LEAVE_STATUS_LABELS[value] || value;
}

export function formatLeaveDate(value) {
  if (!value) {
    return "-";
  }

  return new Date(`${value}T00:00:00`).toLocaleDateString("tr-TR");
}
