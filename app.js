// Diving into Buds — app logic. See repo history for the design notes.

const SUPABASE_URL = "https://lhygxgwyprkhhkuaozuk.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxoeWd4Z3d5cHJraGhrdWFvenVrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTExNjU3MjcsImV4cCI6MjEwNjc0MTcyN30.upttjjbTEyv4JZTR8NpM94TAsgtV7PznYEeR_ZeRvn8";
const SHEETS_ENDPOINT = "https://script.google.com/macros/s/AKfycbwX1iyUOYO8r1rTEKXjStql1hFOvCzw2O9UcvpoJ3-BO65QJcHgtRVFTxK4yluzgd-0/exec"; // Aizaz's Apps Script web app (Google Sheets)
const sb = (window.supabase && SUPABASE_URL && !SUPABASE_ANON_KEY.includes("PASTE_"))
  ? window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  : null;

const $ = (id) => document.getElementById(id);
const store = {
  get(k, d) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch { return d; } },
  set(k, v) { localStorage.setItem(k, JSON.stringify(v)); },
  del(k) { localStorage.removeItem(k); }
};
const DEFAULT_TOTAL = 20; // v23 (Aizaz): 50 -> 20 — the loves step now carries the profile's base load
const runTotal = () => DEFAULT_TOTAL;
const WEIGHT_WORDS = { 1: "Almost a tie", 2: "Leaning this way", 3: "Pretty sure", 4: "Strong pick", 5: "No contest" };
const DIET_LABELS = { everything: "Everything", vegetarian: "Vegetarian", vegan: "Vegan", halal: "Everything Halal" };
const ROOT_LABELS = { hyderabad: "Hyderabad, India", southasia: "South Asia", eastasia: "East/Southeast Asia", middleeast: "Middle-Eastern", unitedstates: "United States", europe: "Europe", africa: "Africa", latinamerica: "Latin America & The Caribbean" };
const LEGACY_ROOTS = { asia: "eastasia", americas: "unitedstates" };
function normRootsValue(v) { return LEGACY_ROOTS[v] || v; }
function rootsLabelOf(o) { return [o && o.roots, o && o.roots2].filter(Boolean).map(r => ROOT_LABELS[r] || r).join(" + "); }
const ROOT_EMOJI = { hyderabad: "🏰", southasia: "🍛", eastasia: "🥢", middleeast: "🧆", unitedstates: "🍔", europe: "🥐", africa: "🌍", latinamerica: "🌮" };

/* ————— State ————— */
let sessionUser = null; // { id, email }
let st = null;          // active user's progress state
const currentUser = () => (sessionUser ? sessionUser.email : null);
const stateKey = (email) => "dib_v4_" + email;

function blankState() {
  return { fundamentals: null, builtFor: null, order: [], reserve: [], answers: {}, skipped: {}, pos: 0, seen: [], navAt: -1, finished: false, result: null, sheetSent: false, loves: null, lovesData: {} };
}
function answeredCount(s) { return Object.keys(s.answers).filter(k => QBANK_BY_ID[k]).length; }

/* ————— Diet filtering ————— */
function chosenMeats(s) {
  const qid = s.answers["op-meats"] ? "op-meats" : (s.answers["op-meats-halal"] ? "op-meats-halal" : null);
  if (!qid) return null;
  const a = s.answers[qid];
  if (!a || !Array.isArray(a.o) || !a.o.length) return null;
  return a.o.map(i => QBANK_BY_ID[qid].options[i].diet.replace("meat:", ""));
}
function optVisible(opt, diet, meats) {
  const d = opt.diet;
  // Veg stand-ins for canonical meat dishes (veg biryani, veg haleem…) are
  // never offered to meat-eating users — they would never pick them.
  if (opt.alt && (diet === "everything" || diet === "halal")) return false;
  if (diet === "vegan") return d === "vegan";
  if (diet === "vegetarian") return d === "vegan" || d === "veg";
  if (d === "alcohol") return diet === "everything";
  if (d === "meat:pork") return diet === "everything" && (!meats || meats.includes("pork"));
  if (d === "meat:fish") return !meats || meats.includes("fish") || meats.includes("seafood");
  if (d === "meat:seafood") return !meats || meats.includes("seafood");
  if (d.startsWith("meat:")) return !meats || meats.includes(d.slice(5));
  return true; // 'vegan' / 'veg' classes are fine for everything & halal
}
function visibleOpts(q, s) {
  const diet = s.builtFor.diet;
  const meats = (q.id === "op-meats" || q.id === "op-meats-halal") ? null : chosenMeats(s);
  const out = [];
  q.options.forEach((o, i) => { if (optVisible(o, diet, meats)) out.push({ o, i }); });
  return out;
}
function gateOpen(q, s) {
  if (!q.gate) return true;
  if (s.skipped && s.skipped[q.gate.q]) return false; // a skipped parent opens nothing
  const pa = s.answers[q.gate.q];
  if (!pa) return true; // parent not answered yet — the gate is decided later
  const pq = QBANK_BY_ID[q.gate.q];
  if (!pq) return true;
  const pickedIdx = pa.r ? [pa.o[0]] : (Array.isArray(pa.o) ? pa.o : [pa.o]);
  const labels = pickedIdx.map(i => (pq.options[i] || {}).t || "");
  if (q.gate.has && !labels.some(t => t.includes(q.gate.has))) return false;
  if (q.gate.hasAny && !labels.some(t => q.gate.hasAny.some(h => t.includes(h)))) return false;
  if (q.gate.lacks && labels.some(t => t.includes(q.gate.lacks))) return false;
  return true;
}
function playable(q, s) {
  if (!s.builtFor || !q.diets.includes(s.builtFor.diet)) return false;
  if (s.skipped && s.skipped[q.id]) return false; // skipped questions never re-serve
  // An orphaned follow-up (its parent belongs to another roots' chain and is
  // not part of this run) can never be served.
  if (q.gate && s.order && !s.order.includes(q.gate.q) && !(s.reserve || []).includes(q.gate.q)) return false;
  if (!gateOpen(q, s)) return false;
  return visibleOpts(q, s).length >= 2;
}

/* ————— Question-list builder (deterministic: same picks ⇒ same list) ————— */
function buildOrder(s) {
  const F = s.builtFor, diet = F.diet;
  const valid = QBANK.filter(q => q.diets.includes(diet) && q.options.filter(o => optVisible(o, diet, null)).length >= 2);
  const byDeck = (d) => valid.filter(q => q.deck === d);
  const chainDeckOf = (r) => ({ hyderabad: "hydro", eastasia: "asiachain", unitedstates: "usachain", europe: "eurchain", southasia: "souchain", middleeast: "midchain", africa: "africhain", latinamerica: "latchain" }[r] || "hydro");
  const chainDeck = chainDeckOf(F.roots);
  const rootsList = [F.roots, F.roots2].filter(Boolean);
  // — Regional 12 (of the v23 run of 20): diet warm-up, the roots' own
  // dislike list, spice + dessert warm-ups, the eating-style chain, then
  // the roots deck. Closed branches swap out from the reserve.
  const dietOpener = byDeck("opener").filter(q => q.id.startsWith("op-meats") || q.id.startsWith("op-protein")).slice(0, 1);
  const heatSweet = ["op-spice", "op-temp", "op-sweet"].map(id => QBANK_BY_ID[id]).filter(q => q && valid.includes(q));
  const eggQ = diet === "vegetarian" ? ["op-eggs"].map(id => QBANK_BY_ID[id]).filter(q => q && valid.includes(q)) : [];
  let regional;
  if (rootsList.length === 2) {
    // Two roots: both dislike lists, then a blend of both eating-style chains
    // (anchors + kind questions interleaved). Closed branches swap out via the
    // reserve, which pulls in the open branches' extras and both roots decks —
    // the served 20 self-balances toward the picks the user actually makes.
    const nogos = rootsList.flatMap(r => byDeck(r).filter(q => q.hate).slice(0, 1));
    const core = (r) => { const cd = byDeck(chainDeckOf(r)); return [...cd.filter(q => !q.gate), ...cd.filter(q => q.gate && q.id.includes("-k-"))]; };
    const zip = (a, b) => { const out = []; for (let i = 0; i < Math.max(a.length, b.length); i++) { if (a[i]) out.push(a[i]); if (b[i]) out.push(b[i]); } return out; };
    const blend = zip(core(rootsList[0]), core(rootsList[1]));
    const restZip = zip(byDeck(rootsList[0]).filter(q => !q.hate), byDeck(rootsList[1]).filter(q => !q.hate));
    regional = [...dietOpener, ...nogos, ...heatSweet, ...eggQ, ...blend, ...restZip].slice(0, 12);
  } else {
    const rootsDeckAll = byDeck(F.roots);
    const rootsNogo = rootsDeckAll.filter(q => q.hate).slice(0, 1);
    const rootsRest = rootsDeckAll.filter(q => !q.hate);
    const chains = byDeck(chainDeck);
    regional = [...dietOpener, ...rootsNogo, ...heatSweet, ...eggQ, ...chains, ...rootsRest].slice(0, 12);
  }
  // — World 8 (v23): fixed slots first (salad pair, the fish gateway
  // FAMILY composed with both branch follow-ups, the alcohol question),
  // then a per-roots zipped rotation of the palate/bridge/global decks.
  const rot = Object.keys(ROOT_LABELS).indexOf(F.roots);
  const rotate = (arr, n) => arr.length ? [...arr.slice(n % arr.length), ...arr.slice(0, n % arr.length)] : arr;
  const salad = ["pal-25", "pal-26"].map(id => QBANK_BY_ID[id]).filter(q => q && valid.includes(q));
  const fishFam = ["glo-fish", ...QBANK.filter(c => c.gate && c.gate.q === "glo-fish").map(c => c.id)].map(id => QBANK_BY_ID[id]).filter(q => q && valid.includes(q));
  const alcQ = diet === "everything" ? ["glo-alc"].map(id => QBANK_BY_ID[id]).filter(q => q && valid.includes(q)) : [];
  const zip3 = (a, b, c) => { const out = []; for (let i = 0; i < Math.max(a.length, b.length, c.length); i++) { if (a[i]) out.push(a[i]); if (b[i]) out.push(b[i]); if (c[i]) out.push(c[i]); } return out; };
  const worldFill = zip3(
    rotate(byDeck("palate").filter(q => !salad.includes(q)), rot * 3),
    rotate(byDeck("bridge"), rot * 2),
    rotate(byDeck("global").filter(q => !fishFam.includes(q) && !alcQ.includes(q)), rot * 5)
  );
  const worldPick = [...salad, ...fishFam, ...alcQ, ...worldFill].slice(0, 8);
  const composed = [...regional, ...worldPick];
  const seen = new Set();
  const order = composed.filter(q => !seen.has(q.id) && seen.add(q.id));
  for (const q of valid) {
    if (order.length >= DEFAULT_TOTAL) break;
    if (!seen.has(q.id)) { order.push(q); seen.add(q.id); }
  }
// Gate-children of composed GLOBAL parents travel with their parents,
// inserted directly behind them inside the world segment's budget.
// Regional chain extras stay in the reserve (v12 segment-budget rule).
  const gStart = regional.length;
  const withKids = [...order.slice(0, gStart)];
  const inOrder = new Set(order.map(q => q.id));
  for (const q of order.slice(gStart)) {
    withKids.push(q);
    for (const kid of QBANK.filter(c => c.gate && c.gate.q === q.id)) {
      if (!inOrder.has(kid.id) && valid.includes(kid)) { withKids.push(kid); inOrder.add(kid.id); }
    }
  }
  s.order = withKids.slice(0, DEFAULT_TOTAL).map(q => q.id);
  const inFinal = new Set(s.order);
  // Reserve: the user's own roots + chain questions first, so swaps keep
  // the run's regional flavour.
  const ownDecks = new Set(rootsList.flatMap(r => [r, chainDeckOf(r)]));
  const ownFirst = valid.filter(q => ownDecks.has(q.deck) && !inFinal.has(q.id));
  const restReserve = valid.filter(q => !ownDecks.has(q.deck) && !inFinal.has(q.id));
  s.reserve = [...ownFirst, ...restReserve].map(q => q.id);
  s.pos = 0;
}
// After the meats answer changes, swap any now-unplayable upcoming questions
// for reserve questions so the run always stays at its chosen length.
const GLOBAL_DECKS = new Set(["palate", "bridge", "global"]);
function deckFamily(q) { return GLOBAL_DECKS.has(q.deck) ? "global" : "regional"; }
// When a question is skipped, pick its replacement from the reserve: same
// deck first (same fundamentals), then the same regional/global family,
// then anything playable. Guards keep the run's invariants: not already in
// the run, unanswered, not skipped, playable right now, and no sim-group
// clash with anything the run already serves.
function replacementFor(s, skippedQ) {
  const simsInRun = new Set(s.order.map(id => (QBANK_BY_ID[id] || {}).sim).filter(Boolean));
  const fam = deckFamily(skippedQ);
  const passes = [c => c.deck === skippedQ.deck, c => deckFamily(c) === fam, () => true];
  for (const pass of passes) {
    for (const cid of s.reserve) {
      if (s.order.includes(cid) || s.answers[cid] || (s.skipped && s.skipped[cid])) continue;
      const cq = QBANK_BY_ID[cid];
      if (!cq || (cq.sim && simsInRun.has(cq.sim)) || !pass(cq) || !playable(cq, s)) continue;
      return cid;
    }
  }
  return null;
}
function fixOrder(s) {
  if (!s.builtFor) return;
  const inOrder = new Set(s.order);
  const pool = [...s.reserve, ...QBANK.map(q => q.id).filter(id => !inOrder.has(id))];
  const used = new Set();
  for (let i = s.pos + 1; i < s.order.length; i++) {
    const q = QBANK_BY_ID[s.order[i]];
    // A skipped question is never swapped out (v19.1): it stays in the
    // order as reachable history; swapping it on restore reshuffled runs.
    if (!q || s.answers[q.id] || (s.skipped && s.skipped[q.id]) || playable(q, s)) continue;
    let rep = null;
    // Prefer a replacement from the same deck, so swaps keep the run's mix.
    for (const pass of [q.deck, null]) {
      for (const cid of pool) {
        if (used.has(cid) || s.order.includes(cid)) continue;
        const cq = QBANK_BY_ID[cid];
        if (cq && !s.answers[cid] && playable(cq, s) && (pass === null || cq.deck === pass)) { rep = cid; break; }
      }
      if (rep) break;
    }
    if (rep) { used.add(rep); s.order[i] = rep; }
  }
  // Pull open gated follow-ups up to sit directly behind their parent, so
  // a chain reads as a chain (parent → follow-up → follow-up) instead of
  // being separated by whatever filler swapped in for a closed-gate sibling.
  // The insertion point must stay ahead of the user's current position:
  // placing a follow-up at or behind s.pos strands it — forward navigation
  // only scans from s.pos + 1, so it would be skipped until wrap-around.
  const gateParents = [...new Set(QBANK.filter(c => c.gate).map(c => c.gate.q))];
  for (const pid of gateParents) {
    const pIdx = s.order.indexOf(pid);
    if (pIdx < 0 || !s.answers[pid]) continue;
    let insertAt = Math.max(pIdx + 1, s.pos + 1);
    for (const kid of QBANK.filter(c => c.gate && c.gate.q === pid)) {
      if (s.answers[kid.id]) continue;
      const kIdx = s.order.indexOf(kid.id);
      if (kIdx < 0 || !playable(kid, s)) continue;
      if (kIdx > insertAt) {
        // Never drag a follow-up across an answered or skipped question —
        // those slots are the user's served history (a skip replacement
        // answered in place sits exactly there). On restore, where pos is
        // reset, re-compacting the chain used to leapfrog follow-ups over
        // that history and scramble the numbering against what was seen.
        if (s.order.slice(insertAt, kIdx).some(id => s.answers[id] || (s.skipped && s.skipped[id]))) break;
        s.order.splice(kIdx, 1); s.order.splice(insertAt, 0, kid.id); insertAt++;
      }
      else if (kIdx === insertAt) insertAt++;
    }
  }
  s.reserve = pool.filter(id => !used.has(id) && !s.order.includes(id));
  // The spice → temperature pair is inseparable (Aizaz's standing rule):
  // swaps and gate promotions above must never wedge anything between them.
  if (!s.answers['op-spice'] && !s.answers['op-temp'] && !(s.skipped && (s.skipped['op-spice'] || s.skipped['op-temp']))) {
    const si = s.order.indexOf('op-spice'), ti = s.order.indexOf('op-temp');
    if (si >= 0 && ti >= 0 && ti !== si + 1) { s.order.splice(ti, 1); s.order.splice(si + 1, 0, 'op-temp'); }
  }
}

/* ————— Persistence (local cache + Supabase) ————— */
function saveState() {
  if (!sessionUser || !st) return;
  store.set(stateKey(sessionUser.email), st);
  scheduleSync();
}
let syncTimer = null;
function scheduleSync() { clearTimeout(syncTimer); syncTimer = setTimeout(upsertNow, 400); }
async function upsertNow() {
  if (!sb || !sessionUser || !st) return;
  // Mirror fundamentals + result inside the answers JSON too, so progress
  // restores on any device even before the extra columns exist.
  const answersPayload = { ...st.answers };
  if (st.builtFor) answersPayload.__fund = st.builtFor;
  if (st.result) answersPayload.__result = st.result;
  if (st.skipped && Object.keys(st.skipped).length) answersPayload.__skipped = st.skipped;
  if (st.seen && st.seen.length) answersPayload.__nav = { seen: st.seen };
  if (st.order && st.order.length) answersPayload.__order = { o: st.order, r: st.reserve || [] };
  if (Array.isArray(st.loves) && st.loves.length) { answersPayload.__loves = st.loves; answersPayload.__lovesData = st.lovesData || {}; }
  const base = {
    user_id: sessionUser.id, answers: answersPayload,
    current_q: st.pos, finished: st.finished, updated_at: new Date().toISOString()
  };
  const full = { ...base, fundamentals: st.builtFor, result: st.result };
  let { error } = await sb.from("progress").upsert(full);
  if (error) { // columns may not exist yet — fall back to the base payload
    ({ error } = await sb.from("progress").upsert(base));
    if (error) console.warn("Progress sync failed (will retry):", error.message);
  }
}
async function hydrate() {
  const email = sessionUser.email;
  const local = store.get(stateKey(email), blankState());
  const { data: rows, error } = await sb.from("progress")
    .select("answers, current_q, finished, fundamentals, result").eq("user_id", sessionUser.id).limit(1);
  if (error || !rows || !rows[0]) { st = local; return; }
  const row = rows[0];
  const rawAnswers = row.answers || {};
  const cloudAnswers = {};
  Object.keys(rawAnswers).forEach(k => { if (QBANK_BY_ID[k]) cloudAnswers[k] = rawAnswers[k]; });
  const fund = row.fundamentals || rawAnswers.__fund || null;
  if (fund) { fund.roots = normRootsValue(fund.roots); if (fund.roots2) fund.roots2 = normRootsValue(fund.roots2); }
  const result = row.result || rawAnswers.__result || null;
  if (fund && (Object.keys(cloudAnswers).length || row.finished || local.builtFor)) {
    st = blankState();
    st.fundamentals = fund; st.builtFor = fund;
    st.answers = Object.keys(cloudAnswers).length ? cloudAnswers : (local.builtFor && JSON.stringify(local.builtFor) === JSON.stringify(fund) ? local.answers : {});
    st.skipped = rawAnswers.__skipped || local.skipped || {};
    st.loves = Array.isArray(rawAnswers.__loves) ? rawAnswers.__loves : (local.loves !== undefined ? local.loves : []);
    st.lovesData = rawAnswers.__lovesData || local.lovesData || {};
    st.finished = !!row.finished; st.result = result; st.sheetSent = !!result;
    // Restore the run's actual order when one was saved (v19): rebuilding it
    // from scratch dropped skip-replacements out of the order, punching
    // holes in the navigation history that killed the Back button mid-walk.
    const savedOrder = (rawAnswers.__order || {}).o, savedReserve = (rawAnswers.__order || {}).r;
    const orderOk = Array.isArray(savedOrder) && savedOrder.length >= 40 &&
      savedOrder.filter(id => QBANK_BY_ID[id]).length >= savedOrder.length * 0.95;
    if (orderOk) { st.order = savedOrder.slice(); st.reserve = Array.isArray(savedReserve) ? savedReserve.filter(id => QBANK_BY_ID[id]) : []; }
    else buildOrder(st);
    fixOrder(st);
    st.seen = (((rawAnswers.__nav || {}).seen) || local.seen || []).filter(id => st.order.includes(id));
    st.navAt = -1;
    st.pos = Math.max(0, Math.min(row.current_q || 0, st.order.length - 1));
    store.set(stateKey(email), st);
  } else {
    st = local; // cloud holds nothing usable yet — keep this device's state
    if (st.builtFor) scheduleSync();
  }
  if (st.fundamentals) st.fundamentals.roots = normRootsValue(st.fundamentals.roots);
  if (st.builtFor) st.builtFor.roots = normRootsValue(st.builtFor.roots);
  if (st.result) st.result.roots = normRootsValue(st.result.roots);
  if (!st.skipped) st.skipped = {};
  if (st.loves === undefined) st.loves = []; // pre-v22 states: the loves step already passed — never gate a run mid-flight
  if (!st.lovesData) st.lovesData = {};
}

/* ————— Views ————— */
function show(view) {
  ["view-auth", "view-fund", "view-home", "view-loves", "view-quiz", "view-compiling", "view-results"].forEach(v => { $(v).hidden = v !== view; });
  const u = currentUser();
  $("userbox").hidden = !u;
  $("userEmail").textContent = u || "";
  window.scrollTo({ top: 0, behavior: "smooth" });
}

/* ————— Auth (unchanged Supabase flow) ————— */
let authMode = "login";
function setMode(mode) {
  authMode = mode;
  $("tabLogin").classList.toggle("active", mode === "login");
  $("tabSignup").classList.toggle("active", mode === "signup");
  $("authSubmit").textContent = mode === "login" ? "Log in" : "Create my account";
  $("authPassword").autocomplete = mode === "login" ? "current-password" : "new-password";
  $("authError").hidden = true;
}
$("tabLogin").onclick = () => setMode("login");
$("tabSignup").onclick = () => setMode("signup");
function authFail(msg) { const e = $("authError"); e.textContent = msg; e.hidden = false; }
function friendlyAuthError(error) {
  const m = (error && error.message) || "Something went wrong.";
  if (/invalid login credentials/i.test(m)) return "Wrong email or password — try again.";
  if (/already registered/i.test(m)) return "An account with this email already exists — try logging in.";
  if (/password should be at least/i.test(m)) return "Password needs at least 6 characters.";
  if (/unable to validate email/i.test(m)) return "That email doesn't look right — try again?";
  return m;
}
$("authForm").addEventListener("submit", async (ev) => {
  ev.preventDefault();
  if (!sb) return authFail("Couldn't reach the account service — check your connection and reload the page.");
  const email = $("authEmail").value.trim().toLowerCase();
  const pw = $("authPassword").value;
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return authFail("That email doesn't look right — try again?");
  if (pw.length < 6) return authFail("Password needs at least 6 characters.");
  const btn = $("authSubmit");
  btn.disabled = true;
  const original = btn.textContent;
  btn.textContent = "One moment…";
  try {
    if (authMode === "signup") {
      const { data, error } = await sb.auth.signUp({ email, password: pw });
      if (error) return authFail(friendlyAuthError(error));
      if (!data.session) return authFail("Account created — check your email to confirm it, then log in.");
      sessionUser = { id: data.user.id, email: data.user.email };
    } else {
      const { data, error } = await sb.auth.signInWithPassword({ email, password: pw });
      if (error) return authFail(friendlyAuthError(error));
      sessionUser = { id: data.user.id, email: data.user.email };
    }
    await hydrate();
    routeAfterLogin();
  } finally {
    btn.disabled = false;
    btn.textContent = original;
  }
});
$("logoutBtn").onclick = async () => {
  if (sb) await sb.auth.signOut();
  sessionUser = null; st = null;
  setMode("login");
  show("view-auth");
};
function routeAfterLogin() {
  if (st && st.builtFor && st.builtFor.city) { renderHome(); show("view-home"); }
  else { initFundPicks(); show("view-fund"); }
}

/* ————— Fundamentals ————— */
let pickDiet = null, pickRoots = null, pickRoots2 = null, pickCity = "";
function savePending() { store.set("dib_pending_fund", { diet: pickDiet, roots: pickRoots, roots2: pickRoots2, city: pickCity }); }
function initFundPicks() {
  const saved = (st && st.fundamentals) || store.get("dib_pending_fund", null);
  pickDiet = saved ? saved.diet : null;
  pickRoots = saved ? normRootsValue(saved.roots) : null;
  pickRoots2 = saved && saved.roots2 ? normRootsValue(saved.roots2) : null;
  if (pickRoots2 === pickRoots) pickRoots2 = null;
  pickCity = saved && saved.city ? canonicalCity(saved.city) : "";
  $("cityInput").value = pickCity;
  $("cityInput").classList.remove("invalid");
  paintFundPicks();
}
function paintFundPicks() {
  document.querySelectorAll("#dietGrid .fund-opt").forEach(b => {
    const on = b.dataset.diet === pickDiet;
    b.classList.toggle("picked", on); b.setAttribute("aria-checked", on ? "true" : "false");
  });
  document.querySelectorAll("#rootsGrid .fund-opt").forEach(b => {
    const on = b.dataset.roots === pickRoots, on2 = b.dataset.roots === pickRoots2;
    b.classList.toggle("picked", on); b.classList.toggle("picked2", on2); b.setAttribute("aria-checked", on || on2 ? "true" : "false");
  });
  $("buildBtn").disabled = !(pickDiet && pickRoots && pickCity);
  $("buildBtn").textContent = st && st.builtFor ? "Rebuild my questions →" : "Build my questions →";
}
document.querySelectorAll("#dietGrid .fund-opt").forEach(b => b.onclick = () => {
  pickDiet = b.dataset.diet; savePending(); paintFundPicks();
});
document.querySelectorAll("#rootsGrid .fund-opt").forEach(b => b.onclick = () => {
  const r = b.dataset.roots;
  if (r === pickRoots) { pickRoots = pickRoots2; pickRoots2 = null; } // tap primary off: second root steps up
  else if (r === pickRoots2) pickRoots2 = null;
  else if (!pickRoots) pickRoots = r;
  else if (!pickRoots2) pickRoots2 = r;
  else pickRoots2 = r; // both slots full — replace the second
  savePending(); paintFundPicks();
});
const FUND_INFO = {
  diet: {
    everything: "Everything — no restrictions at all. The first question asks which meats you eat, so your questions stay relevant: pick chicken-only and mutton biryani quietly leaves the set.",
    vegetarian: "Vegetarian — no meat and no seafood in any option, ever. Dairy and eggs still appear (paneer, curd rice, egg dishes), so this is not the vegan set.",
    vegan: "Vegan — fully plant-based: no meat, seafood, dairy, eggs or honey in any option. Your questions swap in plant dishes that stand on their own.",
    halal: "Everything Halal — the full spread, halal-style: no pork and no alcohol anywhere in your questions. You still pick your meats first, just like Everything."
  },
  roots: {
    hyderabad: "Hyderabad, India — Deccan home turf: dum biryani, haleem, Irani café culture. Written for people who grew up on it — or wish they had.",
    southasia: "South Asia — the wider subcontinent beyond Hyderabad: Punjabi dhabas, Bengali fish courses, Sri Lankan hoppers, Karachi karahis, Nepali dal bhat.",
    eastasia: "East/Southeast Asia — ramen and sushi to laksa, pho, rendang and dumplings. If your comfort zone runs on rice, noodles and broth, start here.",
    middleeast: "Middle-Eastern — mezze spreads, kebabs, saffron rice and slow stews from the Levant, the Gulf, Persia, Turkey and Egypt.",
    unitedstates: "United States — low-and-slow BBQ, diners, burgers, gumbo and plate lunches: smoke, comfort and big plates.",
    europe: "Europe — paella to pierogi, schnitzel to souvlaki: the old continent's classics, from Mediterranean olive-oil country to Nordic preserves.",
    africa: "Africa — jollof and suya to injera, tagines and the braai: one continent, a thousand tables, endless fire.",
    latinamerica: "Latin America & The Caribbean — tacos, ceviche, arepas, feijoada and jerk: corn, lime and smoke run deep here."
  }
};
document.querySelectorAll(".fi").forEach(el => {
  el.addEventListener("click", (e) => {
    e.stopPropagation(); e.preventDefault();
    const box = $(el.dataset.fi + "Info");
    if (!box) return;
    box.textContent = (FUND_INFO[el.dataset.fi] || {})[el.dataset.key] || "";
    box.classList.remove("flash"); void box.offsetWidth; box.classList.add("flash");
  });
});
/* City type-ahead: users pick from a list of major world cities, so the
   value feeding Maps links and the results model is always a clean,
   canonical "City, Country" — no typos from free typing. */
const CITIES = [
  "Hyderabad, India",
  "Bengaluru, India",
  "Mumbai, India",
  "Delhi, India",
  "Chennai, India",
  "Kolkata, India",
  "Pune, India",
  "Ahmedabad, India",
  "Jaipur, India",
  "Lucknow, India",
  "Kochi, India",
  "Panaji, India",
  "Indore, India",
  "Bhopal, India",
  "Chandigarh, India",
  "Coimbatore, India",
  "Nagpur, India",
  "Surat, India",
  "Vadodara, India",
  "Visakhapatnam, India",
  "Patna, India",
  "Guwahati, India",
  "Thiruvananthapuram, India",
  "Mysuru, India",
  "Madurai, India",
  "Varanasi, India",
  "Agra, India",
  "Kanpur, India",
  "Ranchi, India",
  "Bhubaneswar, India",
  "Dehradun, India",
  "Amritsar, India",
  "Ludhiana, India",
  "Udaipur, India",
  "Jodhpur, India",
  "Karachi, Pakistan",
  "Lahore, Pakistan",
  "Islamabad, Pakistan",
  "Hyderabad, Pakistan",
  "Faisalabad, Pakistan",
  "Rawalpindi, Pakistan",
  "Multan, Pakistan",
  "Peshawar, Pakistan",
  "Dhaka, Bangladesh",
  "Chattogram, Bangladesh",
  "Khulna, Bangladesh",
  "Sylhet, Bangladesh",
  "Colombo, Sri Lanka",
  "Kandy, Sri Lanka",
  "Kathmandu, Nepal",
  "Pokhara, Nepal",
  "Dubai, United Arab Emirates",
  "Abu Dhabi, United Arab Emirates",
  "Sharjah, United Arab Emirates",
  "Riyadh, Saudi Arabia",
  "Jeddah, Saudi Arabia",
  "Mecca, Saudi Arabia",
  "Medina, Saudi Arabia",
  "Dammam, Saudi Arabia",
  "Doha, Qatar",
  "Kuwait City, Kuwait",
  "Muscat, Oman",
  "Manama, Bahrain",
  "London, United Kingdom",
  "Manchester, United Kingdom",
  "Birmingham, United Kingdom",
  "Leeds, United Kingdom",
  "Glasgow, United Kingdom",
  "Edinburgh, United Kingdom",
  "Liverpool, United Kingdom",
  "Bristol, United Kingdom",
  "Sheffield, United Kingdom",
  "Cardiff, United Kingdom",
  "Belfast, United Kingdom",
  "Newcastle, United Kingdom",
  "Leicester, United Kingdom",
  "Nottingham, United Kingdom",
  "Oxford, United Kingdom",
  "Cambridge, United Kingdom",
  "Brighton, United Kingdom",
  "York, United Kingdom",
  "Dublin, Ireland",
  "Cork, Ireland",
  "Galway, Ireland",
  "New York, United States",
  "Los Angeles, United States",
  "Chicago, United States",
  "Houston, United States",
  "Phoenix, United States",
  "Philadelphia, United States",
  "San Antonio, United States",
  "San Diego, United States",
  "Dallas, United States",
  "Austin, United States",
  "San Jose, United States",
  "Columbus, United States",
  "Charlotte, United States",
  "San Francisco, United States",
  "Seattle, United States",
  "Denver, United States",
  "Washington DC, United States",
  "Boston, United States",
  "Nashville, United States",
  "Portland, United States",
  "Las Vegas, United States",
  "Miami, United States",
  "Atlanta, United States",
  "Minneapolis, United States",
  "Tampa, United States",
  "Sacramento, United States",
  "Orlando, United States",
  "Detroit, United States",
  "Honolulu, United States",
  "Milwaukee, United States",
  "Baltimore, United States",
  "Salt Lake City, United States",
  "New Orleans, United States",
  "Oklahoma City, United States",
  "Memphis, United States",
  "Louisville, United States",
  "Raleigh, United States",
  "Toronto, Canada",
  "Vancouver, Canada",
  "Montreal, Canada",
  "Calgary, Canada",
  "Ottawa, Canada",
  "Edmonton, Canada",
  "Winnipeg, Canada",
  "Quebec City, Canada",
  "Halifax, Canada",
  "Victoria, Canada",
  "Mexico City, Mexico",
  "Guadalajara, Mexico",
  "Monterrey, Mexico",
  "Puebla, Mexico",
  "Tijuana, Mexico",
  "Cancún, Mexico",
  "Mérida, Mexico",
  "São Paulo, Brazil",
  "Rio de Janeiro, Brazil",
  "Brasília, Brazil",
  "Salvador, Brazil",
  "Fortaleza, Brazil",
  "Belo Horizonte, Brazil",
  "Manaus, Brazil",
  "Curitiba, Brazil",
  "Recife, Brazil",
  "Porto Alegre, Brazil",
  "Buenos Aires, Argentina",
  "Santiago, Chile",
  "Lima, Peru",
  "Bogotá, Colombia",
  "Medellín, Colombia",
  "Quito, Ecuador",
  "Montevideo, Uruguay",
  "Asunción, Paraguay",
  "La Paz, Bolivia",
  "Caracas, Venezuela",
  "Panama City, Panama",
  "San José, Costa Rica",
  "Havana, Cuba",
  "Santo Domingo, Dominican Republic",
  "San Juan, Puerto Rico",
  "Paris, France",
  "Lyon, France",
  "Marseille, France",
  "Nice, France",
  "Bordeaux, France",
  "Toulouse, France",
  "Berlin, Germany",
  "Munich, Germany",
  "Hamburg, Germany",
  "Frankfurt, Germany",
  "Cologne, Germany",
  "Stuttgart, Germany",
  "Düsseldorf, Germany",
  "Madrid, Spain",
  "Barcelona, Spain",
  "Valencia, Spain",
  "Seville, Spain",
  "Bilbao, Spain",
  "Rome, Italy",
  "Milan, Italy",
  "Naples, Italy",
  "Turin, Italy",
  "Florence, Italy",
  "Venice, Italy",
  "Bologna, Italy",
  "Amsterdam, Netherlands",
  "Rotterdam, Netherlands",
  "Utrecht, Netherlands",
  "The Hague, Netherlands",
  "Brussels, Belgium",
  "Antwerp, Belgium",
  "Ghent, Belgium",
  "Vienna, Austria",
  "Salzburg, Austria",
  "Graz, Austria",
  "Zurich, Switzerland",
  "Geneva, Switzerland",
  "Basel, Switzerland",
  "Bern, Switzerland",
  "Lisbon, Portugal",
  "Porto, Portugal",
  "Athens, Greece",
  "Thessaloniki, Greece",
  "Stockholm, Sweden",
  "Gothenburg, Sweden",
  "Malmö, Sweden",
  "Oslo, Norway",
  "Bergen, Norway",
  "Copenhagen, Denmark",
  "Aarhus, Denmark",
  "Helsinki, Finland",
  "Tampere, Finland",
  "Reykjavik, Iceland",
  "Warsaw, Poland",
  "Kraków, Poland",
  "Gdańsk, Poland",
  "Poznań, Poland",
  "Prague, Czechia",
  "Brno, Czechia",
  "Budapest, Hungary",
  "Bucharest, Romania",
  "Sofia, Bulgaria",
  "Zagreb, Croatia",
  "Belgrade, Serbia",
  "Ljubljana, Slovenia",
  "Bratislava, Slovakia",
  "Vilnius, Lithuania",
  "Riga, Latvia",
  "Tallinn, Estonia",
  "Kyiv, Ukraine",
  "Istanbul, Türkiye",
  "Ankara, Türkiye",
  "Izmir, Türkiye",
  "Cairo, Egypt",
  "Alexandria, Egypt",
  "Lagos, Nigeria",
  "Abuja, Nigeria",
  "Nairobi, Kenya",
  "Accra, Ghana",
  "Johannesburg, South Africa",
  "Cape Town, South Africa",
  "Durban, South Africa",
  "Addis Ababa, Ethiopia",
  "Dar es Salaam, Tanzania",
  "Luanda, Angola",
  "Maputo, Mozambique",
  "Casablanca, Morocco",
  "Marrakech, Morocco",
  "Tunis, Tunisia",
  "Algiers, Algeria",
  "Tel Aviv, Israel",
  "Jerusalem, Israel",
  "Beirut, Lebanon",
  "Amman, Jordan",
  "Tehran, Iran",
  "Baghdad, Iraq",
  "Kabul, Afghanistan",
  "Beijing, China",
  "Shanghai, China",
  "Guangzhou, China",
  "Shenzhen, China",
  "Chengdu, China",
  "Xi'an, China",
  "Wuhan, China",
  "Hangzhou, China",
  "Nanjing, China",
  "Chongqing, China",
  "Hong Kong",
  "Taipei, Taiwan",
  "Tokyo, Japan",
  "Osaka, Japan",
  "Kyoto, Japan",
  "Nagoya, Japan",
  "Fukuoka, Japan",
  "Sapporo, Japan",
  "Seoul, South Korea",
  "Busan, South Korea",
  "Incheon, South Korea",
  "Bangkok, Thailand",
  "Chiang Mai, Thailand",
  "Phuket, Thailand",
  "Hanoi, Vietnam",
  "Ho Chi Minh City, Vietnam",
  "Da Nang, Vietnam",
  "Kuala Lumpur, Malaysia",
  "Penang, Malaysia",
  "Johor Bahru, Malaysia",
  "Singapore",
  "Jakarta, Indonesia",
  "Surabaya, Indonesia",
  "Bandung, Indonesia",
  "Denpasar, Indonesia",
  "Manila, Philippines",
  "Cebu, Philippines",
  "Davao, Philippines",
  "Yangon, Myanmar",
  "Phnom Penh, Cambodia",
  "Vientiane, Laos",
  "Ulaanbaatar, Mongolia",
  "Almaty, Kazakhstan",
  "Tashkent, Uzbekistan",
  "Baku, Azerbaijan",
  "Tbilisi, Georgia",
  "Yerevan, Armenia",
  "Sydney, Australia",
  "Melbourne, Australia",
  "Brisbane, Australia",
  "Perth, Australia",
  "Adelaide, Australia",
  "Canberra, Australia",
  "Gold Coast, Australia",
  "Hobart, Australia",
  "Darwin, Australia",
  "Auckland, New Zealand",
  "Wellington, New Zealand",
  "Christchurch, New Zealand",
  "Hamilton, New Zealand",
  "Suva, Fiji"
];
function canonicalCity(v) {
  const t = (v || "").trim().toLowerCase();
  if (!t) return "";
  return CITIES.find(c => c.toLowerCase() === t) || CITIES.find(c => c.split(",")[0].trim().toLowerCase() === t) || "";
}
let cityMatches = [], cityActive = -1;
function closeCityMenu() { $("cityMenu").hidden = true; $("cityInput").setAttribute("aria-expanded", "false"); cityActive = -1; }
function pickCityValue(c) {
  pickCity = c;
  $("cityInput").value = c;
  $("cityInput").classList.remove("invalid");
  closeCityMenu(); savePending(); paintFundPicks();
}
function paintCityMenu() {
  const menu = $("cityMenu");
  if (!cityMatches.length) {
    menu.innerHTML = `<div class="city-none">No matching city in the list yet — try a nearby major city.</div>`;
  } else {
    menu.innerHTML = cityMatches.map((c, i) => {
      const cut = c.indexOf(",");
      return `<button type="button" class="city-item${i === cityActive ? " active" : ""}" data-city="${c}" role="option">${c.slice(0, cut)}<span class="cc">${c.slice(cut)}</span></button>`;
    }).join("");
    menu.querySelectorAll(".city-item").forEach(b => b.addEventListener("mousedown", (e) => { e.preventDefault(); pickCityValue(b.dataset.city); }));
  }
  menu.hidden = false;
  $("cityInput").setAttribute("aria-expanded", "true");
}
$("cityInput").addEventListener("input", (e) => {
  const v = e.target.value, t = v.trim().toLowerCase();
  pickCity = canonicalCity(v); // only a list pick (or exact match) counts
  e.target.classList.toggle("invalid", !!t && !pickCity);
  if (!t) { closeCityMenu(); savePending(); paintFundPicks(); return; }
  const starts = CITIES.filter(c => c.split(",")[0].trim().toLowerCase().startsWith(t));
  const incl = CITIES.filter(c => !starts.includes(c) && c.toLowerCase().includes(t));
  cityMatches = [...starts, ...incl].slice(0, 8);
  cityActive = cityMatches.length ? 0 : -1;
  paintCityMenu(); savePending(); paintFundPicks();
});
$("cityInput").addEventListener("keydown", (e) => {
  if ($("cityMenu").hidden) return;
  if (e.key === "ArrowDown" || e.key === "ArrowUp") {
    e.preventDefault();
    if (!cityMatches.length) return;
    cityActive = (cityActive + (e.key === "ArrowDown" ? 1 : -1) + cityMatches.length) % cityMatches.length;
    paintCityMenu();
  } else if (e.key === "Enter") {
    if (cityActive >= 0 && cityMatches[cityActive]) { e.preventDefault(); pickCityValue(cityMatches[cityActive]); }
  } else if (e.key === "Escape") closeCityMenu();
});
$("cityInput").addEventListener("blur", () => {
  setTimeout(() => { // let a menu click land first
    const canon = canonicalCity($("cityInput").value);
    if (canon) pickCityValue(canon);
    else { pickCity = ""; $("cityInput").classList.toggle("invalid", !!$("cityInput").value.trim()); paintFundPicks(); }
    closeCityMenu();
  }, 120);
});
let fundArmAt = 0;
$("buildBtn").onclick = () => {
  const city = pickCity;
  if (!pickDiet || !pickRoots || !city) return;
  const F = { diet: pickDiet, roots: pickRoots, roots2: pickRoots2 || null, city };
  const prev = st.builtFor;
  if (prev && prev.diet === F.diet && prev.roots === F.roots && (prev.roots2 || null) === F.roots2) {
    // City added/changed only — questions don't depend on it, keep progress.
    st.fundamentals = F; st.builtFor = F;
    if (st.result) st.result = computeResult(st);
    saveState();
    if (!st.finished && answeredCount(st) === 0) { st.pos = 0; enterQuiz(); }
    else { renderHome(); show("view-home"); }
    return;
  }
  // Same two-tap arm as Start over (no native confirm() anywhere — some
  // webviews suppress it, which silently blocked this flow too).
  if ((prev || st.finished) && answeredCount(st) > 0 && Date.now() - fundArmAt > 4000) {
    fundArmAt = Date.now();
    const b = $("buildBtn"); const oldLabel = b.textContent;
    b.textContent = "⚠️ New settings clear your current answers — tap again to continue";
    setTimeout(() => { if (b.textContent.startsWith("⚠️")) b.textContent = oldLabel; }, 4000);
    return;
  }
  fundArmAt = 0;
  st.fundamentals = F; st.builtFor = F;
  st.answers = {}; st.skipped = {}; st.finished = false; st.result = null; st.sheetSent = false;
  st.loves = null; st.lovesData = {};
  buildOrder(st);
  saveState();
  st.pos = 0;
  enterQuiz();
};
$("fundExitBtn").onclick = () => {
  if (st && st.builtFor) { renderHome(); show("view-home"); }
  else { renderHome(); show("view-home"); }
};

/* ————— Home ————— */
function renderHome() {
  if (!st) return;
  const n = answeredCount(st);
  const restart = $("restartBtn"), change = $("changeFundBtn");
  $("fundSummary").textContent = st.builtFor
    ? `Your fundamentals: ${DIET_LABELS[st.builtFor.diet]} · ${ROOT_EMOJI[st.builtFor.roots]} ${rootsLabelOf(st.builtFor)} roots${st.builtFor.city ? ` · 📍 ${st.builtFor.city}` : ""}`
    : "";
  restart.hidden = !(n > 0 || st.finished);
  change.hidden = !st.builtFor;
  if (!st.builtFor) {
    $("homeTitle").textContent = "One quick step first 🧭";
    $("homeText").textContent = "Pick your diet, your roots and the city you live in — and we'll build your questions around them.";
    $("primaryAction").textContent = "Pick my fundamentals →";
  } else if (st.finished) {
    $("homeTitle").textContent = "Your taste profile is ready 🎉";
    $("homeText").textContent = st.result && st.result.partial
      ? `You ended early after ${n} answers, so this profile is based on limited information. Come see what your taste buds had to say — or retake the questions for the complete picture.`
      : "You've answered all your questions. Come see what your taste buds had to say — and which world flavours to meet next.";
    $("primaryAction").textContent = "See my taste profile";
  } else if (n > 0) {
    $("homeTitle").textContent = "Welcome back 👋";
    $("homeText").textContent = `You've answered ${n} questions — everything, slider weights included, is saved to your account. Pick up right where you left off, on any device.`;
    $("primaryAction").textContent = `Continue — question ${n + 1}`;
  } else {
    $("homeTitle").textContent = "Ready to dive in?";
    $("homeText").textContent = `Your questions are built around ${rootsLabelOf(st.builtFor)} roots and a ${DIET_LABELS[st.builtFor.diet]} diet. About 10 minutes — save & exit anytime.`;
    $("primaryAction").textContent = "Start the questions";
  }
}
$("primaryAction").onclick = () => {
  if (!st.builtFor) { initFundPicks(); show("view-fund"); return; }
  if (st.finished) { renderResults(); show("view-results"); return; }
  const t = findNext(0);
  st.pos = t >= 0 ? t : 0;
  saveState();
  enterQuiz();
};
$("changeFundBtn").onclick = () => { initFundPicks(); show("view-fund"); };
// Start over: a COMPLETE run reset — answers, skips, navigation history and
// any cached recommendations all go (an earlier version left skips behind,
// which silently suppressed questions in the fresh run). Fundamentals stay.
// Confirmation is a two-tap in-page arm, NOT the native confirm() dialog:
// native dialogs are suppressed outright by some mobile webviews, which
// made Start over look dead. First tap arms (button relabels), second
// tap within 4s performs the reset.
let restartArmAt = 0;
function doRestart(e) {
  const btn = e && e.currentTarget;
  if (Date.now() - restartArmAt > 4000) {
    restartArmAt = Date.now();
    if (btn) {
      const oldLabel = btn.textContent;
      btn.textContent = "Tap again to confirm — answers will be cleared";
      setTimeout(() => { if (btn.textContent.startsWith("Tap again to confirm")) btn.textContent = oldLabel; }, 4000);
    }
    return;
  }
  restartArmAt = 0;
  st.answers = {}; st.skipped = {}; st.seen = []; st.navAt = -1; st.pos = 0;
  st.finished = false; st.result = null; st.sheetSent = false; st.altRecs = null;
  st.loves = null; st.lovesData = {};
  buildOrder(st);
  saveState();
  renderHome();
  show("view-home");
}
$("restartBtn").onclick = doRestart;
$("quizRestartBtn").onclick = doRestart;

/* ————— Loved dishes (v22) —————
   Every run opens with "Tell us what you love!" — a type-ahead over a
   44,494-dish catalog (v23). dishes-meta.js + dishes-idx-N.js carry the packed
   name index (popularity-ordered); full tags for the 3,000 most-picked
   dishes live in dishes-tags-N.js (fixed 500-id blocks) and load per pick.
   Picks persist as st.loves (catalog ids) + st.lovesData (id -> {n,i,f})
   so computeResult never needs the shards. Deeper picks still count via
   the name/ingredient keyword machinery. */
const LOVES_MIN = 5, LOVES_MAX = 15;
let dishIndexPromise = null, dishMetaPromise = null, lovesWired = false, lovesLoadFailed = false, lovesLastQuery = null;
const dishShardPromises = {};
let DISH_LIST = null; // [{name, origin, course, id, nn, no}]
const dishById = new Map();
function loadScriptOnce(src) {
  return new Promise((resolve, reject) => {
    const el = document.createElement("script");
    el.src = src; el.onload = () => resolve(); el.onerror = () => reject(new Error("load " + src));
    document.head.appendChild(el);
  });
}
function ensureDishMeta() {
  if (window.DISH_META) return Promise.resolve();
  if (!dishMetaPromise) dishMetaPromise = loadScriptOnce("dishes-meta.js?v=2");
  return dishMetaPromise;
}
const normDishText = (s) => (s || "").toLowerCase().replace(/[^a-z0-9 ]/g, " ").replace(/\s+/g, " ").trim();
function ensureDishIndex() {
  if (DISH_LIST) return Promise.resolve();
  if (!dishIndexPromise) {
    dishIndexPromise = ensureDishMeta()
      .then(() => Promise.all(Array.from({ length: window.DISH_META.idxShards }, (_, n) => loadScriptOnce(`dishes-idx-${n}.js?v=2`))))
      .then(() => {
        DISH_LIST = [];
        let id = 0;
        for (let n = 0; n < window.DISH_META.idxShards; n++) {
          for (const line of (window["DISH_IDX_" + n] || "").split("\n")) {
            if (!line) continue;
            const [name, oc, cc] = line.split("\t");
            const e = { name, origin: window.DISH_META.origins[+oc] || "", course: window.DISH_META.courses[+cc] || "", id: id++, nn: normDishText(name), no: "" };
            e.no = normDishText(e.origin);
            DISH_LIST.push(e); dishById.set(e.id, e);
          }
        }
      });
  }
  return dishIndexPromise;
}
function ensureDishData(id) {
  const M = window.DISH_META;
  if (!M || id >= M.tagHead) return Promise.resolve(null);
  const n = Math.floor(id / M.tagBlock), key = "DISH_TAGS_" + n;
  if (window[key]) return Promise.resolve(window[key][id] || null);
  if (!dishShardPromises[n]) dishShardPromises[n] = loadScriptOnce(`dishes-tags-${n}.js?v=2`);
  return dishShardPromises[n].then(() => (window[key] || {})[id] || null).catch(() => null);
}
function searchDishes(query) {
  const q = normDishText(query);
  if (!q || !DISH_LIST) return [];
  const toks = q.split(" ");
  const hits = [];
  for (const e of DISH_LIST) {
    if (!toks.every(t => e.nn.includes(t) || e.no.includes(t))) continue;
    let rank = 2;
    if (e.nn === q) rank = -1;
    else if (e.nn.startsWith(q)) rank = 0;
    else if (e.nn.split(" ").some(w => w.startsWith(toks[0]))) rank = 1;
    hits.push({ rank, e });
    if (hits.length > 600 && rank > 0) break; // list is popularity-ordered — enough candidates
  }
  hits.sort((a, b) => a.rank - b.rank);
  return hits.slice(0, 24).map(h => h.e);
}
function paintLoveResults(list) {
  lovesLastQuery = list;
  $("lovesResults").innerHTML = list.map(e => {
    const picked = (st.loves || []).includes(e.id);
    return `<button type="button" class="opt${picked ? " sel" : ""}" data-pick="${e.id}">${e.name}<span class="dish-sub">${[e.origin, e.course].filter(Boolean).join(" · ")}</span></button>`;
  }).join("");
}
function paintLoves() {
  const loves = st.loves || [];
  $("lovesCount").textContent = `${loves.length}/${LOVES_MAX} picked`;
  $("lovesNext").disabled = !(loves.length >= LOVES_MIN || (lovesLoadFailed && loves.length === 0));
  $("lovesHint").textContent = lovesLoadFailed
    ? "The dish list couldn't load — tap Continue to go straight to the questions."
    : loves.length >= LOVES_MAX ? "That's your 15 — tap a picked dish to swap it out."
    : loves.length >= LOVES_MIN ? "Lovely list. Add more, or continue when you're ready."
    : `Pick at least ${LOVES_MIN} to continue — ${LOVES_MIN - loves.length} to go.`;
  $("lovesPicked").innerHTML = loves.map(id => {
    const d = (st.lovesData || {})[id];
    const name = d ? d.n : ((dishById.get(id) || {}).name || "Dish");
    return `<button type="button" class="opt sel" data-love="${id}">${name}<span class="love-x" aria-hidden="true">✕</span></button>`;
  }).join("");
}
async function addLove(id) {
  st.loves = st.loves || [];
  if (st.loves.includes(id) || st.loves.length >= LOVES_MAX) { paintLoves(); return; }
  st.loves.push(id);
  const entry = dishById.get(id);
  st.lovesData = st.lovesData || {};
  st.lovesData[id] = { n: entry ? entry.name : "Dish", i: [], f: [] };
  saveState(); paintLoves(); if (lovesLastQuery) paintLoveResults(lovesLastQuery);
  const d = await ensureDishData(id);
  if (d) { st.lovesData[id] = { n: entry ? entry.name : "Dish", i: d.i || [], f: d.f || [] }; saveState(); }
}
function removeLove(id) {
  st.loves = (st.loves || []).filter(x => x !== id);
  if (st.lovesData) delete st.lovesData[id];
  saveState(); paintLoves(); if (lovesLastQuery) paintLoveResults(lovesLastQuery);
}
function renderLoves() {
  if (!Array.isArray(st.loves)) st.loves = [];
  // v23 (Aizaz): no dish list until the user starts typing.
  $("lovesInput").value = "";
  paintLoveResults([]);
  paintLoves();
  ensureDishMeta().then(() => ensureDishIndex())
    .then(() => { paintLoves(); })
    .catch(() => { lovesLoadFailed = true; paintLoves(); });
  if (lovesWired) return;
  lovesWired = true;
  $("lovesInput").addEventListener("input", (e) => {
    const q = e.target.value.trim();
    if (!DISH_LIST) return;
    if (!q) { paintLoveResults([]); return; }
    paintLoveResults(searchDishes(q));
  });
  $("lovesResults").addEventListener("click", (e) => {
    const b = e.target.closest("[data-pick]"); if (!b) return;
    const id = +b.dataset.pick;
    if ((st.loves || []).includes(id)) removeLove(id); else addLove(id);
  });
  $("lovesPicked").addEventListener("click", (e) => {
    const b = e.target.closest("[data-love]"); if (!b) return;
    removeLove(+b.dataset.love);
  });
  $("lovesNext").onclick = () => {
    if (lovesLoadFailed && (!st.loves || st.loves.length === 0)) st.loves = [];
    if (!Array.isArray(st.loves) || (st.loves.length < LOVES_MIN && !lovesLoadFailed)) return;
    saveState();
    const t = findNext(0); st.pos = t >= 0 ? t : 0;
    renderQuestion(); show("view-quiz");
  };
}
function enterQuiz() {
  if (st.loves === null) { renderLoves(); show("view-loves"); return; }
  renderQuestion(); show("view-quiz");
}

/* ————— Quiz ————— */
let pendingW = 1;
let pendingSel = new Set(); // multi-select working set (original option indices)
let pendingRank = []; // ranked top-2 working list (ordered option indices)
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
  if (!st.answers[q.id] && !playable(q, st) && !(st.skipped && st.skipped[q.id])) { // safety: never strand the user (a skipped question may still be VIEWED via Back)
    const t = findNext(st.pos);
    if (t >= 0) { st.pos = t; q = currentQ(); }
  }
  st.seen = st.seen || [];
  // Restored sessions may arrive with empty/partial seen-history: rebuild
  // the missing head from the run order so Back always has somewhere to go.
  if (st.order.length) {
    if (!st.seen.length) st.seen = st.order.slice(0, st.pos + 1);
    else { const head = st.order.indexOf(st.seen[0]); if (head > 0) st.seen = [...st.order.slice(0, head), ...st.seen]; }
  }
  if (q && !st.seen.includes(q.id)) st.seen.push(q.id); // the displayed sequence Back/Next browse
  const saved = st.answers[q.id];
  const n = answeredCount(st);
  // The counter numbers the questions that COUNT toward the run's total:
  // a skipped question consumes no number — its replacement takes the same
  // number it would have had (skip Q4 -> the replacement is the new Q4).
  const upto = st.order.slice(0, st.order.indexOf(q.id) + 1);
  const skippedBefore = upto.filter(id => id !== q.id && st.skipped && st.skipped[id]).length;
  const posInRun = Math.min(upto.length - skippedBefore, runTotal(st));

  $("qCounter").textContent = `Question ${posInRun} of ${runTotal(st)}`; // v23.1 (Aizaz): show the run's end — the shorter length is the point
  $("progressBar").style.width = (n / runTotal(st) * 100) + "%";
  $("progressWrap").setAttribute("aria-valuenow", n);
  $("progressWrap").setAttribute("aria-valuemax", runTotal(st));
  $("qSection").textContent = DECK_LABELS[q.deck] || "";
  $("qSub").textContent = DECK_SUBS[q.deck] || "";

  $("qEmoji").textContent = q.emoji;
  const img = $("qImg");
  const url = imgUrlFor(q);
  img.style.display = url ? "" : "none";
  if (url) img.src = url;
  img.alt = q.q;
  $("qText").textContent = q.q;
  $("multiHint").hidden = !(q.multi || q.rank);
  $("multiHint").textContent = q.rank ? (q.rank === 3 ? "🥇 Tap in order — your #1 first, then #2, then #3." : "🥇 Tap your #1 pick first — then your #2.") : "✋ Pick all that apply — then hit Next.";
  $("qInfoBtn").hidden = !q.info;
  $("qInfoBtn").classList.remove("open");
  $("qInfoPanel").hidden = true;
  $("qInfoPanel").textContent = q.info || "";

  pendingSel = new Set(saved && Array.isArray(saved.o) ? saved.o : []);
  pendingRank = saved && saved.r ? [...saved.o] : [];
  const box = $("qOptions");
  box.innerHTML = "";
  visibleOpts(q, st).forEach(({ o, i }) => {
    const picked = q.rank ? pendingRank.includes(i) : q.multi ? pendingSel.has(i) : (saved && saved.o === i);
    const b = document.createElement("button");
    b.type = "button";
    b.className = "opt" + (q.multi ? " multi" : "") + (q.rank ? " rank" : "") + (picked ? " picked" : "");
    b.textContent = o.t;
    if (q.rank && pendingRank.includes(i)) {
      const bd = document.createElement("span");
      bd.className = "rank-badge";
      bd.textContent = ["1st", "2nd", "3rd"][pendingRank.indexOf(i)] || "";
      b.appendChild(bd);
    }
    b.dataset.oi = i;
    b.setAttribute("aria-pressed", picked ? "true" : "false");
    b.onclick = () => (q.rank ? toggleRank(i) : q.multi ? toggleOption(i) : selectOption(i));
    box.appendChild(b);
  });

  pendingW = saved ? saved.w : 1;
  $("weightSlider").value = pendingW;
  updateSliderLabel();
  const sliderHint = $("sliderHint");
  if (sliderHint) {
    const firstRanked = q.rank && !Object.values(st.answers).some(a => a && a.r);
    sliderHint.textContent = firstRanked
      ? "First ranked question — this slider is how much your picks matter: 1 means the others nearly won, 5 means no contest. It steers your whole profile."
      : "1 means the other options nearly won. 5 means this pick, no debate.";
  }

  const hasAnswer = q.rank ? pendingRank.length > 0 : q.multi ? pendingSel.size > 0 : !!saved;
  $("nextBtn").disabled = !hasAnswer;
  $("nextBtn").textContent = hasAnswer && n >= runTotal(st) - 1 && findNext(0) === -1 ? "Finish — see my profile 🎉" : "Next →";
  const seenIdx = st.seen ? st.seen.indexOf(q.id) : -1;
  const browsing = st.navAt >= 0 && seenIdx >= 0 && seenIdx < (st.seen || []).length - 1;
  if (browsing) { $("nextBtn").disabled = false; $("nextBtn").textContent = "Next →"; }
  $("backBtn").style.visibility = (seenIdx > 0 || st.pos > 0) ? "visible" : "hidden";
  const skipB = $("skipBtn");
  if (skipB) skipB.style.display = (st.skipped && st.skipped[q.id]) ? "none" : "";
  $("savedNote").textContent = n ? `✓ ${n} answer${n > 1 ? "s" : ""} saved` : "";
  paintEndBtn();

  const inner = $("qInner");
  inner.style.animation = "none"; void inner.offsetWidth; inner.style.animation = "";
  const nextId = st.order[st.pos + 1];
  if (nextId && QBANK_BY_ID[nextId]) { const pre = new Image(); pre.src = imgUrlFor(QBANK_BY_ID[nextId]); }
  $("qText").focus({ preventScroll: true });
}
function updateSliderLabel() { $("sliderVal").textContent = `${pendingW} · ${WEIGHT_WORDS[pendingW]}`; }
function paintEndBtn() {
  const showEnd = !!st && !st.finished && answeredCount(st) >= 5; // v23.3 (Aizaz): End here from 5 answers (was 10)
  $("endBtn").hidden = !showEnd;
  $("endInfoBtn").hidden = !showEnd;
  if (!showEnd) $("endInfoPanel").hidden = true;
}
function refreshAfterAnswer() {
  const n = answeredCount(st);
  $("progressBar").style.width = (n / runTotal(st) * 100) + "%";
  $("progressWrap").setAttribute("aria-valuenow", n);
  $("progressWrap").setAttribute("aria-valuemax", runTotal(st));
  $("savedNote").textContent = `✓ ${n} answer${n > 1 ? "s" : ""} saved`;
  $("nextBtn").disabled = false;
  $("nextBtn").textContent = n >= runTotal(st) - 1 && findNext(0) === -1 ? "Finish — see my profile 🎉" : "Next →";
  paintEndBtn();
}
function paintOptions() {
  const q = currentQ();
  const vis = visibleOpts(q, st);
  [...$("qOptions").children].forEach((b) => {
    const entry = vis.find(v => v.i === Number(b.dataset.oi));
    if (!entry) return;
    let picked = false, badge = "";
    if (q.rank) { const ix = pendingRank.indexOf(entry.i); picked = ix >= 0; badge = ["1st", "2nd", "3rd"][ix] || ""; }
    else if (q.multi) picked = pendingSel.has(entry.i);
    else picked = !!(st.answers[q.id] && st.answers[q.id].o === entry.i);
    b.classList.toggle("picked", picked);
    b.setAttribute("aria-pressed", picked ? "true" : "false");
    let bd = b.querySelector(".rank-badge");
    if (badge) {
      if (!bd) { bd = document.createElement("span"); bd.className = "rank-badge"; b.appendChild(bd); }
      bd.textContent = badge;
    } else if (bd) bd.remove();
  });
}
// After any answer commit: if a gate parent's answer changed, clear its
// children's stale answers. The order itself is re-shaped in the Next
// handler (fixOrder) — never here: fixOrder swaps are one-way, so running
// it mid-selection (e.g. on each tap of the meats multi-select, when only
// the first meat is registered) would permanently swap out questions that
// the user's final selection would have kept playable.
function afterAnswer(q, prevJson) {
  if (st.answers[q.id] && st.skipped) delete st.skipped[q.id]; // answering a question you once skipped un-skips it
  const nowJson = JSON.stringify(st.answers[q.id] || null);
  if (nowJson !== prevJson && QBANK.some(c => c.gate && c.gate.q === q.id)) {
    QBANK.filter(c => c.gate && c.gate.q === q.id).forEach(c => { delete st.answers[c.id]; });
  }
  saveState();
}
function selectOption(oi) {
  const q = currentQ();
  const prev = JSON.stringify(st.answers[q.id] || null);
  if (st.answers[q.id] && st.answers[q.id].o === oi) delete st.answers[q.id]; // tapping your own pick again clears it — every question type can deselect
  else st.answers[q.id] = { o: oi, w: pendingW };
  afterAnswer(q, prev);
  paintOptions();
  refreshAfterAnswer();
  if (!st.answers[q.id]) $("nextBtn").disabled = true;
}
function toggleOption(oi) {
  const q = currentQ();
  const prev = JSON.stringify(st.answers[q.id] || null);
  if (pendingSel.has(oi)) pendingSel.delete(oi); else pendingSel.add(oi);
  if (pendingSel.size) st.answers[q.id] = { o: [...pendingSel], w: pendingW };
  else delete st.answers[q.id];
  afterAnswer(q, prev);
  paintOptions();
  $("nextBtn").disabled = pendingSel.size === 0;
  refreshAfterAnswer();
  if (pendingSel.size === 0) $("nextBtn").disabled = true;
}
function toggleRank(oi) {
  const q = currentQ();
  const ix = pendingRank.indexOf(oi);
  const maxR = typeof q.rank === "number" ? q.rank : 2;
  if (ix >= 0) pendingRank.splice(ix, 1);
  else if (pendingRank.length < maxR) pendingRank.push(oi);
  else pendingRank[maxR - 1] = oi;
  if (pendingRank.length) st.answers[q.id] = { o: [...pendingRank], w: pendingW, r: 1 };
  else delete st.answers[q.id];
  if (st.answers[q.id] && st.skipped) delete st.skipped[q.id];
  saveState();
  paintOptions();
  $("nextBtn").disabled = pendingRank.length === 0;
  refreshAfterAnswer();
  if (pendingRank.length === 0) $("nextBtn").disabled = true;
}
$("weightSlider").addEventListener("input", (e) => {
  pendingW = parseInt(e.target.value, 10) || 1;
  updateSliderLabel();
  const q = currentQ();
  if (q && st.answers[q.id]) { st.answers[q.id].w = pendingW; saveState(); }
});
$("nextBtn").onclick = () => {
  // Browsing back through questions already seen: Next walks forward through
  // that same displayed sequence first — it must not leap to the frontier
  // until the user has caught up with where they left off.
  const cur = currentQ();
  const ci = cur && st.seen ? st.seen.indexOf(cur.id) : -1;
  if (st.navAt >= 0 && ci >= 0 && ci < st.seen.length - 1) {
    // Walk forward through the displayed sequence, skipping any entry
    // that can't resolve in the current order.
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
  fixOrder(st); // shape the tail with the just-committed answer before advancing
  if (answeredCount(st) >= runTotal(st)) return finish();
  let t = findNext(st.pos + 1);
  if (t === -1) t = findNext(0);
  if (t === -1) return finish();
  st.pos = t;
  saveState();
  renderQuestion();
};
$("skipBtn").onclick = () => {
  const q = currentQ();
  if (!q || st.finished) return;
  const prev = JSON.stringify(st.answers[q.id] || null);
  delete st.answers[q.id]; // a skip discards any partial taps on this question
  st.skipped = st.skipped || {};
  st.skipped[q.id] = true;
  afterAnswer(q, prev); // clears stale gate-children answers if this was a parent
  // Settle the order BEFORE choosing and splicing the replacement:
  // fixOrder's gate promotion seats unpromoted follow-ups at pos + 1, so
  // running it after the splice wedges them in ahead of the replacement —
  // pushing the replacement down the numbering and stranding the follow-ups
  // behind the new position, where forward navigation never reaches them.
  fixOrder(st);
  // Skip swaps the question out IN PLACE (Aizaz, 2026-10-07): the
  // replacement (same deck / same fundamentals family first) takes the slot
  // right after the skipped question and is shown immediately as the new
  // current question — the user never advances past an unanswered slot, and
  // the run still totals the full set of answers.
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
$("backBtn").onclick = () => {
  // Back goes to the question that was displayed immediately before this
  // one — even if it was skipped (it renders ready for a second look;
  // answering it there un-skips it).
  const cur = currentQ();
  st.seen = st.seen || [];
  let ci = cur ? st.seen.indexOf(cur.id) : -1;
  if (ci === -1) ci = st.seen.length; // restored session: step back from the end of the known sequence
  if (ci <= 0) return;
  // Scan past any history entry that can't resolve in the current order
  // (stale ids from older builds) instead of dead-ending on it forever.
  let step = ci - 1;
  while (step >= 0 && st.order.indexOf(st.seen[step]) < 0) step--;
  if (step < 0) return;
  st.navAt = step;
  st.pos = st.order.indexOf(st.seen[step]);
  saveState();
  renderQuestion();
};
$("saveExitBtn").onclick = () => { saveState(); renderHome(); show("view-home"); };

document.addEventListener("keydown", (e) => {
  if ($("view-quiz").hidden) return;
  if (/INPUT|TEXTAREA/.test(document.activeElement.tagName) && document.activeElement.id !== "weightSlider") return;
  const q = currentQ(); if (!q) return;
  const vis = visibleOpts(q, st);
  const num = parseInt(e.key, 10);
  if (num >= 1 && num <= vis.length) (q.rank ? toggleRank : q.multi ? toggleOption : selectOption)(vis[num - 1].i);
  else if (e.key === "ArrowRight" && !$("nextBtn").disabled && document.activeElement.id !== "weightSlider") $("nextBtn").click();
  else if (e.key === "ArrowLeft" && document.activeElement.id !== "weightSlider") $("backBtn").click();
});

/* ————— Results ————— */
const TAG_LABELS = {
  biryani: "🍛 Biryani devotee", deccan: "🌶️ Deccan at heart", spice: "🔥 Chilli chaser",
  mild: "😌 Easy-going palate", sweet: "🍮 Certified sweet tooth", street: "🧭 Street-food hunter",
  noodle: "🍜 Noodle loyalist", rice: "🍚 Rice is life", meat: "🍗 Full non-veg energy",
  veg: "🥦 Veggie-friendly", cafe: "🥐 Café-hopper", home: "🏠 Ghar ka khana fan",
  adventure: "🎲 Will try anything once", classic: "💛 Comfort-food classic",
  healthy: "🥗 Fresh & balanced", chai: "🫖 Chai over everything", coffee: "☕ Coffee-powered",
  asia: "🥢 Asia-curious palate", americas: "🌮 Americas explorer", europe: "🥐 European soul",
  smoky: "🔥 Smoke & char devotee", tangy: "🍋 Tang-chaser", creamy: "🥛 Creamy-comfort seeker", fresh: "🌿 Fresh & bright",
  soup: "🍲 Soup devotee"
};
const RECS = [
  { dish: "Vegetable paella", yt: "https://www.youtube.com/watch?v=DIAFEcEarAA", from: "Spain · Europe", region: "europe", diet: "vegan", emoji: "🥘", match: ["rice", "biryani"], why: "Saffron rice cooked slow in one pan — biryani's Mediterranean cousin, socarrat crust and all." },
  { dish: "Tahdig — crispy saffron rice", yt: "https://www.youtube.com/watch?v=iNH5Yqms3Yc", from: "Persia · Middle East", region: "middleeast", diet: "vegan", emoji: "🍚", match: ["rice", "biryani", "classic"], why: "Fragrant rice with a golden, crunchy bottom — the part everyone fights over, as the main event." },
  { dish: "Jambalaya", yt: "https://www.youtube.com/watch?v=FET_VALgHrk", from: "Louisiana · United States", region: "unitedstates", diet: "meat:chicken", emoji: "🍤", match: ["rice", "spice", "smoky"], why: "One-pot spiced rice with smoke and heat — a biryani relative that grew up in New Orleans." },
  { dish: "Veggie burrito bowl", yt: "https://www.youtube.com/watch?v=f558hrjpOrw", from: "Mexico · Latin America", region: "latinamerica", diet: "vegan", emoji: "🌯", match: ["rice", "fresh", "healthy"], why: "Rice, beans, salsa, guac — the build-your-own thali, Mexican edition." },
  { dish: "Mapo tofu", yt: "https://www.youtube.com/watch?v=_BfTqhtfGTM", from: "Sichuan · East Asia", region: "eastasia", diet: "vegan", emoji: "🌶️", match: ["spice", "adventure"], why: "Silky tofu in a chilli-bean lava with numbing Sichuan pepper. Your heat tolerance, upgraded." },
  { dish: "Thai green curry with tofu", yt: "https://www.youtube.com/watch?v=Fv-ADFgtrRg", from: "Thailand · Southeast Asia", region: "eastasia", diet: "vegan", emoji: "🍛", match: ["creamy", "spice"], why: "Coconut, basil and green chilli — salan energy in a whole new accent." },
  { dish: "Shakshuka", yt: "https://www.youtube.com/watch?v=Uow78qBAWRk", from: "The Mediterranean", region: "middleeast", diet: "veg", egg: true, emoji: "🍳", match: ["tangy", "home"], why: "Eggs poached in spiced tomato sauce — breakfast, lunch and dinner argue over it." },
  { dish: "Ratatouille", yt: "https://www.youtube.com/watch?v=rjJCetszgNM", from: "France · Europe", region: "europe", diet: "vegan", emoji: "🍆", match: ["home", "healthy", "fresh"], why: "Slow-stewed vegetables with herbs — proof that simple veg, cooked patiently, wins." },
  { dish: "Elote — street corn", yt: "https://www.youtube.com/watch?v=vsfUpBRm7fI", from: "Mexico · Latin America", region: "latinamerica", diet: "veg", emoji: "🌽", match: ["street", "tangy"], why: "Charred corn, lime, chilli, cheese — chaat's long-lost Mexican sibling." },
  { dish: "Mushroom pierogi", yt: "https://www.youtube.com/watch?v=qWwqdORZwmQ", from: "Poland · Europe", region: "europe", diet: "vegan", emoji: "🥟", match: ["home", "classic"], why: "Dumplings with sauerkraut and mushroom — momos that emigrated and got cosy." },
  { dish: "Mushroom ceviche", yt: "https://www.youtube.com/watch?v=acZSogWWvfY", from: "Peru · Latin America", region: "latinamerica", diet: "vegan", emoji: "🍋", match: ["fresh", "tangy", "adventure"], why: "Lime-cured, onion-sharp, chilli-bright — a flavour wake-up call, no cooking involved." },
  { dish: "Bibimbap", yt: "https://www.youtube.com/watch?v=i54aNCIgrOQ", from: "Korea · East Asia", region: "eastasia", diet: "veg", emoji: "🍲", match: ["rice", "fresh"], why: "A rainbow of vegetables over rice with gochujang — mix it like you mean it." },
  { dish: "Mushroom risotto", yt: "https://www.youtube.com/watch?v=JozZZS6s8Kw", from: "Italy · Europe", region: "europe", diet: "veg", emoji: "🍄", match: ["creamy", "classic"], why: "Rice stirred to silk — khichdi's elegant Italian cousin." },
  { dish: "Tempeh satay skewers", yt: "https://www.youtube.com/watch?v=9K7qgk5JJac", from: "Indonesia · Southeast Asia", region: "eastasia", diet: "vegan", emoji: "🍢", match: ["smoky", "street"], why: "Charred skewers with peanut sauce — kebab night, Southeast Asian style." },
  { dish: "Açaí bowl", yt: "https://www.youtube.com/watch?v=VtZeq8Ab9_4", from: "Brazil · Latin America", region: "latinamerica", diet: "vegan", emoji: "🫐", match: ["sweet", "fresh", "healthy"], why: "Icy purple berries, granola crunch — dessert that behaves like breakfast." },
  { dish: "Miso soup & onigiri", yt: "https://www.youtube.com/watch?v=kzhB-Lxa0vU", from: "Japan · East Asia", region: "eastasia", diet: "vegan", emoji: "🍙", match: ["mild", "home"], why: "Quiet, savoury comfort — the gentle end of the flavour spectrum, done perfectly." },
  { dish: "Yakitori skewers", yt: "https://www.youtube.com/watch?v=tD1ev04a7A0", from: "Japan · East Asia", region: "eastasia", diet: "meat:chicken", emoji: "🍗", match: ["smoky", "street", "meat"], why: "Charcoal-kissed chicken skewers — your kebab instincts, refined to an art." },
  { dish: "Texas brisket", yt: "https://www.youtube.com/watch?v=uu2Y2pdVaXc", from: "Texas · United States", region: "unitedstates", diet: "meat:beef", emoji: "🥩", match: ["smoky", "meat"], why: "14 hours of smoke, salt and patience. Slow food at its most serious." },
  { dish: "Grilled branzino", yt: "https://www.youtube.com/watch?v=nkJxV-jK00E", from: "The Mediterranean · Europe", region: "europe", diet: "meat:seafood", emoji: "🐟", match: ["fresh", "mild"], why: "Whole fish, olive oil, lemon, herbs — coastal simplicity that needs nothing else." },
  { dish: "Pav bhaji", yt: "https://www.youtube.com/watch?v=A8V8jj7sbZs", from: "Mumbai · South Asia", region: "southasia", diet: "veg", emoji: "🍛", match: ["comfort", "street", "spice"], why: "Buttered, mashed, masala-rich vegetables with soft pav rolls — Mumbai's street comfort at full volume." },
  { dish: "Masala dosa", yt: "https://www.youtube.com/watch?v=lGEXiqeScWI", from: "South India · South Asia", region: "southasia", diet: "vegan", emoji: "🥞", match: ["crisp", "fermented", "tangy"], why: "A shattering-crisp fermented crepe around spiced potato — tang, crunch and comfort in one plate." },
  { dish: "Muhammara & warm pita", yt: "https://www.youtube.com/watch?v=QSukAbaLTJI", from: "Levant · Middle East", region: "middleeast", diet: "vegan", emoji: "🫓", match: ["tangy", "smoky", "spice"], why: "Roasted peppers and walnuts ground into a fiery-sweet dip — the boldest bowl on the mezze table." },
  { dish: "Chicken shawarma plate", yt: "https://www.youtube.com/watch?v=gphLFBby1Wo", from: "Levant · Middle East", region: "middleeast", diet: "meat:chicken", emoji: "🌯", match: ["smoky", "spice", "street"], why: "Spit-roasted and shaved thin, with garlic toum and pickles — the great wrap, plated." },
  { dish: "Party jollof rice", yt: "https://www.youtube.com/watch?v=AJbQP6_0dVM", from: "West Africa · Africa", region: "africa", diet: "meat:chicken", emoji: "🍚", match: ["rice", "smoky", "spice"], why: "Tomato-rich rice with the famous smoky bottom — the centrepiece of every West African party." },
  { dish: "Ethiopian beyaynetu", yt: "https://www.youtube.com/watch?v=JT1crJ0cIII", from: "Ethiopia · Africa", region: "africa", diet: "vegan", emoji: "🫓", match: ["fermented", "spice", "fresh"], why: "A rainbow of lentil, chickpea and vegetable wots over tangy injera — a whole feast on one bread." },
  { dish: "Arepas con queso", yt: "https://www.youtube.com/watch?v=6CwEO-1uh4c", from: "Venezuela · Latin America", region: "latinamerica", diet: "veg", emoji: "🫓", match: ["comfort", "street", "crisp"], why: "Griddled corn cakes with a molten cheese middle — crisp outside, soft within." },
  { dish: "Nashville hot chicken", yt: "https://www.youtube.com/watch?v=jNG9O2GVnHI", from: "Tennessee · United States", region: "unitedstates", diet: "meat:chicken", emoji: "🍗", match: ["spice", "comfort", "crisp"], why: "Fried chicken dredged in cayenne oil, cooled with pickles and white bread — a controlled burn." },
  { dish: "Seekh kebab, Deccan style", yt: "https://www.youtube.com/watch?v=6QfGRg3jfqw", from: "Hyderabad", region: "hyderabad", diet: "meat:lamb", emoji: "🔥", match: ["smoky", "spice", "deccan", "meat"], why: "Hand-minced, coal-smoked, unapologetically spiced — home turf, perfected." },
  { dish: "Salmon sashimi & chirashi bowl", yt: "https://www.youtube.com/watch?v=k-LAp5J9lqM", from: "Japan · East Asia", region: "eastasia", diet: "meat:fish", raw: true, emoji: "🍣", match: ["fresh", "adventure"], why: "Raw salmon over seasoned rice — freshness you can taste, knife work you can see." },
  { dish: "Tuna tartare", yt: "https://www.youtube.com/watch?v=yaOYNFLSAMQ", from: "The Mediterranean · Europe", region: "europe", diet: "meat:fish", raw: true, emoji: "🐟", match: ["fresh", "adventure"], why: "Hand-cut raw tuna, citrus and olive oil — the sea, uncooked and unbothered." },
  { dish: "Beef carpaccio", yt: "https://www.youtube.com/watch?v=eCX34lm3B18", from: "Italy · Europe", region: "europe", diet: "meat:beef", raw: true, emoji: "🥩", match: ["fresh", "classic"], why: "Beef shaved to silk with lemon and parmesan — raw, but dressed like royalty." },
  { dish: "Ceviche clásico", yt: "https://www.youtube.com/watch?v=fw4ZaeDWxaw", from: "Peru · Latin America", region: "latinamerica", diet: "meat:fish", raw: true, emoji: "🍋", match: ["fresh", "tangy"], why: "Raw fish 'cooked' in lime and chilli — bright, cold and electric." },
  { dish: "Gazpacho", yt: "https://www.youtube.com/watch?v=CsHD_1ozBnA", from: "Spain · Europe", region: "europe", diet: "vegan", emoji: "🍅", match: ["fresh", "tangy", "soup"], why: "Andalusia's chilled tomato soup — summer, blended and served ice-cold." },
  { dish: "Borscht", yt: "https://www.youtube.com/watch?v=-RjawJ8LImM", from: "Eastern Europe", region: "europe", diet: "vegan", emoji: "🥣", match: ["tangy", "home", "soup"], why: "Beetroot soup with real tang — earthy, vivid and warming." },
  { dish: "Harira", yt: "https://www.youtube.com/watch?v=NCh2MTCAilQ", from: "Morocco · Africa", region: "africa", diet: "vegan", emoji: "🍲", match: ["soup", "home"], why: "Tomato, lentil and chickpea soup — Morocco's bowl of welcome." },
  { dish: "Ajo blanco", yt: "https://www.youtube.com/watch?v=I5VEZtPV744", from: "Spain · Europe", region: "europe", diet: "vegan", emoji: "🧄", match: ["creamy", "fresh", "soup"], why: "Chilled almond-and-garlic soup, centuries old — gazpacho's pale, creamy ancestor." },
  { dish: "Gado gado", yt: "https://www.youtube.com/watch?v=_wIVmPSotow", from: "Indonesia · Southeast Asia", region: "eastasia", diet: "vegan", emoji: "🥜", match: ["creamy", "street"], why: "Blanched vegetables and tofu under a warm peanut sauce blanket." },
  { dish: "Sicilian caponata", yt: "https://www.youtube.com/watch?v=6MxrNcnq93M", from: "Sicily · Europe", region: "europe", diet: "vegan", emoji: "🍆", match: ["tangy", "home"], why: "Aubergine in sweet-sour tomato — Sicily's agrodolce on a plate." },
  { dish: "Phở", yt: "https://www.youtube.com/watch?v=JPBwT90d8RA", from: "Vietnam · Southeast Asia", region: "eastasia", diet: "meat:beef", emoji: "🍜", match: ["soup", "fresh", "home"], why: "Star-anise beef broth, herbs and rice noodles — a hug with a squeeze of lime." },
  { dish: "Tom yum", yt: "https://www.youtube.com/watch?v=Ml4d50BIYIo", from: "Thailand · Southeast Asia", region: "eastasia", diet: "meat:seafood", emoji: "🍤", match: ["soup", "tangy", "spice"], why: "Hot-and-sour prawn soup — lemongrass, galangal and a chilli kick." },
  { dish: "Tom kha gai", yt: "https://www.youtube.com/watch?v=i1U5pmVzJqA", from: "Thailand · Southeast Asia", region: "eastasia", diet: "meat:chicken", emoji: "🥥", match: ["soup", "creamy", "tangy"], why: "Chicken in coconut-galangal broth — tom yum's gentler, creamier sibling." },
  { dish: "French onion soup", yt: "https://www.youtube.com/watch?v=8CqWIntIDlQ", from: "France · Europe", region: "europe", diet: "veg", emoji: "🧅", match: ["soup", "creamy", "classic"], why: "Onions cooked to jam under a molten cheese crust — patience, rewarded." },
  { dish: "Greek salad", yt: "https://www.youtube.com/watch?v=0OMOamBjd48", from: "Greece · Europe", region: "europe", diet: "veg", emoji: "🥗", match: ["fresh", "tangy"], why: "Tomato, cucumber, olives and a slab of feta — no lettuce, no apologies." },
  { dish: "New England clam chowder", yt: "https://www.youtube.com/watch?v=UUlfKJ9M_pQ", from: "New England · United States", region: "unitedstates", diet: "meat:seafood", emoji: "🦪", match: ["soup", "creamy"], why: "Clams and potato in a creamy bowl built for cold harbours." },
  { dish: "Pozole", yt: "https://www.youtube.com/watch?v=HhaxbsEL0RM", from: "Mexico · Latin America", region: "latinamerica", diet: "meat:chicken", emoji: "🍲", match: ["soup", "home", "spice"], why: "Hominy stew crowned at the table with radish, lime and crunch." },
  { dish: "Feijoada", yt: "https://www.youtube.com/watch?v=eS5_wWS0IDc", from: "Brazil · Latin America", region: "latinamerica", diet: "meat:pork", emoji: "🫘", match: ["home", "meat"], why: "Black beans and pork, simmered for hours — Brazil's Saturday ritual." },
  { dish: "Bunny chow", yt: "https://www.youtube.com/watch?v=bOhddTWSJPQ", from: "Durban · Africa", region: "africa", diet: "meat:chicken", emoji: "🍞", match: ["spice", "street"], why: "Curry served inside a hollowed loaf — Durban's edible bowl." },
  { dish: "Doro wat", yt: "https://www.youtube.com/watch?v=6QjW6QWXxD4", from: "Ethiopia · Africa", region: "africa", diet: "meat:chicken", emoji: "🍗", match: ["spice", "home"], why: "Chicken braised in berbere and browned onion, eaten with injera." },
  { dish: "Bánh mì", yt: "https://www.youtube.com/watch?v=7gL-vCsDtkE", from: "Vietnam · Southeast Asia", region: "eastasia", diet: "meat:pork", emoji: "🥖", match: ["fresh", "street"], why: "Crisp baguette, pâté, pickles and herbs — two food cultures in one bite." },
  { dish: "Coq au vin", yt: "https://www.youtube.com/watch?v=2PSW4AiktyA", from: "France · Europe", region: "europe", diet: "meat:chicken", alc: true, emoji: "🍷", match: ["classic", "home"], why: "Chicken braised in red wine until the sauce turns to velvet." },
  { dish: "Boeuf bourguignon", yt: "https://www.youtube.com/watch?v=Mx3rD6LKCbQ", from: "France · Europe", region: "europe", diet: "meat:beef", alc: true, emoji: "🍲", match: ["classic", "creamy"], why: "Beef slow-cooked in Burgundy wine — France's deepest stew." },
  { dish: "Beer-battered fish & chips", yt: "https://www.youtube.com/watch?v=vNb7gj9VFJo", from: "Britain · Europe", region: "europe", diet: "meat:fish", alc: true, emoji: "🍺", match: ["street", "classic"], why: "Crisp beer batter, soft fish, salt and vinegar — seaside law." },
  { dish: "Tiramisu", yt: "https://www.youtube.com/watch?v=NwZMODDf-WI", from: "Italy · Europe", region: "europe", diet: "veg", alc: true, emoji: "🍰", match: ["sweet", "creamy", "coffee"], why: "Espresso-soaked layers under mascarpone clouds — pick-me-up, literally." },
  { dish: "Maafe", yt: "https://youtu.be/yHovQCzeUP0", from: "West Africa", region: "africa", diet: "vegan", emoji: "🥜", match: ["creamy", "home"], why: "Groundnut stew — peanuts simmered into a rich, savoury sauce over rice." },
  { dish: "Fesenjān", yt: "https://www.youtube.com/watch?v=opJpBLTr8a0", from: "Persia · Middle East", region: "middleeast", diet: "meat:chicken", emoji: "🍗", match: ["tangy", "sweet"], why: "Chicken in walnut-and-pomegranate sauce — dark, sweet, sour." },
  { dish: "Khachapuri", yt: "https://www.youtube.com/watch?v=YmpZlbUT5XA", from: "Georgia · Europe", region: "europe", diet: "veg", emoji: "🧀", match: ["creamy", "classic"], why: "A boat of molten cheese with a yolk in the middle — tear, dip, repeat." },
  { dish: "Okonomiyaki", yt: "https://www.youtube.com/watch?v=f2IEoi7Gu1U", from: "Osaka · East Asia", region: "eastasia", diet: "meat:pork", emoji: "🥞", match: ["street", "adventure"], why: "Savoury cabbage pancake off the grill, lacquered and dancing with bonito." },
  { dish: "Curry laksa", yt: "https://www.youtube.com/watch?v=iRzdTGe2vqc", from: "Malaysia · Southeast Asia", region: "eastasia", diet: "meat:seafood", emoji: "🍜", match: ["soup", "spice", "creamy"], why: "Coconut curry broth, noodles and seafood — a whole market in one bowl." },
  { dish: "Tonkotsu ramen", yt: "https://www.youtube.com/watch?v=Pln23pOMNlU", from: "Japan · East Asia", region: "eastasia", diet: "meat:pork", emoji: "🍜", match: ["soup", "noodle", "creamy"], why: "Pork broth boiled to milkiness — ramen at its richest." },
  { dish: "Moussaka", yt: "https://www.youtube.com/watch?v=m1sJNFln-7E", from: "Greece · Europe", region: "europe", diet: "meat:lamb", emoji: "🍆", match: ["creamy", "home"], why: "Aubergine and spiced lamb under a béchamel blanket." },
  { dish: "Goulash", yt: "https://www.youtube.com/watch?v=qPBJ6dRkv58", from: "Hungary · Europe", region: "europe", diet: "meat:beef", emoji: "🥘", match: ["home", "spice"], why: "Paprika beef stew — deep red, slow and warming." },
  { dish: "Aguachile", yt: "https://www.youtube.com/watch?v=y5JWgfHv40E", from: "Sinaloa · Latin America", region: "latinamerica", diet: "meat:seafood", raw: true, emoji: "🍤", match: ["fresh", "tangy", "spice"], why: "Shrimp in lime-and-chilli water — ceviche's fiercer cousin." },
  { dish: "Tacos al pastor", yt: "https://www.youtube.com/watch?v=WpCJkecTcxg", from: "Mexico · Latin America", region: "latinamerica", diet: "meat:pork", emoji: "🌮", match: ["street", "smoky"], why: "Marinated pork shaved off the trompo, pineapple on top." },
  { dish: "Pupusas", yt: "https://www.youtube.com/watch?v=BU77zV4xrXo", from: "El Salvador · Latin America", region: "latinamerica", diet: "veg", emoji: "🫓", match: ["street", "creamy"], why: "Stuffed corn cakes with curtido crunch and salsa." },
  { dish: "Jerk chicken", yt: "https://www.youtube.com/watch?v=Q4ku2YHVJWI", from: "Jamaica · The Caribbean", region: "latinamerica", diet: "meat:chicken", emoji: "🍗", match: ["spice", "smoky"], why: "Allspice and Scotch-bonnet fire, smoked low over pimento wood." },
  { dish: "Piri piri chicken", yt: "https://www.youtube.com/watch?v=gC8voPWJV9U", from: "Mozambique · Africa", region: "africa", diet: "meat:chicken", emoji: "🌶️", match: ["spice", "smoky"], why: "Flame-grilled chicken under bird's-eye chilli sauce." },
  { dish: "Chicken tagine", yt: "https://www.youtube.com/watch?v=QIPtx_t4_KE", from: "Morocco · Africa", region: "africa", diet: "meat:chicken", emoji: "🍋", match: ["home", "tangy"], why: "Slow-cooked with preserved lemon and olives — Morocco's signature pot." },
  { dish: "Bobotie", yt: "https://www.youtube.com/watch?v=WW-PDbGJTBY", from: "South Africa", region: "africa", diet: "meat:beef", emoji: "🍮", match: ["sweet", "home"], why: "Cape Malay spiced mince baked under a golden custard top." },
  { dish: "Som tam", yt: "https://www.youtube.com/watch?v=phn9ed4_Imo", from: "Thailand · Southeast Asia", region: "eastasia", diet: "meat:seafood", emoji: "🥒", match: ["fresh", "tangy", "spice"], why: "Green papaya pounded with lime, chilli and dried shrimp — sweet-sour-fire." },
  { dish: "Khao soi", yt: "https://www.youtube.com/watch?v=X50pWy7WAXo", from: "Chiang Mai · Southeast Asia", region: "eastasia", diet: "meat:chicken", emoji: "🍜", match: ["soup", "creamy", "spice"], why: "Curry noodle soup with a crisp noodle crown." },
  { dish: "Butter chicken", yt: "https://www.youtube.com/watch?v=VHfhCXkJh34", from: "Delhi · South Asia", region: "southasia", diet: "meat:chicken", emoji: "🍛", match: ["creamy", "classic"], why: "Tandoori chicken folded into tomato-butter silk." },
  { dish: "Nihari", yt: "https://www.youtube.com/watch?v=KYR-wx44Pw4", from: "Old Delhi · South Asia", region: "southasia", diet: "meat:beef", emoji: "🍖", match: ["spice", "home"], why: "Beef shank braised for hours in a deep, dark gravy." },
  { dish: "Haleem", yt: "https://www.youtube.com/watch?v=mewkdzt04v0", from: "Hyderabad", region: "hyderabad", diet: "meat:beef", emoji: "🍲", match: ["home", "spice"], why: "Wheat, lentils and beef pounded to silk — Hyderabad's patience dish." },
  { dish: "Smash burger", yt: "https://www.youtube.com/watch?v=GC1e2fK4PFk", from: "United States", region: "unitedstates", diet: "meat:beef", emoji: "🍔", match: ["classic", "meat"], why: "Lacy crisp edges, molten cheese, soft bun — the diner, perfected." },
  { dish: "Lobster roll", yt: "https://www.youtube.com/watch?v=3llW37YhBu0", from: "Maine · United States", region: "unitedstates", diet: "meat:seafood", emoji: "🦞", match: ["fresh", "creamy"], why: "Sweet lobster piled into a buttered, toasted roll." },
  { dish: "Poutine", yt: "https://www.youtube.com/watch?v=FJONxxDPUdU", from: "Québec · Canada", region: "unitedstates", diet: "veg", emoji: "🍟", match: ["creamy", "classic"], why: "Fries, gravy and squeaky cheese curds — Québec's gift to the world." }
];
function meterLabel(kind, pct) {
  if (kind === "spice") return pct >= 66 ? "Chilli chaser" : pct >= 33 ? "Warm & balanced" : "Gentle palate";
  if (kind === "sweet") return pct >= 66 ? "Serious sweet tooth" : pct >= 33 ? "Sweet in moderation" : "Savoury soul";
  if (kind === "smoky") return pct >= 66 ? "Smoke chaser" : pct >= 33 ? "Kissed by smoke" : "Smoke-free zone";
  if (kind === "tangy") return pct >= 66 ? "Tang hunter" : pct >= 33 ? "Bright & balanced" : "Low-acid soul";
  if (kind === "creamy") return pct >= 66 ? "Rich & indulgent" : pct >= 33 ? "Comfortably creamy" : "Light & lean";
  if (kind === "fresh") return pct >= 66 ? "Fresh-first palate" : pct >= 33 ? "Fresh accents" : "Cooked & cosy";
  if (kind === "classic") return pct >= 66 ? "Tradition keeper" : pct >= 33 ? "Classic-leaning" : "Novelty seeker";
  return pct >= 66 ? "Fearless taster" : pct >= 33 ? "Curious explorer" : "Creature of habit";
}
let altRecsCache = [];
let whyDebugCache = {}; // per-dish reason audit trail (sim/QA verification)

/* ——— Flavour axes (v19, Aizaz's twelve distinctions) ———
   Twelve bipolar flavour axes. Every option in the bank is assigned axis
   signals from its existing tags, its text (keyword scan, negation-aware),
   and a boost when its question is literally about that axis. Every dish
   gets the same treatment (match tags + name/story keywords + cuisine
   priors), so user and dish live in ONE shared vector space — the match
   is then analytical: how strongly does this dish express the poles this
   user actually leans toward? */
const AXES = [
  { id: "salt", emoji: "🧂", name: "Salt & Umami", hi: "Savoury seeker", lo: "Sodium minimalist" },
  { id: "aromatics", emoji: "🧅", name: "Aromatics & Garlic", hi: "Garlic lover", lo: "Mild & subtle" },
  { id: "herbs", emoji: "🌿", name: "Herbs & Botanicals", hi: "Herbivore kick", lo: "Simple seasoning" },
  { id: "earthy", emoji: "🌾", name: "Earthiness", hi: "Deep & earthy", lo: "Clean & crisp" },
  { id: "warmspice", emoji: "🫚", name: "Warm spices", hi: "Spice route enthusiast", lo: "Subtle warmth" },
  { id: "crunch", emoji: "🥨", name: "Crunch & Crisp", hi: "Texture hunter", lo: "Soft & smooth" },
  { id: "oil", emoji: "🫒", name: "Oil & Richness", hi: "Decadent & silky", lo: "Clean & dry" },
  { id: "funk", emoji: "🧀", name: "Fermentation & Funk", hi: "Flavor adventurer", lo: "Fresh & direct" },
  { id: "vegprotein", emoji: "🥦", name: "Veg-forward vs Protein", hi: "Plant-centric", lo: "Meat & hearty" },
  { id: "soup", emoji: "🍲", name: "Soup & Broth", hi: "Sip & savour", lo: "Dry & crisp" },
  { id: "pairing", emoji: "🍷", name: "Pairing & Alcohol", hi: "Wine & dine", lo: "Mocktail mindset" },
  { id: "portion", emoji: "🍽️", name: "Portion & Style", hi: "Feast & share", lo: "Light bites" }
];
const TAG_AXIS = { spice: { warmspice: .7, salt: .15 }, mild: { warmspice: -.7, aromatics: -.4 }, tangy: { funk: .3 }, creamy: { oil: .9 }, smoky: { earthy: .6, warmspice: .15 }, fresh: { earthy: -.5, funk: -.5, herbs: .3 }, crisp: { crunch: 1 }, soup: { soup: 1 }, meat: { vegprotein: -.9, salt: .2 }, veg: { vegprotein: .8 }, healthy: { vegprotein: .3, oil: -.4, portion: -.2 }, street: { portion: .3 }, coffee: { earthy: .3, aromatics: .2 }, chai: { warmspice: .5 }, adventure: { funk: .2 }, home: { portion: .2, soup: .15 }, classic: { portion: .15 } };
const AXIS_KEYWORDS = [
  ["garlic", "aromatics", 1], ["onion", "aromatics", .5], ["ginger", "aromatics", .4],
  ["coriander|cilantro|mint|basil|dill|parsley|fenugreek|methi|curry leaves|herbs", "herbs", .9],
  ["mushroom|truffle|beet|whole spices", "earthy", .7],
  ["garam masala|masala|cinnamon|cardamom|clove|cumin|nutmeg|star anise", "warmspice", .8],
  ["kimchi|pickl|ferment|aged|miso|soy sauce|fish sauce|blue cheese|parmesan", "funk", .8],
  ["yogurt|curd|raita", "funk", .4],
  ["crispy|crisp|crunch|crackling", "crunch", .8], ["fried", "crunch", .5], ["fried", "oil", .3],
  ["ghee|buttery|butter|cream|fatty|tallow|schmaltz|dripping", "oil", .7],
  ["soup|broth|shorba", "soup", .7], ["stew", "soup", .4],
  ["wine|beer|rum|bourbon", "pairing", 1],
  ["salad", "earthy", -.3], ["salad", "vegprotein", .3],
  ["smoked|charred|tandoor|grilled", "earthy", .3],
  ["umami|savoury|savory", "salt", .6]
];
const AXIS_Q_BOOST = { "pal-01": { soup: 2.5 }, "pal-08": { herbs: 2.5 }, "pal-15": { funk: 2.5 }, "bri-10": { funk: 2.5 }, "pal-17": { oil: 2.5 }, "glo-21": { oil: 2.5 }, "pal-02": { oil: 2 }, "pal-07": { salt: 2.5 }, "glo-11": { salt: 2.5 }, "pal-05": { crunch: 2 }, "op-texture": { crunch: 2 }, "glo-04": { crunch: 1.5 }, "pal-19": { warmspice: 2 }, "op-spice": { warmspice: 1.5 }, "glo-meatrole": { vegprotein: 2.5 }, "glo-alc": { pairing: 3 }, "pal-03": { funk: 1.5 }, "pal-09": { earthy: 1.5 }, "pal-13": { funk: 1.5 }, "glo-24": { portion: 1.5 }, "op-format": { portion: 2 }, "hyd-08": { soup: 2 }, "afr-peppersoup": { soup: 2 }, "pal-16": { vegprotein: 1.5 }, "hyd-aroma": { aromatics: 2 }, "sou-aroma": { aromatics: 2 }, "asi-aroma": { aromatics: 2 }, "mid-aroma": { aromatics: 2 }, "eur-aroma": { aromatics: 2 }, "afr-aroma": { aromatics: 2 }, "lat-aroma": { aromatics: 2 }, "ame-aroma": { aromatics: 2 } };
const AXIS_NEG = /^(no|none|never|not|keep|skip|without)\b|off my plate|not for me|not my thing|ruins|deal-breaker|away from/i;
function axisSignalsFor(q, o) {
  const sig = {};
  const add = (a, v) => { if (v) sig[a] = (sig[a] || 0) + v; };
  (o.tags || []).forEach(t => { const m = TAG_AXIS[t]; if (m) Object.entries(m).forEach(([a, v]) => add(a, v)); });
  const text = (o.t || "").toLowerCase();
  const neg = AXIS_NEG.test(text);
  AXIS_KEYWORDS.forEach(([src, a, v]) => { if (new RegExp(src).test(text)) add(a, neg ? -v : v); });
  const boost = AXIS_Q_BOOST[q.id];
  if (boost) Object.keys(sig).forEach(a => { if (boost[a]) sig[a] *= boost[a]; });
  return sig;
}
const REGION_AXIS = { eastasia: { salt: .5, herbs: .3, soup: .4, funk: .3 }, southasia: { warmspice: .6, aromatics: .5, oil: .3 }, hyderabad: { warmspice: .6, aromatics: .5, oil: .3 }, middleeast: { herbs: .4, aromatics: .3, earthy: .2 }, europe: { oil: .3, funk: .3 }, unitedstates: { oil: .3, crunch: .3, portion: .4 }, africa: { earthy: .4, warmspice: .4, soup: .2 }, latinamerica: { herbs: .3, crunch: .2, aromatics: .3 } };
function dishAxesFor(r) {
  const sig = {};
  const add = (a, v) => { if (v) sig[a] = (sig[a] || 0) + v; };
  (r.match || []).forEach(t => { const m = TAG_AXIS[t]; if (m) Object.entries(m).forEach(([a, v]) => add(a, v)); });
  const text = (r.dish + " " + (r.why || "")).toLowerCase();
  AXIS_KEYWORDS.forEach(([src, a, v]) => { if (new RegExp(src).test(text)) add(a, v * 0.8); });
  const rp = REGION_AXIS[r.region]; if (rp) Object.entries(rp).forEach(([a, v]) => add(a, v));
  const out = {};
  AXES.forEach(ax => { out[ax.id] = Math.max(0, Math.min(1, (sig[ax.id] || 0) / 2)); });
  return out;
}

function computeResult(s) {
  const tagCount = {};
  const meters = { spice: [0, 0], sweet: [0, 0], adv: [0, 0] };
  const tagMeters = { smoky: 0, tangy: 0, creamy: 0, fresh: 0, classic: 0 };
  let tagDenom = 0;
  const detail = [];
  let wSum = 0, wCount = 0, rawOk = false, alcOk = false, eggOk = false;
  const axisPos = {}, axisNeg = {}; // per-axis evidence toward the hi / lo poles
  const pickRefs = []; // every positive pick with its signals — the raw material for justified recommendation reasons
  const whyRefUse = {}; // how often each pick has already anchored a reason on this results list (soft cap: rotate references)
  s.order.forEach(qid => {
    const a = s.answers[qid]; if (!a) return;
    const q = QBANK_BY_ID[qid]; if (!q) return;
    const picks = (Array.isArray(a.o) ? a.o : [a.o]).map(i => q.options[i]).filter(Boolean);
    const w = a.w || 1;
    wSum += w; wCount++;
    picks.forEach((opt, pi) => {
      // Ranked picks: #1 counts fully, #2 counts half. Dislike picks count against.
      const mult = q.hate ? -1 : (a.r ? 1 / (pi + 1) : 1);
      // Reference pool for recommendation reasons: real, committal picks
      // only. Temperature and the meats/protein openers are dials, not
      // flavours (the temp pick carries 'classic'/'home' tags and poisoned
      // every classic reference); non-committal options ("it depends…")
      // justify nothing. The spice/sweet dials may anchor ONLY their own
      // dimension — the heat level is a legitimate reference, a flavour
      // free-for-all is not.
      if (!q.hate && mult > 0 && !/^Nothing|^None of these/i.test(opt.t || "")
          && !["op-temp", "op-meats", "op-meats-halal", "op-protein-veg", "op-protein-vegan"].includes(qid)
          && !/it (truly )?depends|no preference|not (sure|picky)|don'?t mind|anything (goes|works)/i.test(opt.t || "")) {
        let pAxes = axisSignalsFor(q, opt), pTags = (opt.tags || []).filter(t => t !== "rawok" && t !== "alcok" && t !== "eggok");
        if (qid === "op-spice") { pAxes = { warmspice: pAxes.warmspice || 0 }; pTags = pTags.filter(t => t === "spice"); }
        if (qid === "op-sweet") { pAxes = {}; pTags = pTags.filter(t => t === "sweet"); }
        pickRefs.push({ text: opt.t, qid, w, mult, rank1: !!a.r && pi === 0, axes: pAxes, tags: pTags });
      }
      if ((opt.tags || []).includes("rawok")) rawOk = true; // user opened the raw league (sashimi, tartare, ceviche…)
      if ((opt.tags || []).includes("alcok")) alcOk = true; // user is fine with alcohol-cooked dishes
      if ((opt.tags || []).includes("eggok")) eggOk = true; // vegetarian who eats eggs
      (opt.tags || []).forEach(t => { if (t !== "rawok" && t !== "alcok" && t !== "eggok") tagCount[t] = (tagCount[t] || 0) + w * mult; });
      Object.entries(axisSignalsFor(q, opt)).forEach(([a, v]) => {
        const c = v * w * mult;
        if (c > 0) axisPos[a] = (axisPos[a] || 0) + c; else axisNeg[a] = (axisNeg[a] || 0) - c;
      });
      if (!q.hate) {
        [["spice", "spice"], ["sweet", "sweet"], ["adv", "adv"]].forEach(([f, k]) => {
          if (typeof opt[f] === "number") { meters[k][0] += opt[f] * w * Math.abs(mult); meters[k][1] += w * Math.abs(mult); }
        });
        const aw = w * Math.abs(mult); tagDenom += aw;
        (opt.tags || []).forEach(t => { if (t in tagMeters) tagMeters[t] += aw; });
      }
    });
    detail.push({ qid, q: q.q, deck: q.deck, picks: picks.map(p => p.t), weight: w });
  });
  // Skipped questions still say something (Aizaz, 2026-10-07): dodging a
  // topic usually means it isn't central to this palate. Apply a small
  // negative weight to each flavour tag the skipped question would have
  // explored — a fraction of one real pick, capped per tag — so skips shade
  // the profile without steering it.
  const SKIP_W = 0.35, SKIP_CAP = 1.4;
  const skipTags = {};
  Object.keys(s.skipped || {}).forEach(qid => {
    const q = QBANK_BY_ID[qid]; if (!q) return;
    const tags = new Set();
    q.options.forEach(o => (o.tags || []).forEach(t => { if (t !== "rawok" && t !== "alcok" && t !== "eggok") tags.add(t); }));
    tags.forEach(t => { skipTags[t] = Math.min(SKIP_CAP, (skipTags[t] || 0) + SKIP_W); });
  });
  Object.entries(skipTags).forEach(([t, v]) => { tagCount[t] = (tagCount[t] || 0) - v; });
  // Skips shade the axes the same gentle way: the strongest signal each
  // skipped question would have explored counts a little against that pole.
  const skipAxis = {};
  Object.keys(s.skipped || {}).forEach(qid => {
    const q = QBANK_BY_ID[qid]; if (!q) return;
    const best = {};
    q.options.forEach(o => Object.entries(axisSignalsFor(q, o)).forEach(([a, v]) => { if (v > 0) best[a] = Math.max(best[a] || 0, v); }));
    Object.entries(best).forEach(([a, v]) => { skipAxis[a] = Math.min(SKIP_CAP, (skipAxis[a] || 0) + SKIP_W * v); });
  });
  Object.entries(skipAxis).forEach(([a, v]) => { axisNeg[a] = (axisNeg[a] || 0) + v; });
  // Loved dishes (v22): the user's own favourites are revealed-preference
  // evidence. Each contributes its flavour tags (+1), its axis signals
  // (from tags + an ingredient keyword scan, weight 1.5), and a reference
  // entry so recommendation reasons can cite the dish by name.
  const lovedNamesNorm = [];
  (Array.isArray(s.loves) ? s.loves : []).forEach(id => {
    const d = (s.lovesData || {})[id];
    if (!d || !d.n) return;
    lovedNamesNorm.push(d.n.toLowerCase().replace(/[^a-z0-9]/g, ""));
    (d.f || []).forEach(t => { tagCount[t] = (tagCount[t] || 0) + 1; });
    // v23: picks beyond the shipped tag head carry no ingredient record —
    // scan the dish NAME for flavour keywords instead ('Garlic Butter
    // Shrimp' still testifies to garlic + richness) so no pick is inert.
    const sigText = (d.i && d.i.length) ? d.i.join(" ") : (d.n || "");
    const sig = axisSignalsFor({ id: "loves" }, { t: sigText, tags: d.f || [] });
    Object.entries(sig).forEach(([a, v]) => {
      const c = v * 1.5;
      if (c > 0) axisPos[a] = (axisPos[a] || 0) + c; else axisNeg[a] = (axisNeg[a] || 0) - c;
    });
    pickRefs.push({ text: d.n, qid: "loves", w: 3, mult: 1, rank1: false, love: true, axes: sig, tags: (d.f || []).slice() });
  });
  // The user's flavour-axis profile: position between the poles (pct toward
  // the hi pole) + how much evidence backs it (strength). Top 10 by
  // strength is what the results page shows.
  const axes = AXES.map(ax => {
    const p = axisPos[ax.id] || 0, n = axisNeg[ax.id] || 0, tot = p + n;
    const share = tot ? p / tot : 0.5;
    return { id: ax.id, emoji: ax.emoji, name: ax.name, hi: ax.hi, lo: ax.lo, pct: Math.round(100 * share), strength: Math.round(tot * 10) / 10, lean: tot < 0.5 ? "balanced" : (share >= 0.58 ? "hi" : (share <= 0.42 ? "lo" : "balanced")) };
  }).sort((a, b) => b.strength - a.strength);
  const leanOf = {};
  axes.forEach(a => { leanOf[a.id] = a.strength >= 1 ? (a.pct - 50) / 50 : 0; });
  const posTags = Object.entries(tagCount).filter(([, c]) => c > 0).sort((a, b) => b[1] - a[1]);
  const topTags = posTags.slice(0, 5).map(([t]) => t);
  const affinities = {};
  posTags.slice(0, 8).forEach(([t, c]) => { affinities[t] = Math.round(c * 10) / 10; });
  // Aversions come from every "dislike" question (incl. the hard-no's opener).
  const aversions = [];
  s.order.forEach(qid => {
    const q = QBANK_BY_ID[qid]; const a = s.answers[qid];
    if (!q || !a || !q.hate) return;
    (Array.isArray(a.o) ? a.o : [a.o]).forEach(i => {
      const t = (q.options[i] || {}).t;
      if (t && !/^Nothing|^None of these/i.test(t) && !aversions.includes(t)) aversions.push(t);
    });
  });
  const meterPct = {};
  Object.entries(meters).forEach(([k, [sum, wt]]) => { meterPct[k] = wt ? Math.round(100 * sum / (3 * wt)) : 0; });
  Object.entries(tagMeters).forEach(([k, sum]) => { meterPct[k] = tagDenom ? Math.round(100 * sum / tagDenom) : 0; });
  // Recommendations: diet-safe, tag-matched, other regions first.
  const meats = chosenMeats(s);
  const ownRoots = [s.builtFor.roots, s.builtFor.roots2].filter(Boolean);
// — Recommendation scoring (v13 + v19 blend): strength × rarity tag score,
// blended with axis alignment plus an exploration bonus for out-of-roots dishes.
  const TAG_FREQ = {};
  QBANK.forEach(q => q.options.forEach(o => (o.tags || []).forEach(t => { TAG_FREQ[t] = (TAG_FREQ[t] || 0) + 1; })));
  const TAG_TOTAL = Object.values(TAG_FREQ).reduce((a, b) => a + b, 0) || 1;
  const rarity = (t) => Math.log2(1 + TAG_TOTAL / (TAG_FREQ[t] || TAG_TOTAL));
  const maxPos = Math.max(1, ...Object.values(tagCount));
  const dishScore = (r) => r.match.reduce((acc, t) => acc + ((tagCount[t] || 0) / maxPos) * rarity(t), 0) / Math.sqrt(r.match.length) + (ownRoots.includes(r.region) ? 0 : 0.35);
  // — Scoring v2 (v19): the tag score above is blended with AXIS ALIGNMENT
  // in the shared flavour space: a dish earns more when it strongly
  // expresses the poles this user leans toward (and loses when it expresses
  // the opposite poles). A small exploration bonus rewards out-of-roots
  // dishes that are strong on axes the user is still neutral about — the
  // doorway to flavours they haven't met yet.
  const dishAxesCache = {};
  RECS.forEach(r => { dishAxesCache[r.dish] = dishAxesFor(r); });
  const axisAlign = (r) => { const da = dishAxesCache[r.dish]; let s2 = 0; AXES.forEach(ax => { s2 += (leanOf[ax.id] || 0) * (da[ax.id] || 0); }); return s2; };
  const exploreBonus = (r) => {
    if (ownRoots.includes(r.region)) return 0;
    const da = dishAxesCache[r.dish]; let b = 0;
    AXES.forEach(ax => { if (Math.abs(leanOf[ax.id] || 0) < 0.25 && (da[ax.id] || 0) > 0.6) b += 0.06; });
    return Math.min(0.25, b);
  };
  const axisMatchLabels = (r) => {
    const da = dishAxesCache[r.dish];
    return AXES.map(ax => {
      const lean = leanOf[ax.id] || 0, dv = da[ax.id] || 0;
      if (lean > 0.2 && dv > 0.45) return { label: ax.hi, wgt: lean * dv };
      if (lean < -0.2 && dv < 0.25) return { label: ax.lo, wgt: -lean * (1 - dv) };
      return null;
    }).filter(Boolean).sort((a, b) => b.wgt - a.wgt).slice(0, 2).map(x => x.label);
  };
  const dishScoreV2 = (r) => dishScore(r) + 0.55 * axisAlign(r) + exploreBonus(r);
  const scored = RECS
    .filter(r => optVisible(r, s.builtFor.diet, meats))
    .filter(r => !r.raw || rawOk) // raw dishes only for users who opened the raw league
    .filter(r => !r.alc || alcOk) // alcohol-cooked dishes only for users who opened that door
    .filter(r => !r.egg || s.builtFor.diet !== "vegetarian" || eggOk) // egg dishes: only no-egg vegetarians are filtered
    .filter(r => !aversions.some(av => av.length > 3 && r.dish.toLowerCase().includes(av.toLowerCase().split(" ")[0])))
    .map(r => ({ r, score: dishScoreV2(r), matched: r.match.filter(t => (tagCount[t] || 0) > 0).length, mtags: r.match.filter(t => (tagCount[t] || 0) > 0).sort((a, b) => ((tagCount[b] / maxPos) * rarity(b)) - ((tagCount[a] / maxPos) * rarity(a))) }))
    .sort((a, b) => b.score - a.score || b.matched - a.matched);
  const entryByDish = {};
  scored.forEach(e => { entryByDish[e.r.dish] = e; });
  // — Recommendation reasons (Aizaz, 2026-10-07, v21): every line is built
  // from REFERENCES to the user's own answers — 2–3 per dish, each naming a
  // food or level the user actually picked, on a dimension (a flavour axis
  // or a shared tag) where this dish genuinely resembles that pick: the
  // dish must express the pole strongly (or genuinely lack it, for lo-pole
  // claims) AND the referenced pick must express it strongly too. Anything
  // weaker is dropped rather than padded — a shorter honest line beats a
  // full fake one.
  const AXIS_SIM_HI = { salt: "Savoury and umami-rich", aromatics: "Big on garlic and aromatics", herbs: "Herb-loaded", earthy: "Deep and earthy", warmspice: "Warm-spiced and fragrant", crunch: "Properly crunchy", oil: "Rich and silky", funk: "Pleasantly funky", vegprotein: "Plant-forward", soup: "Brothy and sippable", pairing: "Made to pair with a drink", portion: "Feast-sized" };
  const AXIS_SIM_LO = { salt: "Lightly salted and clean", aromatics: "Gentle on the aromatics", herbs: "Simply seasoned", oil: "Clean, never heavy", funk: "Unfermented and straightforward", vegprotein: "Meat-led", soup: "Dry, not brothy" }; // lo-pole claims only where low axis value truly implies the words: no "crisp" from mere absence of earthiness, no "smooth" from absence of crunch
  const TAG_SIM = { spice: "Properly hot", smoky: "Smoky", creamy: "Creamy and rich", tangy: "Bright and tangy", fresh: "Fresh and bright", sweet: "Sweet-leaning", rice: "Rice at its heart", meat: "Deeply meaty", veg: "Vegetable-led", home: "Home-style", classic: "Classic at heart", street: "Street-stall style", adventure: "A step beyond the usual", healthy: "Light but satisfying", noodle: "Noodle-led", soup: "Brothy", biryani: "Layered and fragrant", comfort: "Pure comfort food", crisp: "Crisp-edged", fermented: "Fermented and tangy", cafe: "Café-style", chai: "Chai-time warm", coffee: "Coffee-deep", deccan: "Deccani at heart", seafood: "Seafood-led", egg: "Egg-rich" };
  const TAG_TO_AXIS = { spice: "warmspice", smoky: "earthy", creamy: "oil", soup: "soup", crisp: "crunch", fermented: "funk", tangy: "funk" };
  const whyYouFor = (r) => {
    const da = dishAxesCache[r.dish];
    const axisCands = (a, dir, minPick) => pickRefs
      .map(p => ({ p, v: (p.axes[a] || 0) * dir }))
      .filter(x => x.v >= minPick)
      .sort((x, y) => (y.v * y.p.mult * Math.min(y.p.w, 3)) - (x.v * x.p.mult * Math.min(x.p.w, 3)));
    const buildReasons = (minDvHi, minPick) => {
      const reasons = [];
      const usedAxes = new Set();
      AXES.forEach(ax => {
        const lean = leanOf[ax.id] || 0, dv = da[ax.id] || 0;
        if (ax.id === "vegprotein") { // never claim plant-forward/meat-led for a dish that isn't one
          if (lean > 0.15 && !(r.diet === "vegan" || r.diet === "veg" || (r.match || []).includes("veg"))) return;
          if (lean < -0.15 && !(String(r.diet).startsWith("meat") || (r.match || []).includes("meat"))) return;
        }
        if (lean > 0.15 && dv >= minDvHi) {
          const cands = axisCands(ax.id, 1, minPick);
          if (cands.length) { reasons.push({ score: lean * dv * Math.min(1.5, cands[0].v), key: "ax:" + ax.id, cands, short: AXIS_SIM_HI[ax.id], dishVal: dv, pickVal: cands[0].v }); usedAxes.add(ax.id); }
        } else if (lean < -0.15 && dv <= 0.22 && AXIS_SIM_LO[ax.id]) {
          const cands = axisCands(ax.id, -1, minPick);
          if (cands.length) { reasons.push({ score: -lean * (1 - dv) * Math.min(1.5, cands[0].v), key: "ax:" + ax.id, cands, short: AXIS_SIM_LO[ax.id], dishVal: dv, pickVal: cands[0].v }); usedAxes.add(ax.id); }
        }
      });
      const e = entryByDish[r.dish];
      if (e) e.mtags.forEach(t => {
        const short = TAG_SIM[t]; if (!short) return;
        const dom = TAG_TO_AXIS[t]; if (dom && usedAxes.has(dom)) return;
        const cands = pickRefs.filter(p => p.tags.includes(t)).map(p => ({ p, v: p.mult * Math.min(p.w, 3) })).sort((a, b) => b.v - a.v);
        if (cands.length) reasons.push({ score: 0.3 + ((tagCount[t] || 0) / maxPos) * rarity(t) * 0.3, key: "tag:" + t, cands, short, dishVal: (tagCount[t] || 0) / maxPos, pickVal: cands[0].v });
      });
      return reasons.sort((a, b) => b.score - a.score);
    };
    let reasons = buildReasons(0.5, 0.5);
    const chosen = [], usedRefs = new Set();
    const takeFrom = (list) => {
      for (const rsn of list) {
        if (chosen.length >= 3) break;
        if (chosen.some(c => c.key === rsn.key)) continue;
        const c = rsn.cands.find(x => !usedRefs.has(x.p.text) && (whyRefUse[x.p.text] || 0) < 2)
          || rsn.cands.find(x => !usedRefs.has(x.p.text))
          || (chosen.length < 2 ? rsn.cands[0] : null);
        if (!c) continue;
        usedRefs.add(c.p.text);
        whyRefUse[c.p.text] = (whyRefUse[c.p.text] || 0) + 1;
        chosen.push({ key: rsn.key, short: rsn.short, ref: c.p, dishVal: rsn.dishVal, pickVal: c.v });
      }
    };
    takeFrom(reasons);
    if (chosen.length < 2) { reasons = buildReasons(0.4, 0.35); takeFrom(reasons); } // one relaxed pass, still evidence-bound
    whyDebugCache[r.dish] = chosen.map(c => ({ key: c.key, ref: c.ref.text, refQid: c.ref.qid, dishVal: Math.round(c.dishVal * 100) / 100, pickVal: Math.round(c.pickVal * 100) / 100 }));
    if (!chosen.length) return "It lines up with the flavours you kept picking.";
    const clause = (c, i) => {
      const t = c.ref.text;
      if (t.length <= 36 && !t.includes(" — ")) { const art = /^(The|A|An)\s/.test(t) ? "" : "the "; return c.short + ", like " + art + t + " " + (c.ref.rank1 ? "you ranked #1" : c.ref.love ? "you love" : ((r.dish.length + i) % 2 ? "you picked" : "you chose")); }
      const tt = t.length > 80 ? t.slice(0, 77) + "…" : t;
      return c.short + (c.ref.love ? " — one of your favourites: '" : " — just like your pick: '") + tt + "'";
    };
    const parts = chosen.map(clause);
    const lc = (s) => s.charAt(0).toLowerCase() + s.slice(1);
    let body = parts[0];
    if (parts.length === 2) body = parts[0] + " — and " + lc(parts[1]);
    if (parts.length >= 3) body = parts[0] + "; " + lc(parts[1]) + " — and " + lc(parts[2]);
    return body + ".";
  };
  // Pure score order, no per-region quota: the best 12 matches win, wherever
  // in the world they come from. (15 read as a lot on the results page —
  // Aizaz, 2026-10-07.)
  // Never recommend back a dish the user already told us they love — they
  // know it; the list exists to widen their world, not echo it.
  const isLovedEcho = (dish) => {
    const dn = dish.toLowerCase().replace(/[^a-z0-9]/g, "");
    return lovedNamesNorm.some(ln => ln && (dn === ln || (ln.length >= 5 && dn.includes(ln)) || (dn.length >= 5 && ln.includes(dn))));
  };
  const freshPool = scored.filter(e => !isLovedEcho(e.r.dish));
  const pool = freshPool.length >= 12 ? freshPool : scored;
  const recs = [];
  pool.forEach(({ r }) => {
    if (recs.length >= 12 || recs.find(x => x.dish === r.dish)) return;
    recs.push(r);
  });
  const more = [];
  pool.forEach(({ r }) => {
    if (more.length >= 12 || recs.find(x => x.dish === r.dish) || more.find(x => x.dish === r.dish)) return;
    more.push(r);
  });
  const recObjs = recs.map(r => ({ dish: r.dish, from: r.from, why: r.why, yt: r.yt || "", axes: axisMatchLabels(r), whyYou: whyYouFor(r) }));
  altRecsCache = more.map(r => ({ dish: r.dish, from: r.from, why: r.why, yt: r.yt || "", axes: axisMatchLabels(r), whyYou: whyYouFor(r) }));
  return {
    email: sessionUser ? sessionUser.email : "",
    diet: s.builtFor.diet, roots: s.builtFor.roots, roots2: s.builtFor.roots2 || null, city: s.builtFor.city || "",
    topTags, affinities, aversions, meters: meterPct, axes: axes.slice(0, 10),
    avgConfidence: wCount ? +(wSum / wCount).toFixed(2) : 1,
    detail, recs: recObjs,
    completedAt: new Date().toISOString()
  };
}
function recCardsHtml(list, res) {
  return list.map(r =>
    `<div class="rec"><span class="r-emoji">${(RECS.find(x => x.dish === r.dish) || {}).emoji || "🍽️"}</span>
     <div><span class="r-from">${r.from.toUpperCase()}</span><strong>${r.dish}</strong><p>${r.why}</p>${r.whyYou ? `<p class="r-axes">${r.whyYou}</p>` : (r.axes && r.axes.length ? `<p class="r-axes">Matches your: ${r.axes.join(" · ")}</p>` : "")}${r.yt ? `<a class="r-find" target="_blank" rel="noopener" href="${r.yt}"><svg class="yt-logo" viewBox="0 0 28 20" aria-hidden="true"><path fill="#FF0000" d="M27.4 3.1c-.3-1.2-1.3-2.2-2.5-2.5C22.7 0 14 0 14 0S5.3 0 3.1.6C1.9.9.9 1.9.6 3.1.1 5.2 0 8.9 0 10s0 4.8.6 6.9c.3 1.2 1.3 2.2 2.5 2.5C5.3 20 14 20 14 20s8.7 0 10.9-.6c1.2-.3 2.2-1.3 2.5-2.5.5-2.1.6-6.9.6-6.9s0-4.8-.6-6.9z"/><path fill="#fff" d="M11.2 14.3V5.7l7.4 4.3z"/></svg>Watch it being made →</a> ` : ""}${res.city ? `<a class="r-find" target="_blank" rel="noopener" href="https://www.google.com/maps/search/${encodeURIComponent(r.dish + " near " + res.city)}">📍 Find it near you in ${res.city} →</a>` : ""}</div></div>`).join("");
}
let lastResult = null, recsAltShown = false;
function renderResults() {
  const res = st.result || computeResult(st);
  st.result = res;
  const strip = (s2) => s2.replace(/^\S+\s/, "");
  const labels = res.topTags.map(t => TAG_LABELS[t]).filter(Boolean);
  $("profileSummary").textContent = labels.length >= 2
    ? `In one line: ${strip(labels[0])} meets ${strip(labels[1]).toLowerCase()}. Here's the full picture:`
    : "Here's what your answers say about your palate:";
  const loveNames = (Array.isArray(st.loves) ? st.loves : []).map(id => (st.lovesData || {})[id]).filter(d => d && d.n).map(d => d.n);
  const ll = $("lovesLine");
  if (ll) { ll.hidden = !loveNames.length; ll.textContent = loveNames.length ? `❤️ Shaped by the dishes you love: ${loveNames.slice(0, 6).join(" · ")}${loveNames.length > 6 ? ` · +${loveNames.length - 6} more` : ""}` : ""; }
  lastResult = res; recsAltShown = false;
  const affLabels = Object.keys(res.affinities || {}).map(t => TAG_LABELS[t]).filter(Boolean).slice(0, 8);
  $("profileAffinities").innerHTML = affLabels.length ? `<h3 class="rec-title2">✨ Flavours you're drawn to</h3><div class="traits">${affLabels.map(l => `<span class="trait">${l}</span>`).join("")}</div>` : "";
  $("profileAversions").innerHTML = (res.aversions || []).length ? `<h3 class="rec-title2">🚫 Your hard no's</h3><div class="traits">${res.aversions.map(a => `<span class="trait no">${a}</span>`).join("")}</div><p class="neg-note">We will never match you with these.</p>` : "";
  const names = { spice: "🌶️ Heat level", sweet: "🍮 Sweet tooth", adv: "🧭 Adventurousness", smoky: "🔥 Smoke & char", tangy: "🍋 Tang & sour", creamy: "🥛 Rich & creamy", fresh: "🌿 Fresh & bright", classic: "💛 Comfort & classic" };
  $("profileMeters").innerHTML = Object.entries(res.meters).map(([k, pct]) =>
    `<div class="meter"><div class="mhead"><span>${names[k]}</span><span>${meterLabel(k, pct)}</span></div>
     <div class="track"><div class="fill" style="width:0%" data-w="${pct}"></div></div></div>`).join("");
  requestAnimationFrame(() => requestAnimationFrame(() => {
    document.querySelectorAll("#profileMeters .fill").forEach(f => { f.style.width = f.dataset.w + "%"; });
  }));
  const axEl = $("profileAxes");
  if (axEl) axEl.innerHTML = (res.axes && res.axes.length) ? `<h3 class="rec-title2">🧭 Your flavour axes — your top ${res.axes.length}</h3>` + res.axes.map(a =>
    `<div class="axis"><div class="a-head"><span>${a.emoji} ${a.name}</span><span class="a-lean">${a.lean === "hi" ? a.hi : a.lean === "lo" ? a.lo : "Balanced"}</span></div>` +
    `<div class="a-track"><span class="a-pole">${a.lo}</span><div class="a-bar"><div class="a-marker" style="left:${a.pct}%"></div></div><span class="a-pole">${a.hi}</span></div></div>`).join("") : "";
  $("profileNote").textContent = (res.partial ? `⚠️ This profile is based on ${res.answered || res.detail.length} answers${res.skipped ? `, with ${res.skipped} question${res.skipped > 1 ? "s" : ""} skipped` : " — you finished early"}, so treat it as a first sketch, not the full picture. ` : "") + `Weighted by your confidence slider — your average pick strength was ${res.avgConfidence} / 5. Strong opinions shaped this profile most.`;
  $("profileRecs").innerHTML = recCardsHtml(res.recs, res);
  const mrb = $("moreRecsBtn");
  if (mrb) {
    mrb.hidden = !((st.altRecs || []).length);
    mrb.textContent = "🎲 Show me different flavours";
    mrb.onclick = () => {
      recsAltShown = !recsAltShown;
      $("profileRecs").innerHTML = recCardsHtml(recsAltShown ? st.altRecs : (lastResult.recs || []), lastResult);
      mrb.textContent = recsAltShown ? "↩️ Back to my top matches" : "🎲 Show me different flavours";
    };
  }
  $("sheetNote").textContent = SHEETS_ENDPOINT ? "✓ Your results were saved for flavour analysis." : "";
}
async function sendToSheets() {
  if (!SHEETS_ENDPOINT || !st || st.sheetSent || !st.result) return;
  try {
    await fetch(SHEETS_ENDPOINT, {
      method: "POST", mode: "no-cors",
      headers: { "Content-Type": "text/plain" },
      body: JSON.stringify(st.result)
    });
    st.sheetSent = true;
    saveState();
  } catch (e) { console.warn("Sheets save failed:", e); }
}
function finish(early) {
  st.finished = true;
  st.result = computeResult(st);
  st.altRecs = altRecsCache;
  const skippedInRun = st.skipped ? Object.keys(st.skipped).filter(id => st.order.includes(id)).length : 0;
  if (early || answeredCount(st) < runTotal(st)) { st.result.partial = true; st.result.answered = answeredCount(st); st.result.skipped = skippedInRun; st.result.early = !!early; }
  saveState();
  sendToSheets();
  revealResults();
}
// v23.2 (Aizaz): "compiling" interlude before the reveal — the result
// is already computed and saved; only the display waits.
let compileTimer = null, compilePhraseTimer = null;
function revealResults() {
  const reduced = !!(window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches);
  // v23.3: grey dots generated per reveal (random angle/radius/grey).
  const dots = $("holeDots");
  if (dots && !reduced) {
    const maxR = Math.round(Math.max(160, Math.min(window.innerWidth, window.innerHeight) * 0.46));
    let html = "";
    for (let i = 0; i < 150; i++) {
      const a = Math.round(Math.random() * 360);
      const r = Math.round(95 + Math.random() * (maxR - 95));
      const d = (Math.random() * 1.7).toFixed(2);
      const g = 110 + Math.round(Math.random() * 120);
      html += `<span style="--a:${a}deg;--r:${r}px;--d:${d}s;background:rgb(${g},${g},${g})"></span>`;
    }
    dots.innerHTML = html;
  }
  show("view-compiling");
  window.scrollTo({ top: 0 });
  const phrases = ["Reading your palate…", "Weighing your flavour axes…", "Scanning kitchens around the world…", "Matching dishes to your taste…", "Handpicking your recommendations…"];
  let pi = 0;
  const el = $("compilePhrase");
  if (el) el.textContent = phrases[0];
  clearInterval(compilePhraseTimer);
  if (!reduced) compilePhraseTimer = setInterval(() => { pi = (pi + 1) % phrases.length; if (el) el.textContent = phrases[pi]; }, 1100);
  clearTimeout(compileTimer);
  compileTimer = setTimeout(() => {
    clearInterval(compilePhraseTimer);
    renderResults();
    show("view-results");
    window.scrollTo({ top: 0 });
  }, reduced ? 700 : 7500); // v23.4 (Aizaz): 7.5 seconds (was 5)
}
$("endBtn").onclick = () => { if (st && !st.finished && answeredCount(st) >= 5) finish(true); };
$("endInfoBtn").onclick = () => {
  const p = $("endInfoPanel");
  p.hidden = !p.hidden;
  $("endInfoBtn").classList.toggle("open", !p.hidden);
};
$("csvBtn").onclick = () => {
  const res = st.result || computeResult(st);
  const esc = (v) => `"${String(v == null ? "" : v).replace(/"/g, '""')}"`;
  const rows = [
    ["Diving into Buds — taste profile results"],
    ["Email", res.email], ["Diet", DIET_LABELS[res.diet] || res.diet], ["Roots", rootsLabelOf(res)],
    ["City", res.city || ""], ["Questions answered", res.detail.length], ["Ended early", res.partial ? "Yes" : "No"],
    ["Completed", res.completedAt], ["Top traits", res.topTags.join(", ")],
    ["Affinities", Object.entries(res.affinities || {}).map(([k, v]) => `${k}:${v}`).join(", ")],
    ...(res.axes || []).map(a => [`Axis — ${a.name}`, `${a.lean === "hi" ? a.hi : a.lean === "lo" ? a.lo : "Balanced"} (${a.pct}% toward ${a.hi}, strength ${a.strength})`]),
    ["Hard no's", (res.aversions || []).join(", ")],
    ["Heat %", res.meters.spice], ["Sweet %", res.meters.sweet], ["Adventure %", res.meters.adv],
    ["Smoke %", res.meters.smoky], ["Tang %", res.meters.tangy], ["Creamy %", res.meters.creamy], ["Fresh %", res.meters.fresh], ["Classic %", res.meters.classic],
    ["Average confidence", res.avgConfidence], [],
    ["#", "Question", "Section", "Your pick(s)", "Confidence"]
  ];
  res.detail.forEach((d, i) => rows.push([i + 1, d.q, d.deck, d.picks.join(" + "), d.weight]));
  rows.push([], ["Recommendations"]);
  res.recs.forEach(r => rows.push([r.dish, r.from, r.why]));
  const blob = new Blob([rows.map(r => r.map(esc).join(",")).join("\n")], { type: "text/csv" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "diving-into-buds-results.csv";
  a.click();
  URL.revokeObjectURL(a.href);
};
$("retakeBtn").onclick = doRestart;

/* ————— Boot ————— */
(async function init() {
  store.del("dib_session"); // legacy key from v2/v3
  if (!sb) { show("view-auth"); return; }
  const { data } = await sb.auth.getSession();
  if (data && data.session && data.session.user) {
    sessionUser = { id: data.session.user.id, email: data.session.user.email };
    await hydrate();
    routeAfterLogin();
  } else {
    show("view-auth");
  }
})();

/* v5: question info toggle + scroll reveal */
$("qInfoBtn").onclick = () => {
  const p = $("qInfoPanel");
  p.hidden = !p.hidden;
  $("qInfoBtn").classList.toggle("open", !p.hidden);
};
(() => {
  if (!("IntersectionObserver" in window)) { document.querySelectorAll(".reveal").forEach(el => el.classList.add("inview")); return; }
  const io = new IntersectionObserver(es => es.forEach(en => {
    if (en.isIntersecting) { en.target.classList.add("inview"); io.unobserve(en.target); }
  }), { threshold: 0.1 });
  document.querySelectorAll(".reveal").forEach(el => io.observe(el));
})();

/* v6: scroll-linked gradient drift — the page glow slowly shifts hue as you scroll */
(() => {
  if (window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const rootEl = document.documentElement;
  const stops = [[139, 92, 246], [217, 70, 239], [79, 70, 229], [147, 51, 234], [139, 92, 246]];
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
    rootEl.style.setProperty("--glowA", `rgba(${c[0]},${c[1]},${c[2]},${(0.40 + 0.16 * pulse).toFixed(3)})`);
    rootEl.style.setProperty("--glowB", `rgba(${c[2]},${c[1]},${c[0]},${(0.26 + 0.12 * pulse).toFixed(3)})`);
    // The glows also travel as you scroll, so the shift is unmistakable.
    rootEl.style.setProperty("--gx1", (12 + p * 48) + "%");
    rootEl.style.setProperty("--gy1", (-6 + p * 34) + "%");
    rootEl.style.setProperty("--gx2", (105 - p * 62) + "%");
    rootEl.style.setProperty("--gy2", (22 + p * 48) + "%");
  }
  addEventListener("scroll", () => { if (!ticking) { ticking = true; requestAnimationFrame(paint); } }, { passive: true });
  addEventListener("resize", paint);
  paint();
})();
