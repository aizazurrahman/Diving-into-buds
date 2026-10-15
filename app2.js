const GEOAPIFY_KEY = '79a958030a5b49e191bdf89215ce9710';

const GOOGLE_PLACES_KEY = '';

let placesOff = false;

const geoMemCache = {}, poolMemCache = {};

const REGION_CUISINES = {
hyderabad: [ 'biryani', 'hyderabadi', 'deccan', 'indian', 'kebab', 'mughlai' ],
southasia: [ 'indian', 'biryani', 'punjabi', 'bengali', 'sri lankan', 'nepali', 'pakistani', 'curry' ],
eastasia: [ 'chinese', 'japanese', 'korean', 'thai', 'vietnamese', 'asian', 'noodle', 'sushi', 'ramen', 'malaysian', 'indonesian' ],
middleeast: [ 'lebanese', 'arab', 'turkish', 'persian', 'middle eastern', 'mediterranean', 'kebab', 'egyptian', 'moroccan' ],
europe: [ 'italian', 'french', 'spanish', 'greek', 'mediterranean', 'german', 'polish', 'european', 'pizza', 'portuguese' ],
africa: [ 'ethiopian', 'african', 'nigerian', 'moroccan', 'south african', 'egyptian', 'kenyan', 'ghanaian' ],
latinamerica: [ 'mexican', 'peruvian', 'brazilian', 'argentinian', 'colombian', 'cuban', 'latin', 'taco', 'caribbean' ],
unitedstates: [ 'american', 'burger', 'bbq', 'barbecue', 'southern', 'cajun', 'diner', 'steakhouse', 'tex-mex' ],
oceania: [ 'australian', 'pacific', 'cafe', 'bakery', 'kiwi' ]
};

async function geoCity(city) {
if (geoMemCache[city]) return geoMemCache[city];
const lsKey = 'dib_geo_v1_' + city;
try {
const c = JSON.parse(localStorage.getItem(lsKey) || 'null');
if (c && c.placeId) {
geoMemCache[city] = c;
return c;
}
} catch (e) {}
const d = await fetchJsonTimeout(`https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(city)}&type=city&format=json&limit=1&apiKey=${GEOAPIFY_KEY}`, 6e3);
const r = d && d.results && d.results[0];
if (!r || !r.place_id) throw new Error('geocode miss');
const out = {
placeId: r.place_id,
lon: r.lon,
lat: r.lat
};
geoMemCache[city] = out;
try {
localStorage.setItem(lsKey, JSON.stringify(out));
} catch (e) {}
return out;
}

async function cityPool(city) {
if (poolMemCache[city]) return poolMemCache[city];
try {
const hit = JSON.parse(localStorage.getItem('dib_pool_v1_' + city) || 'null');
if (hit && hit.t && Date.now() - hit.t < 864e5 && Array.isArray(hit.pool) && hit.pool.length) {
poolMemCache[city] = hit.pool;
return hit.pool;
}
} catch (e) {}
const g = await geoCity(city);
const cats = 'catering.restaurant,catering.cafe,catering.fast_food';
const page = async off => {
const d = await fetchJsonTimeout(`https://api.geoapify.com/v2/places?categories=${cats}&filter=place:${g.placeId}&limit=500&offset=${off}&apiKey=${GEOAPIFY_KEY}`, 8e3);
return d && d.features || [];
};
let feats = await page(0);
if (feats.length >= 500) {
const more = await Promise.all([ page(500), page(1e3) ]);
feats = feats.concat(more[0], more[1]);
}
if (!feats.length) {
const d = await fetchJsonTimeout(`https://api.geoapify.com/v2/places?categories=${cats}&filter=circle:${g.lon},${g.lat},12000&limit=500&apiKey=${GEOAPIFY_KEY}`, 8e3);
feats = d && d.features || [];
}
const seenPlace = new Set;
const pool = feats.map(f => {
const p = f.properties || {}, raw = p.datasource && p.datasource.raw || {};
const areaRaw = (p.address_line2 || '').split(',')[0].trim();
return {
name: p.name || '',
area: p.suburb || p.district || (areaRaw && areaRaw.toLowerCase() !== city.split(',')[0].toLowerCase() ? areaRaw : '') || '',
cuisine: (raw.cuisine || '').toLowerCase(),
cats: (p.categories || []).join(' ').toLowerCase(),
website: raw.website || p.website || '',
distKm: typeof p.lat === 'number' && typeof p.lon === 'number' ? Math.hypot((p.lon - g.lon) * 85, (p.lat - g.lat) * 111) : 0
};
}).filter(x => {
if (!x.name) return false;
const k = x.name + '|' + x.area;
if (seenPlace.has(k)) return false;
seenPlace.add(k);
return true;
});
poolMemCache[city] = pool;
try {
localStorage.setItem('dib_pool_v1_' + city, JSON.stringify({
t: Date.now(),
pool: pool
}));
} catch (e) {}
return pool;
}

function dishNameHit(dishName, placeName) {
const stop = new Set([ 'style', 'with', 'and', 'the' ]);
const toks = String(dishName || '').toLowerCase().replace(/[^a-z ]/g, ' ').split(/\s+/).filter(w => w.length >= 4 && !stop.has(w));
const nm = String(placeName || '').toLowerCase();
return toks.some(t => nm.includes(t));
}

function cleanArea(a) {
return String(a || '').replace(/^Ward\s+\d+\s+/i, '').replace(/\s+mandal$/i, '').trim();
}

const REGION_PRETTY = {
hyderabad: 'Hyderabadi',
southasia: 'South Asian',
eastasia: 'East Asian',
middleeast: 'Middle Eastern',
europe: 'European',
africa: 'African',
latinamerica: 'Latin American',
unitedstates: 'American',
oceania: 'Pacific'
};

function dishPlaceFor(dishName, pool, usedCounts, areaCounts) {
const rec = RECS.find(x => x.dish === dishName) || {};
const stop = new Set([ 'style', 'with', 'and', 'the' ]);
const toks = dishName.toLowerCase().replace(/[^a-z ]/g, ' ').split(/\s+/).filter(w => w.length >= 4 && !stop.has(w));
const cuis = REGION_CUISINES[rec.region] || [];
let best = null, bestScore = 0;
pool.forEach(p => {
if (usedCounts && (usedCounts.get(p.name) || 0) >= 2) return;
const nm = p.name.toLowerCase();
let sc = 0;
toks.forEach(t => {
if (nm.includes(t)) sc += 5;
});
if (cuis.some(c => nm.includes(c) || p.cuisine.includes(c) || p.cats.includes(c))) sc += 2;
if (p.website) sc += .5;
sc -= Math.min(p.distKm || 0, 20) * .02;
if (areaCounts && p.area && (areaCounts.get(p.area) || 0) >= 2) sc -= 1.5;
if (sc > bestScore) {
bestScore = sc;
best = p;
}
});
return bestScore >= 2 ? best : null;
}

async function upgradePlaces(res) {
if (!GEOAPIFY_KEY || placesOff || !res || !res.city) return 0;
try {
const pool = await cityPool(res.city);
if (!pool.length) return 0;
let any = 0;
const usedCounts = new Map;
const areaCounts = new Map;
document.querySelectorAll('#profileRecs .r-place').forEach(a => {
if (a.dataset.places) return;
const p = dishPlaceFor(a.dataset.dish || '', pool, usedCounts, areaCounts);
if (p) {
const area = cleanArea(p.area);
if (dishNameHit(a.dataset.dish || '', p.name)) {
a.innerHTML = `📍 ${p.name}${area ? `<small>${area}</small>` : ''}`;
a.classList.remove('generic');
a.classList.add('found');
} else {
const rec = RECS.find(x => x.dish === (a.dataset.dish || '')) || {};
const lbl = REGION_PRETTY[rec.region] || 'Local';
a.innerHTML = `📍 ${p.name}<small>${area ? area + ' · ' : ''}${lbl} place nearby</small>`;
}
a.href = 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(p.name + ' ' + res.city);
a.dataset.places = 'geoapify';
usedCounts.set(p.name, (usedCounts.get(p.name) || 0) + 1);
if (p.area) areaCounts.set(p.area, (areaCounts.get(p.area) || 0) + 1);
any++;
}
});
return any;
} catch (e) {
placesOff = true;
return 0;
}
}

function appendPlacesAttr(googleUsed, geoapifyUsed) {
if (document.querySelector('.places-attr')) return;
const seg = [];
if (geoapifyUsed) seg.push('Restaurant picks from OpenStreetMap data · Powered by <a href="https://www.geoapify.com/" target="_blank" rel="noopener">Geoapify</a> · <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">© OpenStreetMap contributors</a>');
if (googleUsed) seg.push((geoapifyUsed ? '' : 'Restaurant picks · ') + 'Ratings by Google');
if (!seg.length) return;
const d = document.createElement('p');
d.className = 'places-attr';
d.innerHTML = seg.join(' · ');
const host = $('profileRecs');
if (host && host.parentNode) host.parentNode.insertBefore(d, host.nextSibling);
}

async function upgradeAllPlaces(res) {
let g = 0, a = 0;
try {
g = await upgradePlacesGoogle(res);
} catch (e) {}
try {
a = await upgradePlaces(res);
} catch (e) {}
if (g + a > 0) appendPlacesAttr(g > 0, a > 0);
const host = $('profileRecs');
if (host && host.parentNode && res && res.city) {
let note = $('placesNote');
if (g + a === 0) {
if (!note) {
note = document.createElement('p');
note.id = 'placesNote';
note.className = 'places-note';
host.parentNode.insertBefore(note, host);
}
note.textContent = `We couldn't match specific places in ${res.city.split(',')[0]} for these dishes yet — every card still opens a live map search for the dish.`;
note.hidden = false;
} else if (note) note.hidden = true;
}
}

function gFame(p) {
return (p.rating || 0) * Math.log10((p.userRatingCount || 0) + 1);
}

function gPickBest(places) {
const ps = (places || []).filter(p => p && p.displayName && p.displayName.text);
if (!ps.length) return null;
let best = ps[0];
for (const p of ps.slice(1)) if (gFame(p) > gFame(best) * 1.5) best = p;
return best;
}

function gAreaOf(formattedAddress, city) {
const parts = String(formattedAddress || '').split(',').map(s => s.trim()).filter(Boolean);
if (parts.length < 2) return '';
const cityBase = String(city || '').split(',')[0].trim().toLowerCase();
const idx = parts.findIndex(s => s.toLowerCase().startsWith(cityBase));
let area = '';
if (idx > 0) area = parts[idx - 1]; else if (parts.length >= 3) area = parts[1];
area = (area || '').replace(/\s+\d[\d\s-]*$/, '').trim();
if (!area || /^\d/.test(area) || area.length > 34) return '';
return area;
}

const G_DISH_CAP = 12;

const gPlaceMem = {};

let googleOff = false;

async function googleDishPlace(city, dish, geo) {
const ck = city + '|' + dish;
if (ck in gPlaceMem) return gPlaceMem[ck];
const lsKey = 'dib_gp_v1_' + ck;
try {
const c = JSON.parse(localStorage.getItem(lsKey) || 'null');
if (c && c.t && Date.now() - c.t < 7 * 24 * 3600 * 1e3) {
gPlaceMem[ck] = c.p;
return c.p;
}
} catch (e) {}
let out = null;
const ctl = new AbortController;
const to = setTimeout(() => ctl.abort(), 8e3);
try {
const body = {
textQuery: dish + ' in ' + city,
pageSize: 5
};
if (geo && geo.lon != null && geo.lat != null) body.locationBias = {
circle: {
center: {
latitude: geo.lat,
longitude: geo.lon
},
radius: 15e3
}
};
const r = await fetch('https://places.googleapis.com/v1/places:searchText', {
method: 'POST',
signal: ctl.signal,
headers: {
'Content-Type': 'application/json',
'X-Goog-Api-Key': GOOGLE_PLACES_KEY,
'X-Goog-FieldMask': 'places.displayName,places.rating,places.userRatingCount,places.formattedAddress,places.googleMapsUri'
},
body: JSON.stringify(body)
});
if (!r.ok) throw new Error('google places ' + r.status);
const d = await r.json();
const best = gPickBest(d.places);
if (best) out = {
name: best.displayName.text,
area: gAreaOf(best.formattedAddress, city),
rating: best.rating || null,
uri: best.googleMapsUri || ''
};
} finally {
clearTimeout(to);
}
gPlaceMem[ck] = out;
try {
localStorage.setItem(lsKey, JSON.stringify({
t: Date.now(),
p: out
}));
} catch (e) {}
return out;
}

async function upgradePlacesGoogle(res) {
if (!GOOGLE_PLACES_KEY || googleOff || !res || !res.city) return 0;
const anchors = Array.from(document.querySelectorAll('#profileRecs .r-place'));
if (!anchors.length) return 0;
let geo = null;
try {
geo = await geoCity(res.city);
} catch (e) {}
let used = 0, upgraded = 0;
const seen = new Set;
for (const a of anchors) {
if (used >= G_DISH_CAP || googleOff) break;
const dish = a.dataset.dish || '';
if (!dish || seen.has(dish) || a.dataset.places) continue;
seen.add(dish);
used++;
let p = null;
try {
p = await googleDishPlace(res.city, dish, geo);
} catch (e) {
googleOff = true;
break;
}
if (p) {
a.innerHTML = `📍 ${p.name}${p.area || p.rating ? `<small>${[ p.area, p.rating ? '★' + p.rating.toFixed(1) : '' ].filter(Boolean).join(' · ')}</small>` : ''}`;
a.classList.remove('generic');
a.classList.add('found');
a.href = p.uri || 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(p.name + ' ' + res.city);
a.dataset.places = 'google';
upgraded++;
}
}
return upgraded;
}

(() => {
const fx = document.querySelector('.bg-fx');
if (!fx || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
let ticking = false;
addEventListener('scroll', () => {
if (ticking) return;
ticking = true;
requestAnimationFrame(() => {
fx.style.transform = `translateY(${Math.min(window.scrollY * .05, 110)}px)`;
ticking = false;
});
}, {
passive: true
});
})();

function finish(early) {
st.finished = true;
st.result = computeResult(st);
st.altRecs = altRecsCache;
const skippedInRun = st.skipped ? Object.keys(st.skipped).filter(id => st.order.includes(id)).length : 0;
if (early || answeredCount(st) < runTotal(st)) {
st.result.partial = true;
st.result.answered = answeredCount(st);
st.result.skipped = skippedInRun;
st.result.early = !!early;
}
saveState();
sendToSheets();
revealResults();
}

let compileTimer = null, compilePhraseTimer = null;

function revealResults() {
const reduced = !!(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches);
const dots = $('holeDots');
if (dots && !reduced) {
const maxR = Math.round(Math.max(160, Math.min(window.innerWidth, window.innerHeight) * .46));
let html = '';
for (let i = 0; i < 150; i++) {
const a = Math.round(Math.random() * 360);
const r = Math.round(95 + Math.random() * (maxR - 95));
const d = (Math.random() * 2.4).toFixed(2);
const g = 110 + Math.round(Math.random() * 120);
html += `<span style="--a:${a}deg;--r:${r}px;--d:${d}s;background:rgb(${g},${g},${g})"></span>`;
}
dots.innerHTML = html;
}
show('view-compiling');
window.scrollTo({
top: 0
});
const bf = st && st.builtFor || {};
const love0 = ((Array.isArray(st.loves) ? st.loves : []).map(id => (st.lovesData || {})[id]).filter(d => d && d.n)[0] || {}).n || '';
const av0 = st ? aversionsOf(st)[0] || '' : '';
const phrases = [ 'Reading your palate…', bf.roots ? `Weighing your ${rootsLabelOf(bf)} roots against the world…` : 'Weighing your flavour axes…', love0 ? `Keeping ${love0} at the centre…` : 'Scanning kitchens around the world…', av0 ? `Standing guard — no ${av0.split(' — ')[0].toLowerCase()} anywhere near your list…` : 'Matching dishes to your taste…', bf.city ? bf.mode === 'travel' ? `Lining up ${bf.city.split(',')[0]}'s best tables…` : `Finding your flavours in ${bf.city.split(',')[0]}…` : 'Handpicking your recommendations…' ];
let pi = 0;
const el = $('compilePhrase');
if (el) el.textContent = phrases[0];
clearInterval(compilePhraseTimer);
if (!reduced) compilePhraseTimer = setInterval(() => {
pi = (pi + 1) % phrases.length;
if (el) el.textContent = phrases[pi];
}, 1100);
clearTimeout(compileTimer);
compileTimer = setTimeout(() => {
clearInterval(compilePhraseTimer);
renderResults();
show('view-results');
window.scrollTo({
top: 0
});
}, reduced ? 700 : 7500);
}

$('endBtn').onclick = () => {
if (st && !st.finished && answeredCount(st) >= 5) finish(true);
};

$('pickProfileBtn').addEventListener('click', () => show('view-profile'));

$('pickDishesBtn').addEventListener('click', () => show('view-dishes'));

$('profileBackBtn').addEventListener('click', () => show('view-results'));

$('dishesBackBtn').addEventListener('click', () => show('view-results'));

$('profileToDishesBtn').addEventListener('click', () => show('view-dishes'));

$('dishesToProfileBtn').addEventListener('click', () => show('view-profile'));

$('endInfoBtn').onclick = () => {
const p = $('endInfoPanel');
p.hidden = !p.hidden;
$('endInfoBtn').classList.toggle('open', !p.hidden);
};

$('shareProfileBtn').onclick = async () => {
const res = st.result || lastResult;
if (!res) return;
const btn = $('shareProfileBtn');
const stripLbl = s2 => String(s2 || '').replace(/^\S+\s/, '');
const sumTags = (res.summaryTags && res.summaryTags.length >= 2 ? res.summaryTags : res.topTags || []).map(t => stripLbl(TAG_LABELS[t])).filter(Boolean);
const leans = (res.axes || []).filter(a => a.lean === 'hi' || a.lean === 'lo').slice(0, 3).map(a => a.lean === 'hi' ? a.hi : a.lo);
const dishes = (res.recs || []).slice(0, 3).map(r => r.dish);
const text = [ '🍽️ My taste profile — Diving into Buds', sumTags.length >= 2 ? `In one line: ${sumTags[0]} meets ${sumTags[1].toLowerCase()}.` : '', leans.length ? `My leans: ${leans.join(' · ')}` : '', dishes.length ? `First dishes to try: ${dishes.join(', ')}` : '', 'Take your own dive: https://aizazurrahman.github.io/Diving-into-buds/' ].filter(Boolean).join('\n');
try {
if (navigator.share) {
await navigator.share({
title: 'My taste profile',
text: text
});
return;
}
throw new Error('no native share');
} catch (e) {
if (e && e.name === 'AbortError') return;
try {
await navigator.clipboard.writeText(text);
const old = btn.textContent;
btn.textContent = '✓ Copied — paste it anywhere';
setTimeout(() => {
btn.textContent = old;
}, 3e3);
} catch (e2) {}
}
};

$('csvBtn').onclick = () => {
const res = st.result || computeResult(st);
const esc = v => `"${String(v == null ? '' : v).replace(/"/g, '""')}"`;
const rows = [ [ 'Diving into Buds — taste profile results' ], [ 'Email', res.email ], [ 'Diet', DIET_LABELS[res.diet] || res.diet ], [ 'Roots', rootsLabelOf(res) ], [ 'City', res.city || '' ], [ 'Questions answered', res.detail.length ], [ 'Ended early', res.partial ? 'Yes' : 'No' ], [ 'Completed', res.completedAt ], [ 'Top traits', res.topTags.join(', ') ], [ 'Affinities', Object.entries(res.affinities || {}).map(([k, v]) => `${k}:${v}`).join(', ') ], ...(res.axes || []).map(a => [ `Axis — ${a.name}`, `${a.lean === 'hi' ? a.hi : a.lean === 'lo' ? a.lo : 'Balanced'} (${a.pct}% toward ${a.hi}, strength ${a.strength})` ]), [ 'Hard no\'s', (res.aversions || []).join(', ') ], [ 'Heat %', res.meters.spice ], [ 'Sweet %', res.meters.sweet ], [ 'Adventure %', res.meters.adv ], [ 'Smoke %', res.meters.smoky ], [ 'Tang %', res.meters.tangy ], [ 'Creamy %', res.meters.creamy ], [ 'Fresh %', res.meters.fresh ], [ 'Classic %', res.meters.classic ], [ 'Average confidence', res.avgConfidence ], [], [ '#', 'Question', 'Section', 'Your pick(s)', 'Confidence' ] ];
res.detail.forEach((d, i) => rows.push([ i + 1, d.q, d.deck, d.picks.join(' + '), d.weight ]));
rows.push([], [ 'Recommendations' ]);
res.recs.forEach(r => rows.push([ r.dish, r.from, r.why ]));
const blob = new Blob([ rows.map(r => r.map(esc).join(',')).join('\n') ], {
type: 'text/csv'
});
const a = document.createElement('a');
a.href = URL.createObjectURL(blob);
a.download = 'diving-into-buds-results.csv';
a.click();
URL.revokeObjectURL(a.href);
};

$('retakeBtn').onclick = doRestart;

(async function init() {
store.del('dib_session');
if (!sb) {
show('view-landing');
return;
}
const {data: data} = await sb.auth.getSession();
if (data && data.session && data.session.user) {
sessionUser = {
id: data.session.user.id,
email: data.session.user.email
};
await hydrate();
routeAfterLogin();
} else {
show('view-landing');
}
})();

$('qInfoBtn').onclick = () => {
const p = $('qInfoPanel');
p.hidden = !p.hidden;
$('qInfoBtn').classList.toggle('open', !p.hidden);
};

(() => {
if (!('IntersectionObserver' in window)) {
document.querySelectorAll('.reveal').forEach(el => el.classList.add('inview'));
return;
}
const io = new IntersectionObserver(es => es.forEach(en => {
if (en.isIntersecting) {
en.target.classList.add('inview');
io.unobserve(en.target);
}
}), {
threshold: 0
});
document.querySelectorAll('.reveal').forEach(el => io.observe(el));
})();

(() => {
if (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches) return;
const rootEl = document.documentElement;
const stops = [ [ 139, 92, 246 ], [ 217, 70, 239 ], [ 79, 70, 229 ], [ 147, 51, 234 ], [ 139, 92, 246 ] ];
let ticking = false;
function paint() {
ticking = false;
const max = document.body.scrollHeight - innerHeight;
const p = max > 0 ? Math.min(1, Math.max(0, scrollY / max)) : 0;
const seg = p * (stops.length - 1);
const i = Math.min(stops.length - 2, Math.floor(seg));
const f = seg - i;
const c = stops[i].map((v, k) => Math.round(v + (stops[i + 1][k] - v) * f));
const pulse = Math.sin(p * Math.PI);
rootEl.style.setProperty('--glowA', `rgba(${c[0]},${c[1]},${c[2]},${(.4 + .16 * pulse).toFixed(3)})`);
rootEl.style.setProperty('--glowB', `rgba(${c[2]},${c[1]},${c[0]},${(.26 + .12 * pulse).toFixed(3)})`);
rootEl.style.setProperty('--gx1', 12 + p * 48 + '%');
rootEl.style.setProperty('--gy1', -6 + p * 34 + '%');
rootEl.style.setProperty('--gx2', 105 - p * 62 + '%');
rootEl.style.setProperty('--gy2', 22 + p * 48 + '%');
}
addEventListener('scroll', () => {
if (!ticking) {
ticking = true;
requestAnimationFrame(paint);
}
}, {
passive: true
});
addEventListener('resize', paint);
paint();
})();