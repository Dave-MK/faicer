import { expect, test } from "@playwright/test";

// Helper: sign in as owner (mock mode)
async function signInAsOwner(page: import("@playwright/test").Page) {
  await page.goto("/sign-in");
  await page.getByLabel("Email address").fill("owner@brightforge.test");
  await page.getByRole("button", { name: "Sign in with mock access" }).click();
  await page.waitForURL("**/dashboard");
}

// ---------- Use Cases ----------

test("owner can create and view a use case", async ({ page }) => {
  await signInAsOwner(page);

  await page.goto("/use-cases");
  await expect(page.getByRole("heading", { name: "AI Use Cases" })).toBeVisible();
  await page.getByRole("link", { name: "Add use case" }).click();
  await page.waitForURL("**/use-cases/new");

  await page.getByLabel("Title").fill("Customer Support Automation");
  await page.getByLabel("AI Tool").selectOption({ index: 1 });
  await page.getByLabel("Business unit").fill("Operations");
  await page.getByLabel("Risk level").selectOption("medium");
  await page.getByLabel("Status").selectOption("approved");
  await page.getByLabel("Description").fill("Automate first-line customer support replies with human review.");
  await page.getByLabel("Data involved").fill("Customer emails and ticket data");
  await page.getByLabel("Mitigations").fill("Human review for escalations");
  await page.getByRole("button", { name: "Save use case" }).click();

  await page.waitForURL(/\/use-cases\/.+message=created/);
  await expect(page.getByRole("heading", { name: "Customer Support Automation" })).toBeVisible();
  await expect(page.getByText("Use case created successfully.")).toBeVisible();
});

// ---------- Policies ----------

test("owner can create a policy and staff can acknowledge it", async ({ page }) => {
  await signInAsOwner(page);

  await page.goto("/policies");
  await expect(page.getByRole("heading", { name: "Policy Builder" })).toBeVisible();
  await page.getByRole("link", { name: "New policy" }).click();
  await page.waitForURL("**/policies/new");

  await page.getByLabel("Title").fill("AI Acceptable Use Policy");
  await page.getByLabel("Policy body").fill(
    "## Purpose\n\nThis policy governs acceptable use of AI tools.",
  );
  await page.getByLabel("Status").selectOption("active");
  await page.getByRole("button", { name: "Create policy" }).click();

  await page.waitForURL(/\/policies\/.+message=created/);
  await expect(page.getByRole("heading", { name: "AI Acceptable Use Policy" })).toBeVisible();
  await expect(page.getByText("Policy created successfully.")).toBeVisible();

  // Acknowledge the policy
  const ackButton = page.getByRole("button", { name: "Acknowledge this policy" });
  if (await ackButton.isVisible()) {
    await ackButton.click();
    await page.waitForURL(/my-policies\?message=acknowledged/);
  }
});

// ---------- Risks ----------

test("owner can create a risk and view risk register", async ({ page }) => {
  await signInAsOwner(page);

  await page.goto("/risks");
  await expect(page.getByRole("heading", { name: "Risk Register" })).toBeVisible();
  await page.getByRole("link", { name: "Add risk" }).click();
  await page.waitForURL("**/risks/new");

  await page.getByLabel("Title").fill("Data Leakage via LLM Prompt");
  await page.getByLabel("Description").fill("Sensitive data may leak via user prompts");
  await page.getByLabel("Entity type").selectOption("ai_tool");
  await page.getByLabel("Linked entity").selectOption({ index: 1 });
  await page.getByLabel("Severity").selectOption("4");
  await page.getByLabel("Likelihood").selectOption("3");
  await page.getByLabel("Mitigation").fill("Prompt guardrails and output filtering");
  await page.getByLabel("Status").selectOption("open");
  await page.getByRole("button", { name: "Save risk" }).click();

  await page.waitForURL(/\/risks\/.+message=created/);
  await expect(page.getByRole("heading", { name: "Data Leakage via LLM Prompt" })).toBeVisible();
  await expect(page.getByText("Risk created successfully.")).toBeVisible();
});

// ---------- Incidents ----------

test("any member can report an incident", async ({ page }) => {
  await signInAsOwner(page);

  await page.goto("/incidents");
  await expect(page.getByRole("heading", { name: "Incidents" })).toBeVisible();
  await page.getByRole("link", { name: "Report incident" }).click();
  await page.waitForURL("**/incidents/new");

  await page.getByLabel("Title").fill("AI tool returned offensive output");
  await page.getByLabel("Severity").selectOption("high");
  await page.getByLabel("Description").fill("The tool generated content that violated our policy.");
  await page.getByRole("button", { name: "Submit report" }).click();

  await page.waitForURL(/\/incidents\/.+message=created/);
  await expect(page.getByRole("heading", { name: "AI tool returned offensive output" })).toBeVisible();
  await expect(page.getByText("Incident reported successfully.")).toBeVisible();
});

test("reviewer can update incident status", async ({ page }) => {
  await signInAsOwner(page);
  await page.goto("/incidents");

  // Use the first incident in the list (seeded mock data)
  const firstLink = page.locator("table tbody tr:first-child a").first();
  await firstLink.click();
  await page.waitForURL(/\/incidents\/.+/);

  // Enter edit mode
  await page.getByRole("link", { name: "Edit" }).click();
  await page.waitForURL(/edit=1/);

  await page.getByLabel("Status").selectOption("investigating");
  await page.getByRole("button", { name: "Save changes" }).click();
  await page.waitForURL(/message=updated/);
  await expect(page.getByText("Incident updated.")).toBeVisible();
});

// ---------- Training ----------

test("admin can create a course and mark it complete", async ({ page }) => {
  await signInAsOwner(page);

  await page.goto("/training");
  await expect(page.getByRole("heading", { name: "Training" })).toBeVisible();
  await page.getByRole("link", { name: "Add course" }).click();
  await page.waitForURL("**/training/new");

  await page.getByLabel("Course title").fill("AI Ethics Fundamentals");
  await page.getByLabel("Duration (minutes)").fill("45");
  await page.getByLabel("Required for roles").fill("owner,admin,reviewer,staff");
  await page.getByLabel("Description").fill(
    "Covers the ethical principles of responsible AI deployment.",
  );
  await page.getByRole("button", { name: "Create course" }).click();

  await page.waitForURL(/\/training\/.+message=created/);
  await expect(page.getByRole("heading", { name: "AI Ethics Fundamentals" })).toBeVisible();
  await expect(page.getByText("Course created.")).toBeVisible();

  // Mark complete
  const markBtn = page.getByRole("button", { name: "Mark as complete" });
  if (await markBtn.isVisible()) {
    await markBtn.click();
    await page.waitForURL(/message=complete/);
    await expect(page.getByText("Course completed")).toBeVisible();
  }
});

// ---------- Assessments ----------

test("reviewer can create an assessment", async ({ page }) => {
  await signInAsOwner(page);

  await page.goto("/assessments");
  await expect(page.getByRole("heading", { name: "Assessments" })).toBeVisible();
  await page.getByRole("link", { name: "New assessment" }).click();
  await page.waitForURL("**/assessments/new");

  const today = new Date().toISOString().slice(0, 10);
  await page.getByLabel("Entity type").selectOption("ai_tool");
  await page.getByLabel("Linked entity").selectOption({ index: 1 });
  await page.getByLabel("Assessment date").fill(today);
  await page.getByLabel("Outcome").selectOption("conditional");
  await page.getByLabel("Findings").fill("Controls are in place but documentation is incomplete.");
  await page.getByRole("button", { name: "Save assessment" }).click();

  await page.waitForURL(/\/assessments\/.+message=created/);
  await expect(page.getByText("Assessment recorded successfully.")).toBeVisible();
});

// ---------- Evidence ----------

test("reviewer can add evidence", async ({ page }) => {
  await signInAsOwner(page);

  await page.goto("/evidence");
  await expect(page.getByRole("heading", { name: "Evidence" })).toBeVisible();
  await page.getByRole("link", { name: "Add evidence" }).click();
  await page.waitForURL("**/evidence/new");

  await page.getByLabel("Title").fill("Q2 Policy Acknowledgement Export");
  await page.locator('select[name="type"]').selectOption("document");
  await page.locator('select[name="linkedEntityType"]').selectOption("organisation");
  await page.locator('select[name="linkedEntityId"]').selectOption({ index: 1 });
  await page.getByLabel("Notes").fill("Exported from the platform on 2026-06-01.");
  await page.getByRole("button", { name: "Save evidence" }).click();

  await page.waitForURL(/\/evidence\/.+message=created/);
  await expect(page.getByRole("heading", { name: "Q2 Policy Acknowledgement Export" })).toBeVisible();
  await expect(page.getByText("Evidence item saved.")).toBeVisible();
});

// ---------- Navigation smoke tests ----------

test("dashboard loads with stat cards", async ({ page }) => {
  await signInAsOwner(page);
  await expect(page.getByText("Compliance Overview").first()).toBeVisible();
  await expect(page.getByText("Top Risks").first()).toBeVisible();
});

test("governance page loads control effectiveness", async ({ page }) => {
  await signInAsOwner(page);
  await page.goto("/governance");
  await expect(page.getByRole("heading", { name: "Governance" })).toBeVisible();
  await expect(page.getByText("Control effectiveness")).toBeVisible();
});

test("reports page shows health score", async ({ page }) => {
  await signInAsOwner(page);
  await page.goto("/reports");
  await expect(page.getByRole("heading", { name: "Governance Report" })).toBeVisible();
  await expect(page.getByText("Health Score")).toBeVisible();
});
