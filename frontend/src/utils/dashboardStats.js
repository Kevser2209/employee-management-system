export function countByStatus(items, status) {
  if (!Array.isArray(items)) {
    return 0;
  }

  return items.filter((item) => item.status === status).length;
}

export function getRecentItems(items, limit = 5) {
  if (!Array.isArray(items)) {
    return [];
  }

  return [...items]
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, limit);
}

export function buildEmployeeLeaveStats(leaves) {
  return {
    total: leaves.length,
    pending: countByStatus(leaves, "pending"),
    approved: countByStatus(leaves, "approved"),
  };
}

export function buildEmployeeOvertimeStats(overtimes) {
  return {
    total: overtimes.length,
    pending: countByStatus(overtimes, "pending"),
    approved: countByStatus(overtimes, "approved"),
  };
}
