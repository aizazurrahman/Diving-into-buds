# Diving into Buds 🍽️

This repo serves as a landing page into your taste buds.

**Diving into Buds** is a 50-question taste-profile experience for a global audience. Create an account, pick two fundamentals — **your diet** (Everything · Vegetarian · Vegan · Everything Halal) and **your roots** (Hyderabad · Asia · Americas · Europe) — and your 50 questions are built around you from a bank of ~176 questions, each with its own picture.

- 🧭 **Fundamentals-driven**: every combination of diet × roots gets a different set of questions, starting from your region's recipes and widening out to world flavours matched to your palate
- 🥗 **Diet-safe by design**: vegetarians and vegans never see meat options; halal users never see pork or alcohol; "Everything" users first pick the meats they eat, and later questions respect that too (including multi-select questions where picking several applies)
- 🎚️ Every pick has a **confidence slider**: 1 = "almost a tie", 5 = "no contest" — strong opinions weigh more in your profile
- 💾 Save & exit anytime (the button is always on screen) — your answers wait for you when you log back in, on any device
- 🎉 Finish all 50 to reveal your taste profile: top traits, heat / sweet-tooth / adventurousness meters, and personalised "flavours to meet next" recommendations
- 📱 Minimal, mobile-friendly, no frameworks — just HTML, CSS & JavaScript

## Run it

Hosted free on GitHub Pages. Any static host works too — just serve the files.

> Accounts are real: sign-up/login and progress are powered by Supabase (email/password auth + a Postgres `progress` table with row-level security), so your taste profile follows you across devices. Completed results can also be sent to a Google Sheet for analysis (Apps Script endpoint in `app.js`).
