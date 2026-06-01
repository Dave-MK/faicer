import { expect, test } from "@playwright/test";

test("welcome page links to the sign-in flow", async ({ page }) => {
  await page.goto("/welcome");
  await expect(page.getByRole("link", { name: "Sign in with demo users" })).toBeVisible();
});

test("connected sign-in page shows Supabase password auth", async ({ page }) => {
  await page.goto("/sign-in");
  await expect(
    page.getByRole("heading", { name: "Sign in to the workspace" }),
  ).toBeVisible();
  await expect(page.getByText("Supabase authentication")).toBeVisible();
  await expect(page.getByLabel("Password")).toBeVisible();
});

test("connected sign-up page shows password-based onboarding", async ({ page }) => {
  await page.goto("/sign-up");
  await expect(page.getByText("Supabase onboarding")).toBeVisible();
  await expect(page.getByLabel("Password")).toBeVisible();
  await expect(page.getByRole("button", { name: "Create account" })).toBeVisible();
});
