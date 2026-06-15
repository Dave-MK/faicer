import { expect, test } from "@playwright/test";

test("owner can create a tool record in mock mode", async ({ page }) => {
  await page.goto("/sign-in");
  await page.getByLabel("Email address").fill("owner@brightforge.test");
  await page.getByRole("button", { name: "Sign in with mock access" }).click();

  await page.waitForURL("**/dashboard");
  await page.getByRole("link", { name: "AI Register" }).click();
  await page.waitForURL("**/tools");
  await page.getByRole("link", { name: "Add tool" }).click();

  await page.waitForURL("**/tools/new");
  await page.getByLabel("Tool name").fill("Perplexity Pro");
  await page.getByLabel("Vendor").fill("Perplexity");
  await page.getByLabel("Website URL").fill("https://www.perplexity.ai");
  await page.getByLabel("Category").selectOption("general_chatbot");
  await page.getByLabel("Approval status").selectOption("restricted");
  await page.getByLabel("Next review date").fill("2026-10-15");
  await page
    .getByLabel("Data-processing notes")
    .fill("No confidential client information. Human review required.");
  await page
    .getByLabel("Internal notes")
    .fill("Approved for market research and first-pass summaries.");
  await page.getByRole("button", { name: "Save tool record" }).click();

  await page.waitForURL(/\/tools\/.+message=created/);
  await expect(page.getByRole("heading", { name: "Perplexity Pro" })).toBeVisible();
  await expect(page.getByText("Tool record created")).toBeVisible();
  await expect(page.getByText("ai_tool.created")).toBeVisible();
});
