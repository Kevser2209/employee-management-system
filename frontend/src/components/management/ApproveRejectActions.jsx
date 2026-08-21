function ApproveRejectActions({
  itemId,
  status,
  onApprove,
  onReject,
  processingId,
  processingAction,
}) {
  if (status !== "pending") {
    return null;
  }

  const isProcessing = processingId === itemId;

  return (
    <div className="flex flex-wrap gap-2">
      <button
        type="button"
        disabled={isProcessing}
        onClick={() => onApprove(itemId)}
        className="rounded-lg bg-emerald-700 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:bg-emerald-300"
      >
        {isProcessing && processingAction === "approve" ? "Onaylanıyor..." : "Onayla"}
      </button>
      <button
        type="button"
        disabled={isProcessing}
        onClick={() => onReject(itemId)}
        className="rounded-lg bg-red-700 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-red-800 disabled:cursor-not-allowed disabled:bg-red-300"
      >
        {isProcessing && processingAction === "reject" ? "Reddediliyor..." : "Reddet"}
      </button>
    </div>
  );
}

export default ApproveRejectActions;
