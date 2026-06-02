import { expect, test } from "@playwright/test";

test("welcome page links to the sign-in flow", async ({ page }) => {
  await page.goto("/welcome");
  await expect(page.getByRole("link", { name: "Sign in with demo users" })).toBeVisible();
});

test("local sign-in page shows mock auth mode", async ({ page }) => {
  await page.goto("/sign-in");
  await expect(
    page.getByRole("heading", { name: "Sign in to the workspace" }),
  ).toBeVisible();
  await expect(page.getByText("Mock authentication")).toBeVisible();
  await expect(page.getByText("Local development is currently using mock auth")).toBeVisible();
});

test("local sign-up page shows mock onboarding", async ({ page }) => {
  await page.goto("/sign-up");
  await expect(page.getByText("Mock onboarding")).toBeVisible();
  await expect(page.getByLabel("Organisation name")).toBeVisible();
  await expect(page.getByRole("button", { name: "Create account and workspace" })).toBeVisible();
});
