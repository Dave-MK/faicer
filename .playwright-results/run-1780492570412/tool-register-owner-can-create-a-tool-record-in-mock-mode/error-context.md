# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: tool-register.spec.ts >> owner can create a tool record in mock mode
- Location: tests\e2e\tool-register.spec.ts:3:5

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: locator.click: Test timeout of 30000ms exceeded.
Call log:
  - waiting for getByRole('link', { name: 'Add tool' })

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - alert [ref=e2]
  - generic [ref=e4]:
    - complementary [ref=e5]:
      - img "AI Ledger" [ref=e7]
      - navigation [ref=e8]:
        - link "Overview" [ref=e9] [cursor=pointer]:
          - /url: /dashboard
          - img [ref=e12]
          - generic [ref=e15]: Overview
        - link "AI Register" [ref=e16] [cursor=pointer]:
          - /url: /tools
          - img [ref=e19]
          - generic [ref=e22]: AI Register
        - link "Use Cases" [ref=e23] [cursor=pointer]:
          - /url: /use-cases
          - img [ref=e26]
          - generic [ref=e30]: Use Cases
        - link "Governance" [ref=e31] [cursor=pointer]:
          - /url: /governance
          - img [ref=e34]
          - generic [ref=e37]: Governance
        - link "Policies" [ref=e38] [cursor=pointer]:
          - /url: /policies
          - img [ref=e41]
          - generic [ref=e44]: Policies
        - link "Evidence" [ref=e45] [cursor=pointer]:
          - /url: /evidence
          - img [ref=e48]
          - generic [ref=e51]: Evidence
        - link "Risks" [ref=e52] [cursor=pointer]:
          - /url: /risks
          - img [ref=e55]
          - generic [ref=e58]: Risks
        - link "Assessments" [ref=e59] [cursor=pointer]:
          - /url: /assessments
          - img [ref=e62]
          - generic [ref=e64]: Assessments
        - link "Controls" [ref=e65] [cursor=pointer]:
          - /url: /controls
          - img [ref=e68]
          - generic [ref=e71]: Controls
        - link "Reports" [ref=e72] [cursor=pointer]:
          - /url: /reports
          - img [ref=e75]
          - generic [ref=e76]: Reports
        - link "Integrations" [ref=e77] [cursor=pointer]:
          - /url: /integrations
          - img [ref=e80]
          - generic [ref=e85]: Integrations
        - link "Settings" [ref=e86] [cursor=pointer]:
          - /url: /settings
          - img [ref=e89]
          - generic [ref=e92]: Settings
      - generic [ref=e94]:
        - paragraph [ref=e95]: Governance. Evidence. Trust.
        - paragraph [ref=e96]: Centralized register, clear review controls, and audit-ready oversight.
    - generic [ref=e97]:
      - banner [ref=e98]:
        - button "BrightForge Studio" [ref=e99]:
          - generic [ref=e100]: BrightForge Studio
          - img [ref=e102]
        - generic [ref=e104]:
          - button [ref=e105]:
            - img [ref=e108]
          - generic [ref=e111]:
            - generic [ref=e112]: MP
            - generic [ref=e113]:
              - paragraph [ref=e114]: Maya Patel
              - paragraph [ref=e115]: owner
            - img [ref=e117]
          - button "Sign out" [ref=e120]
      - generic [ref=e121]:
        - generic [ref=e122]:
          - generic [ref=e123]:
            - heading "Governance Health" [level=1] [ref=e124]
            - paragraph [ref=e125]: Enterprise-wide overview
          - button "Last 30 days" [ref=e127]:
            - generic [ref=e128]: Last 30 days
            - img [ref=e130]
        - generic [ref=e132]:
          - generic [ref=e133]:
            - paragraph [ref=e134]: Health Score
            - generic [ref=e135]:
              - generic [ref=e137]:
                - paragraph [ref=e138]: "91"
                - paragraph [ref=e139]: /100
              - generic [ref=e140]:
                - paragraph [ref=e141]: Excellent
                - paragraph [ref=e143]: + 16 vs last 30 days
          - generic [ref=e144]:
            - paragraph [ref=e145]: Policies
            - paragraph [ref=e146]: "156"
            - paragraph [ref=e147]: + 18%
          - generic [ref=e148]:
            - paragraph [ref=e149]: Controls
            - paragraph [ref=e150]: "412"
            - paragraph [ref=e151]: + 11%
          - generic [ref=e152]:
            - paragraph [ref=e153]: Evidence Items
            - paragraph [ref=e154]: 3,677
            - paragraph [ref=e155]: + 19%
          - generic [ref=e156]:
            - paragraph [ref=e157]: Assessments
            - paragraph [ref=e158]: "28"
            - paragraph [ref=e159]: + 17%
        - generic [ref=e160]:
          - generic [ref=e161]:
            - paragraph [ref=e162]: Evidence Status
            - paragraph [ref=e163]: Total evidence items
            - generic [ref=e164]:
              - paragraph [ref=e165]: 3,677
              - paragraph [ref=e166]: + 19%
            - generic [ref=e169]:
              - generic [ref=e170]:
                - paragraph [ref=e171]: Verified
                - generic [ref=e173]: 2,283 (62%)
              - generic [ref=e174]:
                - paragraph [ref=e175]: Pending Review
                - generic [ref=e177]: 891 (24%)
              - generic [ref=e178]:
                - paragraph [ref=e179]: Expiring Soon
                - generic [ref=e181]: 321 (9%)
              - generic [ref=e182]:
                - paragraph [ref=e183]: Issues
                - generic [ref=e185]: 182 (5%)
          - generic [ref=e186]:
            - paragraph [ref=e187]: Policy Coverage
            - paragraph [ref=e188]: Coverage across key domains
            - generic [ref=e189]:
              - generic [ref=e191]:
                - paragraph [ref=e192]: 83%
                - paragraph [ref=e193]: Overall
              - generic [ref=e194]:
                - generic [ref=e195]:
                  - paragraph [ref=e196]: Data Privacy
                  - generic [ref=e198]: 91%
                - generic [ref=e199]:
                  - paragraph [ref=e200]: Access Control
                  - generic [ref=e202]: 86%
                - generic [ref=e203]:
                  - paragraph [ref=e204]: Vendor Management
                  - generic [ref=e206]: 80%
                - generic [ref=e207]:
                  - paragraph [ref=e208]: Change Management
                  - generic [ref=e210]: 76%
                - generic [ref=e211]:
                  - paragraph [ref=e212]: Incident Response
                  - generic [ref=e214]: 64%
          - generic [ref=e215]:
            - paragraph [ref=e216]: Risk Posture
            - paragraph [ref=e217]: Active and emerging risks
            - generic [ref=e218]:
              - generic [ref=e219]:
                - generic [ref=e220]: High
                - generic [ref=e221]: 3 risks require immediate attention
              - generic [ref=e222]:
                - generic [ref=e223]: Medium
                - generic [ref=e224]: 7 risks require monitoring
              - generic [ref=e225]:
                - generic [ref=e226]: Low
                - generic [ref=e227]: 12 risks under control
              - generic [ref=e228]:
                - generic [ref=e229]: Info
                - generic [ref=e230]: 6 informational risks
            - link "View all risks" [ref=e232] [cursor=pointer]:
              - /url: /risks
        - generic [ref=e233]:
          - generic [ref=e234]:
            - generic [ref=e235]:
              - paragraph [ref=e236]: Recent Evidence
              - paragraph [ref=e237]: Evidence recorded across the governance platform
            - link "View all" [ref=e238] [cursor=pointer]:
              - /url: /evidence
          - table [ref=e240]:
            - rowgroup [ref=e241]:
              - row "Evidence Type Policy Source Status Updated" [ref=e242]:
                - columnheader "Evidence" [ref=e243]
                - columnheader "Type" [ref=e244]
                - columnheader "Policy" [ref=e245]
                - columnheader "Source" [ref=e246]
                - columnheader "Status" [ref=e247]
                - columnheader "Updated" [ref=e248]
            - rowgroup [ref=e249]:
              - row "Vendor Risk Assessment - CloudCo Assessment Vendor Management OneTrust Verified May 20, 2024" [ref=e250]:
                - cell "Vendor Risk Assessment - CloudCo" [ref=e251]
                - cell "Assessment" [ref=e252]
                - cell "Vendor Management" [ref=e253]
                - cell "OneTrust" [ref=e254]
                - cell "Verified" [ref=e255]:
                  - generic [ref=e256]: Verified
                - cell "May 20, 2024" [ref=e257]
              - row "Access Review Q2 2024 Access Review Access Control Okta Verified May 19, 2024" [ref=e258]:
                - cell "Access Review Q2 2024" [ref=e259]
                - cell "Access Review" [ref=e260]
                - cell "Access Control" [ref=e261]
                - cell "Okta" [ref=e262]
                - cell "Verified" [ref=e263]:
                  - generic [ref=e264]: Verified
                - cell "May 19, 2024" [ref=e265]
              - row "Data Processing Agreement Document Data Privacy SharePoint Verified May 18, 2024" [ref=e266]:
                - cell "Data Processing Agreement" [ref=e267]
                - cell "Document" [ref=e268]
                - cell "Data Privacy" [ref=e269]
                - cell "SharePoint" [ref=e270]
                - cell "Verified" [ref=e271]:
                  - generic [ref=e272]: Verified
                - cell "May 18, 2024" [ref=e273]
              - row "Change Management Log Log Change Management ServiceNow Pending Review May 17, 2024" [ref=e274]:
                - cell "Change Management Log" [ref=e275]
                - cell "Log" [ref=e276]
                - cell "Change Management" [ref=e277]
                - cell "ServiceNow" [ref=e278]
                - cell "Pending Review" [ref=e279]:
                  - generic [ref=e280]: Pending Review
                - cell "May 17, 2024" [ref=e281]
              - 'row "Security Incident Report #1432 Incident Incident Response Jira Service Mgmt Verified May 16, 2024" [ref=e282]':
                - 'cell "Security Incident Report #1432" [ref=e283]'
                - cell "Incident" [ref=e284]
                - cell "Incident Response" [ref=e285]
                - cell "Jira Service Mgmt" [ref=e286]
                - cell "Verified" [ref=e287]:
                  - generic [ref=e288]: Verified
                - cell "May 16, 2024" [ref=e289]
```

# Test source

```ts
  1  | import { expect, test } from "@playwright/test";
  2  | 
  3  | test("owner can create a tool record in mock mode", async ({ page }) => {
  4  |   await page.goto("/sign-in");
  5  |   await page.getByLabel("Email address").fill("owner@brightforge.test");
  6  |   await page.getByRole("button", { name: "Sign in with mock access" }).click();
  7  | 
  8  |   await page.waitForURL("**/dashboard");
> 9  |   await page.getByRole("link", { name: "Add tool" }).click();
     |                                                      ^ Error: locator.click: Test timeout of 30000ms exceeded.
  10 | 
  11 |   await page.waitForURL("**/tools/new");
  12 |   await page.getByLabel("Tool name").fill("Perplexity Pro");
  13 |   await page.getByLabel("Vendor").fill("Perplexity");
  14 |   await page.getByLabel("Website URL").fill("https://www.perplexity.ai");
  15 |   await page.getByLabel("Category").selectOption("general_chatbot");
  16 |   await page.getByLabel("Approval status").selectOption("restricted");
  17 |   await page.getByLabel("Next review date").fill("2026-10-15");
  18 |   await page
  19 |     .getByLabel("Data-processing notes")
  20 |     .fill("No confidential client information. Human review required.");
  21 |   await page
  22 |     .getByLabel("Internal notes")
  23 |     .fill("Approved for market research and first-pass summaries.");
  24 |   await page.getByRole("button", { name: "Save tool record" }).click();
  25 | 
  26 |   await page.waitForURL(/\/tools\/.+message=created/);
  27 |   await expect(page.getByRole("heading", { name: "Perplexity Pro" })).toBeVisible();
  28 |   await expect(page.getByText("Tool record created")).toBeVisible();
  29 |   await expect(page.getByText("ai_tool.created")).toBeVisible();
  30 | });
  31 | 
```