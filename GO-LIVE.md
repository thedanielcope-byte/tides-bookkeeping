# Go-Live Checklist — tidesbookkeeping.com

Use this when you're ready to cut over from the GHL-hosted site to this Cloudflare Pages site.

## Order of operations

### 1. Cloudflare: Add custom domain
- Cloudflare Dashboard → Pages → `tides-bookkeeping` project
- Settings → Custom domains → Add custom domain
- Add `tidesbookkeeping.com` AND `www.tidesbookkeeping.com`
- Cloudflare will provide DNS records

### 2. DNS: Update at your registrar
- Log in to wherever tidesbookkeeping.com is registered
- Point the domain at Cloudflare (either nameservers or A/CNAME per Cloudflare's instructions)
- TTL may take up to 24h but usually propagates in minutes

### 3. Unblock search engines ⚠️ CRITICAL
This site is currently blocked from Google via `/_headers` while in review mode.
**Delete this file (or remove the X-Robots-Tag lines) before or immediately after DNS cutover:**

```bash
cd "~/Library/Mobile Documents/com~apple~CloudDocs/Claude/Code - Tides"
rm _headers
git add -A && git commit -m "Unblock search engines for live site" && git push
```

Verify after Cloudflare redeploys: visit `https://tidesbookkeeping.com` and check response headers. `X-Robots-Tag` should NOT be present.

### 4. Submit sitemap to Google Search Console
- Go to [search.google.com/search-console](https://search.google.com/search-console)
- Select property: `tidesbookkeeping.com` (already verified)
- Sitemaps → Add sitemap → `https://tidesbookkeeping.com/sitemap.xml` → Submit
- Use URL Inspection tool on top 10 priority pages, click "Request Indexing" on each

### 5. Set up Google Business Profile
- [business.google.com](https://business.google.com)
- Create/claim listing for Tides Bookkeeping LLC
- Add: address, phone (864) 559-2686, hours (Mon-Fri 9-5 ET), service categories, photos
- **Get first 5 reviews from real clients ASAP** — huge local SEO signal

### 6. Bing Webmaster Tools (bonus ~5-10% traffic)
- [bing.com/webmasters](https://www.bing.com/webmasters)
- Import from Google Search Console (1-click if already verified there)
- Submit sitemap

### 7. Citations & backlinks (first 2 weeks)
- Yelp business page
- BBB Greater South Carolina
- Greenville Chamber of Commerce listing
- Bookkeeping/accounting directories (FindABookkeeper, etc.)
- QuickBooks ProAdvisor profile
- Puzzle partner profile (if applicable)

### 8. Monitoring (first month)
- Check Google Search Console daily for index coverage & errors
- Check Analytics for organic traffic trends
- Fix any pages flagged with "crawled - not indexed"

---

## Fallback: What if something breaks?

- Old GHL site: still accessible at the GHL subdomain even after DNS points away
- Cloudflare Pages: previous deployments are kept — you can roll back instantly from the dashboard
- DNS: you can point back to GHL at the registrar and propagate within minutes
