const http = require('https');
const fs = require('fs');

async function fetchHtml(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ status: res.statusCode, data }));
    }).on('error', reject);
  });
}

function extractSeoInfo(html, url) {
  const getMatch = (regex) => {
    const match = html.match(regex);
    return match ? match[1] : null;
  };
  
  const getMatches = (regex) => {
    const matches = [...html.matchAll(regex)];
    return matches.map(m => m[1] || m[0]);
  };

  const title = getMatch(/<title[^>]*>([^<]*)<\/title>/i);
  const metaDesc = getMatch(/<meta\s+name="description"\s+content="([^"]*)"/i) || getMatch(/<meta\s+content="([^"]*)"\s+name="description"/i);
  const canonical = getMatch(/<link\s+rel="canonical"\s+href="([^"]*)"/i) || getMatch(/<link\s+href="([^"]*)"\s+rel="canonical"/i);
  const h1 = getMatch(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
  
  const ogTitle = getMatch(/<meta\s+property="og:title"\s+content="([^"]*)"/i);
  const ogDesc = getMatch(/<meta\s+property="og:description"\s+content="([^"]*)"/i);
  const robots = getMatch(/<meta\s+name="robots"\s+content="([^"]*)"/i);
  
  const jsonLdScripts = [...html.matchAll(/<script\s+type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi)];
  const jsonLd = jsonLdScripts.map(m => {
    try { return JSON.parse(m[1]); } catch(e) { return "Invalid JSON"; }
  });

  return {
    url,
    title,
    metaDesc,
    canonical,
    h1: h1 ? h1.trim().replace(/<[^>]*>?/gm, '') : null,
    ogTitle,
    ogDesc,
    robots,
    jsonLdCount: jsonLd.length,
    jsonLdTypes: jsonLd.map(j => j['@type'])
  };
}

async function run() {
  const urls = [
    'https://experthome168.com/',
    'https://experthome168.com/properties',
    'https://experthome168.com/portfolio',
    'https://experthome168.com/contact'
  ];

  console.log("=== SEO AUDIT SCRIPT ===");
  
  for (const url of urls) {
    console.log(`\nFetching ${url}...`);
    const { status, data } = await fetchHtml(url);
    console.log(`Status: ${status}`);
    const info = extractSeoInfo(data, url);
    console.log(JSON.stringify(info, null, 2));
  }
  
  // Fetch Sitemap
  console.log("\nFetching sitemap...");
  const sitemapRes = await fetchHtml('https://experthome168.com/sitemap.xml');
  console.log(`Sitemap Status: ${sitemapRes.status}`);
  const sitemapUrls = [...sitemapRes.data.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1]);
  const propertyUrls = sitemapUrls.filter(u => u.includes('/properties/')).slice(0, 3);
  
  console.log(`Found ${propertyUrls.length} property URLs to test:`);
  for (const url of propertyUrls) {
    console.log(`\nFetching ${url}...`);
    const { status, data } = await fetchHtml(url);
    console.log(`Status: ${status}`);
    const info = extractSeoInfo(data, url);
    console.log(JSON.stringify(info, null, 2));
  }
  
  // Fetch Robots
  console.log("\nFetching robots.txt...");
  const robotsRes = await fetchHtml('https://experthome168.com/robots.txt');
  console.log(`Robots Status: ${robotsRes.status}`);
  console.log(robotsRes.data.substring(0, 200));
}

run();
