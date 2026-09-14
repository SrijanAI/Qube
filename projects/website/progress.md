# Qube Website — Progress

_Last updated: 2026-09-14_

## Status: Built, deployed to preview. Domain cutover and Formspree pending on Srijan.

## What's done
- Built per `context.md` spec: Next.js 14 (App Router) + Tailwind CSS, single page,
  all sections (hero, what-are-we, what-we-do, how-we-do-it, annotations w/ 5 tiers,
  capabilities, regions, partner form, contributor form, footer) using exact copy
  from `qube-agency/qube-onepager.docx`.
- Code lives at `C:\Users\Srijan\Desktop\qube-website` (local git repo, not yet pushed
  to GitHub — no remote configured).
- Deployed to Vercel under the `gamer-tech-coder` personal account as a new project
  `qube-physical-ai`: https://qube-physical-ai.vercel.app

## Blockers found (need Srijan)
- **Domain**: `0xqube.xyz` is already live with a different, older site ("QUBE | Train
  AI on Asia", dark theme) under a Vercel account/team this session's `vercel login`
  didn't have access to. There's also a stale, unrelated `qube-website` project under
  the `gamer-tech-coder` account with the same old content — not touched, not deleted.
  Srijan opted to handle the domain cutover himself.
- **Formspree**: needs an account (email signup/verification) — can't be created
  by the agent. Srijan opted to skip for this session. Forms are fully wired to read
  endpoint URLs from `NEXT_PUBLIC_FORMSPREE_PARTNER_ENDPOINT` /
  `NEXT_PUBLIC_FORMSPREE_CONTRIBUTOR_ENDPOINT` env vars (see `.env.local.example` in
  the repo) — until set, submitting shows a clear inline error pointing to
  ldrago@0xqube.xyz, no silent data loss.

## Next steps (for Srijan or a future session)
1. Create Formspree forms → both to ldrago@0xqube.xyz → add endpoint URLs to
   `.env.local` locally and to the Vercel project's env vars → redeploy.
2. Point `0xqube.xyz` at the `qube-physical-ai` Vercel deployment (or redeploy this
   repo under whichever account currently owns the domain).
3. Optional: push the local repo to GitHub for version history / CI.
