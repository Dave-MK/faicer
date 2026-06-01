import type { MembershipRole } from "@/lib/types";

export function canManageOrganisation(role: MembershipRole) {
  return role === "owner" || role === "admin";
}

export function canReviewRecords(role: MembershipRole) {
  return role === "owner" || role === "admin" || role === "reviewer";
}

export function hasRequiredRole(
  role: MembershipRole,
  allowedRoles?: MembershipRole[],
) {
  if (!allowedRoles || allowedRoles.length === 0) {
    return true;
  }

  return allowedRoles.includes(role);
}
