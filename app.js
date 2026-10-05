// Diving into Buds — app logic (v3, real accounts via Supabase)
// Accounts live in Supabase Auth; progress lives in the `progress` table
// (one row per user, locked down with row-level security). The browser keeps
// a local cache of the quiz state so the quiz itself stays instant — every
// change is synced to the cloud, and the cloud wins on sign-in.
// Answers are { o: optionIndex, w: weight 1–5 } — the confidence slider.

const SUPABASE_URL = "https://lhygxgwyprkhhkuaozuk.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxoeWd4Z3d5cHJraGhrdWFvenVrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTExNjU3MjcsImV4cCI6MjEwNjc0MTcyN30.upttjjbTEyv4JZTR8NpM94TAsgtV7PznYEeR_ZeRvn8";
const sb = (window.supabase && SUPABASE_URL && !SUPABASE_ANON_KEY.includes("PASTE_"))
  ? window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  : null;

const $ = (id) => document.getElementById(id);
const store = {
  get(k, d) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch { return d; } },
  set(k, v) { localStorage.setItem(k, JSON.stringify(v)); },
  del(k) { localStorage.removeItem(k); }
};
const TOTAL = QUESTIONS.length;
const WEIGHT_WORDS = { 1: "Almost a tie", 2: "Leaning this way", 3: "Pretty sure", 4: "Strong pick", 5: "No contest" };

/* ————— Session & quiz cache ————— */
let sessionUser = null; // { id, email }
const currentUser = () => (sessionUser ? sessionUser.email : null);
const quizKey = (email) => "dib_quiz_" + email;

function getQuiz(email) {
  const q = store.get(quizKey(email), { answers: {}, current: 0, finished: false });
  // migrate v1 answers (plain option index) → { o, w: 1 }
  Object.keys(q.answers).forEach(k => {
    if (typeof q.answers[k] === "number") q.answers[k] = { o: q.answers[k], w: 1 };
  });
  return q;
}
function saveQuiz(email, q) {
  store.set(quizKey(email), q);
  if (sessionUser && sessionUser.email === email) scheduleSync(q);
}
const answeredCount = (q) => Object.keys(q.answers).length;

/* ————— Cloud sync ————— */
let syncTimer = null;
function scheduleSync(q) {
  clearTimeout(syncTimer);
  syncTimer = setTimeout(() => upsertNow(q), 400);
}
async function upsertNow(q) {
  if (!sb || !sessionUser) return;
  const { error } = await sb.from("progress").upsert({
    user_id: sessionUser.id,
    answers: q.answers,
    current_q: q.current,
    finished: q.finished,
    updated_at: new Date().toISOString()
  });
  if (error) console.warn("Progress sync failed (will retry on next change):", error.message);
}
// On sign-in: cloud is the source of truth. If the cloud is empty but this
// browser still holds demo-era answers for the same email, offer to import.
async function hydrateFromCloud() {
  const email = sessionUser.email;
  const { data: rows, error } = await sb.from("progress")
    .select("answers, current_q, finished").eq("user_id", sessionUser.id).limit(1);
  if (error) return; // offline or hiccup — keep the local cache
  const row = rows && rows[0];
  const cloudQ = row
    ? { answers: row.answers || {}, current: row.current_q || 0, finished: !!row.finished }
    : { answers: {}, current: 0, finished: false };
  const local = getQuiz(email);
  const cloudN = answeredCount(cloudQ), localN = answeredCount(local);
  if (cloudN === 0 && localN > 0) {
    if (confirm(`We found ${localN} answer${localN > 1 ? "s" : ""} saved in this browser from before accounts went live. Import them into your account?`)) {
      await upsertNow(local);
    } else {
      store.set(quizKey(email), cloudQ);
    }
  } else if (cloudN > 0) {
    store.set(quizKey(email), cloudQ);
  }
}

/* ————— Views ————— */
function show(view) {
  ["view-auth", "view-home", "view-quiz", "view-results"].forEach(v => { $(v).hidden = v !== view; });
  const u = currentUser();
  $("userbox").hidden = !u;
  if (u) $("userEmail").textContent = u;
  window.scrollTo({ top: 0, behavior: "smooth" });
}

/* ————— Auth ————— */
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
    await hydrateFromCloud();
    renderHome();
    show("view-home");
  } finally {
    btn.disabled = false;
    btn.textContent = original;
  }
});
$("logoutBtn").onclick = async () => {
  if (sb) await sb.auth.signOut();
  sessionUser = null;
  show("view-auth");
};

/* ————— Home ————— */
function renderHome() {
  const email = currentUser(); if (!email) return;
  const q = getQuiz(email);
  const n = answeredCount(q);
  const restart = $("restartBtn");
  if (q.finished) {
    $("homeTitle").textContent = "Your taste profile is ready 🎉";
    $("homeText").textContent = "You answered all 50 questions. Come see what your taste buds had to say.";
    $("primaryAction").textContent = "See my taste profile";
    restart.hidden = false;
  } else if (n > 0) {
    $("homeTitle").textContent = "Welcome back 👋";
    $("homeText").textContent = `You've answered ${n} of ${TOTAL} questions — everything, slider weights included, is saved to your account. Pick up right where you left off, on any device.`;
    $("primaryAction").textContent = `Continue — question ${n + 1}`;
    restart.hidden = false;
  } else {
    $("homeTitle").textContent = "Ready to dive in?";
    $("homeText").textContent = "50 questions: 15 from Hyderabad, 10 across India, 25 from around the world. About 5 minutes — and you can save & exit anytime.";
    $("primaryAction").textContent = "Start the 50 questions";
    restart.hidden = true;
  }
}
$("primaryAction").onclick = () => {
  const email = currentUser(); const q = getQuiz(email);
  if (q.finished) { renderResults(); show("view-results"); return; }
  let idx = 0; while (idx < TOTAL && q.answers[idx] !== undefined) idx++;
  q.current = Math.min(idx, TOTAL - 1);
  saveQuiz(email, q);
  renderQuestion();
  show("view-quiz");
};
$("restartBtn").onclick = async () => {
  if (!confirm("Start over? Your saved answers will be cleared.")) return;
  const email = currentUser();
  const fresh = { answers: {}, current: 0, finished: false };
  store.set(quizKey(email), fresh);
  await upsertNow(fresh);
  renderHome();
};

/* ————— Quiz ————— */
let pendingW = 1; // slider value for the question on screen

function renderQuestion() {
  const email = currentUser(); const q = getQuiz(email);
  const i = Math.max(0, Math.min(q.current, TOTAL - 1));
  q.current = i;
  const item = QUESTIONS[i];
  const saved = q.answers[i];
  const n = answeredCount(q);

  $("qCounter").textContent = `Question ${i + 1} of ${TOTAL}`;
  $("progressBar").style.width = (n / TOTAL * 100) + "%";
  $("progressWrap").setAttribute("aria-valuenow", n);
  const sec = SECTIONS[sectionOf(i)];
  $("qSection").textContent = sec.name;
  $("qSub").textContent = sec.sub;

  $("qEmoji").textContent = item.emoji;
  const img = $("qImg");
  img.style.display = "";
  img.src = item.img;
  img.alt = item.q;
  $("qText").textContent = item.q;

  const box = $("qOptions");
  box.innerHTML = "";
  item.options.forEach((opt, oi) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "opt" + (saved && saved.o === oi ? " picked" : "");
    b.textContent = opt.t;
    b.setAttribute("aria-pressed", saved && saved.o === oi ? "true" : "false");
    b.onclick = () => selectOption(oi);
    box.appendChild(b);
  });

  pendingW = saved ? saved.w : 1;
  const slider = $("weightSlider");
  slider.value = pendingW;
  updateSliderLabel();

  const remaining = TOTAL - n;
  $("nextBtn").disabled = !saved;
  $("nextBtn").textContent = saved && remaining <= 1 ? "Finish — see my profile 🎉" : "Next →";
  $("backBtn").style.visibility = i === 0 ? "hidden" : "visible";
  $("savedNote").textContent = n ? `✓ ${n} answer${n > 1 ? "s" : ""} saved` : "";

  const inner = $("qInner");
  inner.style.animation = "none"; void inner.offsetWidth; inner.style.animation = "";
  const nxt = QUESTIONS[i + 1];
  if (nxt) { const pre = new Image(); pre.src = nxt.img; }
  $("qText").focus({ preventScroll: true });
}

function updateSliderLabel() {
  $("sliderVal").textContent = `${pendingW} · ${WEIGHT_WORDS[pendingW]}`;
}

function selectOption(oi) {
  const email = currentUser(); const q = getQuiz(email);
  q.answers[q.current] = { o: oi, w: pendingW };
  saveQuiz(email, q);
  [...$("qOptions").children].forEach((b, bi) => {
    b.classList.toggle("picked", bi === oi);
    b.setAttribute("aria-pressed", bi === oi ? "true" : "false");
  });
  const n = answeredCount(q);
  $("progressBar").style.width = (n / TOTAL * 100) + "%";
  $("progressWrap").setAttribute("aria-valuenow", n);
  $("savedNote").textContent = `✓ ${n} answer${n > 1 ? "s" : ""} saved`;
  $("nextBtn").disabled = false;
  $("nextBtn").textContent = TOTAL - n <= 1 ? "Finish — see my profile 🎉" : "Next →";
}

$("weightSlider").addEventListener("input", (e) => {
  pendingW = parseInt(e.target.value, 10) || 1;
  updateSliderLabel();
  const email = currentUser(); const q = getQuiz(email);
  if (q.answers[q.current]) {           // re-weigh an existing pick, live
    q.answers[q.current].w = pendingW;
    saveQuiz(email, q);
  }
});

$("nextBtn").onclick = () => {
  const email = currentUser(); const q = getQuiz(email);
  let target = -1;
  for (let j = q.current + 1; j < TOTAL; j++) if (q.answers[j] === undefined) { target = j; break; }
  if (target === -1) for (let j = 0; j < q.current; j++) if (q.answers[j] === undefined) { target = j; break; }
  if (target === -1) {                  // everything answered → profile
    q.finished = true; saveQuiz(email, q);
    renderResults(); show("view-results"); return;
  }
  q.current = target; saveQuiz(email, q);
  renderQuestion();
};
$("backBtn").onclick = () => {
  const email = currentUser(); const q = getQuiz(email);
  q.current = Math.max(0, q.current - 1);
  saveQuiz(email, q);
  renderQuestion();
};
$("saveExitBtn").onclick = () => { renderHome(); show("view-home"); };

document.addEventListener("keydown", (e) => {
  if ($("view-quiz").hidden) return;
  if (/INPUT|TEXTAREA/.test(document.activeElement.tagName) && document.activeElement.id !== "weightSlider") return;
  const email = currentUser(); const q = getQuiz(email);
  const num = parseInt(e.key, 10);
  if (num >= 1 && num <= QUESTIONS[q.current].options.length) selectOption(num - 1);
  else if (e.key === "ArrowRight" && !$("nextBtn").disabled && document.activeElement.id !== "weightSlider") $("nextBtn").click();
  else if (e.key === "ArrowLeft" && document.activeElement.id !== "weightSlider") $("backBtn").click();
});

/* ————— Results / taste profile (weighted) ————— */
const TAG_LABELS = {
  biryani: "🍛 Biryani devotee", deccan: "🌶️ Deccan at heart", spice: "🔥 Chilli chaser",
  mild: "😌 Easy-going palate", sweet: "🍮 Certified sweet tooth", street: "🧭 Street-food hunter",
  noodle: "🍜 Noodle loyalist", rice: "🍚 Rice is life", meat: "🍗 Full non-veg energy",
  veg: "🥦 Veggie-friendly", cafe: "🥐 Café-hopper", home: "🏠 Ghar ka khana fan",
  adventure: "🎲 Will try anything once", classic: "💛 Comfort-food classic",
  healthy: "🥗 Fresh & balanced", chai: "🫖 Chai over everything", coffee: "☕ Coffee-powered"
};
function meterLabel(kind, pct) {
  if (kind === "spice") return pct >= 66 ? "Chilli chaser" : pct >= 33 ? "Warm & balanced" : "Gentle palate";
  if (kind === "sweet") return pct >= 66 ? "Serious sweet tooth" : pct >= 33 ? "Sweet in moderation" : "Savoury soul";
  return pct >= 66 ? "Fearless taster" : pct >= 33 ? "Curious explorer" : "Creature of habit";
}
function renderResults() {
  const email = currentUser(); const q = getQuiz(email);
  const tagCount = {};
  const meters = { spice: [0, 0], sweet: [0, 0], adv: [0, 0] }; // [weighted sum, weight total]
  let wSum = 0, wCount = 0;
  Object.entries(q.answers).forEach(([qi, a]) => {
    const opt = QUESTIONS[+qi].options[a.o];
    const w = a.w || 1;
    wSum += w; wCount++;
    (opt.tags || []).forEach(t => { tagCount[t] = (tagCount[t] || 0) + w; });
    [["spice", "spice"], ["sweet", "sweet"], ["adv", "adv"]].forEach(([field, key]) => {
      if (typeof opt[field] === "number") { meters[key][0] += opt[field] * w; meters[key][1] += w; }
    });
  });
  const top = Object.entries(tagCount).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([t]) => t);
  const strip = (s) => s.replace(/^\S+\s/, "");
  $("profileSummary").textContent = top.length >= 2
    ? `In one line: ${strip(TAG_LABELS[top[0]])} meets ${strip(TAG_LABELS[top[1]]).toLowerCase()}. Here's the full picture:`
    : "Here's what your answers say about your palate:";
  $("profileTraits").innerHTML = top.map(t => `<span class="trait">${TAG_LABELS[t] || t}</span>`).join("");
  const names = { spice: "🌶️ Heat level", sweet: "🍮 Sweet tooth", adv: "🧭 Adventurousness" };
  $("profileMeters").innerHTML = Object.entries(meters).map(([k, [sum, wtot]]) => {
    const pct = wtot ? Math.round(100 * sum / (3 * wtot)) : 0;
    return `<div class="meter"><div class="mhead"><span>${names[k]}</span><span>${meterLabel(k, pct)}</span></div>
      <div class="track"><div class="fill" style="width:${pct}%"></div></div></div>`;
  }).join("");
  const avg = wCount ? (wSum / wCount).toFixed(1) : "1.0";
  $("profileNote").textContent = `Weighted by your confidence slider — your average pick strength was ${avg} / 5. Strong opinions shaped this profile most.`;
}
$("retakeBtn").onclick = async () => {
  const email = currentUser();
  const fresh = { answers: {}, current: 0, finished: false };
  store.set(quizKey(email), fresh);
  await upsertNow(fresh);
  renderHome();
  show("view-home");
};

/* ————— Boot ————— */
(async function init() {
  store.del("dib_session"); // legacy v2 key, no longer used
  if (!sb) { show("view-auth"); return; }
  const { data } = await sb.auth.getSession();
  if (data && data.session && data.session.user) {
    sessionUser = { id: data.session.user.id, email: data.session.user.email };
    await hydrateFromCloud();
    renderHome();
    show("view-home");
  } else {
    show("view-auth");
  }
})();
