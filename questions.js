// Diving into Buds — 50-question taste profile
// Part 1 (1–15): Hyderabad, in an authentic Hyderabadi voice.
// Part 2 (16–25): Pan-India.  Part 3 (26–50): The rest of the world.
// Each option carries flavour tags and 0–3 scores for the spice / sweet /
// adventure meters. Answers also carry a 1–5 confidence weight (the slider),
// which multiplies everything an option contributes to the profile.
const U = (id) => `https://images.unsplash.com/${id}?q=80&w=1200&auto=format&fit=crop`;

const SECTIONS = [
  { name: "Hyderabad roots", sub: "Part 1 of 3 · the Deccan dozen-and-three" },
  { name: "Pan-India", sub: "Part 2 of 3 · one country, a thousand kitchens" },
  { name: "Around the world", sub: "Part 3 of 3 · everywhere your cravings live" }
];
const sectionOf = (i) => (i < 15 ? 0 : i < 25 ? 1 : 2);

const QUESTIONS = [
  // ————— PART 1 · HYDERABAD —————
  { q: "Pehla sawal, seedha dil se — tumhari biryani kaunsi? (First things first — which biryani is yours?)", emoji: "🍛", img: U("photo-1563379091339-03b21ab4a4f8"),
    options: [
      { t: "Chicken dum biryani — the people's champion", tags: ["biryani", "deccan", "meat"] },
      { t: "Mutton dum biryani — slow, rich, royal", tags: ["biryani", "deccan", "meat"] },
      { t: "Veg biryani — haan, hoti hai. Ladna nakko.", tags: ["biryani", "deccan", "veg"] },
      { t: "Sab chalta, miya — bas biryani hona", tags: ["biryani", "deccan", "adventure"], adv: 2 } ] },
  { q: "Biryani plate mein aayi. Pehla kaam kya?", emoji: "🍽️", img: U("photo-1589302168068-964664d93dc0"),
    options: [
      { t: "Mirchi ka salan + raita, full set-up", tags: ["deccan"], spice: 2 },
      { t: "Sirf dahi ki chutney, bas", tags: ["deccan", "mild"], spice: 1 },
      { t: "Kuch nakko — biryani akeli raani hai", tags: ["biryani", "classic"] },
      { t: "Double masala, upar se mirchi extra", tags: ["spice", "deccan"], spice: 3 } ] },
  { q: "Sheher ki sabse badi behes — best biryani kahan ki?", emoji: "🏆", img: U("photo-1631515243349-e0cb75fb8d3a"),
    options: [
      { t: "Paradise — naam hi kaafi hai", tags: ["deccan", "classic"] },
      { t: "Shadab — Old City ka asli swaad", tags: ["deccan", "street"] },
      { t: "Bawarchi, RTC X Roads wali", tags: ["deccan"] },
      { t: "Ammi ke haath ki. Baaki sab baigan.", tags: ["home", "deccan"] } ] },
  { q: "Safed chawal (plain white rice) ya bagara khana?", emoji: "🍚", img: U("photo-1512058564366-18510be2db19"),
    options: [
      { t: "Bagara khana — khushboo hi pehchan hai", tags: ["rice", "deccan"], spice: 1 },
      { t: "Safed chawal — saaf, seedha, ghar jaisa", tags: ["rice", "home", "classic"] },
      { t: "Haalat pe hai — daal hai toh safed, gosht hai toh bagara", tags: ["rice", "classic"] } ] },
  { q: "Ramzan ki raunaq — haleem kaisi hona?", emoji: "🍲", img: U("photo-1547592166-23ac45744acd"),
    options: [
      { t: "Full garnish — birista, nimbu, hari mirchi, kaju", tags: ["deccan", "meat"], spice: 2 },
      { t: "Upar se desi ghee ka tadka, bas", tags: ["deccan", "meat"] },
      { t: "Nimbu aur mirchi ka tez jhatka", tags: ["deccan", "spice"], spice: 3 },
      { t: "Plain. Haleem ko drama nakko.", tags: ["deccan", "meat", "mild"], spice: 0 } ] },
  { q: "Irani chai ka scene kya hai tumhara?", emoji: "☕", img: U("photo-1544787219-7f47ccb76574"),
    options: [
      { t: "Osmania biscuit dubo ke — yahi usool hai", tags: ["chai", "deccan"] },
      { t: "Bun maska ke saath, cafe style", tags: ["chai", "deccan", "cafe"] },
      { t: "Nimrah, Charminar ke saamne wali — view ke saath chai", tags: ["chai", "deccan", "street"] },
      { t: "Chai nakko, miya. Coffee chalti mereku.", tags: ["coffee"] } ] },
  { q: "Subah ka Hyderabadi nashta — battle of the legends:", emoji: "🌅", img: U("photo-1512058564366-18510be2db19"),
    options: [
      { t: "Khichdi, khatta aur kheema — teeno bhai", tags: ["deccan", "home", "meat"] },
      { t: "Nihari-paya — dheemi aanch wala sukoon", tags: ["deccan", "meat"], spice: 1 },
      { t: "Idli-dosa set — halka phulka start", tags: ["veg", "mild"] },
      { t: "Nashta nakko — main seedha biryani pe jaata", tags: ["biryani", "adventure"], adv: 1 } ] },
  { q: "Pathar ka gosht ya talawa gosht?", emoji: "🥩", img: U("photo-1558030006-450675393462"),
    options: [
      { t: "Pathar ka gosht — garam pathar pe sikha hua", tags: ["meat", "deccan"], spice: 2 },
      { t: "Talawa gosht — kurkura, masaledar", tags: ["meat", "deccan", "spice"], spice: 3 },
      { t: "Dono. Plate badi wali lana.", tags: ["meat", "deccan", "adventure"], adv: 1, spice: 2 } ] },
  { q: "Dawat (shaadi ka khana) mein pehla hamla kis counter pe?", emoji: "🎉", img: U("photo-1414235077428-338989a2e8c0"),
    options: [
      { t: "Bagara khana + dalcha — dawat ki pehchan", tags: ["deccan", "home"] },
      { t: "Biryani counter — seedha, no bakwaas", tags: ["biryani", "deccan"] },
      { t: "Kebab starters — ghum ghum ke, baar baar", tags: ["meat", "deccan"], spice: 2 },
      { t: "Meetha pehle. Main apne usool khud banata.", tags: ["sweet", "adventure"], sweet: 3, adv: 2 } ] },
  { q: "Sach batao — mirchi ka meter kahan tak?", emoji: "🌶️", img: U("photo-1596040033229-a9821ebd058d"),
    options: [
      { t: "Aankhon se paani, dil se khushi — full teekha", tags: ["spice"], spice: 3 },
      { t: "Medium — swaad aana, paseena nakko", tags: ["classic"], spice: 2 },
      { t: "Halki mirchi — main swaad ka aadmi hoon", tags: ["mild"], spice: 1 },
      { t: "Mirchi? Mere saamne mirchi khud darti hai", tags: ["spice", "adventure"], spice: 3, adv: 2 } ] },
  { q: "Raat ke 2 baje, Hyderabad mein bhook lagi. Plan?", emoji: "🌙", img: U("photo-1630383249896-424e482df921"),
    options: [
      { t: "Ram ki Bandi ka dosa — raat wali legend", tags: ["street", "veg"] },
      { t: "Old City ki taraf — kebab aur chai ka run", tags: ["street", "meat"], spice: 2 },
      { t: "Shah Ghouse / Shadab — jo khula mila, best mila", tags: ["street", "deccan"] },
      { t: "Ghar pe Maggi. Bahar nakko, neend aa rahi", tags: ["noodle", "home"] } ] },
  { q: "Shaam ke naste ki jung — lukmi ya samosa?", emoji: "🥟", img: U("photo-1601050690597-df0568f70950"),
    options: [
      { t: "Lukmi — andar kheema, bahar kurkuri", tags: ["street", "deccan", "meat"] },
      { t: "Samosa — purana saathi, kabhi dhoka nakko deta", tags: ["street", "veg"], spice: 1 },
      { t: "Dono, imli ki chutney ke saath", tags: ["street"], spice: 2 } ] },
  { q: "Meetha wars — Old City edition. Kaunsa jeetega?", emoji: "🍮", img: U("photo-1488477181946-6428a0291777"),
    options: [
      { t: "Double ka meetha — shahi tukde ka nawabi roop", tags: ["sweet", "deccan"], sweet: 3 },
      { t: "Khubani ka meetha — upar malai, full scene", tags: ["sweet", "deccan"], sweet: 2 },
      { t: "Faluda — lamba glass, lamba maza", tags: ["sweet", "street"], sweet: 3 },
      { t: "Jauzi halwa — purani dukaan wala swaad", tags: ["sweet", "deccan", "classic"], sweet: 2 } ] },
  { q: "Marag ya paya — garam shorbe (soup) ki behes:", emoji: "🍵", img: U("photo-1547592180-85f173990554"),
    options: [
      { t: "Marag — shaadiyon wala spicy shorba", tags: ["deccan", "meat", "spice"], spice: 3 },
      { t: "Paya — dheere pakka, haddi tak swaad", tags: ["deccan", "meat"], spice: 1 },
      { t: "Pehle paya, phir marag. Order fix hai.", tags: ["deccan", "meat", "adventure"], adv: 1 } ] },
  { q: "Aakhri Hyderabadi sawal — ek cheez jo is sheher se kabhi juda nahi ho sakti:", emoji: "💛", img: U("photo-1572445271230-a78b5944a659"),
    options: [
      { t: "Biryani. Baat khatam.", tags: ["biryani", "deccan"] },
      { t: "Irani chai aur woh adaa bhari 'hau'", tags: ["chai", "deccan"] },
      { t: "Haleem — Ramzan ki shaan", tags: ["deccan", "meat"] },
      { t: "Teeno. Hyderabad matlab full package, miya.", tags: ["deccan", "adventure"], adv: 1 } ] },

  // ————— PART 2 · PAN-INDIA —————
  { q: "India's favourite street bite — you call it…?", emoji: "🧆", img: U("photo-1626132647523-66f5bf380027"),
    options: [
      { t: "Pani puri — Mumbai style, teekha paani", tags: ["street", "spice"], spice: 3 },
      { t: "Golgappa — Delhi style, full bhar ke", tags: ["street"], spice: 2 },
      { t: "Puchka — Kolkata style, imli wala paani", tags: ["street", "adventure"], adv: 1, spice: 2 },
      { t: "Naam se kya lena — swaad hona, bas", tags: ["street", "classic"], spice: 2 } ] },
  { q: "The great national debate — biryani mein aloo?", emoji: "🥔", img: U("photo-1563379091339-03b21ab4a4f8"),
    options: [
      { t: "Haan! Kolkata biryani ka aloo jaan hai", tags: ["biryani", "adventure"], adv: 2 },
      { t: "Nakko! Aloo biryani mein? Baigan ki baatein.", tags: ["biryani", "deccan"] },
      { t: "Lucknowi style — aloo alag, tehzeeb ke saath", tags: ["biryani", "classic"] },
      { t: "Aloo, anda, sab chalega — pet bharna maqsad", tags: ["biryani"], adv: 1 } ] },
  { q: "Delhi's gift to the world — your pick:", emoji: "🍗", img: U("photo-1585937421612-70a008356fbe"),
    options: [
      { t: "Butter chicken — makhani mein dooba hua", tags: ["meat", "classic"] },
      { t: "Paneer butter masala — veg ka raja", tags: ["veg", "classic"] },
      { t: "Dal makhani — kaali, ghuti hui, legend", tags: ["veg", "home"] },
      { t: "Teeno + butter naan. Full Delhi set.", tags: ["meat", "adventure"], adv: 1 } ] },
  { q: "Sunday morning comfort — chole bhature ya rajma chawal?", emoji: "🫘", img: U("photo-1505253758473-96b7015fcd40"),
    options: [
      { t: "Chole bhature — phoole hue, garam, tez", tags: ["veg", "street"], spice: 2 },
      { t: "Rajma chawal — ghar jaisa sukoon", tags: ["veg", "home"] },
      { t: "Kadhi chawal — underrated champion", tags: ["veg", "home", "adventure"], adv: 1 } ] },
  { q: "Mumbai local special — vada pav ya pav bhaji?", emoji: "🍔", img: U("photo-1606491956689-2ea866880c84"),
    options: [
      { t: "Vada pav — Mumbai ka burger", tags: ["street", "veg"], spice: 2 },
      { t: "Pav bhaji — makkhan mein tairti hui", tags: ["street", "veg"], spice: 2 },
      { t: "Dono, station ke bahar wale se", tags: ["street", "veg", "adventure"], adv: 1, spice: 2 } ] },
  { q: "Coastal fish curry face-off:", emoji: "🐟", img: U("photo-1519708227418-c8fd9a32b7a2"),
    options: [
      { t: "Machher jhol — Bengal ki shaan", tags: ["meat", "adventure"], adv: 1 },
      { t: "Goan fish curry — kokum ka khatta jadoo", tags: ["meat", "adventure"], adv: 2, spice: 2 },
      { t: "Kerala meen curry — nariyal + kudampuli", tags: ["meat"], spice: 2 },
      { t: "Fish mere scene mein nahi hai", tags: ["mild"] } ] },
  { q: "Mithai wars — India edition. Ek chunno:", emoji: "🍬", img: U("photo-1631452180519-c014fe946bc7"),
    options: [
      { t: "Gulab jamun — garam, naram, perfect", tags: ["sweet"], sweet: 3 },
      { t: "Rasgulla — halka, spongy, Bengali pride", tags: ["sweet"], sweet: 2 },
      { t: "Jalebi — garam, kurkuri, rabri ke saath", tags: ["sweet", "street"], sweet: 3 },
      { t: "Mysore pak — ghee mein ghula hua sona", tags: ["sweet"], sweet: 3 } ] },
  { q: "India runs on…?", emoji: "☕", img: U("photo-1509042239860-f550ce710b93"),
    options: [
      { t: "Filter coffee — frothy, strong, South style", tags: ["coffee"] },
      { t: "Kulhad chai — mitti ki khushboo ke saath", tags: ["chai"] },
      { t: "Cutting chai — Mumbai ki aadhi-kami wali jaan", tags: ["chai", "street"] },
      { t: "Adrak-elaichi wali ghar ki chai", tags: ["chai", "home"] } ] },
  { q: "Eating-out personality — India edition:", emoji: "🍽️", img: U("photo-1552566626-52f8b828add9"),
    options: [
      { t: "Dhaba — highway wala, full desi", tags: ["street", "home"], spice: 2 },
      { t: "Darshini / tiffin room — khade hoke, jaldi, best", tags: ["street", "veg"] },
      { t: "Purani galli ki mashhoor dukaan", tags: ["street", "adventure"], adv: 1 },
      { t: "Fine dining — plating bhi, swaad bhi", tags: ["cafe", "adventure"], adv: 1 } ] },
  { q: "Ek thali chunna pade toh — which state's?", emoji: "🍱", img: U("photo-1565557623262-b51c2513a641"),
    options: [
      { t: "Punjabi thali — sarson, makkhan, full power", tags: ["classic", "meat"] },
      { t: "Gujarati thali — meetha-khatta balance", tags: ["veg", "sweet"], sweet: 1 },
      { t: "Bengali thali — machh, shorshe, bhaat", tags: ["meat", "adventure"], adv: 1 },
      { t: "South Indian meals — kele ke patte pe, full set", tags: ["veg", "home"] } ] },

  // ————— PART 3 · AROUND THE WORLD —————
  { q: "World round opens with the classic — rice or noodles?", emoji: "🌍", img: U("photo-1586201375761-83865001e31c"),
    options: [
      { t: "Rice — the world's comfort blanket", tags: ["rice"] },
      { t: "Noodles — slurp > everything", tags: ["noodle"] },
      { t: "Whichever the country does best", tags: ["adventure"], adv: 1 } ] },
  { q: "Pick your noodle bowl:", emoji: "🍜", img: U("photo-1557872943-16a5ac26437e"),
    options: [
      { t: "Ramen — deep, brothy, patient", tags: ["noodle", "adventure"], adv: 1 },
      { t: "Hakka noodles — wok-tossed, street style", tags: ["noodle", "street"] },
      { t: "Pad Thai — sweet, sour, peanutty", tags: ["noodle"], sweet: 1 },
      { t: "Schezwan noodles — full fire", tags: ["noodle", "spice"], spice: 3 } ] },
  { q: "Pasta sauce allegiance:", emoji: "🍝", img: U("photo-1473093295043-cdd812d0e601"),
    options: [
      { t: "Arrabbiata — red & fiery", tags: ["spice"], spice: 2 },
      { t: "Alfredo — white & creamy", tags: ["classic", "mild"] },
      { t: "Pesto — herby & green", tags: ["healthy", "adventure"], adv: 1 },
      { t: "Pink sauce — peace treaty of sauces", tags: ["classic"] } ] },
  { q: "Pizza night rules:", emoji: "🍕", img: U("photo-1513104890138-7c749659a591"),
    options: [
      { t: "Thin crust, minimal fuss", tags: ["classic"] },
      { t: "Cheese-loaded, no regrets", tags: ["classic"], sweet: 1 },
      { t: "Wood-fired Neapolitan, proper", tags: ["classic", "adventure"], adv: 1 },
      { t: "Loaded with everything in the kitchen", tags: ["adventure"], adv: 1, spice: 1 } ] },
  { q: "Build your burger:", emoji: "🍔", img: U("photo-1568901346375-23c9450c58cd"),
    options: [
      { t: "Classic cheeseburger", tags: ["meat", "classic"] },
      { t: "Crispy chicken burger", tags: ["meat"] },
      { t: "Veggie & fresh", tags: ["veg", "healthy"] },
      { t: "Double stack — go big or go home", tags: ["meat", "adventure"], adv: 1 } ] },
  { q: "Sushi comfort level:", emoji: "🍣", img: U("photo-1579871494447-9811cf80d66c"),
    options: [
      { t: "Nigiri & sashimi — bring it on", tags: ["adventure"], adv: 3 },
      { t: "Rolls only, please", tags: ["adventure"], adv: 1 },
      { t: "Cooked options only", tags: ["classic"], adv: 0 },
      { t: "Never tried — but curious", tags: ["adventure"], adv: 2 } ] },
  { q: "Dumplings of the world — your champion:", emoji: "🥟", img: U("photo-1496116218417-1a781b1c416"),
    options: [
      { t: "Momos — with the fiery red chutney", tags: ["street"], spice: 3 },
      { t: "Gyoza — crisp-bottomed, Japanese style", tags: ["adventure"], adv: 1 },
      { t: "Xiao long bao — soup inside, genius", tags: ["adventure"], adv: 2 },
      { t: "Pierogi — buttery, homely, Polish soul food", tags: ["classic", "adventure"], adv: 1 } ] },
  { q: "Soup season — your bowl:", emoji: "🥣", img: U("photo-1547592166-23ac45744acd"),
    options: [
      { t: "Tomato soup — the eternal classic", tags: ["classic", "mild"] },
      { t: "Hot & sour — wake up, palate", tags: ["spice"], spice: 2 },
      { t: "Cream of mushroom — cosy mode", tags: ["classic"] },
      { t: "Miso — light, savoury, umami bomb", tags: ["adventure", "healthy"], adv: 1 } ] },
  { q: "Steak & grill night:", emoji: "🥩", img: U("photo-1600891964092-4316c288032e"),
    options: [
      { t: "Rare & simple — respect the meat", tags: ["meat", "adventure"], adv: 2 },
      { t: "Well-seasoned, desi marinade", tags: ["meat", "spice"], spice: 2 },
      { t: "Saucy & loaded", tags: ["meat"] },
      { t: "Skip the steak — grill veggies & paneer instead", tags: ["veg"] } ] },
  { q: "Fried chicken feelings:", emoji: "🍗", img: U("photo-1562967914-608f82629710"),
    options: [
      { t: "Crispy & spicy — Nashville hot energy", tags: ["meat", "spice"], spice: 2 },
      { t: "Classic & juicy", tags: ["meat", "classic"] },
      { t: "Wings > everything", tags: ["meat"] },
      { t: "Meh — overrated", tags: ["mild"] } ] },
  { q: "Seafood stance:", emoji: "🐠", img: U("photo-1467003909585-2f8a72700288"),
    options: [
      { t: "Love it all — ocean is a menu", tags: ["meat", "adventure"], adv: 2 },
      { t: "Fish only", tags: ["meat"] },
      { t: "Prawns & shrimp are elite", tags: ["meat"] },
      { t: "Not my thing", tags: ["mild"] } ] },
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
  { q: "Brunch culture — where do you stand?", emoji: "🥑", img: U("photo-1525351484163-7529414344d8"),
    options: [
      { t: "Avocado toast & eggs — here for brunch", tags: ["cafe", "healthy"] },
      { t: "Full English breakfast, proper fry-up", tags: ["classic", "meat"] },
      { t: "Pancakes, syrup, zero guilt", tags: ["sweet"], sweet: 2 },
      { t: "Brunch matlab — biryani at noon", tags: ["biryani", "deccan"] } ] },
  { q: "Cheese — how deep are you in?", emoji: "🧀", img: U("photo-1486297678162-eb2a19b0a32d"),
    options: [
      { t: "Cheese pull on everything", tags: ["classic"] },
      { t: "A little goes a long way", tags: ["mild"] },
      { t: "Paneer counts, right?", tags: ["veg", "deccan"] },
      { t: "Not a cheese person", tags: ["healthy"] } ] },
  { q: "Sandwich style:", emoji: "🥪", img: U("photo-1528735602780-2552fd46c7af"),
    options: [
      { t: "Grilled cheese — golden & gooey", tags: ["classic"] },
      { t: "Club sandwich — triple decker", tags: ["cafe"] },
      { t: "Sub-style, fully loaded", tags: ["meat"] },
      { t: "Banh mi — crunchy, herby, Vietnamese magic", tags: ["adventure", "spice"], adv: 2, spice: 2 } ] },
  { q: "Wrap it up — your pick:", emoji: "🌯", img: U("photo-1566740933430-b5e70b06d2d5"),
    options: [
      { t: "Shawarma — garlic sauce, pickles, perfect", tags: ["meat", "street"] },
      { t: "Burrito — beans, rice, the works", tags: ["adventure"], adv: 1 },
      { t: "Gyro — Greek street royalty", tags: ["meat", "adventure"], adv: 1 },
      { t: "Kathi roll — home turf hero", tags: ["meat", "street"], spice: 2 } ] },
  { q: "Sweet tooth, world edition:", emoji: "🍰", img: U("photo-1578985545062-69928b1d9587"),
    options: [
      { t: "Dessert is a food group", tags: ["sweet"], sweet: 3 },
      { t: "One bite is enough", tags: ["mild"], sweet: 1 },
      { t: "Fruit for dessert, thanks", tags: ["healthy"], sweet: 0 },
      { t: "Nothing beats Indian mithai, sorry", tags: ["sweet", "deccan"], sweet: 2 } ] },
  { q: "Frozen finale — ice cream, gelato, or…?", emoji: "🍨", img: U("photo-1563805042-7684c019e1cb"),
    options: [
      { t: "Gelato — dense, Italian, fancy", tags: ["sweet", "cafe"], sweet: 2 },
      { t: "Ice cream sundae, fully loaded", tags: ["sweet"], sweet: 3 },
      { t: "Soft serve — simple joy", tags: ["sweet", "classic"], sweet: 2 },
      { t: "Kulfi — desi always wins", tags: ["sweet", "deccan"], sweet: 2 } ] },
  { q: "Chocolate loyalty:", emoji: "🍫", img: U("photo-1551024506-0bccd828d307"),
    options: [
      { t: "Dark & intense — 70% or nothing", tags: ["sweet", "adventure"], sweet: 2, adv: 1 },
      { t: "Milk & classic", tags: ["sweet", "classic"], sweet: 2 },
      { t: "White chocolate", tags: ["sweet"], sweet: 3 },
      { t: "Chocolate on everything, always", tags: ["sweet"], sweet: 3 } ] },
  { q: "The drink that starts your day, anywhere on Earth:", emoji: "🌅", img: U("photo-1505252585461-04db1eb84625"),
    options: [
      { t: "Coffee — non-negotiable", tags: ["coffee"] },
      { t: "Green tea — calm mode", tags: ["healthy"] },
      { t: "Fresh juice — sunshine in a glass", tags: ["healthy", "sweet"], sweet: 1 },
      { t: "Chai. Any country, any time — chai.", tags: ["chai"] } ] },
  { q: "Eating out or home food — the global truth:", emoji: "🏠", img: U("photo-1414235077428-338989a2e8c0"),
    options: [
      { t: "Home food wins, always", tags: ["home"] },
      { t: "Restaurant explorer — new places weekly", tags: ["adventure"], adv: 2 },
      { t: "Street food supremacy", tags: ["street"], spice: 1 },
      { t: "Balance — weekdays home, weekends out", tags: ["classic"] } ] },
  { q: "In the kitchen, you are:", emoji: "👨‍🍳", img: U("photo-1556910103-1c02745aae4d"),
    options: [
      { t: "The cook — apron on, in charge", tags: ["home", "adventure"], adv: 1 },
      { t: "The official taster", tags: ["home", "classic"] },
      { t: "The recipe follower — measurements exact", tags: ["home"] },
      { t: "Moral support & dish duty", tags: ["classic"] } ] },
  { q: "How adventurous is your palate, really?", emoji: "🧭", img: U("photo-1490645935967-10de6ba17061"),
    options: [
      { t: "I'll try anything once", tags: ["adventure"], adv: 3 },
      { t: "New cuisines, familiar flavours", tags: ["adventure"], adv: 1 },
      { t: "I stick to my favourites", tags: ["classic"], adv: 0 },
      { t: "Only if my friends order it first", tags: ["classic"], adv: 1 } ] },
  { q: "Final verdict — your dream last meal on Earth:", emoji: "👑", img: U("photo-1563379091339-03b21ab4a4f8"),
    options: [
      { t: "A full Hyderabadi biryani feast — full circle", tags: ["biryani", "deccan"] },
      { t: "A giant desi thali — all of India, one plate", tags: ["classic", "home"] },
      { t: "A world tour — one dish per country", tags: ["adventure"], adv: 3 },
      { t: "Ammi's cooking. Bas. (Mom's cooking. That's it.)", tags: ["home", "mild"] } ] }
];
