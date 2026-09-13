import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { initializeControls } from '../src/scripts/controls.js';

const pages = readdirSync('dist', { recursive: true }).filter(file => file.endsWith('.html'));
const sitemap = [...readFileSync('dist/sitemap.xml', 'utf8').matchAll(/<loc>(.*?)<\/loc>/g)].map(([, url]) => url);
const titles = new Set();
const descriptions = new Set();
const canonicalURLs = [];
for (const page of pages) {
  const html = readFileSync(join('dist', page), 'utf8');
  const title = html.match(/<title>(.*?)<\/title>/)?.[1];
  const description = html.match(/name="description" content="([^"]+)"/)?.[1];
  assert(title && !titles.has(title), `${page}: unique, nonempty title`);
  assert(description && !descriptions.has(description), `${page}: unique, nonempty description`);
  titles.add(title);
  descriptions.add(description);
  if (page === '404.html') {
    assert(html.includes('name="robots" content="noindex, follow"'), '404 must not be indexed');
    assert(!html.includes('rel="canonical"'), '404 must not advertise a canonical page');
  } else {
    const canonical = `https://saco.dev/${page.replace(/(?:^|\/)index\.html$/, '').replace(/\.html$/, '')}`;
    assert(html.includes(`rel="canonical" href="${canonical}"`), `${page}: canonical URL`);
    assert(html.includes(`property="og:url" content="${canonical}"`), `${page}: sharing URL matches canonical`);
    assert(!html.includes('noindex'), `${page}: indexable`);
    canonicalURLs.push(canonical);
  }
  assert(html.includes('property="og:title"') && html.includes('name="twitter:title"'), `${page}: social titles`);
  assert(html.includes('property="og:image" content="https://saco.dev/brand/social.png"'), `${page}: social image`);
  assert(html.includes('property="og:image:alt"') && html.includes('name="twitter:image:alt"'), `${page}: social image descriptions`);
  assert.equal((html.match(/<h1(?:\s|>)/g) || []).length, 1, `${page}: one main heading`);
  assert(html.includes('name="description"'), `${page}: meta description`);
  assert(!/[—–]/.test(html), `${page}: plain punctuation`);
  assert(!/[↗→↓]/.test(html), `${page}: no decorative arrows`);
  assert(html.includes('id="main"') && html.includes('class="skip-link"'), `${page}: skip link`);
  for (const [, value] of html.matchAll(/(?:src|href)="(\/(?!\/)[^"]*)"/g)) {
    const url = new URL(value, 'https://saco.dev');
    const target = decodeURIComponent(url.pathname).replace(/^\//, '');
    assert(existsSync(join('dist', target)) || existsSync(join('dist', target, 'index.html')), `${page}: missing ${target}`);
  }
  for (const [, tag] of html.matchAll(/(<img\b[^>]*>)/g)) {
    assert(/\balt=/.test(tag) && /\bwidth=/.test(tag) && /\bheight=/.test(tag), `${page}: image alt text and dimensions`);
  }
  for (const [, id] of html.matchAll(/href="#([^"]+)"/g)) assert(html.includes(`id="${id}"`), `${page}: missing #${id}`);
}
assert.deepEqual(sitemap.sort(), canonicalURLs.sort(), 'Sitemap contains every indexable page exactly once');
assert(readFileSync('dist/robots.txt', 'utf8').includes('Sitemap: https://saco.dev/sitemap.xml'), 'Robots links to sitemap');
assert(!readdirSync('dist', { recursive: true }).some(file => file.endsWith('.DS_Store')), 'No Finder metadata in build');
const overview = readFileSync('dist/sacc/index.html', 'utf8');
const contest = readFileSync('dist/sacc/2026/index.html', 'utf8');
assert.equal((contest.match(/<details>/g) || []).length, 5, 'All five native FAQs render');
assert(overview.includes('Past competitions.') && overview.includes('href="/sacc/2026"'), 'SACC overview links to the historical edition');
assert(contest.includes('Past event') && contest.includes('datetime="2026-05-23"'), 'Archive clearly identifies the past event');
assert(contest.includes('rel="canonical" href="https://saco.dev/sacc/2026"'), 'Archive has its own canonical URL');
assert(contest.includes('href="/sacc" aria-current="location"'), 'Parent navigation stays active in the archive');
assert(readFileSync('dist/sitemap.xml', 'utf8').includes('<loc>https://saco.dev/sacc/2026</loc>'), 'Archive is included in the sitemap');
const application = readFileSync('dist/join/index.html', 'utf8');
assert(application.includes('1FAIpQLScCsQac2yaXawoFPRp8BFLs1nxJsvo1h_dX84hHB-YCC9LmFw'), 'Original application destination preserved');
const homepage = readFileSync('dist/index.html', 'utf8');
const organization = JSON.parse(homepage.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)?.[1] || 'null');
assert.equal(organization?.['@type'], 'Organization', 'Valid organization structured data');
assert.equal(organization.name, 'Seattle Area Coding Organization');
assert.equal(organization.url, 'https://saco.dev/');
assert(existsSync(join('dist', new URL(organization.logo).pathname)), 'Organization logo exists');
assert(homepage.includes('href="/sacc/2026"') && !homepage.includes('upcoming-events'), 'Homepage points to the past event archive');
for (const html of [homepage, overview, contest]) assert(!html.includes('1FAIpQLScdr-aDxrZaHumGMvKSUixdmFY9L9Hor2aEvaHHa-31qWTYFw'), 'Expired registration is not offered');
assert(!homepage.includes('interview-cake') && !homepage.includes('aops.png'), 'Homepage carousel contains only Gold and Platinum sponsors');
assert.equal((homepage.match(/src="\/photos\//g) || []).length, 1, 'Only one event photo on the homepage');
assert(!homepage.includes('/brand/mark.svg'), 'No repeated hero logo');

// Exercise the only client-side behavior, including blocked storage and Escape focus return.
const events = {};
const toggle = { setAttribute: (name, value) => toggle[name] = value, addEventListener: (name, fn) => toggle[name] = fn };
const menu = { open: false, contains: target => target === menu, querySelector: () => ({ focus: () => menu.focused = true }) };
const carousel = { dataset: { paused: 'false' } };
const carouselToggle = { 'aria-pressed': 'false', setAttribute(name, value) { this[name] = value; }, getAttribute(name) { return this[name]; }, addEventListener(name, fn) { this[name] = fn; } };
const document = {
  documentElement: { dataset: {} },
  querySelector: selector => ({ '.theme-toggle': toggle, '.mobile-menu': menu, '.carousel-toggle': carouselToggle, '.sponsor-carousel': carousel })[selector],
  addEventListener: (name, fn) => events[name] = fn,
};
const window = { matchMedia: () => ({ matches: true, addEventListener() {} }), localStorage: { setItem() { throw Error('Storage blocked'); } } };
initializeControls(document, window);
assert.equal(toggle['aria-label'], 'Switch to light theme');
toggle.click();
assert.equal(document.documentElement.dataset.theme, 'light');
assert.equal(toggle['aria-label'], 'Switch to dark theme');
toggle.click();
assert.equal(document.documentElement.dataset.theme, 'dark');
menu.open = true;
events.keydown({ key: 'Escape' });
assert(!menu.open && menu.focused, 'Escape closes menu and returns focus');
menu.open = true;
events.click({ target: menu });
assert(menu.open, 'Clicking inside keeps menu open');
events.click({ target: {} });
assert(!menu.open, 'Clicking outside closes menu');
carouselToggle.click();
assert.equal(carousel.dataset.paused, 'true');
assert.equal(carouselToggle.textContent, 'Play');
carouselToggle.click();
assert.equal(carousel.dataset.paused, 'false');
assert.equal(carouselToggle.textContent, 'Pause');

const bundles = readdirSync('dist/_astro').filter(file => file.endsWith('.js'));
const inlineScripts = [...readFileSync('dist/index.html', 'utf8').matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/g)].reduce((total, [, content]) => total + Buffer.byteLength(content), 0);
const bytes = inlineScripts + bundles.reduce((total, file) => total + readFileSync(join('dist/_astro', file)).length, 0);
assert(bytes < 5000, `Client JavaScript should stay small: ${bytes} bytes`);
console.log(`Passed: ${pages.length} pages, local links and assets, metadata, FAQs, application destination, theme/menu behavior. Client JS: ${bytes} bytes.`);
