# Diving into Buds 🍽️

This repo serves as a landing page into your taste buds.

**Diving into Buds** is a taste-profile experience for a global audience. Create an account, pick two fundamentals — **your diet** (Everything · Vegetarian · Vegan · Everything Halal) and **your roots** (Africa · East/Southeast Asia · Europe · Hyderabad, India · Latin America & The Caribbean · Middle-Eastern · South Asia · United States) — then tell us **which city you live in** (a type-ahead over ~330 major world cities, so the name stored is always the canonical "City, Country"). Every run is a standard **50 questions: your first 20 are on your own region's food, the last 30 are on food across the globe**, built for you from a bank of 330 questions. Diet and roots shape the questions; your city does not — it is only used afterwards for the "Find it near you" links on your recommendations.

- 🧭 **Fundamentals-driven**: every combination of diet × roots gets a different set of questions — each roots group has its own intimately layered set (its own warm-ups, dislike list, breakfast and comfort picks, crown dessert, and fusion ladder), never the same questions re-skinned
- 🥗 **Diet-safe by design**: vegetarians and vegans never see meat options; halal users never see pork or alcohol; meat-eaters are never offered vegetarian stand-ins for canonical meat dishes; "Everything" and Halal users first pick the meats they eat in preference order, and later questions respect that too — fish & prawns and all seafood are separate picks, and duck and quail are their own meats
- 🍚 **Anchor-dish branches**: each region has an anchor dish (biryani, ramen, a BBQ tray, pasta, thali, kebab, jollof, tacos…); the follow-up questions match your actual #1 pick — pick biryani and you get its kind, masala ratio and plate questions; pick mandi, tacos or any other anchor and you get that dish's own kind and accompaniment questions
- 👅 **Flavour-first global half**: the last 30 questions probe heat, richness, tang, texture, smoke and openness to new combinations across world cuisines, including a salad pair — your stance on salad, plus a follow-up bowl question only salad-likers see
- 🥇 **Ranked picks & hard no's**: key questions take a ranked top 3 (scored 1 / ½ / ⅓) and multi-selects remember tap order; dislike questions record hard no's that push matching flavours down and keep them out of recommendations
- ⓘ **Info notes where they help**: tiny ⓘ buttons on the fundamental options and many questions explain an unfamiliar dish or term
- ⬆️ Every pick has a **confidence slider** — you slide an up-arrow badge, not a plain circle: 1 = "almost a tie", 5 = "no contest" — strong opinions weigh more in your profile
- 📸 **A real photo for nearly every question**: 325 of the 330 questions carry a photo that was sourced dish-by-dish and checked against the subject; the five dishes with no honest photo anywhere keep an emoji fallback
- 💾 Save & exit anytime (the button is always on screen) — your answers wait for you when you log back in, on any device
- 🏁 Short on time? An **End here** button appears after 10 answers and finishes right there — the results carry a heads-up that the profile is based on limited information
- 🎉 Finish to reveal your taste profile: eight palate bars (heat level, sweet tooth, adventurousness, smoke & char, tang & sour, rich & creamy, fresh & bright, and comfort & classic), top traits, the flavours you're drawn to and your hard no's shown as chips, and personalised "flavours to meet next" recommendations — each dish scores 2 points per match tag in your top-5 profile tags, plus 1 bonus point if it is not from your own roots, the ten picks are spread across regions (never more than two from one), and a "Show me different flavours" button swaps in the next ten matches, each with a "Find it near you" link for your city
- 📱 Minimal, mobile-friendly, no frameworks — just HTML, CSS & JavaScript

## Run it

Hosted free on GitHub Pages: https://aizazurrahman.github.io/Diving-into-buds/ — any static host works too; just serve the files.

> Accounts are real: sign-up/login and progress are powered by Supabase (email/password auth + a Postgres `progress` table with row-level security), so your taste profile follows you across devices. Completed results are also posted to a Google Sheet for analysis (Apps Script endpoint in `app.js`).
