---
name: faicer-domain
description: FAICER's production domain is faicer.site
metadata:
  type: project
---

FAICER (the AI governance app in this repo) is deployed at **https://faicer.site**.

Implications:
- `metadataBase` in `src/app/layout.tsx` is set to `https://faicer.site`.
- Supabase Auth must allowlist `https://faicer.site/**` as a redirect URL and set Site URL to `https://faicer.site` for the password-reset / email-confirmation flow (`resetPasswordAction` builds `${origin}/auth/callback?next=/update-password` from request headers).

Related: [[faicer-rebrand]]
