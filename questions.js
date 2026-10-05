// Diving into Buds — question bank (v4). Assembled from decks/*.js — edit decks, not this file.

/* ——— deck: opener.js ——— */
// Diving into Buds — OPENER deck
// The first questions after a user picks their Diet + Roots fundamentals.
// Diet-specific openers (meats / proteins) come first, then shared attitude
// questions that shape the rest of the quiz. Option shape:
//   { t, tags[], diet, spice?, sweet?, adv? } — diet is ALWAYS set per option.

const DECK_OPENER = [

  { id:'op-meats', deck:'opener', multi:true,
    q:'First things first — which meats do you happily eat? Pick all that apply.',
    emoji:'🍗', img:'photo-1558030006-450675393462',
    diets:['everything'],
    options:[
      { t:'Chicken', tags:['meat'], diet:'meat:chicken' },
      { t:'Beef', tags:['meat'], diet:'meat:beef' },
      { t:'Lamb & goat', tags:['meat'], diet:'meat:lamb' },
      { t:'Pork', tags:['meat'], diet:'meat:pork' },
      { t:'Seafood — fish, prawns & more', tags:['meat'], diet:'meat:seafood' },
      { t:'Duck, rabbit & game', tags:['meat','adventure'], adv:2, diet:'meat:other' },
    ]},

  { id:'op-meats-halal', deck:'opener', multi:true,
    q:'You picked Everything Halal — which halal meats do you enjoy? Pick all that apply.',
    emoji:'🌙', img:'photo-1599487488170-d11ec9c172f0',
    diets:['halal'],
    options:[
      { t:'Chicken', tags:['meat'], diet:'meat:chicken' },
      { t:'Beef', tags:['meat'], diet:'meat:beef' },
      { t:'Lamb & goat', tags:['meat'], diet:'meat:lamb' },
      { t:'Seafood — fish, prawns & more', tags:['meat'], diet:'meat:seafood' },
      { t:'Duck & game', tags:['meat','adventure'], adv:2, diet:'meat:other' },
    ]},

  { id:'op-protein-veg', deck:'opener', multi:true,
    q:'Your protein crew — pick all you enjoy.',
    emoji:'🥗', img:'photo-1540420773420-3366772f4999',
    diets:['vegetarian'],
    options:[
      { t:'Paneer & dairy', tags:['veg','creamy'], diet:'veg' },
      { t:'Eggs', tags:['classic'], diet:'veg' },
      { t:'Lentils, dals & beans', tags:['veg','healthy'], diet:'vegan' },
      { t:'Tofu, soya & tempeh', tags:['veg','adventure'], adv:1, diet:'vegan' },
      { t:'Nuts & seeds', tags:['healthy'], diet:'vegan' },
    ]},

  { id:'op-protein-vegan', deck:'opener', multi:true,
    q:'Plant-powered proteins — pick all you enjoy.',
    emoji:'🌱', img:'photo-1540420773420-3366772f4999',
    diets:['vegan'],
    options:[
      { t:'Lentils & dals', tags:['veg','healthy'], diet:'vegan' },
      { t:'Tofu & tempeh', tags:['veg','adventure'], adv:1, diet:'vegan' },
      { t:'Chickpeas & beans', tags:['veg','healthy'], diet:'vegan' },
      { t:'Nuts & nut butters', tags:['healthy'], diet:'vegan' },
      { t:'Quinoa & whole grains', tags:['healthy','adventure'], adv:1, diet:'vegan' },
    ]},

  { id:'op-heat', deck:'opener', multi:false,
    q:'Your heat philosophy?',
    emoji:'🌶️', img:'photo-1596040033229-a9821ebd058d',
    diets:['everything','vegetarian','vegan','halal'],
    options:[
      { t:'Chilli is a food group', tags:['spice'], spice:3, diet:'vegan' },
      { t:'A good kick, not a fire alarm', tags:['spice'], spice:2, diet:'vegan' },
      { t:'Just a warm hum, thanks', tags:['mild'], spice:1, diet:'vegan' },
      { t:'Flavour over fire, always', tags:['mild'], spice:0, diet:'vegan' },
    ]},

  { id:'op-sweet', deck:'opener', multi:false,
    q:'Sweet tooth check — dessert is…',
    emoji:'🍰', img:'photo-1578985545062-69928b1d9587',
    diets:['everything','vegetarian','vegan','halal'],
    options:[
      { t:'The whole point of the meal', tags:['sweet'], sweet:3, diet:'veg' },
      { t:'A proper course, not an afterthought', tags:['sweet'], sweet:2, diet:'veg' },
      { t:'A small bite to finish', tags:['classic'], sweet:1, diet:'veg' },
      { t:'Optional — savoury wins', tags:['mild'], sweet:0, diet:'vegan' },
    ]},

  { id:'op-explore', deck:'opener', multi:false,
    q:'Why are you really here?',
    emoji:'🧭', img:'photo-1490645935967-10de6ba17061',
    diets:['everything','vegetarian','vegan','halal'],
    options:[
      { t:'Map my comfort zone', tags:['classic'], diet:'vegan' },
      { t:'Push my palate gently', tags:['adventure'], adv:1, diet:'vegan' },
      { t:"Take me places I've never tasted", tags:['adventure'], adv:3, diet:'vegan' },
      { t:"Surprise me — dealer's choice", tags:['adventure'], adv:2, diet:'vegan' },
    ]},

  { id:'op-cook', deck:'opener', multi:false,
    q:'In the kitchen, you are…',
    emoji:'🍳', img:'photo-1556910103-1c02745aae4d',
    diets:['everything','vegetarian','vegan','halal'],
    options:[
      { t:'The cook — apron on, playlist up', tags:['home'], diet:'vegan' },
      { t:'The taster — quality control, obviously', tags:['classic'], diet:'vegan' },
      { t:'The recipe follower — to the gram', tags:['home','classic'], diet:'vegan' },
      { t:'Moral support — I bring snacks and vibes', tags:['mild'], diet:'vegan' },
    ]},

  { id:'op-texture', deck:'opener', multi:false,
    q:'Texture you chase?',
    emoji:'✨', img:'photo-1518013431117-eb1465fa5752',
    diets:['everything','vegetarian','vegan','halal'],
    options:[
      { t:'Crispy & crunchy', tags:['street'], diet:'vegan' },
      { t:'Silky & saucy', tags:['creamy'], diet:'vegan' },
      { t:'Chewy & hearty', tags:['classic'], diet:'vegan' },
      { t:'Fresh & crisp', tags:['fresh','healthy'], diet:'vegan' },
    ]},

  { id:'op-tang', deck:'opener', multi:false,
    q:'Tang & sour — your stance?',
    emoji:'🍋', img:'photo-1490474418585-ba9bad8fd0ea',
    diets:['everything','vegetarian','vegan','halal'],
    options:[
      { t:'Lemon on everything', tags:['tangy'], diet:'vegan' },
      { t:'A little zing lifts a dish', tags:['tangy'], diet:'vegan' },
      { t:'Keep it mellow', tags:['mild'], diet:'vegan' },
      { t:'Fermented funk — bring it', tags:['tangy','adventure'], adv:2, diet:'vegan' },
    ]},

  { id:'op-breakfast', deck:'opener', multi:false,
    q:'Breakfast personality?',
    emoji:'🌅', img:'photo-1525351484163-7529414344d8',
    diets:['everything','vegetarian','vegan','halal'],
    options:[
      { t:'Big & hearty — eggs and the works', tags:['classic'], diet:'veg' },
      { t:'Light & fresh — fruit, yogurt, granola', tags:['fresh','healthy'], diet:'veg' },
      { t:'Sweet start — pancakes, honey, jam', tags:['sweet'], sweet:2, diet:'veg' },
      { t:"Breakfast is just an excuse for lunch food", tags:['adventure'], adv:1, diet:'vegan' },
    ]},

  { id:'op-drink', deck:'opener', multi:false,
    q:'Your daily ritual drink?',
    emoji:'☕', img:'photo-1509042239860-f550ce710b93',
    diets:['everything','vegetarian','vegan','halal'],
    options:[
      { t:'Coffee — non-negotiable', tags:['coffee'], diet:'vegan' },
      { t:'Tea, in its many forms', tags:['chai'], diet:'vegan' },
      { t:'Fresh juice & smoothies', tags:['healthy','fresh'], sweet:1, diet:'vegan' },
      { t:'Just water — food is the event', tags:['mild'], diet:'vegan' },
    ]},

  { id:'op-street', deck:'opener', multi:false,
    q:'Street food or fine dining?',
    emoji:'🍽️', img:'photo-1555396273-367ea4eb4db5',
    diets:['everything','vegetarian','vegan','halal'],
    options:[
      { t:'Street food — plastic stool, legendary taste', tags:['street'], diet:'vegan' },
      { t:'Fine dining — small plates, big drama', tags:['cafe','adventure'], adv:1, diet:'vegan' },
      { t:'Home-style diners — honest and generous', tags:['home'], diet:'vegan' },
      { t:'All three, weekly rotation', tags:['classic'], diet:'vegan' },
    ]},

  { id:'op-comfort', deck:'opener', multi:false,
    q:'Comfort food means…',
    emoji:'🫕', img:'photo-1547592180-85f173990554',
    diets:['everything','vegetarian','vegan','halal'],
    options:[
      { t:'What I grew up eating', tags:['home'], diet:'vegan' },
      { t:'Rich & indulgent', tags:['creamy'], diet:'veg' },
      { t:'Spicy & bold', tags:['spice'], spice:2, diet:'vegan' },
      { t:'Fresh & light', tags:['fresh','healthy'], diet:'vegan' },
    ]},

  { id:'op-snack', deck:'opener', multi:false,
    q:'Snack attack style?',
    emoji:'🍩', img:'photo-1551024601-bec78aea704b',
    diets:['everything','vegetarian','vegan','halal'],
    options:[
      { t:'Fried & crispy', tags:['street'], diet:'vegan' },
      { t:'Sweet & baked', tags:['sweet'], sweet:2, diet:'veg' },
      { t:'Fresh fruit & nuts', tags:['healthy','fresh'], diet:'vegan' },
      { t:"Whatever's at the corner shop", tags:['street','classic'], diet:'vegan' },
    ]},

  { id:'op-dream', deck:'opener', multi:false,
    q:'Dream food trip — first stop?',
    emoji:'✈️', img:'photo-1552566626-52f8b828add9',
    diets:['everything','vegetarian','vegan','halal'],
    options:[
      { t:'Hyderabad & the Deccan', tags:['deccan'], diet:'vegan' },
      { t:'East & Southeast Asia', tags:['asia'], diet:'vegan' },
      { t:'The Americas', tags:['americas'], diet:'vegan' },
      { t:'Europe', tags:['europe'], diet:'vegan' },
    ]},

  { id:'op-format', deck:'opener', multi:false,
    q:'Your ideal plate format?',
    emoji:'🍽️', img:'photo-1555396273-367ea4eb4db5',
    diets:['everything','vegetarian','vegan','halal'],
    options:[
      { t:'A big bowl, all mixed in', tags:['rice','home'], diet:'vegan' },
      { t:'Handheld & street-style', tags:['street'], diet:'vegan' },
      { t:'Sharing platters, family style', tags:['classic','home'], diet:'vegan' },
      { t:'Plated & fancy', tags:['cafe'], adv:1, diet:'vegan' },
    ]},

  { id:'op-nogo', deck:'opener', multi:true,
    q:"Any hard no's? Pick all that apply — we'll never suggest these.",
    emoji:'🚫', img:'photo-1596040033229-a9821ebd058d',
    diets:['everything','vegetarian','vegan','halal'],
    options:[
      { t:'Coriander (the soap gene is real)', tags:[], diet:'vegan' },
      { t:'Mushrooms', tags:[], diet:'vegan' },
      { t:'Olives', tags:[], diet:'vegan' },
      { t:'Raw onion', tags:[], diet:'vegan' },
      { t:'Bitter flavours', tags:[], diet:'vegan' },
      { t:"Nothing — I'll try anything once", tags:['adventure'], adv:2, diet:'vegan' },
    ]},

];

/* ——— deck: hyderabad.js ——— */
const DECK_HYDERABAD = [
{ id:'hyd-01', deck:'hyderabad', q:'Biryani time, miya! Which plate is calling your name?', emoji:'🍛', img:'photo-1631515243349-e0cb75fb8d3a', multi:false,
  diets:['everything','vegetarian','vegan','halal'],
  options:[
    {t:'Hyderabadi Chicken Dum Biryani', tags:['biryani','deccan','rice','meat'], diet:'meat:chicken', spice:3},
    {t:'Mutton Dum Biryani', tags:['biryani','deccan','rice','meat'], diet:'meat:lamb', spice:3},
    {t:'Veg Dum Biryani', tags:['biryani','deccan','rice','veg'], diet:'vegan', spice:2},
    {t:'Bagara Khana with Dalcha (tempered rice with lentil & gourd stew)', tags:['rice','deccan','home','veg'], diet:'vegan', spice:1}
  ] },
{ id:'hyd-02', deck:'hyderabad', q:'Haleem season is on! Your bowl of choice?', emoji:'🍲', img:'photo-1547592180-85f173990554', multi:false,
  diets:['everything','vegetarian','vegan','halal'],
  options:[
    {t:'Mutton Haleem (slow-pounded wheat, lentils & meat)', tags:['deccan','meat','classic'], diet:'meat:lamb', spice:2},
    {t:'Chicken Haleem', tags:['deccan','meat'], diet:'meat:chicken', spice:2},
    {t:'Veg Haleem (lentils, veggies & soya, same masala soul)', tags:['deccan','veg','adventure'], diet:'vegan', spice:2},
    {t:'Jackfruit Haleem (kathal cooked haleem-style)', tags:['deccan','veg','adventure'], diet:'vegan', spice:2}
  ] },
{ id:'hyd-03', deck:'hyderabad', q:'Classic Deccani breakfast — khichdi, khatta, and what else?', emoji:'🌅', img:'photo-1589302168068-964664d93dc0', multi:false,
  diets:['everything','vegetarian','vegan','halal'],
  options:[
    {t:'Khichdi-Khatta-Kheema (rice-lentil porridge, tangy soup & minced meat)', tags:['home','rice','meat','deccan'], diet:'meat:lamb', spice:2},
    {t:'Khichdi-Khatta with crispy aloo fry', tags:['home','rice','veg','tangy'], diet:'vegan', spice:2},
    {t:'Pesarattu (crispy moong dal crepe) with ginger chutney', tags:['home','veg','healthy'], diet:'vegan', spice:1},
    {t:'Idli-Sambar, full ghar style', tags:['home','veg','mild'], diet:'vegan', spice:1}
  ] },
{ id:'hyd-04', deck:'hyderabad', q:'Salan showdown! Which curry steals the biryani spotlight?', emoji:'🌶️', img:'photo-1585937421612-70a008356fbe', multi:false,
  diets:['everything','vegetarian','vegan','halal'],
  options:[
    {t:'Mirchi ka Salan (chillies in peanut-sesame curry)', tags:['deccan','spice','creamy'], diet:'vegan', spice:3},
    {t:'Baghare Baingan (baby eggplants in tangy masala gravy)', tags:['deccan','veg','tangy'], diet:'vegan', spice:2},
    {t:'Dahi ki Chutney (cool yogurt raita)', tags:['creamy','mild','fresh'], diet:'veg', spice:1},
    {t:'Tamate ka Kut (Hyderabadi tomato curry with egg)', tags:['deccan','tangy','home'], diet:'veg', spice:2}
  ] },
{ id:'hyd-05', deck:'hyderabad', q:'Chai adda break! What is on your saucer?', emoji:'🫖', img:'photo-1544787219-7f47ccb76574', multi:false,
  diets:['everything','vegetarian','vegan','halal'],
  options:[
    {t:'Irani Chai with Osmania Biscuits', tags:['chai','cafe','classic'], diet:'veg', sweet:1},
    {t:'Sulemani Chai (spiced black tea, no milk)', tags:['chai','cafe','fresh'], diet:'vegan', sweet:1},
    {t:'Onion Samosa, garam garam', tags:['street','spice'], diet:'vegan', spice:1},
    {t:'Cut Mirchi Bajji (chilli fritters)', tags:['street','spice'], diet:'vegan', spice:3}
  ] },
{ id:'hyd-06', deck:'hyderabad', q:'Ramzan evening, iftar dastarkhwan (spread) is laid out. First pick?', emoji:'🌙', img:'photo-1490645935967-10de6ba17061', multi:false,
  diets:['everything','vegetarian','vegan','halal'],
  options:[
    {t:'Dahi Bade (lentil dumplings soaked in yogurt)', tags:['deccan','creamy','tangy'], diet:'veg', spice:1},
    {t:'Chicken Samosa', tags:['street','meat','spice'], diet:'meat:chicken', spice:2},
    {t:'Khajur and Fruit Chaat (dates & spiced fruit)', tags:['fresh','sweet'], diet:'vegan', sweet:2},
    {t:'Mixed Veg Pakode (crisp veg fritters)', tags:['street','veg','spice'], diet:'vegan', spice:2}
  ] },
{ id:'hyd-07', deck:'hyderabad', q:'Kebab night near Charminar — which skewer wins, miya?', emoji:'🍢', img:'photo-1599487488170-d11ec9c172f0', multi:false,
  diets:['everything','vegetarian','vegan','halal'],
  options:[
    {t:'Pathar ka Gosht (meat grilled on a hot stone slab)', tags:['deccan','meat','smoky'], diet:'meat:lamb', spice:3, adv:2},
    {t:'Chicken Malai Kebab (creamy, melt-in-mouth)', tags:['meat','creamy','mild'], diet:'meat:chicken', spice:1},
    {t:'Hara Bhara Kebab (spinach & veg patty)', tags:['veg','healthy'], diet:'vegan', spice:1},
    {t:'Mushroom Tikka, charred edges and all', tags:['veg','smoky','spice'], diet:'vegan', spice:2}
  ] },
{ id:'hyd-08', deck:'hyderabad', q:'Winter night, soup mood. Which Deccani bowl warms you up?', emoji:'🥣', img:'photo-1547592166-23ac45744acd', multi:false,
  diets:['everything','vegetarian','vegan','halal'],
  options:[
    {t:'Paya (slow-cooked trotters soup)', tags:['deccan','meat','classic'], diet:'meat:lamb', spice:2, adv:2},
    {t:'Marag (spicy mutton soup)', tags:['deccan','meat','spice'], diet:'meat:lamb', spice:3},
    {t:'Tomato Shorba (spiced tomato soup)', tags:['tangy','fresh','veg'], diet:'vegan', spice:1},
    {t:'Dal Shorba (gentle lentil soup)', tags:['mild','healthy','veg'], diet:'vegan', spice:1}
  ] },
{ id:'hyd-09', deck:'hyderabad', q:'Dosa run to Ram ki Bandi at midnight — your order?', emoji:'🌃', img:'photo-1630383249896-424e482df921', multi:false,
  diets:['everything','vegetarian','vegan','halal'],
  options:[
    {t:'Butter Masala Dosa, extra crisp', tags:['street','classic'], diet:'veg', spice:1},
    {t:'Pesarattu (moong dal crepe) with onion & green chilli', tags:['street','veg','healthy'], diet:'vegan', spice:1},
    {t:'Masala Dosa, no butter, full chutney-sambar', tags:['street','veg','classic'], diet:'vegan', spice:2},
    {t:'Set Dosa with Veg Sagoo (soft dosas with mixed veg curry)', tags:['street','veg','home'], diet:'vegan', spice:1}
  ] },
{ id:'hyd-10', deck:'hyderabad', q:'Meetha wars! Which Hyderabadi dessert takes the crown?', emoji:'🍮', img:'photo-1488477181946-6428a0291777', multi:false,
  diets:['everything','vegetarian','vegan','halal'],
  options:[
    {t:'Double ka Meetha (fried bread pudding with rabri)', tags:['sweet','creamy','classic','deccan'], diet:'veg', sweet:3},
    {t:'Khubani ka Meetha (stewed apricot dessert, no cream)', tags:['sweet','deccan','classic'], diet:'vegan', sweet:2},
    {t:'Faluda (rose milk, vermicelli & basil seeds)', tags:['sweet','creamy','cafe'], diet:'veg', sweet:3},
    {t:'Coconut-Jaggery Ladoo (no milk, full nostalgia)', tags:['sweet','home'], diet:'vegan', sweet:2}
  ] },
{ id:'hyd-11', deck:'hyderabad', q:'Dum debate: how should the biryani be layered?', emoji:'🔥', img:'photo-1563379091339-03b21ab4a4f8', multi:false,
  diets:['everything','vegetarian','vegan','halal'],
  options:[
    {t:'Kacchi style — raw marinated chicken layered with rice, sealed & slow-cooked', tags:['biryani','deccan','meat','adventure'], diet:'meat:chicken', spice:3},
    {t:'Pakki style — mutton cooked first, then layered & dum', tags:['biryani','deccan','meat','classic'], diet:'meat:lamb', spice:3},
    {t:'Veg dum — veggies & masala layered just as seriously', tags:['biryani','deccan','veg'], diet:'vegan', spice:2},
    {t:'Skip biryani — Bagara Khana with Khatti Dal (tangy lentils) wins', tags:['rice','home','veg','tangy'], diet:'vegan', spice:1}
  ] },
{ id:'hyd-12', deck:'hyderabad', q:'Fry-day at a Deccani hotel — pick your plate!', emoji:'🍗', img:'photo-1558030006-450675393462', multi:false,
  diets:['everything','vegetarian','vegan','halal'],
  options:[
    {t:'Talawa Gosht (crisp fried mutton pieces)', tags:['deccan','meat','spice','smoky'], diet:'meat:lamb', spice:3},
    {t:'Chicken 65, curry leaves & red chillies', tags:['meat','spice','street'], diet:'meat:chicken', spice:3},
    {t:'Crispy Corn Salt & Pepper', tags:['street','spice','veg'], diet:'vegan', spice:2},
    {t:'Aloo Lukmi (flaky potato-filled pastry)', tags:['street','veg','classic'], diet:'vegan', spice:1}
  ] },
{ id:'hyd-13', deck:'hyderabad', q:'Irani cafe vibes at Nimrah — what lands on your marble table?', emoji:'☕', img:'photo-1552566626-52f8b828add9', multi:false,
  diets:['everything','vegetarian','vegan','halal'],
  options:[
    {t:'Bun Maska with Irani Chai (buttered bun & milky tea)', tags:['cafe','chai','classic'], diet:'veg', sweet:1},
    {t:'Osmania Biscuits dunked in chai', tags:['cafe','chai','sweet'], diet:'veg', sweet:2},
    {t:'Onion Samosa, two pieces, no sharing', tags:['cafe','street','veg'], diet:'vegan', spice:1},
    {t:'Mirchi Bajji plate with mint chutney', tags:['cafe','street','spice'], diet:'vegan', spice:2}
  ] },
{ id:'hyd-14', deck:'hyderabad', q:'Late-night hunger, Hyderabad style. What saves the night?', emoji:'🌜', img:'photo-1555396273-367ea4eb4db5', multi:false,
  diets:['everything','vegetarian','vegan','halal'],
  options:[
    {t:'Chicken Shawarma from the corner stall', tags:['street','meat','spice'], diet:'meat:chicken', spice:2},
    {t:'Masala Dosa from a bandi (street cart)', tags:['street','veg'], diet:'vegan', spice:1},
    {t:'Masala Maggi, hostel-style noodles', tags:['noodle','street','spice'], diet:'vegan', spice:2},
    {t:'Anda Bhurji Pav (spiced scrambled eggs with bread)', tags:['street','spice'], diet:'veg', spice:2}
  ] },
{ id:'hyd-15', deck:'hyderabad', q:'Old City walk near Charminar — what fuels the stroll?', emoji:'🕌', img:'photo-1572445271230-a78b5944a659', multi:false,
  diets:['everything','vegetarian','vegan','halal'],
  options:[
    {t:'Nimrah ki Chai (milky Irani tea)', tags:['chai','cafe','classic'], diet:'veg', sweet:1},
    {t:'Karachi Bakery Fruit Biscuits', tags:['cafe','sweet','classic'], diet:'veg', sweet:2},
    {t:'Roasted Masala Chana (spiced chickpeas)', tags:['street','veg','healthy'], diet:'vegan', spice:1},
    {t:'Fresh Sugarcane Juice with ginger & lemon', tags:['street','fresh','sweet'], diet:'vegan', sweet:2}
  ] },
{ id:'hyd-16', deck:'hyderabad', q:'Ghar ka khana (home food) day — which dal-curry combo feels like home?', emoji:'🏠', img:'photo-1505253758473-96b7015fcd40', multi:false,
  diets:['everything','vegetarian','vegan','halal'],
  options:[
    {t:'Khatti Dal (tangy lentils) with steamed rice', tags:['home','tangy','veg','rice'], diet:'vegan', spice:1},
    {t:'Tomato Pappu (tomato-lentil dal) with rice', tags:['home','veg','rice','mild'], diet:'vegan', spice:1},
    {t:'Chicken Curry with rice, ammi-style', tags:['home','meat','rice'], diet:'meat:chicken', spice:2},
    {t:'Anda Masala (egg curry) with rice', tags:['home','spice'], diet:'veg', spice:2}
  ] },
{ id:'hyd-17', deck:'hyderabad', q:'Tandoor is roaring! What comes off the skewers for you?', emoji:'♨️', img:'photo-1555939594-58d7cb561ad1', multi:false,
  diets:['everything','vegetarian','vegan','halal'],
  options:[
    {t:'Tandoori Chicken, smoky & charred', tags:['meat','smoky','spice'], diet:'meat:chicken', spice:2},
    {t:'Mutton Seekh Kebab', tags:['meat','smoky','deccan'], diet:'meat:lamb', spice:2},
    {t:'Tandoori Mushroom with ajwain masala', tags:['veg','smoky','spice'], diet:'vegan', spice:2},
    {t:'Grilled Corn Chaat with lime & chaat masala', tags:['street','fresh','veg'], diet:'vegan', spice:1}
  ] },
{ id:'hyd-18', deck:'hyderabad', q:'Your biryani needs one fiery sidekick. Choose!', emoji:'🧅', img:'photo-1596040033229-a9821ebd058d', multi:false,
  diets:['everything','vegetarian','vegan','halal'],
  options:[
    {t:'Extra Mirchi ka Salan, bring the heat', tags:['spice','deccan'], diet:'vegan', spice:3},
    {t:'Raw onion, lemon wedge & green chilli', tags:['fresh','spice'], diet:'vegan', spice:2},
    {t:'Dahi Raita to cool things down', tags:['creamy','mild'], diet:'veg', spice:0},
    {t:'Mint Chutney, sharp & herby', tags:['fresh','tangy'], diet:'vegan', spice:1}
  ] },
{ id:'hyd-19', deck:'hyderabad', q:'Seafood craving in the Deccan — arre, it happens! Your pick?', emoji:'🐟', img:'photo-1467003909585-2f8a72700288', multi:false,
  diets:['everything','vegetarian','vegan','halal'],
  options:[
    {t:'Apollo Fish (fiery, curry-leaf fish fry)', tags:['meat','spice','adventure'], diet:'meat:seafood', spice:3},
    {t:'Prawn Fry, masala-coated', tags:['meat','spice'], diet:'meat:seafood', spice:2},
    {t:'Bagara Khana with Dahi ki Chutney (tempered rice & yogurt raita)', tags:['rice','creamy','mild'], diet:'veg', spice:1},
    {t:'Nakko seafood — Bagara Khana with Mirchi ka Salan for me', tags:['rice','deccan','veg'], diet:'vegan', spice:2}
  ] },
{ id:'hyd-20', deck:'hyderabad', q:'Tiffin time! Which breakfast plate starts your day right?', emoji:'🍳', img:'photo-1525351484163-7529414344d8', multi:false,
  diets:['everything','vegetarian','vegan','halal'],
  options:[
    {t:'Anda Paratha (egg-stuffed flatbread)', tags:['home','classic'], diet:'veg', spice:1},
    {t:'Poha (spiced flattened rice with peanuts)', tags:['mild','fresh','veg'], diet:'vegan', spice:1},
    {t:'Upma (semolina porridge with curry leaves)', tags:['healthy','home','veg'], diet:'vegan', spice:1},
    {t:'Keema Pav (spiced minced meat with bread)', tags:['meat','deccan','spice'], diet:'meat:lamb', spice:2}
  ] },
{ id:'hyd-21', deck:'hyderabad', q:'Chaat attack! Which tangy bomb goes first?', emoji:'😋', img:'photo-1626132647523-66f5bf380027', multi:false,
  diets:['everything','vegetarian','vegan','halal'],
  options:[
    {t:'Pani Puri, extra teekha paani (spicy water)', tags:['street','tangy','spice'], diet:'vegan', spice:2},
    {t:'Dahi Puri (yogurt-filled puris)', tags:['street','creamy','tangy'], diet:'veg', spice:1},
    {t:'Samosa Chaat, no dahi, double chutney', tags:['street','tangy','spice'], diet:'vegan', spice:2},
    {t:'Bhel Puri, crunchy & khatta-meetha (sweet-sour)', tags:['street','fresh','tangy'], diet:'vegan', spice:1}
  ] },
{ id:'hyd-22', deck:'hyderabad', q:'Shaadi ki dawat (wedding feast)! Your plate, your rules.', emoji:'💍', img:'photo-1555244162-803834f70033', multi:false,
  diets:['everything','vegetarian','vegan','halal'],
  options:[
    {t:'Mutton Dum Biryani, centre of the plate', tags:['biryani','deccan','meat','classic'], diet:'meat:lamb', spice:3},
    {t:'Marag first, biryani after — full dawat order', tags:['deccan','meat','spice'], diet:'meat:lamb', spice:3},
    {t:'Bagara Khana with Dalcha, the quiet classic', tags:['rice','deccan','veg'], diet:'vegan', spice:1},
    {t:'Mirchi ka Salan with Baghare Baingan', tags:['deccan','veg','tangy'], diet:'vegan', spice:2}
  ] },
{ id:'hyd-23', deck:'hyderabad', q:'Dessert round two — kulfi, halwa, or something fruity?', emoji:'🍨', img:'photo-1563805042-7684c019e1cb', multi:false,
  diets:['everything','vegetarian','vegan','halal'],
  options:[
    {t:'Kulfi Falooda (dense ice cream with rose noodles)', tags:['sweet','creamy','cafe'], diet:'veg', sweet:3},
    {t:'Gaajar ka Halwa (carrot halwa, oil & jaggery version)', tags:['sweet','home'], diet:'vegan', sweet:2},
    {t:'Khubani ka Meetha with custard on top', tags:['sweet','deccan','creamy'], diet:'veg', sweet:2},
    {t:'Fruit Falooda, coconut-milk style', tags:['sweet','fresh','adventure'], diet:'vegan', sweet:2}
  ] },
{ id:'hyd-24', deck:'hyderabad', q:'Thirst check! What is in your glass?', emoji:'🥤', img:'photo-1505252585461-04db1eb84625', multi:false,
  diets:['everything','vegetarian','vegan','halal'],
  options:[
    {t:'Irani Chai, always', tags:['chai','cafe','classic'], diet:'veg', sweet:1},
    {t:'Filter Coffee, strong & frothy', tags:['coffee','cafe'], diet:'veg', sweet:1},
    {t:'Masala Shikanji (spiced lemonade)', tags:['fresh','tangy','sweet'], diet:'vegan', sweet:1},
    {t:'Watermelon Juice, ice-cold', tags:['fresh','healthy','sweet'], diet:'vegan', sweet:2}
  ] },
{ id:'hyd-25', deck:'hyderabad', q:'Light & fresh day — which plate keeps it wholesome?', emoji:'🥗', img:'photo-1512621776951-a57141f2eefd', multi:false,
  diets:['everything','vegetarian','vegan','halal'],
  options:[
    {t:'Sprouts Chaat with onion, tomato & lime', tags:['healthy','fresh','veg'], diet:'vegan', spice:1},
    {t:'Grilled Chicken Salad, desi masala twist', tags:['healthy','fresh','meat'], diet:'meat:chicken', spice:1},
    {t:'Jowar Roti (sorghum flatbread) with Veg Kurma (coconut veg curry)', tags:['healthy','home','veg'], diet:'vegan', spice:1},
    {t:'Paneer Tikka, straight off the tandoor', tags:['veg','spice','smoky'], diet:'veg', spice:2}
  ] },
{ id:'hyd-26', deck:'hyderabad', q:'Biryani add-on time — what extra lands on your plate?', emoji:'✨', img:'photo-1563379091339-03b21ab4a4f8', multi:false,
  diets:['everything','vegetarian','vegan','halal'],
  options:[
    {t:'Birista (crispy fried onions), a full handful', tags:['biryani','classic','veg'], diet:'vegan', spice:0},
    {t:'Boiled Anda (egg), biryani-style', tags:['biryani','classic'], diet:'veg', spice:0},
    {t:'Chicken Fry Piece on the side', tags:['biryani','meat','spice'], diet:'meat:chicken', spice:2},
    {t:'Extra Mirchi ka Salan, no questions asked', tags:['biryani','spice','deccan'], diet:'vegan', spice:3}
  ] },
{ id:'hyd-27', deck:'hyderabad', q:'Pickle & podi power! Which jar rules your shelf?', emoji:'🫙', img:'photo-1565557623262-b51c2513a641', multi:false,
  diets:['everything','vegetarian','vegan','halal'],
  options:[
    {t:'Gongura Pickle (sorrel leaf pickle, tangy & fiery)', tags:['tangy','spice','adventure','deccan'], diet:'vegan', spice:3},
    {t:'Avakaya (raw mango pickle, the Andhra-Deccan legend)', tags:['tangy','spice','classic'], diet:'vegan', spice:3},
    {t:'Ghee Podi (spiced lentil powder with ghee)', tags:['spice','home'], diet:'veg', spice:2},
    {t:'Curry Leaf Podi with oil, on hot rice', tags:['spice','home','rice'], diet:'vegan', spice:2}
  ] },
{ id:'hyd-28', deck:'hyderabad', q:'Bakery run to Karachi Bakery — what fills the box?', emoji:'🍪', img:'photo-1555507036-94f33f82cd6e', multi:false,
  diets:['everything','vegetarian','vegan','halal'],
  options:[
    {t:'Cashew Biscuits, buttery & crumbly', tags:['cafe','sweet','classic'], diet:'veg', sweet:2},
    {t:'Plum Cake, one thick slice', tags:['cafe','sweet'], diet:'veg', sweet:2},
    {t:'Eggless Banana Bread, oil-based & soft', tags:['cafe','sweet','veg'], diet:'vegan', sweet:1},
    {t:'Date & Walnut Slice, eggless', tags:['cafe','sweet','veg'], diet:'vegan', sweet:2}
  ] },
{ id:'hyd-29', deck:'hyderabad', q:'Bandi (cart) specials near the college gate — grab one!', emoji:'🛒', img:'photo-1518013431117-eb1465fa5752', multi:false,
  diets:['everything','vegetarian','vegan','halal'],
  options:[
    {t:'Masala Fries with chaat dust', tags:['street','spice','veg'], diet:'vegan', spice:1},
    {t:'Peanut Masala (spiced peanuts with onion & lime)', tags:['street','spice','veg'], diet:'vegan', spice:2},
    {t:'Egg Bajji (egg fritters)', tags:['street','spice'], diet:'veg', spice:2},
    {t:'Chicken Pakoda (chicken fritters)', tags:['street','meat','spice'], diet:'meat:chicken', spice:2}
  ] },
{ id:'hyd-30', deck:'hyderabad', q:'Grand finale, miya! Pick the centrepiece of your dream Hyderabadi dawat.', emoji:'👑', img:'photo-1414235077428-338989a2e8c0', multi:false,
  diets:['everything','vegetarian','vegan','halal'],
  options:[
    {t:'Chicken Dum Biryani, the undisputed king', tags:['biryani','deccan','meat','classic'], diet:'meat:chicken', spice:3},
    {t:'Mutton Haleem, rich & slow-cooked', tags:['deccan','meat','classic'], diet:'meat:lamb', spice:2},
    {t:'Bagara Khana, Dalcha & Salan — the full veg spread', tags:['rice','deccan','veg','home'], diet:'vegan', spice:2},
    {t:'Veg Dum Biryani with Mirchi ka Salan', tags:['biryani','deccan','veg'], diet:'vegan', spice:2}
  ] }
];

/* ——— deck: asia.js ——— */
const DECK_ASIA = [
  { id:'asi-01', deck:'asia', q:'Ramen night in Tokyo — which bowl are you slurping first?', emoji:'🍜', img:'photo-1557872943-16a5ac26437e', multi:false,
    diets:['everything','vegetarian','vegan','halal'],
    options:[
      {t:'Tonkotsu ramen — rich, milky pork broth with melt-in-the-mouth chashu', tags:['noodle','meat','creamy','asia'], diet:'meat:pork', spice:0},
      {t:'Spicy miso ramen with sweetcorn and a jammy egg', tags:['noodle','spice','asia'], diet:'veg', spice:2},
      {t:'Shoyu ramen with tofu, mushrooms and spring onion', tags:['noodle','veg','healthy','asia'], diet:'vegan', spice:0},
      {t:'Tan-tan ramen — sesame and chilli heat with plant-based mince', tags:['noodle','veg','spice','asia'], diet:'vegan', spice:3}
    ] },
  { id:'asi-02', deck:'asia', q:'At a Tokyo sushi counter, what is your first order?', emoji:'🍣', img:'photo-1579871494447-9811cf80d66c', multi:false,
    diets:['everything','vegetarian','vegan','halal'],
    options:[
      {t:'Fatty salmon nigiri, brushed with soy', tags:['rice','meat','fresh','asia'], diet:'meat:seafood'},
      {t:'Avocado maki rolls with pickled radish', tags:['rice','veg','fresh','asia'], diet:'vegan'},
      {t:'Cucumber kappa maki — crisp, clean, classic', tags:['rice','veg','classic','asia'], diet:'vegan'},
      {t:'Tamago nigiri — sweet, fluffy egg omelette', tags:['rice','sweet','asia'], diet:'veg', sweet:1}
    ] },
  { id:'asi-03', deck:'asia', q:'Izakaya night — small plates and sips, Japanese pub style. What lands on your table first?', emoji:'🥟', img:'photo-1547592180-85f173990554', multi:false,
    diets:['everything','vegetarian','vegan','halal'],
    options:[
      {t:'Veggie gyoza — pan-fried dumplings with cabbage and chive', tags:['veg','street','asia'], diet:'vegan'},
      {t:'Pork gyoza with chilli oil and black vinegar', tags:['meat','street','asia'], diet:'meat:pork', spice:1},
      {t:'Miso soup with silken tofu and wakame seaweed', tags:['veg','healthy','home','asia'], diet:'vegan', spice:0},
      {t:'A small chilled glass of sake', tags:['asia','adventure'], diet:'alcohol', adv:1}
    ] },
  { id:'asi-04', deck:'asia', q:'Bibimbap time — a sizzling Korean rice bowl you mix at the table. Yours is topped with…', emoji:'🍚', img:'photo-1553163147-622ab57be1c7', multi:false,
    diets:['everything','vegetarian','vegan','halal'],
    options:[
      {t:'Bulgogi beef — sweet soy-marinated and charred', tags:['rice','meat','sweet','asia'], diet:'meat:beef', sweet:1},
      {t:'Spicy gochujang pork with sesame', tags:['rice','meat','spice','asia'], diet:'meat:pork', spice:2},
      {t:'Tofu and shiitake mushrooms, no egg', tags:['rice','veg','asia'], diet:'vegan', spice:1},
      {t:'Garden vegetables with vegan kimchi, no egg', tags:['rice','veg','tangy','asia'], diet:'vegan', spice:2}
    ] },
  { id:'asi-05', deck:'asia', q:'Seoul street-food crawl — what are you grabbing first?', emoji:'🌶️', img:'photo-1518013431117-eb1465fa5752', multi:false,
    diets:['everything','vegetarian','vegan','halal'],
    options:[
      {t:'Tteokbokki — chewy rice cakes in fiery red sauce', tags:['spice','street','asia'], diet:'veg', spice:3},
      {t:'Kimchi fried rice, no egg, extra sesame oil', tags:['rice','spice','tangy','asia'], diet:'vegan', spice:2},
      {t:'Vegetable kimbap — seaweed rice rolls, picnic style', tags:['rice','veg','street','asia'], diet:'vegan'},
      {t:'Hotteok — warm pancakes with cinnamon, sugar and nuts', tags:['sweet','street','asia'], diet:'vegan', sweet:2}
    ] },
  { id:'asi-06', deck:'asia', q:'Korean BBQ night — the grill is hot. What is sizzling first?', emoji:'🔥', img:'photo-1558030006-450675393462', multi:false,
    diets:['everything','vegetarian','vegan','halal'],
    options:[
      {t:'Samgyeopsal — thick pork belly with ssamjang dip', tags:['meat','smoky','asia'], diet:'meat:pork'},
      {t:'Beef bulgogi with a pear-soy marinade', tags:['meat','sweet','smoky','asia'], diet:'meat:beef', sweet:1},
      {t:'King oyster mushrooms and tofu steaks', tags:['veg','smoky','asia'], diet:'vegan'},
      {t:'Grilled sweetcorn, peppers and veggie skewers', tags:['veg','street','asia'], diet:'vegan'}
    ] },
  { id:'asi-07', deck:'asia', q:'Bangkok noodle run — which plate lands in front of you?', emoji:'🥘', img:'photo-1585032226651-759b368d7246', multi:false,
    diets:['everything','vegetarian','vegan','halal'],
    options:[
      {t:'Classic chicken pad thai with crushed peanuts', tags:['noodle','meat','tangy','asia'], diet:'meat:chicken', sweet:1},
      {t:'Prawn pad thai with tamarind tang', tags:['noodle','meat','tangy','asia'], diet:'meat:seafood', sweet:1},
      {t:'Tofu pad thai, no egg, extra lime and chilli', tags:['noodle','veg','tangy','asia'], diet:'vegan', spice:2},
      {t:'Drunken noodles with tofu, holy basil and serious heat', tags:['noodle','veg','spice','asia'], diet:'vegan', spice:3}
    ] },
  { id:'asi-08', deck:'asia', q:'Pick a Thai broth to warm your soul.', emoji:'🍲', img:'photo-1547592166-23ac45744acd', multi:false,
    diets:['everything','vegetarian','vegan','halal'],
    options:[
      {t:'Tom yum goong — hot and sour prawn soup', tags:['spice','tangy','asia'], diet:'meat:seafood', spice:3},
      {t:'Tom kha gai — silky coconut chicken soup', tags:['meat','creamy','asia'], diet:'meat:chicken', spice:1},
      {t:'Clear tom yum with mushrooms, tofu and lemongrass', tags:['veg','spice','tangy','asia'], diet:'vegan', spice:3},
      {t:'Veggie coconut soup with galangal and lime leaf', tags:['veg','creamy','asia'], diet:'vegan', spice:1}
    ] },
  { id:'asi-09', deck:'asia', q:'Thai curry night — which colour is calling you?', emoji:'🍛', img:'photo-1505253758473-96b7015fcd40', multi:false,
    diets:['everything','vegetarian','vegan','halal'],
    options:[
      {t:'Green curry with chicken and Thai aubergines', tags:['spice','meat','creamy','asia'], diet:'meat:chicken', spice:3},
      {t:'Massaman beef curry — gentle, nutty, cinnamon-kissed', tags:['meat','mild','creamy','asia'], diet:'meat:beef', spice:1},
      {t:'Green curry with tofu and Thai basil', tags:['veg','spice','creamy','asia'], diet:'vegan', spice:3},
      {t:'Yellow curry with garden vegetables and coconut', tags:['veg','mild','creamy','asia'], diet:'vegan', spice:2}
    ] },
  { id:'asi-10', deck:'asia', q:'Dessert time in Thailand — how do you finish the meal?', emoji:'🥭', img:'photo-1488477181946-6428a0291777', multi:false,
    diets:['everything','vegetarian','vegan','halal'],
    options:[
      {t:'Mango sticky rice with salted coconut cream', tags:['sweet','rice','asia'], diet:'vegan', sweet:3},
      {t:'Coconut ice cream with roasted peanuts', tags:['sweet','creamy','asia'], diet:'vegan', sweet:2},
      {t:'Tub tim grob — crunchy red rubies in iced coconut milk', tags:['sweet','asia','adventure'], diet:'vegan', sweet:2, adv:1},
      {t:'Sangkaya — smooth egg custard over sticky rice', tags:['sweet','asia'], diet:'veg', sweet:2}
    ] },
  { id:'asi-11', deck:'asia', q:'Pho shop moment in Hanoi — which bowl do you order?', emoji:'🍜', img:'photo-1582878826629-1930a9b76f5c', multi:false,
    diets:['everything','vegetarian','vegan','halal'],
    options:[
      {t:'Pho bo — rare beef in a star-anise broth', tags:['noodle','meat','asia'], diet:'meat:beef', spice:1},
      {t:'Pho ga — gentle chicken pho with ginger', tags:['noodle','meat','mild','asia'], diet:'meat:chicken', spice:0},
      {t:'Pho chay — veggie broth with tofu and mushrooms', tags:['noodle','veg','healthy','asia'], diet:'vegan', spice:1},
      {t:'Pho chay, extra chilli, with mushroom meatballs', tags:['noodle','veg','spice','asia'], diet:'vegan', spice:3}
    ] },
  { id:'asi-12', deck:'asia', q:'Vietnamese snack stop — choose your fighter.', emoji:'🥖', img:'photo-1528735602780-2552fd46c7af', multi:false,
    diets:['everything','vegetarian','vegan','halal'],
    options:[
      {t:'Classic banh mi with cold cuts and pate', tags:['meat','classic','asia'], diet:'meat:pork'},
      {t:'Grilled chicken banh mi with pickled carrot', tags:['meat','tangy','asia'], diet:'meat:chicken'},
      {t:'Tofu banh mi with crunchy pickles and coriander', tags:['veg','fresh','asia'], diet:'vegan'},
      {t:'Fresh spring rolls with tofu, herbs and peanut dip', tags:['veg','fresh','healthy','asia'], diet:'vegan'}
    ] },
  { id:'asi-13', deck:'asia', q:'The dim sum cart rolls by in Hong Kong — what do you point at first?', emoji:'🥟', img:'photo-1496116218417-1a781b1c416', multi:false,
    diets:['everything','vegetarian','vegan','halal'],
    options:[
      {t:'Har gow — translucent prawn dumplings', tags:['meat','classic','asia'], diet:'meat:seafood'},
      {t:'Siu mai — open-topped pork dumplings', tags:['meat','classic','asia'], diet:'meat:pork'},
      {t:'Crystal veggie dumplings with chive and mushroom', tags:['veg','asia'], diet:'vegan'},
      {t:'Golden vegetable spring rolls with sweet chilli dip', tags:['veg','street','asia'], diet:'vegan', spice:1}
    ] },
  { id:'asi-14', deck:'asia', q:'Sichuan spice test — how brave are you tonight?', emoji:'🌶️', img:'photo-1596040033229-a9821ebd058d', multi:false,
    diets:['everything','vegetarian','vegan','halal'],
    options:[
      {t:'Dan dan noodles with minced pork and peanuts', tags:['noodle','meat','spice','asia'], diet:'meat:pork', spice:3},
      {t:'Dan dan noodles with crumbled tofu and Sichuan pepper', tags:['noodle','veg','spice','asia'], diet:'vegan', spice:3},
      {t:'Mapo tofu, fully plant-based and numbing-hot', tags:['veg','spice','asia'], diet:'vegan', spice:3},
      {t:'Kung pao chicken with dried chillies and peanuts', tags:['meat','spice','asia'], diet:'meat:chicken', spice:2}
    ] },
  { id:'asi-15', deck:'asia', q:'Hot pot night — the broth is bubbling. Your first dip goes to…', emoji:'🫕', img:'photo-1547592180-85f173990554', multi:false,
    diets:['everything','vegetarian','vegan','halal'],
    options:[
      {t:'Hand-cut lamb rolls for the spicy broth', tags:['meat','spice','asia'], diet:'meat:lamb', spice:2},
      {t:'Marbled beef slices, swished for seconds', tags:['meat','asia'], diet:'meat:beef'},
      {t:'Tofu skin, tofu puffs and wood-ear mushrooms', tags:['veg','asia'], diet:'vegan'},
      {t:'A basket of greens, corn and hand-pulled noodles', tags:['veg','noodle','asia'], diet:'vegan'}
    ] },
  { id:'asi-16', deck:'asia', q:'Wok night in Kuala Lumpur — which sizzling plate rules?', emoji:'🍚', img:'photo-1512058564366-18510be2db19', multi:false,
    diets:['everything','vegetarian','vegan','halal'],
    options:[
      {t:'Nasi goreng with chicken, egg and keropok crackers', tags:['rice','meat','spice','asia'], diet:'meat:chicken', spice:2},
      {t:'Char kway teow — smoky flat noodles with prawns and egg', tags:['noodle','meat','smoky','asia'], diet:'meat:seafood', spice:1},
      {t:'Nasi goreng sayur — veggie fried rice, no egg, extra sambal', tags:['rice','veg','spice','asia'], diet:'vegan', spice:2},
      {t:'Pineapple fried rice with cashews and raisins, no egg', tags:['rice','veg','sweet','asia'], diet:'vegan', sweet:1}
    ] },
  { id:'asi-17', deck:'asia', q:'Laksa love — which steamy bowl wins your heart?', emoji:'🍜', img:'photo-1547592166-23ac45744acd', multi:false,
    diets:['everything','vegetarian','vegan','halal'],
    options:[
      {t:'Curry laksa with chicken, prawns and tofu puffs', tags:['noodle','meat','spice','creamy','asia'], diet:'meat:chicken', spice:2},
      {t:'Assam laksa — tangy tamarind fish broth, Penang style', tags:['noodle','meat','tangy','asia'], diet:'meat:seafood', spice:2},
      {t:'Veggie laksa with coconut broth and tofu puffs', tags:['noodle','veg','spice','creamy','asia'], diet:'vegan', spice:2},
      {t:'Mushroom laksa with herbs and a squeeze of lime', tags:['noodle','veg','tangy','asia'], diet:'vegan', spice:1}
    ] },
  { id:'asi-18', deck:'asia', q:'Indonesia on a plate — from the grill and the slow pot, pick your hero.', emoji:'🍢', img:'photo-1599487488170-d11ec9c172f0', multi:false,
    diets:['everything','vegetarian','vegan','halal'],
    options:[
      {t:'Chicken satay with rich peanut sauce', tags:['meat','street','asia'], diet:'meat:chicken', spice:1},
      {t:'Beef rendang — slow-braised in coconut and spices', tags:['meat','spice','home','asia'], diet:'meat:beef', spice:2},
      {t:'Tempeh satay with peanut sauce and crunchy pickles', tags:['veg','street','asia'], diet:'vegan', spice:1},
      {t:'Young jackfruit rendang — tender, spiced, slow-cooked', tags:['veg','spice','asia','adventure'], diet:'vegan', spice:2, adv:1}
    ] },
  { id:'asi-19', deck:'asia', q:'Filipino comfort food — what fills your plate?', emoji:'🍽️', img:'photo-1504674900247-0877df9cc836', multi:false,
    diets:['everything','vegetarian','vegan','halal'],
    options:[
      {t:'Chicken adobo — a soy and vinegar braise with bay leaf', tags:['meat','tangy','home','asia'], diet:'meat:chicken'},
      {t:'Pork adobo with a little extra garlic', tags:['meat','tangy','home','asia'], diet:'meat:pork'},
      {t:'Adobong sitaw — green beans and tofu, adobo style', tags:['veg','tangy','home','asia'], diet:'vegan'},
      {t:'Vegetable lumpia — crisp spring rolls with a vinegar dip', tags:['veg','street','tangy','asia'], diet:'vegan'}
    ] },
  { id:'asi-20', deck:'asia', q:'Momo break — steamed dumplings from the Himalayas. Your filling?', emoji:'🥟', img:'photo-1496116218417-1a781b1c416', multi:false,
    diets:['everything','vegetarian','vegan','halal'],
    options:[
      {t:'Chicken momos with spicy tomato-sesame chutney', tags:['meat','spice','asia'], diet:'meat:chicken', spice:2},
      {t:'Veg momos — cabbage, carrot and warm spices', tags:['veg','asia'], diet:'vegan', spice:1},
      {t:'Tofu and spinach momos with chilli oil', tags:['veg','spice','asia'], diet:'vegan', spice:2},
      {t:'Paneer momos — soft cheese and herb filling', tags:['veg','asia'], diet:'veg', spice:1}
    ] },
  { id:'asi-21', deck:'asia', q:'Mountain appetite in Kathmandu — pick your plate.', emoji:'🏔️', img:'photo-1589302168068-964664d93dc0', multi:false,
    diets:['everything','vegetarian','vegan','halal'],
    options:[
      {t:'Chicken thukpa — hand-pulled noodle soup', tags:['noodle','meat','home','asia'], diet:'meat:chicken', spice:1},
      {t:'Veg thukpa with tofu and mountain vegetables', tags:['noodle','veg','home','asia'], diet:'vegan', spice:1},
      {t:'Dal bhat — lentil soup, rice, veg curry and pickles', tags:['rice','veg','home','healthy','asia'], diet:'vegan', spice:1},
      {t:'Mushroom chilli stir-fry with steamed rice', tags:['rice','veg','spice','asia'], diet:'vegan', spice:2}
    ] },
  { id:'asi-22', deck:'asia', q:'Sri Lanka on a plate — what are you trying first?', emoji:'🥥', img:'photo-1567620905732-2d1ec7ab7445', multi:false,
    diets:['everything','vegetarian','vegan','halal'],
    options:[
      {t:'Egg hopper — a crisp coconut pancake bowl with a soft egg', tags:['veg','asia','adventure'], diet:'veg', adv:1},
      {t:'Plain hopper with coconut sambol and onion relish', tags:['veg','spice','asia'], diet:'vegan', spice:2},
      {t:'Chicken kottu — chopped flatbread stir-fried on a hot plate', tags:['meat','street','spice','asia'], diet:'meat:chicken', spice:2},
      {t:'Veg kottu with leeks, carrots and curry leaves', tags:['veg','street','spice','asia'], diet:'vegan', spice:2}
    ] },
  { id:'asi-23', deck:'asia', q:'Dosa time in Bengaluru — crisp golden crepes. Which one is yours?', emoji:'🫓', img:'photo-1630383249896-424e482df921', multi:false,
    diets:['everything','vegetarian','vegan','halal'],
    options:[
      {t:'Masala dosa — spiced potato filling, coconut chutney, sambar', tags:['veg','spice','classic','asia'], diet:'vegan', spice:1},
      {t:'Paneer bhurji dosa — crumbled spiced cottage cheese', tags:['veg','spice','asia'], diet:'veg', spice:1},
      {t:'Plain dosa with extra chutneys and a filter coffee on the side', tags:['veg','classic','coffee','asia'], diet:'vegan'},
      {t:'Egg dosa — a thin omelette layer inside the crepe', tags:['veg','asia'], diet:'veg'}
    ] },
  { id:'asi-24', deck:'asia', q:'Delhi chaat run — tangy, crunchy, chaotic. What is in your hand?', emoji:'🥙', img:'photo-1626132647523-66f5bf380027', multi:false,
    diets:['everything','vegetarian','vegan','halal'],
    options:[
      {t:'Chole bhature — spiced chickpeas with puffy fried bread', tags:['veg','spice','street','asia'], diet:'veg', spice:2},
      {t:'Pani puri — crisp shells, mint water, potato filling', tags:['veg','tangy','street','asia'], diet:'vegan', spice:2},
      {t:'Samosa with tamarind and mint chutneys', tags:['veg','tangy','street','asia'], diet:'vegan', spice:1},
      {t:'Aloo tikki chaat with chutneys, no yogurt', tags:['veg','spice','street','asia'], diet:'vegan', spice:2}
    ] },
  { id:'asi-25', deck:'asia', q:'Slow-cooked comfort — which Indian pot are you spooning from?', emoji:'🍛', img:'photo-1585937421612-70a008356fbe', multi:false,
    diets:['everything','vegetarian','vegan','halal'],
    options:[
      {t:'Dal makhani — black lentils simmered in butter and cream', tags:['veg','creamy','home','asia'], diet:'veg', spice:1},
      {t:'Dal tadka — yellow lentils with a sizzling oil tempering', tags:['veg','home','healthy','asia'], diet:'vegan', spice:1},
      {t:'Baingan bharta — smoky mashed aubergine with peas', tags:['veg','smoky','home','asia'], diet:'vegan', spice:1},
      {t:'Palak paneer — spinach curry with soft cheese cubes', tags:['veg','creamy','home','asia'], diet:'veg', spice:1}
    ] },
  { id:'asi-26', deck:'asia', q:'The biryani extended family — which layered rice wins?', emoji:'🍚', img:'photo-1563379091339-03b21ab4a4f8', multi:false,
    diets:['everything','vegetarian','vegan','halal'],
    options:[
      {t:'Hyderabadi chicken dum biryani — the fiery original', tags:['biryani','rice','meat','spice','asia'], diet:'meat:chicken', spice:3},
      {t:'Jackfruit biryani — meaty texture, all plant', tags:['biryani','rice','veg','spice','adventure'], diet:'vegan', spice:2, adv:1},
      {t:'Mushroom biryani — oil-based and deeply spiced', tags:['biryani','rice','veg','spice','asia'], diet:'vegan', spice:2},
      {t:'Egg biryani with masala eggs and crisp fried onions', tags:['biryani','rice','spice','asia'], diet:'veg', spice:2}
    ] },
  { id:'asi-27', deck:'asia', q:'Tea break, Asian style — what is in your cup?', emoji:'🍵', img:'photo-1544787219-7f47ccb76574', multi:false,
    diets:['everything','vegetarian','vegan','halal'],
    options:[
      {t:'Masala chai — milky, spiced, properly boiled', tags:['chai','spice','asia'], diet:'veg', spice:1, sweet:1},
      {t:'Bubble tea with oat milk and chewy tapioca pearls', tags:['sweet','cafe','asia'], diet:'vegan', sweet:2},
      {t:'Iced matcha latte with oat milk', tags:['cafe','healthy','fresh','asia'], diet:'vegan', sweet:1},
      {t:'Vietnamese iced coffee — strong, sweet, with condensed milk', tags:['coffee','sweet','asia'], diet:'veg', sweet:2}
    ] },
  { id:'asi-28', deck:'asia', q:'One more sweet finish — pick your Asian dessert.', emoji:'🍮', img:'photo-1563805042-7684c019e1cb', multi:false,
    diets:['everything','vegetarian','vegan','halal'],
    options:[
      {t:'Mochi ice cream — chewy rice dough, creamy centre', tags:['sweet','asia'], diet:'veg', sweet:2},
      {t:'Mango sago — mango, coconut milk and tiny pearls', tags:['sweet','creamy','asia'], diet:'vegan', sweet:2},
      {t:'Black sesame tangyuan — glutinous rice balls in ginger soup', tags:['sweet','asia','adventure'], diet:'vegan', sweet:1, adv:1},
      {t:'Gulab jamun — warm milk dumplings in rose syrup', tags:['sweet','classic','asia'], diet:'veg', sweet:3}
    ] },
  { id:'asi-29', deck:'asia', q:'Breakfast, Asian edition — how do you start the day?', emoji:'🍳', img:'photo-1525351484163-7529414344d8', multi:false,
    diets:['everything','vegetarian','vegan','halal'],
    options:[
      {t:'Congee with pork and a century egg', tags:['rice','meat','home','asia','adventure'], diet:'meat:pork', adv:2},
      {t:'Plain congee with pickles, peanuts and tofu', tags:['rice','veg','home','asia'], diet:'vegan'},
      {t:'Kaya toast with soft-boiled eggs and kopi, Singapore style', tags:['veg','sweet','coffee','asia'], diet:'veg', sweet:1},
      {t:'Idli sambar — cloud-soft rice cakes with lentil soup', tags:['veg','healthy','home','asia'], diet:'vegan', spice:1}
    ] },
  { id:'asi-30', deck:'asia', q:'Night market finale — one last bite before home.', emoji:'🏮', img:'photo-1555939594-58d7cb561ad1', multi:false,
    diets:['everything','vegetarian','vegan','halal'],
    options:[
      {t:'Grilled squid skewers with chilli-lime salt', tags:['meat','smoky','street','asia'], diet:'meat:seafood', spice:1},
      {t:'Stinky tofu — famously funky, crisp outside, soft inside', tags:['veg','street','asia','adventure'], diet:'vegan', adv:3},
      {t:'Takoyaki — golden octopus balls with bonito flakes', tags:['meat','street','asia'], diet:'meat:seafood'},
      {t:'Grilled sweetcorn rubbed with chilli salt', tags:['veg','smoky','street','asia'], diet:'vegan', spice:1}
    ] }
];

/* ——— deck: americas.js ——— */
const DECK_AMERICAS = [
{ id:'ame-01', deck:'americas', q:'Taco night in Mexico City — which taco are you grabbing first?', emoji:'🌮', img:'photo-1565299585323-38d6b0865b47', multi:false,
  diets:['everything','vegetarian','vegan','halal'],
  options:[
    {t:'Baja fish taco with chipotle slaw', tags:['street','americas','tangy'], diet:'meat:seafood', spice:2},
    {t:'Al pastor — marinated pork shaved off the spit', tags:['street','americas','meat'], diet:'meat:pork', spice:2},
    {t:'Cauliflower al pastor with pineapple salsa', tags:['street','americas','veg'], diet:'vegan', spice:2},
    {t:'Black bean & charred corn taco with avocado', tags:['street','americas','veg','fresh'], diet:'vegan', spice:1}
  ]},
{ id:'ame-02', deck:'americas', q:'Low-and-slow American BBQ — what is landing on your tray?', emoji:'🍖', img:'photo-1544025162-d76694265947', multi:false,
  diets:['everything','vegetarian','vegan','halal'],
  options:[
    {t:'Smoked beef brisket with a peppery bark', tags:['smoky','meat','americas','classic'], diet:'meat:beef', spice:1},
    {t:'Pulled pork shoulder with tangy slaw', tags:['smoky','meat','americas'], diet:'meat:pork', spice:1},
    {t:'Smoked jackfruit in BBQ sauce', tags:['smoky','veg','americas','adventure'], diet:'vegan', spice:2},
    {t:'Grilled portobello & corn ribs with chimichurri', tags:['smoky','veg','americas','fresh'], diet:'vegan', spice:1}
  ]},
{ id:'ame-03', deck:'americas', q:'The great burger debate — your patty of choice?', emoji:'🍔', img:'photo-1568901346375-23c9450c58cd', multi:false,
  diets:['everything','vegetarian','vegan','halal'],
  options:[
    {t:'Classic smashed cheeseburger, pickles & secret sauce', tags:['classic','meat','americas'], diet:'meat:beef', spice:0},
    {t:'Grilled chicken burger with avocado', tags:['meat','americas','fresh'], diet:'meat:chicken', spice:1},
    {t:'Smoky black bean burger with chipotle mayo', tags:['veg','americas','smoky'], diet:'vegan', spice:2},
    {t:'Lentil-walnut patty with tomato jam', tags:['veg','americas','healthy'], diet:'vegan', spice:0}
  ]},
{ id:'ame-04', deck:'americas', q:'Elote — Mexican street corn — how do you take yours?', emoji:'🌽', img:'', multi:false,
  diets:['everything','vegetarian','vegan','halal'],
  options:[
    {t:'Classic: mayo, cotija cheese, chilli & lime', tags:['street','americas','creamy','tangy'], diet:'veg', spice:2},
    {t:'Vegan style with cashew crema & tajín', tags:['street','americas','veg','tangy'], diet:'vegan', spice:2},
    {t:'Esquites — corn kernels in a cup with lime & chilli', tags:['street','americas','veg','fresh'], diet:'vegan', spice:2},
    {t:'Simple grilled corn with herb butter', tags:['street','americas','mild'], diet:'veg', spice:0}
  ]},
{ id:'ame-05', deck:'americas', q:'Fried chicken face-off — what is in your bucket?', emoji:'🍗', img:'photo-1562967914-608f82629710', multi:false,
  diets:['everything','vegetarian','vegan','halal'],
  options:[
    {t:'Buttermilk fried chicken, golden & juicy', tags:['classic','meat','americas','home'], diet:'meat:chicken', spice:1},
    {t:'Nashville hot chicken — fiery chilli oil glaze', tags:['spice','meat','americas'], diet:'meat:chicken', spice:3},
    {t:'Buffalo cauliflower bites with ranch-style dip', tags:['veg','americas','spice'], diet:'vegan', spice:2},
    {t:'Crispy fried oyster mushrooms, chicken-style crunch', tags:['veg','americas','adventure'], diet:'vegan', spice:1}
  ]},
{ id:'ame-06', deck:'americas', q:'A steaming bowl of Louisiana gumbo — which pot is calling you?', emoji:'🍲', img:'photo-1547592180-85f173990554', multi:false,
  diets:['everything','vegetarian','vegan','halal'],
  options:[
    {t:'Chicken & smoked sausage gumbo over rice', tags:['home','meat','americas','rice'], diet:'meat:chicken', spice:2},
    {t:'Seafood gumbo with shrimp & crab', tags:['meat','americas','adventure'], diet:'meat:seafood', spice:2},
    {t:'Okra & tomato veggie gumbo', tags:['veg','americas','home','healthy'], diet:'vegan', spice:2},
    {t:'Black-eyed pea & greens gumbo', tags:['veg','americas','smoky'], diet:'vegan', spice:1}
  ]},
{ id:'ame-07', deck:'americas', q:'Chowder weather — which bowl warms you up?', emoji:'🥣', img:'photo-1547592166-23ac45744acd', multi:false,
  diets:['everything','vegetarian','vegan','halal'],
  options:[
    {t:'New England clam chowder — creamy, with potatoes', tags:['creamy','americas','classic','home'], diet:'meat:seafood', spice:0},
    {t:'Smoked salmon chowder with dill', tags:['creamy','americas','smoky'], diet:'meat:seafood', spice:0},
    {t:'Roasted corn & potato chowder, coconut-creamy', tags:['veg','americas','creamy','sweet'], diet:'vegan', spice:0},
    {t:'Tomato & white bean soup with grilled bread', tags:['veg','americas','fresh','healthy'], diet:'vegan', spice:1}
  ]},
{ id:'ame-08', deck:'americas', q:'Sunday pancake stack — what is on top?', emoji:'🥞', img:'photo-1567620905732-2d1ec7ab7445', multi:false,
  diets:['everything','vegetarian','vegan','halal'],
  options:[
    {t:'Buttermilk pancakes with maple syrup & butter', tags:['classic','sweet','americas','cafe'], diet:'veg', sweet:2},
    {t:'Blueberry oat pancakes with maple syrup', tags:['sweet','americas','veg','cafe'], diet:'vegan', sweet:2},
    {t:'Banana buckwheat pancakes with berries', tags:['sweet','americas','veg','healthy'], diet:'vegan', sweet:1},
    {t:'Short stack with crispy bacon & a fried egg', tags:['meat','americas','classic'], diet:'meat:pork', spice:0}
  ]},
{ id:'ame-09', deck:'americas', q:'New York bagel run — what is your schmear situation?', emoji:'🥯', img:'photo-1509440159596-0249088772ff', multi:false,
  diets:['everything','vegetarian','vegan','halal'],
  options:[
    {t:'Lox (cured salmon) & cream cheese, capers & onion', tags:['americas','classic','cafe','fresh'], diet:'meat:seafood', spice:0},
    {t:'Egg & melted cheese on a toasted sesame bagel', tags:['americas','cafe','creamy'], diet:'veg', spice:0},
    {t:'Avocado, tomato & everything seasoning', tags:['veg','americas','fresh','healthy'], diet:'vegan', spice:0},
    {t:'Hummus, cucumber & sprouts', tags:['veg','americas','fresh'], diet:'vegan', spice:0}
  ]},
{ id:'ame-10', deck:'americas', q:'Key lime pie country (Florida) — pick your slice of sunshine.', emoji:'🥧', img:'photo-1488477181946-6428a0291777', multi:false,
  diets:['everything','vegetarian','vegan','halal'],
  options:[
    {t:'Classic key lime pie with whipped cream', tags:['sweet','tangy','americas','classic'], diet:'veg', sweet:2},
    {t:'Vegan key lime pie with coconut cream', tags:['sweet','tangy','americas','veg'], diet:'vegan', sweet:2},
    {t:'Key lime sorbet — sharp, icy, refreshing', tags:['sweet','tangy','americas','veg','fresh'], diet:'vegan', sweet:2},
    {t:'New York cheesecake with a lime twist', tags:['sweet','creamy','americas'], diet:'veg', sweet:2}
  ]},
{ id:'ame-11', deck:'americas', q:'Mole poblano — Mexico\u2019s deep, chocolatey chilli sauce. Over what?', emoji:'🍫', img:'photo-1504674900247-0877df9cc836', multi:false,
  diets:['everything','vegetarian','vegan','halal'],
  options:[
    {t:'Slow-cooked chicken in mole poblano', tags:['americas','meat','spice','home'], diet:'meat:chicken', spice:2},
    {t:'Roasted cauliflower steak under rich mole', tags:['americas','veg','adventure'], diet:'vegan', spice:2},
    {t:'Mushrooms & plantain simmered in mole', tags:['americas','veg','sweet'], diet:'vegan', spice:2},
    {t:'Enmoladas — tortillas in mole with melted cheese', tags:['americas','creamy','classic'], diet:'veg', spice:2}
  ]},
{ id:'ame-12', deck:'americas', q:'Churro time — hot, crisp, cinnamon-dusted. Your dip?', emoji:'🍩', img:'photo-1551024601-bec78aea704b', multi:false,
  diets:['everything','vegetarian','vegan','halal'],
  options:[
    {t:'Thick hot chocolate for dunking', tags:['sweet','americas','classic','cafe'], diet:'veg', sweet:3},
    {t:'Cajeta — silky goat-milk caramel', tags:['sweet','americas','creamy'], diet:'veg', sweet:3},
    {t:'Dark chocolate sauce, dairy-free', tags:['sweet','americas','veg'], diet:'vegan', sweet:2},
    {t:'Warm strawberry compote', tags:['sweet','americas','veg','fresh'], diet:'vegan', sweet:2}
  ]},
{ id:'ame-13', deck:'americas', q:'Thirsty? Pick your Mexican refresher.', emoji:'🥤', img:'photo-1505252585461-04db1eb84625', multi:false,
  diets:['everything','vegetarian','vegan','halal'],
  options:[
    {t:'Horchata — sweet rice & cinnamon drink', tags:['sweet','americas','veg','mild'], diet:'vegan', sweet:2},
    {t:'Agua de jamaica — tart hibiscus iced tea', tags:['tangy','americas','veg','fresh'], diet:'vegan', sweet:1},
    {t:'Tamarind agua fresca — sweet-sour & earthy', tags:['tangy','americas','veg','adventure'], diet:'vegan', sweet:2},
    {t:'Classic lime margarita, salted rim', tags:['americas','tangy','cafe'], diet:'alcohol', sweet:1}
  ]},
{ id:'ame-14', deck:'americas', q:'Peruvian ceviche — raw fish cured in lime & chilli. Your version?', emoji:'🐟', img:'photo-1467003909585-2f8a72700288', multi:false,
  diets:['everything','vegetarian','vegan','halal'],
  options:[
    {t:'Classic sea bass ceviche with red onion & sweet potato', tags:['americas','fresh','tangy','adventure'], diet:'meat:seafood', spice:2},
    {t:'Shrimp ceviche with tomato & avocado', tags:['americas','fresh','tangy'], diet:'meat:seafood', spice:2},
    {t:'Mushroom ceviche in leche de tigre (lime-chilli marinade)', tags:['americas','veg','fresh','adventure'], diet:'vegan', spice:2},
    {t:'Mango & avocado ceviche with red onion', tags:['americas','veg','fresh','sweet'], diet:'vegan', spice:1}
  ]},
{ id:'ame-15', deck:'americas', q:'Lomo saltado — Peru\u2019s stir-fry of soy, tomato & fries over rice. Your protein?', emoji:'🥩', img:'photo-1600891964092-4316c288032e', multi:false,
  diets:['everything','vegetarian','vegan','halal'],
  options:[
    {t:'Beef strips, classic style', tags:['americas','meat','rice','home'], diet:'meat:beef', spice:1},
    {t:'Chicken saltado with peppers & onion', tags:['americas','meat','rice'], diet:'meat:chicken', spice:1},
    {t:'King oyster mushrooms, seared & saucy', tags:['americas','veg','rice','adventure'], diet:'vegan', spice:1},
    {t:'Cauliflower & bell pepper saltado', tags:['americas','veg','rice','healthy'], diet:'vegan', spice:1}
  ]},
{ id:'ame-16', deck:'americas', q:'Build an Andean quinoa bowl — what anchors it?', emoji:'🥗', img:'photo-1540420773420-3366772f4999', multi:false,
  diets:['everything','vegetarian','vegan','halal'],
  options:[
    {t:'Quinoa & black bean bowl with corn salsa', tags:['healthy','veg','americas','fresh'], diet:'vegan', spice:1},
    {t:'Quinoa tabbouleh with avocado & lime', tags:['healthy','veg','americas','fresh'], diet:'vegan', spice:0},
    {t:'Grilled chicken & quinoa with herb dressing', tags:['healthy','meat','americas'], diet:'meat:chicken', spice:0},
    {t:'Seared salmon over quinoa & greens', tags:['healthy','americas','fresh'], diet:'meat:seafood', spice:0}
  ]},
{ id:'ame-17', deck:'americas', q:'Feijoada — Brazil\u2019s black bean stew. Which pot are you ladling from?', emoji:'🫘', img:'photo-1512058564366-18510be2db19', multi:false,
  diets:['everything','vegetarian','vegan','halal'],
  options:[
    {t:'Traditional feijoada — beans with pork & beef, rice & orange', tags:['americas','meat','rice','home','classic'], diet:'meat:other', spice:1},
    {t:'Chicken feijoada-style bean stew', tags:['americas','meat','rice','home'], diet:'meat:chicken', spice:1},
    {t:'Fully plant-based feijoada with smoked tofu-free beans & greens', tags:['americas','veg','rice','smoky'], diet:'vegan', spice:1},
    {t:'Black bean & sweet potato stew with farofa (toasted cassava crumbs)', tags:['americas','veg','rice','adventure'], diet:'vegan', spice:1}
  ]},
{ id:'ame-18', deck:'americas', q:'Brigadeiro break — Brazil\u2019s fudgy chocolate truffles. Pick a flavour.', emoji:'🍬', img:'photo-1551024506-0bccd828d307', multi:false,
  diets:['everything','vegetarian','vegan','halal'],
  options:[
    {t:'Classic brigadeiro rolled in chocolate sprinkles', tags:['sweet','americas','classic'], diet:'veg', sweet:3},
    {t:'Beijinho — coconut truffle with a clove on top', tags:['sweet','americas','creamy'], diet:'veg', sweet:3},
    {t:'Vegan brigadeiro made with coconut milk', tags:['sweet','americas','veg'], diet:'vegan', sweet:3},
    {t:'Cashew & cocoa truffles, naturally sweetened', tags:['sweet','americas','veg','healthy'], diet:'vegan', sweet:2}
  ]},
{ id:'ame-19', deck:'americas', q:'Brazilian snack stop — what are you reaching for?', emoji:'🧀', img:'photo-1486297678162-eb2a19b0a32d', multi:false,
  diets:['everything','vegetarian','vegan','halal'],
  options:[
    {t:'Pão de queijo — warm, chewy cheese buns', tags:['americas','cafe','classic','creamy'], diet:'veg', spice:0},
    {t:'Coxinha — chicken croquette shaped like a teardrop', tags:['americas','meat','street'], diet:'meat:chicken', spice:1},
    {t:'Grilled corn on the cob, Brazilian street style', tags:['americas','veg','street','smoky'], diet:'vegan', spice:1},
    {t:'Hearts of palm & tomato salad', tags:['americas','veg','fresh','healthy'], diet:'vegan', spice:0}
  ]},
{ id:'ame-20', deck:'americas', q:'Açaí o\u2019clock — the Amazonian berry bowl, your way.', emoji:'🫐', img:'photo-1490474418585-ba9bad8fd0ea', multi:false,
  diets:['everything','vegetarian','vegan','halal'],
  options:[
    {t:'Açaí bowl with oat granola & banana', tags:['sweet','fresh','americas','veg','healthy'], diet:'vegan', sweet:2},
    {t:'Thick açaí smoothie with berries', tags:['sweet','fresh','americas','veg'], diet:'vegan', sweet:2},
    {t:'Açaí swirled with sweet condensed milk', tags:['sweet','creamy','americas'], diet:'veg', sweet:3},
    {t:'Pure açaí sorbet cup with cacao nibs', tags:['sweet','americas','veg','adventure'], diet:'vegan', sweet:1}
  ]},
{ id:'ame-21', deck:'americas', q:'Argentinian empanadas — golden half-moons. Your filling?', emoji:'🥟', img:'photo-1601050690597-df0568f70950', multi:false,
  diets:['everything','vegetarian','vegan','halal'],
  options:[
    {t:'Beef with olive & a hint of cumin', tags:['americas','meat','street','classic'], diet:'meat:beef', spice:1},
    {t:'Humita — creamy sweetcorn & cheese', tags:['americas','sweet','creamy'], diet:'veg', spice:0},
    {t:'Spinach & potato with garlic', tags:['americas','veg','home'], diet:'vegan', spice:0},
    {t:'Mushroom & caramelised onion', tags:['americas','veg','smoky'], diet:'vegan', spice:0}
  ]},
{ id:'ame-22', deck:'americas', q:'Asado night in Argentina — the grill is loaded. Your plate?', emoji:'🔥', img:'photo-1558030006-450675393462', multi:false,
  diets:['everything','vegetarian','vegan','halal'],
  options:[
    {t:'Asado beef ribs, salt & smoke only', tags:['smoky','meat','americas','classic'], diet:'meat:beef', spice:0},
    {t:'Provoleta — grilled provolone with oregano', tags:['americas','creamy','smoky'], diet:'veg', spice:0},
    {t:'Mushroom & pepper skewers with chimichurri', tags:['smoky','veg','americas'], diet:'vegan', spice:1},
    {t:'Charred corn & vegetable platter, chimichurri drizzle', tags:['smoky','veg','americas','fresh'], diet:'vegan', spice:1}
  ]},
{ id:'ame-23', deck:'americas', q:'Sauce is boss — which one gets drizzled over everything?', emoji:'🌿', img:'', multi:false,
  diets:['everything','vegetarian','vegan','halal'],
  options:[
    {t:'Chimichurri — parsley, garlic, oregano & olive oil', tags:['fresh','americas','veg','tangy'], diet:'vegan', spice:1},
    {t:'Salsa criolla — onion, tomato & vinegar relish', tags:['fresh','americas','veg','tangy'], diet:'vegan', spice:0},
    {t:'Ají amarillo mayo — golden Peruvian chilli mayo', tags:['creamy','americas','spice'], diet:'veg', spice:2},
    {t:'Romesco-style roasted pepper & almond sauce', tags:['americas','veg','smoky','adventure'], diet:'vegan', spice:1}
  ]},
{ id:'ame-24', deck:'americas', q:'Poutine time in Canada — fries, gravy, glory. Which version?', emoji:'🍟', img:'photo-1518013431117-eb1465fa5752', multi:false,
  diets:['everything','vegetarian','vegan','halal'],
  options:[
    {t:'Classic poutine — cheese curds & rich beef gravy', tags:['americas','classic','creamy'], diet:'meat:other', spice:0},
    {t:'Pulled pork poutine with BBQ drizzle', tags:['americas','meat','smoky'], diet:'meat:pork', spice:1},
    {t:'Vegan poutine — mushroom gravy & dairy-free curds', tags:['americas','veg','adventure'], diet:'vegan', spice:0},
    {t:'Sweet potato poutine with maple-miso gravy', tags:['americas','veg','sweet'], diet:'vegan', spice:0}
  ]},
{ id:'ame-25', deck:'americas', q:'Maple everything — Canada\u2019s liquid gold. Where does it shine?', emoji:'🍁', img:'', multi:false,
  diets:['everything','vegetarian','vegan','halal'],
  options:[
    {t:'Maple-glazed salmon with lemon', tags:['sweet','americas','fresh'], diet:'meat:seafood', sweet:1},
    {t:'Maple-roasted carrots & parsnips', tags:['sweet','americas','veg','home'], diet:'vegan', sweet:2},
    {t:'Slow maple baked beans', tags:['sweet','americas','veg','smoky'], diet:'vegan', sweet:2},
    {t:'Pancake stack drowned in maple butter', tags:['sweet','americas','classic','cafe'], diet:'veg', sweet:3}
  ]},
{ id:'ame-26', deck:'americas', q:'Jerk night in Jamaica — smoky, fiery, allspice-rich. What is on the grill?', emoji:'🌶️', img:'photo-1555939594-58d7cb561ad1', multi:false,
  diets:['everything','vegetarian','vegan','halal'],
  options:[
    {t:'Jerk chicken with charred edges', tags:['spice','smoky','meat','americas'], diet:'meat:chicken', spice:3},
    {t:'Jerk shrimp, quick-seared & juicy', tags:['spice','americas','fresh'], diet:'meat:seafood', spice:3},
    {t:'Jerk cauliflower steak with mango salsa', tags:['spice','smoky','veg','americas'], diet:'vegan', spice:3},
    {t:'Jerk mushrooms & peppers over rice', tags:['spice','veg','americas','rice'], diet:'vegan', spice:2}
  ]},
{ id:'ame-27', deck:'americas', q:'Caribbean plate — pick the side that makes the meal.', emoji:'🍌', img:'photo-1512058564366-18510be2db19', multi:false,
  diets:['everything','vegetarian','vegan','halal'],
  options:[
    {t:'Rice & peas — coconut rice with kidney beans', tags:['americas','veg','rice','home'], diet:'vegan', spice:1},
    {t:'Fried sweet plantains, caramelised edges', tags:['americas','veg','sweet'], diet:'vegan', sweet:2},
    {t:'Tostones — twice-fried green plantains with garlic mojo', tags:['americas','veg','street','tangy'], diet:'vegan', spice:1},
    {t:'Slow curry goat with roti', tags:['americas','meat','spice','adventure'], diet:'meat:other', spice:3}
  ]},
{ id:'ame-28', deck:'americas', q:'Deli counter, USA — which sandwich has your name on it?', emoji:'🥪', img:'photo-1528735602780-2552fd46c7af', multi:false,
  diets:['everything','vegetarian','vegan','halal'],
  options:[
    {t:'Reuben — corned beef, sauerkraut & Swiss on rye', tags:['americas','meat','classic','tangy'], diet:'meat:beef', spice:0},
    {t:'BLT — bacon, lettuce, tomato, mayo', tags:['americas','meat','classic'], diet:'meat:pork', spice:0},
    {t:'Grilled veggie & hummus on sourdough', tags:['americas','veg','fresh','healthy'], diet:'vegan', spice:0},
    {t:'Avocado, sprouts & tomato with lemon tahini', tags:['americas','veg','fresh'], diet:'vegan', spice:0}
  ]},
{ id:'ame-29', deck:'americas', q:'Diner breakfast — the most important plate of the day?', emoji:'🍳', img:'photo-1525351484163-7529414344d8', multi:false,
  diets:['everything','vegetarian','vegan','halal'],
  options:[
    {t:'Steak & eggs with hash browns', tags:['americas','meat','classic','cafe'], diet:'meat:beef', spice:0},
    {t:'Eggs Florentine — spinach & hollandaise on a muffin', tags:['americas','creamy','cafe'], diet:'veg', spice:0},
    {t:'Tofu scramble plate with peppers & avocado', tags:['americas','veg','healthy','fresh'], diet:'vegan', spice:1},
    {t:'Bean & potato breakfast burrito with salsa verde', tags:['americas','veg','spice','street'], diet:'vegan', spice:2}
  ]},
{ id:'ame-30', deck:'americas', q:'Last stop: the ice-cream parlour. Your scoop?', emoji:'🍨', img:'photo-1563805042-7684c019e1cb', multi:false,
  diets:['everything','vegetarian','vegan','halal'],
  options:[
    {t:'Vanilla bean ice cream, the timeless classic', tags:['sweet','creamy','americas','classic'], diet:'veg', sweet:2},
    {t:'Coconut-milk soft serve with toasted coconut', tags:['sweet','creamy','americas','veg'], diet:'vegan', sweet:2},
    {t:'Mango sorbet — bright & dairy-free', tags:['sweet','fresh','americas','veg'], diet:'vegan', sweet:2},
    {t:'Bourbon vanilla ice cream — a grown-up twist', tags:['sweet','americas','adventure'], diet:'alcohol', sweet:2}
  ]}
];

/* ——— deck: europe.js ——— */
const DECK_EUROPE = [
  { id:'eur-01', deck:'europe', q:'Pasta night in Italy — which shape wins your heart?', emoji:'🍝', img:'photo-1473093295043-cdd812d0e601', multi:false,
    diets:['everything','vegetarian','vegan','halal'],
    options:[
      {t:'Spaghetti — the timeless long strands', tags:['noodle','classic'], diet:'vegan'},
      {t:'Penne — little tubes that trap the sauce', tags:['noodle'], diet:'vegan'},
      {t:'Farfalle — playful bow-ties', tags:['noodle'], diet:'vegan'},
      {t:'Fusilli — springy spirals that hug every bite', tags:['noodle'], diet:'vegan'}
    ] },
  { id:'eur-02', deck:'europe', q:'Sunday pasta — which sauce are you twirling into?', emoji:'🍅', img:'photo-1473093295043-cdd812d0e601', multi:false,
    diets:['everything','vegetarian','vegan','halal'],
    options:[
      {t:'Pomodoro — tomato, basil, pure and simple', tags:['noodle','classic','fresh'], diet:'vegan'},
      {t:'Aglio e olio — garlic, olive oil, a whisper of chilli', tags:['noodle'], diet:'vegan', spice:1},
      {t:'Arrabbiata — the fiery tomato one', tags:['noodle','spice'], diet:'vegan', spice:2},
      {t:'Alfredo — silky cream and parmesan', tags:['noodle','creamy','classic'], diet:'veg'}
    ] },
  { id:'eur-03', deck:'europe', q:'Pizza night, Naples style — which pie are you ordering?', emoji:'🍕', img:'photo-1513104890138-7c749659a591', multi:false,
    diets:['everything','vegetarian','vegan','halal'],
    options:[
      {t:'Margherita — tomato, mozzarella, basil', tags:['classic','veg'], diet:'veg'},
      {t:'Marinara — tomato, garlic, oregano, proudly cheese-free', tags:['classic'], diet:'vegan'},
      {t:'Roasted pepper & red onion, cheese-free and proud', tags:['veg','fresh'], diet:'vegan'},
      {t:'Quattro formaggi — four cheeses, zero regrets', tags:['creamy','veg'], diet:'veg'}
    ] },
  { id:'eur-04', deck:'europe', q:'Risotto — which bowl of slow-stirred comfort?', emoji:'🍚', img:'photo-1504674900247-0877df9cc836', multi:false,
    diets:['everything','vegetarian','vegan','halal'],
    options:[
      {t:'Wild mushroom, finished with olive oil, no cheese', tags:['rice','home'], diet:'vegan'},
      {t:'Tomato & basil — sunshine in a bowl', tags:['rice','fresh'], diet:'vegan'},
      {t:'Lemon & herb with plant butter', tags:['rice','tangy'], diet:'vegan'},
      {t:'Seafood risotto with prawns and mussels', tags:['rice','meat'], diet:'meat:seafood'}
    ] },
  { id:'eur-05', deck:'europe', q:'At the gelato counter — which scoop is yours?', emoji:'🍨', img:'photo-1563805042-7684c019e1cb', multi:false,
    diets:['everything','vegetarian','vegan','halal'],
    options:[
      {t:'Dark chocolate sorbet — intense and dairy-free', tags:['sweet'], diet:'vegan', sweet:3},
      {t:'Mango sorbet — pure fruit sunshine', tags:['sweet','fresh'], diet:'vegan', sweet:2},
      {t:'Pistachio gelato — nutty, creamy, classic', tags:['sweet','classic'], diet:'veg', sweet:2},
      {t:'Stracciatella — sweet milk with chocolate shards', tags:['sweet','creamy'], diet:'veg', sweet:2}
    ] },
  { id:'eur-06', deck:'europe', q:'Italian dessert finale — which one ends the meal?', emoji:'🍮', img:'photo-1488477181946-6428a0291777', multi:false,
    diets:['everything','vegetarian','vegan','halal'],
    options:[
      {t:'Classic tiramisu — espresso-soaked, mascarpone-rich', tags:['sweet','coffee','classic'], diet:'veg', sweet:3},
      {t:'Plant-based tiramisu — cashew cream, same espresso soul', tags:['sweet','coffee'], diet:'vegan', sweet:3},
      {t:'Sicilian lemon granita — icy, bright, refreshing', tags:['sweet','tangy','fresh'], diet:'vegan', sweet:2},
      {t:'Panna cotta — barely-set vanilla cream', tags:['sweet','creamy'], diet:'veg', sweet:2}
    ] },
  { id:'eur-07', deck:'europe', q:'A Parisian bakery at 8am — what goes in your paper bag?', emoji:'🥐', img:'photo-1555507036-94f33f82cd6e', multi:false,
    diets:['everything','vegetarian','vegan','halal'],
    options:[
      {t:'Butter croissant — shattering, golden, classic', tags:['cafe','classic'], diet:'veg'},
      {t:'Warm baguette with strawberry jam', tags:['cafe','home'], diet:'vegan', sweet:1},
      {t:'Pain au chocolat — two dark chocolate batons inside', tags:['cafe','sweet'], diet:'veg', sweet:2},
      {t:'Plant-butter croissant — all the flakes, none of the dairy', tags:['cafe'], diet:'vegan'}
    ] },
  { id:'eur-08', deck:'europe', q:'A Provençal market table in the south of France — which dish calls you?', emoji:'🫒', img:'photo-1512621776951-a57141f2eefd', multi:false,
    diets:['everything','vegetarian','vegan','halal'],
    options:[
      {t:'Ratatouille — slow-cooked summer vegetables', tags:['veg','home','europe'], diet:'vegan'},
      {t:'Soupe au pistou — bean & vegetable soup with basil-garlic oil', tags:['veg','home'], diet:'vegan'},
      {t:'Caramelised onion & olive flatbread', tags:['veg','tangy'], diet:'vegan'},
      {t:'Bouillabaisse — the famous Marseille fish stew', tags:['meat','adventure','europe'], diet:'meat:seafood', adv:1}
    ] },
  { id:'eur-09', deck:'europe', q:'At a Breton crêpe stand — sweet or savoury?', emoji:'🥞', img:'photo-1567620905732-2d1ec7ab7445', multi:false,
    diets:['everything','vegetarian','vegan','halal'],
    options:[
      {t:'Nutella & banana — the crowd-pleaser', tags:['sweet','cafe'], diet:'veg', sweet:3},
      {t:'Lemon & sugar — sharp, sweet, simple', tags:['sweet','tangy'], diet:'veg', sweet:2},
      {t:'Roasted vegetable buckwheat galette, plant-based batter', tags:['veg'], diet:'vegan'},
      {t:'Berry compote & coconut cream crêpe', tags:['sweet','fresh'], diet:'vegan', sweet:2}
    ] },
  { id:'eur-10', deck:'europe', q:'French bistro soups — which bowl warms you up?', emoji:'🍲', img:'photo-1547592166-23ac45744acd', multi:false,
    diets:['everything','vegetarian','vegan','halal'],
    options:[
      {t:'Roasted tomato soup with basil oil', tags:['home','fresh'], diet:'vegan'},
      {t:'Garden salad soup — green, herby, lemon-mustard dressing', tags:['healthy','fresh'], diet:'vegan'},
      {t:'Mushroom velouté — velvet-smooth and creamy', tags:['creamy','home'], diet:'veg'},
      {t:'French onion soup under a Gruyère crouton', tags:['classic','home','europe'], diet:'veg'}
    ] },
  { id:'eur-11', deck:'europe', q:'French dessert — which sweet finale?', emoji:'🍰', img:'photo-1551024506-0bccd828d307', multi:false,
    diets:['everything','vegetarian','vegan','halal'],
    options:[
      {t:'Crème brûlée — crackling caramel over vanilla custard', tags:['sweet','classic','europe'], diet:'veg', sweet:3},
      {t:'Silky dark chocolate mousse, plant-based', tags:['sweet'], diet:'vegan', sweet:3},
      {t:'Fresh berry tart in crisp vegan pastry', tags:['sweet','fresh'], diet:'vegan', sweet:2},
      {t:'Lemon tart — glossy, sharp, buttery', tags:['sweet','tangy'], diet:'veg', sweet:2}
    ] },
  { id:'eur-12', deck:'europe', q:'Paella Sunday in Spain — which pan are you sharing?', emoji:'🥘', img:'photo-1534080564583-6be75777b70a', multi:false,
    diets:['everything','vegetarian','vegan','halal'],
    options:[
      {t:'Vegetable paella — artichoke, beans, sweet peppers', tags:['rice','veg','europe'], diet:'vegan'},
      {t:'Mushroom & smoked paprika paella', tags:['rice','smoky'], diet:'vegan', spice:1},
      {t:'Seafood paella — prawns, mussels, squid', tags:['rice','meat'], diet:'meat:seafood'},
      {t:'Chicken paella — saffron rice, tender chicken', tags:['rice','meat','classic'], diet:'meat:chicken'}
    ] },
  { id:'eur-13', deck:'europe', q:'Tapas crawl in Barcelona — which small plate lands first?', emoji:'🍢', img:'photo-1555396273-367ea4eb4db5', multi:false,
    diets:['everything','vegetarian','vegan','halal'],
    options:[
      {t:'Patatas bravas — crispy potatoes, fiery tomato sauce', tags:['street','spice'], diet:'vegan', spice:2},
      {t:'Garlic mushrooms sizzling in olive oil', tags:['street'], diet:'vegan'},
      {t:'Jamón & manchego board — cured ham and sheep cheese', tags:['meat','classic','europe'], diet:'meat:pork'},
      {t:'Grilled octopus with smoked paprika', tags:['meat','adventure','smoky'], diet:'meat:seafood', adv:2}
    ] },
  { id:'eur-14', deck:'europe', q:'A chilled soup on a scorching Spanish day — which bowl?', emoji:'🍅', img:'photo-1547592166-23ac45744acd', multi:false,
    diets:['everything','vegetarian','vegan','halal'],
    options:[
      {t:'Gazpacho — tomato, cucumber, pepper, ice-cold', tags:['fresh','healthy','europe'], diet:'vegan'},
      {t:'Salmorejo — the thicker, richer tomato cousin, no toppings', tags:['fresh'], diet:'vegan'},
      {t:'Ajo blanco — chilled almond & garlic soup with grapes', tags:['fresh','adventure'], diet:'vegan', adv:1},
      {t:'Watermelon gazpacho — sweet, sharp, ultra-refreshing', tags:['fresh','tangy'], diet:'vegan', sweet:1}
    ] },
  { id:'eur-15', deck:'europe', q:'Churros time in Madrid — how do you take them?', emoji:'🍩', img:'photo-1551024601-bec78aea704b', multi:false,
    diets:['everything','vegetarian','vegan','halal'],
    options:[
      {t:'Dipped in thick dairy hot chocolate', tags:['sweet','cafe'], diet:'veg', sweet:3},
      {t:'Dipped in dark vegan chocolate', tags:['sweet','cafe'], diet:'vegan', sweet:3},
      {t:'With dulce de leche — caramelised milk heaven', tags:['sweet','creamy'], diet:'veg', sweet:3},
      {t:'Straight up, rolled in cinnamon sugar', tags:['sweet','street'], diet:'vegan', sweet:2}
    ] },
  { id:'eur-16', deck:'europe', q:'Greek taverna starters — which plate opens the feast?', emoji:'🥗', img:'photo-1512621776951-a57141f2eefd', multi:false,
    diets:['everything','vegetarian','vegan','halal'],
    options:[
      {t:'Greek salad, no feta — cucumber, tomato, olives, oregano, olive oil', tags:['fresh','healthy','europe'], diet:'vegan'},
      {t:'Marinated olives & fire-roasted peppers', tags:['fresh','tangy'], diet:'vegan'},
      {t:'Classic Greek salad with a slab of feta', tags:['fresh','classic'], diet:'veg'},
      {t:'Grilled halloumi salad with lemon & mint', tags:['fresh','tangy'], diet:'veg'}
    ] },
  { id:'eur-17', deck:'europe', q:'Greek grill night — what is on your skewer?', emoji:'🍢', img:'photo-1555939594-58d7cb561ad1', multi:false,
    diets:['everything','vegetarian','vegan','halal'],
    options:[
      {t:'Chicken souvlaki — lemon, oregano, charred edges', tags:['meat','street'], diet:'meat:chicken'},
      {t:'Pork souvlaki — smoky and juicy', tags:['meat','smoky','street'], diet:'meat:pork'},
      {t:'Grilled vegetable & halloumi skewers', tags:['veg','street'], diet:'veg'},
      {t:'Mushroom & pepper skewers with lemon-oregano oil', tags:['veg','street'], diet:'vegan'}
    ] },
  { id:'eur-18', deck:'europe', q:'Greek oven-baked comfort — which dish wins?', emoji:'🍆', img:'photo-1547592180-85f173990554', multi:false,
    diets:['everything','vegetarian','vegan','halal'],
    options:[
      {t:'Beef moussaka — aubergine layers under golden béchamel', tags:['meat','home','classic','europe'], diet:'meat:beef'},
      {t:'Lentil moussaka with plant-based béchamel', tags:['veg','home'], diet:'vegan'},
      {t:'Briam — Greek roasted vegetables in tomato & oregano', tags:['veg','home'], diet:'vegan'},
      {t:'Spanakopita — spinach & feta in crackly filo', tags:['veg','classic'], diet:'veg'}
    ] },
  { id:'eur-19', deck:'europe', q:'Mezze spread — which dip leads the table?', emoji:'🫓', img:'photo-1504674900247-0877df9cc836', multi:false,
    diets:['everything','vegetarian','vegan','halal'],
    options:[
      {t:'Hummus with warm pita and a paprika oil swirl', tags:['veg','classic'], diet:'vegan'},
      {t:'Melitzanosalata — smoky aubergine dip', tags:['veg','smoky'], diet:'vegan'},
      {t:'Tzatziki — cool yogurt, cucumber, dill', tags:['fresh','creamy'], diet:'veg'},
      {t:'Whipped feta with honey-free herb oil and chilli', tags:['creamy','tangy'], diet:'veg', spice:1}
    ] },
  { id:'eur-20', deck:'europe', q:'German beer-hall plate (minus the beer) — what is on it?', emoji:'🥨', img:'photo-1518013431117-eb1465fa5752', multi:false,
    diets:['everything','vegetarian','vegan','halal'],
    options:[
      {t:'Pork schnitzel — golden, crisp, lemon on the side', tags:['meat','classic','europe'], diet:'meat:pork'},
      {t:'Chicken schnitzel with herbed crumbs', tags:['meat'], diet:'meat:chicken'},
      {t:'Breaded portobello schnitzel, fully plant-based', tags:['veg'], diet:'vegan'},
      {t:'Giant soft pretzel with sharp mustard', tags:['street','classic'], diet:'vegan'}
    ] },
  { id:'eur-21', deck:'europe', q:'Bakery stop in Munich — pick your bake.', emoji:'🥖', img:'photo-1509440159596-0249088772ff', multi:false,
    diets:['everything','vegetarian','vegan','halal'],
    options:[
      {t:'Classic salted pretzel — chewy, malty, shiny crust', tags:['classic','home'], diet:'vegan'},
      {t:'Cinnamon-sugar pretzel bites', tags:['sweet'], diet:'vegan', sweet:2},
      {t:'Seeded rye roll — hearty and wholesome', tags:['healthy','home'], diet:'vegan'},
      {t:'Butter & cheese pretzel sandwich', tags:['cafe'], diet:'veg'}
    ] },
  { id:'eur-22', deck:'europe', q:'Vienna café dessert — which slice with your coffee?', emoji:'☕', img:'photo-1490474418585-ba9bad8fd0ea', multi:false,
    diets:['everything','vegetarian','vegan','halal'],
    options:[
      {t:'Apple strudel in crisp vegan pastry, warm from the oven', tags:['sweet','classic','europe'], diet:'vegan', sweet:3},
      {t:'Berry crumble with a golden oat topping', tags:['sweet','fresh'], diet:'vegan', sweet:2},
      {t:'Sachertorte — dark chocolate & apricot, the Viennese icon', tags:['sweet','coffee','classic'], diet:'veg', sweet:3},
      {t:'Linzer torte — hazelnut lattice over raspberry jam', tags:['sweet','tangy'], diet:'veg', sweet:2}
    ] },
  { id:'eur-23', deck:'europe', q:'British chip shop — what is wrapped in the paper?', emoji:'🍟', img:'photo-1518013431117-eb1465fa5752', multi:false,
    diets:['everything','vegetarian','vegan','halal'],
    options:[
      {t:'Battered cod & chips, salt and vinegar', tags:['meat','classic','street','europe'], diet:'meat:seafood'},
      {t:'Battered sausage & chips', tags:['meat','street'], diet:'meat:pork'},
      {t:'Banana blossom "fish" & chips — the plant-based cult favourite', tags:['veg','adventure'], diet:'vegan', adv:2},
      {t:'Chips with chip-shop curry sauce', tags:['street','spice'], diet:'vegan', spice:1}
    ] },
  { id:'eur-24', deck:'europe', q:'The great British breakfast — build your plate.', emoji:'🍳', img:'photo-1525351484163-7529414344d8', multi:false,
    diets:['everything','vegetarian','vegan','halal'],
    options:[
      {t:'The full works — eggs, bacon, sausage, beans, toast', tags:['meat','classic','home'], diet:'meat:pork'},
      {t:'Veggie full — eggs, veggie sausage, beans, mushrooms', tags:['veg','home'], diet:'veg'},
      {t:'Plant-based full — tofu scramble, vegan sausage, beans, grilled tomato', tags:['veg','home'], diet:'vegan'},
      {t:'Beans on toast with garlic mushrooms', tags:['veg','home'], diet:'vegan'}
    ] },
  { id:'eur-25', deck:'europe', q:'Pub pie night in Britain — which pie is yours?', emoji:'🥧', img:'photo-1556910103-1c02745aae4d', multi:false,
    diets:['everything','vegetarian','vegan','halal'],
    options:[
      {t:'Steak & ale pie — rich, dark, deeply savoury', tags:['meat','home','classic'], diet:'meat:beef'},
      {t:'Chicken & mushroom pie in flaky pastry', tags:['meat','home'], diet:'meat:chicken'},
      {t:'Roasted root vegetable & lentil pie', tags:['veg','home'], diet:'vegan'},
      {t:'Mushroom & spinach pie in vegan pastry', tags:['veg','home'], diet:'vegan'}
    ] },
  { id:'eur-26', deck:'europe', q:'Afternoon tea — which tier of the stand tempts you most?', emoji:'🫖', img:'photo-1544787219-7f47ccb76574', multi:false,
    diets:['everything','vegetarian','vegan','halal'],
    options:[
      {t:'Scones with clotted cream & strawberry jam', tags:['sweet','classic','chai','europe'], diet:'veg', sweet:2},
      {t:'Vegan scones with coconut cream & jam', tags:['sweet','chai'], diet:'vegan', sweet:2},
      {t:'Fresh fruit & berry tartlets in vegan pastry', tags:['sweet','fresh'], diet:'vegan', sweet:2},
      {t:'Cucumber finger sandwiches with butter', tags:['classic','fresh'], diet:'veg'}
    ] },
  { id:'eur-27', deck:'europe', q:'A plate of Polish pierogi — which filling?', emoji:'🥟', img:'photo-1496116218417-1a781b1c416', multi:false,
    diets:['everything','vegetarian','vegan','halal'],
    options:[
      {t:'Potato & cheese — the beloved ruskie', tags:['veg','home','classic','europe'], diet:'veg'},
      {t:'Mushroom & sauerkraut — earthy and tangy', tags:['veg','tangy'], diet:'vegan'},
      {t:'Spinach & garlic, no cheese', tags:['veg','healthy'], diet:'vegan'},
      {t:'Minced pork with caramelised onion', tags:['meat','home'], diet:'meat:pork'}
    ] },
  { id:'eur-28', deck:'europe', q:'Eastern European comfort bowls — which one tonight?', emoji:'🍲', img:'photo-1547592180-85f173990554', multi:false,
    diets:['everything','vegetarian','vegan','halal'],
    options:[
      {t:'Beef goulash — paprika-rich and slow-cooked', tags:['meat','home','smoky'], diet:'meat:beef', spice:1},
      {t:'Chicken paprikash — creamy paprika sauce', tags:['meat','creamy','home'], diet:'meat:chicken', spice:1},
      {t:'Vegan borscht — beet soup with beans, dill on top', tags:['veg','tangy'], diet:'vegan'},
      {t:'Mushroom & barley soup — humble and hearty', tags:['veg','home'], diet:'vegan'}
    ] },
  { id:'eur-29', deck:'europe', q:'Scandinavian table — smörgåsbord or fika (coffee break)? Pick a plate.', emoji:'🐟', img:'photo-1467003909585-2f8a72700288', multi:false,
    diets:['everything','vegetarian','vegan','halal'],
    options:[
      {t:'Gravlax — dill-cured salmon on crispbread', tags:['meat','adventure','europe'], diet:'meat:seafood', adv:1},
      {t:'Classic cinnamon bun — cardamom-kissed, pearl sugar on top', tags:['sweet','coffee','cafe'], diet:'veg', sweet:3},
      {t:'Plant-based cinnamon bun — same swirl, no dairy', tags:['sweet','coffee'], diet:'vegan', sweet:3},
      {t:'New potatoes with dill & pickled cucumber', tags:['fresh','tangy','healthy'], diet:'vegan'}
    ] },
  { id:'eur-30', deck:'europe', q:'Lisbon flavours — which Portuguese plate?', emoji:'🇵🇹', img:'photo-1562967914-608f82629710', multi:false,
    diets:['everything','vegetarian','vegan','halal'],
    options:[
      {t:'Pastéis de nata — the iconic warm custard tart', tags:['sweet','classic','europe'], diet:'veg', sweet:3},
      {t:'Plant-based custard tart — golden, cinnamon-dusted', tags:['sweet'], diet:'vegan', sweet:3},
      {t:'Bacalhau — salt cod, potatoes, olives, egg-free style', tags:['meat','classic'], diet:'meat:seafood'},
      {t:'Peri peri chicken — flame-grilled, chilli-fired', tags:['meat','spice'], diet:'meat:chicken', spice:3},
      {t:'Caldo verde — kale & potato soup, no sausage', tags:['veg','home','healthy'], diet:'vegan'}
    ] }
];

/* ——— deck: global.js ——— */
// Diving into Buds — question bank: global + bridge decks.
// diet per option: 'vegan' | 'veg' | 'meat:chicken'|'meat:beef'|'meat:pork'|'meat:lamb'|'meat:seafood'|'meat:other' | 'alcohol'
// spice / sweet / adv are 0–3 where meaningful. multi:false everywhere (single-pick decks).

const DECK_GLOBAL = [
  { id:'glo-01', deck:'global', q:'Breakfast identity: the sun is up — what lands on your plate?', emoji:'🍳', img:'photo-1525351484163-7529414344d8', multi:false,
    diets:['everything','vegetarian','vegan','halal'],
    options:[
      {t:'Crispy dosa with coconut chutney and sambar', tags:['street','asia','spice'], diet:'vegan', spice:1},
      {t:'Stack of pancakes under a maple syrup waterfall', tags:['sweet','classic','americas'], diet:'veg', sweet:2},
      {t:'Eggs any style, buttered toast, zero regrets', tags:['home','classic'], diet:'veg'},
      {t:'Berry smoothie bowl, cold and bright', tags:['healthy','fresh','sweet'], diet:'vegan', sweet:1}
    ]},
  { id:'glo-02', deck:'global', q:'Coffee or tea — where does your loyalty truly live?', emoji:'☕', img:'photo-1544787219-7f47ccb76574', multi:false,
    diets:['everything','vegetarian','vegan','halal'],
    options:[
      {t:'Strong black coffee, no small talk before it', tags:['coffee'], diet:'vegan'},
      {t:'Masala chai, milky and spiced', tags:['chai','deccan','spice'], diet:'veg', spice:1},
      {t:'Green tea, calm and clean', tags:['chai','healthy','asia'], diet:'vegan'},
      {t:'Hot chocolate with a marshmallow raft', tags:['sweet','cafe'], diet:'veg', sweet:2}
    ]},
  { id:'glo-03', deck:'global', q:'What is your spice philosophy?', emoji:'🌶️', img:'photo-1596040033229-a9821ebd058d', multi:false,
    diets:['everything','vegetarian','vegan','halal'],
    options:[
      {t:'Bring the fire — if I am not sweating, send it back', tags:['spice','adventure'], diet:'vegan', spice:3, adv:2},
      {t:'A warm glow that builds, never bullies', tags:['spice'], diet:'vegan', spice:2},
      {t:'Flavour first — heat is just one instrument', tags:['mild','classic'], diet:'vegan', spice:1},
      {t:'Black pepper is adventurous enough, thanks', tags:['mild'], diet:'vegan', spice:0}
    ]},
  { id:'glo-04', deck:'global', q:'Texture wars: crispy and crunchy, or saucy and spoonable?', emoji:'🍟', img:'photo-1518013431117-eb1465fa5752', multi:false,
    diets:['everything','vegetarian','vegan','halal'],
    options:[
      {t:'Golden fries with a crunch you can hear', tags:['street','classic'], diet:'vegan'},
      {t:'Pasta drowned in rich tomato sauce', tags:['noodle','europe','home'], diet:'vegan'},
      {t:'A salad with serious snap and crackle', tags:['fresh','healthy','veg'], diet:'vegan'},
      {t:'Sticky glazed ribs, sauce on every finger', tags:['meat','smoky','americas'], diet:'meat:pork'}
    ]},
  { id:'glo-05', deck:'global', q:'How deep does the sweet tooth go?', emoji:'🍦', img:'photo-1563805042-7684c019e1cb', multi:false,
    diets:['everything','vegetarian','vegan','halal'],
    options:[
      {t:'Chocolate cake, the darker the better', tags:['sweet','cafe'], diet:'veg', sweet:3},
      {t:'Ice cream sundae with all the toppings', tags:['sweet','classic'], diet:'veg', sweet:3},
      {t:'A bowl of fresh fruit and I am happy', tags:['sweet','fresh','healthy'], diet:'vegan', sweet:1},
      {t:'Fruit sorbet — sweet but sharp', tags:['sweet','tangy','fresh'], diet:'vegan', sweet:2}
    ]},
  { id:'glo-06', deck:'global', q:'Street food chaos or fine-dining calm?', emoji:'🍢', img:'photo-1414235077428-338989a2e8c0', multi:false,
    diets:['everything','vegetarian','vegan','halal'],
    options:[
      {t:'A legendary street stall with a queue down the road', tags:['street','adventure'], diet:'vegan', adv:2},
      {t:'White tablecloths and a tasting menu', tags:['cafe','classic'], diet:'veg'},
      {t:'A buzzing night market, grazing stall to stall', tags:['street','adventure','asia'], diet:'vegan', adv:2},
      {t:'A tiny family-run place where the owner cooks', tags:['home','classic'], diet:'veg'}
    ]},
  { id:'glo-07', deck:'global', q:'What is your role in the home kitchen?', emoji:'🏠', img:'photo-1556910103-1c02745aae4d', multi:false,
    diets:['everything','vegetarian','vegan','halal'],
    options:[
      {t:'Head chef — the kitchen is my kingdom', tags:['home'], diet:'vegan'},
      {t:'Weekend cook, slow and happy', tags:['home','classic'], diet:'vegan'},
      {t:'Chief taste-tester, proudly unskilled', tags:['home','mild'], diet:'vegan'},
      {t:'Takeout loyalist — my stove is decorative', tags:['street'], diet:'vegan'}
    ]},
  { id:'glo-08', deck:'global', q:'It is midnight. The fridge light comes on. You reach for…', emoji:'🌙', img:'photo-1551024601-bec78aea704b', multi:false,
    diets:['everything','vegetarian','vegan','halal'],
    options:[
      {t:'A cold slice of leftover pizza', tags:['classic','noodle'], diet:'veg'},
      {t:'Instant noodles, eaten standing up', tags:['noodle','home','asia'], diet:'vegan'},
      {t:'A handful of nuts and dark chocolate', tags:['sweet','healthy'], diet:'vegan', sweet:1},
      {t:'Ice cream, straight from the tub', tags:['sweet'], diet:'veg', sweet:2}
    ]},
  { id:'glo-09', deck:'global', q:'Comfort food: what hug-in-a-bowl do you trust most?', emoji:'🍲', img:'photo-1547592180-85f173990554', multi:false,
    diets:['everything','vegetarian','vegan','halal'],
    options:[
      {t:'Dal and rice, soft and soothing', tags:['home','rice','mild','asia'], diet:'vegan'},
      {t:'A hearty vegetable stew with crusty bread', tags:['home','veg','europe'], diet:'vegan'},
      {t:'Chicken soup, the universal medicine', tags:['home','meat','classic'], diet:'meat:chicken'},
      {t:'Mac and cheese, unapologetically gooey', tags:['creamy','classic','americas'], diet:'veg'}
    ]},
  { id:'glo-10', deck:'global', q:'Salad honesty hour: how do you really feel?', emoji:'🥗', img:'photo-1512621776951-a57141f2eefd', multi:false,
    diets:['everything','vegetarian','vegan','halal'],
    options:[
      {t:'A giant salad IS the meal, and a great one', tags:['healthy','fresh','veg'], diet:'vegan'},
      {t:'Salad is a loyal sidekick, never the hero', tags:['healthy','fresh'], diet:'vegan'},
      {t:'Only if the dressing does the heavy lifting', tags:['creamy','veg'], diet:'vegan'},
      {t:'Salad is what my food eats', tags:['meat','classic'], diet:'vegan'}
    ]},
  { id:'glo-11', deck:'global', q:'Soup season: which bowl warms you best?', emoji:'🍜', img:'photo-1547592166-23ac45744acd', multi:false,
    diets:['everything','vegetarian','vegan','halal'],
    options:[
      {t:'Roasted tomato soup, bright and simple', tags:['home','tangy','veg'], diet:'vegan'},
      {t:'Beef pho, fragrant with star anise', tags:['noodle','asia','meat'], diet:'meat:beef', spice:1},
      {t:'Rich pork ramen, broth for days', tags:['noodle','asia','meat'], diet:'meat:pork'},
      {t:'Red lentil soup with a squeeze of lemon', tags:['healthy','tangy','home'], diet:'vegan'}
    ]},
  { id:'glo-12', deck:'global', q:'Sandwich style: build your champion.', emoji:'🥪', img:'photo-1528735602780-2552fd46c7af', multi:false,
    diets:['everything','vegetarian','vegan','halal'],
    options:[
      {t:'Grilled cheese with a perfect pull', tags:['creamy','classic'], diet:'veg'},
      {t:'Roasted veg and hummus on thick sourdough', tags:['veg','fresh','healthy'], diet:'vegan'},
      {t:'Chicken club, triple-decker, no shortcuts', tags:['meat','classic'], diet:'meat:chicken'},
      {t:'Crispy falafel wrap with tahini drizzle', tags:['veg','street','tangy'], diet:'vegan'}
    ]},
  { id:'glo-13', deck:'global', q:'Bread loyalty: pick your forever bread.', emoji:'🍞', img:'photo-1509440159596-0249088772ff', multi:false,
    diets:['everything','vegetarian','vegan','halal'],
    options:[
      {t:'Tangy sourdough with a crackling crust', tags:['tangy','home','europe'], diet:'vegan'},
      {t:'Pillow-soft naan, blistered from the tandoor', tags:['deccan','asia'], diet:'veg'},
      {t:'Flaky butter croissant', tags:['cafe','europe','sweet'], diet:'veg', sweet:1},
      {t:'Warm corn tortillas, straight off the pan', tags:['americas','street'], diet:'vegan'}
    ]},
  { id:'glo-14', deck:'global', q:'Cheese depth: how far down the cheese rabbit hole are you?', emoji:'🧀', img:'photo-1486297678162-eb2a19b0a32d', multi:false,
    diets:['everything','vegetarian','vegan','halal'],
    options:[
      {t:'Soft brie with grapes and crackers', tags:['creamy','europe','cafe'], diet:'veg'},
      {t:'Aged cheddar with a serious bite', tags:['tangy','classic','europe'], diet:'veg'},
      {t:'Cashew cheese — plant-based and proud', tags:['veg','adventure','healthy'], diet:'vegan', adv:2},
      {t:'Smoky vegan queso dip for everything', tags:['veg','smoky','americas'], diet:'vegan', adv:1}
    ]},
  { id:'glo-15', deck:'global', q:'Fruit finish: the meal ends — which fruit closes it?', emoji:'🍓', img:'photo-1490474418585-ba9bad8fd0ea', multi:false,
    diets:['everything','vegetarian','vegan','halal'],
    options:[
      {t:'Alphonso mango, eaten over the sink', tags:['sweet','fresh','deccan'], diet:'vegan', sweet:2},
      {t:'A tumble of berries, still cold', tags:['sweet','tangy','fresh'], diet:'vegan', sweet:1},
      {t:'Citrus segments, sharp and cleansing', tags:['tangy','fresh'], diet:'vegan'},
      {t:'Watermelon with a pinch of salt', tags:['fresh','sweet'], diet:'vegan', sweet:1}
    ]},
  { id:'glo-16', deck:'global', q:'Snack personality: what is always within arm\u2019s reach?', emoji:'🍿', img:'photo-1601050690597-df0568f70950', multi:false,
    diets:['everything','vegetarian','vegan','halal'],
    options:[
      {t:'A hot samosa, tamarind chutney mandatory', tags:['street','spice','deccan'], diet:'vegan', spice:1},
      {t:'Roasted spiced chickpeas, endlessly crunchable', tags:['healthy','spice','veg'], diet:'vegan', spice:1},
      {t:'Cheese and crackers, a tiny board for one', tags:['creamy','cafe'], diet:'veg'},
      {t:'Buttered popcorn, movie or not', tags:['classic','home'], diet:'vegan'}
    ]},
  { id:'glo-17', deck:'global', q:'Eating pace: be honest, how fast does food disappear around you?', emoji:'⏱️', img:'photo-1490645935967-10de6ba17061', multi:false,
    diets:['everything','vegetarian','vegan','halal'],
    options:[
      {t:'Gone in minutes — I inhale, therefore I am', tags:['classic'], diet:'vegan'},
      {t:'Slow savourer, last one at every table', tags:['mild','home'], diet:'vegan'},
      {t:'Grazer — small plates all day long', tags:['fresh','healthy'], diet:'vegan'},
      {t:'One hand eating, one hand scrolling', tags:['street'], diet:'vegan'}
    ]},
  { id:'glo-18', deck:'global', q:'Festival food: the fair is on — what are you queueing for?', emoji:'🎪', img:'photo-1555244162-803834f70033', multi:false,
    diets:['everything','vegetarian','vegan','halal'],
    options:[
      {t:'Loaded fries from the loudest stall', tags:['street','classic'], diet:'vegan'},
      {t:'Charcoal-grilled corn with chilli and lime', tags:['street','smoky','spice'], diet:'vegan', spice:1},
      {t:'Something sweet, sticky and deep-fried', tags:['sweet','street'], diet:'veg', sweet:2},
      {t:'Chicken skewers straight off the coals', tags:['meat','smoky','street'], diet:'meat:chicken'}
    ]},
  { id:'glo-19', deck:'global', q:'Leftovers stance: yesterday\u2019s dinner, today\u2019s opinion?', emoji:'🍱', img:'photo-1512058564366-18510be2db19', multi:false,
    diets:['everything','vegetarian','vegan','halal'],
    options:[
      {t:'Leftovers are a gift — some dishes improve overnight', tags:['home','classic'], diet:'vegan'},
      {t:'Only if I can remix them into something new', tags:['adventure','home'], diet:'vegan', adv:1},
      {t:'Pizza and biryani only — the elite exceptions', tags:['rice','biryani'], diet:'vegan'},
      {t:'Fresh or nothing, I do not look back', tags:['fresh'], diet:'vegan'}
    ]},
  { id:'glo-20', deck:'global', q:'Cooking confidence: your honest kitchen level?', emoji:'👨‍🍳', img:'photo-1504674900247-0877df9cc836', multi:false,
    diets:['everything','vegetarian','vegan','halal'],
    options:[
      {t:'Recipe follower, measurements exact', tags:['home','mild'], diet:'vegan'},
      {t:'Improviser — a little of this, taste, adjust', tags:['home','adventure'], diet:'vegan', adv:1},
      {t:'I have one signature dish and it carries me', tags:['home','classic'], diet:'vegan'},
      {t:'I can burn water, but I order brilliantly', tags:['street'], diet:'vegan'}
    ]},
  { id:'glo-21', deck:'global', q:'Dream food destination: one flight, purely to eat. Where to?', emoji:'✈️', img:'photo-1579871494447-9811cf80d66c', multi:false,
    diets:['everything','vegetarian','vegan','halal'],
    options:[
      {t:'Tokyo — sushi counters and ramen alleys', tags:['asia','meat','adventure'], diet:'meat:seafood', adv:2},
      {t:'Naples — pizza where pizza was born', tags:['europe','classic','noodle'], diet:'veg'},
      {t:'Bangkok — tofu pad thai from a wok on fire', tags:['asia','noodle','street','spice'], diet:'vegan', spice:2, adv:1},
      {t:'Marrakech — slow vegetable tagines and mint tea', tags:['asia','home','spice'], diet:'vegan', spice:1, adv:1}
    ]},
  { id:'glo-22', deck:'global', q:'Sauce loyalty: one bottle stays on your table forever.', emoji:'🧂', img:'photo-1518013431117-eb1465fa5752', multi:false,
    diets:['everything','vegetarian','vegan','halal'],
    options:[
      {t:'Hot sauce — it goes on everything, yes, everything', tags:['spice'], diet:'vegan', spice:2},
      {t:'Ketchup, the undefeated classic', tags:['classic','sweet','tangy'], diet:'vegan', sweet:1},
      {t:'Mayo, creamy and essential', tags:['creamy'], diet:'veg'},
      {t:'Smoky BBQ sauce, summer in a bottle', tags:['smoky','sweet','americas'], diet:'vegan', sweet:1}
    ]},
  { id:'glo-23', deck:'global', q:'Crunch factor: pick your loudest bite.', emoji:'🌮', img:'photo-1565299585323-38d6b0865b47', multi:false,
    diets:['everything','vegetarian','vegan','halal'],
    options:[
      {t:'Crunchy tacos loaded with slaw and salsa', tags:['americas','street','tangy'], diet:'vegan'},
      {t:'Fried chicken with a shattering crust', tags:['meat','americas','classic'], diet:'meat:chicken'},
      {t:'Vegetable tempura, light as air', tags:['asia','veg','fresh'], diet:'vegan'},
      {t:'Peanut and cucumber salad, crunch on crunch', tags:['asia','fresh','healthy'], diet:'vegan'}
    ]},
  { id:'glo-24', deck:'global', q:'Dream last meal: the table is yours — what is on it?', emoji:'🌟', img:'photo-1563379091339-03b21ab4a4f8', multi:false,
    diets:['everything','vegetarian','vegan','halal'],
    options:[
      {t:'Chicken dum biryani, sealed and steaming', tags:['biryani','rice','deccan','meat'], diet:'meat:chicken', spice:2},
      {t:'A sushi platter from a master\u2019s hand', tags:['asia','meat','fresh'], diet:'meat:seafood', adv:1},
      {t:'Vegetable dum biryani with mirchi ka salan', tags:['biryani','rice','deccan','spice'], diet:'vegan', spice:2},
      {t:'Wood-fired pizza with garden vegetables', tags:['europe','veg','classic'], diet:'vegan'}
    ]}
];

const DECK_BRIDGE = [
  { id:'bri-01', deck:'bridge', q:'If dum biryani is home, its slow-cooked cousins are waiting abroad. Which one calls you?', emoji:'🍚', img:'photo-1534080564583-6be75777b70a', multi:false,
    diets:['everything','vegetarian','vegan','halal'],
    options:[
      {t:'Paella — saffron rice with seafood, from Spain', tags:['rice','europe','meat'], diet:'meat:seafood'},
      {t:'Jambalaya — Louisiana\u2019s smoky one-pot rice', tags:['rice','americas','smoky','spice'], diet:'meat:other', spice:2},
      {t:'Tahdig — Persian saffron rice with a golden crust', tags:['rice','asia','classic'], diet:'vegan'},
      {t:'Clay-pot mushroom rice, earthy and deep', tags:['rice','asia','home'], diet:'vegan'}
    ]},
  { id:'bri-02', deck:'bridge', q:'Every culture hides joy inside dough. Pick your parcel.', emoji:'🥟', img:'photo-1496116218417-1a781b1c416', multi:false,
    diets:['everything','vegetarian','vegan','halal'],
    options:[
      {t:'Vegetable momos with fiery tomato-sesame chutney', tags:['asia','street','spice'], diet:'vegan', spice:2},
      {t:'Pork gyoza, crisp-bottomed and juicy', tags:['asia','meat'], diet:'meat:pork'},
      {t:'Ricotta ravioli in sage butter', tags:['europe','noodle','creamy'], diet:'veg'},
      {t:'Cabbage and mushroom pierogi, pan-fried golden', tags:['europe','home','veg'], diet:'vegan'}
    ]},
  { id:'bri-03', deck:'bridge', q:'Fire, skewers, smoke — the world\u2019s oldest recipe. Choose your stick.', emoji:'🍢', img:'photo-1555939594-58d7cb561ad1', multi:false,
    diets:['everything','vegetarian','vegan','halal'],
    options:[
      {t:'Chicken satay with peanut sauce, Thai-style', tags:['asia','meat','creamy','street'], diet:'meat:chicken', spice:1},
      {t:'Lamb seekh kebab, straight from the tandoor', tags:['deccan','meat','smoky','spice'], diet:'meat:lamb', spice:2},
      {t:'Mushroom and pepper skewers, charred edges', tags:['veg','smoky','street'], diet:'vegan'},
      {t:'Tofu skewers with a chilli-glaze shine', tags:['asia','veg','spice'], diet:'vegan', spice:2}
    ]},
  { id:'bri-04', deck:'bridge', q:'Noodle worlds collide. Which bowl do you cross the map for?', emoji:'🍜', img:'photo-1557872943-16a5ac26437e', multi:false,
    diets:['everything','vegetarian','vegan','halal'],
    options:[
      {t:'Tonkotsu ramen — broth that took all day', tags:['asia','noodle','meat'], diet:'meat:pork'},
      {t:'Beef pho, clear broth and fresh herbs', tags:['asia','noodle','meat','fresh'], diet:'meat:beef', spice:1},
      {t:'Spaghetti aglio e olio — garlic, oil, chilli, done', tags:['europe','noodle','spice'], diet:'vegan', spice:1},
      {t:'Tofu pad thai, tamarind-tangy and sweet', tags:['asia','noodle','tangy','sweet'], diet:'vegan', sweet:1, spice:1}
    ]},
  { id:'bri-05', deck:'bridge', q:'Flatbread diplomacy: every table on Earth has one. Yours?', emoji:'🫓', img:'photo-1509440159596-0249088772ff', multi:false,
    diets:['everything','vegetarian','vegan','halal'],
    options:[
      {t:'Naan — blistered, buttery-soft, made for scooping', tags:['deccan','asia','home'], diet:'vegan'},
      {t:'Pita — the pocket that holds a whole lunch', tags:['europe','fresh'], diet:'vegan'},
      {t:'Tortilla — wraps tacos, burritos and mornings', tags:['americas','street'], diet:'vegan'},
      {t:'Lavash — thin, soft, rolled around herbs and cheese-herb fillings', tags:['asia','fresh'], diet:'vegan'}
    ]},
  { id:'bri-06', deck:'bridge', q:'Tea and coffee cultures: which ritual feels like yours?', emoji:'🫖', img:'photo-1509042239860-f550ce710b93', multi:false,
    diets:['everything','vegetarian','vegan','halal'],
    options:[
      {t:'Masala chai on a rainy evening, Hyderabadi-style', tags:['chai','deccan','spice'], diet:'veg', spice:1},
      {t:'Turkish coffee, thick and unhurried', tags:['coffee','europe'], diet:'vegan'},
      {t:'Matcha, whisked to a green foam', tags:['chai','asia','healthy'], diet:'vegan'},
      {t:'A tiny Italian espresso, standing at the bar', tags:['coffee','europe','cafe'], diet:'vegan'}
    ]},
  { id:'bri-07', deck:'bridge', q:'Chilli cultures: every region burns differently. Pick your fire.', emoji:'🌶️', img:'photo-1596040033229-a9821ebd058d', multi:false,
    diets:['everything','vegetarian','vegan','halal'],
    options:[
      {t:'Sichuan — the famous tingle of mala peppercorns', tags:['asia','spice','adventure'], diet:'vegan', spice:3, adv:2},
      {t:'Mexican salsa roja, roasted and smoky', tags:['americas','spice','smoky'], diet:'vegan', spice:2},
      {t:'Goan pork vindaloo, vinegar-sharp and fearless', tags:['asia','spice','meat','tangy'], diet:'meat:pork', spice:3},
      {t:'Thai green curry with tofu, coconut-cooled fire', tags:['asia','spice','creamy'], diet:'vegan', spice:2}
    ]},
  { id:'bri-08', deck:'bridge', q:'Street-market snacks: the stall is sizzling. What is in your hand?', emoji:'🧆', img:'photo-1626132647523-66f5bf380027', multi:false,
    diets:['everything','vegetarian','vegan','halal'],
    options:[
      {t:'Pani puri — one crisp shell, one spicy flood', tags:['deccan','street','tangy','spice'], diet:'vegan', spice:2},
      {t:'Elote — grilled corn with mayo, cheese and chilli', tags:['americas','street','creamy','spice'], diet:'veg', spice:1},
      {t:'Takoyaki — molten octopus balls, bonito dancing', tags:['asia','street','meat','adventure'], diet:'meat:seafood', adv:2},
      {t:'Samosa chaat, smashed and loaded with chutneys', tags:['asia','street','tangy'], diet:'vegan', spice:1}
    ]},
  { id:'bri-09', deck:'bridge', q:'Soup worlds: four bowls, four continents of comfort.', emoji:'🍲', img:'photo-1582878826629-1930a9b76f5c', multi:false,
    diets:['everything','vegetarian','vegan','halal'],
    options:[
      {t:'Pho bo — Vietnam\u2019s star-anise beef broth', tags:['asia','meat','noodle'], diet:'meat:beef', spice:1},
      {t:'French onion soup under a cheese crust', tags:['europe','creamy','classic'], diet:'veg'},
      {t:'Miso soup — quiet, savoury, restorative', tags:['asia','healthy','mild'], diet:'vegan'},
      {t:'Gazpacho — Spain\u2019s cold tomato sunshine', tags:['europe','tangy','fresh'], diet:'vegan'}
    ]},
  { id:'bri-10', deck:'bridge', q:'Fermented flavours: funk is a feature. How funky do you go?', emoji:'🥒', img:'', multi:false,
    diets:['everything','vegetarian','vegan','halal'],
    options:[
      {t:'Kimchi — Korea\u2019s fiery fermented crunch', tags:['asia','spice','tangy','adventure'], diet:'vegan', spice:2, adv:2},
      {t:'Sauerkraut — German tang on everything', tags:['europe','tangy'], diet:'vegan'},
      {t:'Dill pickles, deli-style and snappy', tags:['americas','tangy','fresh'], diet:'vegan'},
      {t:'Pickled mango, sharp enough to wake you up', tags:['deccan','tangy','spice'], diet:'vegan', spice:1}
    ]},
  { id:'bri-11', deck:'bridge', q:'Dessert diplomacy: which sweet ends the summit?', emoji:'🍮', img:'photo-1488477181946-6428a0291777', multi:false,
    diets:['everything','vegetarian','vegan','halal'],
    options:[
      {t:'Gulab jamun, warm and soaked in syrup', tags:['deccan','sweet'], diet:'veg', sweet:3},
      {t:'Tiramisu — coffee, cream, cocoa dust', tags:['europe','sweet','coffee','creamy'], diet:'veg', sweet:2},
      {t:'Mango sticky rice with coconut cream', tags:['asia','sweet','rice'], diet:'vegan', sweet:2},
      {t:'Poached pears with a sharp fruit sorbet', tags:['europe','sweet','fresh','tangy'], diet:'vegan', sweet:1}
    ]},
  { id:'bri-12', deck:'bridge', q:'Breakfast worlds: four mornings, four time zones.', emoji:'🥐', img:'photo-1555507036-94f33f82cd6e', multi:false,
    diets:['everything','vegetarian','vegan','halal'],
    options:[
      {t:'Full English — eggs, beans, bacon, the works', tags:['europe','meat','classic'], diet:'meat:pork'},
      {t:'Croissant and jam at a Paris café', tags:['europe','cafe','sweet'], diet:'veg', sweet:1},
      {t:'Japanese tofu and miso breakfast set', tags:['asia','healthy','mild'], diet:'vegan'},
      {t:'Avocado toast with spiced beans, LA-style', tags:['americas','fresh','healthy'], diet:'vegan'}
    ]},
  { id:'bri-13', deck:'bridge', q:'Wrap worlds: great ideas, rolled. Take one.', emoji:'🌯', img:'photo-1566740933430-b5e70b06d2d5', multi:false,
    diets:['everything','vegetarian','vegan','halal'],
    options:[
      {t:'Beef burrito, rice and beans tucked tight', tags:['americas','meat','rice'], diet:'meat:beef'},
      {t:'Falafel wrap with pickles and tahini', tags:['asia','veg','street','tangy'], diet:'vegan'},
      {t:'Chicken kathi roll, flaky paratha embrace', tags:['deccan','meat','street'], diet:'meat:chicken', spice:1},
      {t:'Fresh spring rolls, herbs and crunch in rice paper', tags:['asia','fresh','healthy','veg'], diet:'vegan'}
    ]},
  { id:'bri-14', deck:'bridge', q:'Curry cousins: one family, many passports. Who is your favourite relative?', emoji:'🍛', img:'photo-1585937421612-70a008356fbe', multi:false,
    diets:['everything','vegetarian','vegan','halal'],
    options:[
      {t:'Thai green curry with chicken and basil', tags:['asia','spice','creamy','meat'], diet:'meat:chicken', spice:2},
      {t:'Japanese vegetable curry over sticky rice', tags:['asia','rice','mild','veg'], diet:'vegan'},
      {t:'Goan fish curry, kokum-sour and coconut-rich', tags:['deccan','tangy','meat','spice'], diet:'meat:seafood', spice:2},
      {t:'Chana masala, chickpeas in tomato-ginger gravy', tags:['asia','spice','home','veg'], diet:'vegan', spice:1}
    ]},
  { id:'bri-15', deck:'bridge', q:'Cheese and cultured dairy: the tangy hall of fame.', emoji:'🧀', img:'photo-1486297678162-eb2a19b0a32d', multi:false,
    diets:['everything','vegetarian','halal'],
    options:[
      {t:'Paneer, fresh and squeaky, in a spiced curry', tags:['deccan','creamy','spice'], diet:'veg', spice:1},
      {t:'Halloumi, grilled until it squeaks and browns', tags:['europe','tangy'], diet:'veg'},
      {t:'Burrata, torn open over tomatoes', tags:['europe','creamy','fresh'], diet:'veg'},
      {t:'Chilled raita, cucumber-cool beside a biryani', tags:['deccan','mild','creamy'], diet:'veg'}
    ]},
  { id:'bri-16', deck:'bridge', q:'Night-market energy: the lights are on, the woks are loud. Where do you drift?', emoji:'🌃', img:'photo-1555396273-367ea4eb4db5', multi:false,
    diets:['everything','vegetarian','vegan','halal'],
    options:[
      {t:'Taipei — grilled squid and pepper buns', tags:['asia','street','meat','adventure'], diet:'meat:seafood', adv:2},
      {t:'Mexico City — tacos al pastor carved off the trompo', tags:['americas','street','meat','smoky'], diet:'meat:pork'},
      {t:'Bangkok — banana fritters and coconut ice cream stalls', tags:['asia','street','sweet'], diet:'vegan', sweet:1},
      {t:'Vienna — roasted chestnuts and hot corn carts', tags:['europe','street','smoky'], diet:'vegan'}
    ]}
];

/* ——— assembled bank ——— */
const QBANK = [...DECK_OPENER, ...DECK_HYDERABAD, ...DECK_ASIA, ...DECK_AMERICAS, ...DECK_EUROPE, ...DECK_GLOBAL, ...DECK_BRIDGE];
const QBANK_BY_ID = {};
QBANK.forEach(q => { QBANK_BY_ID[q.id] = q; });
const DECK_LABELS = {
  opener: "🍽️ Warm-up", hyderabad: "🏰 Hyderabad roots", asia: "🥢 Asia",
  americas: "🌮 The Americas", europe: "🥐 Europe", global: "🌍 Around the world", bridge: "✨ New flavours"
};
const DECK_SUBS = {
  opener: "First, the fundamentals of your palate", hyderabad: "From the Deccan, with love",
  asia: "East, South & Southeast", americas: "North, Central & South",
  europe: "The old continent, deliciously", global: "Everywhere & nowhere",
  bridge: "Familiar loves, new addresses"
};
function imgUrlFor(q) {
  return q && q.img ? `https://images.unsplash.com/${q.img}?q=80&w=1200&auto=format&fit=crop` : "";
}
