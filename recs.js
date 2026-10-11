/* Recommendation pool: 232 dishes, 29 per region, each with a course
   (drink / appetizer / main / dessert) for the course-structured results (v37).
   Loaded by index.html immediately before app.js. */
const RECS = [
 {
  "dish": "Vegetable paella",
  "yt": "https://www.youtube.com/watch?v=DIAFEcEarAA",
  "from": "Spain · Europe",
  "region": "europe",
  "diet": "vegan",
  "emoji": "🥘",
  "course": "main",
  "match": [
   "rice",
   "biryani"
  ],
  "why": "Saffron rice cooked slow in one pan — biryani's Mediterranean cousin, socarrat crust and all."
 },
 {
  "dish": "Tahdig — crispy saffron rice",
  "yt": "https://www.youtube.com/watch?v=iNH5Yqms3Yc",
  "from": "Persia · Middle East",
  "region": "middleeast",
  "diet": "vegan",
  "emoji": "🍚",
  "course": "main",
  "match": [
   "rice",
   "biryani",
   "classic"
  ],
  "why": "Fragrant rice with a golden, crunchy bottom — the part everyone fights over, as the main event."
 },
 {
  "dish": "Jambalaya",
  "yt": "https://www.youtube.com/watch?v=FET_VALgHrk",
  "from": "Louisiana · United States",
  "region": "unitedstates",
  "diet": "meat:chicken",
  "emoji": "🍤",
  "course": "main",
  "match": [
   "rice",
   "spice",
   "smoky"
  ],
  "why": "One-pot spiced rice with smoke and heat — a biryani relative that grew up in New Orleans."
 },
 {
  "dish": "Veggie burrito bowl",
  "yt": "https://www.youtube.com/watch?v=f558hrjpOrw",
  "from": "Mexico · Latin America",
  "region": "latinamerica",
  "diet": "vegan",
  "emoji": "🌯",
  "course": "main",
  "match": [
   "rice",
   "fresh",
   "healthy"
  ],
  "why": "Rice, beans, salsa, guac — the build-your-own thali, Mexican edition."
 },
 {
  "dish": "Mapo tofu",
  "yt": "https://www.youtube.com/watch?v=_BfTqhtfGTM",
  "from": "Sichuan · East Asia",
  "region": "eastasia",
  "diet": "vegan",
  "emoji": "🌶️",
  "course": "main",
  "match": [
   "spice",
   "adventure"
  ],
  "why": "Silky tofu in a chilli-bean lava with numbing Sichuan pepper. Your heat tolerance, upgraded."
 },
 {
  "dish": "Thai green curry with tofu",
  "yt": "https://www.youtube.com/watch?v=Fv-ADFgtrRg",
  "from": "Thailand · Southeast Asia",
  "region": "eastasia",
  "diet": "vegan",
  "emoji": "🍛",
  "course": "main",
  "match": [
   "creamy",
   "spice"
  ],
  "why": "Coconut, basil and green chilli — salan energy in a whole new accent."
 },
 {
  "dish": "Shakshuka",
  "yt": "https://www.youtube.com/watch?v=Uow78qBAWRk",
  "from": "Levant · Middle East",
  "region": "middleeast",
  "diet": "veg",
  "emoji": "🍳",
  "course": "main",
  "match": [
   "tangy",
   "home"
  ],
  "why": "Eggs poached in spiced tomato sauce — breakfast, lunch and dinner argue over it.",
  "egg": true
 },
 {
  "dish": "Ratatouille",
  "yt": "https://www.youtube.com/watch?v=rjJCetszgNM",
  "from": "France · Europe",
  "region": "europe",
  "diet": "vegan",
  "emoji": "🍆",
  "course": "main",
  "match": [
   "home",
   "healthy",
   "fresh"
  ],
  "why": "Slow-stewed vegetables with herbs — proof that simple veg, cooked patiently, wins."
 },
 {
  "dish": "Elote — street corn",
  "yt": "https://www.youtube.com/watch?v=vsfUpBRm7fI",
  "from": "Mexico · Latin America",
  "region": "latinamerica",
  "diet": "veg",
  "emoji": "🌽",
  "course": "appetizer",
  "match": [
   "street",
   "tangy"
  ],
  "why": "Charred corn, lime, chilli, cheese — chaat's long-lost Mexican sibling."
 },
 {
  "dish": "Mushroom pierogi",
  "yt": "https://www.youtube.com/watch?v=qWwqdORZwmQ",
  "from": "Poland · Europe",
  "region": "europe",
  "diet": "vegan",
  "emoji": "🥟",
  "course": "main",
  "match": [
   "home",
   "classic"
  ],
  "why": "Dumplings with sauerkraut and mushroom — momos that emigrated and got cosy."
 },
 {
  "dish": "Mushroom ceviche",
  "yt": "https://www.youtube.com/watch?v=acZSogWWvfY",
  "from": "Peru · Latin America",
  "region": "latinamerica",
  "diet": "vegan",
  "emoji": "🍋",
  "course": "appetizer",
  "match": [
   "fresh",
   "tangy",
   "adventure"
  ],
  "why": "Lime-cured, onion-sharp, chilli-bright — a flavour wake-up call, no cooking involved."
 },
 {
  "dish": "Bibimbap",
  "yt": "https://www.youtube.com/watch?v=i54aNCIgrOQ",
  "from": "Korea · East Asia",
  "region": "eastasia",
  "diet": "veg",
  "emoji": "🍲",
  "course": "main",
  "match": [
   "rice",
   "fresh"
  ],
  "why": "A rainbow of vegetables over rice with gochujang — mix it like you mean it."
 },
 {
  "dish": "Mushroom risotto",
  "yt": "https://www.youtube.com/watch?v=JozZZS6s8Kw",
  "from": "Italy · Europe",
  "region": "europe",
  "diet": "veg",
  "emoji": "🍄",
  "course": "main",
  "match": [
   "creamy",
   "classic"
  ],
  "why": "Rice stirred to silk — khichdi's elegant Italian cousin."
 },
 {
  "dish": "Tempeh satay skewers",
  "yt": "https://www.youtube.com/watch?v=9K7qgk5JJac",
  "from": "Indonesia · Southeast Asia",
  "region": "eastasia",
  "diet": "vegan",
  "emoji": "🍢",
  "course": "appetizer",
  "match": [
   "smoky",
   "street"
  ],
  "why": "Charred skewers with peanut sauce — kebab night, Southeast Asian style."
 },
 {
  "dish": "Açaí bowl",
  "yt": "https://www.youtube.com/watch?v=VtZeq8Ab9_4",
  "from": "Brazil · Latin America",
  "region": "latinamerica",
  "diet": "vegan",
  "emoji": "🫐",
  "course": "dessert",
  "match": [
   "sweet",
   "fresh",
   "healthy"
  ],
  "why": "Icy purple berries, granola crunch — dessert that behaves like breakfast."
 },
 {
  "dish": "Miso soup & onigiri",
  "yt": "https://www.youtube.com/watch?v=kzhB-Lxa0vU",
  "from": "Japan · East Asia",
  "region": "eastasia",
  "diet": "vegan",
  "emoji": "🍙",
  "course": "appetizer",
  "match": [
   "mild",
   "home"
  ],
  "why": "Quiet, savoury comfort — the gentle end of the flavour spectrum, done perfectly."
 },
 {
  "dish": "Yakitori skewers",
  "yt": "https://www.youtube.com/watch?v=tD1ev04a7A0",
  "from": "Japan · East Asia",
  "region": "eastasia",
  "diet": "meat:chicken",
  "emoji": "🍗",
  "course": "appetizer",
  "match": [
   "smoky",
   "street",
   "meat"
  ],
  "why": "Charcoal-kissed chicken skewers — your kebab instincts, refined to an art."
 },
 {
  "dish": "Texas brisket",
  "yt": "https://www.youtube.com/watch?v=uu2Y2pdVaXc",
  "from": "Texas · United States",
  "region": "unitedstates",
  "diet": "meat:beef",
  "emoji": "🥩",
  "course": "main",
  "match": [
   "smoky",
   "meat"
  ],
  "why": "14 hours of smoke, salt and patience. Slow food at its most serious."
 },
 {
  "dish": "Grilled branzino",
  "yt": "https://www.youtube.com/watch?v=nkJxV-jK00E",
  "from": "The Mediterranean · Europe",
  "region": "europe",
  "diet": "meat:seafood",
  "emoji": "🐟",
  "course": "main",
  "match": [
   "fresh",
   "mild"
  ],
  "why": "Whole fish, olive oil, lemon, herbs — coastal simplicity that needs nothing else."
 },
 {
  "dish": "Pav bhaji",
  "yt": "https://www.youtube.com/watch?v=A8V8jj7sbZs",
  "from": "Mumbai · South Asia",
  "region": "southasia",
  "diet": "veg",
  "emoji": "🍛",
  "course": "main",
  "match": [
   "comfort",
   "street",
   "spice"
  ],
  "why": "Buttered, mashed, masala-rich vegetables with soft pav rolls — Mumbai's street comfort at full volume."
 },
 {
  "dish": "Masala dosa",
  "yt": "https://www.youtube.com/watch?v=lGEXiqeScWI",
  "from": "South India · South Asia",
  "region": "southasia",
  "diet": "vegan",
  "emoji": "🥞",
  "course": "main",
  "match": [
   "crisp",
   "fermented",
   "tangy"
  ],
  "why": "A shattering-crisp fermented crepe around spiced potato — tang, crunch and comfort in one plate."
 },
 {
  "dish": "Muhammara & warm pita",
  "yt": "https://www.youtube.com/watch?v=QSukAbaLTJI",
  "from": "Levant · Middle East",
  "region": "middleeast",
  "diet": "vegan",
  "emoji": "🫓",
  "course": "appetizer",
  "match": [
   "tangy",
   "smoky",
   "spice"
  ],
  "why": "Roasted peppers and walnuts ground into a fiery-sweet dip — the boldest bowl on the mezze table."
 },
 {
  "dish": "Chicken shawarma plate",
  "yt": "https://www.youtube.com/watch?v=gphLFBby1Wo",
  "from": "Levant · Middle East",
  "region": "middleeast",
  "diet": "meat:chicken",
  "emoji": "🌯",
  "course": "main",
  "match": [
   "smoky",
   "spice",
   "street"
  ],
  "why": "Spit-roasted and shaved thin, with garlic toum and pickles — the great wrap, plated."
 },
 {
  "dish": "Party jollof rice",
  "yt": "https://www.youtube.com/watch?v=AJbQP6_0dVM",
  "from": "West Africa · Africa",
  "region": "africa",
  "diet": "meat:chicken",
  "emoji": "🍚",
  "course": "main",
  "match": [
   "rice",
   "smoky",
   "spice"
  ],
  "why": "Tomato-rich rice with the famous smoky bottom — the centrepiece of every West African party."
 },
 {
  "dish": "Ethiopian beyaynetu",
  "yt": "https://www.youtube.com/watch?v=JT1crJ0cIII",
  "from": "Ethiopia · Africa",
  "region": "africa",
  "diet": "vegan",
  "emoji": "🫓",
  "course": "main",
  "match": [
   "fermented",
   "spice",
   "fresh"
  ],
  "why": "A rainbow of lentil, chickpea and vegetable wots over tangy injera — a whole feast on one bread."
 },
 {
  "dish": "Arepas con queso",
  "yt": "https://www.youtube.com/watch?v=6CwEO-1uh4c",
  "from": "Venezuela · Latin America",
  "region": "latinamerica",
  "diet": "veg",
  "emoji": "🫓",
  "course": "appetizer",
  "match": [
   "comfort",
   "street",
   "crisp"
  ],
  "why": "Griddled corn cakes with a molten cheese middle — crisp outside, soft within."
 },
 {
  "dish": "Nashville hot chicken",
  "yt": "https://www.youtube.com/watch?v=jNG9O2GVnHI",
  "from": "Tennessee · United States",
  "region": "unitedstates",
  "diet": "meat:chicken",
  "emoji": "🍗",
  "course": "main",
  "match": [
   "spice",
   "comfort",
   "crisp"
  ],
  "why": "Fried chicken dredged in cayenne oil, cooled with pickles and white bread — a controlled burn."
 },
 {
  "dish": "Seekh kebab, Deccan style",
  "yt": "https://www.youtube.com/watch?v=6QfGRg3jfqw",
  "from": "Hyderabad · Deccan",
  "region": "hyderabad",
  "diet": "meat:lamb",
  "emoji": "🔥",
  "course": "appetizer",
  "match": [
   "smoky",
   "spice",
   "deccan",
   "meat"
  ],
  "why": "Hand-minced, coal-smoked, unapologetically spiced — home turf, perfected."
 },
 {
  "dish": "Salmon sashimi & chirashi bowl",
  "yt": "https://www.youtube.com/watch?v=k-LAp5J9lqM",
  "from": "Japan · East Asia",
  "region": "eastasia",
  "diet": "meat:fish",
  "emoji": "🍣",
  "course": "main",
  "match": [
   "fresh",
   "adventure"
  ],
  "why": "Raw salmon over seasoned rice — freshness you can taste, knife work you can see.",
  "raw": true
 },
 {
  "dish": "Tuna tartare",
  "yt": "https://www.youtube.com/watch?v=yaOYNFLSAMQ",
  "from": "The Mediterranean · Europe",
  "region": "europe",
  "diet": "meat:fish",
  "emoji": "🐟",
  "course": "appetizer",
  "match": [
   "fresh",
   "adventure"
  ],
  "why": "Hand-cut raw tuna, citrus and olive oil — the sea, uncooked and unbothered.",
  "raw": true
 },
 {
  "dish": "Beef carpaccio",
  "yt": "https://www.youtube.com/watch?v=eCX34lm3B18",
  "from": "Italy · Europe",
  "region": "europe",
  "diet": "meat:beef",
  "emoji": "🥩",
  "course": "appetizer",
  "match": [
   "fresh",
   "classic"
  ],
  "why": "Beef shaved to silk with lemon and parmesan — raw, but dressed like royalty.",
  "raw": true
 },
 {
  "dish": "Ceviche clásico",
  "yt": "https://www.youtube.com/watch?v=fw4ZaeDWxaw",
  "from": "Peru · Latin America",
  "region": "latinamerica",
  "diet": "meat:fish",
  "emoji": "🍋",
  "course": "appetizer",
  "match": [
   "fresh",
   "tangy"
  ],
  "why": "Raw fish 'cooked' in lime and chilli — bright, cold and electric.",
  "raw": true
 },
 {
  "dish": "Gazpacho",
  "yt": "https://www.youtube.com/watch?v=CsHD_1ozBnA",
  "from": "Spain · Europe",
  "region": "europe",
  "diet": "vegan",
  "emoji": "🍅",
  "course": "appetizer",
  "match": [
   "fresh",
   "tangy",
   "soup"
  ],
  "why": "Andalusia's chilled tomato soup — summer, blended and served ice-cold."
 },
 {
  "dish": "Borscht",
  "yt": "https://www.youtube.com/watch?v=-RjawJ8LImM",
  "from": "Ukraine · Europe",
  "region": "europe",
  "diet": "vegan",
  "emoji": "🥣",
  "course": "appetizer",
  "match": [
   "tangy",
   "home",
   "soup"
  ],
  "why": "Beetroot soup with real tang — earthy, vivid and warming."
 },
 {
  "dish": "Harira",
  "yt": "https://www.youtube.com/watch?v=NCh2MTCAilQ",
  "from": "Morocco · Africa",
  "region": "africa",
  "diet": "vegan",
  "emoji": "🍲",
  "course": "appetizer",
  "match": [
   "soup",
   "home"
  ],
  "why": "Tomato, lentil and chickpea soup — Morocco's bowl of welcome."
 },
 {
  "dish": "Ajo blanco",
  "yt": "https://www.youtube.com/watch?v=I5VEZtPV744",
  "from": "Spain · Europe",
  "region": "europe",
  "diet": "vegan",
  "emoji": "🧄",
  "course": "appetizer",
  "match": [
   "creamy",
   "fresh",
   "soup"
  ],
  "why": "Chilled almond-and-garlic soup, centuries old — gazpacho's pale, creamy ancestor."
 },
 {
  "dish": "Gado gado",
  "yt": "https://www.youtube.com/watch?v=_wIVmPSotow",
  "from": "Indonesia · Southeast Asia",
  "region": "eastasia",
  "diet": "vegan",
  "emoji": "🥜",
  "course": "appetizer",
  "match": [
   "creamy",
   "street"
  ],
  "why": "Blanched vegetables and tofu under a warm peanut sauce blanket."
 },
 {
  "dish": "Sicilian caponata",
  "yt": "https://www.youtube.com/watch?v=6MxrNcnq93M",
  "from": "Sicily · Europe",
  "region": "europe",
  "diet": "vegan",
  "emoji": "🍆",
  "course": "appetizer",
  "match": [
   "tangy",
   "home"
  ],
  "why": "Aubergine in sweet-sour tomato — Sicily's agrodolce on a plate."
 },
 {
  "dish": "Phở",
  "yt": "https://www.youtube.com/watch?v=JPBwT90d8RA",
  "from": "Vietnam · Southeast Asia",
  "region": "eastasia",
  "diet": "meat:beef",
  "emoji": "🍜",
  "course": "main",
  "match": [
   "soup",
   "fresh",
   "home"
  ],
  "why": "Star-anise beef broth, herbs and rice noodles — a hug with a squeeze of lime."
 },
 {
  "dish": "Tom yum",
  "yt": "https://www.youtube.com/watch?v=Ml4d50BIYIo",
  "from": "Thailand · Southeast Asia",
  "region": "eastasia",
  "diet": "meat:seafood",
  "emoji": "🍤",
  "course": "appetizer",
  "match": [
   "soup",
   "tangy",
   "spice"
  ],
  "why": "Hot-and-sour prawn soup — lemongrass, galangal and a chilli kick."
 },
 {
  "dish": "Tom kha gai",
  "yt": "https://www.youtube.com/watch?v=i1U5pmVzJqA",
  "from": "Thailand · Southeast Asia",
  "region": "eastasia",
  "diet": "meat:chicken",
  "emoji": "🥥",
  "course": "appetizer",
  "match": [
   "soup",
   "creamy",
   "tangy"
  ],
  "why": "Chicken in coconut-galangal broth — tom yum's gentler, creamier sibling."
 },
 {
  "dish": "French onion soup",
  "yt": "https://www.youtube.com/watch?v=8CqWIntIDlQ",
  "from": "France · Europe",
  "region": "europe",
  "diet": "veg",
  "emoji": "🧅",
  "course": "appetizer",
  "match": [
   "soup",
   "creamy",
   "classic"
  ],
  "why": "Onions cooked to jam under a molten cheese crust — patience, rewarded."
 },
 {
  "dish": "Greek salad",
  "yt": "https://www.youtube.com/watch?v=0OMOamBjd48",
  "from": "Greece · Europe",
  "region": "europe",
  "diet": "veg",
  "emoji": "🥗",
  "course": "appetizer",
  "match": [
   "fresh",
   "tangy"
  ],
  "why": "Tomato, cucumber, olives and a slab of feta — no lettuce, no apologies."
 },
 {
  "dish": "New England clam chowder",
  "yt": "https://www.youtube.com/watch?v=UUlfKJ9M_pQ",
  "from": "New England · United States",
  "region": "unitedstates",
  "diet": "meat:seafood",
  "emoji": "🦪",
  "course": "appetizer",
  "match": [
   "soup",
   "creamy"
  ],
  "why": "Clams and potato in a creamy bowl built for cold harbours."
 },
 {
  "dish": "Pozole",
  "yt": "https://www.youtube.com/watch?v=HhaxbsEL0RM",
  "from": "Mexico · Latin America",
  "region": "latinamerica",
  "diet": "meat:chicken",
  "emoji": "🍲",
  "course": "main",
  "match": [
   "soup",
   "home",
   "spice"
  ],
  "why": "Chicken pozole — a hominy stew crowned at the table with radish, lime and crunch."
 },
 {
  "dish": "Feijoada",
  "yt": "https://www.youtube.com/watch?v=eS5_wWS0IDc",
  "from": "Brazil · Latin America",
  "region": "latinamerica",
  "diet": "meat:pork",
  "emoji": "🫘",
  "course": "main",
  "match": [
   "home",
   "meat"
  ],
  "why": "Black beans and pork, simmered for hours — Brazil's Saturday ritual."
 },
 {
  "dish": "Bunny chow",
  "yt": "https://www.youtube.com/watch?v=bOhddTWSJPQ",
  "from": "Durban · Africa",
  "region": "africa",
  "diet": "meat:chicken",
  "emoji": "🍞",
  "course": "main",
  "match": [
   "spice",
   "street"
  ],
  "why": "Curry served inside a hollowed loaf — Durban's edible bowl."
 },
 {
  "dish": "Doro wat",
  "yt": "https://www.youtube.com/watch?v=6QjW6QWXxD4",
  "from": "Ethiopia · Africa",
  "region": "africa",
  "diet": "meat:chicken",
  "emoji": "🍗",
  "course": "main",
  "match": [
   "spice",
   "home"
  ],
  "why": "Chicken braised in berbere and browned onion, eaten with injera."
 },
 {
  "dish": "Bánh mì",
  "yt": "https://www.youtube.com/watch?v=7gL-vCsDtkE",
  "from": "Vietnam · Southeast Asia",
  "region": "eastasia",
  "diet": "meat:pork",
  "emoji": "🥖",
  "course": "main",
  "match": [
   "fresh",
   "street"
  ],
  "why": "Crisp baguette, pâté, pickles and herbs — two food cultures in one bite."
 },
 {
  "dish": "Coq au vin",
  "yt": "https://www.youtube.com/watch?v=2PSW4AiktyA",
  "from": "France · Europe",
  "region": "europe",
  "diet": "meat:chicken",
  "emoji": "🍷",
  "course": "main",
  "match": [
   "classic",
   "home"
  ],
  "why": "Chicken braised in red wine until the sauce turns to velvet.",
  "alc": true
 },
 {
  "dish": "Boeuf bourguignon",
  "yt": "https://www.youtube.com/watch?v=Mx3rD6LKCbQ",
  "from": "France · Europe",
  "region": "europe",
  "diet": "meat:beef",
  "emoji": "🍲",
  "course": "main",
  "match": [
   "classic",
   "creamy"
  ],
  "why": "Beef slow-cooked in Burgundy wine — France's deepest stew.",
  "alc": true
 },
 {
  "dish": "Beer-battered fish & chips",
  "yt": "https://www.youtube.com/watch?v=vNb7gj9VFJo",
  "from": "Britain · Europe",
  "region": "europe",
  "diet": "meat:fish",
  "emoji": "🍺",
  "course": "main",
  "match": [
   "street",
   "classic"
  ],
  "why": "Crisp beer batter, soft fish, salt and vinegar — seaside law.",
  "alc": true
 },
 {
  "dish": "Tiramisu",
  "yt": "https://www.youtube.com/watch?v=NwZMODDf-WI",
  "from": "Italy · Europe",
  "region": "europe",
  "diet": "veg",
  "emoji": "🍰",
  "course": "dessert",
  "match": [
   "sweet",
   "creamy",
   "coffee"
  ],
  "why": "Espresso-soaked layers under mascarpone clouds — pick-me-up, literally.",
  "alc": true
 },
 {
  "dish": "Maafe",
  "yt": "https://www.youtube.com/watch?v=yHovQCzeUP0",
  "from": "Mali · Africa",
  "region": "africa",
  "diet": "vegan",
  "emoji": "🥜",
  "course": "main",
  "match": [
   "creamy",
   "home"
  ],
  "why": "Groundnut stew — peanuts simmered into a rich, savoury sauce over rice."
 },
 {
  "dish": "Fesenjān",
  "yt": "https://www.youtube.com/watch?v=opJpBLTr8a0",
  "from": "Persia · Middle East",
  "region": "middleeast",
  "diet": "meat:chicken",
  "emoji": "🍗",
  "course": "main",
  "match": [
   "tangy",
   "sweet"
  ],
  "why": "Chicken in walnut-and-pomegranate sauce — dark, sweet, sour."
 },
 {
  "dish": "Khachapuri",
  "yt": "https://www.youtube.com/watch?v=YmpZlbUT5XA",
  "from": "Georgia · Europe",
  "region": "europe",
  "diet": "veg",
  "emoji": "🧀",
  "course": "main",
  "match": [
   "creamy",
   "classic"
  ],
  "why": "A boat of molten cheese with a yolk in the middle — tear, dip, repeat."
 },
 {
  "dish": "Okonomiyaki",
  "yt": "https://www.youtube.com/watch?v=f2IEoi7Gu1U",
  "from": "Osaka · East Asia",
  "region": "eastasia",
  "diet": "meat:pork",
  "emoji": "🥞",
  "course": "main",
  "match": [
   "street",
   "adventure"
  ],
  "why": "Savoury cabbage pancake off the grill, lacquered and dancing with bonito."
 },
 {
  "dish": "Curry laksa",
  "yt": "https://www.youtube.com/watch?v=iRzdTGe2vqc",
  "from": "Malaysia · Southeast Asia",
  "region": "eastasia",
  "diet": "meat:seafood",
  "emoji": "🍜",
  "course": "main",
  "match": [
   "soup",
   "spice",
   "creamy"
  ],
  "why": "Coconut curry broth, noodles and seafood — a whole market in one bowl."
 },
 {
  "dish": "Tonkotsu ramen",
  "yt": "https://www.youtube.com/watch?v=Pln23pOMNlU",
  "from": "Japan · East Asia",
  "region": "eastasia",
  "diet": "meat:pork",
  "emoji": "🍜",
  "course": "main",
  "match": [
   "soup",
   "noodle",
   "creamy"
  ],
  "why": "Pork broth boiled to milkiness — ramen at its richest."
 },
 {
  "dish": "Moussaka",
  "yt": "https://www.youtube.com/watch?v=m1sJNFln-7E",
  "from": "Greece · Europe",
  "region": "europe",
  "diet": "meat:lamb",
  "emoji": "🍆",
  "course": "main",
  "match": [
   "creamy",
   "home"
  ],
  "why": "Aubergine and spiced lamb under a béchamel blanket."
 },
 {
  "dish": "Goulash",
  "yt": "https://www.youtube.com/watch?v=qPBJ6dRkv58",
  "from": "Hungary · Europe",
  "region": "europe",
  "diet": "meat:beef",
  "emoji": "🥘",
  "course": "main",
  "match": [
   "home",
   "spice"
  ],
  "why": "Paprika beef stew — deep red, slow and warming."
 },
 {
  "dish": "Aguachile",
  "yt": "https://www.youtube.com/watch?v=y5JWgfHv40E",
  "from": "Sinaloa · Latin America",
  "region": "latinamerica",
  "diet": "meat:seafood",
  "emoji": "🍤",
  "course": "appetizer",
  "match": [
   "fresh",
   "tangy",
   "spice"
  ],
  "why": "Shrimp in lime-and-chilli water — ceviche's fiercer cousin.",
  "raw": true
 },
 {
  "dish": "Tacos al pastor",
  "yt": "https://www.youtube.com/watch?v=WpCJkecTcxg",
  "from": "Mexico · Latin America",
  "region": "latinamerica",
  "diet": "meat:pork",
  "emoji": "🌮",
  "course": "main",
  "match": [
   "street",
   "smoky"
  ],
  "why": "Marinated pork shaved off the trompo, pineapple on top."
 },
 {
  "dish": "Pupusas",
  "yt": "https://www.youtube.com/watch?v=BU77zV4xrXo",
  "from": "El Salvador · Latin America",
  "region": "latinamerica",
  "diet": "veg",
  "emoji": "🫓",
  "course": "main",
  "match": [
   "street",
   "creamy"
  ],
  "why": "Stuffed corn cakes with curtido crunch and salsa."
 },
 {
  "dish": "Jerk chicken",
  "yt": "https://www.youtube.com/watch?v=Q4ku2YHVJWI",
  "from": "Jamaica · The Caribbean",
  "region": "latinamerica",
  "diet": "meat:chicken",
  "emoji": "🍗",
  "course": "main",
  "match": [
   "spice",
   "smoky"
  ],
  "why": "Allspice and Scotch-bonnet fire, smoked low over pimento wood."
 },
 {
  "dish": "Piri piri chicken",
  "yt": "https://www.youtube.com/watch?v=gC8voPWJV9U",
  "from": "Mozambique · Africa",
  "region": "africa",
  "diet": "meat:chicken",
  "emoji": "🌶️",
  "course": "main",
  "match": [
   "spice",
   "smoky"
  ],
  "why": "Flame-grilled chicken under bird's-eye chilli sauce."
 },
 {
  "dish": "Chicken tagine",
  "yt": "https://www.youtube.com/watch?v=QIPtx_t4_KE",
  "from": "Morocco · Africa",
  "region": "africa",
  "diet": "meat:chicken",
  "emoji": "🍋",
  "course": "main",
  "match": [
   "home",
   "tangy"
  ],
  "why": "Slow-cooked with preserved lemon and olives — Morocco's signature pot."
 },
 {
  "dish": "Bobotie",
  "yt": "https://www.youtube.com/watch?v=WW-PDbGJTBY",
  "from": "South Africa · Africa",
  "region": "africa",
  "diet": "meat:beef",
  "emoji": "🍮",
  "course": "main",
  "match": [
   "sweet",
   "home"
  ],
  "why": "Cape Malay spiced mince baked under a golden custard top."
 },
 {
  "dish": "Som tam",
  "yt": "https://www.youtube.com/watch?v=phn9ed4_Imo",
  "from": "Thailand · Southeast Asia",
  "region": "eastasia",
  "diet": "meat:seafood",
  "emoji": "🥒",
  "course": "appetizer",
  "match": [
   "fresh",
   "tangy",
   "spice"
  ],
  "why": "Green papaya pounded with lime, chilli and dried shrimp — sweet-sour-fire."
 },
 {
  "dish": "Khao soi",
  "yt": "https://www.youtube.com/watch?v=X50pWy7WAXo",
  "from": "Chiang Mai · Southeast Asia",
  "region": "eastasia",
  "diet": "meat:chicken",
  "emoji": "🍜",
  "course": "main",
  "match": [
   "soup",
   "creamy",
   "spice"
  ],
  "why": "Curry noodle soup with a crisp noodle crown."
 },
 {
  "dish": "Butter chicken",
  "yt": "https://www.youtube.com/watch?v=VHfhCXkJh34",
  "from": "Delhi · South Asia",
  "region": "southasia",
  "diet": "meat:chicken",
  "emoji": "🍛",
  "course": "main",
  "match": [
   "creamy",
   "classic"
  ],
  "why": "Tandoori chicken folded into tomato-butter silk."
 },
 {
  "dish": "Nihari",
  "yt": "https://www.youtube.com/watch?v=KYR-wx44Pw4",
  "from": "Old Delhi · South Asia",
  "region": "southasia",
  "diet": "meat:beef",
  "emoji": "🍖",
  "course": "main",
  "match": [
   "spice",
   "home"
  ],
  "why": "Beef shank braised for hours in a deep, dark gravy."
 },
 {
  "dish": "Haleem",
  "yt": "https://www.youtube.com/watch?v=mewkdzt04v0",
  "from": "Hyderabad · Deccan",
  "region": "hyderabad",
  "diet": "meat:beef",
  "emoji": "🍲",
  "course": "main",
  "match": [
   "home",
   "spice"
  ],
  "why": "Wheat, lentils and beef pounded to silk — Hyderabad's patience dish."
 },
 {
  "dish": "Smash burger",
  "yt": "https://www.youtube.com/watch?v=GC1e2fK4PFk",
  "from": "Oklahoma · United States",
  "region": "unitedstates",
  "diet": "meat:beef",
  "emoji": "🍔",
  "course": "main",
  "match": [
   "classic",
   "meat"
  ],
  "why": "Lacy crisp edges, molten cheese, soft bun — the diner, perfected."
 },
 {
  "dish": "Lobster roll",
  "yt": "https://www.youtube.com/watch?v=3llW37YhBu0",
  "from": "Maine · United States",
  "region": "unitedstates",
  "diet": "meat:seafood",
  "emoji": "🦞",
  "course": "main",
  "match": [
   "fresh",
   "creamy"
  ],
  "why": "Sweet lobster piled into a buttered, toasted roll."
 },
 {
  "dish": "Poutine",
  "yt": "https://www.youtube.com/watch?v=FJONxxDPUdU",
  "from": "Québec · Canada",
  "region": "unitedstates",
  "diet": "veg",
  "emoji": "🍟",
  "course": "appetizer",
  "match": [
   "creamy",
   "classic"
  ],
  "why": "Fries, gravy and squeaky cheese curds — Québec's gift to the world."
 },
 {
  "dish": "Ribollita",
  "yt": "https://www.youtube.com/watch?v=Rs0NGSw0H9E",
  "from": "Tuscany · Europe",
  "region": "europe",
  "diet": "vegan",
  "emoji": "🍲",
  "course": "main",
  "match": [
   "soup",
   "home",
   "comfort"
  ],
  "why": "Tuscan bread-and-bean soup simmered twice — humble, thick and deeply savoury."
 },
 {
  "dish": "Pierogi ruskie",
  "yt": "https://www.youtube.com/watch?v=dA-IGCYftn8",
  "from": "Poland · Europe",
  "region": "europe",
  "diet": "veg",
  "emoji": "🥟",
  "course": "main",
  "match": [
   "comfort",
   "classic",
   "home"
  ],
  "why": "Potato-and-cheese dumplings with sweet fried onion — Central Europe's comfort handshake."
 },
 {
  "dish": "Beef stroganoff",
  "yt": "https://www.youtube.com/watch?v=7r3dlmYUf4s",
  "from": "Russia · Europe",
  "region": "europe",
  "diet": "meat:beef",
  "emoji": "🥩",
  "course": "main",
  "match": [
   "creamy",
   "comfort",
   "classic"
  ],
  "why": "Beef folded through a tangy sour-cream sauce — rich, silky, unapologetic."
 },
 {
  "dish": "Salade niçoise",
  "yt": "https://www.youtube.com/watch?v=MVo6BXaVYo0",
  "from": "Nice · Europe",
  "region": "europe",
  "diet": "meat:fish",
  "emoji": "🥗",
  "course": "main",
  "match": [
   "fresh",
   "classic",
   "healthy"
  ],
  "why": "Tuna, olives, eggs and green beans in sharp vinaigrette — the composed salad that eats like a meal."
 },
 {
  "dish": "Cacio e pepe",
  "yt": "https://www.youtube.com/watch?v=JuH5GvoklDc",
  "from": "Rome · Europe",
  "region": "europe",
  "diet": "veg",
  "emoji": "🍝",
  "course": "main",
  "match": [
   "noodle",
   "classic",
   "comfort"
  ],
  "why": "Three ingredients, zero hiding: pasta, black pepper and pecorino turned into gloss."
 },
 {
  "dish": "Drunken chicken",
  "yt": "https://www.youtube.com/watch?v=vxcxPgLc6Ik",
  "from": "Shanghai · East Asia",
  "region": "eastasia",
  "diet": "meat:chicken",
  "emoji": "🍗",
  "course": "appetizer",
  "match": [
   "mild",
   "classic",
   "adventure"
  ],
  "why": "Poached chicken chilled in Shaoxing wine — silky, aromatic, quietly boozy.",
  "alc": true
 },
 {
  "dish": "Sake-steamed clams",
  "yt": "https://www.youtube.com/watch?v=SQB8JQyTz_Q",
  "from": "Japan · East Asia",
  "region": "eastasia",
  "diet": "meat:seafood",
  "emoji": "🍶",
  "course": "appetizer",
  "match": [
   "fresh",
   "mild",
   "adventure"
  ],
  "why": "Clams opened in hot sake with ginger — the sea, plus a whisper of rice wine.",
  "alc": true
 },
 {
  "dish": "Japchae",
  "yt": "https://www.youtube.com/watch?v=DIXKviwFXBo",
  "from": "Korea · East Asia",
  "region": "eastasia",
  "diet": "vegan",
  "emoji": "🍜",
  "course": "main",
  "match": [
   "noodle",
   "sweet",
   "classic"
  ],
  "why": "Glass noodles glossed with sesame and soy, vegetables cut like confetti."
 },
 {
  "dish": "Pho ga",
  "yt": "https://www.youtube.com/watch?v=Ildv1ncLJig",
  "from": "Vietnam · East Asia",
  "region": "eastasia",
  "diet": "meat:chicken",
  "emoji": "🍜",
  "course": "main",
  "match": [
   "soup",
   "noodle",
   "fresh"
  ],
  "why": "Chicken pho — clear, star-anise broth, a garden of herbs dropped in at the table."
 },
 {
  "dish": "Dan dan noodles",
  "yt": "https://www.youtube.com/watch?v=KH7CJO9d6jg",
  "from": "Sichuan · East Asia",
  "region": "eastasia",
  "diet": "meat:pork",
  "emoji": "🌶️",
  "course": "main",
  "match": [
   "noodle",
   "spice",
   "street"
  ],
  "why": "Chilli oil, Sichuan pepper and minced pork slicked over noodles — small bowl, big voltage."
 },
 {
  "dish": "Nasu dengaku",
  "yt": "https://www.youtube.com/watch?v=jyKsgvPep2Q",
  "from": "Japan · East Asia",
  "region": "eastasia",
  "diet": "vegan",
  "emoji": "🍆",
  "course": "appetizer",
  "match": [
   "sweet",
   "home",
   "adventure"
  ],
  "why": "Aubergine broiled under a sweet miso glaze until it turns to custard."
 },
 {
  "dish": "Kung pao chicken",
  "yt": "https://www.youtube.com/watch?v=dkIBr4jN54I",
  "from": "Sichuan · East Asia",
  "region": "eastasia",
  "diet": "meat:chicken",
  "emoji": "🥜",
  "course": "main",
  "match": [
   "spice",
   "street",
   "crisp"
  ],
  "why": "Chicken, peanuts and dried chillies in a glossy sweet-sour wok sauce."
 },
 {
  "dish": "Char siu",
  "yt": "https://www.youtube.com/watch?v=MPZ5fw35bc4",
  "from": "Hong Kong · East Asia",
  "region": "eastasia",
  "diet": "meat:pork",
  "emoji": "🍖",
  "course": "main",
  "match": [
   "sweet",
   "smoky",
   "meat"
  ],
  "why": "Barbecue pork with lacquered, charred edges and a honeyed centre."
 },
 {
  "dish": "Frijoles borrachos",
  "yt": "https://www.youtube.com/watch?v=Q3sTUEIMCTA",
  "from": "Mexico · Latin America",
  "region": "latinamerica",
  "diet": "meat:pork",
  "emoji": "🫘",
  "course": "main",
  "match": [
   "smoky",
   "comfort",
   "home"
  ],
  "why": "'Drunken beans' simmered in beer with bacon and chilli — brothy, smoky, spoon-ready.",
  "alc": true
 },
 {
  "dish": "Mole poblano",
  "yt": "https://www.youtube.com/watch?v=K_D54YtCSrw",
  "from": "Puebla · Latin America",
  "region": "latinamerica",
  "diet": "meat:chicken",
  "emoji": "🍫",
  "course": "main",
  "match": [
   "spice",
   "sweet",
   "adventure"
  ],
  "why": "Chicken under Mexico's dark, many-chilli chocolate-kissed sauce — deep doesn't cover it."
 },
 {
  "dish": "Empanadas de humita",
  "yt": "https://www.youtube.com/watch?v=P5z0efagwLU",
  "from": "Argentina · Latin America",
  "region": "latinamerica",
  "diet": "veg",
  "emoji": "🥟",
  "course": "appetizer",
  "match": [
   "street",
   "comfort",
   "sweet"
  ],
  "why": "Golden half-moons of creamy sweetcorn — Argentina's gentle empanada."
 },
 {
  "dish": "Gallo pinto",
  "yt": "https://www.youtube.com/watch?v=z7fuWkdKvdw",
  "from": "Costa Rica · Latin America",
  "region": "latinamerica",
  "diet": "vegan",
  "emoji": "🍚",
  "course": "main",
  "match": [
   "rice",
   "home",
   "classic"
  ],
  "why": "Yesterday's rice and beans refried with salsa Lizano — breakfast of a whole nation."
 },
 {
  "dish": "Picadillo",
  "yt": "https://www.youtube.com/watch?v=kihT9n_OmNg",
  "from": "Cuba · Latin America",
  "region": "latinamerica",
  "diet": "meat:beef",
  "emoji": "🍲",
  "course": "main",
  "match": [
   "home",
   "tangy",
   "comfort"
  ],
  "why": "Beef hash with olives, capers and raisins — sweet-sour comfort, Cuban style."
 },
 {
  "dish": "Esquites",
  "yt": "https://www.youtube.com/watch?v=-XdSgi8J-CU",
  "from": "Mexico · Latin America",
  "region": "latinamerica",
  "diet": "veg",
  "emoji": "🌽",
  "course": "appetizer",
  "match": [
   "street",
   "tangy",
   "spice"
  ],
  "why": "Corn kernels in a cup with lime, chilli, mayo and cheese — street-corner electricity."
 },
 {
  "dish": "Lomo saltado",
  "yt": "https://www.youtube.com/watch?v=Z3RWh2yicKs",
  "from": "Peru · Latin America",
  "region": "latinamerica",
  "diet": "meat:beef",
  "emoji": "🥩",
  "course": "main",
  "match": [
   "crisp",
   "tangy",
   "street"
  ],
  "why": "Beef stir-fried with onion, tomato and soy, served over fries AND rice — Peru's glorious double carb."
 },
 {
  "dish": "Bandeja paisa",
  "yt": "https://www.youtube.com/watch?v=wX4LjdUjMXw",
  "from": "Colombia · Latin America",
  "region": "latinamerica",
  "diet": "meat:pork",
  "emoji": "🍛",
  "course": "main",
  "match": [
   "rice",
   "meat",
   "comfort"
  ],
  "why": "A platter, not a plate: beans, rice, beef, chicharrón, egg, plantain and avocado."
 },
 {
  "dish": "Chiles rellenos",
  "yt": "https://www.youtube.com/watch?v=rA0kpWyZcsY",
  "from": "Mexico · Latin America",
  "region": "latinamerica",
  "diet": "veg",
  "emoji": "🌶️",
  "course": "main",
  "match": [
   "spice",
   "creamy",
   "classic"
  ],
  "why": "Poblano peppers stuffed with cheese, battered and fried, floated in tomato broth."
 },
 {
  "dish": "Sancocho",
  "yt": "https://www.youtube.com/watch?v=Rp-KFNbySC4",
  "from": "Dominican Republic · Latin America",
  "region": "latinamerica",
  "diet": "meat:chicken",
  "emoji": "🍲",
  "course": "main",
  "match": [
   "soup",
   "home",
   "comfort"
  ],
  "why": "A root-vegetable and chicken stew built for gatherings — the pot that feeds the street."
 },
 {
  "dish": "Arroz con gandules",
  "yt": "https://www.youtube.com/watch?v=Go-8H6jgpfM",
  "from": "Puerto Rico · Latin America",
  "region": "latinamerica",
  "diet": "meat:pork",
  "emoji": "🍚",
  "course": "main",
  "match": [
   "rice",
   "smoky",
   "home"
  ],
  "why": "Pigeon peas and rice cooked in sofrito with pork — Puerto Rico's celebration pot."
 },
 {
  "dish": "Yuca con mojo",
  "yt": "https://www.youtube.com/watch?v=XiYq-0sovDo",
  "from": "Cuba · Latin America",
  "region": "latinamerica",
  "diet": "vegan",
  "emoji": "🍠",
  "course": "appetizer",
  "match": [
   "tangy",
   "fresh",
   "street"
  ],
  "why": "Cassava under a hot garlic-citrus mojo — sharp, silky, impossible to stop eating."
 },
 {
  "dish": "Choripán",
  "yt": "https://www.youtube.com/watch?v=1i-eOHcaeec",
  "from": "Argentina · Latin America",
  "region": "latinamerica",
  "diet": "meat:pork",
  "emoji": "🌭",
  "course": "main",
  "match": [
   "street",
   "smoky",
   "meat"
  ],
  "why": "Grilled chorizo in crusty bread under chimichurri — stadium food perfected."
 },
 {
  "dish": "Kitfo",
  "yt": "https://www.youtube.com/watch?v=b5AvSdqyxnI",
  "from": "Ethiopia · Africa",
  "region": "africa",
  "diet": "meat:beef",
  "emoji": "🥩",
  "course": "main",
  "match": [
   "spice",
   "adventure",
   "meat"
  ],
  "why": "Beef minced and warmed in mitmita spice and niter kibbeh — Ethiopia's steak tartare, served leb leb or raw.",
  "raw": true
 },
 {
  "dish": "Misir wot",
  "yt": "https://www.youtube.com/watch?v=W1nW6DRPhVQ",
  "from": "Ethiopia · Africa",
  "region": "africa",
  "diet": "vegan",
  "emoji": "🍲",
  "course": "main",
  "match": [
   "spice",
   "soup",
   "comfort"
  ],
  "why": "Red lentils melted into berbere spice — the heartbeat of the beyaynetu platter."
 },
 {
  "dish": "Shiro wot",
  "yt": "https://www.youtube.com/watch?v=6tHNm24OW_g",
  "from": "Ethiopia · Africa",
  "region": "africa",
  "diet": "vegan",
  "emoji": "🍲",
  "course": "main",
  "match": [
   "home",
   "comfort",
   "mild"
  ],
  "why": "Chickpea flour stew, silky and spiced — Ethiopia's everyday comfort, scooped with injera."
 },
 {
  "dish": "Egusi soup",
  "yt": "https://www.youtube.com/watch?v=UHe8K6uM-Z0",
  "from": "Nigeria · Africa",
  "region": "africa",
  "diet": "meat:beef",
  "emoji": "🍲",
  "course": "main",
  "match": [
   "soup",
   "meat",
   "adventure"
  ],
  "why": "Ground melon seeds thicken a rich, peppery soup loaded with meat and greens."
 },
 {
  "dish": "Pepper soup",
  "yt": "https://www.youtube.com/watch?v=7dj-n9w_Vhg",
  "from": "Nigeria · Africa",
  "region": "africa",
  "diet": "meat:chicken",
  "emoji": "🌶️",
  "course": "appetizer",
  "match": [
   "soup",
   "spice",
   "street"
  ],
  "why": "A light, fiery broth perfumed with native spice — clears heads and sinuses alike."
 },
 {
  "dish": "Chakalaka",
  "yt": "https://www.youtube.com/watch?v=60BY0Ih8_2I",
  "from": "South Africa · Africa",
  "region": "africa",
  "diet": "vegan",
  "emoji": "🫘",
  "course": "appetizer",
  "match": [
   "spice",
   "tangy",
   "street"
  ],
  "why": "A fiery bean-and-pepper relish born in the townships — the braai's essential side."
 },
 {
  "dish": "Suya",
  "yt": "https://www.youtube.com/watch?v=c27vMVHEJJ4",
  "from": "Nigeria · Africa",
  "region": "africa",
  "diet": "meat:beef",
  "emoji": "🍢",
  "course": "appetizer",
  "match": [
   "street",
   "spice",
   "smoky"
  ],
  "why": "Beef skewers dusted in yaji peanut spice, grilled over open flame, served with onion and fire."
 },
 {
  "dish": "Waakye",
  "yt": "https://www.youtube.com/watch?v=DCwSc1u4VNg",
  "from": "Ghana · Africa",
  "region": "africa",
  "diet": "vegan",
  "emoji": "🍚",
  "course": "main",
  "match": [
   "rice",
   "home",
   "street"
  ],
  "why": "Rice and beans cooked with sorghum leaves until they blush — Ghana's beloved street breakfast."
 },
 {
  "dish": "Okra soup",
  "yt": "https://www.youtube.com/watch?v=mw1T4R8YbUg",
  "from": "Nigeria · Africa",
  "region": "africa",
  "diet": "meat:seafood",
  "emoji": "🍲",
  "course": "main",
  "match": [
   "soup",
   "adventure",
   "home"
  ],
  "why": "Silky draw soup with fish and prawns — eaten with your hands, rolled in fufu."
 },
 {
  "dish": "Kenyan pilau",
  "yt": "https://www.youtube.com/watch?v=jjQ039fZwTw",
  "from": "Kenya · Africa",
  "region": "africa",
  "diet": "meat:beef",
  "emoji": "🍚",
  "course": "main",
  "match": [
   "rice",
   "spice",
   "biryani"
  ],
  "why": "Coastal spiced rice with beef and whole garam masala — biryani's East African cousin."
 },
 {
  "dish": "Ifisashi",
  "yt": "https://www.youtube.com/watch?v=BdaJjfJVLAk",
  "from": "Zambia · Africa",
  "region": "africa",
  "diet": "vegan",
  "emoji": "🥬",
  "course": "main",
  "match": [
   "creamy",
   "home",
   "comfort"
  ],
  "why": "Greens simmered in groundnut sauce — Zambia's gentle, peanut-rich staple."
 },
 {
  "dish": "Grilled tilapia, Kenyan style",
  "yt": "https://www.youtube.com/watch?v=S4EcaJcVR0E",
  "from": "Kenya · Africa",
  "region": "africa",
  "diet": "meat:fish",
  "emoji": "🐟",
  "course": "main",
  "match": [
   "crisp",
   "tangy",
   "street"
  ],
  "why": "Whole fish fried crisp, kachumbari on the side — lakeside eating at its best."
 },
 {
  "dish": "Fufu and light soup",
  "yt": "https://www.youtube.com/watch?v=srN-TdCUqU4",
  "from": "Ghana · Africa",
  "region": "africa",
  "diet": "meat:chicken",
  "emoji": "🍲",
  "course": "main",
  "match": [
   "soup",
   "home",
   "adventure"
  ],
  "why": "Pounded cassava dumplings in a light, peppery chicken-tomato broth — Ghana's soul food."
 },
 {
  "dish": "Lamb tagine",
  "yt": "https://www.youtube.com/watch?v=KilpSdcNlTE",
  "from": "Morocco · Africa",
  "region": "africa",
  "diet": "meat:lamb",
  "emoji": "🐑",
  "course": "main",
  "match": [
   "sweet",
   "spice",
   "comfort"
  ],
  "why": "Lamb slow-cooked with apricots, almonds and cinnamon — sweet heat from the medina."
 },
 {
  "dish": "Tibs",
  "yt": "https://www.youtube.com/watch?v=6V4GR2oCqgo",
  "from": "Ethiopia · Africa",
  "region": "africa",
  "diet": "meat:lamb",
  "emoji": "🫓",
  "course": "main",
  "match": [
   "spice",
   "street",
   "meat"
  ],
  "why": "Lamb seared with onion, chilli and rosemary, eaten straight off injera."
 },
 {
  "dish": "Malva pudding",
  "yt": "https://www.youtube.com/watch?v=7l7TiDmVNhw",
  "from": "South Africa · Africa",
  "region": "africa",
  "diet": "veg",
  "emoji": "🍮",
  "course": "dessert",
  "match": [
   "sweet",
   "comfort",
   "classic"
  ],
  "why": "Apricot sponge soaked in hot cream sauce — South Africa's hug in dessert form."
 },
 {
  "dish": "Bourbon-glazed salmon",
  "yt": "https://www.youtube.com/watch?v=eZVRlws_XCM",
  "from": "Kentucky · United States",
  "region": "unitedstates",
  "diet": "meat:fish",
  "emoji": "🐟",
  "course": "main",
  "match": [
   "sweet",
   "smoky",
   "adventure"
  ],
  "why": "Salmon lacquered in a bourbon-brown-sugar glaze — Kentucky barrel country meets the river.",
  "alc": true
 },
 {
  "dish": "Beer-can chicken",
  "yt": "https://www.youtube.com/watch?v=HeTREl66P1w",
  "from": "United States · North America",
  "region": "unitedstates",
  "diet": "meat:chicken",
  "emoji": "🍗",
  "course": "main",
  "match": [
   "smoky",
   "street",
   "meat"
  ],
  "why": "A whole chicken roasted upright over an open beer can — crisp skin, impossibly juicy centre.",
  "alc": true
 },
 {
  "dish": "Shrimp and grits",
  "yt": "https://www.youtube.com/watch?v=OX-elWVQreg",
  "from": "South Carolina · United States",
  "region": "unitedstates",
  "diet": "meat:pork",
  "emoji": "🍤",
  "course": "main",
  "match": [
   "creamy",
   "comfort",
   "classic"
  ],
  "why": "Plump shrimp over stone-ground grits with bacon and gravy — Lowcountry royalty."
 },
 {
  "dish": "Chicken and waffles",
  "yt": "https://www.youtube.com/watch?v=rd3WgfjW_Vw",
  "from": "Harlem · United States",
  "region": "unitedstates",
  "diet": "meat:chicken",
  "emoji": "🧇",
  "course": "main",
  "match": [
   "crisp",
   "sweet",
   "comfort"
  ],
  "why": "Fried chicken on a waffle under maple syrup — sweet, salty, crunchy, perfect."
 },
 {
  "dish": "Cioppino",
  "yt": "https://www.youtube.com/watch?v=owQFmt1laM4",
  "from": "San Francisco · United States",
  "region": "unitedstates",
  "diet": "meat:seafood",
  "emoji": "🍲",
  "course": "main",
  "match": [
   "soup",
   "tangy",
   "adventure"
  ],
  "why": "A fisherman's tomato-wine stew crowded with crab, shrimp and fish — sourdough mandatory."
 },
 {
  "dish": "Green chile stew",
  "yt": "https://www.youtube.com/watch?v=qUylSpZsMBc",
  "from": "New Mexico · United States",
  "region": "unitedstates",
  "diet": "meat:pork",
  "emoji": "🌶️",
  "course": "main",
  "match": [
   "spice",
   "soup",
   "comfort"
  ],
  "why": "Pork simmered with roasted Hatch green chillies — the taste of New Mexico in a bowl."
 },
 {
  "dish": "Succotash",
  "yt": "https://www.youtube.com/watch?v=B0BvA3Sor-Y",
  "from": "United States · North America",
  "region": "unitedstates",
  "diet": "vegan",
  "emoji": "🌽",
  "course": "appetizer",
  "match": [
   "fresh",
   "home",
   "healthy"
  ],
  "why": "Corn, lima beans and peppers straight from the summer garden — one of America's oldest dishes."
 },
 {
  "dish": "Wild rice pilaf",
  "yt": "https://www.youtube.com/watch?v=6fSMoBEI4BI",
  "from": "Minnesota · United States",
  "region": "unitedstates",
  "diet": "vegan",
  "emoji": "🍚",
  "course": "appetizer",
  "match": [
   "rice",
   "home",
   "healthy"
  ],
  "why": "Nutty hand-harvested wild rice with mushrooms and herbs — the Great Lakes' gift."
 },
 {
  "dish": "Maryland crab cakes",
  "yt": "https://www.youtube.com/watch?v=a-lKby4SYw8",
  "from": "Maryland · United States",
  "region": "unitedstates",
  "diet": "meat:seafood",
  "emoji": "🦀",
  "course": "appetizer",
  "match": [
   "crisp",
   "classic",
   "street"
  ],
  "why": "Mostly crab, barely binder, heavy on the Old Bay — fried to a shattering crust."
 },
 {
  "dish": "Buffalo cauliflower",
  "yt": "https://www.youtube.com/watch?v=kvL8jZo6KHc",
  "from": "United States · North America",
  "region": "unitedstates",
  "diet": "vegan",
  "emoji": "🥦",
  "course": "appetizer",
  "match": [
   "spice",
   "crisp",
   "street"
  ],
  "why": "Cauliflower battered, fried and drowned in buffalo sauce — the bar snack, plant-powered."
 },
 {
  "dish": "Hoppin' John",
  "yt": "https://www.youtube.com/watch?v=Qzan5gWkhHE",
  "from": "South Carolina · United States",
  "region": "unitedstates",
  "diet": "meat:pork",
  "emoji": "🍚",
  "course": "main",
  "match": [
   "rice",
   "smoky",
   "home"
  ],
  "why": "Black-eyed peas and rice with smoked pork — the South's bowl of good fortune."
 },
 {
  "dish": "Detroit-style pizza",
  "yt": "https://www.youtube.com/watch?v=4RyOT71GjlM",
  "from": "Detroit · United States",
  "region": "unitedstates",
  "diet": "veg",
  "emoji": "🍕",
  "course": "main",
  "match": [
   "crisp",
   "comfort",
   "street"
  ],
  "why": "Thick, airy crust with cheese fired right to the edges — those crispy corners are the point."
 },
 {
  "dish": "Shrimp po' boy",
  "yt": "https://www.youtube.com/watch?v=TLO4EYA5DCQ",
  "from": "New Orleans · United States",
  "region": "unitedstates",
  "diet": "meat:seafood",
  "emoji": "🥖",
  "course": "main",
  "match": [
   "crisp",
   "street",
   "classic"
  ],
  "why": "Fried shrimp, shredded lettuce and rémoulade in a crackling French roll — dressed, always."
 },
 {
  "dish": "Chicken pot pie",
  "yt": "https://www.youtube.com/watch?v=Oai_jBXNrmA",
  "from": "Pennsylvania · United States",
  "region": "unitedstates",
  "diet": "meat:chicken",
  "emoji": "🥧",
  "course": "main",
  "match": [
   "creamy",
   "comfort",
   "home"
  ],
  "why": "Chicken and vegetables in velvet gravy under a flaky lid — the casserole of record."
 },
 {
  "dish": "Bison chili",
  "yt": "https://www.youtube.com/watch?v=4XtCrSajZ0I",
  "from": "Great Plains · United States",
  "region": "unitedstates",
  "diet": "meat:beef",
  "emoji": "🦬",
  "course": "main",
  "match": [
   "spice",
   "smoky",
   "soup"
  ],
  "why": "Lean bison simmered with chillies and beans — the prairie's answer to a cold night."
 },
 {
  "dish": "Key lime pie",
  "yt": "https://www.youtube.com/watch?v=fYrjWwXUaA0",
  "from": "Florida · United States",
  "region": "unitedstates",
  "diet": "veg",
  "emoji": "🥧",
  "course": "dessert",
  "match": [
   "sweet",
   "tangy",
   "classic"
  ],
  "why": "Tart, creamy, cold — the Keys in a graham crust, crowned with meringue."
 },
 {
  "dish": "Mac and cheese",
  "yt": "https://www.youtube.com/watch?v=XuBeqe9Ak2g",
  "from": "United States · North America",
  "region": "unitedstates",
  "diet": "veg",
  "emoji": "🧀",
  "course": "main",
  "match": [
   "creamy",
   "comfort",
   "classic"
  ],
  "why": "Elbow pasta in a sharp cheddar sauce with a bronzed top — America's comfort benchmark."
 },
 {
  "dish": "Cobb salad",
  "yt": "https://www.youtube.com/watch?v=JRUcg5zDlws",
  "from": "California · United States",
  "region": "unitedstates",
  "diet": "meat:pork",
  "emoji": "🥗",
  "course": "main",
  "match": [
   "fresh",
   "healthy",
   "classic"
  ],
  "why": "Chicken, bacon, egg, avocado and blue cheese in rows — the chopped salad that eats like dinner."
 },
 {
  "dish": "Kibbeh nayyeh",
  "yt": "https://www.youtube.com/watch?v=6w-HQwgt90Y",
  "from": "Lebanon · Middle East",
  "region": "middleeast",
  "diet": "meat:lamb",
  "emoji": "🥩",
  "course": "appetizer",
  "match": [
   "meat",
   "adventure",
   "fresh"
  ],
  "why": "Raw lamb pounded with fine bulgur and spice — the Levant's boldest mezze, eaten with mint and onion.",
  "raw": true
 },
 {
  "dish": "Koshari",
  "yt": "https://www.youtube.com/watch?v=nEC4hBdcq0k",
  "from": "Egypt · Middle East",
  "region": "middleeast",
  "diet": "vegan",
  "emoji": "🍚",
  "course": "main",
  "match": [
   "rice",
   "noodle",
   "tangy"
  ],
  "why": "Rice, lentils and pasta under spicy tomato sauce and crisp onions — Cairo's mighty street bowl."
 },
 {
  "dish": "Ful medames",
  "yt": "https://www.youtube.com/watch?v=XKlgbBOcIX0",
  "from": "Egypt · Middle East",
  "region": "middleeast",
  "diet": "vegan",
  "emoji": "🫘",
  "course": "main",
  "match": [
   "home",
   "comfort",
   "mild"
  ],
  "why": "Fava beans simmered overnight, mashed with lemon and olive oil — Egypt's ancient breakfast."
 },
 {
  "dish": "Mansaf",
  "yt": "https://www.youtube.com/watch?v=N4ykTa8yGtY",
  "from": "Jordan · Middle East",
  "region": "middleeast",
  "diet": "meat:lamb",
  "emoji": "🍚",
  "course": "main",
  "match": [
   "rice",
   "fermented",
   "comfort"
  ],
  "why": "Lamb over rice under jameed — a tangy fermented-yogurt sauce; Jordan's national celebration."
 },
 {
  "dish": "Musakhan",
  "yt": "https://www.youtube.com/watch?v=3vk0gd75hTM",
  "from": "Palestine · Middle East",
  "region": "middleeast",
  "diet": "meat:chicken",
  "emoji": "🍗",
  "course": "main",
  "match": [
   "tangy",
   "home",
   "classic"
  ],
  "why": "Chicken over taboon bread buried in sumac onions and olive oil — Palestine's national dish."
 },
 {
  "dish": "Fattoush",
  "yt": "https://www.youtube.com/watch?v=2VwJwYxK5IM",
  "from": "Lebanon · Middle East",
  "region": "middleeast",
  "diet": "vegan",
  "emoji": "🥗",
  "course": "appetizer",
  "match": [
   "fresh",
   "tangy",
   "crisp"
  ],
  "why": "Fried pita shards, purslane and sumac dressing — the Levant's brightest salad."
 },
 {
  "dish": "Tabbouleh",
  "yt": "https://www.youtube.com/watch?v=Qk1q1tXoHH8",
  "from": "Lebanon · Middle East",
  "region": "middleeast",
  "diet": "vegan",
  "emoji": "🌿",
  "course": "appetizer",
  "match": [
   "fresh",
   "healthy",
   "tangy"
  ],
  "why": "Parsley first, bulgur second — a green, lemony chop that resets the palate."
 },
 {
  "dish": "Imam bayildi",
  "yt": "https://www.youtube.com/watch?v=nn0xjbrE9oE",
  "from": "Turkey · Middle East",
  "region": "middleeast",
  "diet": "vegan",
  "emoji": "🍆",
  "course": "main",
  "match": [
   "home",
   "mild",
   "comfort"
  ],
  "why": "Aubergine stuffed with tomato and onion, poached in olive oil — 'the imam fainted', it's that good."
 },
 {
  "dish": "Menemen",
  "yt": "https://www.youtube.com/watch?v=6zotWptopRg",
  "from": "Turkey · Middle East",
  "region": "middleeast",
  "diet": "veg",
  "emoji": "🍳",
  "course": "main",
  "match": [
   "fresh",
   "home",
   "mild"
  ],
  "why": "Eggs softly scrambled into tomatoes and peppers — Turkey's lazy, perfect breakfast pan.",
  "egg": true
 },
 {
  "dish": "Adana kebab",
  "yt": "https://www.youtube.com/watch?v=Ej3B4g_PxsQ",
  "from": "Turkey · Middle East",
  "region": "middleeast",
  "diet": "meat:lamb",
  "emoji": "🍢",
  "course": "main",
  "match": [
   "spice",
   "smoky",
   "street"
  ],
  "why": "Hand-minced lamb with chilli and tail fat, grilled flat over charcoal."
 },
 {
  "dish": "Ouzi",
  "yt": "https://www.youtube.com/watch?v=igfd8BRz7Ww",
  "from": "Levant · Middle East",
  "region": "middleeast",
  "diet": "meat:lamb",
  "emoji": "🍚",
  "course": "main",
  "match": [
   "rice",
   "spice",
   "comfort"
  ],
  "why": "Spiced rice and lamb wrapped in crisp pastry parcels — a feast dish from the Levant."
 },
 {
  "dish": "Sayadieh",
  "yt": "https://www.youtube.com/watch?v=3Q-mh0bwYeY",
  "from": "Lebanon · Middle East",
  "region": "middleeast",
  "diet": "meat:fish",
  "emoji": "🐟",
  "course": "main",
  "match": [
   "rice",
   "spice",
   "classic"
  ],
  "why": "Fish over deeply spiced rice with caramelised onions — the fisherman's rice of the coast."
 },
 {
  "dish": "Mujadara",
  "yt": "https://www.youtube.com/watch?v=JDtDh5PLSo4",
  "from": "Levant · Middle East",
  "region": "middleeast",
  "diet": "vegan",
  "emoji": "🍚",
  "course": "main",
  "match": [
   "rice",
   "home",
   "comfort"
  ],
  "why": "Lentils and rice under a tangle of crisp onions — three ingredients, a thousand years old."
 },
 {
  "dish": "Bamieh",
  "yt": "https://www.youtube.com/watch?v=T8x1zbFiHAg",
  "from": "Levant · Middle East",
  "region": "middleeast",
  "diet": "meat:beef",
  "emoji": "🍲",
  "course": "main",
  "match": [
   "soup",
   "tangy",
   "home"
  ],
  "why": "Okra and beef simmered in garlic-tomato sauce — Levantine home cooking at its core."
 },
 {
  "dish": "Qatayef",
  "yt": "https://www.youtube.com/watch?v=RBW8CG2LtWI",
  "from": "Levant · Middle East",
  "region": "middleeast",
  "diet": "veg",
  "emoji": "🥞",
  "course": "dessert",
  "match": [
   "sweet",
   "classic",
   "street"
  ],
  "why": "Griddled pancakes folded around cheese or nuts, drenched in syrup — Ramadan's sweet."
 },
 {
  "dish": "Cheese sambousek",
  "yt": "https://www.youtube.com/watch?v=5Rs5mrpa9NM",
  "from": "Levant · Middle East",
  "region": "middleeast",
  "diet": "veg",
  "emoji": "🥟",
  "course": "appetizer",
  "match": [
   "crisp",
   "street",
   "comfort"
  ],
  "why": "Half-moon pastries with molten salty cheese — mezze's crisp little pockets."
 },
 {
  "dish": "Shish tawook",
  "yt": "https://www.youtube.com/watch?v=MGmZWMpd6Gk",
  "from": "Levant · Middle East",
  "region": "middleeast",
  "diet": "meat:chicken",
  "emoji": "🍢",
  "course": "main",
  "match": [
   "tangy",
   "smoky",
   "street"
  ],
  "why": "Chicken marinated in yogurt and lemon, charred at the edges, garlic sauce non-negotiable."
 },
 {
  "dish": "Harees",
  "yt": "https://www.youtube.com/watch?v=KxT5R58uUmk",
  "from": "Gulf · Middle East",
  "region": "middleeast",
  "diet": "meat:chicken",
  "emoji": "🍲",
  "course": "main",
  "match": [
   "mild",
   "comfort",
   "home"
  ],
  "why": "Wheat and chicken beaten to a silky porridge — the Gulf's dish of patience."
 },
 {
  "dish": "Machboos",
  "yt": "https://www.youtube.com/watch?v=dsu7LAOJX-E",
  "from": "Gulf · Middle East",
  "region": "middleeast",
  "diet": "meat:chicken",
  "emoji": "🍚",
  "course": "main",
  "match": [
   "rice",
   "spice",
   "biryani"
  ],
  "why": "Chicken and rice cooked with dried lime and baharat — the Gulf's answer to biryani."
 },
 {
  "dish": "Kunafa",
  "yt": "https://www.youtube.com/watch?v=xHAQ4bJdJ50",
  "from": "Palestine · Middle East",
  "region": "middleeast",
  "diet": "veg",
  "emoji": "🍯",
  "course": "dessert",
  "match": [
   "sweet",
   "creamy",
   "classic"
  ],
  "why": "Shredded pastry over molten cheese, soaked in syrup and crowned with pistachio."
 },
 {
  "dish": "Chole bhature",
  "yt": "https://www.youtube.com/watch?v=QbyXsYOTJD4",
  "from": "Punjab · South Asia",
  "region": "southasia",
  "diet": "veg",
  "emoji": "🍛",
  "course": "main",
  "match": [
   "spice",
   "comfort",
   "street"
  ],
  "why": "Cloud-puffed fried bread with chickpeas simmered dark and tangy — Punjab's big breakfast."
 },
 {
  "dish": "Rogan josh",
  "yt": "https://www.youtube.com/watch?v=5vVMBMtxVn0",
  "from": "Kashmir · South Asia",
  "region": "southasia",
  "diet": "meat:lamb",
  "emoji": "🍛",
  "course": "main",
  "match": [
   "spice",
   "meat",
   "classic"
  ],
  "why": "Lamb braised in a deep-red Kashmiri chilli gravy — aromatic warmth without the burn."
 },
 {
  "dish": "Goan fish curry",
  "yt": "https://www.youtube.com/watch?v=6Tme3rLiFzg",
  "from": "Goa · South Asia",
  "region": "southasia",
  "diet": "meat:fish",
  "emoji": "🐟",
  "course": "main",
  "match": [
   "tangy",
   "spice",
   "creamy"
  ],
  "why": "Fish in a kokum-soured coconut curry — Goa on a plate, rice on the side."
 },
 {
  "dish": "Palak paneer",
  "yt": "https://www.youtube.com/watch?v=cRsAQeR5dbI",
  "from": "Punjab · South Asia",
  "region": "southasia",
  "diet": "veg",
  "emoji": "🥬",
  "course": "main",
  "match": [
   "creamy",
   "home",
   "healthy"
  ],
  "why": "Paneer folded through silken spinach — green, gentle and quietly rich."
 },
 {
  "dish": "Aloo gobi",
  "yt": "https://www.youtube.com/watch?v=aGx_1g2ksdA",
  "from": "Punjab · South Asia",
  "region": "southasia",
  "diet": "vegan",
  "emoji": "🥔",
  "course": "main",
  "match": [
   "home",
   "mild",
   "comfort"
  ],
  "why": "Potato and cauliflower tossed with turmeric and cumin — the dhaba staple."
 },
 {
  "dish": "Dal tadka",
  "yt": "https://www.youtube.com/watch?v=8c_scYUN5uc",
  "from": "North India · South Asia",
  "region": "southasia",
  "diet": "vegan",
  "emoji": "🍲",
  "course": "main",
  "match": [
   "home",
   "comfort",
   "soup"
  ],
  "why": "Yellow dal finished with a sizzling tadka of garlic and dried red chillies — simple, essential."
 },
 {
  "dish": "Pani puri",
  "yt": "https://www.youtube.com/watch?v=-8oz0R8XCmI",
  "from": "India · South Asia",
  "region": "southasia",
  "diet": "vegan",
  "emoji": "🥟",
  "course": "appetizer",
  "match": [
   "street",
   "tangy",
   "crisp"
  ],
  "why": "Crisp shells cracked open, filled with spiced water and chutneys — a two-bite explosion."
 },
 {
  "dish": "Samosa chaat",
  "yt": "https://www.youtube.com/watch?v=d8zj8ZUiGjg",
  "from": "India · South Asia",
  "region": "southasia",
  "diet": "veg",
  "emoji": "🍽️",
  "course": "appetizer",
  "match": [
   "street",
   "tangy",
   "spice"
  ],
  "why": "A samosa smashed under chole, yogurt, chutneys and sev — chaos, deliciously."
 },
 {
  "dish": "Chicken tikka",
  "yt": "https://www.youtube.com/watch?v=6No7g2GptXY",
  "from": "Punjab · South Asia",
  "region": "southasia",
  "diet": "meat:chicken",
  "emoji": "🍢",
  "course": "appetizer",
  "match": [
   "smoky",
   "spice",
   "street"
  ],
  "why": "Yogurt-marinated chicken charred in the tandoor — the original smoky skewer."
 },
 {
  "dish": "Malai kofta",
  "yt": "https://www.youtube.com/watch?v=c8Lh4vzSQG0",
  "from": "North India · South Asia",
  "region": "southasia",
  "diet": "veg",
  "emoji": "🍛",
  "course": "main",
  "match": [
   "creamy",
   "sweet",
   "comfort"
  ],
  "why": "Vegetable dumplings floating in a cashew-cream gravy — the celebratory curry."
 },
 {
  "dish": "Dhansak",
  "yt": "https://www.youtube.com/watch?v=aOSLFGx_YH4",
  "from": "Parsi kitchens · South Asia",
  "region": "southasia",
  "diet": "meat:lamb",
  "emoji": "🍲",
  "course": "main",
  "match": [
   "soup",
   "spice",
   "comfort"
  ],
  "why": "Mutton simmered with lentils and vegetables — the Parsi Sunday legend."
 },
 {
  "dish": "Jhal muri",
  "yt": "https://www.youtube.com/watch?v=RMemEbsp6P8",
  "from": "Kolkata · South Asia",
  "region": "southasia",
  "diet": "vegan",
  "emoji": "🍚",
  "course": "appetizer",
  "match": [
   "street",
   "tangy",
   "crisp"
  ],
  "why": "Puffed rice tossed with mustard oil, chilli, onion and peanuts — Kolkata's train-station snack."
 },
 {
  "dish": "Veg momo",
  "yt": "https://www.youtube.com/watch?v=kfvXn1RMRpY",
  "from": "Nepal · South Asia",
  "region": "southasia",
  "diet": "vegan",
  "emoji": "🥟",
  "course": "appetizer",
  "match": [
   "street",
   "mild",
   "adventure"
  ],
  "why": "Steamed Himalayan dumplings with a fiery sesame-tomato chutney."
 },
 {
  "dish": "Pork momo",
  "yt": "https://www.youtube.com/watch?v=vW-EgEPkoXU",
  "from": "Nepal · South Asia",
  "region": "southasia",
  "diet": "meat:pork",
  "emoji": "🥟",
  "course": "appetizer",
  "match": [
   "street",
   "adventure",
   "meat"
  ],
  "why": "Juicy pork dumplings, steamed or kothey-fried, with chutney that bites back."
 },
 {
  "dish": "Hoppers",
  "yt": "https://www.youtube.com/watch?v=fEMPYgqOd68",
  "from": "Sri Lanka · South Asia",
  "region": "southasia",
  "diet": "veg",
  "emoji": "🥞",
  "course": "main",
  "match": [
   "crisp",
   "tangy",
   "street"
  ],
  "why": "Bowl-shaped coconut pancakes with lacy crisp edges — made for sambol and curry."
 },
 {
  "dish": "Kottu roti",
  "yt": "https://www.youtube.com/watch?v=jAoHEB1_mb8",
  "from": "Sri Lanka · South Asia",
  "region": "southasia",
  "diet": "meat:chicken",
  "emoji": "🔪",
  "course": "main",
  "match": [
   "street",
   "spice",
   "crisp"
  ],
  "why": "Roti, chicken and vegetables chopped on a hot griddle with twin blades — dinner and a rhythm section."
 },
 {
  "dish": "Kerala prawn curry",
  "yt": "https://www.youtube.com/watch?v=5FndrNwooEo",
  "from": "Kerala · South Asia",
  "region": "southasia",
  "diet": "meat:seafood",
  "emoji": "🍤",
  "course": "main",
  "match": [
   "creamy",
   "spice",
   "tangy"
  ],
  "why": "Prawns in coconut milk with kokum and curry leaves — the coast in a curry."
 },
 {
  "dish": "Baingan bharta",
  "yt": "https://www.youtube.com/watch?v=F4FCLcht7A0",
  "from": "Punjab · South Asia",
  "region": "southasia",
  "diet": "vegan",
  "emoji": "🍆",
  "course": "main",
  "match": [
   "smoky",
   "home",
   "comfort"
  ],
  "why": "Aubergine roasted over open flame, mashed with tomato, onion and peas — smoke you can taste."
 },
 {
  "dish": "Rajma",
  "yt": "https://www.youtube.com/watch?v=8IOZ7-32Q3Y",
  "from": "North India · South Asia",
  "region": "southasia",
  "diet": "vegan",
  "emoji": "🫘",
  "course": "main",
  "match": [
   "home",
   "comfort",
   "soup"
  ],
  "why": "Kidney beans in a ginger-tomato gravy — the Sunday curry of the north."
 },
 {
  "dish": "Chicken karahi",
  "yt": "https://www.youtube.com/watch?v=XDYNofJ1zI8",
  "from": "Karachi · South Asia",
  "region": "southasia",
  "diet": "meat:chicken",
  "emoji": "🍗",
  "course": "main",
  "match": [
   "spice",
   "tangy",
   "street"
  ],
  "why": "Chicken wok-tossed with tomatoes, green chillies and ginger — no onions, no apologies."
 },
 {
  "dish": "Rasmalai",
  "yt": "https://www.youtube.com/watch?v=dq3CTGwL4cE",
  "from": "Bengal · South Asia",
  "region": "southasia",
  "diet": "veg",
  "emoji": "🍮",
  "course": "dessert",
  "match": [
   "sweet",
   "creamy",
   "classic"
  ],
  "why": "Feather-light cheese discs soaked in saffron-cardamom milk — Bengal's cloud dessert."
 },
 {
  "dish": "Chicken dum biryani",
  "yt": "https://www.youtube.com/watch?v=uygb9O-MDPw",
  "from": "Hyderabad · Deccan",
  "region": "hyderabad",
  "diet": "meat:chicken",
  "emoji": "🍗",
  "course": "main",
  "match": [
   "biryani",
   "rice",
   "spice"
  ],
  "why": "The original kacchi dum biryani — raw marinated chicken layered with rice and sealed, the Deccan's crown."
 },
 {
  "dish": "Mutton biryani",
  "yt": "https://www.youtube.com/watch?v=E49fvjd6vtg",
  "from": "Hyderabad · Deccan",
  "region": "hyderabad",
  "diet": "meat:lamb",
  "emoji": "🍚",
  "course": "main",
  "match": [
   "biryani",
   "rice",
   "meat"
  ],
  "why": "Tender mutton folded through saffron rice, mirchi ka salan on the side — the wedding standard."
 },
 {
  "dish": "Mirchi ka salan",
  "yt": "https://www.youtube.com/watch?v=hxDNOfy7XbA",
  "from": "Hyderabad · Deccan",
  "region": "hyderabad",
  "diet": "vegan",
  "emoji": "🌶️",
  "course": "main",
  "match": [
   "spice",
   "tangy",
   "comfort"
  ],
  "why": "Big green chillies simmered in a peanut-sesame curry — biryani's fiery, nutty partner."
 },
 {
  "dish": "Baghare baingan",
  "yt": "https://www.youtube.com/watch?v=P68XYjqazJs",
  "from": "Hyderabad · Deccan",
  "region": "hyderabad",
  "diet": "vegan",
  "emoji": "🍆",
  "course": "main",
  "match": [
   "creamy",
   "tangy",
   "home"
  ],
  "why": "Baby aubergines in a coconut-peanut-sesame gravy — the salan family's silky sibling."
 },
 {
  "dish": "Dalcha",
  "yt": "https://www.youtube.com/watch?v=5In8b-KECj4",
  "from": "Hyderabad · Deccan",
  "region": "hyderabad",
  "diet": "meat:lamb",
  "emoji": "🍲",
  "course": "main",
  "match": [
   "soup",
   "tangy",
   "home"
  ],
  "why": "Mutton and lentils cooked with bottle gourd — the stew that makes bagara khana complete."
 },
 {
  "dish": "Khatti dal",
  "yt": "https://www.youtube.com/watch?v=5lVaOuNhBbU",
  "from": "Hyderabad · Deccan",
  "region": "hyderabad",
  "diet": "vegan",
  "emoji": "🍲",
  "course": "main",
  "match": [
   "tangy",
   "soup",
   "home"
  ],
  "why": "Sour tamarind dal with a baghaar of garlic and red chillies — Hyderabadi home cooking's tang."
 },
 {
  "dish": "Tahari",
  "yt": "https://www.youtube.com/watch?v=dfRn4xGWAE4",
  "from": "Hyderabad · Deccan",
  "region": "hyderabad",
  "diet": "meat:beef",
  "emoji": "🍚",
  "course": "main",
  "match": [
   "rice",
   "spice",
   "home"
  ],
  "why": "Beef and rice cooked together in one spiced pot — the old city's everyday biryani cousin."
 },
 {
  "dish": "Chicken khorma",
  "yt": "https://www.youtube.com/watch?v=AtvMZg0pPUE",
  "from": "Hyderabad · Deccan",
  "region": "hyderabad",
  "diet": "meat:chicken",
  "emoji": "🍛",
  "course": "main",
  "match": [
   "creamy",
   "mild",
   "comfort"
  ],
  "why": "Chicken in a rich, gently spiced Deccan korma — wedding-banquet comfort."
 },
 {
  "dish": "Pathar ka gosht",
  "yt": "https://www.youtube.com/watch?v=Rt93a7PLuIc",
  "from": "Hyderabad · Deccan",
  "region": "hyderabad",
  "diet": "meat:lamb",
  "emoji": "🥩",
  "course": "appetizer",
  "match": [
   "smoky",
   "spice",
   "street"
  ],
  "why": "Lamb cooked on a scorching stone slab — the old city's most primal kebab."
 },
 {
  "dish": "Boti kebab",
  "yt": "https://www.youtube.com/watch?v=fvphvhF72H8",
  "from": "Hyderabad · Deccan",
  "region": "hyderabad",
  "diet": "meat:beef",
  "emoji": "🍢",
  "course": "appetizer",
  "match": [
   "smoky",
   "meat",
   "street"
  ],
  "why": "Char-grilled beef cubes with raw onion and lemon — bazaar food, Deccan style."
 },
 {
  "dish": "Irani chai and osmania biscuit",
  "yt": "https://www.youtube.com/watch?v=tmEu22tA63M",
  "from": "Hyderabad · Deccan",
  "region": "hyderabad",
  "diet": "veg",
  "emoji": "☕",
  "course": "drink",
  "match": [
   "coffee",
   "sweet",
   "classic"
  ],
  "why": "Thick, sweet Irani chai dunked with a salty-sweet osmania — the café ritual of the old city."
 },
 {
  "dish": "Double ka meetha",
  "yt": "https://www.youtube.com/watch?v=AKbbiCMUHQ8",
  "from": "Hyderabad · Deccan",
  "region": "hyderabad",
  "diet": "veg",
  "emoji": "🍞",
  "course": "dessert",
  "match": [
   "sweet",
   "comfort",
   "classic"
  ],
  "why": "Fried bread soaked in saffron-rabri syrup — the Deccan's bread pudding, richer and prouder."
 },
 {
  "dish": "Qubani ka meetha",
  "yt": "https://www.youtube.com/watch?v=95od9GEKZFQ",
  "from": "Hyderabad · Deccan",
  "region": "hyderabad",
  "diet": "veg",
  "emoji": "🍑",
  "course": "dessert",
  "match": [
   "sweet",
   "home",
   "classic"
  ],
  "why": "Stewed apricots with their kernels, served with malai — sunshine in a bowl."
 },
 {
  "dish": "Marag",
  "yt": "https://www.youtube.com/watch?v=TkO_Fyc0ExI",
  "from": "Hyderabad · Deccan",
  "region": "hyderabad",
  "diet": "meat:chicken",
  "emoji": "🍲",
  "course": "appetizer",
  "match": [
   "soup",
   "spice",
   "comfort"
  ],
  "why": "A thin, fiery chicken soup with black pepper — the valima course that starts the feast."
 },
 {
  "dish": "Paya",
  "yt": "https://www.youtube.com/watch?v=jpBiEM7R9WA",
  "from": "Hyderabad · Deccan",
  "region": "hyderabad",
  "diet": "meat:lamb",
  "emoji": "🍲",
  "course": "main",
  "match": [
   "soup",
   "spice",
   "adventure"
  ],
  "why": "Trotters slow-cooked to a sticky, marrow-rich broth — patience in a bowl."
 },
 {
  "dish": "Talawa gosht",
  "yt": "https://www.youtube.com/watch?v=scI4bFBTbYI",
  "from": "Hyderabad · Deccan",
  "region": "hyderabad",
  "diet": "meat:beef",
  "emoji": "🥩",
  "course": "appetizer",
  "match": [
   "crisp",
   "spice",
   "home"
  ],
  "why": "Beef fried crisp with curry leaves and red chillies — the dry fry every Deccan table knows."
 },
 {
  "dish": "Sofiyani biryani",
  "yt": "https://www.youtube.com/watch?v=gzjZ6PHPcLI",
  "from": "Hyderabad · Deccan",
  "region": "hyderabad",
  "diet": "meat:chicken",
  "emoji": "🍚",
  "course": "main",
  "match": [
   "biryani",
   "mild",
   "rice"
  ],
  "why": "The white biryani — chicken and rice in a pale, almond-kissed masala, all perfume, no fire."
 },
 {
  "dish": "Keema matar",
  "yt": "https://www.youtube.com/watch?v=aaq8rtX43ac",
  "from": "Hyderabad · Deccan",
  "region": "hyderabad",
  "diet": "meat:lamb",
  "emoji": "🍛",
  "course": "main",
  "match": [
   "meat",
   "spice",
   "home"
  ],
  "why": "Minced lamb with peas in a homestyle masala — weeknight Deccan, rotis mandatory."
 },
 {
  "dish": "Bagara khana",
  "yt": "https://www.youtube.com/watch?v=lZOccMAbS2s",
  "from": "Hyderabad · Deccan",
  "region": "hyderabad",
  "diet": "vegan",
  "emoji": "🍚",
  "course": "main",
  "match": [
   "rice",
   "home",
   "mild"
  ],
  "why": "Rice tempered whole-spice and ghee-free, made to carry dalcha — the quiet foundation of the dastarkhwan."
 },
 {
  "dish": "Tomato charu",
  "yt": "https://www.youtube.com/watch?v=vYqzxxiGoms",
  "from": "Hyderabad · Deccan",
  "region": "hyderabad",
  "diet": "vegan",
  "emoji": "🍅",
  "course": "appetizer",
  "match": [
   "soup",
   "tangy",
   "spice"
  ],
  "why": "A peppery tomato-tamarind rasam — the pour-over that wakes plain rice up."
 },
 {
  "dish": "Apollo fish",
  "yt": "https://www.youtube.com/watch?v=eI14EkbSa84",
  "from": "Hyderabad · Deccan",
  "region": "hyderabad",
  "diet": "meat:fish",
  "emoji": "🐟",
  "course": "appetizer",
  "match": [
   "spice",
   "crisp",
   "street"
  ],
  "why": "Batter-fried fish tossed with curry leaves, chillies and yogurt — a Hyderabadi restaurant invention gone legend."
 },
 {
  "dish": "Gongura mutton",
  "yt": "https://www.youtube.com/watch?v=7bxrErK-AOY",
  "from": "Andhra · Deccan",
  "region": "hyderabad",
  "diet": "meat:lamb",
  "emoji": "🍛",
  "course": "main",
  "match": [
   "tangy",
   "spice",
   "meat"
  ],
  "why": "Mutton soured with gongura leaves — the fiery, tangy pride of the Andhra table."
 },
 {
  "dish": "Sheer khurma",
  "yt": "https://www.youtube.com/watch?v=xMc7bFXDtzk",
  "from": "Hyderabad · Deccan",
  "region": "hyderabad",
  "diet": "veg",
  "emoji": "🥛",
  "course": "dessert",
  "match": [
   "sweet",
   "creamy",
   "classic"
  ],
  "why": "Vermicelli simmered in milk with dates and nuts — Eid morning in a bowl."
 },
 {
  "dish": "Zobo",
  "yt": "https://www.youtube.com/watch?v=DOsvv5-IZU4",
  "from": "Nigeria · Africa",
  "region": "africa",
  "diet": "vegan",
  "emoji": "🥤",
  "course": "drink",
  "match": [
   "tangy",
   "fresh",
   "sweet"
  ],
  "why": "Deep-red hibiscus drink with ginger and pineapple — Nigeria's party refresher."
 },
 {
  "dish": "Rooibos iced tea",
  "yt": "https://www.youtube.com/watch?v=4EmlMkyQ7ww",
  "from": "South Africa · Africa",
  "region": "africa",
  "diet": "vegan",
  "emoji": "🧊",
  "course": "drink",
  "match": [
   "fresh",
   "sweet",
   "healthy"
  ],
  "why": "Caffeine-free rooibos over ice with citrus and mint — sundowner country in a glass."
 },
 {
  "dish": "Akara",
  "yt": "https://www.youtube.com/watch?v=r2hVi_f4M6g",
  "from": "Nigeria · Africa",
  "region": "africa",
  "diet": "vegan",
  "emoji": "🧆",
  "course": "appetizer",
  "match": [
   "crisp",
   "street",
   "comfort"
  ],
  "why": "Black-eyed pea fritters, crisp outside and fluffy within — breakfast and street-stall staple."
 },
 {
  "dish": "Koeksister",
  "yt": "https://www.youtube.com/watch?v=9v-hmn-f2PU",
  "from": "Cape Town · Africa",
  "region": "africa",
  "diet": "veg",
  "emoji": "🍩",
  "course": "dessert",
  "match": [
   "sweet",
   "classic",
   "street"
  ],
  "why": "Plaited doughnuts soaked in spiced syrup — sticky, crunchy, unapologetically sweet."
 },
 {
  "dish": "Bubble tea",
  "yt": "https://www.youtube.com/watch?v=buz6Zq-Ewzw",
  "from": "Taiwan · East Asia",
  "region": "eastasia",
  "diet": "veg",
  "emoji": "🧋",
  "course": "drink",
  "match": [
   "sweet",
   "creamy"
  ],
  "why": "Milk tea with chewy tapioca pearls — the original bubble tea from Taiwan."
 },
 {
  "dish": "Vietnamese iced coffee",
  "yt": "https://www.youtube.com/watch?v=Cb-6UyXo7Js",
  "from": "Vietnam · East Asia",
  "region": "eastasia",
  "diet": "veg",
  "emoji": "☕",
  "course": "drink",
  "match": [
   "coffee",
   "sweet",
   "creamy"
  ],
  "why": "Slow-drip robusta over condensed milk and ice — strong, sweet, ice-cold."
 },
 {
  "dish": "Mango sticky rice",
  "yt": "https://www.youtube.com/watch?v=M7_WdFhI7Hk",
  "from": "Thailand · East Asia",
  "region": "eastasia",
  "diet": "vegan",
  "emoji": "🥭",
  "course": "dessert",
  "match": [
   "sweet",
   "creamy",
   "rice"
  ],
  "why": "Glutinous rice in coconut milk with ripe mango — Thailand's beloved dessert."
 },
 {
  "dish": "Mochi ice cream",
  "yt": "https://www.youtube.com/watch?v=EmwGaqjMJkM",
  "from": "Japan · East Asia",
  "region": "eastasia",
  "diet": "veg",
  "emoji": "🍡",
  "course": "dessert",
  "match": [
   "sweet",
   "creamy",
   "adventure"
  ],
  "why": "Ice cream wrapped in soft, chewy rice dough — a bite-sized Japanese treat."
 },
 {
  "dish": "Sangria",
  "yt": "https://www.youtube.com/watch?v=nZVsCkC-wqs",
  "from": "Spain · Europe",
  "region": "europe",
  "diet": "vegan",
  "emoji": "🍷",
  "course": "drink",
  "match": [
   "sweet",
   "fresh"
  ],
  "why": "Red wine steeped with oranges and orchard fruit — Spain's summer pitcher.",
  "alc": true
 },
 {
  "dish": "Horchata de chufa",
  "yt": "https://www.youtube.com/watch?v=PoekAiXtm2k",
  "from": "Valencia · Europe",
  "region": "europe",
  "diet": "vegan",
  "emoji": "🥛",
  "course": "drink",
  "match": [
   "sweet",
   "creamy",
   "healthy"
  ],
  "why": "Tiger-nut milk from Valencia — creamy, nutty and naturally sweet, no dairy."
 },
 {
  "dish": "Crème brûlée",
  "yt": "https://www.youtube.com/watch?v=6tSdlo0r0Io",
  "from": "France · Europe",
  "region": "europe",
  "diet": "veg",
  "emoji": "🍮",
  "course": "dessert",
  "match": [
   "sweet",
   "creamy",
   "classic"
  ],
  "why": "Vanilla custard under a shattering caramel shell — the French classic."
 },
 {
  "dish": "Basque cheesecake",
  "yt": "https://www.youtube.com/watch?v=5KzDltdMpaQ",
  "from": "Basque Country · Europe",
  "region": "europe",
  "diet": "veg",
  "emoji": "🍰",
  "course": "dessert",
  "match": [
   "sweet",
   "creamy",
   "classic"
  ],
  "why": "Burnt-top cheesecake from San Sebastián — caramelised outside, molten within."
 },
 {
  "dish": "Falooda",
  "yt": "https://www.youtube.com/watch?v=HjZ859V1-4E",
  "from": "Hyderabad · Deccan",
  "region": "hyderabad",
  "diet": "veg",
  "emoji": "🥤",
  "course": "drink",
  "match": [
   "sweet",
   "creamy"
  ],
  "why": "Rose milk layered with vermicelli, basil seeds and ice cream — a tall, pink celebration."
 },
 {
  "dish": "Nannari sharbat",
  "yt": "https://www.youtube.com/watch?v=WMNx0Auo-Io",
  "from": "Hyderabad · Deccan",
  "region": "hyderabad",
  "diet": "vegan",
  "emoji": "🍹",
  "course": "drink",
  "match": [
   "sweet",
   "fresh",
   "healthy"
  ],
  "why": "Sarsaparilla-root cooler — an old Deccan summer drink, earthy and ice-cold."
 },
 {
  "dish": "Luqmi",
  "yt": "https://www.youtube.com/watch?v=xgeOXS7z2uo",
  "from": "Hyderabad · Deccan",
  "region": "hyderabad",
  "diet": "meat:lamb",
  "emoji": "🥟",
  "course": "appetizer",
  "match": [
   "crisp",
   "meat",
   "classic"
  ],
  "why": "Flaky pastry pockets of spiced minced lamb — the Hyderabadi starter of celebrations."
 },
 {
  "dish": "Gil e firdaus",
  "yt": "https://www.youtube.com/watch?v=xWyL7DfzN60",
  "from": "Hyderabad · Deccan",
  "region": "hyderabad",
  "diet": "veg",
  "emoji": "🍮",
  "course": "dessert",
  "match": [
   "sweet",
   "creamy",
   "classic"
  ],
  "why": "Bottle-gourd and milk pudding with nuts — a Nizam-era dessert, 'the clay of paradise'."
 },
 {
  "dish": "Horchata",
  "yt": "https://www.youtube.com/watch?v=tcMbGS2pvAk",
  "from": "Mexico · Latin America",
  "region": "latinamerica",
  "diet": "vegan",
  "emoji": "🥛",
  "course": "drink",
  "match": [
   "sweet",
   "creamy"
  ],
  "why": "Cinnamon rice milk, ice-cold — the taqueria classic that cools every bite."
 },
 {
  "dish": "Chicha morada",
  "yt": "https://www.youtube.com/watch?v=W4m1l8Zesqs",
  "from": "Peru · Latin America",
  "region": "latinamerica",
  "diet": "vegan",
  "emoji": "🍇",
  "course": "drink",
  "match": [
   "sweet",
   "tangy",
   "spice"
  ],
  "why": "Purple-corn drink with pineapple and warm spices — Peru's deep-violet refresher."
 },
 {
  "dish": "Tres leches cake",
  "yt": "https://www.youtube.com/watch?v=bJfgEx2PBIg",
  "from": "Mexico · Latin America",
  "region": "latinamerica",
  "diet": "veg",
  "emoji": "🍰",
  "course": "dessert",
  "match": [
   "sweet",
   "creamy",
   "classic"
  ],
  "why": "Sponge soaked in three milks — impossibly moist, crowned with cream."
 },
 {
  "dish": "Brigadeiros",
  "yt": "https://www.youtube.com/watch?v=r9P4F8rzkts",
  "from": "Brazil · Latin America",
  "region": "latinamerica",
  "diet": "veg",
  "emoji": "🍫",
  "course": "dessert",
  "match": [
   "sweet",
   "creamy"
  ],
  "why": "Condensed-milk chocolate truffles rolled in sprinkles — Brazil's party sweet."
 },
 {
  "dish": "Turkish coffee",
  "yt": "https://www.youtube.com/watch?v=TvNWLrRzIAM",
  "from": "Türkiye · Middle East",
  "region": "middleeast",
  "diet": "vegan",
  "emoji": "☕",
  "course": "drink",
  "match": [
   "coffee",
   "classic"
  ],
  "why": "Finely ground coffee simmered in a cezve — thick, dark and unfiltered."
 },
 {
  "dish": "Limonana",
  "yt": "https://www.youtube.com/watch?v=2yPYQ4RBQkY",
  "from": "Levant · Middle East",
  "region": "middleeast",
  "diet": "vegan",
  "emoji": "🍋",
  "course": "drink",
  "match": [
   "fresh",
   "tangy",
   "sweet"
  ],
  "why": "Blended mint lemonade — the Levant's electric-green summer cooler."
 },
 {
  "dish": "Baklava",
  "yt": "https://www.youtube.com/watch?v=IWS9giQlwzU",
  "from": "Gaziantep · Middle East",
  "region": "middleeast",
  "diet": "veg",
  "emoji": "🥮",
  "course": "dessert",
  "match": [
   "sweet",
   "crisp",
   "classic"
  ],
  "why": "Forty layers of filo, pistachio and syrup — the queen of Middle Eastern desserts."
 },
 {
  "dish": "Baba ghanoush",
  "yt": "https://www.youtube.com/watch?v=QXZ1ql-pvpc",
  "from": "Levant · Middle East",
  "region": "middleeast",
  "diet": "vegan",
  "emoji": "🍆",
  "course": "appetizer",
  "match": [
   "smoky",
   "creamy",
   "tangy"
  ],
  "why": "Charred aubergine whipped with tahini and lemon — the smoky mezze."
 },
 {
  "dish": "Masala chai",
  "yt": "https://www.youtube.com/watch?v=PBxQdK-NrRc",
  "from": "India · South Asia",
  "region": "southasia",
  "diet": "veg",
  "emoji": "☕",
  "course": "drink",
  "match": [
   "spice",
   "creamy",
   "classic"
  ],
  "why": "Milk tea boiled with ginger and crushed spices — India's daily ritual."
 },
 {
  "dish": "Jaljeera",
  "yt": "https://www.youtube.com/watch?v=J7UDjNVxUFw",
  "from": "India · South Asia",
  "region": "southasia",
  "diet": "vegan",
  "emoji": "🍋",
  "course": "drink",
  "match": [
   "tangy",
   "spice",
   "fresh"
  ],
  "why": "Cumin-and-mint cooler with a salty tang — the appetiser in a glass."
 },
 {
  "dish": "Gulab jamun",
  "yt": "https://www.youtube.com/watch?v=QFvd7u_YjVk",
  "from": "India · South Asia",
  "region": "southasia",
  "diet": "veg",
  "emoji": "🍮",
  "course": "dessert",
  "match": [
   "sweet",
   "classic",
   "creamy"
  ],
  "why": "Warm milk dumplings in rose-cardamom syrup — the subcontinent's celebration sweet."
 },
 {
  "dish": "Kulfi",
  "yt": "https://www.youtube.com/watch?v=f6D7A6-QNl8",
  "from": "Delhi · South Asia",
  "region": "southasia",
  "diet": "veg",
  "emoji": "🍦",
  "course": "dessert",
  "match": [
   "sweet",
   "creamy",
   "classic"
  ],
  "why": "Dense, slow-cooked milk ice cream with pistachio — no churning, all richness."
 },
 {
  "dish": "Sweet tea",
  "yt": "https://www.youtube.com/watch?v=0gl9DQ_ysUo",
  "from": "Georgia · United States",
  "region": "unitedstates",
  "diet": "vegan",
  "emoji": "🥤",
  "course": "drink",
  "match": [
   "sweet",
   "fresh"
  ],
  "why": "Brewed strong, sweetened deep and served over ice — the South's house wine."
 },
 {
  "dish": "Root beer float",
  "yt": "https://www.youtube.com/watch?v=FYJRosv_Arc",
  "from": "Midwest · United States",
  "region": "unitedstates",
  "diet": "veg",
  "emoji": "🍨",
  "course": "drink",
  "match": [
   "sweet",
   "creamy",
   "classic"
  ],
  "why": "Vanilla ice cream drowned in root beer — a soda-fountain time machine."
 },
 {
  "dish": "New York cheesecake",
  "yt": "https://www.youtube.com/watch?v=gPgF9giAphU",
  "from": "New York · United States",
  "region": "unitedstates",
  "diet": "veg",
  "emoji": "🍰",
  "course": "dessert",
  "match": [
   "sweet",
   "creamy",
   "classic"
  ],
  "why": "Tall, dense and unapologetic — the deli-counter original."
 },
 {
  "dish": "Pecan pie",
  "yt": "https://www.youtube.com/watch?v=fXlflbn6E-g",
  "from": "Texas · United States",
  "region": "unitedstates",
  "diet": "veg",
  "emoji": "🥧",
  "course": "dessert",
  "match": [
   "sweet",
   "classic",
   "comfort"
  ],
  "why": "Dark-syrup pecan custard in a crisp shell — the Southern holiday pie."
 }
];
