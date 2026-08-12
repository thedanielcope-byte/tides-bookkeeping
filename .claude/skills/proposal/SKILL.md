---
name: proposal
description: Create a Tides Bookkeeping client proposal — an unlisted web page at /proposals/<slug> matching the house template AND a matching branded Word/PDF, plus optional cover email, CPA note, and onboarding request. Use whenever Dan says "make a proposal", "proposal for <client>", "proposal page", "new client proposal", or wants to package a bookkeeping engagement for a prospect. Handles the whole flow: gather details, generate page + doc, verify, deploy.
argument-hint: "<client name> [details]"
metadata:
  author: Dan Cope / Tides Bookkeeping
  version: "1.0.0"
---

# Tides Bookkeeping — Client Proposal

Generates a complete, on-brand proposal package for a prospective Tides client. Two primary deliverables, plus optional outreach.

## Deliverables
1. **Unlisted web page** at `proposals/<slug>.html` (share a link when a PDF can't be emailed).
2. **Branded Word doc** at `~/Downloads/Tides Bookkeeping - <Client> Proposal.docx` (export to PDF from Word; also the printable/attachable version).
3. *(Optional, offer them)* cover email, CPA note, and onboarding request — from `templates/companion-emails.md`.

## Fixed requirements — always true, never ask
- **Unlisted:** the page keeps `<meta name="robots" content="noindex, nofollow, noarchive">`. It's link-private, not password-protected — tell Dan that.
- **Brand:** Tides logo at top (`proposals/tides-logo.png`), teal/navy palette, Georgia serif headings, **dark-mode aware**, **print-ready**. Do not restyle — reuse the template CSS verbatim.
- **Footer contact:** `dan@tidesbookkeeping.com` + phone **(864) 559-2686** (`tel:+18645592686`).
- **Slug:** lowercase, hyphenated, from the business name (e.g. `pizza-bar`). Page lives at `proposals/<slug>.html` → `https://www.tidesbookkeeping.com/proposals/<slug>`.
- **Pricing model:** two-phase — a **one-time cleanup/catch-up** (50% deposit / 50% on completion) + a **monthly** service (month-to-month). Monthly begins on a clean **go-live date** (usually the 1st of the next month). Cleanup covers through the prior period; monthly covers go-live forward — **state the no-overlap explicitly** so the client never asks "am I paying twice?".
- **CPA framing:** if the client has a CPA/accountant, position Tides as the monthly engine that feeds them, **not** a replacement.
- **Deploy:** commit + push to `main` (Cloudflare auto-deploys) — this is standard for this repo, don't wait to be asked.
- **Confidentiality:** the page/doc hold the client's financials. Generate as local files + an unlisted URL. Never publish to a public/indexed host. Send the doc to Dan with a "keep to the client" note.

## Inputs to gather (ask only for what's missing)
- **Client:** business legal name, owner/contact first + full name, location, systems (accounting platform, payroll, POS, delivery, etc.).
- **Situation:** 1–2 sentences on where they're starting (the honest, non-alarmist framing).
- **Findings:** 3–4 concrete issues (each a short title + one line). Use real numbers when known.
- **Scope:** ~3 lines (cleanup → ongoing → CPA coordination).
- **Pricing:** cleanup one-time $ + monthly $/mo. If Dan doesn't give numbers, propose from the situation and confirm before deploying.
- **Dates:** proposal date, go-live date, cleanup window.
- **CPA:** name/firm if any.

If Dan hands over raw reports/exports instead of typed details, read them, draft the findings/pricing yourself, and confirm the numbers with him before deploying.

## Workflow

### 1. Confirm the essentials
Have: slug, client name, contact, pricing (cleanup + monthly), go-live date, 3–4 findings. If pricing or go-live is unstated, propose and confirm.

### 2. Build the web page
- Ensure `proposals/tides-logo.png` exists. If not, create it from the repo `logo.png`:
  trim non-white/non-transparent content → composite on white (~26px pad) → save `proposals/tides-logo.png`.
- Copy `templates/proposal-page.html` to `proposals/<slug>.html`. Replace every `{{TOKEN}}`. Duplicate the `.book` (findings), `.scope li`, `.incl li`, and `.steps li` blocks as needed. Keep the entire `<head>`/`<style>` and the inline SVG icons unchanged. The canonical filled example is `proposals/pizza-bar.html` — match its tone and density.
- Wrap key numbers in `<strong>`. Keep copy confident and plain, never alarmist. Number findings 01, 02, 03…

### 3. Build the Word doc
- Write a `content.json` (schema in `scripts/build_proposal_docx.py` header) to a temp path.
- Run from the repo root (so it finds `logo.png`):
  `python3 .claude/skills/proposal/scripts/build_proposal_docx.py <content.json> "$HOME/Downloads/Tides Bookkeeping - <Client> Proposal.docx"`
- `python-docx` and `Pillow` are required (already installed here).

### 4. Verify the page
- Serve the repo (`python3 -m http.server <port>`) and open `/proposals/<slug>.html` in the Browser pane.
- Screenshot **light and dark** (`resize_window colorScheme`). Confirm the logo reads in dark (white chip), pricing cards, billing note, and footer phone all render. Fix, then continue.

### 5. Deploy
- `git add proposals/<slug>.html proposals/tides-logo.png && git commit -m "Add unlisted client proposal page: <Client> at /proposals/<slug>" && git push origin main`
- Kill any local http.server you started.

### 6. Hand off
- Give Dan the **live URL**, the **.docx path**, and remind him to export the doc to PDF from Word.
- Offer the companion emails (fill `templates/companion-emails.md`), and offer to save the client to memory.

## Notes
- One page, self-contained, no external requests — matches the static site.
- Reuse `proposals/tides-logo.png` across all proposals; don't regenerate unless missing.
- Keep `pizza-bar.html` as the reference example; if the house style evolves, update `templates/proposal-page.html` too.
