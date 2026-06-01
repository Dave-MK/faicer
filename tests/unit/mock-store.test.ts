import { describe, expect, it } from "vitest";
import {
  createMockOrganisationForUser,
  getDefaultOrganisationId,
  getMembershipForUserInOrganisation,
  getUserByEmail,
} from "@/lib/data/mock-store";

describe("mock store tenancy helpers", () => {
  it("returns the seeded default organisation for the demo owner", () => {
    const owner = getUserByEmail("owner@brightforge.test");
    expect(owner).not.toBeNull();
    expect(getDefaultOrganisationId(owner!.id)).toBe("org-brightforge");
  });

  it("creates owner membership in the new organisation", () => {
    const owner = getUserByEmail("owner@brightforge.test");
    const organisation = createMockOrganisationForUser(owner!.id, {
      name: "Northlight Creative",
      sector: "Design agency",
      country: "United Kingdom",
      employeeBand: "3-10",
    });

    const membership = getMembershipForUserInOrganisation(
      owner!.id,
      organisation.id,
    );

    expect(membership?.role).toBe("owner");
  });
});
