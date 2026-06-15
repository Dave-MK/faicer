# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: auth-shell.spec.ts >> local sign-in page shows mock auth mode
- Location: tests\e2e\auth-shell.spec.ts:8:5

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByText('Mock authentication')
Expected: visible
Error: strict mode violation: getByText('Mock authentication') resolved to 2 elements:
    1) <p class="mt-2 text-sm leading-7 text-[var(--ai-text-secondary)]">Mock authentication is enabled for local developm…</p> aka getByText('Mock authentication is')
    2) <p class="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--ai-cyan)]">Mock authentication</p> aka getByText('Mock authentication', { exact: true })

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for getByText('Mock authentication')

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - main [ref=e2]:
    - generic [ref=e3]:
      - generic [ref=e5]:
        - img "AI Ledger" [ref=e6]
        - generic [ref=e7]:
          - paragraph [ref=e8]: Log in
          - heading "Secure access to AI governance" [level=1] [ref=e9]
          - paragraph [ref=e10]: Sign in to access your AI Ledger governance platform.
        - list [ref=e11]:
          - listitem [ref=e12]:
            - img [ref=e15]
            - generic [ref=e17]: Enterprise-grade security
          - listitem [ref=e18]:
            - img [ref=e21]
            - generic [ref=e23]: SSO and MFA support
          - listitem [ref=e24]:
            - img [ref=e27]
            - generic [ref=e29]: Audit-ready by design
      - generic [ref=e31]:
        - img "AI Ledger" [ref=e32]
        - heading "Welcome back" [level=1] [ref=e33]
        - paragraph [ref=e34]: Mock authentication is enabled for local development.
        - generic [ref=e35]:
          - generic [ref=e36]:
            - text: Email address
            - textbox "Email address" [ref=e37]:
              - /placeholder: you@company.com
          - button "Sign in with mock access" [ref=e38]
        - generic [ref=e41]: or
        - button "Sign in with SSO" [ref=e43]:
          - img [ref=e45]
          - text: Sign in with SSO
        - paragraph [ref=e47]:
          - text: Don't have an account?
          - link "Sign up" [ref=e48] [cursor=pointer]:
            - /url: /sign-up
        - generic [ref=e49]:
          - paragraph [ref=e50]: Mock authentication
          - generic [ref=e51]:
            - generic [ref=e52]:
              - paragraph [ref=e53]: Maya Patel
              - paragraph [ref=e54]: owner@brightforge.test
            - generic [ref=e55]:
              - paragraph [ref=e56]: Jon Miles
              - paragraph [ref=e57]: admin@brightforge.test
            - generic [ref=e58]:
              - paragraph [ref=e59]: Avery Chen
              - paragraph [ref=e60]: staff@brightforge.test
  - alert [ref=e61]
```

# Test source

```ts
  1  | import { expect, test } from "@playwright/test";
  2  | 
  3  | test("welcome page links to the sign-in flow", async ({ page }) => {
  4  |   await page.goto("/welcome");
  5  |   await expect(page.getByRole("link", { name: "Get Started" })).toBeVisible();
  6  | });
  7  | 
  8  | test("local sign-in page shows mock auth mode", async ({ page }) => {
  9  |   await page.goto("/sign-in");
  10 |   await expect(page.getByRole("heading", { name: "Welcome back" })).toBeVisible();
> 11 |   await expect(page.getByText("Mock authentication")).toBeVisible();
     |                                                       ^ Error: expect(locator).toBeVisible() failed
  12 |   await expect(
  13 |     page.getByText("Mock authentication is enabled for local development."),
  14 |   ).toBeVisible();
  15 | });
  16 | 
  17 | test("local sign-up page shows mock onboarding", async ({ page }) => {
  18 |   await page.goto("/sign-up");
  19 |   await expect(page.getByText("Local development is using mock auth")).toBeVisible();
  20 |   await expect(page.getByLabel("Company name")).toBeVisible();
  21 |   await expect(page.getByRole("button", { name: "Create account and workspace" })).toBeVisible();
  22 | });
  23 | 
```