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
const hit = JSON.parse(localStorage.getItem('dib_pool_v2_' + city) || 'null');
if (hit && hit.t && Date.now() - hit.t < 864e5 && Array.isArray(hit.pool) && hit.pool.length) {
poolMemCache[city] = hit.pool;
return hit.pool;
}
} catch (e) {}
const g = await geoCity(city);
const cats = 'catering.restaurant,catering.cafe,catering.fast_food';
const page = async off => {
const d = await fetchJsonTimeout(`https://api.geoapify.com/v2/places?categories=${cats}&filter=place:${g.placeId}&bias=proximity:${g.lon},${g.lat}&limit=500&offset=${off}&apiKey=${GEOAPIFY_KEY}`, 8e3);
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
const areaRaw = typeof p.address_line2 === 'string' ? p.address_line2.split(',')[0].trim() : '';
return {
name: typeof p.name === 'string' ? p.name.trim() : '',
area: typeof p.suburb === 'string' && p.suburb || typeof p.district === 'string' && p.district || (areaRaw && areaRaw.toLowerCase() !== city.split(',')[0].toLowerCase() ? areaRaw : '') || '',
cuisine: (typeof raw.cuisine === 'string' ? raw.cuisine : '').toLowerCase(),
cats: (Array.isArray(p.categories) ? p.categories : []).join(' ').toLowerCase(),
website: typeof raw.website === 'string' ? raw.website : typeof p.website === 'string' ? p.website : '',
distKm: typeof p.lat === 'number' && typeof p.lon === 'number' ? Math.hypot((p.lon - g.lon) * 85, (p.lat - g.lat) * 111) : 0
};
}).filter(x => {
if (!x.name || /^\d+$/.test(x.name)) return false;
const k = x.name + '|' + x.area;
if (seenPlace.has(k)) return false;
seenPlace.add(k);
return true;
});
poolMemCache[city] = pool;
try {
localStorage.setItem('dib_pool_v2_' + city, JSON.stringify({
t: Date.now(),
pool: pool
}));
} catch (e) {}
return pool;
}

const GENERIC_DISH_TOKENS = new Set([ 'chicken', 'beef', 'pork', 'lamb', 'goat', 'fish', 'shrimp', 'prawn', 'cheese', 'rice', 'bread', 'egg', 'eggs', 'potato', 'corn', 'bean', 'beans', 'mushroom', 'vegetable', 'vegetables', 'mixed', 'grilled', 'fried', 'spicy', 'sweet', 'sour', 'cream', 'butter', 'garlic', 'onion', 'tomato', 'lemon', 'mint', 'coconut', 'peanut', 'sesame', 'honey', 'sugar', 'milk', 'pork', 'mutton', 'veg', 'nonveg' ]);

function dishNameHit(dishName, placeName) {
const stop = new Set([ 'style', 'with', 'and', 'the' ]);
const toks = String(dishName || '').toLowerCase().replace(/[^a-z ]/g, ' ').split(/\s+/).filter(w => w.length >= 4 && !stop.has(w) && !GENERIC_DISH_TOKENS.has(w));
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
const toks = dishName.toLowerCase().replace(/[^a-z ]/g, ' ').split(/\s+/).filter(w => w.length >= 4 && !stop.has(w) && !GENERIC_DISH_TOKENS.has(w));
const cuis = REGION_CUISINES[rec.region] || [];
let best = null, bestScore = 0;
pool.forEach(p => {
if (!p || typeof p.name !== 'string' || !p.name) return;
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
const p = dishPlaceFor(a.dataset.dish || '', pool, usedCounts, areaCounts) || dishPlaceFor(a.dataset.dish || '', pool, usedCounts, null);
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

function finishNow(early) {
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

let favsEditReturn = null, favsEditSnapshot = null;

function openFavsEditor(from) {
favsEditReturn = from;
favsEditSnapshot = JSON.stringify(st.loves || []);
renderLoves();
show('view-loves');
}

function exitFavsEditor() {
const from = favsEditReturn;
const changed = JSON.stringify(st.loves || []) !== favsEditSnapshot;
favsEditReturn = null;
favsEditSnapshot = null;
if (from === 'results') {
if (changed && st.finished) {
finishNow(false);
return;
}
renderResults();
show('view-results');
return;
}
renderHome();
show('view-home');
}

function favChrome() {
const b = $('lovesBackBtn');
if (b) b.hidden = !favsEditReturn;
$('lovesNext').textContent = favsEditReturn === 'results' ? 'Update my results →' : 'Continue →';
}

function favContinue() {
if (favsEditReturn === 'results') {
exitFavsEditor();
return true;
}
if (favsEditReturn === 'home') {
favsEditReturn = null;
favsEditSnapshot = null;
}
return false;
}

let ftEarly = false, ftEditing = false, ftDraft = null;

function finish(early) {
if (typeof document === 'undefined' || !$('view-finetune')) return finishNow(early);
ftEarly = !!early;
ftEditing = false;
openFineTune();
}

const FT_NOT_TONIGHT = [ 'Mushrooms', 'Coriander', 'Offal', 'Blue cheese', 'Olives', 'Onions', 'Peanuts', 'Prawns' ];

const FT_SPICE_LABELS = [ '', 'Barely a whisper', 'Gentle warmth', 'Properly hot', 'Serious fire', 'Bring the fire' ];

function ftChipRow(el, opts, cur, onPick) {
el.innerHTML = '';
opts.forEach(([v, label]) => {
const b = document.createElement('button');
b.type = 'button';
b.className = 'ft-chip' + (String(cur) === String(v) ? ' sel' : '');
b.textContent = label;
b.onclick = () => onPick(v);
el.appendChild(b);
});
}

function ftSummaryParts(ft, res) {
if (!ft) return [];
const parts = [];
const cityName = (res && res.city || '').split(',')[0];
if (ft.scope === 'roots') parts.push('My roots' + (res && res.ftScopeWidened ? ' (no exact matches — widened)' : ''));
if (ft.scope === 'local') parts.push('Local to ' + (cityName || 'your city') + (res && res.ftScopeWidened ? ' (no exact matches — widened)' : ''));
if (ft.scope === 'surprise') parts.push('Surprise me');
if (ft.heft === 1) parts.push('Light');
if (ft.heft === 2) parts.push('In between');
if (ft.heft === 3) parts.push('Full feast');
if (ft.kind) parts.push({
veg: 'Veg',
nonveg: 'Non-veg',
seafood: 'Seafood'
}[ft.kind] + (res && res.ftKindWidened ? ' (no exact matches — widened)' : ''));
if (ft.spice) parts.push('Heat ' + ft.spice + '/5');
if ((ft.notTonight || []).length) parts.push('No ' + ft.notTonight.join(', ').toLowerCase());
return parts;
}

function openFineTune() {
const bf = st && st.builtFor || {};
const cityName = (bf.city || '').split(',')[0] || 'your city';
ftDraft = Object.assign({
scope: '',
kind: '',
heft: 0,
spice: 3,
notTonight: []
}, st && st.fineTune || {});
if (!ftDraft.spice) ftDraft.spice = 3;
delete ftDraft.adv;
ftDraft.notTonight = [ ...ftDraft.notTonight || [] ];
if ((bf.diet === 'vegan' || bf.diet === 'vegetarian') && ftDraft.kind && ftDraft.kind !== 'veg') ftDraft.kind = '';
const paintSingles = () => {
ftChipRow($('ftScopeRow'), [ [ 'roots', '🏠 My roots' ], [ 'local', '📍 Local to ' + cityName ], [ 'surprise', '🌍 Surprise me' ] ], ftDraft.scope, v => {
ftDraft.scope = ftDraft.scope === v ? '' : v;
paintSingles();
});
ftChipRow($('ftHeftRow'), [ [ 1, '🥗 Light' ], [ 2, '🍽️ In between' ], [ 3, '🍖 Full feast' ] ], ftDraft.heft, v => {
ftDraft.heft = ftDraft.heft === v ? 0 : v;
paintSingles();
});
const kindNote = $('ftKindNote');
if (bf.diet === 'vegan' || bf.diet === 'vegetarian') {
$('ftKindRow').innerHTML = '';
kindNote.hidden = false;
kindNote.textContent = bf.diet === 'vegan' ? 'Set by your diet — everything on your list is plant-based already.' : 'Set by your diet — your list is vegetarian; a fine-tune can\'t add meat back.';
} else {
kindNote.hidden = true;
ftChipRow($('ftKindRow'), [ [ 'veg', '🌱 Veg' ], [ 'nonveg', '🍗 Non-veg' ], [ 'seafood', '🦐 Seafood' ] ], ftDraft.kind, v => {
ftDraft.kind = ftDraft.kind === v ? '' : v;
paintSingles();
});
}
const notRow = $('ftNotRow');
notRow.innerHTML = '';
FT_NOT_TONIGHT.forEach(name => {
const b = document.createElement('button');
b.type = 'button';
b.className = 'ft-chip' + (ftDraft.notTonight.includes(name) ? ' sel' : '');
b.textContent = name;
b.onclick = () => {
const i = ftDraft.notTonight.indexOf(name);
if (i >= 0) ftDraft.notTonight.splice(i, 1); else ftDraft.notTonight.push(name);
paintSingles();
};
notRow.appendChild(b);
});
};
paintSingles();
const paintSpice = () => {
const v = ftDraft.spice || 3;
$('ftSpice').value = v;
$('ftSpice').style.setProperty('--valp', (v - 1) / 4 * 100 + '%');
$('ftSpiceVal').textContent = FT_SPICE_LABELS[v];
};
paintSpice();
$('ftSpice').oninput = e => {
ftDraft.spice = +e.target.value;
paintSpice();
};
$('ftSkipBtn').textContent = ftEditing ? 'Remove fine-tuning' : 'Skip — as I answered';
show('view-finetune');
window.scrollTo({
top: 0
});
}

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

let compileTimer = null, compilePhraseTimer = null;

const CITIES = [ 'Hyderabad, India', 'Bengaluru, India', 'Mumbai, India', 'Delhi, India', 'Chennai, India', 'Kolkata, India', 'Pune, India', 'Ahmedabad, India', 'Jaipur, India', 'Lucknow, India', 'Kochi, India', 'Panaji, India', 'Indore, India', 'Bhopal, India', 'Chandigarh, India', 'Coimbatore, India', 'Nagpur, India', 'Surat, India', 'Vadodara, India', 'Visakhapatnam, India', 'Patna, India', 'Guwahati, India', 'Thiruvananthapuram, India', 'Mysuru, India', 'Madurai, India', 'Varanasi, India', 'Agra, India', 'Kanpur, India', 'Ranchi, India', 'Bhubaneswar, India', 'Dehradun, India', 'Amritsar, India', 'Ludhiana, India', 'Udaipur, India', 'Jodhpur, India', 'Karachi, Pakistan', 'Lahore, Pakistan', 'Islamabad, Pakistan', 'Hyderabad, Pakistan', 'Faisalabad, Pakistan', 'Rawalpindi, Pakistan', 'Multan, Pakistan', 'Peshawar, Pakistan', 'Dhaka, Bangladesh', 'Chattogram, Bangladesh', 'Khulna, Bangladesh', 'Sylhet, Bangladesh', 'Colombo, Sri Lanka', 'Kandy, Sri Lanka', 'Kathmandu, Nepal', 'Pokhara, Nepal', 'Dubai, United Arab Emirates', 'Abu Dhabi, United Arab Emirates', 'Sharjah, United Arab Emirates', 'Riyadh, Saudi Arabia', 'Jeddah, Saudi Arabia', 'Mecca, Saudi Arabia', 'Medina, Saudi Arabia', 'Dammam, Saudi Arabia', 'Doha, Qatar', 'Kuwait City, Kuwait', 'Muscat, Oman', 'Manama, Bahrain', 'London, United Kingdom', 'Manchester, United Kingdom', 'Birmingham, United Kingdom', 'Leeds, United Kingdom', 'Glasgow, United Kingdom', 'Edinburgh, United Kingdom', 'Liverpool, United Kingdom', 'Bristol, United Kingdom', 'Sheffield, United Kingdom', 'Cardiff, United Kingdom', 'Belfast, United Kingdom', 'Newcastle, United Kingdom', 'Leicester, United Kingdom', 'Nottingham, United Kingdom', 'Oxford, United Kingdom', 'Cambridge, United Kingdom', 'Brighton, United Kingdom', 'York, United Kingdom', 'Dublin, Ireland', 'Cork, Ireland', 'Galway, Ireland', 'New York, United States', 'Los Angeles, United States', 'Chicago, United States', 'Houston, United States', 'Phoenix, United States', 'Philadelphia, United States', 'San Antonio, United States', 'San Diego, United States', 'Dallas, United States', 'Austin, United States', 'San Jose, United States', 'Columbus, United States', 'Charlotte, United States', 'San Francisco, United States', 'Seattle, United States', 'Denver, United States', 'Washington DC, United States', 'Boston, United States', 'Nashville, United States', 'Portland, United States', 'Las Vegas, United States', 'Miami, United States', 'Atlanta, United States', 'Minneapolis, United States', 'Tampa, United States', 'Sacramento, United States', 'Orlando, United States', 'Detroit, United States', 'Honolulu, United States', 'Milwaukee, United States', 'Baltimore, United States', 'Salt Lake City, United States', 'New Orleans, United States', 'Oklahoma City, United States', 'Memphis, United States', 'Louisville, United States', 'Raleigh, United States', 'Toronto, Canada', 'Vancouver, Canada', 'Montreal, Canada', 'Calgary, Canada', 'Ottawa, Canada', 'Edmonton, Canada', 'Winnipeg, Canada', 'Quebec City, Canada', 'Halifax, Canada', 'Victoria, Canada', 'Mexico City, Mexico', 'Guadalajara, Mexico', 'Monterrey, Mexico', 'Puebla, Mexico', 'Tijuana, Mexico', 'Cancún, Mexico', 'Mérida, Mexico', 'São Paulo, Brazil', 'Rio de Janeiro, Brazil', 'Brasília, Brazil', 'Salvador, Brazil', 'Fortaleza, Brazil', 'Belo Horizonte, Brazil', 'Manaus, Brazil', 'Curitiba, Brazil', 'Recife, Brazil', 'Porto Alegre, Brazil', 'Buenos Aires, Argentina', 'Santiago, Chile', 'Lima, Peru', 'Bogotá, Colombia', 'Medellín, Colombia', 'Quito, Ecuador', 'Montevideo, Uruguay', 'Asunción, Paraguay', 'La Paz, Bolivia', 'Caracas, Venezuela', 'Panama City, Panama', 'San José, Costa Rica', 'Havana, Cuba', 'Santo Domingo, Dominican Republic', 'San Juan, Puerto Rico', 'Paris, France', 'Lyon, France', 'Marseille, France', 'Nice, France', 'Bordeaux, France', 'Toulouse, France', 'Berlin, Germany', 'Munich, Germany', 'Hamburg, Germany', 'Frankfurt, Germany', 'Cologne, Germany', 'Stuttgart, Germany', 'Düsseldorf, Germany', 'Madrid, Spain', 'Barcelona, Spain', 'Valencia, Spain', 'Seville, Spain', 'Bilbao, Spain', 'Rome, Italy', 'Milan, Italy', 'Naples, Italy', 'Turin, Italy', 'Florence, Italy', 'Venice, Italy', 'Bologna, Italy', 'Amsterdam, Netherlands', 'Rotterdam, Netherlands', 'Utrecht, Netherlands', 'The Hague, Netherlands', 'Brussels, Belgium', 'Antwerp, Belgium', 'Ghent, Belgium', 'Vienna, Austria', 'Salzburg, Austria', 'Graz, Austria', 'Zurich, Switzerland', 'Geneva, Switzerland', 'Basel, Switzerland', 'Bern, Switzerland', 'Lisbon, Portugal', 'Porto, Portugal', 'Athens, Greece', 'Thessaloniki, Greece', 'Stockholm, Sweden', 'Gothenburg, Sweden', 'Malmö, Sweden', 'Oslo, Norway', 'Bergen, Norway', 'Copenhagen, Denmark', 'Aarhus, Denmark', 'Helsinki, Finland', 'Tampere, Finland', 'Reykjavik, Iceland', 'Warsaw, Poland', 'Kraków, Poland', 'Gdańsk, Poland', 'Poznań, Poland', 'Prague, Czechia', 'Brno, Czechia', 'Budapest, Hungary', 'Bucharest, Romania', 'Sofia, Bulgaria', 'Zagreb, Croatia', 'Belgrade, Serbia', 'Ljubljana, Slovenia', 'Bratislava, Slovakia', 'Vilnius, Lithuania', 'Riga, Latvia', 'Tallinn, Estonia', 'Kyiv, Ukraine', 'Istanbul, Türkiye', 'Ankara, Türkiye', 'Izmir, Türkiye', 'Cairo, Egypt', 'Alexandria, Egypt', 'Lagos, Nigeria', 'Abuja, Nigeria', 'Nairobi, Kenya', 'Accra, Ghana', 'Johannesburg, South Africa', 'Cape Town, South Africa', 'Durban, South Africa', 'Addis Ababa, Ethiopia', 'Dar es Salaam, Tanzania', 'Luanda, Angola', 'Maputo, Mozambique', 'Casablanca, Morocco', 'Marrakech, Morocco', 'Tunis, Tunisia', 'Algiers, Algeria', 'Tel Aviv, Israel', 'Jerusalem, Israel', 'Beirut, Lebanon', 'Amman, Jordan', 'Tehran, Iran', 'Baghdad, Iraq', 'Kabul, Afghanistan', 'Beijing, China', 'Shanghai, China', 'Guangzhou, China', 'Shenzhen, China', 'Chengdu, China', 'Xi\'an, China', 'Wuhan, China', 'Hangzhou, China', 'Nanjing, China', 'Chongqing, China', 'Hong Kong', 'Taipei, Taiwan', 'Tokyo, Japan', 'Osaka, Japan', 'Kyoto, Japan', 'Nagoya, Japan', 'Fukuoka, Japan', 'Sapporo, Japan', 'Seoul, South Korea', 'Busan, South Korea', 'Incheon, South Korea', 'Bangkok, Thailand', 'Chiang Mai, Thailand', 'Phuket, Thailand', 'Hanoi, Vietnam', 'Ho Chi Minh City, Vietnam', 'Da Nang, Vietnam', 'Kuala Lumpur, Malaysia', 'Penang, Malaysia', 'Johor Bahru, Malaysia', 'Singapore', 'Jakarta, Indonesia', 'Surabaya, Indonesia', 'Bandung, Indonesia', 'Denpasar, Indonesia', 'Manila, Philippines', 'Cebu, Philippines', 'Davao, Philippines', 'Yangon, Myanmar', 'Phnom Penh, Cambodia', 'Vientiane, Laos', 'Ulaanbaatar, Mongolia', 'Almaty, Kazakhstan', 'Tashkent, Uzbekistan', 'Baku, Azerbaijan', 'Tbilisi, Georgia', 'Yerevan, Armenia', 'Sydney, Australia', 'Melbourne, Australia', 'Brisbane, Australia', 'Perth, Australia', 'Adelaide, Australia', 'Canberra, Australia', 'Gold Coast, Australia', 'Hobart, Australia', 'Darwin, Australia', 'Auckland, New Zealand', 'Wellington, New Zealand', 'Christchurch, New Zealand', 'Hamilton, New Zealand', 'Suva, Fiji' ];

const COUNTRY_REGION = {
India: 'southasia',
Pakistan: 'southasia',
Bangladesh: 'southasia',
'Sri Lanka': 'southasia',
Nepal: 'southasia',
Afghanistan: 'southasia',
China: 'eastasia',
Japan: 'eastasia',
'South Korea': 'eastasia',
Indonesia: 'eastasia',
Thailand: 'eastasia',
Vietnam: 'eastasia',
Malaysia: 'eastasia',
Philippines: 'eastasia',
'Hong Kong': 'eastasia',
Taiwan: 'eastasia',
Singapore: 'eastasia',
Myanmar: 'eastasia',
Cambodia: 'eastasia',
Laos: 'eastasia',
Mongolia: 'eastasia',
'Saudi Arabia': 'middleeast',
'United Arab Emirates': 'middleeast',
Qatar: 'middleeast',
Kuwait: 'middleeast',
Oman: 'middleeast',
Bahrain: 'middleeast',
Israel: 'middleeast',
Lebanon: 'middleeast',
Jordan: 'middleeast',
Palestine: 'middleeast',
Iran: 'middleeast',
Iraq: 'middleeast',
'Türkiye': 'middleeast',
Egypt: 'middleeast',
Kazakhstan: 'middleeast',
Uzbekistan: 'middleeast',
'United Kingdom': 'europe',
Germany: 'europe',
Italy: 'europe',
France: 'europe',
Spain: 'europe',
Netherlands: 'europe',
Switzerland: 'europe',
Poland: 'europe',
Ireland: 'europe',
Belgium: 'europe',
Austria: 'europe',
Sweden: 'europe',
Portugal: 'europe',
Greece: 'europe',
Norway: 'europe',
Denmark: 'europe',
Finland: 'europe',
Czechia: 'europe',
Iceland: 'europe',
Hungary: 'europe',
Romania: 'europe',
Bulgaria: 'europe',
Croatia: 'europe',
Serbia: 'europe',
Slovenia: 'europe',
Slovakia: 'europe',
Lithuania: 'europe',
Latvia: 'europe',
Estonia: 'europe',
Ukraine: 'europe',
Russia: 'europe',
Georgia: 'europe',
Armenia: 'europe',
Azerbaijan: 'europe',
'South Africa': 'africa',
Nigeria: 'africa',
Morocco: 'africa',
Kenya: 'africa',
Ghana: 'africa',
Ethiopia: 'africa',
Tanzania: 'africa',
Angola: 'africa',
Mozambique: 'africa',
Tunisia: 'africa',
Algeria: 'africa',
Mali: 'africa',
Zambia: 'africa',
'United States': 'unitedstates',
Canada: 'unitedstates',
Brazil: 'latinamerica',
Mexico: 'latinamerica',
Colombia: 'latinamerica',
Argentina: 'latinamerica',
Chile: 'latinamerica',
Peru: 'latinamerica',
Ecuador: 'latinamerica',
Uruguay: 'latinamerica',
Paraguay: 'latinamerica',
Bolivia: 'latinamerica',
Venezuela: 'latinamerica',
Panama: 'latinamerica',
'Costa Rica': 'latinamerica',
Cuba: 'latinamerica',
'Dominican Republic': 'latinamerica',
'El Salvador': 'latinamerica',
Jamaica: 'latinamerica',
'Puerto Rico': 'latinamerica',
Australia: 'oceania',
'New Zealand': 'oceania',
Fiji: 'oceania',
Samoa: 'oceania',
Tonga: 'oceania',
Vanuatu: 'oceania'
};

function syncHomeFavsBtn() {
const b = $('homeFavsBtn');
if (b) b.hidden = !(Array.isArray(st.loves) && st.loves.length > 0);
}
