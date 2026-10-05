// Diving into Buds — app logic (v4)
// Global redesign: after login, users pick two Fundamentals — Diet and Roots —
// and their 50 questions are built from a 176-question bank around those picks.
// Diet rules filter every option (a Vegetarian in Hyderabad never sees meat);
// Everything/Halal users first pick the meats they eat, and later questions
// respect that too. Accounts + progress live in Supabase; on completion a
// result summary is also POSTed to a Google Sheets endpoint (Apps Script)
// when one is configured.

const SUPABASE_URL = "https://lhygxgwyprkhhkuaozuk.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxoeWd4Z3d5cHJraGhrdWFvenVrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTExNjU3MjcsImV4cCI6MjEwNjc0MTcyN30.upttjjbTEyv4JZTR8NpM94TAsgtV7PznYEeR_ZeRvn8";
const SHEETS_ENDPOINT = ""; // ← Apps Script web-app URL for Google Sheets (set when Aizaz deploys it)
const sb = (window.supabase && SUPABASE_URL && !SUPABASE_ANON_KEY.includes("PASTE_"))
  ? window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  : null;

const $ = (id) => document.getElementById(id);
const store = {
  get(k, d) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch { return d; } },
  set(k, v) { localStorage.setItem(k, JSON.stringify(v)); },
  del(k) { localStorage.removeItem(k); }
};
const TOTAL = 50;
const WEIGHT_WORDS = { 1: "Almost a tie", 2: "Leaning this way", 3: "Pretty sure", 4: "Strong pick", 5: "No contest" };
const DIET_LABELS = { everything: "Everything", vegetarian: "Vegetarian", vegan: "Vegan", halal: "Everything Halal" };
const ROOT_LABELS = { hyderabad: "Hyderabad", asia: "Asia", americas: "Americas", europe: "Europe" };
const ROOT_EMOJI = { hyderabad: "🏰", asia: "🥢", americas: "🌮", europe: "🥐" };

/* ————— State ————— */
let sessionUser = null; // { id, email }
let st = null;          // active user's progress state
const currentUser = () => (sessionUser ? sessionUser.email : null);
const stateKey = (email) => "dib_v4_" + email;

function blankState() {
  return { fundamentals: null, builtFor: null, order: [], reserve: [], answers: {}, pos: 0, finished: false, result: null, sheetSent: false };
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
function optVisible(dietClass, diet, meats) {
  const d = dietClass;
  if (diet === "vegan") return d === "vegan";
  if (diet === "vegetarian") return d === "vegan" || d === "veg";
  if (d === "alcohol") return diet === "everything";
  if (d === "meat:pork") return diet === "everything" && (!meats || meats.includes("pork"));
  if (d.startsWith("meat:")) return !meats || meats.includes(d.slice(5));
  return true; // 'vegan' / 'veg' classes are fine for everything & halal
}
function visibleOpts(q, s) {
  const diet = s.builtFor.diet, meats = chosenMeats(s);
  const out = [];
  q.options.forEach((o, i) => { if (optVisible(o.diet, diet, meats)) out.push({ o, i }); });
  return out;
}
function playable(q, s) {
  if (!s.builtFor || !q.diets.includes(s.builtFor.diet)) return false;
  return visibleOpts(q, s).length >= 2;
}

/* ————— Question-list builder (deterministic: same picks ⇒ same list) ————— */
function buildOrder(s) {
  const F = s.builtFor, diet = F.diet;
  const valid = QBANK.filter(q => q.diets.includes(diet) && q.options.filter(o => optVisible(o.diet, diet, null)).length >= 2);
  const byDeck = (d) => valid.filter(q => q.deck === d);
  const openersAll = byDeck("opener");
  const openers = [...openersAll.filter(q => q.multi), ...openersAll.filter(q => !q.multi)].slice(0, 5);
  const roots = byDeck(F.roots), glob = byDeck("global"), bridge = byDeck("bridge");
  const order = [
    ...openers,
    ...roots.slice(0, 11), ...glob.slice(0, 7),
    ...roots.slice(11, 22), ...bridge.slice(0, 10), ...glob.slice(7, 13)
  ];
  const inOrder = new Set(order.map(q => q.id));
  for (const q of valid) {
    if (order.length >= TOTAL) break;
    if (!inOrder.has(q.id)) { order.push(q); inOrder.add(q.id); }
  }
  s.order = order.slice(0, TOTAL).map(q => q.id);
  s.reserve = valid.filter(q => !inOrder.has(q.id)).map(q => q.id);
  s.pos = 0;
}
// After the meats answer changes, swap any now-unplayable upcoming questions
// for reserve questions so the run always stays at 50.
function fixOrder(s) {
  if (!s.builtFor) return;
  const inOrder = new Set(s.order);
  const pool = [...s.reserve, ...QBANK.map(q => q.id).filter(id => !inOrder.has(id))];
  const used = new Set();
  for (let i = s.pos + 1; i < s.order.length; i++) {
    const q = QBANK_BY_ID[s.order[i]];
    if (!q || s.answers[q.id] || playable(q, s)) continue;
    let rep = null;
    for (const cid of pool) {
      if (used.has(cid) || s.order.includes(cid)) continue;
      const cq = QBANK_BY_ID[cid];
      if (cq && !s.answers[cid] && playable(cq, s)) { rep = cid; break; }
    }
    if (rep) { used.add(rep); s.order[i] = rep; }
  }
  s.reserve = pool.filter(id => !used.has(id) && !s.order.includes(id));
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
  const result = row.result || rawAnswers.__result || null;
  if (fund && (Object.keys(cloudAnswers).length || row.finished || local.builtFor)) {
    st = blankState();
    st.fundamentals = fund; st.builtFor = fund;
    st.answers = Object.keys(cloudAnswers).length ? cloudAnswers : (local.builtFor && JSON.stringify(local.builtFor) === JSON.stringify(fund) ? local.answers : {});
    st.finished = !!row.finished; st.result = result; st.sheetSent = !!result;
    buildOrder(st); fixOrder(st);
    st.pos = Math.max(0, Math.min(row.current_q || 0, st.order.length - 1));
    store.set(stateKey(email), st);
  } else {
    st = local; // cloud holds nothing usable yet — keep this device's state
    if (st.builtFor) scheduleSync();
  }
}

/* ————— Views ————— */
function show(view) {
  ["view-auth", "view-fund", "view-home", "view-quiz", "view-results"].forEach(v => { $(v).hidden = v !== view; });
  const u = currentUser();
  $("userbox").hidden = !u;
  if (u) $("userEmail").textContent = u;
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
  if (st && st.builtFor) { renderHome(); show("view-home"); }
  else { initFundPicks(); show("view-fund"); }
}

/* ————— Fundamentals ————— */
let pickDiet = null, pickRoots = null;
function initFundPicks() {
  const saved = (st && st.fundamentals) || store.get("dib_pending_fund", null);
  pickDiet = saved ? saved.diet : null;
  pickRoots = saved ? saved.roots : null;
  paintFundPicks();
}
function paintFundPicks() {
  document.querySelectorAll("#dietGrid .fund-opt").forEach(b => {
    const on = b.dataset.diet === pickDiet;
    b.classList.toggle("picked", on); b.setAttribute("aria-checked", on ? "true" : "false");
  });
  document.querySelectorAll("#rootsGrid .fund-opt").forEach(b => {
    const on = b.dataset.roots === pickRoots;
    b.classList.toggle("picked", on); b.setAttribute("aria-checked", on ? "true" : "false");
  });
  $("buildBtn").disabled = !(pickDiet && pickRoots);
  $("buildBtn").textContent = st && st.builtFor ? "Rebuild my 50 questions →" : "Build my 50 questions →";
}
document.querySelectorAll("#dietGrid .fund-opt").forEach(b => b.onclick = () => {
  pickDiet = b.dataset.diet; store.set("dib_pending_fund", { diet: pickDiet, roots: pickRoots }); paintFundPicks();
});
document.querySelectorAll("#rootsGrid .fund-opt").forEach(b => b.onclick = () => {
  pickRoots = b.dataset.roots; store.set("dib_pending_fund", { diet: pickDiet, roots: pickRoots }); paintFundPicks();
});
$("buildBtn").onclick = () => {
  if (!pickDiet || !pickRoots) return;
  const F = { diet: pickDiet, roots: pickRoots };
  const changing = st.builtFor && JSON.stringify(st.builtFor) !== JSON.stringify(F);
  if ((changing || st.finished) && answeredCount(st) > 0 &&
      !confirm("New fundamentals mean a fresh set of 50 questions — your current answers will be cleared. Continue?")) return;
  st.fundamentals = F; st.builtFor = F;
  st.answers = {}; st.finished = false; st.result = null; st.sheetSent = false;
  buildOrder(st);
  saveState();
  st.pos = 0;
  renderQuestion();
  show("view-quiz");
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
    ? `Your fundamentals: ${DIET_LABELS[st.builtFor.diet]} · ${ROOT_EMOJI[st.builtFor.roots]} ${ROOT_LABELS[st.builtFor.roots]} roots`
    : "";
  restart.hidden = !(n > 0 || st.finished);
  change.hidden = !st.builtFor;
  if (!st.builtFor) {
    $("homeTitle").textContent = "One quick step first 🧭";
    $("homeText").textContent = "Pick your two fundamentals — your diet and your roots — and we'll build your 50 questions around them.";
    $("primaryAction").textContent = "Pick my fundamentals →";
  } else if (st.finished) {
    $("homeTitle").textContent = "Your taste profile is ready 🎉";
    $("homeText").textContent = "You answered all 50 questions. Come see what your taste buds had to say — and which world flavours to meet next.";
    $("primaryAction").textContent = "See my taste profile";
  } else if (n > 0) {
    $("homeTitle").textContent = "Welcome back 👋";
    $("homeText").textContent = `You've answered ${n} of ${TOTAL} questions — everything, slider weights included, is saved to your account. Pick up right where you left off, on any device.`;
    $("primaryAction").textContent = `Continue — question ${n + 1}`;
  } else {
    $("homeTitle").textContent = "Ready to dive in?";
    $("homeText").textContent = `Your 50 questions are built around ${ROOT_LABELS[st.builtFor.roots]} roots and a ${DIET_LABELS[st.builtFor.diet]} diet. About 5 minutes — save & exit anytime.`;
    $("primaryAction").textContent = "Start the 50 questions";
  }
}
$("primaryAction").onclick = () => {
  if (!st.builtFor) { initFundPicks(); show("view-fund"); return; }
  if (st.finished) { renderResults(); show("view-results"); return; }
  const t = findNext(0);
  st.pos = t >= 0 ? t : 0;
  saveState();
  renderQuestion();
  show("view-quiz");
};
$("changeFundBtn").onclick = () => { initFundPicks(); show("view-fund"); };
$("restartBtn").onclick = () => {
  if (!confirm("Start over? Your saved answers will be cleared (fundamentals stay the same).")) return;
  st.answers = {}; st.finished = false; st.result = null; st.sheetSent = false;
  buildOrder(st);
  saveState();
  renderHome();
};

/* ————— Quiz ————— */
let pendingW = 1;
let pendingSel = new Set(); // multi-select working set (original option indices)
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
  if (!st.answers[q.id] && !playable(q, st)) { // safety: never strand the user
    const t = findNext(st.pos);
    if (t >= 0) { st.pos = t; q = currentQ(); }
  }
  const saved = st.answers[q.id];
  const n = answeredCount(st);
  const posInRun = st.order.indexOf(q.id) + 1;

  $("qCounter").textContent = `Question ${posInRun} of ${TOTAL}`;
  $("progressBar").style.width = (n / TOTAL * 100) + "%";
  $("progressWrap").setAttribute("aria-valuenow", n);
  $("qSection").textContent = DECK_LABELS[q.deck] || "";
  $("qSub").textContent = DECK_SUBS[q.deck] || "";

  $("qEmoji").textContent = q.emoji;
  const img = $("qImg");
  const url = imgUrlFor(q);
  img.style.display = url ? "" : "none";
  if (url) img.src = url;
  img.alt = q.q;
  $("qText").textContent = q.q;
  $("multiHint").hidden = !q.multi;

  pendingSel = new Set(saved && Array.isArray(saved.o) ? saved.o : []);
  const box = $("qOptions");
  box.innerHTML = "";
  visibleOpts(q, st).forEach(({ o, i }) => {
    const picked = q.multi ? pendingSel.has(i) : (saved && saved.o === i);
    const b = document.createElement("button");
    b.type = "button";
    b.className = "opt" + (q.multi ? " multi" : "") + (picked ? " picked" : "");
    b.textContent = o.t;
    b.setAttribute("aria-pressed", picked ? "true" : "false");
    b.onclick = () => (q.multi ? toggleOption(i) : selectOption(i));
    box.appendChild(b);
  });

  pendingW = saved ? saved.w : 1;
  $("weightSlider").value = pendingW;
  updateSliderLabel();

  const hasAnswer = q.multi ? pendingSel.size > 0 : !!saved;
  $("nextBtn").disabled = !hasAnswer;
  $("nextBtn").textContent = hasAnswer && n >= TOTAL - 1 && findNext(0) === -1 ? "Finish — see my profile 🎉" : "Next →";
  $("backBtn").style.visibility = st.pos === 0 ? "hidden" : "visible";
  $("savedNote").textContent = n ? `✓ ${n} answer${n > 1 ? "s" : ""} saved` : "";

  const inner = $("qInner");
  inner.style.animation = "none"; void inner.offsetWidth; inner.style.animation = "";
  const nextId = st.order[st.pos + 1];
  if (nextId && QBANK_BY_ID[nextId]) { const pre = new Image(); pre.src = imgUrlFor(QBANK_BY_ID[nextId]); }
  $("qText").focus({ preventScroll: true });
}
function updateSliderLabel() { $("sliderVal").textContent = `${pendingW} · ${WEIGHT_WORDS[pendingW]}`; }
function refreshAfterAnswer() {
  const n = answeredCount(st);
  $("progressBar").style.width = (n / TOTAL * 100) + "%";
  $("progressWrap").setAttribute("aria-valuenow", n);
  $("savedNote").textContent = `✓ ${n} answer${n > 1 ? "s" : ""} saved`;
  $("nextBtn").disabled = false;
  $("nextBtn").textContent = n >= TOTAL - 1 && findNext(0) === -1 ? "Finish — see my profile 🎉" : "Next →";
}
function selectOption(oi) {
  const q = currentQ();
  st.answers[q.id] = { o: oi, w: pendingW };
  if (q.id === "op-meats" || q.id === "op-meats-halal") fixOrder(st);
  saveState();
  [...$("qOptions").children].forEach((b, bi) => {
    const vis = visibleOpts(q, st);
    const picked = vis[bi] && vis[bi].i === oi;
    b.classList.toggle("picked", !!picked);
    b.setAttribute("aria-pressed", picked ? "true" : "false");
  });
  refreshAfterAnswer();
}
function toggleOption(oi) {
  const q = currentQ();
  if (pendingSel.has(oi)) pendingSel.delete(oi); else pendingSel.add(oi);
  if (pendingSel.size) st.answers[q.id] = { o: [...pendingSel].sort((a, b) => a - b), w: pendingW };
  else delete st.answers[q.id];
  if (q.id === "op-meats" || q.id === "op-meats-halal") fixOrder(st);
  saveState();
  [...$("qOptions").children].forEach((b, bi) => {
    const vis = visibleOpts(q, st);
    const picked = vis[bi] && pendingSel.has(vis[bi].i);
    b.classList.toggle("picked", !!picked);
    b.setAttribute("aria-pressed", picked ? "true" : "false");
  });
  $("nextBtn").disabled = pendingSel.size === 0;
  refreshAfterAnswer();
  if (pendingSel.size === 0) $("nextBtn").disabled = true;
}
$("weightSlider").addEventListener("input", (e) => {
  pendingW = parseInt(e.target.value, 10) || 1;
  updateSliderLabel();
  const q = currentQ();
  if (q && st.answers[q.id]) { st.answers[q.id].w = pendingW; saveState(); }
});
$("nextBtn").onclick = () => {
  if (answeredCount(st) >= TOTAL) return finish();
  let t = findNext(st.pos + 1);
  if (t === -1) t = findNext(0);
  if (t === -1) return finish();
  st.pos = t;
  saveState();
  renderQuestion();
};
$("backBtn").onclick = () => {
  st.pos = Math.max(0, st.pos - 1);
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
  if (num >= 1 && num <= vis.length) (q.multi ? toggleOption : selectOption)(vis[num - 1].i);
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
  smoky: "🔥 Smoke & char devotee", tangy: "🍋 Tang-chaser", creamy: "🥛 Creamy-comfort seeker", fresh: "🌿 Fresh & bright"
};
const RECS = [
  { dish: "Vegetable paella", from: "Spain · Europe", region: "europe", diet: "vegan", emoji: "🥘", match: ["rice", "biryani"], why: "Saffron rice cooked slow in one pan — biryani's Mediterranean cousin, socarrat crust and all." },
  { dish: "Tahdig — crispy saffron rice", from: "Persia", region: "asia", diet: "vegan", emoji: "🍚", match: ["rice", "biryani", "classic"], why: "Fragrant rice with a golden, crunchy bottom — the part everyone fights over, as the main event." },
  { dish: "Jambalaya", from: "Louisiana · Americas", region: "americas", diet: "meat:chicken", emoji: "🍤", match: ["rice", "spice", "smoky"], why: "One-pot spiced rice with smoke and heat — a biryani relative that grew up in New Orleans." },
  { dish: "Veggie burrito bowl", from: "Mexico · Americas", region: "americas", diet: "vegan", emoji: "🌯", match: ["rice", "fresh", "healthy"], why: "Rice, beans, salsa, guac — the build-your-own thali, Mexican edition." },
  { dish: "Mapo tofu", from: "Sichuan · Asia", region: "asia", diet: "vegan", emoji: "🌶️", match: ["spice", "adventure"], why: "Silky tofu in a chilli-bean lava with numbing Sichuan pepper. Your heat tolerance, upgraded." },
  { dish: "Thai green curry with tofu", from: "Thailand · Asia", region: "asia", diet: "vegan", emoji: "🍛", match: ["creamy", "spice"], why: "Coconut, basil and green chilli — salan energy in a whole new accent." },
  { dish: "Shakshuka", from: "The Mediterranean", region: "europe", diet: "veg", emoji: "🍳", match: ["tangy", "home"], why: "Eggs poached in spiced tomato sauce — breakfast, lunch and dinner argue over it." },
  { dish: "Ratatouille", from: "France · Europe", region: "europe", diet: "vegan", emoji: "🍆", match: ["home", "healthy", "fresh"], why: "Slow-stewed vegetables with herbs — proof that simple veg, cooked patiently, wins." },
  { dish: "Elote — street corn", from: "Mexico · Americas", region: "americas", diet: "veg", emoji: "🌽", match: ["street", "tangy"], why: "Charred corn, lime, chilli, cheese — chaat's long-lost Mexican sibling." },
  { dish: "Mushroom pierogi", from: "Poland · Europe", region: "europe", diet: "vegan", emoji: "🥟", match: ["home", "classic"], why: "Dumplings with sauerkraut and mushroom — momos that emigrated and got cosy." },
  { dish: "Mushroom ceviche", from: "Peru · Americas", region: "americas", diet: "vegan", emoji: "🍋", match: ["fresh", "tangy", "adventure"], why: "Lime-cured, onion-sharp, chilli-bright — a flavour wake-up call, no cooking involved." },
  { dish: "Bibimbap", from: "Korea · Asia", region: "asia", diet: "veg", emoji: "🍲", match: ["rice", "fresh"], why: "A rainbow of vegetables over rice with gochujang — mix it like you mean it." },
  { dish: "Mushroom risotto", from: "Italy · Europe", region: "europe", diet: "veg", emoji: "🍄", match: ["creamy", "classic"], why: "Rice stirred to silk — khichdi's elegant Italian cousin." },
  { dish: "Tempeh satay skewers", from: "Indonesia · Asia", region: "asia", diet: "vegan", emoji: "🍢", match: ["smoky", "street"], why: "Charred skewers with peanut sauce — kebab night, Southeast Asian style." },
  { dish: "Açaí bowl", from: "Brazil · Americas", region: "americas", diet: "vegan", emoji: "🫐", match: ["sweet", "fresh", "healthy"], why: "Icy purple berries, granola crunch — dessert that behaves like breakfast." },
  { dish: "Miso soup & onigiri", from: "Japan · Asia", region: "asia", diet: "vegan", emoji: "🍙", match: ["mild", "home"], why: "Quiet, savoury comfort — the gentle end of the flavour spectrum, done perfectly." },
  { dish: "Yakitori skewers", from: "Japan · Asia", region: "asia", diet: "meat:chicken", emoji: "🍗", match: ["smoky", "street", "meat"], why: "Charcoal-kissed chicken skewers — your kebab instincts, refined to an art." },
  { dish: "Texas brisket", from: "Texas · Americas", region: "americas", diet: "meat:beef", emoji: "🥩", match: ["smoky", "meat"], why: "14 hours of smoke, salt and patience. Slow food at its most serious." },
  { dish: "Grilled branzino", from: "The Mediterranean · Europe", region: "europe", diet: "meat:seafood", emoji: "🐟", match: ["fresh", "mild"], why: "Whole fish, olive oil, lemon, herbs — coastal simplicity that needs nothing else." },
  { dish: "Seekh kebab, Deccan style", from: "Hyderabad", region: "hyderabad", diet: "meat:lamb", emoji: "🔥", match: ["smoky", "spice", "deccan", "meat"], why: "Hand-minced, coal-smoked, unapologetically spiced — home turf, perfected." }
];
function meterLabel(kind, pct) {
  if (kind === "spice") return pct >= 66 ? "Chilli chaser" : pct >= 33 ? "Warm & balanced" : "Gentle palate";
  if (kind === "sweet") return pct >= 66 ? "Serious sweet tooth" : pct >= 33 ? "Sweet in moderation" : "Savoury soul";
  return pct >= 66 ? "Fearless taster" : pct >= 33 ? "Curious explorer" : "Creature of habit";
}
function computeResult(s) {
  const tagCount = {};
  const meters = { spice: [0, 0], sweet: [0, 0], adv: [0, 0] };
  const detail = [];
  let wSum = 0, wCount = 0;
  s.order.forEach(qid => {
    const a = s.answers[qid]; if (!a) return;
    const q = QBANK_BY_ID[qid]; if (!q) return;
    const picks = (Array.isArray(a.o) ? a.o : [a.o]).map(i => q.options[i]).filter(Boolean);
    const w = a.w || 1;
    wSum += w; wCount++;
    picks.forEach(opt => {
      (opt.tags || []).forEach(t => { tagCount[t] = (tagCount[t] || 0) + w; });
      [["spice", "spice"], ["sweet", "sweet"], ["adv", "adv"]].forEach(([f, k]) => {
        if (typeof opt[f] === "number") { meters[k][0] += opt[f] * w; meters[k][1] += w; }
      });
    });
    detail.push({ qid, q: q.q, deck: q.deck, picks: picks.map(p => p.t), weight: w });
  });
  const topTags = Object.entries(tagCount).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([t]) => t);
  const meterPct = {};
  Object.entries(meters).forEach(([k, [sum, wt]]) => { meterPct[k] = wt ? Math.round(100 * sum / (3 * wt)) : 0; });
  // Recommendations: diet-safe, tag-matched, other regions first.
  const meats = chosenMeats(s);
  const scored = RECS
    .filter(r => optVisible(r.diet, s.builtFor.diet, meats))
    .map(r => ({
      r,
      score: r.match.filter(t => topTags.includes(t)).length * 2 + (r.region !== s.builtFor.roots ? 1 : 0)
    }))
    .sort((a, b) => b.score - a.score);
  const recs = [];
  const seenRegion = new Set();
  scored.forEach(({ r }) => { if (recs.length < 5 && !recs.find(x => x.dish === r.dish)) { recs.push(r); seenRegion.add(r.region); } });
  return {
    email: sessionUser ? sessionUser.email : "",
    diet: s.builtFor.diet, roots: s.builtFor.roots,
    topTags, meters: meterPct,
    avgConfidence: wCount ? +(wSum / wCount).toFixed(2) : 1,
    detail, recs: recs.map(r => ({ dish: r.dish, from: r.from, why: r.why })),
    completedAt: new Date().toISOString()
  };
}
function renderResults() {
  const res = st.result || computeResult(st);
  st.result = res;
  const strip = (s2) => s2.replace(/^\S+\s/, "");
  const labels = res.topTags.map(t => TAG_LABELS[t]).filter(Boolean);
  $("profileSummary").textContent = labels.length >= 2
    ? `In one line: ${strip(labels[0])} meets ${strip(labels[1]).toLowerCase()}. Here's the full picture:`
    : "Here's what your answers say about your palate:";
  $("profileTraits").innerHTML = labels.map(l => `<span class="trait">${l}</span>`).join("");
  const names = { spice: "🌶️ Heat level", sweet: "🍮 Sweet tooth", adv: "🧭 Adventurousness" };
  $("profileMeters").innerHTML = Object.entries(res.meters).map(([k, pct]) =>
    `<div class="meter"><div class="mhead"><span>${names[k]}</span><span>${meterLabel(k, pct)}</span></div>
     <div class="track"><div class="fill" style="width:${pct}%"></div></div></div>`).join("");
  $("profileNote").textContent = `Weighted by your confidence slider — your average pick strength was ${res.avgConfidence} / 5. Strong opinions shaped this profile most.`;
  $("profileRecs").innerHTML = res.recs.map(r =>
    `<div class="rec"><span class="r-emoji">${(RECS.find(x => x.dish === r.dish) || {}).emoji || "🍽️"}</span>
     <div><span class="r-from">${r.from.toUpperCase()}</span><strong>${r.dish}</strong><p>${r.why}</p></div></div>`).join("");
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
function finish() {
  st.finished = true;
  st.result = computeResult(st);
  saveState();
  sendToSheets();
  renderResults();
  show("view-results");
}
$("csvBtn").onclick = () => {
  const res = st.result || computeResult(st);
  const esc = (v) => `"${String(v == null ? "" : v).replace(/"/g, '""')}"`;
  const rows = [
    ["Diving into Buds — taste profile results"],
    ["Email", res.email], ["Diet", DIET_LABELS[res.diet] || res.diet], ["Roots", ROOT_LABELS[res.roots] || res.roots],
    ["Completed", res.completedAt], ["Top traits", res.topTags.join(", ")],
    ["Heat %", res.meters.spice], ["Sweet %", res.meters.sweet], ["Adventure %", res.meters.adv],
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
$("retakeBtn").onclick = () => {
  st.answers = {}; st.finished = false; st.result = null; st.sheetSent = false;
  buildOrder(st);
  saveState();
  renderHome();
  show("view-home");
};

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
