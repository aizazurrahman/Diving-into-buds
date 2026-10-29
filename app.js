const SUPABASE_URL = 'https://lhygxgwyprkhhkuaozuk.supabase.co';

const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxoeWd4Z3d5cHJraGhrdWFvenVrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTExNjU3MjcsImV4cCI6MjEwNjc0MTcyN30.upttjjbTEyv4JZTR8NpM94TAsgtV7PznYEeR_ZeRvn8';

const SHEETS_ENDPOINT = 'https://script.google.com/macros/s/AKfycbwX1iyUOYO8r1rTEKXjStql1hFOvCzw2O9UcvpoJ3-BO65QJcHgtRVFTxK4yluzgd-0/exec';

const sb = window.supabase && SUPABASE_URL && !SUPABASE_ANON_KEY.includes('PASTE_') ? window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY) : null;

const $ = id => document.getElementById(id);

const store = {
get(k, d) {
try {
const v = localStorage.getItem(k);
return v ? JSON.parse(v) : d;
} catch {
return d;
}
},
set(k, v) {
localStorage.setItem(k, JSON.stringify(v));
},
del(k) {
localStorage.removeItem(k);
}
};

const DEFAULT_TOTAL = 20;

const runTotal = () => DEFAULT_TOTAL;

const WEIGHT_WORDS = {
1: 'Almost a tie',
2: 'Leaning this way',
3: 'Pretty sure',
4: 'Strong pick',
5: 'No contest'
};

const DIET_LABELS = {
everything: 'Everything',
vegetarian: 'Vegetarian',
vegan: 'Vegan',
halal: 'Everything Halal'
};

const ROOT_LABELS = {
hyderabad: 'Hyderabad, India',
southasia: 'South Asia',
eastasia: 'East/Southeast Asia',
middleeast: 'Middle-Eastern',
unitedstates: 'United States',
europe: 'Europe',
africa: 'Africa',
latinamerica: 'Latin America & The Caribbean'
};

const LEGACY_ROOTS = {
asia: 'eastasia',
americas: 'unitedstates'
};

function normRootsValue(v) {
return LEGACY_ROOTS[v] || v;
}

function rootsLabelOf(o) {
return [ o && o.roots, o && o.roots2 ].filter(Boolean).map(r => ROOT_LABELS[r] || r).join(' + ');
}

const ROOT_EMOJI = {
hyderabad: '🏰',
southasia: '🍛',
eastasia: '🥢',
middleeast: '🧆',
unitedstates: '🍔',
europe: '🥐',
africa: '🌍',
latinamerica: '🌮'
};

let sessionUser = null;

let st = null;

const currentUser = () => sessionUser ? sessionUser.email : null;

const stateKey = email => 'dib_v4_' + email;

function blankState() {
return {
fundamentals: null,
builtFor: null,
order: [],
reserve: [],
answers: {},
skipped: {},
pos: 0,
seen: [],
navAt: -1,
finished: false,
result: null,
sheetSent: false,
loves: null,
lovesData: {},
feedback: {}
};
}

function answeredCount(s) {
return Object.keys(s.answers).filter(k => QBANK_BY_ID[k]).length;
}

function chosenMeats(s) {
const qid = s.answers['op-meats'] ? 'op-meats' : s.answers['op-meats-halal'] ? 'op-meats-halal' : null;
if (!qid) return null;
const a = s.answers[qid];
if (!a || !Array.isArray(a.o) || !a.o.length) return null;
return a.o.map(i => QBANK_BY_ID[qid].options[i].diet.replace('meat:', ''));
}

function chosenEgg(s) {
if (!s.builtFor || s.builtFor.diet !== 'vegetarian') return null;
const stanceOf = qid => {
const a = s.answers[qid];
if (!a) return null;
const q = QBANK_BY_ID[qid];
if (!q) return null;
const idx = Array.isArray(a.o) ? a.o : [ a.o ];
const picked = idx.map(i => q.options[i]).filter(Boolean);
if (!picked.length) return null;
return picked.some(o => (o.tags || []).includes('eggok'));
};
const dedicated = stanceOf('op-eggs');
if (dedicated !== null) return dedicated;
return stanceOf('op-protein-veg');
}

function aversionsOf(s) {
const out = [];
Object.keys(s.answers || {}).forEach(qid => {
const q = QBANK_BY_ID[qid];
const a = s.answers[qid];
if (!q || !a || !q.hate) return;
(Array.isArray(a.o) ? a.o : [ a.o ]).forEach(i => {
const t = (q.options[i] || {}).t;
if (t && !/^Nothing|^None of these/i.test(t) && !out.includes(t)) out.push(t);
});
});
return out;
}

function aversionHit(text, aversions) {
const STOP = new Set([ 'bitter', 'raw', 'smoked', 'dry', 'sweet', 'mushy', 'slimy', 'stinky', 'salty', 'overcooked', 'gristly', 'chewy', 'fishy', 'funk', 'savoury', 'savory', 'flavours', 'flavors', 'everything', 'friends', 'overload', 'hiding', 'chalky', 'vegetable', 'vegetables', 'fish', 'oil' ]);
const GENERIC = new Set([ 'cheese', 'sauce', 'soup', 'salad', 'bread', 'rice', 'pasta', 'curry', 'stew', 'pie', 'cake', 'milk', 'cream', 'butter', 'flour', 'meat', 'egg', 'eggs', 'chicken', 'pork', 'beef', 'lamb', 'water', 'style', 'roll', 'rolls', 'bun', 'buns' ]);
const SYN = {
cilantro: 'coriander',
aubergine: 'eggplant',
baingan: 'eggplant',
brinjal: 'eggplant',
courgette: 'zucchini',
garbanzo: 'chickpea',
rocket: 'arugula',
shrimp: 'prawn',
bhindi: 'okra',
paya: 'offal',
lauki: 'gourd',
karela: 'gourd',
melon: 'gourd'
};
const stem = w => w.replace(/ies$/, 'y').replace(/es$/, '').replace(/s$/, '');
const norm = w => SYN[stem(w)] || stem(w);
const words = String(text || '').toLowerCase().replace(/[^a-z ]/g, ' ').split(/\s+/).filter(Boolean).map(norm);
if (!words.length) return false;
const has = k => words.some(w => w === k || k.length >= 4 && w.startsWith(k));
return aversions.some(av => {
const rawHead = String(av).toLowerCase().split('—')[0].replace(/[^a-z ]/g, ' ').split(/\s+/).filter(w => w.length > 2);
const head = rawHead.filter(w => !STOP.has(w)).map(norm);
if (!head.length) {
if (rawHead.length < 2) return false;
const phrase = rawHead.map(norm);
outer2: for (let i = 0; i + phrase.length <= words.length; i++) {
for (let j = 0; j < phrase.length; j++) if (words[i + j] !== phrase[j]) continue outer2;
return true;
}
return false;
}
const specific = head.filter(k => !GENERIC.has(k));
if (!specific.length) {
outer: for (let i = 0; i + head.length <= words.length; i++) {
for (let j = 0; j < head.length; j++) if (words[i + j] !== head[j]) continue outer;
return true;
}
return false;
}
if (!specific.some(has)) return false;
const generics = head.filter(k => GENERIC.has(k));
if (generics.length && !generics.some(has)) return false;
const DESCRIPTORS = new Set([ 'raw', 'smoked', 'bitter', 'sweet', 'dry' ]);
const COMPOUNDS = new Set([ 'bitter gourd', 'bitter melon', 'bitter leaf' ]);
if (rawHead.length > 1 && DESCRIPTORS.has(rawHead[0]) && !COMPOUNDS.has(rawHead[0] + ' ' + rawHead[1])) {
if (!has(stem(rawHead[0])) && !(rawHead[0] === 'sweet' && has('ripe'))) return false;
}
return true;
});
}

function chosenDairy(s) {
const a = s.answers['pal-14'];
if (!a) return null;
const q = QBANK_BY_ID['pal-14'];
if (!q) return null;
const idx = Array.isArray(a.o) ? a.o : [ a.o ];
const picked = idx.map(i => q.options[i]).filter(Boolean);
if (!picked.length) return null;
return picked.some(o => o.dairyfree) ? false : null;
}

function chosenAlc(s) {
const a = s.answers['glo-alc'];
if (!a) return null;
const q = QBANK_BY_ID['glo-alc'];
if (!q) return null;
const idx = Array.isArray(a.o) ? a.o : [ a.o ];
const picked = idx.map(i => q.options[i]).filter(Boolean);
if (!picked.length) return null;
return picked.some(o => o.noalc) ? false : null;
}

function refusedPick(s, qid) {
const a = s.answers[qid];
if (!a) return false;
const q = QBANK_BY_ID[qid];
if (!q) return false;
const idx = Array.isArray(a.o) ? a.o : [ a.o ];
return idx.some(i => (q.options[i] || {}).refusal);
}

function optVisible(opt, diet, meats, egg, dairy, alc) {
const d = opt.diet;
if (opt.egg && egg === false) return false;
if (opt.dairy && dairy === false) return false;
if (opt.alc && alc === false) return false;
if (opt.alt && (diet === 'everything' || diet === 'halal')) return false;
if (opt.noveg && (diet === 'vegetarian' || diet === 'vegan')) return false;
if (diet === 'vegan') return d === 'vegan';
if (diet === 'vegetarian') return d === 'vegan' || d === 'veg';
if (d === 'alcohol') return diet === 'everything';
if (d === 'meat:pork') return diet === 'everything' && (!meats || meats.includes('pork'));
if (d === 'meat:fish') return !meats || meats.includes('fish') || meats.includes('seafood');
if (d === 'meat:seafood') return !meats || meats.includes('seafood');
if (d.startsWith('meat:')) return !meats || meats.includes(d.slice(5));
return true;
}

function visibleOpts(q, s) {
const diet = s.builtFor.diet;
const meats = q.id === 'op-meats' || q.id === 'op-meats-halal' ? null : chosenMeats(s);
const egg = q.id === 'op-eggs' || q.id === 'op-protein-veg' ? null : chosenEgg(s);
const dairy = q.id === 'pal-14' ? null : chosenDairy(s);
const alc = q.id === 'glo-alc' ? null : chosenAlc(s);
const aversions = q.hate ? [] : aversionsOf(s);
const out = [];
q.options.forEach((o, i) => {
if (optVisible(o, diet, meats, egg, dairy, alc) && !aversionHit(o.t, aversions)) out.push({
o: o,
i: i
});
});
return out;
}

function gateOpen(q, s) {
if (!q.gate) return true;
if (s.skipped && s.skipped[q.gate.q]) return false;
const pa = s.answers[q.gate.q];
if (!pa) return true;
const pq = QBANK_BY_ID[q.gate.q];
if (!pq) return true;
const pickedIdx = pa.r ? [ pa.o[0] ] : Array.isArray(pa.o) ? pa.o : [ pa.o ];
const labels = pickedIdx.map(i => (pq.options[i] || {}).t || '');
if (q.gate.has && !labels.some(t => t.includes(q.gate.has))) return false;
if (q.gate.hasAny && !labels.some(t => q.gate.hasAny.some(h => t.includes(h)))) return false;
if (q.gate.lacks && labels.some(t => t.includes(q.gate.lacks))) return false;
return true;
}

function playable(q, s) {
if (!s.builtFor || !q.diets.includes(s.builtFor.diet)) return false;
if (s.skipped && s.skipped[q.id]) return false;
if (q.id === 'bri-07' && refusedPick(s, 'glo-fish')) return false;
if (q.id === 'bri-13' && refusedPick(s, 'glo-beef')) return false;
if (q.gate && s.order && !s.order.includes(q.gate.q) && !(s.reserve || []).includes(q.gate.q)) return false;
if (!gateOpen(q, s)) return false;
return visibleOpts(q, s).length >= 2;
}

function buildOrder(s) {
const F = s.builtFor, diet = F.diet;
const valid = QBANK.filter(q => q.diets.includes(diet) && q.options.filter(o => optVisible(o, diet, null)).length >= 2);
const byDeck = d => valid.filter(q => q.deck === d);
const chainDeckOf = r => ({
hyderabad: 'hydro',
eastasia: 'asiachain',
unitedstates: 'usachain',
europe: 'eurchain',
southasia: 'souchain',
middleeast: 'midchain',
africa: 'africhain',
latinamerica: 'latchain'
}[r] || 'hydro');
const chainDeck = chainDeckOf(F.roots);
const rootsList = [ F.roots, F.roots2 ].filter(Boolean);
const dietOpener = byDeck('opener').filter(q => q.id.startsWith('op-meats') || q.id.startsWith('op-protein')).slice(0, 1);
const heatSweet = [ 'op-spice', 'op-sweet' ].map(id => QBANK_BY_ID[id]).filter(q => q && valid.includes(q));
const rot = Object.keys(ROOT_LABELS).indexOf(F.roots);
const rotate = (arr, n) => arr.length ? [ ...arr.slice(n % arr.length), ...arr.slice(0, n % arr.length) ] : arr;
const eggQ = diet === 'vegetarian' ? [ 'op-eggs' ].map(id => QBANK_BY_ID[id]).filter(q => q && valid.includes(q)) : [];
let regional;
if (rootsList.length === 2) {
const nogos = rootsList.flatMap(r => byDeck(r).filter(q => q.hate).slice(0, 1));
const core = r => {
const cd = byDeck(chainDeckOf(r));
return [ ...cd.filter(q => !q.gate), ...cd.filter(q => q.gate && q.id.includes('-k-')) ];
};
const zip = (a, b) => {
const out = [];
for (let i = 0; i < Math.max(a.length, b.length); i++) {
if (a[i]) out.push(a[i]);
if (b[i]) out.push(b[i]);
}
return out;
};
const blend = zip(core(rootsList[0]), core(rootsList[1])).slice(0, 4);
const rankedCoreD = zip(...rootsList.map(r => rotate(byDeck(r).filter(q => q.rank && !q.hate), rot))).filter(q => !blend.includes(q)).slice(0, 2);
const restZip = zip(...rootsList.map(r => byDeck(r).filter(q => !q.hate && !rankedCoreD.includes(q))));
regional = [ ...dietOpener, ...nogos.slice(0, 1), ...heatSweet, ...eggQ, ...nogos.slice(1), ...blend, ...rankedCoreD, ...restZip ].slice(0, 11);
} else {
const rootsDeckAll = byDeck(F.roots);
const rootsNogo = rootsDeckAll.filter(q => q.hate).slice(0, 1);
const chains = byDeck(chainDeck);
const chainsCapped = [ ...chains.filter(q => !q.gate), ...chains.filter(q => q.gate && q.id.includes('-k-')) ].slice(0, 4);
const rankedCore = rotate(rootsDeckAll.filter(q => q.rank && !q.hate), rot).slice(0, 2);
const rootsRest = rootsDeckAll.filter(q => !q.hate && !rankedCore.includes(q));
regional = [ ...dietOpener, ...rootsNogo, ...heatSweet, ...eggQ, ...chainsCapped, ...rankedCore, ...rootsRest ].slice(0, 11);
}
const salad = [ 'pal-25', 'pal-26' ].map(id => QBANK_BY_ID[id]).filter(q => q && valid.includes(q));
const fishFam = [ 'glo-fish' ].map(id => QBANK_BY_ID[id]).filter(q => q && valid.includes(q));
const alcQ = diet === 'everything' ? [ 'glo-alc' ].map(id => QBANK_BY_ID[id]).filter(q => q && valid.includes(q)) : [];
const beefQ = diet === 'everything' || diet === 'halal' ? [ 'glo-beef' ].map(id => QBANK_BY_ID[id]).filter(q => q && valid.includes(q)) : [];
const zip3 = (a, b, c) => {
const out = [];
for (let i = 0; i < Math.max(a.length, b.length, c.length); i++) {
if (a[i]) out.push(a[i]);
if (b[i]) out.push(b[i]);
if (c[i]) out.push(c[i]);
}
return out;
};
const ANCHOR_IDS = [ 'pal-01', 'pal-07', 'pal-08', 'glo-11', 'pal-15', 'bri-10', 'pal-17', 'glo-21', 'op-format', 'op-temp' ];
const inRegional = new Set(regional.map(q => q.id));
const anchors = rotate(ANCHOR_IDS.map(id => QBANK_BY_ID[id]).filter(q => q && valid.includes(q) && !inRegional.has(q.id) && !salad.includes(q) && !fishFam.includes(q) && !alcQ.includes(q) && !beefQ.includes(q)), rot).slice(0, 2);
const worldFill = zip3(rotate(byDeck('bridge').filter(q => !anchors.includes(q)), rot * 2), rotate(byDeck('palate').filter(q => !salad.includes(q) && !anchors.includes(q)), rot * 3), rotate(byDeck('global').filter(q => !fishFam.includes(q) && !alcQ.includes(q) && !beefQ.includes(q) && !anchors.includes(q)), rot * 5));
const worldPick = [ ...fishFam, ...alcQ, ...beefQ, ...salad, ...anchors, ...worldFill ].slice(0, 9);
const composed = [ ...regional, ...worldPick ];
const seen = new Set;
const order = composed.filter(q => !seen.has(q.id) && seen.add(q.id));
for (const q of valid) {
if (order.length >= DEFAULT_TOTAL) break;
if (!seen.has(q.id)) {
order.push(q);
seen.add(q.id);
}
}
const gStart = regional.length;
const withKids = [ ...order ];
const inOrder = new Set(order.map(q => q.id));
for (const q of order.slice(gStart)) {
let insertAt = withKids.indexOf(q.id) + 1;
for (const kid of QBANK.filter(c => c.gate && c.gate.q === q.id)) {
if (!inOrder.has(kid.id) && valid.includes(kid) && withKids.length < DEFAULT_TOTAL) {
withKids.splice(insertAt++, 0, kid);
inOrder.add(kid.id);
}
}
}
s.order = withKids.slice(0, DEFAULT_TOTAL).map(q => q.id);
const inFinal = new Set(s.order);
const ownDecks = new Set(rootsList.flatMap(r => [ r, chainDeckOf(r) ]));
const ownFirst = valid.filter(q => ownDecks.has(q.deck) && !inFinal.has(q.id));
const restReserve = valid.filter(q => !ownDecks.has(q.deck) && !inFinal.has(q.id));
s.reserve = [ ...ownFirst, ...restReserve ].map(q => q.id);
s.pos = 0;
}

const GLOBAL_DECKS = new Set([ 'palate', 'bridge', 'global' ]);

function deckFamily(q) {
return GLOBAL_DECKS.has(q.deck) ? 'global' : 'regional';
}

function replacementFor(s, skippedQ) {
const simsInRun = new Set(s.order.map(id => (QBANK_BY_ID[id] || {}).sim).filter(Boolean));
const fam = deckFamily(skippedQ);
const passes = [ c => c.deck === skippedQ.deck, c => deckFamily(c) === fam, () => true ];
for (const pass of passes) {
for (const cid of s.reserve) {
if (s.order.includes(cid) || s.answers[cid] || s.skipped && s.skipped[cid]) continue;
const cq = QBANK_BY_ID[cid];
if (!cq || cq.sim && simsInRun.has(cq.sim) || !pass(cq) || !playable(cq, s)) continue;
return cid;
}
}
return null;
}

function fixOrder(s) {
if (!s.builtFor) return;
const inOrder = new Set(s.order);
const pool = [ ...new Set([ ...s.reserve, ...QBANK.map(q => q.id).filter(id => !inOrder.has(id)) ]) ];
const used = new Set;
for (let i = s.pos + 1; i < s.order.length; i++) {
const q = QBANK_BY_ID[s.order[i]];
if (!q || s.answers[q.id] || s.skipped && s.skipped[q.id] || playable(q, s)) continue;
let rep = null;
for (const pass of [ q.deck, null ]) {
for (const cid of pool) {
if (used.has(cid) || s.order.includes(cid)) continue;
const cq = QBANK_BY_ID[cid];
if (cq && !s.answers[cid] && playable(cq, s) && (pass === null || cq.deck === pass)) {
rep = cid;
break;
}
}
if (rep) break;
}
if (rep) {
used.add(rep);
s.order[i] = rep;
}
}
const gateParents = [ ...new Set(QBANK.filter(c => c.gate).map(c => c.gate.q)) ];
for (const pid of gateParents) {
const pIdx = s.order.indexOf(pid);
if (pIdx < 0 || !s.answers[pid]) continue;
let insertAt = Math.max(pIdx + 1, s.pos + 1);
for (const kid of QBANK.filter(c => c.gate && c.gate.q === pid)) {
if (s.answers[kid.id]) continue;
const kIdx = s.order.indexOf(kid.id);
if (kIdx < 0 || !playable(kid, s)) continue;
if (kIdx > insertAt) {
if (s.order.slice(insertAt, kIdx).some(id => s.answers[id] || s.skipped && s.skipped[id])) break;
s.order.splice(kIdx, 1);
s.order.splice(insertAt, 0, kid.id);
insertAt++;
} else if (kIdx === insertAt) insertAt++;
}
}
s.reserve = pool.filter(id => !used.has(id) && !s.order.includes(id));
if (!s.answers['op-spice'] && !s.answers['op-temp'] && !(s.skipped && (s.skipped['op-spice'] || s.skipped['op-temp']))) {
const si = s.order.indexOf('op-spice'), ti = s.order.indexOf('op-temp');
if (si >= 0 && ti >= 0 && ti !== si + 1) {
s.order.splice(ti, 1);
s.order.splice(si + 1, 0, 'op-temp');
}
}
}

function saveState() {
if (!sessionUser || !st) return;
store.set(stateKey(sessionUser.email), st);
scheduleSync();
}

let syncTimer = null;

function scheduleSync() {
clearTimeout(syncTimer);
syncTimer = setTimeout(upsertNow, 400);
}

async function upsertNow() {
if (!sb || !sessionUser || !st) return;
const answersPayload = {
...st.answers
};
if (st.builtFor) answersPayload.__fund = st.builtFor;
if (st.result) answersPayload.__result = st.result;
if (st.skipped && Object.keys(st.skipped).length) answersPayload.__skipped = st.skipped;
if (st.seen && st.seen.length) answersPayload.__nav = {
seen: st.seen
};
if (st.order && st.order.length) answersPayload.__order = {
o: st.order,
r: st.reserve || []
};
if (Array.isArray(st.loves) && st.loves.length) {
answersPayload.__loves = st.loves;
answersPayload.__lovesData = st.lovesData || {};
}
if (st.feedback && Object.keys(st.feedback).length) answersPayload.__feedback = st.feedback;
if (st.fineTune) answersPayload.__ft = st.fineTune;
const base = {
user_id: sessionUser.id,
answers: answersPayload,
current_q: st.pos,
finished: st.finished,
updated_at: (new Date).toISOString()
};
const full = {
...base,
fundamentals: st.builtFor,
result: st.result
};
let {error: error} = await sb.from('progress').upsert(full);
if (error) {
({error: error} = await sb.from('progress').upsert(base));
if (error) console.warn('Progress sync failed (will retry):', error.message);
}
}

async function hydrate() {
const email = sessionUser.email;
const local = store.get(stateKey(email), blankState());
const {data: rows, error: error} = await sb.from('progress').select('answers, current_q, finished, fundamentals, result').eq('user_id', sessionUser.id).limit(1);
if (error || !rows || !rows[0]) {
st = local;
return;
}
const row = rows[0];
const rawAnswers = row.answers || {};
const cloudAnswers = {};
Object.keys(rawAnswers).forEach(k => {
if (QBANK_BY_ID[k]) cloudAnswers[k] = rawAnswers[k];
});
const fund = row.fundamentals || rawAnswers.__fund || null;
if (fund) {
fund.roots = normRootsValue(fund.roots);
if (fund.roots2) fund.roots2 = normRootsValue(fund.roots2);
}
const result = row.result || rawAnswers.__result || null;
if (fund && (Object.keys(cloudAnswers).length || row.finished || local.builtFor)) {
st = blankState();
st.fundamentals = fund;
st.builtFor = fund;
st.answers = Object.keys(cloudAnswers).length ? cloudAnswers : local.builtFor && JSON.stringify(local.builtFor) === JSON.stringify(fund) ? local.answers : {};
st.skipped = rawAnswers.__skipped || local.skipped || {};
st.loves = Array.isArray(rawAnswers.__loves) ? rawAnswers.__loves : local.loves !== undefined ? local.loves : [];
st.lovesData = rawAnswers.__lovesData || local.lovesData || {};
st.feedback = rawAnswers.__feedback || local.feedback || {};
st.fineTune = rawAnswers.__ft || local.fineTune || null;
st.finished = !!row.finished;
st.result = result;
st.sheetSent = !!result;
const savedOrder = (rawAnswers.__order || {}).o, savedReserve = (rawAnswers.__order || {}).r;
const orderOk = Array.isArray(savedOrder) && savedOrder.length >= 10 && savedOrder.filter(id => QBANK_BY_ID[id]).length >= savedOrder.length * .95;
if (orderOk) {
st.order = savedOrder.slice();
st.reserve = Array.isArray(savedReserve) ? [ ...new Set(savedReserve.filter(id => QBANK_BY_ID[id])) ] : [];
} else buildOrder(st);
fixOrder(st);
st.seen = ((rawAnswers.__nav || {}).seen || local.seen || []).filter(id => st.order.includes(id));
st.navAt = -1;
st.pos = Math.max(0, Math.min(row.current_q || 0, st.order.length - 1));
store.set(stateKey(email), st);
} else {
st = local;
if (st.builtFor) scheduleSync();
}
if (st.fundamentals) st.fundamentals.roots = normRootsValue(st.fundamentals.roots);
if (st.builtFor) st.builtFor.roots = normRootsValue(st.builtFor.roots);
if (st.result) st.result.roots = normRootsValue(st.result.roots);
if (!st.skipped) st.skipped = {};
if (st.loves === undefined) st.loves = [];
if (!st.lovesData) st.lovesData = {};
}

function show(view) {
[ 'view-landing', 'view-start', 'view-fund', 'view-home', 'view-loves', 'view-quiz', 'view-finetune', 'view-compiling', 'view-results', 'view-profile', 'view-dishes' ].forEach(v => {
$(v).hidden = v !== view;
});
const sec = $(view);
if (sec && sec.querySelectorAll) sec.querySelectorAll('.reveal').forEach(el => el.classList.add('inview'));
const u = currentUser();
$('userbox').hidden = !u;
$('userEmail').textContent = u || '';
window.scrollTo({
top: 0,
behavior: 'smooth'
});
}

let authMode = 'login';

function setMode(mode) {
authMode = mode;
$('tabLogin').classList.toggle('active', mode === 'login');
$('tabSignup').classList.toggle('active', mode === 'signup');
$('authSubmit').textContent = mode === 'login' ? 'Log in' : 'Create my account';
$('authPassword').autocomplete = mode === 'login' ? 'current-password' : 'new-password';
$('authError').hidden = true;
}

$('tabLogin').onclick = () => setMode('login');

$('tabSignup').onclick = () => setMode('signup');

function authFail(msg) {
const e = $('authError');
e.textContent = msg;
e.hidden = false;
}

function friendlyAuthError(error) {
const m = error && error.message || 'Something went wrong.';
if (/invalid login credentials/i.test(m)) return 'Wrong email or password — try again.';
if (/already registered/i.test(m)) return 'An account with this email already exists — try logging in.';
if (/password should be at least/i.test(m)) return 'Password needs at least 6 characters.';
if (/unable to validate email/i.test(m)) return 'That email doesn\'t look right — try again?';
return m;
}

$('authForm').addEventListener('submit', async ev => {
ev.preventDefault();
if (!sb) return authFail('Couldn\'t reach the account service — check your connection and reload the page.');
const email = $('authEmail').value.trim().toLowerCase();
const pw = $('authPassword').value;
if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return authFail('That email doesn\'t look right — try again?');
if (pw.length < 6) return authFail('Password needs at least 6 characters.');
const btn = $('authSubmit');
btn.disabled = true;
const original = btn.textContent;
btn.textContent = 'One moment…';
try {
if (authMode === 'signup') {
const {data: data, error: error} = await sb.auth.signUp({
email: email,
password: pw
});
if (error) return authFail(friendlyAuthError(error));
if (!data.session) return authFail('Account created — check your email to confirm it, then log in.');
sessionUser = {
id: data.user.id,
email: data.user.email
};
} else {
const {data: data, error: error} = await sb.auth.signInWithPassword({
email: email,
password: pw
});
if (error) return authFail(friendlyAuthError(error));
sessionUser = {
id: data.user.id,
email: data.user.email
};
}
await hydrate();
routeAfterLogin();
} finally {
btn.disabled = false;
btn.textContent = original;
}
});

$('logoutBtn').onclick = async () => {
if (sb) await sb.auth.signOut();
sessionUser = null;
st = null;
setMode('login');
show('view-landing');
};

function routeAfterLogin() {
if (st && st.fundamentals && st.fundamentals.mode) {
store.set('dib_mode', st.fundamentals.mode);
pickMode = st.fundamentals.mode;
}
if (st && st.builtFor && st.builtFor.city) {
renderHome();
show('view-home');
} else {
initFundPicks();
show('view-fund');
}
}

let pickDiet = null, pickRoots = null, pickRoots2 = null, pickCity = '', pickMode = 'explore';

function savePending() {
store.set('dib_pending_fund', {
diet: pickDiet,
roots: pickRoots,
roots2: pickRoots2,
city: pickCity,
mode: pickMode
});
}

function initFundPicks() {
const saved = st && st.fundamentals || store.get('dib_pending_fund', null);
pickDiet = saved ? saved.diet : null;
pickRoots = saved ? normRootsValue(saved.roots) : null;
pickRoots2 = saved && saved.roots2 ? normRootsValue(saved.roots2) : null;
if (pickRoots2 === pickRoots) pickRoots2 = null;
pickCity = saved && saved.city ? canonicalCity(saved.city) : '';
const mStore = store.get('dib_mode', '');
pickMode = mStore === 'travel' || mStore === 'explore' ? mStore : saved && saved.mode === 'travel' ? 'travel' : 'explore';
$('cityInput').value = pickCity;
$('cityInput').classList.remove('invalid');
paintFundPicks();
}

function paintFundPicks() {
document.querySelectorAll('#dietGrid .fund-opt').forEach(b => {
const on = b.dataset.diet === pickDiet;
b.classList.toggle('picked', on);
b.setAttribute('aria-checked', on ? 'true' : 'false');
});
document.querySelectorAll('#rootsGrid .fund-opt').forEach(b => {
const on = b.dataset.roots === pickRoots, on2 = b.dataset.roots === pickRoots2;
b.classList.toggle('picked', on);
b.classList.toggle('picked2', on2);
b.setAttribute('aria-checked', on || on2 ? 'true' : 'false');
});
$('buildBtn').disabled = !(pickDiet && pickRoots && pickCity);
$('buildBtn').textContent = st && st.builtFor ? 'Rebuild my questions →' : 'Build my questions →';
const trav = pickMode === 'travel';
[ [ 'modeTravel', trav ], [ 'modeExplore', !trav ] ].forEach(([id, on]) => {
const b = $(id);
if (b) {
b.classList.toggle('picked', on);
b.setAttribute('aria-pressed', on ? 'true' : 'false');
}
});
[ [ 'fundModeTravel', trav ], [ 'fundModeExplore', !trav ] ].forEach(([id, on]) => {
const b = $(id);
if (b) {
b.classList.toggle('on', on);
b.setAttribute('aria-pressed', on ? 'true' : 'false');
}
});
const cq = $('cityQuestion');
if (cq) cq.textContent = trav ? 'Which city are you travelling to?' : 'Which city do you live in?';
}

function setPickMode(m) {
pickMode = m === 'travel' ? 'travel' : 'explore';
store.set('dib_mode', pickMode);
savePending();
paintFundPicks();
}

[ [ 'modeTravel', 'travel' ], [ 'modeExplore', 'explore' ] ].forEach(([id, m]) => {
const b = $(id);
if (!b) return;
b.onclick = () => {
setPickMode(m);
if (sessionUser) {
initFundPicks();
show('view-fund');
} else {
show('view-start');
setTimeout(() => {
const ac = document.querySelector('.auth-card');
if (ac) ac.scrollIntoView({
behavior: 'smooth',
block: 'center'
});
}, 380);
}
};
});

[ [ 'fundModeTravel', 'travel' ], [ 'fundModeExplore', 'explore' ] ].forEach(([id, m]) => {
const b = $(id);
if (b) b.onclick = () => setPickMode(m);
});

document.querySelectorAll('#dietGrid .fund-opt').forEach(b => b.onclick = () => {
pickDiet = b.dataset.diet;
savePending();
paintFundPicks();
});

document.querySelectorAll('#rootsGrid .fund-opt').forEach(b => b.onclick = () => {
const r = b.dataset.roots;
if (r === pickRoots) {
pickRoots = pickRoots2;
pickRoots2 = null;
} else if (r === pickRoots2) pickRoots2 = null; else if (!pickRoots) pickRoots = r; else if (!pickRoots2) pickRoots2 = r; else pickRoots2 = r;
savePending();
paintFundPicks();
});

const FUND_INFO = {
diet: {
everything: 'Everything — no restrictions at all. The first question asks which meats you eat, so your questions stay relevant: pick chicken-only and mutton biryani quietly leaves the set.',
vegetarian: 'Vegetarian — no meat and no seafood in any option, ever. Dairy still appears (paneer, curd rice); eggs appear only when you say you eat them — the questions will ask, and your answer governs everything after it.',
vegan: 'Vegan — fully plant-based: no meat, seafood, dairy, eggs or honey in any option. Your questions swap in plant dishes that stand on their own.',
halal: 'Everything Halal — the full spread, halal-style: no pork and no alcohol anywhere in your questions. You still pick your meats first, just like Everything.'
},
roots: {
hyderabad: 'Hyderabad, India — Deccan home turf: dum biryani, haleem, Irani café culture. Written for people who grew up on it — or wish they had.',
southasia: 'South Asia — the wider subcontinent beyond Hyderabad: Punjabi dhabas, Bengali fish courses, Sri Lankan hoppers, Karachi karahis, Nepali dal bhat.',
eastasia: 'East/Southeast Asia — ramen and sushi to laksa, pho, rendang and dumplings. If your comfort zone runs on rice, noodles and broth, start here.',
middleeast: 'Middle-Eastern — mezze spreads, kebabs, saffron rice and slow stews from the Levant, the Gulf, Persia, Turkey and Egypt.',
unitedstates: 'United States — low-and-slow BBQ, diners, burgers, gumbo and plate lunches: smoke, comfort and big plates.',
europe: 'Europe — paella to pierogi, schnitzel to souvlaki: the old continent\'s classics, from Mediterranean olive-oil country to Nordic preserves.',
africa: 'Africa — jollof and suya to injera, tagines and the braai: one continent, a thousand tables, endless fire.',
latinamerica: 'Latin America & The Caribbean — tacos, ceviche, arepas, feijoada and jerk: corn, lime and smoke run deep here.'
}
};

const FUND_DEFAULTS = {
diet: 'Your diet filters every option in all your questions — you will never be offered something you don\'t eat. Tap the ⓘ on any option to learn more.',
roots: 'Why these roots? They cover the world\'s great food families — each has a full deck of questions written for it, plus bridges to everywhere else (every set mixes your roots with global questions). Pick the one closest to your palate. Tap the ⓘ on any option to learn more.'
};

function showFundInfo(kind, text, mode) {
const box = $(kind + 'Info'), btn = $(kind + 'InfoBtn');
if (!box) return;
box.dataset.mode = mode;
box.textContent = text;
box.hidden = false;
if (btn) btn.classList.add('open');
box.classList.remove('flash');
void box.offsetWidth;
box.classList.add('flash');
}

function toggleFundInfo(kind) {
const box = $(kind + 'Info'), btn = $(kind + 'InfoBtn');
if (!box) return;
if (!box.hidden && box.dataset.mode === 'default') {
box.hidden = true;
if (btn) btn.classList.remove('open');
return;
}
showFundInfo(kind, FUND_DEFAULTS[kind] || '', 'default');
}

document.querySelectorAll('.fi').forEach(el => {
el.addEventListener('click', e => {
e.stopPropagation();
e.preventDefault();
showFundInfo(el.dataset.fi, (FUND_INFO[el.dataset.fi] || {})[el.dataset.key] || '', 'option');
});
});

$('dietInfoBtn').addEventListener('click', () => toggleFundInfo('diet'));

$('rootsInfoBtn').addEventListener('click', () => toggleFundInfo('roots'));

function canonicalCity(v) {
const t = (v || '').trim().toLowerCase();
if (!t) return '';
return CITIES.find(c => c.toLowerCase() === t) || CITIES.find(c => c.split(',')[0].trim().toLowerCase() === t) || '';
}

let cityMatches = [], cityActive = -1;

function closeCityMenu() {
$('cityMenu').hidden = true;
$('cityInput').setAttribute('aria-expanded', 'false');
cityActive = -1;
}

function pickCityValue(c) {
pickCity = c;
$('cityInput').value = c;
$('cityInput').classList.remove('invalid');
closeCityMenu();
savePending();
paintFundPicks();
}

function paintCityMenu() {
const menu = $('cityMenu');
if (!cityMatches.length) {
menu.innerHTML = `<div class="city-none">No matching city in the list yet — try a nearby major city.</div>`;
} else {
menu.innerHTML = cityMatches.map((c, i) => {
const cut = c.indexOf(',');
return `<button type="button" class="city-item${i === cityActive ? ' active' : ''}" data-city="${c}" role="option">${c.slice(0, cut)}<span class="cc">${c.slice(cut)}</span></button>`;
}).join('');
menu.querySelectorAll('.city-item').forEach(b => b.addEventListener('mousedown', e => {
e.preventDefault();
pickCityValue(b.dataset.city);
}));
}
menu.hidden = false;
$('cityInput').setAttribute('aria-expanded', 'true');
}

$('cityInput').addEventListener('input', e => {
const v = e.target.value, t = v.trim().toLowerCase();
pickCity = canonicalCity(v);
e.target.classList.toggle('invalid', !!t && !pickCity);
if (!t) {
closeCityMenu();
savePending();
paintFundPicks();
return;
}
const starts = CITIES.filter(c => c.split(',')[0].trim().toLowerCase().startsWith(t));
const incl = CITIES.filter(c => !starts.includes(c) && c.toLowerCase().includes(t));
cityMatches = [ ...starts, ...incl ].slice(0, 8);
cityActive = cityMatches.length ? 0 : -1;
paintCityMenu();
savePending();
paintFundPicks();
});

$('cityInput').addEventListener('keydown', e => {
if ($('cityMenu').hidden) return;
if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
e.preventDefault();
if (!cityMatches.length) return;
cityActive = (cityActive + (e.key === 'ArrowDown' ? 1 : -1) + cityMatches.length) % cityMatches.length;
paintCityMenu();
} else if (e.key === 'Enter') {
if (cityActive >= 0 && cityMatches[cityActive]) {
e.preventDefault();
pickCityValue(cityMatches[cityActive]);
}
} else if (e.key === 'Escape') closeCityMenu();
});

$('cityInput').addEventListener('blur', () => {
setTimeout(() => {
const canon = canonicalCity($('cityInput').value);
if (canon) pickCityValue(canon); else {
pickCity = '';
$('cityInput').classList.toggle('invalid', !!$('cityInput').value.trim());
paintFundPicks();
}
closeCityMenu();
}, 120);
});

let fundArmAt = 0;

$('buildBtn').onclick = () => {
const city = pickCity;
if (!pickDiet || !pickRoots || !city) return;
const F = {
diet: pickDiet,
roots: pickRoots,
roots2: pickRoots2 || null,
city: city,
mode: pickMode
};
const prev = st.builtFor;
if (prev && prev.diet === F.diet && prev.roots === F.roots && (prev.roots2 || null) === F.roots2) {
st.fundamentals = F;
st.builtFor = F;
if (st.result) {
const prevRes = st.result;
st.result = computeResult(st);
if (prevRes.partial) {
st.result.partial = true;
st.result.answered = prevRes.answered;
st.result.skipped = prevRes.skipped;
st.result.early = prevRes.early;
}
if (prevRes.aiV >= 2) {
const oldLines = {};
(prevRes.recs || []).forEach(r => {
oldLines[r.dish] = r.whyYou;
});
(st.result.recs || []).forEach(r => {
if (oldLines[r.dish]) r.whyYou = oldLines[r.dish];
});
st.result.aiV = 2;
if (prevRes.aiAlt) st.result.aiAlt = prevRes.aiAlt;
}
st.altRecs = altRecsCache;
}
saveState();
if (!st.finished && answeredCount(st) === 0) {
st.pos = 0;
enterQuiz();
} else {
renderHome();
show('view-home');
}
return;
}
if ((prev || st.finished) && answeredCount(st) > 0 && Date.now() - fundArmAt > 4e3) {
fundArmAt = Date.now();
const b = $('buildBtn');
const oldLabel = b.textContent;
b.textContent = '⚠️ New settings clear your current answers — tap again to continue';
setTimeout(() => {
if (b.textContent.startsWith('⚠️')) b.textContent = oldLabel;
}, 4e3);
return;
}
fundArmAt = 0;
st.fundamentals = F;
st.builtFor = F;
st.answers = {};
st.skipped = {};
st.finished = false;
st.result = null;
st.sheetSent = false;
st.loves = null;
st.lovesData = {};
buildOrder(st);
saveState();
st.pos = 0;
enterQuiz();
};

$('fundExitBtn').onclick = () => {
renderHome();
show('view-home');
};

function renderHome() {
if (!st) return;
const n = answeredCount(st);
const restart = $('restartBtn'), change = $('changeFundBtn');
$('fundSummary').textContent = st.builtFor ? `Your fundamentals: ${DIET_LABELS[st.builtFor.diet]} · ${ROOT_EMOJI[st.builtFor.roots]} ${rootsLabelOf(st.builtFor)} roots${st.builtFor.city ? st.builtFor.mode === 'travel' ? ` · ✈️ Travelling to ${st.builtFor.city}` : ` · 📍 ${st.builtFor.city}` : ''}` : '';
restart.hidden = !(n > 0 || st.finished);
change.hidden = !st.builtFor;
if (!st.builtFor) {
$('homeTitle').textContent = 'One quick step first 🧭';
$('homeText').textContent = 'Pick your diet, your roots and the city you live in — and we\'ll build your questions around them.';
$('primaryAction').textContent = 'Pick my fundamentals →';
} else if (st.finished) {
$('homeTitle').textContent = 'Your taste profile is ready 🎉';
if (st.result && !st.result.partial) {
const stripLbl = s2 => String(s2 || '').replace(/^\S+\s/, '');
const sumTags = (st.result.summaryTags && st.result.summaryTags.length >= 2 ? st.result.summaryTags : st.result.topTags || []).map(t => stripLbl(TAG_LABELS[t])).filter(Boolean);
const topAx = (st.result.axes || []).find(a => a.lean && a.lean !== 'mid') || (st.result.axes || [])[0];
const axBit = topAx ? ` · strongest lean: ${topAx.lean === 'hi' ? topAx.hi : topAx.lean === 'lo' ? topAx.lo : topAx.name}` : '';
$('homeText').textContent = `Your palate in one line: ${sumTags.length >= 2 ? `${sumTags[0]} meets ${sumTags[1].toLowerCase()}` : 'mapped and ready'}${axBit}. ${(st.result.recs || []).length} dishes are picked and waiting.`;
} else {
$('homeText').textContent = st.result && st.result.partial ? `You ended early after ${n} answers, so this profile is based on limited information. Come see what your taste buds had to say — or retake the questions for the complete picture.` : 'You\'ve answered all your questions. Come see what your taste buds had to say — and which world flavours to meet next.';
}
$('primaryAction').textContent = 'See my taste profile';
} else if (n > 0) {
$('homeTitle').textContent = 'Welcome back 👋';
$('homeText').textContent = `You've answered ${n} questions — everything, slider weights included, is saved to your account. Pick up right where you left off, on any device.`;
$('primaryAction').textContent = n >= runTotal(st) ? 'Continue — see your results' : `Continue — question ${n + 1}`;
} else {
$('homeTitle').textContent = 'Ready to dive in?';
$('homeText').textContent = `Your questions are built around ${rootsLabelOf(st.builtFor)} roots and a ${DIET_LABELS[st.builtFor.diet]} diet. About 10 minutes — save & exit anytime.`;
$('primaryAction').textContent = 'Start the questions';
}
}

$('primaryAction').onclick = () => {
if (!st.builtFor) {
initFundPicks();
show('view-fund');
return;
}
if (st.finished) {
renderResults();
show('view-results');
return;
}
const t = findNext(0);
st.pos = t >= 0 ? t : 0;
saveState();
enterQuiz();
};

$('changeFundBtn').onclick = () => {
initFundPicks();
show('view-fund');
};

let restartArmAt = 0;

function doRestart(e) {
const btn = e && e.currentTarget;
if (Date.now() - restartArmAt > 4e3) {
restartArmAt = Date.now();
if (btn) {
const oldLabel = btn.textContent;
btn.textContent = 'Tap again to confirm — answers will be cleared';
setTimeout(() => {
if (btn.textContent.startsWith('Tap again to confirm')) btn.textContent = oldLabel;
}, 4e3);
}
return;
}
restartArmAt = 0;
st.answers = {};
st.skipped = {};
st.seen = [];
st.navAt = -1;
st.pos = 0;
st.finished = false;
st.result = null;
st.sheetSent = false;
st.altRecs = null;
if (!Array.isArray(st.loves)) {
st.loves = null;
st.lovesData = {};
}
buildOrder(st);
saveState();
renderHome();
show('view-home');
}

$('restartBtn').onclick = doRestart;

$('quizRestartBtn').onclick = doRestart;

const LOVES_MIN = 5, LOVES_MAX = 15;

let dishIndexPromise = null, dishMetaPromise = null, lovesWired = false, lovesLoadFailed = false, lovesLastQuery = null, lovesQueryRaw = '';

const dishShardPromises = {};

let DISH_LIST = null;

const dishById = new Map;

function loadScriptOnce(src) {
return new Promise((resolve, reject) => {
const el = document.createElement('script');
el.src = src;
el.onload = () => resolve();
el.onerror = () => reject(new Error('load ' + src));
document.head.appendChild(el);
});
}

function ensureDishMeta() {
if (window.DISH_META) return Promise.resolve();
if (!dishMetaPromise) dishMetaPromise = loadScriptOnce('dishes-meta.js?v=3');
return dishMetaPromise;
}

const normDishText = s => (s || '').toLowerCase().replace(/[^a-z0-9 ]/g, ' ').replace(/\s+/g, ' ').trim();

function ensureDishIndex() {
if (DISH_LIST) return Promise.resolve();
if (!dishIndexPromise) {
dishIndexPromise = ensureDishMeta().then(() => Promise.all(Array.from({
length: window.DISH_META.idxShards
}, (_, n) => loadScriptOnce(`dishes-idx-${n}.js?v=3`)))).then(() => {
DISH_LIST = [];
let id = 0;
for (let n = 0; n < window.DISH_META.idxShards; n++) {
for (const line of (window['DISH_IDX_' + n] || '').split('\n')) {
if (!line) continue;
const [name, oc, cc] = line.split('\t');
const e = {
name: name,
origin: window.DISH_META.origins[+oc] || '',
course: window.DISH_META.courses[+cc] || '',
id: id++,
nn: normDishText(name),
no: ''
};
e.no = normDishText(e.origin);
DISH_LIST.push(e);
dishById.set(e.id, e);
}
}
});
}
return dishIndexPromise;
}

function ensureDishData(id) {
const M = window.DISH_META;
if (!M || id >= M.tagHead) return Promise.resolve(null);
const n = Math.floor(id / M.tagBlock), key = 'DISH_TAGS_' + n;
if (window[key]) return Promise.resolve(window[key][id] || null);
if (!dishShardPromises[n]) dishShardPromises[n] = loadScriptOnce(`dishes-tags-${n}.js?v=3`);
return dishShardPromises[n].then(() => (window[key] || {})[id] || null).catch(() => null);
}

function searchDishes(query) {
const q = normDishText(query);
if (!q || !DISH_LIST) return [];
const toks = q.split(' ');
const hits = [];
for (const e of DISH_LIST) {
if (!toks.every(t => e.nn.includes(t) || e.no.includes(t))) continue;
let rank = 2;
if (e.nn === q) rank = -1; else if (e.nn.startsWith(q)) rank = 0; else if (e.nn.split(' ').some(w => w.startsWith(toks[0]))) rank = 1;
hits.push({
rank: rank,
e: e,
k: e.nn.replace(/[^a-z]/g, '')
});
}
hits.sort((a, b) => a.rank - b.rank || a.k.localeCompare(b.k));
return hits.slice(0, 24).map(h => h.e);
}

function paintLoveResults(list) {
lovesLastQuery = list;
let html = list.slice(0, 3).sort((a, b) => a.nn.replace(/[^a-z]/g, '').localeCompare(b.nn.replace(/[^a-z]/g, ''))).map(e => {
const picked = (st.loves || []).includes(e.id);
return `<button type="button" class="opt${picked ? ' sel' : ''}" data-pick="${e.id}">${e.name}<span class="dish-sub">${[ e.origin, e.course ].filter(Boolean).join(' · ')}</span></button>`;
}).join('');
const q = normDishText(lovesQueryRaw || '');
if (q.length >= 3 && !list.some(e => e.nn === q) && (st.loves || []).length < LOVES_MAX && !(st.loves || []).includes(customDishId(lovesQueryRaw))) {
const shown = (lovesQueryRaw || '').trim().replace(/\s+/g, ' ');
html += `<button type="button" class="opt opt-custom" data-custom="1">＋ Add “${shown}”<span class="dish-sub">Not in our list yet — add yours; we'll look it up online, and share it so others can find it too</span></button>`;
}
$('lovesResults').innerHTML = html;
}

function clearLovesSearch() {
const inp = $('lovesInput');
if (inp) {
inp.value = '';
inp.focus();
}
lovesQueryRaw = '';
lovesCommunityHits = [];
paintLoveResults([]);
}

const NAME_FLAVOR_RULES = [ [ /biryani|briyani/, [ 'rice', 'biryani', 'spice' ] ], [ /pulao|pilaf|pilau|rice|risotto|paella|jollof|fried rice/, [ 'rice' ] ], [ /noodle|ramen|pasta|spaghetti|udon|soba|pho|mee |laksa|chow mein|pad thai/, [ 'noodle' ] ], [ /soup|stew|broth|shorba|rasam|curry/, [ 'soup' ] ], [ /salad|slaw/, [ 'fresh', 'healthy' ] ], [ /grill|bbq|barbecue|tandoori|kebab|kabab|skewer|suya|robata/, [ 'smoky' ] ], [ /fried|crispy|tempura|pakora|bajji|samosa|spring roll/, [ 'crisp' ] ], [ /cake|pie|pudding|halwa|laddu|ladoo|barfi|burfi|gulab jamun|rasmalai|rasgulla|kheer|payasam|falooda|kulfi|ice cream|brownie|cookie|biscuit|tiramisu|cheesecake|mousse|jelabi|jalebi|imarti|baklava|kunafa|halva|mysore pak|sandesh|peda/, [ 'sweet' ] ], [ /chicken|murgh/, [ 'meat' ] ], [ /beef|mutton|lamb|gosht|pork|ham|bacon|sausage|steak|veal|duck|turkey|keema|qeema|mince/, [ 'meat' ] ], [ /fish|machli|salmon|tuna|cod|sea bass|pomfret|hilsa|rohu|surmai/, [ 'seafood' ] ], [ /prawn|shrimp|jhinga|crab|lobster|squid|oyster|mussel|scallop|seafood/, [ 'seafood' ] ], [ /egg|anda|omelette|omelet/, [ 'egg' ] ], [ /paneer|tofu/, [ 'veg' ] ], [ /dal|daal|lentil|sambar|sambhar/, [ 'veg', 'soup' ] ], [ /sabzi|bhaji|poriyal|thoran|avial|curry leaves/, [ 'veg' ] ], [ /tea|chai/, [ 'chai' ] ], [ /coffee|espresso|cappuccino|latte/, [ 'coffee' ] ], [ /spicy|chilli|chili|mirchi|peri peri|harissa|sichuan|szechuan/, [ 'spice' ] ], [ /pickle|achar|kimchi|sauerkraut/, [ 'fermented' ] ], [ /yoghurt|yogurt|curd|raita/, [ 'tangy', 'creamy' ] ], [ /cream|makhani|malai|alfredo|carbonara/, [ 'creamy' ] ], [ /tikka masala|butter chicken/, [ 'creamy', 'spice' ] ], [ /street|chaat|taco|burger|pizza|wrap|roll\b/, [ 'street' ] ], [ /home ?style|traditional|classic/, [ 'classic' ] ] ];

function deriveNameFlavors(name) {
const n = ' ' + normDishText(name) + ' ';
const out = [];
NAME_FLAVOR_RULES.forEach(([re, tags]) => {
if (re.test(n)) tags.forEach(t => {
if (!out.includes(t)) out.push(t);
});
});
return out.slice(0, 8);
}

function customDishId(name) {
const n = normDishText(name);
let h = 0;
for (let i = 0; i < n.length; i++) h = (h * 31 + n.charCodeAt(i)) % 1e8;
return -(h + 1);
}

function addCustomDish() {
const name = (lovesQueryRaw || '').trim().replace(/\s+/g, ' ');
if (name.length < 3) return;
const id = customDishId(name);
const pretty = name.replace(/\b\w/g, c => c.toUpperCase());
dishById.set(id, {
id: id,
name: pretty,
origin: 'Added by you',
course: '',
nn: normDishText(name),
no: ''
});
st.lovesData = st.lovesData || {};
st.lovesData[id] = {
n: pretty,
i: [],
f: deriveNameFlavors(name)
};
addLove(id);
clearLovesSearch();
enrichAndSubmitCustom(id, pretty);
}

const ING_FLAVOR_KEYS = [ [ [ 'chilli', 'chili', 'jalapeno', 'habanero', 'cayenne', 'paprika', 'gochujang', 'harissa', 'sriracha', 'hot sauce', 'pepper flakes' ], [ 'spice' ] ], [ [ 'chipotle', 'smoked paprika' ], [ 'smoky' ] ], [ [ 'cream', 'cheese', 'butter', 'milk', 'yoghurt', 'yogurt', 'paneer', 'mozzarella', 'parmesan', 'ghee', 'coconut milk' ], [ 'creamy' ] ], [ [ 'lemon', 'lime', 'vinegar', 'tamarind', 'tomato', 'sumac', 'orange' ], [ 'tangy' ] ], [ [ 'kimchi', 'sauerkraut', 'miso', 'soy sauce', 'fish sauce', 'pickle', 'pickled' ], [ 'fermented' ] ], [ [ 'sugar', 'honey', 'jaggery', 'caramel', 'chocolate' ], [ 'sweet' ] ], [ [ 'chicken', 'beef', 'lamb', 'mutton', 'pork', 'veal', 'duck', 'turkey', 'mince', 'keema', 'sausage', 'bacon', 'ham', 'meat' ], [ 'meat' ] ], [ [ 'fish', 'prawn', 'shrimp', 'crab', 'lobster', 'squid', 'mussel', 'oyster', 'scallop', 'salmon', 'tuna', 'cod', 'anchovy' ], [ 'seafood' ] ], [ [ 'rice', 'basmati' ], [ 'rice' ] ], [ [ 'noodle', 'pasta', 'spaghetti', 'ramen', 'udon', 'soba', 'vermicelli' ], [ 'noodle' ] ], [ [ 'lentil', 'chickpea', 'tofu', 'potato', 'cauliflower', 'spinach', 'okra', 'aubergine', 'eggplant', 'mushroom', 'cabbage', 'carrot', 'beans' ], [ 'veg' ] ], [ [ 'coriander', 'cilantro', 'mint', 'basil', 'parsley', 'dill', 'lettuce', 'cucumber' ], [ 'fresh' ] ], [ [ 'tea' ], [ 'chai' ] ], [ [ 'coffee', 'espresso' ], [ 'coffee' ] ], [ [ 'breadcrumbs', 'batter' ], [ 'crisp' ] ] ];

function flavorsFromIngredients(ings) {
const text = ' ' + (ings || []).join(' ').toLowerCase() + ' ';
const out = [];
ING_FLAVOR_KEYS.forEach(([keys, tags]) => {
if (keys.some(k => new RegExp('\\b' + k.replace(/ /g, '\\s') + '(e?s)?\\b').test(text))) tags.forEach(t => {
if (!out.includes(t)) out.push(t);
});
});
return out.slice(0, 8);
}

const ING_LEXICON = [ 'chicken', 'beef', 'lamb', 'mutton', 'pork', 'duck', 'meat', 'fish', 'prawn', 'shrimp', 'crab', 'lobster', 'squid', 'mussel', 'oyster', 'salmon', 'tuna', 'egg', 'rice', 'noodle', 'pasta', 'potato', 'sweet potato', 'onion', 'garlic', 'ginger', 'tomato', 'chilli', 'chili', 'pepper', 'cumin', 'turmeric', 'coriander', 'cardamom', 'cinnamon', 'clove', 'mustard', 'fenugreek', 'mint', 'basil', 'parsley', 'cilantro', 'lemon', 'lime', 'tamarind', 'coconut', 'milk', 'cream', 'butter', 'ghee', 'cheese', 'yoghurt', 'yogurt', 'paneer', 'tofu', 'lentil', 'chickpea', 'bean', 'pea', 'spinach', 'okra', 'aubergine', 'eggplant', 'cauliflower', 'cabbage', 'carrot', 'mushroom', 'corn', 'flour', 'bread', 'sugar', 'honey', 'olive oil', 'sesame', 'peanut', 'cashew', 'almond', 'walnut', 'vinegar', 'soy sauce', 'fish sauce', 'miso', 'kimchi', 'sausage', 'bacon', 'ham' ];

function ingredientsFromText(text) {
const t = ' ' + (text || '').toLowerCase() + ' ';
return ING_LEXICON.filter(w => new RegExp('(^|[^a-z])' + w.replace(/ /g, '\\s') + 's?([^a-z]|$)').test(t));
}

function mealToDish(meal, wantNorm) {
if (!meal || !meal.strMeal) return null;
const nn = normDishText(meal.strMeal);
if (!nn || wantNorm && nn !== wantNorm && !nn.includes(wantNorm) && !wantNorm.includes(nn)) return null;
const ings = [];
for (let i = 1; i <= 20; i++) {
const v = (meal['strIngredient' + i] || '').trim();
if (v) ings.push(v);
}
if (ings.length < 2) return null;
const f = flavorsFromIngredients(ings);
if (!f.length) return null;
return {
name: meal.strMeal,
origin: (meal.strArea || '').trim(),
i: ings.slice(0, 10),
f: f,
source: 'themealdb'
};
}

function wikiToDish(extract, name) {
if (!extract || extract.length < 60) return null;
const ings = ingredientsFromText(extract);
if (ings.length < 2) return null;
const f = flavorsFromIngredients(ings);
if (!f.length) return null;
return {
name: name,
origin: '',
i: ings.slice(0, 10),
f: f,
source: 'wikipedia'
};
}

function communityRowFor(name, data, sourced, uid) {
return {
name: name,
norm: normDishText(name),
origin: data && data.origin || null,
ingredients: data && data.i || [],
flavors: data && data.f || [],
source: data && data.source || 'name',
confidence: sourced ? 'sourced' : 'name',
status: sourced ? 'live' : 'pending',
submitted_by: uid
};
}

let communityOff = false;

const commDataById = new Map;

async function fetchJsonTimeout(url, ms) {
const c = new AbortController;
const t = setTimeout(() => c.abort(), ms || 6e3);
try {
const r = await fetch(url, {
signal: c.signal
});
if (!r.ok) return null;
return await r.json();
} catch (e) {
return null;
} finally {
clearTimeout(t);
}
}

async function enrichDishOnline(name) {
const q = encodeURIComponent(name);
const mj = await fetchJsonTimeout('https://www.themealdb.com/api/json/v1/1/search.php?s=' + q);
const fromMeal = mealToDish(mj && mj.meals && mj.meals[0], normDishText(name));
if (fromMeal) return fromMeal;
const wj = await fetchJsonTimeout('https://en.wikipedia.org/w/api.php?action=query&prop=extracts&exintro=1&explaintext=1&format=json&origin=*&redirects=1&titles=' + q);
const pages = wj && wj.query && wj.query.pages;
const page = pages && Object.values(pages)[0];
if (page && page.extract) {
const d = wikiToDish(page.extract, name);
if (d) return d;
}
const fj = await fetchJsonTimeout('https://en.wikipedia.org/w/api.php?action=query&prop=extracts&explaintext=1&format=json&origin=*&redirects=1&titles=' + q);
const fpages = fj && fj.query && fj.query.pages;
const fpage = fpages && Object.values(fpages)[0];
if (fpage && fpage.extract) return wikiToDish(fpage.extract, name);
return null;
}

async function enrichAndSubmitCustom(id, pretty) {
let data = null;
try {
data = await enrichDishOnline(pretty);
} catch (e) {
data = null;
}
if (!(st.loves || []).includes(id)) return;
if (data) {
st.lovesData[id] = {
n: pretty,
i: data.i,
f: data.f
};
saveState();
}
submitCommunityDish(pretty, data || {
i: [],
f: (st.lovesData[id] || {}).f || [],
source: 'name'
}, !!data);
}

async function submitCommunityDish(pretty, data, sourced) {
if (!sb || !sessionUser || communityOff) return;
try {
const {error: error} = await sb.from('community_dishes').insert(communityRowFor(pretty, data, sourced, sessionUser.id));
if (error && !/duplicate|23505|unique/i.test(error.message || '')) communityOff = true;
} catch (e) {
communityOff = true;
}
}

let lovesCommunityHits = [], communitySeq = 0, communityTimer = null;

function scheduleCommunitySearch() {
clearTimeout(communityTimer);
communityTimer = setTimeout(runCommunitySearch, 300);
}

async function runCommunitySearch() {
const q = normDishText(lovesQueryRaw || '');
lovesCommunityHits = [];
if (!sb || communityOff || q.length < 3) return;
const local = searchDishes(lovesQueryRaw);
if (local.some(e => e.nn === q)) return;
const seq = ++communitySeq;
try {
const {data: data, error: error} = await sb.from('community_dishes').select('name,norm,origin,ingredients,flavors').eq('status', 'live').ilike('norm', '%' + q + '%').limit(8);
if (error) {
communityOff = true;
return;
}
if (seq !== communitySeq || normDishText(lovesQueryRaw || '') !== q) return;
lovesCommunityHits = (data || []).filter(r => !local.some(e => e.nn === r.norm)).map(r => {
const id = customDishId(r.name);
dishById.set(id, {
id: id,
name: r.name,
origin: r.origin || 'Added by the community',
course: '',
nn: r.norm,
no: '',
comm: true
});
commDataById.set(id, {
i: r.ingredients || [],
f: r.flavors || []
});
return dishById.get(id);
});
if (lovesCommunityHits.length) {
const exact = lovesCommunityHits.filter(e => e.nn === q), rest = lovesCommunityHits.filter(e => e.nn !== q);
paintLoveResults([ ...exact, ...local, ...rest ]);
}
} catch (e) {
communityOff = true;
}
}

function paintLoves() {
const loves = st.loves || [];
$('lovesCount').textContent = loves.length < LOVES_MIN ? `${loves.length} of ${LOVES_MIN} to get started` : `${loves.length} picked · up to ${LOVES_MAX} if you like`;
$('lovesDots').innerHTML = Array.from({
length: LOVES_MIN
}, (_, i) => `<span class="dot${i < loves.length ? ' on' : ''}"></span>`).join('');
$('lovesNext').disabled = !(loves.length >= LOVES_MIN || lovesLoadFailed && loves.length === 0);
$('lovesHint').textContent = lovesLoadFailed ? 'The dish list couldn\'t load — tap Continue to go straight to the questions.' : loves.length >= LOVES_MAX ? 'That\'s your 15 — tap a picked dish to swap it out.' : loves.length >= LOVES_MIN ? 'Lovely list. Add more, or continue when you\'re ready.' : loves.length === 0 ? '' : `${LOVES_MIN - loves.length} more to get started — that's all we need.`;
$('lovesPicked').innerHTML = loves.map(id => {
const d = (st.lovesData || {})[id];
const name = d ? d.n : (dishById.get(id) || {}).name || 'Dish';
return `<button type="button" class="opt sel" data-love="${id}">${name}<span class="love-x" aria-hidden="true">✕</span></button>`;
}).join('');
}

async function addLove(id) {
st.loves = st.loves || [];
if (st.loves.includes(id) || st.loves.length >= LOVES_MAX) {
paintLoves();
return;
}
st.loves.push(id);
const entry = dishById.get(id);
st.lovesData = st.lovesData || {};
if (id < 0 && commDataById.has(id)) {
const cd = commDataById.get(id);
st.lovesData[id] = {
n: entry ? entry.name : 'Dish',
i: cd.i || [],
f: cd.f || [],
c: entry ? entry.course || '' : ''
};
} else {
st.lovesData[id] = {
n: entry ? entry.name : 'Dish',
i: id < 0 ? (st.lovesData[id] || {}).i || [] : [],
f: id < 0 ? (st.lovesData[id] || {}).f || [] : [],
c: entry ? entry.course || '' : ''
};
}
saveState();
paintLoves();
if (lovesLastQuery) paintLoveResults(lovesLastQuery);
if (id < 0) return;
const d = await ensureDishData(id);
if (d) {
st.lovesData[id] = {
n: entry ? entry.name : 'Dish',
i: d.i || [],
f: d.f || [],
c: entry ? entry.course || '' : ''
};
saveState();
}
}

function removeLove(id) {
st.loves = (st.loves || []).filter(x => x !== id);
if (st.lovesData) delete st.lovesData[id];
saveState();
paintLoves();
if (lovesLastQuery) paintLoveResults(lovesLastQuery);
}

const STARTER_CANDIDATES = [ 'Biryani', 'Pizza', 'Sushi', 'Pasta', 'Burger', 'Tacos', 'Chocolate cake', 'Fried chicken', 'Ice cream', 'Coffee', 'Ramen', 'Salad' ];

function paintStarters() {
const wrap = $('lovesStarters'), box = $('starterChips');
if (!wrap || !box) return;
if (!DISH_LIST || lovesQueryRaw || (st.loves || []).length >= LOVES_MIN) {
wrap.hidden = true;
return;
}
const chips = [];
for (const cand of STARTER_CANDIDATES) {
const hits = searchDishes(cand);
if (!hits.length) continue;
const e = hits.find(x => x.nn === normDishText(cand)) || hits[0];
if (e && !(st.loves || []).includes(e.id) && !chips.some(c => c.id === e.id)) chips.push(e);
if (chips.length >= 8) break;
}
box.innerHTML = chips.map(e => `<button type="button" class="starter-chip" data-starter="${e.id}">${e.name}</button>`).join('');
wrap.hidden = !chips.length;
}

function renderLoves() {
if (!Array.isArray(st.loves)) st.loves = [];
$('lovesInput').value = '';
lovesQueryRaw = '';
paintLoveResults([]);
paintLoves();
const loadNote = $('lovesLoadNote');
if (loadNote) loadNote.hidden = !!DISH_LIST;
ensureDishMeta().then(() => ensureDishIndex()).then(() => {
paintLoves();
if (loadNote) loadNote.hidden = true;
paintStarters();
if (lovesQueryRaw) {
paintLoveResults(searchDishes(lovesQueryRaw));
scheduleCommunitySearch();
}
}).catch(() => {
lovesLoadFailed = true;
if (loadNote) loadNote.hidden = true;
paintLoves();
});
if (lovesWired) return;
lovesWired = true;
$('lovesInput').addEventListener('input', e => {
lovesQueryRaw = e.target.value;
const q = e.target.value.trim();
if (!DISH_LIST) return;
if (!q) {
lovesCommunityHits = [];
paintLoveResults([]);
paintStarters();
return;
}
paintStarters();
paintLoveResults(searchDishes(q));
scheduleCommunitySearch();
});
$('starterChips').addEventListener('click', e => {
const b = e.target.closest('[data-starter]');
if (!b) return;
addLove(+b.dataset.starter);
paintStarters();
});
$('lovesResults').addEventListener('click', e => {
const c = e.target.closest('[data-custom]');
if (c) {
addCustomDish();
return;
}
const b = e.target.closest('[data-pick]');
if (!b) return;
const id = +b.dataset.pick;
if ((st.loves || []).includes(id)) removeLove(id); else {
addLove(id);
clearLovesSearch();
}
});
$('lovesPicked').addEventListener('click', e => {
const b = e.target.closest('[data-love]');
if (!b) return;
removeLove(+b.dataset.love);
});
$('lovesNext').onclick = () => {
if (lovesLoadFailed && (!st.loves || st.loves.length === 0)) st.loves = [];
if (!Array.isArray(st.loves) || st.loves.length < LOVES_MIN && !lovesLoadFailed) return;
saveState();
const t = findNext(0);
st.pos = t >= 0 ? t : 0;
renderQuestion();
show('view-quiz');
};
}

function enterQuiz() {
const freshStart = !st.finished && answeredCount(st) === 0;
const partialRestore = Array.isArray(st.loves) && st.loves.length > 0 && st.loves.length < LOVES_MIN && !st.finished && answeredCount(st) === 0;
if (st.loves === null || freshStart || partialRestore) {
renderLoves();
show('view-loves');
return;
}
renderQuestion();
show('view-quiz');
}

let pendingW = 1;

let pendingSel = new Set;

let pendingRank = [];

const currentQ = () => QBANK_BY_ID[st.order[st.pos]];

function findNext(fromPos) {
for (let i = fromPos; i < st.order.length; i++) {
const q = QBANK_BY_ID[st.order[i]];
if (q && !st.answers[q.id] && playable(q, st)) return i;
}
return -1;
}

function renderQuestion() {
let q = currentQ();
if (!q) return;
if (!st.answers[q.id] && !playable(q, st) && !(st.skipped && st.skipped[q.id])) {
const t = findNext(st.pos);
if (t >= 0) {
st.pos = t;
q = currentQ();
}
}
st.seen = st.seen || [];
if (st.order.length) {
if (!st.seen.length) st.seen = st.order.slice(0, st.pos + 1); else {
const head = st.order.indexOf(st.seen[0]);
if (head > 0) st.seen = [ ...st.order.slice(0, head), ...st.seen ];
}
}
if (q && !st.seen.includes(q.id)) st.seen.push(q.id);
const saved = st.answers[q.id];
const n = answeredCount(st);
const upto = st.order.slice(0, st.order.indexOf(q.id) + 1);
const skippedBefore = upto.filter(id => id !== q.id && st.skipped && st.skipped[id]).length;
const posInRun = Math.min(upto.length - skippedBefore, runTotal(st));
$('qCounter').textContent = `Question ${posInRun} of ${runTotal(st)}`;
const msEl = $('quizMilestone');
if (msEl) {
let ms = '';
if (n === 5 || n === 10 || n === 15) {
const parts = [];
if (n === 5) {
parts.push(`Five answers in — your ${rootsLabelOf(st.builtFor)} roots are steering this deck`);
const av = aversionsOf(st);
if (av.length) parts.push(`hard no's already on guard: ${av.slice(0, 2).map(a => a.split(' — ')[0]).join(', ')}`);
} else if (n === 10) {
parts.push('Halfway there');
if ((st.loves || []).length >= LOVES_MIN) parts.push(`your ${(st.loves || []).length} favourites anchor every match`);
if (st.builtFor && st.builtFor.city) parts.push(st.builtFor.mode === 'travel' ? `the ${st.builtFor.city.split(',')[0]} table is being set` : `places in ${st.builtFor.city.split(',')[0]} join at the end`);
} else {
parts.push('Fifteen down, five to go');
parts.push('the last stretch goes wide — world flavours your roots haven\'t met yet');
}
ms = parts.join(' · ') + '.';
}
msEl.textContent = ms;
msEl.hidden = !ms;
}
$('progressBar').style.width = n / runTotal(st) * 100 + '%';
$('progressWrap').setAttribute('aria-valuenow', n);
$('progressWrap').setAttribute('aria-valuemax', runTotal(st));
$('qSection').textContent = DECK_LABELS[q.deck] || '';
$('qSub').textContent = DECK_SUBS[q.deck] || '';
$('qEmoji').textContent = q.emoji;
const img = $('qImg');
const url = imgUrlFor(q);
img.style.display = url ? '' : 'none';
const qCardEl = $('qCard');
if (qCardEl) {
if (url) qCardEl.classList.remove('noimg'); else qCardEl.classList.add('noimg');
}
img.classList.remove('ld');
if (url) {
img.srcset = `${url.replace('w=1200', 'w=640')} 640w, ${url} 1200w`;
img.sizes = '(max-width: 680px) 100vw, 640px';
img.onload = () => img.classList.add('ld');
img.src = url;
if (img.complete && img.naturalWidth) img.classList.add('ld');
}
img.alt = q.q;
const visN = visibleOpts(q, st).length;
const effRank = q.rank ? Math.min(q.rank, visN || 1) : 0;
$('qText').textContent = q.rank && visN < q.rank ? q.q.replace(/top 3/i, 'top ' + visN).replace(/plus 2nd & 3rd/i, 'plus 2nd').replace(/rank your top 3/i, 'rank your top ' + visN) : q.q;
$('multiHint').hidden = !(q.multi || q.rank);
$('multiHint').textContent = q.rank ? effRank >= 3 ? '🥇 Tap in order — your #1 first, then #2, then #3.' : '🥇 Tap your #1 pick first — then your #2.' : '✋ Pick all that apply — then hit Next.';
$('qInfoBtn').hidden = false;
$('qInfoBtn').classList.remove('open');
$('qInfoPanel').hidden = true;
$('qInfoPanel').textContent = [ q.info, '🎚️ The confidence slider: every pick carries a strength from 1 to 5. At 1 the other options nearly won; at 5 it\'s this pick, no debate. Your high-confidence picks count for more when your taste profile and recommendations are built — so slide up only when you really mean it, and leave it at 1 when you\'re torn.' ].filter(Boolean).join(' ');
pendingSel = new Set(saved && Array.isArray(saved.o) ? saved.o : []);
pendingRank = saved && saved.r ? [ ...saved.o ] : [];
const box = $('qOptions');
box.innerHTML = '';
visibleOpts(q, st).forEach(({o: o, i: i}) => {
const picked = q.rank ? pendingRank.includes(i) : q.multi ? pendingSel.has(i) : saved && saved.o === i;
const b = document.createElement('button');
b.type = 'button';
b.className = 'opt' + (q.multi ? ' multi' : '') + (q.rank ? ' rank' : '') + (picked ? ' picked' : '');
b.textContent = o.t;
if (q.rank && pendingRank.includes(i)) {
const bd = document.createElement('span');
bd.className = 'rank-badge';
bd.textContent = [ '1st', '2nd', '3rd' ][pendingRank.indexOf(i)] || '';
b.appendChild(bd);
}
b.dataset.oi = i;
b.setAttribute('aria-pressed', picked ? 'true' : 'false');
b.onclick = () => q.rank ? toggleRank(i) : q.multi ? toggleOption(i) : selectOption(i);
box.appendChild(b);
});
pendingW = saved ? saved.w : 1;
const noSlider = !!q.hate || [ 'glo-fish', 'glo-alc', 'glo-beef' ].includes(q.id);
if (noSlider) pendingW = 1;
const sBlock = $('sliderBlock');
if (sBlock) sBlock.style.display = noSlider ? 'none' : '';
$('weightSlider').value = pendingW;
updateSliderLabel();
const sliderHint = $('sliderHint');
if (sliderHint) sliderHint.textContent = '1 = the others nearly won · 5 = no contest. Strong picks steer your profile most.';
const hasAnswer = q.rank ? pendingRank.length > 0 : q.multi ? pendingSel.size > 0 : !!saved;
$('nextBtn').disabled = !hasAnswer;
$('nextBtn').textContent = hasAnswer && n >= runTotal(st) - 1 && findNext(0) === -1 ? 'Finish — see my profile 🎉' : 'Next →';
const seenIdx = st.seen ? st.seen.indexOf(q.id) : -1;
const browsing = st.navAt >= 0 && seenIdx >= 0 && seenIdx < (st.seen || []).length - 1;
if (browsing) {
$('nextBtn').disabled = false;
$('nextBtn').textContent = 'Next →';
}
$('backBtn').style.visibility = seenIdx > 0 || st.pos > 0 ? 'visible' : 'hidden';
const skipB = $('skipBtn');
if (skipB) skipB.style.display = st.skipped && st.skipped[q.id] ? 'none' : '';
$('savedNote').textContent = n ? `✓ ${n} answer${n > 1 ? 's' : ''} saved` : '';
paintEndBtn();
const inner = $('qInner');
inner.style.animation = 'none';
void inner.offsetWidth;
inner.style.animation = '';
const nextId = st.order[st.pos + 1];
if (nextId && QBANK_BY_ID[nextId]) {
const pre = new Image;
pre.src = imgUrlFor(QBANK_BY_ID[nextId]);
}
$('qText').focus({
preventScroll: true
});
}

function updateSliderLabel() {
$('sliderVal').textContent = `${pendingW} · ${WEIGHT_WORDS[pendingW]}`;
const sl = $('weightSlider');
if (sl && sl.style && sl.style.setProperty) sl.style.setProperty('--valp', (pendingW - 1) / 4 * 100 + '%');
}

function paintEndBtn() {
const showEnd = !!st && !st.finished && answeredCount(st) >= 5;
$('endBtn').hidden = !showEnd;
$('endInfoBtn').hidden = !showEnd;
if (!showEnd) $('endInfoPanel').hidden = true;
}

function refreshAfterAnswer() {
const n = answeredCount(st);
$('progressBar').style.width = n / runTotal(st) * 100 + '%';
$('progressWrap').setAttribute('aria-valuenow', n);
$('progressWrap').setAttribute('aria-valuemax', runTotal(st));
$('savedNote').textContent = `✓ ${n} answer${n > 1 ? 's' : ''} saved`;
$('nextBtn').disabled = false;
$('nextBtn').textContent = n >= runTotal(st) - 1 && findNext(0) === -1 ? 'Finish — see my profile 🎉' : 'Next →';
paintEndBtn();
}

function paintOptions() {
const q = currentQ();
const vis = visibleOpts(q, st);
[ ...$('qOptions').children ].forEach(b => {
const entry = vis.find(v => v.i === Number(b.dataset.oi));
if (!entry) return;
let picked = false, badge = '';
if (q.rank) {
const ix = pendingRank.indexOf(entry.i);
picked = ix >= 0;
badge = [ '1st', '2nd', '3rd' ][ix] || '';
} else if (q.multi) picked = pendingSel.has(entry.i); else picked = !!(st.answers[q.id] && st.answers[q.id].o === entry.i);
b.classList.toggle('picked', picked);
b.setAttribute('aria-pressed', picked ? 'true' : 'false');
let bd = b.querySelector('.rank-badge');
if (badge) {
if (!bd) {
bd = document.createElement('span');
bd.className = 'rank-badge';
b.appendChild(bd);
}
bd.textContent = badge;
} else if (bd) bd.remove();
});
}

function afterAnswer(q, prevJson) {
if (st.answers[q.id] && st.skipped) delete st.skipped[q.id];
const nowJson = JSON.stringify(st.answers[q.id] || null);
if (nowJson !== prevJson && QBANK.some(c => c.gate && c.gate.q === q.id)) {
QBANK.filter(c => c.gate && c.gate.q === q.id).forEach(c => {
delete st.answers[c.id];
});
}
saveState();
}

function selectOption(oi) {
const q = currentQ();
const prev = JSON.stringify(st.answers[q.id] || null);
if (st.answers[q.id] && st.answers[q.id].o === oi) delete st.answers[q.id]; else st.answers[q.id] = {
o: oi,
w: pendingW
};
afterAnswer(q, prev);
paintOptions();
refreshAfterAnswer();
if (!st.answers[q.id]) $('nextBtn').disabled = true;
}

function toggleOption(oi) {
const q = currentQ();
const prev = JSON.stringify(st.answers[q.id] || null);
if (pendingSel.has(oi)) pendingSel.delete(oi); else pendingSel.add(oi);
if (pendingSel.size) st.answers[q.id] = {
o: [ ...pendingSel ],
w: pendingW
}; else delete st.answers[q.id];
afterAnswer(q, prev);
paintOptions();
$('nextBtn').disabled = pendingSel.size === 0;
refreshAfterAnswer();
if (pendingSel.size === 0) $('nextBtn').disabled = true;
}

function toggleRank(oi) {
const q = currentQ();
const ix = pendingRank.indexOf(oi);
const maxR = Math.min(typeof q.rank === 'number' ? q.rank : 2, visibleOpts(q, st).length || 1);
if (ix >= 0) pendingRank.splice(ix, 1); else if (pendingRank.length < maxR) pendingRank.push(oi); else pendingRank[maxR - 1] = oi;
if (pendingRank.length) st.answers[q.id] = {
o: [ ...pendingRank ],
w: pendingW,
r: 1
}; else delete st.answers[q.id];
if (st.answers[q.id] && st.skipped) delete st.skipped[q.id];
saveState();
paintOptions();
$('nextBtn').disabled = pendingRank.length === 0;
refreshAfterAnswer();
if (pendingRank.length === 0) $('nextBtn').disabled = true;
}

$('weightSlider').addEventListener('input', e => {
pendingW = parseInt(e.target.value, 10) || 1;
updateSliderLabel();
const q = currentQ();
if (q && st.answers[q.id]) {
st.answers[q.id].w = pendingW;
saveState();
}
});

$('nextBtn').onclick = () => {
const cur = currentQ();
const ci = cur && st.seen ? st.seen.indexOf(cur.id) : -1;
if (st.navAt >= 0 && ci >= 0 && ci < st.seen.length - 1) {
for (let ni = ci + 1; ni < st.seen.length; ni++) {
const ti = st.order.indexOf(st.seen[ni]);
if (ti < 0) continue;
st.navAt = ni >= st.seen.length - 1 ? -1 : ni;
st.pos = ti;
saveState();
renderQuestion();
return;
}
}
st.navAt = -1;
fixOrder(st);
if (answeredCount(st) >= runTotal(st)) return finish();
let t = findNext(st.pos + 1);
if (t === -1) t = findNext(0);
if (t === -1) return finish();
st.pos = t;
saveState();
renderQuestion();
};

$('skipBtn').onclick = () => {
const q = currentQ();
if (!q || st.finished) return;
const prev = JSON.stringify(st.answers[q.id] || null);
delete st.answers[q.id];
st.skipped = st.skipped || {};
st.skipped[q.id] = true;
afterAnswer(q, prev);
fixOrder(st);
const repId = replacementFor(st, q);
st.navAt = -1;
if (repId) {
st.order.splice(st.pos + 1, 0, repId);
st.reserve = st.reserve.filter(id => id !== repId);
st.pos = st.order.indexOf(repId);
saveState();
renderQuestion();
return;
}
let t = findNext(st.pos);
if (t === -1) t = findNext(0);
if (t === -1) return finish();
st.pos = t;
saveState();
renderQuestion();
};

$('backBtn').onclick = () => {
const cur = currentQ();
st.seen = st.seen || [];
let ci = cur ? st.seen.indexOf(cur.id) : -1;
if (ci === -1) ci = st.seen.length;
if (ci <= 0) return;
let step = ci - 1;
while (step >= 0 && st.order.indexOf(st.seen[step]) < 0) step--;
if (step < 0) return;
st.navAt = step;
st.pos = st.order.indexOf(st.seen[step]);
saveState();
renderQuestion();
};

$('saveExitBtn').onclick = () => {
saveState();
renderHome();
show('view-home');
};

document.addEventListener('keydown', e => {
if ($('view-quiz').hidden) return;
if (/INPUT|TEXTAREA/.test(document.activeElement.tagName) && document.activeElement.id !== 'weightSlider') return;
const q = currentQ();
if (!q) return;
const vis = visibleOpts(q, st);
const num = parseInt(e.key, 10);
if (num >= 1 && num <= vis.length) (q.rank ? toggleRank : q.multi ? toggleOption : selectOption)(vis[num - 1].i); else if (e.key === 'ArrowRight' && !$('nextBtn').disabled && document.activeElement.id !== 'weightSlider') $('nextBtn').click(); else if (e.key === 'ArrowLeft' && document.activeElement.id !== 'weightSlider') $('backBtn').click();
});

const TAG_LABELS = {
biryani: '🍛 Biryani devotee',
deccan: '🌶️ Deccan at heart',
spice: '🔥 Chilli chaser',
mild: '😌 Easy-going palate',
sweet: '🍮 Certified sweet tooth',
street: '🧭 Street-food hunter',
noodle: '🍜 Noodle loyalist',
rice: '🍚 Rice is life',
meat: '🍗 Full non-veg energy',
veg: '🥦 Veggie-friendly',
cafe: '🥐 Café-hopper',
home: '🏠 Ghar ka khana fan',
adventure: '🎲 Will try anything once',
classic: '💛 Comfort-food classic',
healthy: '🥗 Fresh & balanced',
chai: '🫖 Chai over everything',
coffee: '☕ Coffee-powered',
asia: '🥢 Asia-curious palate',
americas: '🌮 Americas explorer',
europe: '🥐 European soul',
smoky: '🔥 Smoke & char devotee',
tangy: '🍋 Tang-chaser',
creamy: '🥛 Creamy-comfort seeker',
fresh: '🌿 Fresh & bright',
soup: '🍲 Soup devotee'
};

function meterLabel(kind, pct) {
if (kind === 'spice') return pct >= 66 ? 'Chilli chaser' : pct >= 33 ? 'Warm & balanced' : 'Gentle palate';
if (kind === 'sweet') return pct >= 66 ? 'Serious sweet tooth' : pct >= 33 ? 'Sweet in moderation' : 'Savoury soul';
if (kind === 'smoky') return pct >= 66 ? 'Smoke chaser' : pct >= 33 ? 'Kissed by smoke' : 'Smoke-free zone';
if (kind === 'tangy') return pct >= 66 ? 'Tang hunter' : pct >= 33 ? 'Bright & balanced' : 'Low-acid soul';
if (kind === 'creamy') return pct >= 66 ? 'Rich & indulgent' : pct >= 33 ? 'Comfortably creamy' : 'Light & lean';
if (kind === 'fresh') return pct >= 66 ? 'Fresh-first palate' : pct >= 33 ? 'Fresh accents' : 'Cooked & cosy';
if (kind === 'classic') return pct >= 66 ? 'Tradition keeper' : pct >= 33 ? 'Classic-leaning' : 'Novelty seeker';
return pct >= 66 ? 'Fearless taster' : pct >= 33 ? 'Curious explorer' : 'Creature of habit';
}

let altRecsCache = [];

let whyDebugCache = {};

const AXES = [ {
id: 'salt',
emoji: '🧂',
name: 'Salt & Umami',
hi: 'Savoury seeker',
lo: 'Sodium minimalist'
}, {
id: 'aromatics',
emoji: '🧅',
name: 'Aromatics & Garlic',
hi: 'Garlic lover',
lo: 'Mild & subtle'
}, {
id: 'herbs',
emoji: '🌿',
name: 'Herbs & Botanicals',
hi: 'Herbivore kick',
lo: 'Simple seasoning'
}, {
id: 'earthy',
emoji: '🌾',
name: 'Earthiness',
hi: 'Deep & earthy',
lo: 'Clean & crisp'
}, {
id: 'warmspice',
emoji: '🫚',
name: 'Warm spices',
hi: 'Spice route enthusiast',
lo: 'Subtle warmth'
}, {
id: 'crunch',
emoji: '🥨',
name: 'Crunch & Crisp',
hi: 'Texture hunter',
lo: 'Soft & smooth'
}, {
id: 'oil',
emoji: '🫒',
name: 'Oil & Richness',
hi: 'Decadent & silky',
lo: 'Clean & dry'
}, {
id: 'funk',
emoji: '🧀',
name: 'Fermentation & Funk',
hi: 'Flavor adventurer',
lo: 'Fresh & direct'
}, {
id: 'vegprotein',
emoji: '🥦',
name: 'Veg-forward vs Protein',
hi: 'Plant-centric',
lo: 'Meat & hearty'
}, {
id: 'soup',
emoji: '🍲',
name: 'Soup & Broth',
hi: 'Sip & savour',
lo: 'Dry & crisp'
}, {
id: 'pairing',
emoji: '🍷',
name: 'Pairing & Alcohol',
hi: 'Wine & dine',
lo: 'Mocktail mindset'
}, {
id: 'portion',
emoji: '🍽️',
name: 'Portion & Style',
hi: 'Feast & share',
lo: 'Light bites'
} ];

const TAG_AXIS = {
spice: {
warmspice: .7,
salt: .15
},
mild: {
warmspice: -.7
},
tangy: {
funk: .3
},
fermented: {
funk: .8
},
creamy: {
oil: .9
},
smoky: {
earthy: .6,
warmspice: .15
},
fresh: {
earthy: -.5,
funk: -.5,
herbs: .3
},
crisp: {
crunch: 1
},
soup: {
soup: 1
},
meat: {
vegprotein: -.9,
salt: .2
},
veg: {
vegprotein: .8
},
healthy: {
vegprotein: .3,
oil: -.4,
portion: -.2
},
street: {
portion: .3
},
coffee: {
earthy: .3,
aromatics: .2
},
chai: {
warmspice: .5
},
adventure: {
funk: .2
},
home: {
portion: .2,
soup: .15
},
classic: {
portion: .15
}
};

const AXIS_KEYWORDS = [ [ 'garlic', 'aromatics', 1 ], [ 'onion', 'aromatics', .5 ], [ 'ginger', 'aromatics', .4 ], [ 'coriander|cilantro|mint|basil|dill|parsley|fenugreek|methi|curry leaves|herbs', 'herbs', .9 ], [ 'mushroom|truffle|beet|whole spices', 'earthy', .7 ], [ 'garam masala|masala|cinnamon|cardamom|clove|cumin|nutmeg|star anise', 'warmspice', .8 ], [ 'kimchi|pickl|ferment|aged|miso|soy sauce|fish sauce|blue cheese|parmesan', 'funk', .8 ], [ 'yogurt|curd|raita', 'funk', .4 ], [ 'crispy|crisp|crunch|crackling', 'crunch', .8 ], [ 'fried', 'crunch', .5 ], [ 'fried', 'oil', .3 ], [ 'ghee|buttery|butter|cream|fatty|tallow|schmaltz|dripping', 'oil', .7 ], [ 'soup|broth|shorba', 'soup', .7 ], [ 'stew', 'soup', .4 ], [ 'wine|beer|rum|bourbon', 'pairing', 1 ], [ 'salad', 'earthy', -.3 ], [ 'salad', 'vegprotein', .3 ], [ 'smoked|charred|tandoor|grilled', 'earthy', .3 ], [ 'umami|savoury|savory', 'salt', .6 ] ];

const AXIS_Q_BOOST = {
'pal-01': {
soup: 2.5
},
'pal-08': {
herbs: 2.5
},
'pal-15': {
funk: 2.5
},
'bri-10': {
funk: 2.5
},
'pal-17': {
oil: 2.5
},
'glo-21': {
oil: 2.5
},
'pal-02': {
oil: 2
},
'pal-07': {
salt: 2.5
},
'glo-11': {
salt: 2.5
},
'pal-05': {
crunch: 2
},
'glo-04': {
crunch: 1.5
},
'pal-19': {
warmspice: 2
},
'op-spice': {
warmspice: 1.5
},
'glo-meatrole': {
vegprotein: 2.5
},
'glo-alc': {
pairing: 3
},
'pal-27': {
pairing: 2
},
'pal-03': {
funk: 1.5
},
'pal-09': {
earthy: 1.5
},
'pal-13': {
funk: 1.5
},
'glo-24': {
portion: 1.5
},
'op-format': {
portion: 2
},
'hyd-08': {
soup: 2
},
'afr-peppersoup': {
soup: 2
},
'pal-16': {
vegprotein: 1.5
},
'hyd-aroma': {
aromatics: 2
},
'sou-aroma': {
aromatics: 2
},
'asi-aroma': {
aromatics: 2
},
'mid-aroma': {
aromatics: 2
},
'eur-aroma': {
aromatics: 2
},
'afr-aroma': {
aromatics: 2
},
'lat-aroma': {
aromatics: 2
},
'ame-aroma': {
aromatics: 2
}
};

const AXIS_NEG = /^(no|none|never|not|keep|skip|without)\b|off my plate|not for me|not my thing|ruins|deal-breaker|away from/i;

function axisSignalsFor(q, o) {
const sig = {};
const add = (a, v) => {
if (v) sig[a] = (sig[a] || 0) + v;
};
(o.tags || []).forEach(t => {
const m = TAG_AXIS[t];
if (m) Object.entries(m).forEach(([a, v]) => add(a, v));
});
if (o.axis) Object.entries(o.axis).forEach(([a, v]) => add(a, v));
const text = (o.t || '').toLowerCase();
const neg = AXIS_NEG.test(text);
AXIS_KEYWORDS.forEach(([src, a, v]) => {
if (new RegExp(src).test(text)) add(a, neg ? -v : v);
});
const boost = AXIS_Q_BOOST[q.id];
if (boost) Object.keys(sig).forEach(a => {
if (boost[a]) sig[a] *= boost[a];
});
return sig;
}

const REGION_AXIS = {
eastasia: {
salt: .5,
herbs: .3,
soup: .4,
funk: .3
},
southasia: {
warmspice: .6,
aromatics: .5,
oil: .3
},
hyderabad: {
warmspice: .6,
aromatics: .5,
oil: .3
},
middleeast: {
herbs: .4,
aromatics: .3,
earthy: .2
},
europe: {
oil: .3,
funk: .3
},
unitedstates: {
oil: .3,
crunch: .3,
portion: .4
},
africa: {
earthy: .4,
warmspice: .4,
soup: .2
},
latinamerica: {
herbs: .3,
crunch: .2,
aromatics: .3
},
oceania: {
oil: .4,
crunch: .3,
soup: .2
}
};

function dishAxesFor(r) {
const sig = {};
const add = (a, v) => {
if (v) sig[a] = (sig[a] || 0) + v;
};
(r.match || []).forEach(t => {
const m = TAG_AXIS[t];
if (m) Object.entries(m).forEach(([a, v]) => add(a, v));
});
const text = (r.dish + ' ' + (r.why || '')).toLowerCase();
AXIS_KEYWORDS.forEach(([src, a, v]) => {
if (new RegExp(src).test(text)) add(a, v * .8);
});
const rp = REGION_AXIS[r.region];
if (rp) Object.entries(rp).forEach(([a, v]) => add(a, v));
const out = {};
AXES.forEach(ax => {
out[ax.id] = Math.max(0, Math.min(1, (sig[ax.id] || 0) / 2));
});
return out;
}

function destRegionOf(city) {
if (!city) return null;
if (city === 'Hyderabad, India') return 'hyderabad';
return COUNTRY_REGION[city.slice(city.lastIndexOf(',') + 1).trim()] || null;
}

function destCountryOf(city) {
if (!city) return null;
return city.slice(city.lastIndexOf(',') + 1).trim() || null;
}

function computeResult(s) {
const tagCount = {};
const meters = {
spice: [ 0, 0 ],
sweet: [ 0, 0 ],
adv: [ 0, 0 ]
};
const tagMeters = {
smoky: 0,
tangy: 0,
creamy: 0,
fresh: 0,
classic: 0
};
let tagDenom = 0;
const detail = [];
let wSum = 0, wCount = 0, rawOk = false, alcOk = false, eggOk = false;
const axisPos = {}, axisNeg = {};
const pickRefs = [];
const whyRefUse = {};
s.order.forEach(qid => {
const a = s.answers[qid];
if (!a) return;
const q = QBANK_BY_ID[qid];
if (!q) return;
const picks = (Array.isArray(a.o) ? a.o : [ a.o ]).map(i => q.options[i]).filter(Boolean);
const w = a.w || 1;
wSum += w;
wCount++;
picks.forEach((opt, pi) => {
const mult = q.hate ? -1 : a.r ? 1 / (pi + 1) : 1;
if (!q.hate && mult > 0 && !/^Nothing|^None of these/i.test(opt.t || '') && ![ 'op-temp', 'op-meats', 'op-meats-halal', 'op-protein-veg', 'op-protein-vegan' ].includes(qid) && !/it (truly )?depends|no preference|not (sure|picky)|don'?t mind|anything (goes|works)/i.test(opt.t || '')) {
let pAxes = axisSignalsFor(q, opt), pTags = (opt.tags || []).filter(t => t !== 'rawok' && t !== 'alcok' && t !== 'eggok');
if (qid === 'op-spice') {
pAxes = {
warmspice: pAxes.warmspice || 0
};
pTags = pTags.filter(t => t === 'spice');
}
if (qid === 'op-sweet') {
pAxes = {};
pTags = pTags.filter(t => t === 'sweet');
}
pickRefs.push({
text: opt.t,
qid: qid,
w: w,
mult: mult,
rank1: !!a.r && pi === 0,
axes: pAxes,
tags: pTags
});
}
if ((opt.tags || []).includes('rawok')) rawOk = true;
if ((opt.tags || []).includes('alcok')) alcOk = true;
if ((opt.tags || []).includes('eggok')) eggOk = true;
(opt.tags || []).forEach(t => {
if (t !== 'rawok' && t !== 'alcok' && t !== 'eggok') tagCount[t] = (tagCount[t] || 0) + w * mult;
});
Object.entries(axisSignalsFor(q, opt)).forEach(([a, v]) => {
const c = v * w * mult;
if (c > 0) axisPos[a] = (axisPos[a] || 0) + c; else axisNeg[a] = (axisNeg[a] || 0) - c;
});
if (!q.hate) {
[ [ 'spice', 'spice' ], [ 'sweet', 'sweet' ], [ 'adv', 'adv' ] ].forEach(([f, k]) => {
if (typeof opt[f] === 'number') {
meters[k][0] += opt[f] * w * Math.abs(mult);
meters[k][1] += w * Math.abs(mult);
}
});
const aw = w * Math.abs(mult);
tagDenom += aw;
(opt.tags || []).forEach(t => {
if (t in tagMeters) tagMeters[t] += aw;
});
}
});
detail.push({
qid: qid,
q: q.q,
deck: q.deck,
picks: picks.map(p => p.t),
weight: w
});
});
const SKIP_W = .35, SKIP_CAP = 1.4;
const skipTags = {};
Object.keys(s.skipped || {}).forEach(qid => {
const q = QBANK_BY_ID[qid];
if (!q) return;
const tags = new Set;
q.options.forEach(o => (o.tags || []).forEach(t => {
if (t !== 'rawok' && t !== 'alcok' && t !== 'eggok') tags.add(t);
}));
tags.forEach(t => {
skipTags[t] = Math.min(SKIP_CAP, (skipTags[t] || 0) + SKIP_W);
});
});
Object.entries(skipTags).forEach(([t, v]) => {
tagCount[t] = (tagCount[t] || 0) - v;
});
const skipAxis = {};
Object.keys(s.skipped || {}).forEach(qid => {
const q = QBANK_BY_ID[qid];
if (!q) return;
const best = {};
q.options.forEach(o => Object.entries(axisSignalsFor(q, o)).forEach(([a, v]) => {
if (v > 0) best[a] = Math.max(best[a] || 0, v);
}));
Object.entries(best).forEach(([a, v]) => {
skipAxis[a] = Math.min(SKIP_CAP, (skipAxis[a] || 0) + SKIP_W * v);
});
});
Object.entries(skipAxis).forEach(([a, v]) => {
axisNeg[a] = (axisNeg[a] || 0) + v;
});
const lovedNamesNorm = [];
(Array.isArray(s.loves) ? s.loves : []).forEach((id, li) => {
const d = (s.lovesData || {})[id];
if (!d || !d.n) return;
lovedNamesNorm.push(d.n.toLowerCase().replace(/[^a-z0-9]/g, ''));
const lw = li < 5 ? 1 : .5;
(d.f || []).forEach(t => {
tagCount[t] = (tagCount[t] || 0) + lw;
});
const sigText = d.i && d.i.length ? d.i.join(' ') : d.n || '';
const sig = axisSignalsFor({
id: 'loves'
}, {
t: sigText,
tags: d.f || []
});
Object.entries(sig).forEach(([a, v]) => {
const c = v * 1.5 * lw;
if (c > 0) axisPos[a] = (axisPos[a] || 0) + c; else axisNeg[a] = (axisNeg[a] || 0) - c;
});
const LOVE_COURSE = {
Dessert: 'dessert',
Drink: 'drink',
Appetizer: 'appetizer',
Starter: 'appetizer',
Snack: 'appetizer',
Salad: 'appetizer',
Side: 'appetizer',
Main: 'main',
Breakfast: 'main',
Soup: 'main'
};
const dom = Object.entries(sig).filter(([, v]) => v > 0).sort((a, b) => b[1] - a[1]).slice(0, 2).map(([k]) => k);
pickRefs.push({
text: d.n,
qid: 'loves',
w: 3,
mult: 1,
rank1: false,
love: true,
axes: sig,
tags: (d.f || []).slice(),
course: LOVE_COURSE[d.c] || null,
dom: dom
});
});
let verdictLoveIdx = 0;
Object.entries(s.feedback || {}).forEach(([dish, v]) => {
if (v !== 'love') return;
const r = RECS.find(x => x.dish === dish);
if (!r) return;
const norm = dish.toLowerCase().replace(/[^a-z0-9]/g, '');
if (lovedNamesNorm.includes(norm)) return;
const lw = verdictLoveIdx < 5 ? 1 : .5;
verdictLoveIdx++;
const vtags = (r.match || []).filter(t => t !== 'rawok' && t !== 'alcok' && t !== 'eggok');
vtags.forEach(t => {
tagCount[t] = (tagCount[t] || 0) + lw;
});
const vsig = dishAxesFor(r);
Object.entries(vsig).forEach(([a, val]) => {
if (val > 0) axisPos[a] = (axisPos[a] || 0) + val * 1.5 * lw;
});
const vdom = Object.entries(vsig).filter(([, val]) => val > 0).sort((a, b) => b[1] - a[1]).slice(0, 2).map(([k]) => k);
const vcourse = [ 'drink', 'appetizer', 'main', 'dessert' ].includes(r.course) ? r.course : null;
pickRefs.push({
text: dish,
qid: 'verdict-love',
w: 3,
mult: 1,
rank1: false,
love: true,
axes: vsig,
tags: vtags.slice(),
course: vcourse,
dom: vdom
});
});
const axes = AXES.map(ax => {
const p = axisPos[ax.id] || 0, n = axisNeg[ax.id] || 0, tot = p + n;
const share = tot ? p / tot : .5;
return {
id: ax.id,
emoji: ax.emoji,
name: ax.name,
hi: ax.hi,
lo: ax.lo,
pct: Math.round(100 * share),
strength: Math.round(tot * 10) / 10,
lean: tot < .5 ? 'balanced' : share >= .58 ? 'hi' : share <= .42 ? 'lo' : 'balanced'
};
}).sort((a, b) => b.strength - a.strength);
const leanOf = {};
axes.forEach(a => {
leanOf[a.id] = a.strength >= 1 ? (a.pct - 50) / 50 : 0;
});
const posTags = Object.entries(tagCount).filter(([, c]) => c > 0).sort((a, b) => b[1] - a[1]);
const topTags = posTags.slice(0, 5).map(([t]) => t);
const affinities = {};
posTags.slice(0, 8).forEach(([t, c]) => {
affinities[t] = Math.round(c * 10) / 10;
});
const rawAversions = [];
s.order.forEach(qid => {
const q = QBANK_BY_ID[qid];
const a = s.answers[qid];
if (!q || !a || !q.hate) return;
(Array.isArray(a.o) ? a.o : [ a.o ]).forEach(i => {
const t = (q.options[i] || {}).t;
if (t && !/^Nothing|^None of these/i.test(t) && !rawAversions.includes(t)) rawAversions.push(t);
});
});
const aversions = rawAversions.filter(av => aversionHit(av, [ av ]));
const meterPct = {};
Object.entries(meters).forEach(([k, [sum, wt]]) => {
meterPct[k] = wt ? Math.round(100 * sum / (3 * wt)) : 0;
});
Object.entries(tagMeters).forEach(([k, sum]) => {
meterPct[k] = tagDenom ? Math.round(100 * sum / tagDenom) : 0;
});
const meats = chosenMeats(s);
const ownRoots = [ s.builtFor.roots, s.builtFor.roots2 ].filter(Boolean);
const TAG_FREQ = {};
QBANK.forEach(q => q.options.forEach(o => (o.tags || []).forEach(t => {
TAG_FREQ[t] = (TAG_FREQ[t] || 0) + 1;
})));
const TAG_TOTAL = Object.values(TAG_FREQ).reduce((a, b) => a + b, 0) || 1;
const rarity = t => Math.log2(1 + TAG_TOTAL / (TAG_FREQ[t] || TAG_TOTAL));
const summaryTags = posTags.slice(0, 8).map(([t, c]) => [ t, c * rarity(t) ]).sort((a, b) => b[1] - a[1]).slice(0, 2).map(([t]) => t);
const maxPos = Math.max(1, ...Object.values(tagCount));
const dishScore = r => r.match.reduce((acc, t) => acc + (tagCount[t] || 0) / maxPos * rarity(t), 0) / Math.sqrt(r.match.length);
const dishAxesCache = {};
RECS.forEach(r => {
dishAxesCache[r.dish] = dishAxesFor(r);
});
const axisAlign = r => {
const da = dishAxesCache[r.dish];
let s2 = 0;
AXES.forEach(ax => {
s2 += (leanOf[ax.id] || 0) * (da[ax.id] || 0);
});
return s2;
};
const exploreBonus = r => {
const da = dishAxesCache[r.dish];
let b = 0;
AXES.forEach(ax => {
if (Math.abs(leanOf[ax.id] || 0) < .25 && (da[ax.id] || 0) > .6) b += .06;
});
return Math.min(.25, b);
};
const axisMatchLabels = r => {
const da = dishAxesCache[r.dish];
return AXES.map(ax => {
const lean = leanOf[ax.id] || 0, dv = da[ax.id] || 0;
if (lean > .2 && dv > .45) return {
label: ax.hi,
wgt: lean * dv
};
if (lean < -.2 && dv < .25) return {
label: ax.lo,
wgt: -lean * (1 - dv)
};
return null;
}).filter(Boolean).sort((a, b) => b.wgt - a.wgt).slice(0, 2).map(x => x.label);
};
const dishScoreV2 = r => dishScore(r) + .55 * axisAlign(r) + exploreBonus(r);
const vetoedByAversion = dish => aversionHit(dish, aversions);
const eggStance = chosenEgg(s);
if (eggStance !== null) eggOk = eggStance;
const ft = s.fineTune || {};
const ftScope = ft.scope || '';
const ftKind = ft.kind || '';
const ftDestC = destCountryOf(s.builtFor.city);
const isSeafoodDish = r => r.diet === 'meat:fish' || r.diet === 'meat:seafood';
const kindOk = r => !ftKind || (ftKind === 'veg' ? r.diet === 'vegan' || r.diet === 'veg' : ftKind === 'seafood' ? isSeafoodDish(r) : String(r.diet).startsWith('meat') && !isSeafoodDish(r));
const heftOf = r => {
let h = 0;
const m = r.match || [];
if (m.includes('comfort')) h += .45;
if (m.includes('creamy')) h += .4;
if (m.includes('meat')) h += .25;
if (m.includes('home')) h += .2;
if (m.includes('rice')) h += .15;
if (m.includes('fresh')) h -= .45;
if (m.includes('healthy')) h -= .4;
const tx = (r.dish + ' ' + (r.why || '')).toLowerCase();
if (/\bfried\b/.test(tx)) h += .25;
if (/\bcheese\b/.test(tx)) h += .2;
if (/\bstew\b/.test(tx)) h += .2;
if (/\bbutter\b/.test(tx)) h += .15;
if (/\bsalad\b/.test(tx)) h -= .35;
if (/\bsoup\b/.test(tx)) h -= .1;
return Math.max(-1, Math.min(1, h));
};
const spiceOf = r => {
let v = (r.match || []).includes('spice') ? .65 : 0;
const tx = (r.dish + ' ' + (r.why || '')).toLowerCase();
if (/\b(chilli|chillies|chili|pepper|spicy|fiery|masala)\b/.test(tx)) v += .35;
if (/\bhot\b/.test(tx)) v += .15;
return Math.min(1, v);
};
const optMeats = ftKind ? [ 'chicken', 'beef', 'lamb', 'pork', 'fish', 'seafood', 'duck', 'quail' ] : meats;
const baseOk = r => optVisible(r, s.builtFor.diet, optMeats) && (!r.raw || rawOk) && (!r.alc || alcOk) && (!r.egg || s.builtFor.diet !== 'vegetarian' || eggOk) && (!r.dairy || chosenDairy(s) !== false) && !vetoedByAversion(r.dish + ' ' + (r.why || '')) && !((ft.notTonight || []).length && aversionHit(r.dish + ' ' + (r.why || ''), ft.notTonight)) && (s.feedback || {})[r.dish] !== 'no' && (s.feedback || {})[r.dish] !== 'love';
let ftPool = RECS.filter(baseOk);
const modeOk = r => s.builtFor.mode === 'travel' || !ownRoots.includes(r.region);
const scopeOk = r => ftScope === 'roots' ? ownRoots.includes(r.region) : ftScope === 'local' ? !!ftDestC && r.country === ftDestC : ftScope === 'surprise' ? !ownRoots.includes(r.region) && r.country !== ftDestC : modeOk(r);
let ftScopeWidened = false;
const scopedPool = ftPool.filter(scopeOk);
if (ftScope && !scopedPool.length) {
ftPool = ftPool.filter(modeOk);
ftScopeWidened = true;
} else ftPool = scopedPool;
let ftKindWidened = false;
if (ftKind) {
const kindPool = ftPool.filter(kindOk);
if (kindPool.length) ftPool = kindPool; else ftKindWidened = true;
}
if (ft.heft) {
const heftOk = r => {
const h = heftOf(r);
return ft.heft === 1 ? h <= .1 : ft.heft === 3 ? h >= -.05 : h >= -.45 && h <= .55;
};
const heftPool = ftPool.filter(heftOk);
if (heftPool.length) ftPool = heftPool;
}
if (ft.spice) {
const spiceOk = r => {
const v = spiceOf(r);
return ft.spice === 1 ? v <= .2 : ft.spice === 2 ? v <= .65 : ft.spice === 4 ? v >= .65 : v >= .8;
};
const spicePool = ftPool.filter(spiceOk);
if (spicePool.length) ftPool = spicePool;
}
const scored = ftPool.map(r => ({
r: r,
score: dishScoreV2(r),
ax: axisAlign(r),
home: r.match.reduce((a, t) => a + Math.max(0, (tagCount[t] || 0) / maxPos), 0) / Math.max(1, r.match.length),
matched: r.match.filter(t => (tagCount[t] || 0) > 0).length,
mtags: r.match.filter(t => (tagCount[t] || 0) > 0).sort((a, b) => tagCount[b] / maxPos * rarity(b) - tagCount[a] / maxPos * rarity(a))
})).sort((a, b) => b.score - a.score || b.matched - a.matched);
const entryByDish = {};
scored.forEach(e => {
entryByDish[e.r.dish] = e;
});
const AXIS_SIM_HI = {
salt: 'Savoury and umami-rich',
aromatics: 'Big on garlic and aromatics',
herbs: 'Herb-loaded',
earthy: 'Deep and earthy',
warmspice: 'Warm-spiced and fragrant',
crunch: 'Properly crunchy',
oil: 'Rich and silky',
funk: 'Pleasantly funky',
vegprotein: 'Plant-forward',
soup: 'Brothy and sippable',
pairing: 'Made to pair with a drink',
portion: 'Feast-sized'
};
const AXIS_SIM_LO = {
salt: 'Lightly salted and clean',
aromatics: 'Gentle on the aromatics',
herbs: 'Simply seasoned',
oil: 'Clean, never heavy',
funk: 'Unfermented and straightforward',
vegprotein: 'Meat-led',
soup: 'Dry, not brothy'
};
const TAG_SIM = {
spice: 'Properly hot',
smoky: 'Smoky',
creamy: 'Creamy and rich',
tangy: 'Bright and tangy',
fresh: 'Fresh and bright',
sweet: 'Sweet-leaning',
rice: 'Rice at its heart',
meat: 'Deeply meaty',
veg: 'Vegetable-led',
home: 'Home-style',
classic: 'Classic at heart',
street: 'Street-stall style',
adventure: 'A step beyond the usual',
healthy: 'Light but satisfying',
noodle: 'Noodle-led',
soup: 'Brothy',
biryani: 'Layered and fragrant',
comfort: 'Pure comfort food',
crisp: 'Crisp-edged',
fermented: 'Fermented and tangy',
cafe: 'Café-style',
chai: 'Chai-time warm',
coffee: 'Coffee-deep',
deccan: 'Deccani at heart',
seafood: 'Seafood-led',
egg: 'Egg-rich'
};
const TAG_TO_AXIS = {
spice: 'warmspice',
smoky: 'earthy',
creamy: 'oil',
soup: 'soup',
crisp: 'crunch',
fermented: 'funk',
tangy: 'funk'
};
const whyYouFor = r => {
const da = dishAxesCache[r.dish];
const axisCands = (a, dir, minPick) => pickRefs.map(p => ({
p: p,
v: (p.axes[a] || 0) * dir
})).filter(x => x.v >= minPick).sort((x, y) => y.v * y.p.mult * Math.min(y.p.w, 3) - x.v * x.p.mult * Math.min(x.p.w, 3));
const buildReasons = (minDvHi, minPick) => {
const reasons = [];
const usedAxes = new Set;
AXES.forEach(ax => {
const lean = leanOf[ax.id] || 0, dv = da[ax.id] || 0;
if (ax.id === 'vegprotein') {
if (lean > .15 && !(r.diet === 'vegan' || r.diet === 'veg' || (r.match || []).includes('veg'))) return;
if (lean < -.15 && !(String(r.diet).startsWith('meat') || (r.match || []).includes('meat'))) return;
}
if (lean > .15 && dv >= minDvHi) {
const cands = axisCands(ax.id, 1, minPick);
if (cands.length) {
reasons.push({
score: lean * dv * Math.min(1.5, cands[0].v),
key: 'ax:' + ax.id,
cands: cands,
short: AXIS_SIM_HI[ax.id],
dishVal: dv,
pickVal: cands[0].v
});
usedAxes.add(ax.id);
}
} else if (lean < -.15 && dv <= .22 && AXIS_SIM_LO[ax.id]) {
const cands = axisCands(ax.id, -1, minPick);
if (cands.length) {
reasons.push({
score: -lean * (1 - dv) * Math.min(1.5, cands[0].v),
key: 'ax:' + ax.id,
cands: cands,
short: AXIS_SIM_LO[ax.id],
dishVal: dv,
pickVal: cands[0].v
});
usedAxes.add(ax.id);
}
}
});
const e = entryByDish[r.dish];
if (e) e.mtags.forEach(t => {
const short = TAG_SIM[t];
if (!short) return;
const dom = TAG_TO_AXIS[t];
if (dom && usedAxes.has(dom)) return;
const cands = pickRefs.filter(p => p.tags.includes(t)).map(p => ({
p: p,
v: p.mult * Math.min(p.w, 3)
})).sort((a, b) => b.v - a.v);
if (cands.length) reasons.push({
score: .3 + (tagCount[t] || 0) / maxPos * rarity(t) * .3,
key: 'tag:' + t,
cands: cands,
short: short,
dishVal: (tagCount[t] || 0) / maxPos,
pickVal: cands[0].v
});
});
return reasons.sort((a, b) => b.score - a.score);
};
let reasons = buildReasons(.5, .5);
const chosen = [], usedRefs = new Set;
const courseCompat = (lc, dc) => !lc || !dc || lc === dc || (lc === 'dessert' || lc === 'drink') && (dc === 'dessert' || dc === 'drink');
const refStrict = (rsn, p, loveUsed) => {
if (!p.love) return true;
if (loveUsed >= 1) return false;
if (!courseCompat(p.course, r.course)) return false;
if (rsn.key.startsWith('ax:') && !(p.dom || []).includes(rsn.key.slice(3))) return false;
if (rsn.key === 'tag:crisp' && !(p.dom || []).includes('crunch')) return false;
return true;
};
const takeFrom = list => {
for (const rsn of list) {
if (chosen.length >= 3) break;
if (chosen.some(c => c.key === rsn.key)) continue;
const loveUsed = chosen.filter(c => c.ref.love).length;
const ok = (x, stage) => {
const p = x.p;
if (usedRefs.has(p.text)) return false;
if (stage === 0) return refStrict(rsn, p, loveUsed) && (whyRefUse[p.text] || 0) < 2;
if (stage === 1) return refStrict(rsn, p, loveUsed);
if (chosen.length >= 2) return false;
return !p.love || loveUsed < 1;
};
const c = rsn.cands.find(x => ok(x, 0)) || rsn.cands.find(x => ok(x, 1)) || rsn.cands.find(x => ok(x, 2)) || (chosen.length < 2 && rsn.cands[0] && (!rsn.cands[0].p.love || loveUsed < 1) ? rsn.cands[0] : null);
if (!c) continue;
usedRefs.add(c.p.text);
whyRefUse[c.p.text] = (whyRefUse[c.p.text] || 0) + 1;
chosen.push({
key: rsn.key,
short: rsn.short,
ref: c.p,
dishVal: rsn.dishVal,
pickVal: c.v
});
}
};
takeFrom(reasons);
if (chosen.length < 2) {
reasons = buildReasons(.4, .35);
takeFrom(reasons);
}
whyDebugCache[r.dish] = chosen.map(c => ({
key: c.key,
ref: c.ref.text,
refQid: c.ref.qid,
dishVal: Math.round(c.dishVal * 100) / 100,
pickVal: Math.round(c.pickVal * 100) / 100
}));
if (!chosen.length) return 'It lines up with the flavours you kept picking.';
const clause = (c, i) => {
const t = c.ref.text;
if (t.length <= 36 && !t.includes(' — ')) {
const art = /^(The|A|An)\s/.test(t) ? '' : 'the ';
return c.short + ', like ' + art + t + ' ' + (c.ref.rank1 ? 'you ranked #1' : c.ref.love ? 'you love' : (r.dish.length + i) % 2 ? 'you picked' : 'you chose');
}
const tt = t.length > 80 ? t.slice(0, 77) + '…' : t;
return c.short + (c.ref.love ? ' — one of your favourites: \'' : ' — just like your pick: \'') + tt + '\'';
};
const parts = chosen.map(clause);
const lc = s => s.charAt(0).toLowerCase() + s.slice(1);
let body = parts[0];
if (parts.length === 2) body = parts[0] + ' — and ' + lc(parts[1]);
if (parts.length >= 3) body = parts[0] + '; ' + lc(parts[1]) + ' — and ' + lc(parts[2]);
return body + '.';
};
const isLovedEcho = dish => {
const dn = dish.toLowerCase().replace(/[^a-z0-9]/g, '');
return lovedNamesNorm.some(ln => ln && (dn === ln || ln.length >= 5 && dn.includes(ln) || dn.length >= 5 && ln.includes(dn)));
};
const freshPool = scored.filter(e => !isLovedEcho(e.r.dish));
const pool = freshPool.length >= 20 ? freshPool : scored;
const COURSE_FRAME = [ [ 'drink', 2 ], [ 'appetizer', 6 ], [ 'main', 8 ], [ 'dessert', 4 ] ];
const isTravel = s.builtFor.mode === 'travel';
const destR = isTravel ? destRegionOf(s.builtFor.city) : null;
const destC = isTravel ? destCountryOf(s.builtFor.city) : null;
const destPlace = isTravel && s.builtFor.city ? s.builtFor.city.split(',')[0].trim().toLowerCase() : null;
const usedC = new Set;
const tagKeyOf = e => (e.r.match || []).slice().sort().join(',');
const levDist = (a, b) => {
a = a.toLowerCase();
b = b.toLowerCase();
if (Math.abs(a.length - b.length) > 2) return 99;
let prev = Array.from({
length: b.length + 1
}, (_, i) => i);
for (let i = 1; i <= a.length; i++) {
const cur = [ i ];
let best = cur[0];
for (let j = 1; j <= b.length; j++) {
cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
if (cur[j] < best) best = cur[j];
}
if (best > 2) return 99;
prev = cur;
}
return prev[b.length];
};
const composeCourses = (want, opts) => {
const out = [];
const placeOf = r => (r.from || '').split('·')[0].trim().toLowerCase();
const tierOf = e => {
if (destR === 'hyderabad' && e.r.region === 'hyderabad') return 0;
if (destC && e.r.country === destC && destPlace && placeOf(e.r) === destPlace) return 1;
if (destC && e.r.country === destC) return 2;
if (destR && e.r.region === destR) return 3;
return 4;
};
const orderedFor = course => {
const bucket = pool.filter(e => e.r.course === course && !usedC.has(e.r.dish));
return isTravel ? [ ...bucket ].sort((a, b) => tierOf(a) - tierOf(b)) : bucket;
};
const pickCourse = (bucket, quota) => {
const rest = [ ...bucket ];
const inCourse = [];
while (inCourse.length < quota && rest.length && out.length + inCourse.length < want) {
const head = rest[0];
const bandFloor = head.score - .05 * Math.max(1, Math.abs(head.score));
let band = rest.filter(e => e.score >= bandFloor && (!isTravel || tierOf(e) === tierOf(head)));
const keyCount = {};
inCourse.forEach(e => {
const k = tagKeyOf(e);
keyCount[k] = (keyCount[k] || 0) + 1;
});
const names = [ ...out.map(r => r.dish), ...inCourse.map(e => e.r.dish) ];
const underCap = e => (keyCount[tagKeyOf(e)] || 0) < 2;
const isDup = e => names.some(n => n.length >= 8 && e.r.dish.length >= 8 && levDist(n, e.r.dish) <= 2);
let cands = band.filter(e => underCap(e) && !isDup(e));
if (!cands.length) {
const tierRest = isTravel ? rest.filter(e => tierOf(e) === tierOf(head)) : rest;
cands = tierRest.filter(e => underCap(e) && !isDup(e));
if (!cands.length) cands = tierRest.filter(e => !isDup(e));
if (!cands.length) cands = rest.filter(e => !isDup(e));
if (!cands.length) cands = band;
}
if (opts && opts.contrastKeys) {
const fresh = cands.filter(e => !opts.contrastKeys.has(tagKeyOf(e)));
if (fresh.length) cands = fresh;
}
let pick = cands[0];
if (inCourse.length && cands.length > 1) {
let bestD = -1;
for (const e of cands) {
let dMin = 1;
for (const c of inCourse) {
const a = new Set(e.r.match || []), b = new Set(c.r.match || []);
const inter = [ ...a ].filter(t => b.has(t)).length, uni = new Set([ ...a, ...b ]).size || 1;
dMin = Math.min(dMin, 1 - inter / uni);
}
if (dMin > bestD) {
bestD = dMin;
pick = e;
}
}
}
inCourse.push(pick);
usedC.add(pick.r.dish);
rest.splice(rest.indexOf(pick), 1);
}
inCourse.forEach(e => out.push(e.r));
};
for (const [course, quota] of COURSE_FRAME) pickCourse(orderedFor(course), quota);
if (opts && opts.stretch && !isTravel) {
const quotas = {
drink: 1,
appetizer: 1,
main: 2,
dessert: 1
};
for (const [course, n] of Object.entries(quotas)) {
const elig = pool.filter(e => e.r.course === course);
if (!elig.length) continue;
const homes = elig.map(e => e.home).sort((a, b) => a - b);
const med = homes[Math.floor(homes.length / 2)];
let done = 0;
while (done < n) {
const worst = out.filter(r => r.course === course).map(r => entryByDish[r.dish]).sort((a, b) => b.home - a.home)[0];
if (!worst || worst.home <= med) break;
const cand = pool.filter(e => e.r.course === course && !usedC.has(e.r.dish) && e.home <= med && e.ax >= worst.ax - .1 * Math.abs(worst.ax) && e.score >= worst.score - .25 * Math.abs(worst.score)).sort((a, b) => b.ax - a.ax || b.score - a.score)[0];
if (!cand) break;
out[out.indexOf(worst.r)] = cand.r;
usedC.delete(worst.r.dish);
usedC.add(cand.r.dish);
done++;
}
}
}
for (const course of [ 'main', 'appetizer', 'dessert', 'drink' ]) {
if (out.length >= want) break;
pickCourse(orderedFor(course), want - out.length);
}
return out;
};
const recs = composeCourses(20, {
stretch: true
});
const primaryKeys = new Set(recs.map(r => (r.match || []).slice().sort().join(',')));
const more = composeCourses(20, {
contrastKeys: primaryKeys
});
const recObjs = recs.map(r => ({
dish: r.dish,
from: r.from,
course: r.course,
why: r.why,
yt: r.yt || '',
axes: axisMatchLabels(r),
whyYou: whyYouFor(r)
}));
altRecsCache = more.map(r => ({
dish: r.dish,
from: r.from,
course: r.course,
why: r.why,
yt: r.yt || '',
axes: axisMatchLabels(r),
whyYou: whyYouFor(r)
}));
return {
email: sessionUser ? sessionUser.email : '',
diet: s.builtFor.diet,
roots: s.builtFor.roots,
roots2: s.builtFor.roots2 || null,
city: s.builtFor.city || '',
mode: s.builtFor.mode || 'explore',
fineTune: s.fineTune || null,
ftKindWidened: ftKindWidened,
ftScopeWidened: ftScopeWidened,
topTags: topTags,
summaryTags: summaryTags,
affinities: affinities,
aversions: aversions,
meters: meterPct,
axes: axes.slice(0, 12),
avgConfidence: wCount ? +(wSum / wCount).toFixed(2) : 1,
detail: detail,
recs: recObjs,
completedAt: (new Date).toISOString()
};
}

function recCardsHtml(list, res) {
const fb = typeof st !== 'undefined' && st && st.feedback || {};
return list.map(r => {
const fv = fb[r.dish] || '';
return `<div class="rec"><div class="r-head"><span class="r-emoji">${(RECS.find(x => x.dish === r.dish) || {}).emoji || '🍽️'}</span><div class="r-title"><span class="r-from">${r.from.toUpperCase()}</span><strong>${r.dish}</strong></div></div><p class="r-sum">${r.why}</p>${r.whyYou ? `<p class="r-axes">${r.whyYou}</p>` : r.axes && r.axes.length ? `<p class="r-axes">Matches your: ${r.axes.join(' · ')}</p>` : ''}<div class="r-verdict" data-dish="${r.dish}"><button type="button" class="fb-btn${fv === 'try' ? ' on' : ''}" data-v="try">👍 Would try</button><button type="button" class="fb-btn${fv === 'no' ? ' on' : ''}" data-v="no">👎 Not for me</button><button type="button" class="fb-btn${fv === 'love' ? ' on' : ''}" data-v="love">❤️ Already love it</button></div>${r.yt || res.city ? `<div class="r-foot">${r.yt ? `<a class="r-find" rel="noopener" href="${r.yt}"><svg class="yt-logo" viewBox="0 0 28 20" aria-hidden="true"><path fill="#FF0000" d="M27.4 3.1c-.3-1.2-1.3-2.2-2.5-2.5C22.7 0 14 0 14 0S5.3 0 3.1.6C1.9.9.9 1.9.6 3.1.1 5.2 0 8.9 0 10s0 4.8.6 6.9c.3 1.2 1.3 2.2 2.5 2.5C5.3 20 14 20 14 20s8.7 0 10.9-.6c1.2-.3 2.2-1.3 2.5-2.5.5-2.1.6-6.9.6-6.9s0-4.8-.6-6.9z"/><path fill="#fff" d="M11.2 14.3V5.7l7.4 4.3z"/></svg>Watch it being made →</a>` : ''}${res.city ? `<a class="place-btn generic r-place" data-dish="${r.dish}" rel="noopener" href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(r.dish + ' near ' + res.city)}">📍 ${res.city.split(',')[0]}<small>Find this dish</small></a>` : ''}</div>` : ''}</div>`;
}).join('');
}

let lastResult = null, recsAltShown = false;

const COURSE_SECTIONS = [ [ 'drink', '🥤 Drinks' ], [ 'appetizer', '🥗 Appetizers' ], [ 'main', '🍽️ Main Dishes' ], [ 'dessert', '🍮 Desserts' ] ];

function recSectionsHtml(list, res) {
const known = new Set(COURSE_SECTIONS.map(([c]) => c));
let html = '';
for (const [course, label] of COURSE_SECTIONS) {
const items = list.filter(r => r.course === course);
if (items.length) html += `<h3 class="rec-title2 course-h" id="course-${course}">${label}</h3>` + recCardsHtml(items, res);
}
const rest = list.filter(r => !known.has(r.course));
if (rest.length) html += recCardsHtml(rest, res);
return html;
}

function paintCourseNav(list) {
const nav = $('courseNav');
if (!nav) return;
const present = COURSE_SECTIONS.filter(([c]) => (list || []).some(r => r.course === c));
nav.hidden = !present.length;
nav.innerHTML = present.map(([c, label]) => `<button type="button" data-course="${c}">${label}</button>`).join('');
nav.querySelectorAll('button').forEach(b => b.addEventListener('click', () => {
const target = document.getElementById('course-' + b.dataset.course);
if (target) target.scrollIntoView({
behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
block: 'start'
});
}));
}

function renderResults() {
const res = st.result || computeResult(st);
st.result = res;
if (!res.city && st.builtFor && st.builtFor.city) res.city = st.builtFor.city;
if (!res.mode && st.builtFor && st.builtFor.mode) res.mode = st.builtFor.mode;
if (st.finished && (!(st.altRecs && st.altRecs.length) || res.aiV === 1)) {
const fresh = computeResult(st);
if (!(st.altRecs && st.altRecs.length)) st.altRecs = altRecsCache;
if (res.aiV === 1) {
const tpl = {};
(fresh.recs || []).forEach(r => {
tpl[r.dish] = r.whyYou;
});
(res.recs || []).forEach(r => {
if (tpl[r.dish]) r.whyYou = tpl[r.dish];
});
delete res.aiV;
}
}
const strip = s2 => s2.replace(/^\S+\s/, '');
const labels = (res.summaryTags && res.summaryTags.length >= 2 ? res.summaryTags : res.topTags).map(t => TAG_LABELS[t]).filter(Boolean);
$('profileSummary').textContent = labels.length >= 2 ? `In one line: ${strip(labels[0])} meets ${strip(labels[1]).toLowerCase()}. Here's the full picture:` : 'Here\'s what your answers say about your palate:';
const loveNames = (Array.isArray(st.loves) ? st.loves : []).map(id => (st.lovesData || {})[id]).filter(d => d && d.n).map(d => d.n);
const ll = $('lovesLine');
if (ll) {
ll.hidden = !loveNames.length;
ll.textContent = loveNames.length ? `❤️ Shaped by the dishes you love: ${loveNames.slice(0, 6).join(' · ')}${loveNames.length > 6 ? ` · +${loveNames.length - 6} more` : ''}` : '';
}
lastResult = res;
recsAltShown = false;
$('profileAffinities').innerHTML = '';
$('profileAversions').innerHTML = (res.aversions || []).length ? `<h3 class="rec-title2">🚫 Your hard no's</h3><div class="traits">${res.aversions.map(a => `<span class="trait no">${a}</span>`).join('')}</div><p class="neg-note">We will never match you with these.</p>` : '';
const names = {
spice: '🌶️ Heat level',
sweet: '🍮 Sweet tooth',
adv: '🧭 Adventurousness',
smoky: '🔥 Smoke & char',
tangy: '🍋 Tang & sour',
creamy: '🥛 Rich & creamy',
fresh: '🌿 Fresh & bright',
classic: '💛 Comfort & classic'
};
const meterKind = {
spice: 'weighted average',
sweet: 'weighted average',
adv: 'weighted average',
smoky: 'share of picks',
tangy: 'share of picks',
creamy: 'share of picks',
fresh: 'share of picks',
classic: 'share of picks'
};
const meterRow = ([k, pct]) => `<div class="meter"><div class="mhead"><span>${names[k]} <small class="m-kind">${meterKind[k] || ''}</small></span><span>${meterLabel(k, pct)}</span></div>\n     <div class="track"><div class="fill" style="width:0%" data-w="${pct}"></div></div></div>`;
const rankedMeters = Object.entries(res.meters).sort((x, y) => y[1] - x[1]);
$('profileMeters').innerHTML = rankedMeters.slice(0, 3).map(meterRow).join('') + (rankedMeters.length > 3 ? `<div id="metersExtra" hidden>${rankedMeters.slice(3).map(meterRow).join('')}</div><button type="button" id="metersToggle" class="meters-toggle">Show all</button>` : '');
const mtBtn = $('metersToggle');
if (mtBtn) mtBtn.addEventListener('click', () => {
const ex = $('metersExtra');
const open = ex.hidden;
ex.hidden = !open;
mtBtn.textContent = open ? 'Show less' : 'Show all';
});
requestAnimationFrame(() => requestAnimationFrame(() => {
document.querySelectorAll('#profileMeters .fill').forEach(f => {
f.style.width = f.dataset.w + '%';
});
}));
const axEl = $('profileAxes');
const axDots = s2 => s2 >= 4 ? '●●●' : s2 >= 1.5 ? '●●○' : s2 > 0 ? '●○○' : '○○○';
if (axEl) axEl.innerHTML = res.axes && res.axes.length ? `<h3 class="rec-title2">🧭 Your flavour axes</h3><div class="axes-chips">` + res.axes.map(a => `<span class="axis-chip" title="Evidence behind this lean">${a.emoji} ${a.lean === 'hi' ? a.hi : a.lean === 'lo' ? a.lo : a.name + ' · Balanced'} <small class="ax-str">${axDots(a.strength || 0)}</small></span>`).join('') + '</div>' : '';
const leaguesOpened = (res.detail || []).some(d => [ 'glo-fish', 'glo-fish-gate', 'glo-beef', 'glo-alc', 'pal-13' ].includes(d.qid));
const confTail = res.avgConfidence >= 3.5 ? 'Strong opinions shaped this profile most.' : res.avgConfidence >= 2 ? 'A mix of firm and close-call picks shaped it.' : 'Most picks were close calls, so treat this as a gentle sketch of your palate.';
$('profileNote').textContent = (res.partial ? `⚠️ This profile is based on ${res.answered || res.detail.length} answers${res.skipped ? `, with ${res.skipped} question${res.skipped > 1 ? 's' : ''} skipped` : ' — you finished early'}, so treat it as a first sketch, not the full picture.${!leaguesOpened ? ' Finishing this early also means the raw-food and alcohol questions never came up, so those dishes stayed closed.' : ''} ` : '') + `Weighted by your confidence slider — your average pick strength was ${res.avgConfidence} / 5. ${confTail}`;
$('profileRecs').innerHTML = recSectionsHtml(res.recs, res);
paintCourseNav(res.recs);
const recTitleEl = $('recTitle');
if (recTitleEl) recTitleEl.textContent = res.mode === 'travel' && res.city ? `What to eat in ${res.city.split(',')[0]} 🌍` : 'Your personalized picks, Handpicked based on what you love 🌍';
upgradeAllPlaces(res);
enhanceReasonsAI(res);
const mrb = $('moreRecsBtn');
const diceLabel = () => lastResult && lastResult.mode === 'travel' && lastResult.city ? `🎲 Widen the ring — flavours beyond ${lastResult.city.split(',')[0]}` : '🎲 Show me different flavours';
if (mrb) {
mrb.hidden = !(st.altRecs || []).length;
mrb.textContent = diceLabel();
mrb.onclick = () => {
recsAltShown = !recsAltShown;
$('profileRecs').innerHTML = recSectionsHtml(recsAltShown ? st.altRecs : lastResult.recs || [], lastResult);
paintCourseNav(recsAltShown ? st.altRecs : lastResult.recs || []);
upgradeAllPlaces(lastResult);
mrb.textContent = recsAltShown ? '↩️ Back to my top matches' : diceLabel();
};
}
paintFbCount();
$('sheetNote').textContent = SHEETS_ENDPOINT ? '✓ Your results were saved for flavour analysis.' : '';
const forkP = $('forkProfileFact'), forkD = $('forkDishesFact');
if (forkP && res.axes && res.axes.length) {
const topAx = res.axes.find(a => a.lean && a.lean !== 'mid') || res.axes[0];
if (topAx) forkP.textContent = `Your strongest lean: ${topAx.lean === 'hi' ? topAx.hi : topAx.lean === 'lo' ? topAx.lo : topAx.name} — plus your meters & axes`;
}
if (forkD && res.recs && res.recs.length) {
const regions = new Set(res.recs.map(r => (RECS.find(x => x.dish === r.dish) || {}).region).filter(Boolean));
forkD.textContent = res.mode === 'travel' && res.city ? `${res.recs.length} dishes, led by ${res.city.split(',')[0]} — and where to try them` : `${res.recs.length} dishes from ${regions.size} corners of the world — and where to try them`;
}
const ftSum = $('ftSummary'), ftAdj = $('ftAdjustBtn');
if (ftSum && ftAdj) {
const parts = ftSummaryParts(res.fineTune || st && st.fineTune, res);
ftSum.hidden = !parts.length;
ftSum.textContent = parts.length ? '🎛️ Fine-tuned: ' + parts.join(' · ') : '';
ftAdj.textContent = parts.length ? '🎛️ Adjust fine-tuning' : '🎛️ Fine-tune these picks';
}
}

async function sendToSheets() {
if (!SHEETS_ENDPOINT || !st || st.sheetSent || !st.result) return;
try {
await fetch(SHEETS_ENDPOINT, {
method: 'POST',
mode: 'no-cors',
headers: {
'Content-Type': 'text/plain'
},
body: JSON.stringify(st.result)
});
st.sheetSent = true;
saveState();
} catch (e) {
console.warn('Sheets save failed:', e);
}
}

let feedbackOff = false;

function paintFbCount() {
const host = $('profileRecs');
if (!host || !host.parentNode) return;
let el = $('fbCount');
if (!el) {
el = document.createElement('p');
el.id = 'fbCount';
el.className = 'fb-count';
host.parentNode.insertBefore(el, host);
}
const n = Object.keys(st && st.feedback || {}).length;
el.textContent = n ? `You've rated ${n} dish${n > 1 ? 'es' : ''} — every verdict re-tunes this list on the spot.` : 'Tap 👍 Would try, 👎 Not for me or ❤️ Already love it on any dish — your list re-tunes itself as you rate.';
el.hidden = false;
}

function setVerdict(dish, v) {
if (!dish || !v || !st) return;
st.feedback = st.feedback || {};
if (st.feedback[dish] === v) delete st.feedback[dish]; else st.feedback[dish] = v;
const now = st.feedback[dish] || null;
if ((now === 'no' || now === 'love') && st.finished && lastResult) {
const prev = lastResult;
const prevLines = {};
[ ...prev.recs || [], ...st.altRecs || [] ].forEach(r => {
if (r.whyYou) prevLines[r.dish] = r.whyYou;
});
const fresh = computeResult(st);
(fresh.recs || []).forEach(r => {
if (prevLines[r.dish]) r.whyYou = prevLines[r.dish];
});
if (prev.partial) {
fresh.partial = prev.partial;
fresh.answered = prev.answered;
fresh.skipped = prev.skipped;
fresh.early = prev.early;
}
if (prev.aiV >= 2) fresh.aiV = prev.aiV;
if (prev.aiAlt) fresh.aiAlt = prev.aiAlt;
st.result = fresh;
lastResult = fresh;
st.altRecs = altRecsCache;
(st.altRecs || []).forEach(r => {
if (prevLines[r.dish]) r.whyYou = prevLines[r.dish];
});
} else if ((now === 'no' || now === 'love') && Array.isArray(st.altRecs)) {
st.altRecs = st.altRecs.filter(r => r.dish !== dish);
}
if (lastResult && $('profileRecs')) {
const list = recsAltShown ? st.altRecs || [] : lastResult.recs || [];
$('profileRecs').innerHTML = recSectionsHtml(list, lastResult);
paintCourseNav(list);
upgradeAllPlaces(lastResult);
paintFbCount();
const mrb = $('moreRecsBtn');
if (mrb) mrb.hidden = !(st.altRecs || []).length;
}
saveState();
syncFeedbackRow(dish, now);
}

async function syncFeedbackRow(dish, verdict) {
if (feedbackOff || !sb || !sessionUser) return;
try {
if (verdict) {
const {error: error} = await sb.from('feedback').upsert({
user_id: sessionUser.id,
dish_key: dish,
verdict: verdict,
updated_at: (new Date).toISOString()
}, {
onConflict: 'user_id,dish_key'
});
if (error) throw error;
} else {
const {error: error} = await sb.from('feedback').delete().eq('user_id', sessionUser.id).eq('dish_key', dish);
if (error) throw error;
}
} catch (e) {
feedbackOff = true;
}
}

document.addEventListener('click', e => {
const b = e.target && e.target.closest ? e.target.closest('.fb-btn') : null;
if (!b) return;
const wrap = b.closest('.r-verdict');
if (wrap) setVerdict(wrap.dataset.dish, b.dataset.v);
});

function aiReasonsPayload(res, altList) {
const picks = [];
const detail = [ ...res.detail || [] ].filter(d => !(QBANK_BY_ID[d.qid] || {}).hate).sort((a, b) => (b.weight || 0) - (a.weight || 0));
for (const d of detail) for (const p of d.picks || []) {
if (p && !picks.includes(p)) picks.push(p);
if (picks.length >= 14) break;
}
const loveNames = (Array.isArray(st.loves) ? st.loves : []).map(id => (st.lovesData || {})[id]).filter(d => d && d.n).map(d => d.n);
return {
profile: {
diet: res.diet || '',
roots: [ res.roots, res.roots2 ].filter(Boolean),
context: res.mode === 'travel' && res.city ? `Travelling to ${res.city}; these recommendations are for that trip.` : `Exploring new flavours from home in ${res.city || 'their city'}.`,
axes: (res.axes || []).slice(0, 6).map(a => `${a.name}: ${a.lean === 'hi' ? a.hi : a.lean === 'lo' ? a.lo : 'balanced'}`),
tags: (res.topTags || []).map(t => String(TAG_LABELS[t] || t).replace(/^\S+\s/, '')).slice(0, 8),
loves: loveNames.slice(0, 15),
picks: picks
},
dishes: [ ...res.recs || [], ...altList || [] ].map(r => ({
n: r.dish,
from: r.from,
course: r.course,
sum: r.why || '',
tpl: r.whyYou || ''
}))
};
}

const AI_STOP = new Set('a an the and or of to in on at by for with without your you yours their they them this that it its is are was were be been as from into over under more most less very really just not no all any some every each other another same only also than then when what which who how why pick picks picked chose chosen choice loves loved dish dishes food foods meal meals eat eats eating'.split(' '));

const AI_FLAVOUR = new Set('crisp crunchy crispy creamy smoky smoked spicy sweet savoury savory tangy fresh golden tender rich bold hot mild soft smooth fried grilled roasted baked steamed boiled warm cold sour bitter salty buttery cheesy juicy flaky fluffy hearty light bright classic street style proper properly slow fast quick easy simple'.split(' '));

function aiNorm(s) {
return String(s || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9 ]+/g, ' ').replace(/\s+/g, ' ').trim();
}

function aiTokens(s, min) {
return aiNorm(s).split(' ').filter(w => w.length >= min && !AI_STOP.has(w) && !AI_FLAVOUR.has(w));
}

function aiAnchorSet(res) {
const set = new Set, names = [];
const loves = (Array.isArray(st.loves) ? st.loves : []).map(id => (st.lovesData || {})[id]).filter(d => d && d.n).map(d => d.n);
for (const n of loves) {
const nn = aiNorm(n);
if (nn) names.push(nn);
for (const w of aiTokens(n, 4)) set.add(w);
}
const detail = [ ...res.detail || [] ].filter(d => !(QBANK_BY_ID[d.qid] || {}).hate).sort((a, b) => (b.weight || 0) - (a.weight || 0));
const picks = [];
for (const d of detail) for (const p of d.picks || []) {
if (p && !picks.includes(p)) picks.push(p);
}
for (const p of picks) for (const w of aiTokens(p, 5)) set.add(w);
return {
set: set,
names: names
};
}

function aiLineAnchored(line, anchors) {
if (!anchors || !anchors.set.size && !anchors.names.length) return true;
const nl = ' ' + aiNorm(line) + ' ';
for (const n of anchors.names) if (n && nl.includes(' ' + n + ' ')) return true;
for (const w of aiNorm(line).split(' ')) if (w.length >= 4 && anchors.set.has(w)) return true;
return false;
}

function applyAiReasons(lists, reasons, anchors) {
const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
let i = 0, applied = 0;
for (const list of lists) {
for (const r of list) {
const cand = reasons[i++];
if (typeof cand !== 'string') continue;
const t = cand.trim().replace(/\s+/g, ' ');
if (t.length < 12 || t.length > 340 || /https?:|www\.|```/.test(t)) continue;
if (!aiLineAnchored(t, anchors)) continue;
r.whyYou = esc(t);
applied++;
}
}
return applied;
}

let aiReasonsOff = false, aiReasonsBusy = false;

async function aiInvokeReasons(payload) {
const timeout = new Promise((_, rej) => setTimeout(() => rej(new Error('ai timeout')), 25e3));
const {data: data, error: error} = await Promise.race([ sb.functions.invoke('ai-reasons', {
body: payload
}), timeout ]);
if (error || !data || !Array.isArray(data.reasons)) throw new Error('ai reasons unavailable');
return data.reasons;
}

async function enhanceReasonsAI(res) {
if (aiReasonsOff || aiReasonsBusy) return;
if (!sb || !sb.functions || typeof sb.functions.invoke !== 'function') return;
if (!res || !Array.isArray(res.recs) || !res.recs.length) return;
if (!currentUser()) return;
const alt0 = Array.isArray(st.altRecs) ? st.altRecs : [];
const needPrimary = !(res.aiV >= 2);
const needAlt = alt0.length && !res.aiAlt;
if (!needPrimary && !needAlt) return;
aiReasonsBusy = true;
try {
const alt = alt0;
const anchors = aiAnchorSet(res);
const full = aiReasonsPayload(res, alt);
const batches = [];
if (needPrimary) batches.push({
list: res.recs,
dishes: full.dishes.slice(0, res.recs.length),
kind: 'primary'
});
if (needAlt) batches.push({
list: alt,
dishes: full.dishes.slice(res.recs.length),
kind: 'alt'
});
let anyApplied = 0;
for (const b of batches) {
if (!b.dishes.length) continue;
let reasons;
try {
reasons = await aiInvokeReasons({
profile: full.profile,
dishes: b.dishes
});
} catch (e) {
if (!anyApplied) aiReasonsOff = true;
break;
}
const applied = applyAiReasons([ b.list ], reasons, anchors);
if (applied) {
anyApplied += applied;
if (b.kind === 'primary') res.aiV = 2; else res.aiAlt = 1;
const shownList = recsAltShown ? st.altRecs || [] : res.recs;
$('profileRecs').innerHTML = recSectionsHtml(shownList, res);
paintCourseNav(shownList);
upgradeAllPlaces(res);
saveState();
upsertNow();
}
}
if (!anyApplied) aiReasonsOff = true;
} catch (e) {
aiReasonsOff = true;
}
aiReasonsBusy = false;
}

$('endBtn').onclick = () => {
if (st && !st.finished && answeredCount(st) >= 5) finish(true);
};

$('ftGoBtn').addEventListener('click', () => {
if (!st) return;
const d = ftDraft || {};
const spice = d.spice && d.spice !== 3 ? d.spice : 0;
st.fineTune = d.scope || d.kind || d.heft || spice || (d.notTonight || []).length ? {
scope: d.scope || '',
kind: d.kind || '',
heft: d.heft || 0,
spice: spice,
notTonight: [ ...d.notTonight || [] ]
} : null;
saveState();
finishNow(ftEditing ? !!(st.result || {}).early : ftEarly);
});

$('ftSkipBtn').addEventListener('click', () => {
if (!st) return;
st.fineTune = null;
saveState();
finishNow(ftEditing ? !!(st.result || {}).early : ftEarly);
});

$('ftAdjustBtn').addEventListener('click', () => {
if (!st || !$('view-finetune')) return;
ftEditing = true;
ftEarly = !!(st.result || {}).early;
openFineTune();
});

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