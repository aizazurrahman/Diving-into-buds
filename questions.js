// Diving into Buds — 50-question taste profile
// Each option carries flavour tags (for the profile) and 0–3 scores
// for the spice / sweet / adventure meters.
const U = (id) => `https://images.unsplash.com/${id}?q=80&w=1200&auto=format&fit=crop`;

const QUESTIONS = [
  // ——— The Hyderabadi opening ———
  { q: "The big one first — your biryani of choice?", emoji: "🍛", img: U("photo-1563379091339-03b21ab4a4f8"),
    options: [
      { t: "Chicken biryani", tags: ["biryani", "deccan", "meat"] },
      { t: "Mutton biryani", tags: ["biryani", "deccan", "meat"] },
      { t: "Veg biryani (yes, it exists!)", tags: ["biryani", "deccan", "veg"] },
      { t: "All three. Don't make me pick.", tags: ["biryani", "deccan", "adventure"], adv: 2 } ] },
  { q: "Rice or noodles — what's your comfort base?", emoji: "🍜", img: U("photo-1512058564366-18510be2db19"),
    options: [
      { t: "Rice, always", tags: ["rice"] },
      { t: "Noodles, any day", tags: ["noodle"] },
      { t: "Depends on the mood", tags: ["classic"] } ] },
  { q: "White rice or flavoured rice — bagara, pulao, biryani-style?", emoji: "🍚", img: U("photo-1586201375761-83865001e31c"),
    options: [
      { t: "Plain white rice, clean & simple", tags: ["rice", "classic"] },
      { t: "Flavoured & fragrant, every time", tags: ["rice", "deccan"], spice: 1 } ] },
  { q: "Biryani is served. What happens first?", emoji: "🍽️", img: U("photo-1589302168068-964664d93dc0"),
    options: [
      { t: "Mirchi ka salan & raita on the side", tags: ["deccan"], spice: 2 },
      { t: "Nothing. Biryani solo, no distractions.", tags: ["biryani", "classic"] },
      { t: "Extra masala, extra spicy", tags: ["spice"], spice: 3 } ] },
  { q: "Slow-cooked comfort: haleem or nihari?", emoji: "🍲", img: U("photo-1547592166-23ac45744acd"),
    options: [
      { t: "Haleem — rich, pounded, perfect", tags: ["deccan", "meat"] },
      { t: "Nihari — that gravy!", tags: ["deccan", "meat"], spice: 1 },
      { t: "Both. This is not a real question.", tags: ["deccan", "meat", "adventure"], adv: 1 } ] },
  { q: "Your chai ritual?", emoji: "☕", img: U("photo-1544787219-7f47ccb76574"),
    options: [
      { t: "Irani chai + Osmania biscuit", tags: ["chai", "deccan"] },
      { t: "Strong masala chai", tags: ["chai"], spice: 1 },
      { t: "Cutting chai, roadside style", tags: ["chai", "street"] },
      { t: "I'm a coffee person, actually", tags: ["coffee"] } ] },
  { q: "Kebab o'clock — pick your fighter:", emoji: "🍢", img: U("photo-1555939594-58d7cb561ad1"),
    options: [
      { t: "Seekh kebab", tags: ["meat", "deccan"], spice: 2 },
      { t: "Shami kebab", tags: ["meat", "deccan"] },
      { t: "Chicken tikka", tags: ["meat"], spice: 2 },
      { t: "Paneer tikka", tags: ["veg"], spice: 2 } ] },
  { q: "Be honest — how hot is too hot?", emoji: "🌶️", img: U("photo-1596040033229-a9821ebd058d"),
    options: [
      { t: "Bring the green chillies", tags: ["spice"], spice: 3 },
      { t: "Balanced warmth", tags: ["classic"], spice: 2 },
      { t: "Mild, please", tags: ["mild"], spice: 1 },
      { t: "My taste buds fear nothing", tags: ["spice", "adventure"], spice: 3, adv: 2 } ] },
  { q: "Breakfast, Deccan style:", emoji: "🥞", img: U("photo-1630383249896-424e482df921"),
    options: [
      { t: "Crispy dosa", tags: ["veg", "classic"] },
      { t: "Soft idlis", tags: ["veg", "mild"] },
      { t: "Puri & aloo", tags: ["veg"] },
      { t: "Pesarattu, the underrated hero", tags: ["veg", "adventure"], adv: 1 } ] },
  { q: "Khatti dal & steamed rice — that tang. Yes or no?", emoji: "🍋", img: U("photo-1512058564366-18510be2db19"),
    options: [
      { t: "Yes! That tang is home.", tags: ["deccan", "home"] },
      { t: "Prefer my dal regular", tags: ["home", "classic"] },
      { t: "Never tried it", tags: ["adventure"], adv: 1 } ] },
  { q: "Dessert from the Old City:", emoji: "🍮", img: U("photo-1488477181946-6428a0291777"),
    options: [
      { t: "Double ka meetha", tags: ["sweet", "deccan"], sweet: 3 },
      { t: "Qubani ka meetha", tags: ["sweet", "deccan"], sweet: 2 },
      { t: "Faluda, tall & loaded", tags: ["sweet", "street"], sweet: 3 },
      { t: "Jauzi halwa, old-school", tags: ["sweet", "deccan", "classic"], sweet: 2 } ] },
  { q: "Late night near Charminar — you're eating:", emoji: "🌙", img: U("photo-1504674900247-0877df9cc836"),
    options: [
      { t: "Kebabs straight off the grill", tags: ["street", "meat"], spice: 2 },
      { t: "Biryani, obviously", tags: ["biryani", "street"] },
      { t: "Chaat & snacks", tags: ["street"], spice: 2 },
      { t: "Just chai & biscuits", tags: ["chai", "street", "mild"] } ] },

  // ——— Widening the net ———
  { q: "Noodle personality — which bowl is you?", emoji: "🍜", img: U("photo-1585032226651-759b368d7246"),
    options: [
      { t: "Hakka noodles", tags: ["noodle", "street"] },
      { t: "A deep, brothy ramen", tags: ["noodle", "adventure"], adv: 1 },
      { t: "Pad Thai, sweet-tangy", tags: ["noodle"], sweet: 1 },
      { t: "Schezwan noodles, fiery", tags: ["noodle", "spice"], spice: 3 } ] },
  { q: "Soup season — your bowl:", emoji: "🥣", img: U("photo-1547592180-85f173990554"),
    options: [
      { t: "Tomato soup, classic", tags: ["classic", "mild"] },
      { t: "Hot & sour", tags: ["spice"], spice: 2 },
      { t: "Cream of mushroom", tags: ["classic"] },
      { t: "Manchow, with the crispy noodles", tags: ["noodle"], spice: 2 } ] },
  { q: "Pasta sauce allegiance:", emoji: "🍝", img: U("photo-1473093295043-cdd812d0e601"),
    options: [
      { t: "Arrabbiata — red & fiery", tags: ["spice"], spice: 2 },
      { t: "Alfredo — white & creamy", tags: ["classic", "mild"] },
      { t: "Pesto — herby & fresh", tags: ["healthy", "adventure"], adv: 1 },
      { t: "Pink sauce — best of both", tags: ["classic"] } ] },
  { q: "Pizza night rules:", emoji: "🍕", img: U("photo-1513104890138-7c749659a591"),
    options: [
      { t: "Thin crust, minimal fuss", tags: ["classic"] },
      { t: "Cheese burst, no regrets", tags: ["sweet"], sweet: 1 },
      { t: "Wood-fired & classic", tags: ["classic", "adventure"], adv: 1 },
      { t: "Desi-style, spicy & loaded", tags: ["spice"], spice: 2 } ] },
  { q: "Build your burger:", emoji: "🍔", img: U("photo-1568901346375-23c9450c58cd"),
    options: [
      { t: "Classic cheeseburger", tags: ["meat", "classic"] },
      { t: "Crispy chicken burger", tags: ["meat"] },
      { t: "Veggie & fresh", tags: ["veg", "healthy"] },
      { t: "Double everything", tags: ["meat", "adventure"], adv: 1 } ] },
  { q: "At the chaat counter, your first order:", emoji: "🧆", img: U("photo-1601050690597-df0568f70950"),
    options: [
      { t: "Pani puri — extra teekha", tags: ["street", "spice"], spice: 3 },
      { t: "Samosa chaat", tags: ["street"], spice: 2 },
      { t: "Bhel puri", tags: ["street"], spice: 2 },
      { t: "Dahi bhalla, cool & creamy", tags: ["street", "mild"], spice: 1 } ] },
  { q: "Momos — steamed or fried?", emoji: "🥟", img: U("photo-1496116218417-1a781b1c416"),
    options: [
      { t: "Steamed, with fiery chutney", tags: ["street"], spice: 3 },
      { t: "Fried & crispy", tags: ["street"] },
      { t: "Tandoori momos", tags: ["street", "adventure"], adv: 1, spice: 2 },
      { t: "Jhol momos, in the soup", tags: ["street", "adventure"], adv: 2 } ] },
  { q: "Fries deserve which seasoning?", emoji: "🍟", img: U("photo-1518013431117-eb1465fa5752"),
    options: [
      { t: "Peri peri — fiery dust", tags: ["spice"], spice: 3 },
      { t: "Tangy chaat masala", tags: ["street"], spice: 2 },
      { t: "Just salt. Respect the potato.", tags: ["classic", "mild"], spice: 0 },
      { t: "Cheese dust everything", tags: ["classic"] } ] },
  { q: "Seafood stance:", emoji: "🐟", img: U("photo-1467003909585-2f8a72700288"),
    options: [
      { t: "Love it all", tags: ["meat", "adventure"], adv: 2 },
      { t: "Fish only", tags: ["meat"] },
      { t: "Prawns are elite", tags: ["meat"] },
      { t: "Not my thing", tags: ["mild"] } ] },
  { q: "Sushi comfort level:", emoji: "🍣", img: U("photo-1579871494447-9811cf80d66c"),
    options: [
      { t: "Nigiri & sashimi — bring it", tags: ["adventure"], adv: 3 },
      { t: "Rolls only", tags: ["adventure"], adv: 1 },
      { t: "Cooked options only", tags: ["classic"], adv: 0 },
      { t: "Never tried — but curious", tags: ["adventure"], adv: 2 } ] },
  { q: "Fire round — where's your food cooked?", emoji: "🔥", img: U("photo-1599487488170-d11ec9c172f0"),
    options: [
      { t: "Tandoor — clay oven magic", tags: ["deccan", "meat"] },
      { t: "BBQ grill, smoky edges", tags: ["meat"] },
      { t: "Tawa-fried, crisp & quick", tags: ["street"] },
      { t: "Slow dum — patience wins", tags: ["deccan", "classic"] } ] },
  { q: "Fried chicken feelings:", emoji: "🍗", img: U("photo-1562967914-608f82629710"),
    options: [
      { t: "Crispy & spicy", tags: ["meat", "spice"], spice: 2 },
      { t: "Classic & juicy", tags: ["meat", "classic"] },
      { t: "Wings > everything", tags: ["meat"] },
      { t: "Meh, overrated", tags: ["mild"] } ] },
  { q: "Grill night — the steak question:", emoji: "🥩", img: U("photo-1600891964092-4316c288032e"),
    options: [
      { t: "Rare & simple", tags: ["meat", "adventure"], adv: 2 },
      { t: "Well-seasoned, desi style", tags: ["meat", "spice"], spice: 2 },
      { t: "Saucy & loaded", tags: ["meat"] },
      { t: "Skip the steak", tags: ["veg"] } ] },
  { q: "Breakfast of champions:", emoji: "🍳", img: U("photo-1525351484163-7529414344d8"),
    options: [
      { t: "Eggs, any style", tags: ["classic"] },
      { t: "Parathas with everything", tags: ["home"] },
      { t: "Pancakes & syrup", tags: ["sweet"], sweet: 2 },
      { t: "Poha / upma — light start", tags: ["healthy", "mild"] } ] },
  { q: "Bread basket loyalties:", emoji: "🫓", img: U("photo-1509440159596-0249088772ff"),
    options: [
      { t: "Butter naan", tags: ["classic"] },
      { t: "Rumali roti, soft as a handkerchief", tags: ["deccan"] },
      { t: "Laccha paratha, flaky layers", tags: ["home"] },
      { t: "Sourdough & fancy breads", tags: ["cafe", "adventure"], adv: 1 } ] },
  { q: "The curry base you trust most:", emoji: "🍛", img: U("photo-1585937421612-70a008356fbe"),
    options: [
      { t: "Tomato-onion masala", tags: ["classic"], spice: 2 },
      { t: "Coconut-rich & coastal", tags: ["adventure"], adv: 1 },
      { t: "Creamy & mild", tags: ["mild"], spice: 0 },
      { t: "Yogurt-based tang", tags: ["deccan"] } ] },
  { q: "Cheese — how deep are you in?", emoji: "🧀", img: U("photo-1486297678162-eb2a19b0a32d"),
    options: [
      { t: "Cheese pull on everything", tags: ["classic"] },
      { t: "A little goes a long way", tags: ["mild"] },
      { t: "Paneer counts, right?", tags: ["veg", "deccan"] },
      { t: "Not a cheese person", tags: ["healthy"] } ] },
  { q: "Salad — honest answer only:", emoji: "🥗", img: U("photo-1512621776951-a57141f2eefd"),
    options: [
      { t: "Love a big fresh bowl", tags: ["healthy", "veg"] },
      { t: "Only as a side", tags: ["classic"] },
      { t: "Only with a great dressing", tags: ["healthy"] },
      { t: "Salad is what my food eats", tags: ["meat", "adventure"], adv: 1 } ] },
  { q: "Your 'healthy era' order:", emoji: "🥙", img: U("photo-1540420773420-3366772f4999"),
    options: [
      { t: "Buddha bowl — grains & greens", tags: ["healthy", "veg"] },
      { t: "Smoothie bowl", tags: ["healthy", "sweet"], sweet: 1 },
      { t: "Grilled protein & greens", tags: ["healthy", "meat"] },
      { t: "Health can wait till Monday", tags: ["classic"] } ] },
  { q: "The drink that starts your day:", emoji: "🌅", img: U("photo-1509042239860-f550ce710b93"),
    options: [
      { t: "Filter coffee, strong", tags: ["coffee"] },
      { t: "Masala chai", tags: ["chai"] },
      { t: "Green tea, calm mode", tags: ["healthy"] },
      { t: "Fresh juice", tags: ["healthy", "sweet"], sweet: 1 } ] },
  { q: "Sweet tooth status check:", emoji: "🍰", img: U("photo-1578985545062-69928b1d9587"),
    options: [
      { t: "Dessert is a food group", tags: ["sweet"], sweet: 3 },
      { t: "One bite is enough", tags: ["mild"], sweet: 1 },
      { t: "Only Indian mithai", tags: ["sweet", "deccan"], sweet: 2 },
      { t: "Fruit for dessert, thanks", tags: ["healthy"], sweet: 0 } ] },
  { q: "Ice cream vs kulfi — settle it:", emoji: "🍨", img: U("photo-1563805042-7684c019e1cb"),
    options: [
      { t: "Kulfi — dense & desi", tags: ["sweet", "deccan"], sweet: 2 },
      { t: "Ice cream sundae, loaded", tags: ["sweet"], sweet: 3 },
      { t: "Gelato, fancy & smooth", tags: ["sweet", "cafe"], sweet: 2 },
      { t: "Soft serve, simple joy", tags: ["sweet", "classic"], sweet: 2 } ] },
  { q: "Chocolate loyalty:", emoji: "🍫", img: U("photo-1551024506-0bccd828d307"),
    options: [
      { t: "Dark & intense", tags: ["sweet", "adventure"], sweet: 2, adv: 1 },
      { t: "Milk & classic", tags: ["sweet", "classic"], sweet: 2 },
      { t: "White chocolate", tags: ["sweet"], sweet: 3 },
      { t: "Chocolate on everything, always", tags: ["sweet"], sweet: 3 } ] },
  { q: "Donut run — you reach for:", emoji: "🍩", img: U("photo-1551024601-bec78aea704b"),
    options: [
      { t: "Glazed classic", tags: ["sweet", "classic"], sweet: 2 },
      { t: "Chocolate frosted", tags: ["sweet"], sweet: 3 },
      { t: "Filled & loaded", tags: ["sweet", "adventure"], sweet: 3, adv: 1 },
      { t: "Team pastry instead", tags: ["cafe"], sweet: 1 } ] },
  { q: "The fruit finish:", emoji: "🥭", img: U("photo-1490474418585-ba9bad8fd0ea"),
    options: [
      { t: "Seasonal & fresh", tags: ["healthy"] },
      { t: "Fruit chaat with masala", tags: ["street"], spice: 1 },
      { t: "Mango above all fruits", tags: ["sweet", "deccan"], sweet: 2 },
      { t: "Skip the fruit", tags: ["classic"] } ] },
  { q: "Sandwich style:", emoji: "🥪", img: U("photo-1528735602780-2552fd46c7af"),
    options: [
      { t: "Grilled & cheesy", tags: ["classic"] },
      { t: "Bombay veg sandwich", tags: ["street", "veg"], spice: 2 },
      { t: "Club sandwich, triple decker", tags: ["cafe"] },
      { t: "Sub-style, fully loaded", tags: ["meat"] } ] },
  { q: "Wrap it up — your pick:", emoji: "🌯", img: U("photo-1566740933430-b5e70b06d2d5"),
    options: [
      { t: "Shawarma", tags: ["meat", "street"] },
      { t: "Kathi roll", tags: ["meat", "street"], spice: 2 },
      { t: "Burrito", tags: ["adventure"], adv: 1 },
      { t: "Frankie — Mumbai style", tags: ["street"], spice: 2 } ] },
  { q: "Eating out or ghar ka khana?", emoji: "🏠", img: U("photo-1414235077428-338989a2e8c0"),
    options: [
      { t: "Home food wins, always", tags: ["home"] },
      { t: "Restaurant explorer", tags: ["adventure"], adv: 2 },
      { t: "Dhaba loyalist", tags: ["street", "home"] },
      { t: "Street food supremacy", tags: ["street"], spice: 1 } ] },
  { q: "In the kitchen, you are:", emoji: "👨‍🍳", img: U("photo-1556910103-1c02745aae4d"),
    options: [
      { t: "The cook", tags: ["home", "adventure"], adv: 1 },
      { t: "The official taster", tags: ["home", "classic"] },
      { t: "The recipe follower", tags: ["home"] },
      { t: "Moral support & dish duty", tags: ["classic"] } ] },
  { q: "Pick your heat source:", emoji: "🔥", img: U("photo-1583119912267-cc97c911e416"),
    options: [
      { t: "Fresh green chillies", tags: ["spice"], spice: 3 },
      { t: "Dried red chillies", tags: ["spice"], spice: 3 },
      { t: "Black pepper warmth", tags: ["spice"], spice: 1 },
      { t: "Chilli oil on everything", tags: ["spice", "adventure"], spice: 2, adv: 1 } ] },
  { q: "Midnight Maggi — your style:", emoji: "🌜", img: U("photo-1557872943-16a5ac26437e"),
    options: [
      { t: "Classic masala", tags: ["noodle", "classic"], spice: 2 },
      { t: "Cheesy Maggi", tags: ["noodle"] },
      { t: "Loaded with veggies", tags: ["noodle", "veg"] },
      { t: "Soupy & slurpy", tags: ["noodle"] } ] },
  { q: "Festival food mood:", emoji: "🎉", img: U("photo-1555396273-367ea4eb4db5"),
    options: [
      { t: "Biryani feast with everyone", tags: ["biryani", "deccan"] },
      { t: "Sweets first, questions later", tags: ["sweet"], sweet: 3 },
      { t: "Snacks all day", tags: ["street"], spice: 1 },
      { t: "Whatever's cooking at home", tags: ["home"] } ] },
  { q: "Indo-Chinese supremacy — the winner is:", emoji: "🥡", img: U("photo-1565557623262-b51c2513a641"),
    options: [
      { t: "Gobi Manchuria", tags: ["veg", "street"], spice: 2 },
      { t: "Chicken 65 — a Hyderabadi legend", tags: ["meat", "deccan", "spice"], spice: 3 },
      { t: "Chilli chicken", tags: ["meat"], spice: 3 },
      { t: "Schezwan fried rice", tags: ["rice", "noodle"], spice: 2 } ] },
  { q: "Your gravy needs a partner:", emoji: "🫓", img: U("photo-1585937421612-70a008356fbe"),
    options: [
      { t: "Naan, for maximum scooping", tags: ["classic"] },
      { t: "Jeera rice", tags: ["rice"] },
      { t: "Rumali roti", tags: ["deccan"] },
      { t: "No partner — biryani IS the meal", tags: ["biryani"] } ] },
  { q: "How adventurous is your palate, really?", emoji: "🧭", img: U("photo-1490645935967-10de6ba17061"),
    options: [
      { t: "I'll try anything once", tags: ["adventure"], adv: 3 },
      { t: "New cuisines, familiar flavours", tags: ["adventure"], adv: 1 },
      { t: "I stick to my favourites", tags: ["classic"], adv: 0 },
      { t: "Only if my friends order it", tags: ["classic"], adv: 1 } ] },
  { q: "Weekend food ritual:", emoji: "📅", img: U("photo-1552566626-52f8b828add9"),
    options: [
      { t: "The big family lunch", tags: ["home"] },
      { t: "Trying a new place", tags: ["adventure", "cafe"], adv: 2 },
      { t: "Meal-prep & chill", tags: ["healthy", "home"] },
      { t: "Biryani, then a food-coma nap", tags: ["biryani", "deccan"] } ] },
  { q: "The drink that survives spicy food:", emoji: "🥛", img: U("photo-1505252585461-04db1eb84625"),
    options: [
      { t: "Sweet lassi", tags: ["sweet", "deccan"], sweet: 2 },
      { t: "Chaas / buttermilk", tags: ["home", "mild"] },
      { t: "Cola, ice cold", tags: ["classic"], sweet: 1 },
      { t: "Nimbu pani", tags: ["healthy"] } ] },
  { q: "Final verdict — your dream last meal:", emoji: "👑", img: U("photo-1563379091339-03b21ab4a4f8"),
    options: [
      { t: "A full Hyderabadi biryani feast", tags: ["biryani", "deccan"] },
      { t: "A giant desi thali", tags: ["classic", "home"] },
      { t: "Comfort food from home", tags: ["home", "mild"] },
      { t: "A tour of everything I love", tags: ["adventure"], adv: 3 } ] }
];
