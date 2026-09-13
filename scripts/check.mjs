import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { initializeControls } from '../src/scripts/controls.js';

const pages = ['index.html', 'about/index.html', 'sacc/index.html', 'sacc/2026/index.html', 'sponsors/index.html', 'join/index.html', '404.html'];
for (const page of pages) {
  const html = readFileSync(join('dist', page), 'utf8');
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
const overview = readFileSync('dist/sacc/index.html', 'utf8');
const contest = readFileSync('dist/sacc/2026/index.html', 'utf8');
assert.equal((contest.match(/<details>/g) || []).length, 6, 'All six native FAQs render');
assert(overview.includes('Past competitions.') && overview.includes('href="/sacc/2026"'), 'SACC overview links to the historical edition');
assert(contest.includes('Past event') && contest.includes('datetime="2026-05-23"'), 'Archive clearly identifies the past event');
assert(contest.includes('rel="canonical" href="https://saco.dev/sacc/2026"'), 'Archive has its own canonical URL');
assert(contest.includes('href="/sacc" aria-current="location"'), 'Parent navigation stays active in the archive');
assert(readFileSync('dist/sitemap.xml', 'utf8').includes('<loc>https://saco.dev/sacc/2026</loc>'), 'Archive is included in the sitemap');
const application = readFileSync('dist/join/index.html', 'utf8');
assert(application.includes('1FAIpQLScCsQac2yaXawoFPRp8BFLs1nxJsvo1h_dX84hHB-YCC9LmFw'), 'Original application destination preserved');
const homepage = readFileSync('dist/index.html', 'utf8');
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
