// Cloudflare Pages Function — dynamic blog posts served from the Supabase blog-feed.
// Renders server-side at /blog/<slug> using the exact static blog template shell.
// If the post is not found (or any error), falls through to static assets / 404.

const FEED_BASE = 'https://wdvolamasztetwpitbwg.supabase.co/functions/v1/blog-feed';
const COMPANY = 'tides';
const SITE = 'https://www.tidesbookkeeping.com';
const DEFAULT_IMAGE = 'https://www.tidesbookkeeping.com/logo.png';

function esc(s) {
  return String(s == null ? '' : s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function fmtDate(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  if (isNaN(d.getTime())) return '';
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' });
}

export async function onRequestGet(context) {
  const { slug } = context.params;
  if (!slug) return context.next();

  try {
    const url = `${FEED_BASE}?company=${encodeURIComponent(COMPANY)}&slug=${encodeURIComponent(slug)}`;
    const res = await fetch(url, { headers: { accept: 'application/json' } });
    if (res.status !== 200) return context.next();

    const data = await res.json();
    if (!data || !data.ok || !data.post) return context.next();

    const post = data.post;
    const title = post.title || 'Untitled';
    const metaTitle = `${post.seo_title || post.title || 'Untitled'} | Tides Blog`;
    const metaDesc = post.seo_description || post.excerpt || '';
    const canonical = `${SITE}/blog/${slug}`;
    const image = post.cover_image || DEFAULT_IMAGE;
    const author = post.author || 'Tides Bookkeeping';
    const published = post.publish_at || '';
    const humanDate = fmtDate(published);
    const body = post.body || '';

    const jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: title,
      description: metaDesc,
      image: image,
      datePublished: published,
      author: { '@type': 'Organization', name: author },
      mainEntityOfPage: canonical,
    };

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${esc(metaTitle)}</title>
  <meta name="description" content="${esc(metaDesc)}" />
  <link rel="canonical" href="${esc(canonical)}" />
  <meta property="og:type" content="article" />
  <meta property="og:title" content="${esc(title)}" />
  <meta property="og:description" content="${esc(metaDesc)}" />
  <meta property="og:url" content="${esc(canonical)}" />
  <meta property="og:image" content="${esc(image)}" />
  <meta property="og:site_name" content="Tides Bookkeeping" />
  <meta property="article:published_time" content="${esc(published)}" />
  <meta property="article:author" content="${esc(author)}" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${esc(title)}" />
  <meta name="twitter:description" content="${esc(metaDesc)}" />
  <meta name="twitter:image" content="${esc(image)}" />
  <link rel="icon" type="image/png" href="/logo.png" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
  <style>
    /* ── TOKENS ─────────────────────────────────────── */
    :root {
      --teal:    #41cfd0;
      --teal-lt: #e6f9f9;
      --blue:    #66c1ee;
      --blue-lt: #e8f4fd;
      --navy:    #215197;
      --navy-dk: #163872;
      --ink:     #0f1c2e;
      --body:    #4a5568;
      --muted:   #94a3b8;
      --border:  #e2eaf3;
      --bg:      #ffffff;
      --bg-alt:  #f7fbff;
      --shadow:  0 1px 3px rgba(15,28,46,.06), 0 4px 16px rgba(15,28,46,.08);
      --shadow-lg: 0 8px 40px rgba(15,28,46,.12);
      --r:       16px;
      --r-sm:    10px;
    }

    /* ── RESET ──────────────────────────────────────── */
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    html { scroll-behavior: smooth; }
    body { font-family: 'Inter', sans-serif; background: var(--bg); color: var(--ink); line-height: 1.6; overflow-x: hidden; }
    img { max-width: 100%; display: block; }
    a { text-decoration: none; color: inherit; }

    /* ── TYPE ───────────────────────────────────────── */
    .display { font-family: 'Bebas Neue', sans-serif; letter-spacing: 0.02em; line-height: 0.95; }
    h2.display { font-size: clamp(2.4rem, 5vw, 4rem); }
    h3 { font-size: 1.1rem; font-weight: 700; color: var(--ink); }
    p { color: var(--body); }
    .eyebrow {
      display: inline-flex; align-items: center; gap: 6px;
      font-size: 0.72rem; font-weight: 700; letter-spacing: .12em;
      text-transform: uppercase; color: var(--teal);
      background: var(--teal-lt); border: 1px solid rgba(65,207,208,.25);
      padding: 5px 12px; border-radius: 50px; margin-bottom: 1.25rem;
    }
    .gradient-text {
      background: linear-gradient(135deg, var(--teal) 0%, var(--blue) 100%);
      -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
    }

    /* ── LAYOUT ─────────────────────────────────────── */
    .container { max-width: 1180px; margin: 0 auto; padding: 0 2rem; }
    .section { padding: 96px 0; }
    .section-alt { background: var(--bg-alt); }

    /* ── BUTTONS ────────────────────────────────────── */
    .btn {
      display: inline-flex; align-items: center; gap: .5rem;
      padding: .85rem 1.75rem; border-radius: 50px;
      font-weight: 600; font-size: .9rem; cursor: pointer;
      transition: all .2s ease; border: 2px solid transparent;
    }
    .btn-primary { background: var(--navy); color: #fff; }
    .btn-primary:hover { background: var(--navy-dk); transform: translateY(-2px); box-shadow: 0 8px 24px rgba(33,81,151,.3); }
    .btn-teal { background: var(--teal); color: var(--ink); font-weight: 700; }
    .btn-teal:hover { background: #38bfc0; transform: translateY(-2px); box-shadow: 0 8px 24px rgba(65,207,208,.4); }
    .btn-outline { border-color: var(--border); color: var(--ink); background: #fff; }
    .btn-outline:hover { border-color: var(--navy); color: var(--navy); }
    .btn-outline-white { border-color: rgba(255,255,255,.35); color: #fff; }
    .btn-outline-white:hover { border-color: #fff; background: rgba(255,255,255,.08); }
    .btn-lg { padding: 1rem 2.2rem; font-size: 1rem; }

    /* ── NAV ────────────────────────────────────────── */
    .nav-wrap {
      position: sticky; top: 0; z-index: 200;
      background: rgba(255,255,255,.92); backdrop-filter: blur(20px);
      border-bottom: 1px solid var(--border);
    }
    .nav-inner {
      display: flex; align-items: center; justify-content: space-between;
      padding: 1rem 2rem; max-width: 1180px; margin: 0 auto;
    }
    .nav-logo img { height: 44px; }
    .nav-links { display: flex; align-items: center; gap: 2rem; list-style: none; }
    .nav-links a { font-size: .87rem; font-weight: 500; color: var(--body); transition: color .2s; }
    .nav-links a:hover, .nav-links a.active { color: var(--navy); }
    .nav-links a.active { font-weight: 700; }
    .nav-cta { display: flex; align-items: center; gap: .75rem; }
    .hamburger {
      display: none; flex-direction: column; gap: 5px;
      background: none; border: none; cursor: pointer; padding: 4px;
    }
    .hamburger span {
      width: 24px; height: 2px; background: var(--ink); border-radius: 2px;
      transition: all .25s;
    }
    .hamburger.open span:nth-child(1) { transform: rotate(45deg) translate(5px, 5px); }
    .hamburger.open span:nth-child(2) { opacity: 0; }
    .hamburger.open span:nth-child(3) { transform: rotate(-45deg) translate(5px, -5px); }

    /* ── BREADCRUMB ─────────────────────────────────── */
    .breadcrumb {
      background: var(--bg-alt); border-bottom: 1px solid var(--border);
      padding: .75rem 0;
    }
    .breadcrumb-inner {
      display: flex; align-items: center; gap: .5rem;
      max-width: 1180px; margin: 0 auto; padding: 0 2rem;
      font-size: .78rem; color: var(--muted);
    }
    .breadcrumb-inner a { color: var(--muted); transition: color .2s; }
    .breadcrumb-inner a:hover { color: var(--navy); }
    .breadcrumb-sep { color: var(--border); }
    .breadcrumb-current { color: var(--navy); font-weight: 600; }

    /* ── PAGE HERO ──────────────────────────────────── */
    .page-hero {
      padding: 88px 0 72px;
      background: #fff;
      position: relative; overflow: hidden;
    }
    .page-hero::before {
      content: ''; position: absolute; inset: 0;
      background:
        radial-gradient(ellipse 60% 70% at 85% 20%, rgba(65,207,208,.1) 0%, transparent 60%),
        radial-gradient(ellipse 50% 50% at 15% 80%, rgba(102,193,238,.08) 0%, transparent 60%);
    }
    .page-hero-inner {
      position: relative; z-index: 1;
      max-width: 700px; margin: 0 auto; text-align: center;
    }
    .page-hero h1 {
      font-size: clamp(3rem, 6vw, 5rem);
      line-height: .93; margin-bottom: 1.5rem; color: var(--ink);
    }
    .page-hero p {
      font-size: 1.1rem; line-height: 1.75; color: var(--body);
      max-width: 560px; margin: 0 auto;
    }

    /* ── ARTICLE CONTENT ────────────────────────────── */
    .article-body h2 { font-family: 'Bebas Neue', sans-serif; font-weight: 400; letter-spacing: .02em; font-size: 1.9rem; color: var(--navy); margin-top: 2.5rem; margin-bottom: .75rem; }
    .article-body h3 { font-size: 1.25rem; color: var(--ink); margin-top: 2rem; margin-bottom: .6rem; }
    .article-body p { margin-bottom: 1rem; line-height: 1.75; }
    .article-body ul, .article-body ol { padding-left: 1.5rem; margin-bottom: 1.25rem; }
    .article-body li { margin-bottom: .5rem; }
    .article-body a { color: var(--navy); font-weight: 600; text-decoration: underline; }
    .article-body img { border-radius: var(--r); margin: 1.5rem 0; }
    .article-body table { width: 100%; border-collapse: collapse; font-size: .92rem; margin: 1.5rem 0; }
    .article-body th, .article-body td { padding: .75rem 1rem; border-bottom: 1px solid var(--border); text-align: left; }
    .article-body th { background: var(--bg-alt); }

    /* ── FOOTER ─────────────────────────────────────── */
    .footer {
      background: var(--ink); color: #fff;
      padding: 64px 0 32px;
    }
    .footer-grid {
      display: grid; grid-template-columns: 1.6fr 1fr 1fr 1.2fr;
      gap: 3rem; margin-bottom: 3rem;
    }
    .footer-logo img { height: 40px; margin-bottom: 1.25rem; filter: brightness(0) invert(1); }
    .footer-brand p { font-size: .84rem; color: rgba(255,255,255,.45); line-height: 1.7; max-width: 280px; margin-bottom: 1.5rem; }
    .footer-social { display: flex; gap: .6rem; }
    .social-btn {
      width: 34px; height: 34px; border-radius: 8px;
      background: rgba(255,255,255,.06); border: 1px solid rgba(255,255,255,.1);
      display: flex; align-items: center; justify-content: center;
      font-size: .8rem; color: rgba(255,255,255,.5); transition: all .2s;
    }
    .social-btn:hover { background: rgba(65,207,208,.15); border-color: var(--teal); color: var(--teal); }
    .footer-col h4 {
      font-size: .72rem; font-weight: 700; text-transform: uppercase; letter-spacing: .1em;
      color: rgba(255,255,255,.35); margin-bottom: 1.25rem;
    }
    .footer-links { list-style: none; }
    .footer-links li { margin-bottom: .55rem; }
    .footer-links a { font-size: .84rem; color: rgba(255,255,255,.5); transition: color .2s; }
    .footer-links a:hover { color: var(--teal); }
    .footer-contact p { font-size: .84rem; color: rgba(255,255,255,.5); margin-bottom: .5rem; display: flex; align-items: center; gap: .5rem; }
    .footer-bottom {
      border-top: 1px solid rgba(255,255,255,.07);
      padding-top: 1.5rem; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem;
    }
    .footer-bottom p { font-size: .78rem; color: rgba(255,255,255,.25); margin: 0; }
    .footer-bottom-links { display: flex; gap: 2rem; list-style: none; }
    .footer-bottom-links a { font-size: .78rem; color: rgba(255,255,255,.25); transition: color .2s; }
    .footer-bottom-links a:hover { color: var(--teal); }

    /* ── RESPONSIVE ─────────────────────────────────── */
    @media (max-width: 900px) {
      .footer-grid { grid-template-columns: 1fr 1fr; gap: 2rem; }
    }
    @media (max-width: 768px) {
      .nav-links, .nav-cta { display: none; }
      .hamburger { display: flex; }
      .nav-links.open {
        display: flex; flex-direction: column; position: fixed;
        inset: 0; background: #fff; z-index: 199; list-style: none;
        justify-content: center; align-items: center; gap: 2.25rem;
      }
      .nav-links.open a { font-size: 1.15rem; font-weight: 600; color: var(--ink); }
    }
    @media (max-width: 640px) {
      .container { padding: 0 1.25rem; }
      .section { padding: 56px 0; }
      .nav-inner { padding: .875rem 1.25rem; }
      h2.display { font-size: clamp(2rem, 9vw, 3rem); }
      .footer-grid { grid-template-columns: 1fr; gap: 2rem; }
      .footer-bottom { flex-direction: column; text-align: center; gap: .75rem; }
      .footer-bottom-links { justify-content: center; flex-wrap: wrap; gap: 1rem; }
    }

/* mobile-menu-fix-start */
@media (max-width: 768px) {
  /* Kill stacking context on nav-wrap when menu is open */
  body.menu-open .nav-wrap {
    backdrop-filter: none !important;
    -webkit-backdrop-filter: none !important;
  }
  /* Bulletproof full-screen mobile menu overlay */
  .nav-links.open {
    display: flex !important;
    flex-direction: column !important;
    position: fixed !important;
    top: 0 !important;
    left: 0 !important;
    right: 0 !important;
    bottom: 0 !important;
    width: 100vw !important;
    height: 100vh !important;
    max-width: 100vw !important;
    background: #ffffff !important;
    z-index: 9999 !important;
    list-style: none !important;
    justify-content: center !important;
    align-items: center !important;
    gap: 1.5rem !important;
    margin: 0 !important;
    padding: 2rem !important;
    overflow-y: auto !important;
  }
  .nav-links.open a {
    font-size: 1.25rem !important;
    font-weight: 600 !important;
    color: var(--ink) !important;
    padding: .75rem 1.5rem !important;
    display: block !important;
  }
  .nav-links.open li {
    list-style: none !important;
  }
  /* Hamburger sits on top of overlay */
  .hamburger {
    z-index: 10000 !important;
    position: relative;
  }
  /* Prevent horizontal scroll site-wide on mobile */
  html, body {
    overflow-x: hidden !important;
    max-width: 100vw !important;
  }
}
/* mobile-menu-fix-end */

    .nav-dd{position:relative;}
    .nav-dd-menu{display:none;position:absolute;top:100%;left:0;margin:0;padding:.4rem;list-style:none;background:#fff;border:1px solid var(--border);border-radius:10px;box-shadow:0 10px 30px rgba(15,28,46,.12);min-width:180px;z-index:250;}
    .nav-dd:hover>.nav-dd-menu,.nav-dd:focus-within>.nav-dd-menu{display:block;}
    .nav-dd-menu li{margin:0;}
    .nav-dd-menu a{display:block;padding:.5rem .75rem;border-radius:6px;white-space:nowrap;}
    .nav-dd-menu a:hover{background:var(--teal-lt);color:var(--navy);}
    .nav-dd-caret{font-size:.7em;opacity:.65;}
    .nav-links.open .nav-dd-menu{display:block;position:static;box-shadow:none;border:none;background:transparent;padding:.15rem 0 .15rem 1rem;min-width:0;}
  </style>
  <!-- Google tag (gtag.js) -->
  <script async src="https://www.googletagmanager.com/gtag/js?id=G-JBFJKD962N"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-JBFJKD962N');
  </script>

  <!-- Schema.org Structured Data -->
  <script type="application/ld+json">${JSON.stringify(jsonLd)}</script>
</head>
<body>

<!-- NAV -->
<nav class="nav-wrap">
  <div class="nav-inner">
    <div class="nav-logo"><a href="/index.html"><img src="/logo.png" alt="Tides Bookkeeping" /></a></div>
    <ul class="nav-links" id="navLinks">
      <li><a href="/index.html#how-it-works">How It Works</a></li>
      <li><a href="/services.html">Services</a></li>
      <li><a href="/who-we-serve.html">Who We Serve</a></li>
      <li class="nav-dd"><a href="/about.html">About<span class="nav-dd-caret"> ▾</span></a><ul class="nav-dd-menu"><li><a href="/about.html">About Us</a></li><li><a href="/contact.html">Contact Us</a></li></ul></li>
      <li><a href="/pricing">Pricing</a></li><li class="nav-dd"><a href="/tools">Resources<span class="nav-dd-caret"> ▾</span></a><ul class="nav-dd-menu"><li><a href="/tools">Free Tools</a></li><li><a href="/glossary">Glossary</a></li><li><a href="/small-business-bookkeeping-guide">Bookkeeping Guide</a></li></ul></li>
      <li><a href="/blog" class="active">Blog</a></li>
    </ul>
    <div class="nav-cta">
      <a href="https://portal.tidesbookkeeping.com" class="btn btn-outline">Sign In</a>
      <a href="/schedule.html" class="btn btn-primary">Book Appointment</a>
    </div>
    <button class="hamburger" id="hamburger" aria-label="Open menu">
      <span></span><span></span><span></span>
    </button>
  </div>
</nav>

<!-- BREADCRUMB -->
<div class="breadcrumb">
  <div class="breadcrumb-inner">
    <a href="/index.html">Home</a>
    <span class="breadcrumb-sep">›</span>
    <a href="/blog">Blog</a>
    <span class="breadcrumb-sep">›</span>
    <span class="breadcrumb-current">${esc(title)}</span>
  </div>
</div>

<!-- ARTICLE HERO -->
<section class="page-hero" style="padding:48px 0 16px;">
  <div class="container" style="max-width:760px;">
    <div class="eyebrow">
      <span style="width:6px;height:6px;border-radius:50%;background:var(--teal);"></span>
      Blog
    </div>
    <h1 class="display" style="font-size:clamp(2.2rem,5vw,3.6rem);line-height:1.05;margin-bottom:1rem;">${esc(title)}</h1>
    <div style="display:flex;gap:1.25rem;align-items:center;color:var(--muted);font-size:.86rem;margin-top:1.25rem;flex-wrap:wrap;">
      <span style="display:flex;align-items:center;gap:.4rem;">
        <span style="width:28px;height:28px;border-radius:50%;background:var(--teal-lt);display:inline-flex;align-items:center;justify-content:center;font-size:.8rem;">${esc((author || 'T').charAt(0).toUpperCase())}</span>
        ${esc(author)}
      </span>
      ${humanDate ? `<span>·</span>\n      <time datetime="${esc(published)}">${esc(humanDate)}</time>` : ''}
    </div>
  </div>
</section>

<!-- ARTICLE BODY -->
<article class="section" style="padding:24px 0 64px;">
  <div class="container article-body" style="max-width:740px;">
    ${post.cover_image ? `<img src="${esc(post.cover_image)}" alt="${esc(title)}" style="width:100%;border-radius:var(--r);margin-bottom:2rem;" />` : ''}
    ${body}
  </div>
</article>

<!-- FOOTER -->
<footer class="footer">
  <div class="container">
    <div class="footer-grid">
      <div class="footer-brand">
        <div class="footer-logo"><a href="/index.html"><img src="/logo.png" alt="Tides Bookkeeping" /></a></div>
        <p>Remote bookkeeping and financial services for small businesses nationwide. Clean books. Clear numbers. Confident decisions.</p>
        <div class="footer-social">
          <a href="https://www.linkedin.com/company/tides-bookkeeping" target="_blank" rel="noopener" class="social-btn">in</a>
          <a href="https://www.facebook.com/thetidesbookkeeping" target="_blank" rel="noopener" class="social-btn">f</a>
          <a href="https://www.instagram.com/tidesbookkeeping/" target="_blank" rel="noopener" class="social-btn">ig</a>
        </div>
      </div>
      <div class="footer-col">
        <h4>Services</h4>
        <ul class="footer-links">
          <li><a href="/service-monthly-bookkeeping.html">Monthly Bookkeeping</a></li>
          <li><a href="/service-catchup-bookkeeping.html">Catch-Up Bookkeeping</a></li>
          <li><a href="/service-payroll.html">Payroll Support</a></li>
          <li><a href="/service-financial-reporting.html">Financial Reporting</a></li>
          <li><a href="/service-bank-reconciliation.html">Bank Reconciliation</a></li>
          <li><a href="/services.html">View All Services →</a></li>
        </ul>
      </div>
      <div class="footer-col">
        <h4>Who We Serve</h4>
        <ul class="footer-links">
          <li><a href="/industry-real-estate.html">Real Estate</a></li>
          <li><a href="/industry-contractors-trades.html">Contractors &amp; Trades</a></li>
          <li><a href="/industry-restaurants-bars.html">Restaurants &amp; Bars</a></li>
          <li><a href="/industry-healthcare.html">Healthcare Practices</a></li>
          <li><a href="/industry-professional-services.html">Professional Services</a></li>
          <li><a href="/industry-ecommerce-retail.html">E-Commerce &amp; Retail</a></li>
          <li><a href="/who-we-serve.html">All Industries →</a></li>
          <li><a href="/areas-we-serve.html">Areas We Serve</a></li>
        </ul>
      </div>
      <div class="footer-contact footer-col">
        <h4>Contact</h4>
        <p>📧 support@tidesbookkeeping.com</p>
        <p>📞 (864) 559-2686</p>
        <p>📍 Greenville, South Carolina</p>
        <div style="margin-top:1.25rem;display:flex;flex-direction:column;gap:.6rem;">
          <a href="/contact.html" class="btn btn-outline-white" style="font-size:.82rem;padding:.65rem 1.4rem;justify-content:center;">Contact Us →</a>
          <a href="/schedule.html" class="btn btn-teal" style="font-size:.82rem;padding:.65rem 1.4rem;">Book a Free Call</a>
        </div>
      </div>
    </div>
    <div class="footer-bottom">
      <p>© 2026 Tides Bookkeeping LLC. All rights reserved.</p>
      <ul class="footer-bottom-links">
        <li><a href="/privacy.html">Privacy Policy</a></li>
        <li><a href="/terms.html">Terms of Service</a></li>
        <li><a href="/sitemap.xml">Sitemap</a></li>
      </ul>
    </div>
  </div>
</footer>

<script>
/* mobile-menu-js-fix-start */
(function(){
  const btn = document.getElementById('hamburger');
  const links = document.querySelector('.nav-links');
  if (!btn || !links) return;
  const close = () => {
    links.classList.remove('open');
    btn.classList.remove('open');
    document.body.classList.remove('menu-open');
    document.body.style.overflow = '';
  };
  btn.addEventListener('click', () => {
    const open = links.classList.toggle('open');
    btn.classList.toggle('open', open);
    document.body.classList.toggle('menu-open', open);
    document.body.style.overflow = open ? 'hidden' : '';
  });
  links.querySelectorAll('a').forEach(a => { a.addEventListener('click', close); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });
})();
/* mobile-menu-js-fix-end */
</script>

<!--Start of Crisp Chatbox-->
<script type="text/javascript">window.$crisp=[];window.CRISP_WEBSITE_ID="63ba78f5-feea-49e7-9a4f-df3435912271";(function(){d=document;s=d.createElement("script");s.src="https://client.crisp.chat/l.js";s.async=1;d.getElementsByTagName("head")[0].appendChild(s);})();</script>
<!--End of Crisp Chatbox-->
</body>
</html>`;

    return new Response(html, {
      headers: {
        'content-type': 'text/html; charset=utf-8',
        'cache-control': 'public, max-age=300',
      },
    });
  } catch (err) {
    return context.next();
  }
}
