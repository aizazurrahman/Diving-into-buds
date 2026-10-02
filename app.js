// Diving into Buds — app logic
// Accounts & progress are stored in this browser (localStorage).
// GitHub Pages is static hosting, so there is no server or database:
// an "account" here is per-browser, perfect for a demo/MVP.

const $ = (id) => document.getElementById(id);
const store = {
  get(k, d) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch { return d; } },
  set(k, v) { localStorage.setItem(k, JSON.stringify(v)); },
  del(k) { localStorage.removeItem(k); }
};

const TOTAL = QUESTIONS.length;

/* ————— Password hashing (demo-grade) ————— */
async function hashPw(pw) {
  const salted = "dib::" + pw;
  if (window.crypto && crypto.subtle) {
    const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(salted));
    return "sha256:" + [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2, "0")).join("");
  }
  let h = 5381;
  for (let i = 0; i < salted.length; i++) h = ((h * 33) ^ salted.charCodeAt(i)) >>> 0;
  return "djb2:" + h.toString(16);
}

/* ————— Session & users ————— */
const getUsers = () => store.get("dib_users", {});
const currentUser = () => store.get("dib_session", null);
const quizKey = (email) => "dib_quiz_" + email;
const getQuiz = (email) => store.get(quizKey(email), { answers: {}, current: 0, finished: false });
const saveQuiz = (email, q) => store.set(quizKey(email), q);
const answeredCount = (q) => Object.keys(q.answers).length;

/* ————— View switching ————— */
function show(view) {
  ["view-auth", "view-home", "view-quiz", "view-results"].forEach(v => $(v).hidden = v !== view);
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

$("authForm").addEventListener("submit", async (ev) => {
  ev.preventDefault();
  const email = $("authEmail").value.trim().toLowerCase();
  const pw = $("authPassword").value;
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return authFail("That email doesn't look right — try again?");
  if (pw.length < 6) return authFail("Password needs at least 6 characters.");
  const users = getUsers();
  const hash = await hashPw(pw);
  if (authMode === "signup") {
    if (users[email]) return authFail("An account with this email already exists — try logging in.");
    users[email] = { pw: hash, created: Date.now() };
    store.set("dib_users", users);
  } else {
    if (!users[email]) return authFail("No account found for this email — sign up first?");
    if (users[email].pw !== hash) return authFail("Wrong password — try again.");
  }
  store.set("dib_session", email);
  renderHome();
  show("view-home");
});

$("logoutBtn").onclick = () => { store.del("dib_session"); show("view-auth"); };

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
    $("homeText").textContent = `You've answered ${n} of ${TOTAL} questions — everything is saved. Pick up right where you left off.`;
    $("primaryAction").textContent = `Continue — question ${n + 1}`;
    restart.hidden = false;
  } else {
    $("homeTitle").textContent = "Ready to dive in?";
    $("homeText").textContent = "50 questions about the food you love — starting in Hyderabad, ending wherever your cravings live. About 4 minutes, and you can save & exit anytime.";
    $("primaryAction").textContent = "Start the 50 questions";
    restart.hidden = true;
  }
}
$("primaryAction").onclick = () => {
  const email = currentUser(); const q = getQuiz(email);
  if (q.finished) { renderResults(); show("view-results"); return; }
  // resume at the first unanswered question
  let idx = 0; while (idx < TOTAL && q.answers[idx] !== undefined) idx++;
  q.current = Math.min(idx, TOTAL - 1);
  saveQuiz(email, q);
  renderQuestion();
  show("view-quiz");
};
$("restartBtn").onclick = () => {
  if (!confirm("Start over? Your saved answers will be cleared.")) return;
  const email = currentUser();
  store.del(quizKey(email));
  renderHome();
};

/* ————— Quiz ————— */
function renderQuestion() {
  const email = currentUser(); const q = getQuiz(email);
  const i = Math.max(0, Math.min(q.current, TOTAL - 1));
  const item = QUESTIONS[i];
  const n = answeredCount(q);
  $("qCounter").textContent = `Question ${i + 1} of ${TOTAL}`;
  $("progressBar").style.width = (n / TOTAL * 100) + "%";
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
    b.className = "opt" + (q.answers[i] === oi ? " picked" : "");
    b.textContent = opt.t;
    b.onclick = () => answer(i, oi);
    box.appendChild(b);
  });
  $("backBtn").style.visibility = i === 0 ? "hidden" : "visible";
  $("savedNote").textContent = n ? `✓ ${n} answer${n > 1 ? "s" : ""} saved` : "";
  $("qCard").style.animation = "none"; void $("qCard").offsetWidth; $("qCard").style.animation = "";
}
function answer(i, oi) {
  const email = currentUser(); const q = getQuiz(email);
  q.answers[i] = oi;
  if (answeredCount(q) >= TOTAL) {
    q.finished = true; saveQuiz(email, q);
    setTimeout(() => { renderResults(); show("view-results"); }, 260);
    return;
  }
  let next = i + 1;
  while (next < TOTAL && q.answers[next] !== undefined) next++;
  q.current = next < TOTAL ? next : i + 1;
  saveQuiz(email, q);
  setTimeout(renderQuestion, 220);
}
$("backBtn").onclick = () => {
  const email = currentUser(); const q = getQuiz(email);
  q.current = Math.max(0, q.current - 1);
  saveQuiz(email, q);
  renderQuestion();
};
$("saveExitBtn").onclick = () => { renderHome(); show("view-home"); };

/* ————— Results / taste profile ————— */
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
  const meters = { spice: [0, 0], sweet: [0, 0], adv: [0, 0] }; // [sum, count]
  Object.entries(q.answers).forEach(([qi, oi]) => {
    const opt = QUESTIONS[+qi].options[oi];
    (opt.tags || []).forEach(t => tagCount[t] = (tagCount[t] || 0) + 1);
    ["spice", "sweet", "adv"].forEach(k => {
      if (typeof opt[k] === "number") { meters[k][0] += opt[k]; meters[k][1]++; }
    });
  });
  const top = Object.entries(tagCount).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([t]) => t);
  $("profileSummary").textContent = top.length >= 2
    ? `In one line: ${TAG_LABELS[top[0]].replace(/^\S+ /, "")} meets ${TAG_LABELS[top[1]].replace(/^\S+ /, "").toLowerCase()}. Here's the full picture:`
    : "Here's what your answers say about your palate:";
  $("profileTraits").innerHTML = top.map(t => `<span class="trait">${TAG_LABELS[t] || t}</span>`).join("");
  const names = { spice: "🌶️ Heat level", sweet: "🍮 Sweet tooth", adv: "🧭 Adventurousness" };
  $("profileMeters").innerHTML = Object.entries(meters).map(([k, [sum, cnt]]) => {
    const pct = cnt ? Math.round(100 * sum / (3 * cnt)) : 0;
    return `<div class="meter"><div class="mhead"><span>${names[k]}</span><span>${meterLabel(k, pct)}</span></div>
      <div class="track"><div class="fill" style="width:${pct}%"></div></div></div>`;
  }).join("");
}
$("retakeBtn").onclick = () => {
  const email = currentUser();
  store.del(quizKey(email));
  renderHome();
  show("view-home");
};

/* ————— Boot ————— */
if (currentUser()) { renderHome(); show("view-home"); } else { show("view-auth"); }
