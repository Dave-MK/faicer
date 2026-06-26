import { describe, expect, it } from "vitest";
import {
  createMockOrganisationForUser,
  getDefaultOrganisationId,
  getMembershipForUserInOrganisation,
  getMembershipsForUser,
  listAssessmentsForOrganisation,
  listControlsForOrganisation,
  listEvidenceForOrganisation,
  listIncidentsForOrganisation,
  listPoliciesForOrganisation,
  listRisksForOrganisation,
  listToolsForOrganisation,
  listUseCasesForOrganisation,
} from "@/lib/data/mock-store";

/**
 * Tenant-isolation tests for the mock data boundary.
 *
 * In mock mode the access-control gate is getMembershipForUserInOrganisation:
 * getMockWorkspaceContext() redirects to /sign-in when a user has no active
 * membership in the requested organisation. These tests assert that a user in
 * org A can never resolve membership in — or read records belonging to — org B.
 *
 * The Supabase path enforces the same boundary at the database layer via the
 * membership-based RLS policies in supabase/migrations/*. Those run against a
 * live Postgres; see docs/supabase-validation.md for the SQL-level runbook.
 */

const ORG_A = "org-brightforge";
const ORG_A_OWNER = "user-owner-brightforge";
const ORG_A_STAFF = "user-staff-brightforge";

// The mock store is a module-level singleton, so mutations persist across tests
// in this file. Each makeOrgB() call uses a fresh owner id to avoid a single
// user accumulating memberships in several organisations between tests.
let outsiderCounter = 0;

function makeOrgB() {
  outsiderCounter += 1;
  const ownerId = `user-outsider-tenant-isolation-${outsiderCounter}`;
  const { organisation } = createMockOrganisationForUser(ownerId, {
    name: "Northwind Labs",
    sector: "Software",
    country: "United Kingdom",
    employeeBand: "3-10",
  });
  return { orgId: organisation.id, ownerId };
}

describe("tenant isolation — membership boundary", () => {
  it("a user from org A has no membership in org B", () => {
    const { orgId: orgB } = makeOrgB();
    expect(getMembershipForUserInOrganisation(ORG_A_OWNER, orgB)).toBeNull();
    expect(getMembershipForUserInOrganisation(ORG_A_STAFF, orgB)).toBeNull();
  });

  it("the org B owner has no membership in org A", () => {
    const { ownerId } = makeOrgB();
    expect(getMembershipForUserInOrganisation(ownerId, ORG_A)).toBeNull();
  });

  it("each user only sees their own organisation's memberships", () => {
    const { orgId: orgB, ownerId } = makeOrgB();

    const orgAMemberships = getMembershipsForUser(ORG_A_OWNER);
    expect(orgAMemberships.length).toBeGreaterThan(0);
    expect(orgAMemberships.every((m) => m.organisationId === ORG_A)).toBe(true);

    const orgBMemberships = getMembershipsForUser(ownerId);
    expect(orgBMemberships).toHaveLength(1);
    expect(orgBMemberships.every((m) => m.organisationId === orgB)).toBe(true);
    expect(orgBMemberships.some((m) => m.organisationId === ORG_A)).toBe(false);
  });

  it("resolves the default organisation from the user's own membership", () => {
    const { orgId: orgB, ownerId } = makeOrgB();
    expect(getDefaultOrganisationId(ORG_A_OWNER)).toBe(ORG_A);
    expect(getDefaultOrganisationId(ownerId)).toBe(orgB);
  });
});

describe("tenant isolation — org-scoped record reads", () => {
  it("org B (newly created) reads back none of org A's seeded records", () => {
    const { orgId: orgB } = makeOrgB();

    expect(listToolsForOrganisation(orgB)).toHaveLength(0);
    expect(listUseCasesForOrganisation(orgB)).toHaveLength(0);
    expect(listPoliciesForOrganisation(orgB)).toHaveLength(0);
    expect(listRisksForOrganisation(orgB)).toHaveLength(0);
    expect(listControlsForOrganisation(orgB)).toHaveLength(0);
    expect(listAssessmentsForOrganisation(orgB)).toHaveLength(0);
    expect(listEvidenceForOrganisation(orgB)).toHaveLength(0);
    expect(listIncidentsForOrganisation(orgB)).toHaveLength(0);
  });

  it("every org-scoped query stamps the requested organisation onto its rows", () => {
    const readers = [
      listToolsForOrganisation,
      listUseCasesForOrganisation,
      listPoliciesForOrganisation,
      listRisksForOrganisation,
      listControlsForOrganisation,
      listAssessmentsForOrganisation,
      listEvidenceForOrganisation,
      listIncidentsForOrganisation,
    ];

    for (const read of readers) {
      const rows = read(ORG_A);
      expect(rows.every((row) => row.organisationId === ORG_A)).toBe(true);
    }
  });
});
