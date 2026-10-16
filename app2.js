/* Diving into Buds — app part 2: the Places layer (v33 Tier 2,
   Geoapify/OpenStreetMap + the parked Google Places provider).
   Loaded by index.html immediately BEFORE app.js. Split out of app.js
   at v80 (2026-10-15 revamp): the revamp grew app.js past the ~131KB
   single-push cap; this layer is declarations-only (keys, caches and
   functions called at render time), so it travels as its own file —
   the same pattern as the recs.js pool split. */
/* ————— Places (v33 — Aizaz's Tier 2 via Geoapify / OpenStreetMap) —————
   Each result card's generic Maps link is upgraded, when possible, to a
   REAL named restaurant in the profile's city (the destination when
   travelling): one city-wide restaurant pool is fetched per results view
   and dishes are matched against it client-side by name tokens and the
   dish region's cuisine words. Failure-silent throughout (the community
   pattern): no key, API down or no match → the card keeps its Maps link,
   and the site never depends on this layer. */
const GEOAPIFY_KEY = "79a958030a5b49e191bdf89215ce9710"; // Aizaz's free Geoapify key (client-side key, public by design; empty = layer off)
const GOOGLE_PLACES_KEY = ""; // Aizaz's Google Places API (New) key; empty = ratings layer off, Geoapify still applies
let placesOff = false;
const geoMemCache = {}, poolMemCache = {};
const REGION_CUISINES = {
  hyderabad: ["biryani", "hyderabadi", "deccan", "indian", "kebab", "mughlai"],
  southasia: ["indian", "biryani", "punjabi", "bengali", "sri lankan", "nepali", "pakistani", "curry"],
  eastasia: ["chinese", "japanese", "korean", "thai", "vietnamese", "asian", "noodle", "sushi", "ramen", "malaysian", "indonesian"],
  middleeast: ["lebanese", "arab", "turkish", "persian", "middle eastern", "mediterranean", "kebab", "egyptian", "moroccan"],
  europe: ["italian", "french", "spanish", "greek", "mediterranean", "german", "polish", "european", "pizza", "portuguese"],
  africa: ["ethiopian", "african", "nigerian", "moroccan", "south african", "egyptian", "kenyan", "ghanaian"],
  latinamerica: ["mexican", "peruvian", "brazilian", "argentinian", "colombian", "cuban", "latin", "taco", "caribbean"],
  unitedstates: ["american", "burger", "bbq", "barbecue", "southern", "cajun", "diner", "steakhouse", "tex-mex"],
  oceania: ["australian", "pacific", "cafe", "bakery", "kiwi"]
};
async function geoCity(city) {
  if (geoMemCache[city]) return geoMemCache[city];
  const lsKey = "dib_geo_v1_" + city;
  try { const c = JSON.parse(localStorage.getItem(lsKey) || "null"); if (c && c.placeId) { geoMemCache[city] = c; return c; } } catch (e) {}
  const d = await fetchJsonTimeout(`https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(city)}&type=city&format=json&limit=1&apiKey=${GEOAPIFY_KEY}`, 6000);
  const r = d && d.results && d.results[0];
  if (!r || !r.place_id) throw new Error("geocode miss");
  const out = { placeId: r.place_id, lon: r.lon, lat: r.lat };
  geoMemCache[city] = out;
  try { localStorage.setItem(lsKey, JSON.stringify(out)); } catch (e) {}
  return out;
}
async function cityPool(city) {
  if (poolMemCache[city]) return poolMemCache[city];
  // v63.1: the full city pool is cached per city for a day (localStorage) —
  // paging a big city costs 3 fetches; repeat views must not re-pay it.
  try {
    const hit = JSON.parse(localStorage.getItem("dib_pool_v2_" + city) || "null");
    if (hit && hit.t && Date.now() - hit.t < 86400000 && Array.isArray(hit.pool) && hit.pool.length) { poolMemCache[city] = hit.pool; return hit.pool; }
  } catch (e) {}
  const g = await geoCity(city);
  const cats = "catering.restaurant,catering.cafe,catering.fast_food";
  const page = async (off) => {
    const d = await fetchJsonTimeout(`https://api.geoapify.com/v2/places?categories=${cats}&filter=place:${g.placeId}&bias=proximity:${g.lon},${g.lat}&limit=500&offset=${off}&apiKey=${GEOAPIFY_KEY}`, 8000);
    return (d && d.features) || [];
  };
  // Geoapify serves ONE fixed-order slice of 500 per call — a big city has
  // ~1,500 matches, so without paging, whole districts never enter the pool
  // (the Paris pile-up: bias gave the 5th; no bias alone gives the east).
  let feats = await page(0);
  if (feats.length >= 500) {
    const more = await Promise.all([page(500), page(1000)]);
    feats = feats.concat(more[0], more[1]);
  }
  if (!feats.length) {
    const d = await fetchJsonTimeout(`https://api.geoapify.com/v2/places?categories=${cats}&filter=circle:${g.lon},${g.lat},12000&limit=500&apiKey=${GEOAPIFY_KEY}`, 8000);
    feats = (d && d.features) || [];
  }
  const seenPlace = new Set();
  const pool = feats.map(f => {
    const p = f.properties || {}, raw = (p.datasource && p.datasource.raw) || {};
    const areaRaw = typeof p.address_line2 === "string" ? p.address_line2.split(",")[0].trim() : "";
    // OSM data hazard (found via New York, 2026-10-15): a place's "name"
    // tag can be a NUMBER (a street-number node named "375") — truthy, so
    // it survived the old filter, then p.name.toLowerCase() threw inside
    // dishPlaceFor and the catch in upgradePlaces killed the whole layer
    // for the city (placesOff). Coerce every text field to a string here
    // and drop names that are not real names (empty or purely numeric).
    return {
      name: typeof p.name === "string" ? p.name.trim() : "",
      area: (typeof p.suburb === "string" && p.suburb) || (typeof p.district === "string" && p.district) || (areaRaw && areaRaw.toLowerCase() !== city.split(",")[0].toLowerCase() ? areaRaw : "") || "",
      cuisine: (typeof raw.cuisine === "string" ? raw.cuisine : "").toLowerCase(),
      cats: (Array.isArray(p.categories) ? p.categories : []).join(" ").toLowerCase(),
      website: typeof raw.website === "string" ? raw.website : (typeof p.website === "string" ? p.website : ""),
      distKm: (typeof p.lat === "number" && typeof p.lon === "number") ? Math.hypot((p.lon - g.lon) * 85, (p.lat - g.lat) * 111) : 0
    };
  }).filter(x => { if (!x.name || /^\d+$/.test(x.name)) return false; const k = x.name + "|" + x.area; if (seenPlace.has(k)) return false; seenPlace.add(k); return true; });
  poolMemCache[city] = pool;
  try { localStorage.setItem("dib_pool_v2_" + city, JSON.stringify({ t: Date.now(), pool })); } catch (e) {}
  return pool;
}
// Revamp F3 — places honesty: dishPlaceFor's score mixes two very
// different kinds of match. A dish-NAME match (a token of the dish's
// name in the place's name) means the place is known for this dish; a
// cuisine-only match means it's a real restaurant of the right cuisine
// family in the city. Both are useful; they must not render with the
// same confidence. dishNameHit re-derives which kind a chosen place is,
// with the same tokenisation the matcher uses.
// Generic ingredient words are not dish identities: "chicken" in a place
// name must not read as "known for Chicken dum biryani" (it fronted a
// burger joint with the full found treatment in New York). Dish-defining
// words (biryani, ramen, sushi, pizza, taco) stay matchable.
const GENERIC_DISH_TOKENS = new Set(["chicken", "beef", "pork", "lamb", "goat", "fish", "shrimp", "prawn", "cheese", "rice", "bread", "egg", "eggs", "potato", "corn", "bean", "beans", "mushroom", "vegetable", "vegetables", "mixed", "grilled", "fried", "spicy", "sweet", "sour", "cream", "butter", "garlic", "onion", "tomato", "lemon", "mint", "coconut", "peanut", "sesame", "honey", "sugar", "milk", "pork", "mutton", "veg", "nonveg"]);
function dishNameHit(dishName, placeName) {
  const stop = new Set(["style", "with", "and", "the"]);
  const toks = String(dishName || "").toLowerCase().replace(/[^a-z ]/g, " ").split(/\s+/).filter(w => w.length >= 4 && !stop.has(w) && !GENERIC_DISH_TOKENS.has(w));
  const nm = String(placeName || "").toLowerCase();
  return toks.some(t => nm.includes(t));
}
// OSM area labels can be raw admin wards ("Ward 84 Bagh Amberpet",
// "Marredpally mandal") — strip the machinery, keep the place name.
function cleanArea(a) {
  return String(a || "").replace(/^Ward\s+\d+\s+/i, "").replace(/\s+mandal$/i, "").trim();
}
const REGION_PRETTY = { hyderabad: "Hyderabadi", southasia: "South Asian", eastasia: "East Asian", middleeast: "Middle Eastern", europe: "European", africa: "African", latinamerica: "Latin American", unitedstates: "American", oceania: "Pacific" };
function dishPlaceFor(dishName, pool, usedCounts, areaCounts) {
  const rec = RECS.find(x => x.dish === dishName) || {};
  const stop = new Set(["style", "with", "and", "the"]);
  const toks = dishName.toLowerCase().replace(/[^a-z ]/g, " ").split(/\s+/).filter(w => w.length >= 4 && !stop.has(w) && !GENERIC_DISH_TOKENS.has(w));
  const cuis = REGION_CUISINES[rec.region] || [];
  let best = null, bestScore = 0;
  pool.forEach(p => {
    if (!p || typeof p.name !== "string" || !p.name) return; // one malformed entry must never kill the whole city's matching
    if (usedCounts && (usedCounts.get(p.name) || 0) >= 2) return; // one place fronts at most 2 cards
    const nm = p.name.toLowerCase();
    let sc = 0;
    toks.forEach(t => { if (nm.includes(t)) sc += 5; }); // dish words in the place's NAME: it is known for this dish — beats any cuisine-tag fit
    if (cuis.some(c => nm.includes(c) || p.cuisine.includes(c) || p.cats.includes(c))) sc += 2; // cuisine fit counts once, however many words hit
    if (p.website) sc += 0.5;
    sc -= Math.min(p.distKm || 0, 20) * 0.02;
    if (areaCounts && p.area && (areaCounts.get(p.area) || 0) >= 2) sc -= 1.5; // spread cards across the city's areas, not one neighbourhood
    if (sc > bestScore) { bestScore = sc; best = p; }
  });
  return bestScore >= 2 ? best : null;
}
async function upgradePlaces(res) {
  if (!GEOAPIFY_KEY || placesOff || !res || !res.city) return 0;
  try {
    const pool = await cityPool(res.city);
    if (!pool.length) return 0;
    let any = 0;
    const usedCounts = new Map();
    const areaCounts = new Map();
    document.querySelectorAll("#profileRecs .r-place").forEach(a => {
      if (a.dataset.places) return; // a higher-priority layer already claimed this card
      // Second pass without the area-spread penalty: a real place in an
      // already-fronted area beats no place at all (late-list dishes —
      // desserts especially — were losing their only candidates to it).
      const p = dishPlaceFor(a.dataset.dish || "", pool, usedCounts, areaCounts) || dishPlaceFor(a.dataset.dish || "", pool, usedCounts, null);
      if (p) {
        const area = cleanArea(p.area);
        if (dishNameHit(a.dataset.dish || "", p.name)) {
          // Known for this dish — the full "found" treatment.
          a.innerHTML = `📍 ${p.name}${area ? `<small>${area}</small>` : ""}`;
          a.classList.remove("generic"); a.classList.add("found");
        } else {
          // Cuisine-only match (F3): a real place of the right cuisine
          // family nearby — honest framing, outlined button, no
          // "found" gradient confidence.
          const rec = RECS.find(x => x.dish === (a.dataset.dish || "")) || {};
          const lbl = REGION_PRETTY[rec.region] || "Local";
          a.innerHTML = `📍 ${p.name}<small>${area ? area + " · " : ""}${lbl} place nearby</small>`;
        }
        a.href = "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(p.name + " " + res.city);
        a.dataset.places = "geoapify";
        usedCounts.set(p.name, (usedCounts.get(p.name) || 0) + 1);
        if (p.area) areaCounts.set(p.area, (areaCounts.get(p.area) || 0) + 1);
        any++;
      }
    });
    return any;
  } catch (e) { placesOff = true; return 0; }
}
function appendPlacesAttr(googleUsed, geoapifyUsed) {
  if (document.querySelector(".places-attr")) return;
  const seg = [];
  if (geoapifyUsed) seg.push('Restaurant picks from OpenStreetMap data · Powered by <a href="https://www.geoapify.com/" target="_blank" rel="noopener">Geoapify</a> · <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">© OpenStreetMap contributors</a>');
  if (googleUsed) seg.push((geoapifyUsed ? "" : "Restaurant picks · ") + "Ratings by Google");
  if (!seg.length) return;
  const d = document.createElement("p");
  d.className = "places-attr";
  d.innerHTML = seg.join(" · ");
  const host = $("profileRecs");
  if (host && host.parentNode) host.parentNode.insertBefore(d, host.nextSibling);
}
async function upgradeAllPlaces(res) {
  let g = 0, a = 0;
  try { g = await upgradePlacesGoogle(res); } catch (e) {}
  try { a = await upgradePlaces(res); } catch (e) {}
  if (g + a > 0) appendPlacesAttr(g > 0, a > 0);
  // Revamp G8: when no place matched anywhere, say so once, plainly —
  // the failure used to be silent, leaving 20 generic buttons with no
  // explanation.
  const host = $("profileRecs");
  if (host && host.parentNode && res && res.city) {
    let note = $("placesNote");
    if (g + a === 0) {
      if (!note) { note = document.createElement("p"); note.id = "placesNote"; note.className = "places-note"; host.parentNode.insertBefore(note, host); }
      note.textContent = `We couldn't match specific places in ${res.city.split(",")[0]} for these dishes yet — every card still opens a live map search for the dish.`;
      note.hidden = false;
    } else if (note) note.hidden = true;
  }
}
/* Google Places layer (Aizaz, 2026-10-12): Geoapify/OSM carries no
   ratings, so dish-level fame comes from Google — one Text Search per
   recommended dish ("{dish} in {city}"), candidates ranked by rating
   weighted by review volume. Google runs FIRST and claims its cards;
   the Geoapify matcher fills whatever remains. Results cache per
   city+dish for 7 days (localStorage) + per session, and searches are
   capped per results view — the first 1,000 searches/month are free.
   Failure-silent like everything else in this module. */
// === GOOGLE PLACES LAYER: PURE HELPERS ===
function gFame(p) { return (p.rating || 0) * Math.log10((p.userRatingCount || 0) + 1); }
function gPickBest(places) {
  const ps = (places || []).filter(p => p && p.displayName && p.displayName.text);
  if (!ps.length) return null;
  let best = ps[0];
  for (const p of ps.slice(1)) if (gFame(p) > gFame(best) * 1.5) best = p;
  return best;
}
function gAreaOf(formattedAddress, city) {
  const parts = String(formattedAddress || "").split(",").map(s => s.trim()).filter(Boolean);
  if (parts.length < 2) return "";
  const cityBase = String(city || "").split(",")[0].trim().toLowerCase();
  const idx = parts.findIndex(s => s.toLowerCase().startsWith(cityBase));
  let area = "";
  if (idx > 0) area = parts[idx - 1];
  else if (parts.length >= 3) area = parts[1];
  area = (area || "").replace(/\s+\d[\d\s-]*$/, "").trim();
  if (!area || /^\d/.test(area) || area.length > 34) return "";
  return area;
}
// === END PURE HELPERS ===
const G_DISH_CAP = 12;
const gPlaceMem = {};
let googleOff = false;
async function googleDishPlace(city, dish, geo) {
  const ck = city + "|" + dish;
  if (ck in gPlaceMem) return gPlaceMem[ck];
  const lsKey = "dib_gp_v1_" + ck;
  try { const c = JSON.parse(localStorage.getItem(lsKey) || "null"); if (c && c.t && Date.now() - c.t < 7 * 24 * 3600 * 1000) { gPlaceMem[ck] = c.p; return c.p; } } catch (e) {}
  let out = null;
  const ctl = new AbortController();
  const to = setTimeout(() => ctl.abort(), 8000);
  try {
    const body = { textQuery: dish + " in " + city, pageSize: 5 };
    if (geo && geo.lon != null && geo.lat != null) body.locationBias = { circle: { center: { latitude: geo.lat, longitude: geo.lon }, radius: 15000.0 } };
    const r = await fetch("https://places.googleapis.com/v1/places:searchText", { method: "POST", signal: ctl.signal, headers: { "Content-Type": "application/json", "X-Goog-Api-Key": GOOGLE_PLACES_KEY, "X-Goog-FieldMask": "places.displayName,places.rating,places.userRatingCount,places.formattedAddress,places.googleMapsUri" }, body: JSON.stringify(body) });
    if (!r.ok) throw new Error("google places " + r.status);
    const d = await r.json();
    const best = gPickBest(d.places);
    if (best) out = { name: best.displayName.text, area: gAreaOf(best.formattedAddress, city), rating: best.rating || null, uri: best.googleMapsUri || "" };
  } finally { clearTimeout(to); }
  gPlaceMem[ck] = out;
  try { localStorage.setItem(lsKey, JSON.stringify({ t: Date.now(), p: out })); } catch (e) {}
  return out;
}
async function upgradePlacesGoogle(res) {
  if (!GOOGLE_PLACES_KEY || googleOff || !res || !res.city) return 0;
  const anchors = Array.from(document.querySelectorAll("#profileRecs .r-place"));
  if (!anchors.length) return 0;
  let geo = null;
  try { geo = await geoCity(res.city); } catch (e) {}
  let used = 0, upgraded = 0;
  const seen = new Set();
  for (const a of anchors) {
    if (used >= G_DISH_CAP || googleOff) break;
    const dish = a.dataset.dish || "";
    if (!dish || seen.has(dish) || a.dataset.places) continue;
    seen.add(dish); used++;
    let p = null;
    try { p = await googleDishPlace(res.city, dish, geo); } catch (e) { googleOff = true; break; }
    if (p) {
      a.innerHTML = `📍 ${p.name}${(p.area || p.rating) ? `<small>${[p.area, p.rating ? "★" + p.rating.toFixed(1) : ""].filter(Boolean).join(" · ")}</small>` : ""}`;
      a.classList.remove("generic"); a.classList.add("found");
      a.href = p.uri || ("https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(p.name + " " + res.city));
      a.dataset.places = "google";
      upgraded++;
    }
  }
  return upgraded;
}
// Landing backdrop parallax (transform-only, reduced-motion safe)
(() => {
  const fx = document.querySelector(".bg-fx");
  if (!fx || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  let ticking = false;
  addEventListener("scroll", () => {
    if (ticking) return; ticking = true;
    requestAnimationFrame(() => { fx.style.transform = `translateY(${Math.min(window.scrollY * 0.05, 110)}px)`; ticking = false; });
  }, { passive: true });
})();
function finishNow(early) {
  st.finished = true;
  st.result = computeResult(st);
  st.altRecs = altRecsCache;
  const skippedInRun = st.skipped ? Object.keys(st.skipped).filter(id => st.order.includes(id)).length : 0;
  if (early || answeredCount(st) < runTotal(st)) { st.result.partial = true; st.result.answered = answeredCount(st); st.result.skipped = skippedInRun; st.result.early = !!early; }
  saveState();
  sendToSheets();
  revealResults();
}
// ——— Fine-tune (Aizaz, 2026-10-15): the optional pass between the last
// question and the reveal. finish() parks here first; the screen writes
// st.fineTune (or null), then finishNow() (app2.js) computes + reveals
// exactly as before. Also re-openable from the results fork ("Adjust"),
// where confirming recomputes the same profile with the new tuning.
let ftEarly = false, ftEditing = false, ftDraft = null;
function finish(early) {
  if (typeof document === "undefined" || !$("view-finetune")) return finishNow(early);
  ftEarly = !!early; ftEditing = false;
  openFineTune();
}
const FT_NOT_TONIGHT = ["Mushrooms", "Coriander", "Offal", "Blue cheese", "Olives", "Onions", "Peanuts", "Prawns"];
const FT_SPICE_LABELS = ["", "Barely a whisper", "Gentle warmth", "Properly hot", "Serious fire", "Bring the fire"];
function ftChipRow(el, opts, cur, onPick) {
  el.innerHTML = "";
  opts.forEach(([v, label]) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "ft-chip" + (String(cur) === String(v) ? " sel" : "");
    b.textContent = label;
    b.onclick = () => onPick(v);
    el.appendChild(b);
  });
}
function ftSummaryParts(ft, res) {
  if (!ft) return [];
  const parts = [];
  const cityName = ((res && res.city) || "").split(",")[0];
  if (ft.scope === "roots") parts.push("My roots" + (res && res.ftScopeWidened ? " (no exact matches — widened)" : ""));
  if (ft.scope === "local") parts.push("Local to " + (cityName || "your city") + (res && res.ftScopeWidened ? " (no exact matches — widened)" : ""));
  if (ft.scope === "surprise") parts.push("Surprise me");
  if (ft.heft === 1) parts.push("Light");
  if (ft.heft === 2) parts.push("In between");
  if (ft.heft === 3) parts.push("Full feast");
  if (ft.kind) parts.push(({ veg: "Veg", nonveg: "Non-veg", seafood: "Seafood" })[ft.kind] + (res && res.ftKindWidened ? " (no exact matches — widened)" : ""));
  if (ft.spice) parts.push("Heat " + ft.spice + "/5");
  if ((ft.notTonight || []).length) parts.push("No " + ft.notTonight.join(", ").toLowerCase());
  return parts;
}
function openFineTune() {
  const bf = (st && st.builtFor) || {};
  const cityName = (bf.city || "").split(",")[0] || "your city";
  ftDraft = Object.assign({ scope: "", kind: "", heft: 0, spice: 3, notTonight: [] }, (st && st.fineTune) || {});
  if (!ftDraft.spice) ftDraft.spice = 3; // builds ≤85 could save spice 0 ("Any") — the slider now rests at neutral 3
  delete ftDraft.adv; // the adventure dial was removed at Aizaz's word (build 86)
  ftDraft.notTonight = [...(ftDraft.notTonight || [])];
  if ((bf.diet === "vegan" || bf.diet === "vegetarian") && ftDraft.kind && ftDraft.kind !== "veg") ftDraft.kind = "";
  const paintSingles = () => {
    ftChipRow($("ftScopeRow"), [["roots", "🏠 My roots"], ["local", "📍 Local to " + cityName], ["surprise", "🌍 Surprise me"]], ftDraft.scope, v => { ftDraft.scope = ftDraft.scope === v ? "" : v; paintSingles(); });
    ftChipRow($("ftHeftRow"), [[1, "🥗 Light"], [2, "🍽️ In between"], [3, "🍖 Full feast"]], ftDraft.heft, v => { ftDraft.heft = ftDraft.heft === v ? 0 : v; paintSingles(); });
    const kindNote = $("ftKindNote");
    if (bf.diet === "vegan" || bf.diet === "vegetarian") {
      $("ftKindRow").innerHTML = "";
      kindNote.hidden = false;
      kindNote.textContent = bf.diet === "vegan" ? "Set by your diet — everything on your list is plant-based already." : "Set by your diet — your list is vegetarian; a fine-tune can't add meat back.";
    } else {
      kindNote.hidden = true;
      ftChipRow($("ftKindRow"), [["veg", "🌱 Veg"], ["nonveg", "🍗 Non-veg"], ["seafood", "🦐 Seafood"]], ftDraft.kind, v => { ftDraft.kind = ftDraft.kind === v ? "" : v; paintSingles(); });
    }
    const notRow = $("ftNotRow");
    notRow.innerHTML = "";
    FT_NOT_TONIGHT.forEach(name => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "ft-chip" + (ftDraft.notTonight.includes(name) ? " sel" : "");
      b.textContent = name;
      b.onclick = () => { const i = ftDraft.notTonight.indexOf(name); if (i >= 0) ftDraft.notTonight.splice(i, 1); else ftDraft.notTonight.push(name); paintSingles(); };
      notRow.appendChild(b);
    });
  };
  paintSingles();
  const paintSpice = () => {
    const v = ftDraft.spice || 3;
    $("ftSpice").value = v;
    $("ftSpice").style.setProperty("--valp", ((v - 1) / 4 * 100) + "%");
    $("ftSpiceVal").textContent = FT_SPICE_LABELS[v];
  };
  paintSpice();
  $("ftSpice").oninput = e => { ftDraft.spice = +e.target.value; paintSpice(); };
  $("ftSkipBtn").textContent = ftEditing ? "Remove fine-tuning" : "Skip — as I answered";
  show("view-finetune");
  window.scrollTo({ top: 0 });
}
function revealResults() {
  const reduced = !!(window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches);
  // v23.3: the hole's grey dots are generated once per reveal — random
  // angles, radii and greys, so no two compilations look the same.
  const dots = $("holeDots");
  if (dots && !reduced) {
    const maxR = Math.round(Math.max(160, Math.min(window.innerWidth, window.innerHeight) * 0.46));
    let html = "";
    for (let i = 0; i < 150; i++) {
      const a = Math.round(Math.random() * 360);
      const r = Math.round(95 + Math.random() * (maxR - 95));
      const d = (Math.random() * 2.4).toFixed(2);
      const g = 110 + Math.round(Math.random() * 120);
      html += `<span style="--a:${a}deg;--r:${r}px;--d:${d}s;background:rgb(${g},${g},${g})"></span>`;
    }
    dots.innerHTML = html;
  }
  show("view-compiling");
  window.scrollTo({ top: 0 });
  // Revamp G8: the compiling phrases speak the user's own data back —
  // their roots, their first favourite, a hard no standing guard, their
  // city — instead of five generic lines any profile could get. (The
  // animation itself is owner-specified and untouched.)
  const bf = (st && st.builtFor) || {};
  const love0 = ((Array.isArray(st.loves) ? st.loves : []).map(id => (st.lovesData || {})[id]).filter(d => d && d.n)[0] || {}).n || "";
  const av0 = st ? (aversionsOf(st)[0] || "") : "";
  const phrases = [
    "Reading your palate…",
    bf.roots ? `Weighing your ${rootsLabelOf(bf)} roots against the world…` : "Weighing your flavour axes…",
    love0 ? `Keeping ${love0} at the centre…` : "Scanning kitchens around the world…",
    av0 ? `Standing guard — no ${av0.split(" — ")[0].toLowerCase()} anywhere near your list…` : "Matching dishes to your taste…",
    bf.city ? (bf.mode === "travel" ? `Lining up ${bf.city.split(",")[0]}'s best tables…` : `Finding your flavours in ${bf.city.split(",")[0]}…`) : "Handpicking your recommendations…"
  ];
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
// v23.2 (Aizaz): a 5-second "compiling" interlude before the reveal — the
// result is already computed and saved above; only the display waits, so
// nothing real is delayed. Reduced-motion users get a brief fade instead.
let compileTimer = null, compilePhraseTimer = null;

/* ——— Reference data (moved from app.js at v80.1 for the push-size split;
   pure declarations, read at runtime by app.js) ——— */
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
const COUNTRY_REGION = { "India": "southasia", "Pakistan": "southasia", "Bangladesh": "southasia", "Sri Lanka": "southasia", "Nepal": "southasia", "Afghanistan": "southasia", "China": "eastasia", "Japan": "eastasia", "South Korea": "eastasia", "Indonesia": "eastasia", "Thailand": "eastasia", "Vietnam": "eastasia", "Malaysia": "eastasia", "Philippines": "eastasia", "Hong Kong": "eastasia", "Taiwan": "eastasia", "Singapore": "eastasia", "Myanmar": "eastasia", "Cambodia": "eastasia", "Laos": "eastasia", "Mongolia": "eastasia", "Saudi Arabia": "middleeast", "United Arab Emirates": "middleeast", "Qatar": "middleeast", "Kuwait": "middleeast", "Oman": "middleeast", "Bahrain": "middleeast", "Israel": "middleeast", "Lebanon": "middleeast", "Jordan": "middleeast", "Palestine": "middleeast", "Iran": "middleeast", "Iraq": "middleeast", "Türkiye": "middleeast", "Egypt": "middleeast", "Kazakhstan": "middleeast", "Uzbekistan": "middleeast", "United Kingdom": "europe", "Germany": "europe", "Italy": "europe", "France": "europe", "Spain": "europe", "Netherlands": "europe", "Switzerland": "europe", "Poland": "europe", "Ireland": "europe", "Belgium": "europe", "Austria": "europe", "Sweden": "europe", "Portugal": "europe", "Greece": "europe", "Norway": "europe", "Denmark": "europe", "Finland": "europe", "Czechia": "europe", "Iceland": "europe", "Hungary": "europe", "Romania": "europe", "Bulgaria": "europe", "Croatia": "europe", "Serbia": "europe", "Slovenia": "europe", "Slovakia": "europe", "Lithuania": "europe", "Latvia": "europe", "Estonia": "europe", "Ukraine": "europe", "Russia": "europe", "Georgia": "europe", "Armenia": "europe", "Azerbaijan": "europe", "South Africa": "africa", "Nigeria": "africa", "Morocco": "africa", "Kenya": "africa", "Ghana": "africa", "Ethiopia": "africa", "Tanzania": "africa", "Angola": "africa", "Mozambique": "africa", "Tunisia": "africa", "Algeria": "africa", "Mali": "africa", "Zambia": "africa", "United States": "unitedstates", "Canada": "unitedstates", "Brazil": "latinamerica", "Mexico": "latinamerica", "Colombia": "latinamerica", "Argentina": "latinamerica", "Chile": "latinamerica", "Peru": "latinamerica", "Ecuador": "latinamerica", "Uruguay": "latinamerica", "Paraguay": "latinamerica", "Bolivia": "latinamerica", "Venezuela": "latinamerica", "Panama": "latinamerica", "Costa Rica": "latinamerica", "Cuba": "latinamerica", "Dominican Republic": "latinamerica", "El Salvador": "latinamerica", "Jamaica": "latinamerica", "Puerto Rico": "latinamerica", "Australia": "oceania", "New Zealand": "oceania", "Fiji": "oceania", "Samoa": "oceania", "Tonga": "oceania", "Vanuatu": "oceania" };
