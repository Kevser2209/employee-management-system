export const MANAGEMENT_ROLES = ["manager", "hr"];

export function getUserRoles(user) {
  if (!user?.roles || !Array.isArray(user.roles)) {
    return [];
  }

  return user.roles
    .map((role) => (typeof role === "string" ? role : role.name))
    .filter(Boolean);
}

export function hasManagementAccess(user) {
  const roles = getUserRoles(user);
  return roles.some((role) => MANAGEMENT_ROLES.includes(role));
}
