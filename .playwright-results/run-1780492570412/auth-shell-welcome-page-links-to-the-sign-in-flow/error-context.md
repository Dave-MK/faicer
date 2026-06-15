# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: auth-shell.spec.ts >> welcome page links to the sign-in flow
- Location: tests\e2e\auth-shell.spec.ts:3:5

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByRole('link', { name: 'Get Started' })
Expected: visible
Error: strict mode violation: getByRole('link', { name: 'Get Started' }) resolved to 2 elements:
    1) <a href="/sign-up" class="inline-flex items-center rounded-xl bg-[linear-gradient(135deg,#1243d6_0%,#1c65ff_100%)] px-4 py-2.5 text-sm font-semibold text-white shadow-[0_18px_40px_rgba(28,101,255,0.25)] transition hover:brightness-110">Get Started</a> aka locator('header').getByRole('link', { name: 'Get Started' })
    2) <a href="/sign-up" class="brand-button-primary inline-flex items-center rounded-xl px-5 py-3.5 text-sm font-semibold transition">Get Started</a> aka locator('section').getByRole('link', { name: 'Get Started' })

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for getByRole('link', { name: 'Get Started' })

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - main [ref=e2]:
    - generic [ref=e3]:
      - generic [ref=e4]:
        - generic [ref=e5]:
          - img "AI Ledger" [ref=e6]
          - navigation [ref=e7]:
            - link "Product" [ref=e8] [cursor=pointer]:
              - /url: /dashboard
              - generic [ref=e9]: Product
              - img [ref=e11]
            - link "Solutions" [ref=e13] [cursor=pointer]:
              - /url: /governance
              - generic [ref=e14]: Solutions
              - img [ref=e16]
            - link "Resources" [ref=e18] [cursor=pointer]:
              - /url: /docs
              - generic [ref=e19]: Resources
              - img [ref=e21]
            - link "Company" [ref=e23] [cursor=pointer]:
              - /url: /welcome
              - generic [ref=e24]: Company
              - img [ref=e26]
            - link "Pricing" [ref=e28] [cursor=pointer]:
              - /url: /pricing
              - generic [ref=e29]: Pricing
        - generic [ref=e30]:
          - link "Log in" [ref=e31] [cursor=pointer]:
            - /url: /sign-in
          - link "Get Started" [ref=e32] [cursor=pointer]:
            - /url: /sign-up
      - generic [ref=e33]:
        - generic [ref=e34]:
          - generic [ref=e35]:
            - generic [ref=e36]:
              - img [ref=e39]
              - text: AI governance platform
            - heading "Governance. Evidence. Trust." [level=1] [ref=e41]
            - paragraph [ref=e42]: Record and govern AI use across your organization. AI Ledger helps security, risk, and compliance teams capture activity, manage policy, and prove accountability.
          - generic [ref=e43]:
            - link "Get Started" [ref=e44] [cursor=pointer]:
              - /url: /sign-up
            - link "Request a Demo" [ref=e45] [cursor=pointer]:
              - /url: /pricing
          - generic [ref=e46]:
            - article [ref=e47]:
              - img [ref=e50]
              - heading "Capture AI Activity" [level=2] [ref=e53]
              - paragraph [ref=e54]: Automatically collect and centralize AI use across tools and teams.
            - article [ref=e55]:
              - img [ref=e58]
              - heading "Enforce Policy" [level=2] [ref=e61]
              - paragraph [ref=e62]: Apply guardrails and controls that reflect your risk posture.
            - article [ref=e63]:
              - img [ref=e66]
              - heading "Prove Compliance" [level=2] [ref=e69]
              - paragraph [ref=e70]: Generate audit-ready evidence and maintain continuous compliance.
            - article [ref=e71]:
              - img [ref=e74]
              - heading "Build Trust" [level=2] [ref=e77]
              - paragraph [ref=e78]: Demonstrate responsible AI use to stakeholders, auditors, and customers.
          - generic [ref=e79]:
            - paragraph [ref=e80]: Trusted by security, risk, and compliance teams
            - generic [ref=e81]:
              - generic [ref=e82]: Acme Global
              - generic [ref=e83]: TrustBank
              - generic [ref=e84]: Nexus Cloud
              - generic [ref=e85]: DataCore
              - generic [ref=e86]: Vertex Systems
        - generic [ref=e88]:
          - generic [ref=e89]:
            - generic [ref=e90]:
              - img [ref=e93]
              - generic [ref=e96]:
                - paragraph [ref=e97]: AI Ledger
                - paragraph [ref=e98]: Acme Global
            - img [ref=e100]
          - generic [ref=e102]:
            - generic [ref=e103]:
              - generic [ref=e104]:
                - paragraph [ref=e105]: Governance Health
                - generic [ref=e106]:
                  - generic [ref=e108]:
                    - paragraph [ref=e109]: "91"
                    - paragraph [ref=e110]: /100
                  - generic [ref=e111]:
                    - paragraph [ref=e112]: Excellent
                    - paragraph [ref=e113]: +16 vs last 30 days
              - generic [ref=e114]:
                - article [ref=e115]:
                  - paragraph [ref=e116]: Policies
                  - paragraph [ref=e117]: "156"
                  - paragraph [ref=e118]: + 18%
                - article [ref=e119]:
                  - paragraph [ref=e120]: Controls
                  - paragraph [ref=e121]: "412"
                  - paragraph [ref=e122]: + 18%
                - article [ref=e123]:
                  - paragraph [ref=e124]: Evidence Items
                  - paragraph [ref=e125]: 3,677
                  - paragraph [ref=e126]: + 18%
            - generic [ref=e127]:
              - article [ref=e128]:
                - generic [ref=e129]:
                  - generic [ref=e130]:
                    - paragraph [ref=e131]: Evidence Status
                    - paragraph [ref=e132]: Total evidence items
                  - paragraph [ref=e133]: 3,677
              - article [ref=e136]:
                - generic [ref=e137]:
                  - generic [ref=e139]:
                    - paragraph [ref=e140]: 83%
                    - paragraph [ref=e141]: Overall
                  - generic [ref=e142]:
                    - paragraph [ref=e143]: Data Privacy 91%
                    - paragraph [ref=e144]: Access Control 86%
                    - paragraph [ref=e145]: Vendor Management 80%
                    - paragraph [ref=e146]: Change Management 76%
  - alert [ref=e147]
```

# Test source

```ts
  1  | import { expect, test } from "@playwright/test";
  2  | 
  3  | test("welcome page links to the sign-in flow", async ({ page }) => {
  4  |   await page.goto("/welcome");
> 5  |   await expect(page.getByRole("link", { name: "Get Started" })).toBeVisible();
     |                                                                 ^ Error: expect(locator).toBeVisible() failed
  6  | });
  7  | 
  8  | test("local sign-in page shows mock auth mode", async ({ page }) => {
  9  |   await page.goto("/sign-in");
  10 |   await expect(page.getByRole("heading", { name: "Welcome back" })).toBeVisible();
  11 |   await expect(page.getByText("Mock authentication")).toBeVisible();
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