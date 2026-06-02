import { describe, expect, it } from "vitest";
import {
  createMockOrganisationForUser,
  createMockTool,
  getDefaultOrganisationId,
  getMembershipForUserInOrganisation,
  getUserByEmail,
  listToolsForOrganisation,
  updateMockTool,
} from "@/lib/data/mock-store";

describe("mock store tenancy helpers", () => {
  it("returns the seeded default organisation for the demo owner", () => {
    const owner = getUserByEmail("owner@brightforge.test");
    expect(owner).not.toBeNull();
    expect(getDefaultOrganisationId(owner!.id)).toBe("org-brightforge");
  });

  it("creates owner membership in the new organisation", () => {
    const owner = getUserByEmail("owner@brightforge.test");
    const created = createMockOrganisationForUser(owner!.id, {
      name: "Northlight Creative",
      sector: "Design agency",
      country: "United Kingdom",
      employeeBand: "3-10",
    });

    const membership = getMembershipForUserInOrganisation(
      owner!.id,
      created.organisation.id,
    );

    expect(membership?.role).toBe("owner");
  });

  it("returns seeded AI tools for the demo organisation", () => {
    const tools = listToolsForOrganisation("org-brightforge");
    expect(tools.length).toBeGreaterThan(0);
    expect(tools[0]?.organisationId).toBe("org-brightforge");
  });

  it("creates and updates a tool record payload", () => {
    const created = createMockTool({
      organisationId: "org-brightforge",
      actorUserId: "user-owner-brightforge",
      accountOwnerUserId: "user-owner-brightforge",
      businessOwnerUserId: "user-owner-brightforge",
      name: "Claude Team",
      vendor: "Anthropic",
      category: "general_chatbot",
      approvalStatus: "approved",
      nextReviewAt: "2026-10-01",
      notes: "Initial approval",
    });

    expect(created.tool.name).toBe("Claude Team");
    expect(created.auditEvent.action).toBe("ai_tool.created");

    const updated = updateMockTool(created.tool, {
      actorUserId: "user-owner-brightforge",
      name: "Claude Team",
      vendor: "Anthropic",
      category: "general_chatbot",
      approvalStatus: "restricted",
      nextReviewAt: "2026-11-01",
      notes: "Restricted after client review",
    });

    expect(updated.tool.approvalStatus).toBe("restricted");
    expect(updated.auditEvent.action).toBe("ai_tool.updated");
  });
});
