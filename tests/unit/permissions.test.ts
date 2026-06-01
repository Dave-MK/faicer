import { describe, expect, it } from "vitest";
import {
  canManageOrganisation,
  canReviewRecords,
  hasRequiredRole,
} from "@/lib/auth/permissions";

describe("permission helpers", () => {
  it("allows owners and admins to manage organisations", () => {
    expect(canManageOrganisation("owner")).toBe(true);
    expect(canManageOrganisation("admin")).toBe(true);
    expect(canManageOrganisation("staff")).toBe(false);
  });

  it("allows reviewers to review records without full management access", () => {
    expect(canReviewRecords("reviewer")).toBe(true);
    expect(canReviewRecords("staff")).toBe(false);
  });

  it("matches required roles correctly", () => {
    expect(hasRequiredRole("owner", ["owner", "admin"])).toBe(true);
    expect(hasRequiredRole("staff", ["owner", "admin"])).toBe(false);
    expect(hasRequiredRole("staff")).toBe(true);
  });
});
