/**
 * The notice shown on every page while the site is paused (SITE_LOCKED=true in the server .env).
 * Served straight from src/proxy.ts, so it needs no build output and works even if nothing else does:
 * one self-contained page, no scripts, no external files.
 *
 * Deliberately no <meta name="robots" content="noindex">: the pages are only paused, and the 503
 * status already tells search engines to come back later without dropping them from their index.
 */
export const SITE_LOCK_HTML = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Axion Index</title>
<style>
  :root { color-scheme: dark; }
  * { box-sizing: border-box; }
  html, body { height: 100%; }
  body {
    margin: 0;
    min-height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 32px 24px;
    background: #0B0B09;
    background-image: radial-gradient(60% 50% at 50% 0%, rgba(201,162,74,0.10), transparent 70%);
    color: #F7F6F3;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
  }
  .wrap { width: 100%; max-width: 560px; text-align: center; }
  .mark {
    font-size: 11px;
    letter-spacing: 0.42em;
    text-transform: uppercase;
    color: #C9A24A;
    margin: 0;
  }
  .rule {
    width: 48px;
    height: 1px;
    margin: 28px auto;
    background: rgba(201,162,74,0.55);
  }
  h1 {
    font-family: Georgia, "Times New Roman", serif;
    font-weight: 500;
    font-size: clamp(27px, 5.2vw, 38px);
    line-height: 1.25;
    margin: 0;
    color: #F7F6F3;
  }
  p {
    font-size: 15.5px;
    line-height: 1.7;
    margin: 18px 0 0;
    color: rgba(247,246,243,0.62);
  }
</style>
</head>
<body>
  <main class="wrap">
    <p class="mark">Axion&nbsp;Index</p>
    <div class="rule"></div>
    <h1>This site is temporarily unavailable.</h1>
    <p>It will be back online shortly. Please check back soon.</p>
  </main>
</body>
</html>`;
