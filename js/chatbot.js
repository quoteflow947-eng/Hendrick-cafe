/* Hendrick Café — Advanced Rule-Based Chatbot v2 */
console.log('[Hendrick] chatbot.js loaded (v2)');

var ChatBot = {
  initialized: false,

  /* =========================================================
     44 RULES — ordered roughly by topic, not by priority.
     Matching is SCORED, so order doesn't affect accuracy.
     Longer keywords and multi-word phrases score higher.
     ========================================================= */
  rules: [

    /* --- Greetings --- */
    { keywords: ['hello', 'hi', 'hey', 'howzit', 'good morning', 'good afternoon', 'good evening', 'greetings', 'yo'],
      response: "Hello! Welcome to Hendrick Café ☕ I can help with the menu, prices, opening hours, delivery, our beans, bookings, dietary needs, and more. What can I help with?" },

    /* --- Hours --- */
    { keywords: ['hour', 'open', 'close', 'closing', 'opening', 'trading', 'what time'],
      response: "Here's our full schedule:\n\n• Monday – Friday: 6:30am – 6:00pm\n• Saturday: 7:00am – 5:00pm\n• Sunday & Public Holidays: 8:00am – 3:00pm\n\nKitchen closes 30 minutes before we do." },
    { keywords: ['sunday', 'saturday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'weekend', 'public holiday'],
      response: "Here's our weekly schedule:\n\n• Monday – Friday: 6:30am – 6:00pm\n• Saturday: 7:00am – 5:00pm\n• Sunday & Public Holidays: 8:00am – 3:00pm\n\nDo note the kitchen closes 30 minutes before we do each day." },
    { keywords: ['open now', 'still open', 'currently open', 'open right now', 'open at the moment', 'closed now'],
      responseFn: function () {
        var now = new Date();
        var utcMs = now.getTime() + (now.getTimezoneOffset() * 60000);
        var sast = new Date(utcMs + 2 * 60 * 60 * 1000);
        var day = sast.getDay();
        var mins = sast.getHours() + sast.getMinutes() / 60;
        var hours = { 0: [8, 15], 1: [6.5, 18], 2: [6.5, 18], 3: [6.5, 18], 4: [6.5, 18], 5: [6.5, 18], 6: [7, 17] };
        var dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        function fmt(h) {
          var hh = Math.floor(h);
          var mm = Math.round((h - hh) * 60);
          var suffix = hh >= 12 ? 'pm' : 'am';
          var h12 = hh % 12 || 12;
          return h12 + (mm ? ':' + (mm < 10 ? '0' + mm : mm) : '') + suffix;
        }
        var today = hours[day];
        if (mins >= today[0] && mins < today[1]) {
          return "Yes — we're open right now ☕ We close at " + fmt(today[1]) + " today. Come through!";
        }
        if (mins < today[0]) {
          return "We're closed right now, but we open today at " + fmt(today[0]) + ". See you soon!";
        }
        var tomorrow = (day + 1) % 7;
        return "We're closed for today. We open tomorrow (" + dayNames[tomorrow] + ") at " + fmt(hours[tomorrow][0]) + ". See you then!";
      } },

    /* --- Location & parking --- */
    { keywords: ['where', 'location', 'address', 'find you', 'located', 'direction', 'kloof', 'gardens'],
      response: "You'll find us at 42 Kloof Street, Gardens, Cape Town. We're on the corner just off the main strip — look for the green awning. About a 6-minute walk from the Uber drop-off on Orange Street." },
    { keywords: ['parking', 'park', 'drive'],
      response: "There's metered street parking right on Kloof Street, plus a paid lot two blocks up on Bree. We're also a 6-minute walk from the Cape Town Uber drop-off on Orange Street." },

    /* --- Menu & pricing --- */
    { keywords: ['menu', 'what do you sell', 'what do you have', 'drinks', 'coffee types', 'beverages', 'offer', 'espresso'],
      response: "Our menu is split into espresso drinks (House Espresso, Cortado, Flat White, Cappuccino, Café Latte, Mocha), cold drinks (Cold Brew), and retail beans (House Blend and Single Origin, 250g bags). Scroll up to browse the full catalogue with descriptions and prices!" },
    { keywords: ['price', 'cost', 'how much', 'rand', 'expensive', 'cheap', 'pricing'],
      responseFn: function (self) { return "Here's our full price list:\n\n" + self.buildPriceList() + "\n\nAll prices include VAT."; } },
    { keywords: ['signature', 'must try', 'what should i', 'recommend a drink', 'first time', 'what do you recommend'],
      response: "If it's your first time, order the Flat White — it's what we're known for. If you like it strong and short, the Cortado. If you're a black coffee purist, the House Espresso. And the Cold Brew is unbeatable on a warm Cape Town day." },
    { keywords: ['best', 'best seller', 'popular', 'recommend', 'favourite', 'favorite', 'top'],
      response: "Our most-ordered drink is the Flat White — smooth, balanced, exactly what coffee should be. The Cold Brew is the summer sleeper hit. If you want something different, try the Rooibos Cappuccino — it's the local favourite for a reason." },

    /* --- Delivery & collection --- */
    { keywords: ['deliver', 'delivery', 'shipping', 'courier', 'bring to me', 'send to me'],
      response: "Yes — we deliver across Cape Town. Free on orders over R350, otherwise R60 flat. Same-day delivery if you order before 2pm. We also offer in-store collection (ready in ~15 minutes)." },
    { keywords: ['sea point', 'green point', 'claremont', 'rondebosch', 'woodstock', 'observatory', 'obs', 'camps bay', 'table view', 'milnerton', 'suburb', 'deliver to'],
      response: "We deliver across the Cape Town metro — including the City Bowl, Sea Point, Green Point, Woodstock, Observatory, Claremont, Rondebosch, and further afield on request. Enter your address at checkout, or ask us here." },
    { keywords: ['takeaway', 'take away', 'collect', 'pickup', 'pick up', 'grab and go'],
      response: "Yes — takeaway is available on everything. Order ahead by phone (+27 21 555 0142) and we'll have it ready in about 15 minutes. Bring your own cup for R3 off any drink." },

    /* --- Beans, subscriptions, wholesale --- */
    { keywords: ['bean', 'beans', 'retail', 'bag', 'ground', 'whole', 'origin'],
      response: "Our beans are roasted weekly in small batches:\n\n• House Blend (250g): R145 — chocolatey, nutty, everyday cup\n• Single Origin Ethiopian Yirgacheffe (250g): R185 — bright, floral, citrus-forward\n\nWe can grind to your brew method in-store or send whole beans. Roast dates are printed on every bag." },
    { keywords: ['subscription', 'monthly', 'recurring', 'auto deliver', 'subscribe'],
      response: "We do! Subscribe for monthly bean deliveries — 10% off, free courier, and you can pause or cancel anytime. Email hello@hendrickcafe.co.za with your preferred grind and we'll set you up." },
    { keywords: ['wholesale', 'business', 'office coffee', 'corporate', 'restaurant', 'supply'],
      response: "We supply wholesale beans and equipment to offices, restaurants and hotels across Cape Town. Minimum 5kg/month, with training included. Email hello@hendrickcafe.co.za for pricing and a sample kit." },

    /* --- Bookings & events --- */
    { keywords: ['book', 'booking', 'reservation', 'reserve', 'table', 'seat', 'sit'],
      response: "For tables of six or more, please call +27 21 555 0142 or email hello@hendrickcafe.co.za. Smaller groups can just walk in — we usually have space. Peak times are 8–10am weekdays and 9–11am weekends." },
    { keywords: ['private', 'event', 'function', 'party', 'birthday', 'celebrate', 'corporate event'],
      response: "We host private functions and small events — up to 30 people for sit-down, or 50 for standing. Email hello@hendrickcafe.co.za with your date, headcount and vibe, and we'll come back with options." },
    { keywords: ['catering', 'cater', 'bulk', 'platter', 'office order', 'large order'],
      response: "We cater for offices, events and functions — filter coffee urns, pastry platters, boxed lunches and bulk bean orders. Email hello@hendrickcafe.co.za with your date, headcount and budget, and we'll come back with a plan." },

    /* --- WiFi & workspace --- */
    { keywords: ['wifi', 'wi fi', 'internet', 'work', 'laptop', 'plug', 'power', 'remote', 'study'],
      response: "Free fibre WiFi, plenty of plug points, and a relaxed atmosphere for remote work or study. We just ask that you order something every couple of hours during peak times. Ask a barista for the WiFi password." },

    /* --- About --- */
    { keywords: ['about', 'story', 'who are you', 'hendrick', 'history', 'founded', 'owner', 'start'],
      response: "Hendrick Café started in 2019 as a two-person roastery on Kloof Street. Today we're a neighbourhood café and micro-roastery — we roast every bean ourselves in small batches, source through ethical South African importers, and pour every cup like it's the only one we'll make all day." },

    /* --- Contact --- */
    { keywords: ['contact', 'phone', 'email', 'call', 'reach', 'whatsapp', 'number'],
      response: "Reach us at:\n\n📞 +27 21 555 0142\n✉️ hello@hendrickcafe.co.za\n📍 42 Kloof Street, Gardens, Cape Town\n\nOr use the contact form on this page — we usually reply within a few hours." },

    /* --- Payment --- */
    { keywords: ['pay', 'payment', 'card', 'cash', 'eft', 'snapscan', 'payfast', 'tap', 'apple pay', 'google pay'],
      response: "We accept all major cards (Visa, Mastercard, Amex), cash, EFT, Apple Pay, Google Pay and SnapScan in-store. Online orders are handled securely via PayFast." },

    /* --- Loyalty & gift cards --- */
    { keywords: ['loyalty', 'rewards', 'stamp', 'points', 'member', 'frequent'],
      response: "Yes — our Hendrick Card gives you a free coffee after every 9. Ask any barista to start one, or pick one up at the counter. No sign-up, no app, just a card." },
    { keywords: ['gift', 'voucher', 'gift card', 'present'],
      response: "Gift vouchers are available in R100, R250 and R500 — redeemable on drinks, food or beans. Buy in-store or email hello@hendrickcafe.co.za and we'll send a digital voucher the same day." },

    /* --- Dietary, allergies, decaf, tea --- */
    { keywords: ['vegan', 'dairy', 'milk', 'oat', 'almond', 'soy', 'plant', 'alternative', 'lactose'],
      response: "Absolutely. We stock oat, almond, soy, and lactose-free milk at no extra charge. Most of our drinks are vegan when made with plant milk. Just let your barista know." },
    { keywords: ['allergy', 'allergic', 'gluten', 'nut', 'nuts'],
      response: "We take allergies seriously. Our kitchen handles nuts and gluten, so cross-contamination is possible — please tell your barista before ordering. We have gluten-free bread options and can swap milk for any alternative at no extra charge." },
    { keywords: ['decaf', 'decaffeinated', 'no caffeine', 'caffeine free'],
      response: "Yes — we always have a Swiss Water decaf on hand, available in all espresso drinks at the same price. Our Cold Brew also has a decaf version on request." },
    { keywords: ['tea', 'rooibos', 'chai', 'matcha', 'hot chocolate', 'not coffee'],
      response: "Beyond coffee, we pour:\n\n• Rooibos Latte — R38\n• Masala Chai — R42\n• Matcha Latte — R45\n• Single-origin Hot Chocolate — R45\n\nThe Rooibos Cappuccino is a local favourite." },

    /* --- Food --- */
    { keywords: ['breakfast', 'morning', 'eggs', 'toast', 'avocado', 'muesli', 'yoghurt'],
      response: "Breakfast is served from open until 11:30am. Favourites include smashed avo on sourdough (R85), farm eggs on toast (R65), and house granola with yoghurt (R55). Full menu at the counter." },
    { keywords: ['lunch', 'sandwich', 'salad', 'savoury', 'food', 'eat', 'hungry'],
      response: "We do a small but serious food menu: toasted sandwiches (from R65), seasonal salads (R75), and daily soup. Kitchen is open 11:30am – 4pm. Grab-and-go pastries are available all day." },
    { keywords: ['cake', 'pastry', 'croissant', 'muffin', 'baked', 'sweet', 'dessert', 'cookie'],
      response: "Everything is baked in-house daily. Favourites: butter croissant (R35), almond croissant (R42), bran muffin (R30), and rotating cakes (R45 a slice). Come early — pastries often sell out by 2pm." },

    /* --- Misc useful --- */
    { keywords: ['job', 'jobs', 'hiring', 'work for you', 'careers', 'cv', 'apply', 'vacancy', 'position'],
      response: "We're always keen to meet good baristas. Email your CV to hello@hendrickcafe.co.za with a short note about yourself. Barista experience is welcome but we're happy to train the right person." },
    { keywords: ['wheelchair', 'accessibility', 'accessible', 'ramp', 'disabled', 'disability'],
      response: "Our Kloof Street entrance is step-free with a small ramp, and there's an accessible bathroom inside. If you need anything specific on the day, call ahead (+27 21 555 0142) and we'll make sure the layout works for you." },
    { keywords: ['dog', 'pet', 'puppy', 'cat', 'animal'],
      response: "Well-behaved dogs are always welcome on our pavement seating. We keep a water bowl by the door. Inside the café we follow city health regulations, so pups stay outside — but they get plenty of fuss." },
    { keywords: ['kid', 'kids', 'child', 'children', 'family', 'baby', 'pram'],
      response: "Families are very welcome. We have high chairs, a kids' babycino (steamed milk, free), and smaller hot chocolate at R25. Our seating has a bit of space near the back that works well for prams." },
    { keywords: ['music', 'vibe', 'atmosphere', 'quiet', 'loud', 'playlist'],
      response: "We keep it relaxed — think warm jazz and acoustic soul at conversational volume. The back corner is the quietest spot. Ask the barista if you'd like the music turned down near you." },
    { keywords: ['merch', 'merchandise', 'mug', 'tumbler', 't shirt', 'shirt', 'gift set'],
      response: "We sell branded ceramic mugs (R180), glass tumblers (R220), reusable coffee cups (R250) and cotton tees (R380). All in-store. Great as gifts — we can wrap them on request." },
    { keywords: ['class', 'classes', 'workshop', 'barista course', 'training', 'cupping', 'learn'],
      response: "We run monthly home-barista workshops (R450, 2 hours, max 6 people) and Saturday cuppings (R250). Email hello@hendrickcafe.co.za to be added to the list — spaces fill fast." },
    { keywords: ['water', 'tap', 'still', 'sparkling', 'filter'],
      response: "Free filtered tap water (still or sparkling) with any order — just ask. Bottled still or sparkling water is R25." },
    { keywords: ['refund', 'complaint', 'wrong order', 'stale', 'mistake'],
      response: "We're really sorry to hear that. Please call +27 21 555 0142 or email hello@hendrickcafe.co.za with what happened and we'll make it right — a replacement or refund, your choice. We take every complaint seriously." },
    { keywords: ['wait', 'how long', 'ready', 'queue', 'busy'],
      response: "Typical waits: under 5 minutes for drinks, under 10 for food. Peak times (8–10am weekdays, 9–11am weekends) can push it a bit longer. For takeaway, call ahead and we'll have it ready." },

    /* --- Meta / thanks / bye --- */
    { keywords: ['help', 'what can you do', 'what do you know', 'how can you help', 'assist'],
      response: "I can help with:\n\n• Menu, products and prices\n• Opening hours and location\n• Delivery, collection and orders\n• Our beans, subscriptions and wholesale\n• Bookings, events and workshops\n• Dietary needs, allergies and drinks\n• Contact, loyalty, gift cards\n\nJust ask away!" },
    { keywords: ['thank', 'thanks', 'appreciate', 'cheers'],
      response: "You're very welcome! Enjoy your coffee ☕ — and if you need anything else, I'm right here." },
    { keywords: ['bye', 'goodbye', 'see you', 'later', 'exit'],
      response: "Thanks for stopping by Hendrick Café. See you soon! ☕" }
  ],

  /* Fallback variations — friendly and route to a human */
  fallbacks: [
    "I'm not sure I have an answer to that one yet — try asking about our menu, prices, hours, delivery, beans, or where to find us. For anything else, hello@hendrickcafe.co.za is the best route.",
    "Hmm, that one's outside my notes. I'm best at café questions: menu, prices, opening hours, delivery, dietary options, and our beans. For everything else, ring us on +27 21 555 0142.",
    "I don't have that answer — but try rephrasing, or ask about the menu, prices, hours, delivery, or how to reach us. If you need a person, hello@hendrickcafe.co.za always works.",
    "That's beyond what I know right now. Ask me about coffee, prices, opening times, delivery or our beans — or pop into the café and we'll chat in person."
  ],

  /* =========================================================
     CORE METHODS — matching, response, UI
     ========================================================= */

  init: function () {
    if (this.initialized) return;
    this.initialized = true;

    var toggle = document.getElementById('chatToggle');
    var win = document.getElementById('chatWindow');
    var close = document.getElementById('chatClose');
    var form = document.getElementById('chatForm');
    var input = document.getElementById('chatInput');

    if (!toggle || !win || !form || !input) {
      console.error('[Hendrick] Chatbot: required elements not found');
      return;
    }

    var self = this;

    toggle.addEventListener('click', function () {
      if (win.classList.contains('is-open')) { self.close(); }
      else { self.open(); }
    });

    if (close) close.addEventListener('click', function () { self.close(); });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var text = input.value.trim();
      if (!text) return;
      input.value = '';
      self.send(text);
    });

    this.addMessage(
      "Hi there 👋 Welcome to Hendrick Café. I'm your café assistant — ask me anything about the menu, prices, opening hours, delivery, our beans, bookings, and more.",
      'bot'
    );

    this.addSuggestions([
      'What are your opening hours?',
      'Show me the menu and prices',
      'Do you deliver?',
      'Where are you located?'
    ]);
  },

  open: function () {
    var win = document.getElementById('chatWindow');
    var toggle = document.getElementById('chatToggle');
    if (win) { win.classList.add('is-open'); win.setAttribute('aria-hidden', 'false'); }
    if (toggle) toggle.classList.add('is-open');
    setTimeout(function () {
      var input = document.getElementById('chatInput');
      if (input) input.focus();
    }, 200);
  },

  close: function () {
    var win = document.getElementById('chatWindow');
    var toggle = document.getElementById('chatToggle');
    if (win) { win.classList.remove('is-open'); win.setAttribute('aria-hidden', 'true'); }
    if (toggle) toggle.classList.remove('is-open');
  },

  send: function (text) {
    var self = this;
    var existing = document.querySelector('.chat-suggestions');
    if (existing) existing.remove();

    this.addMessage(text, 'user');

    setTimeout(function () {
      var result = self.getResponse(text);
      self.addMessage(result.text, 'bot');
      if (result.isFallback) {
        self.addSuggestions([
          'What are your opening hours?',
          'Show me the menu and prices',
          'Where are you located?'
        ]);
      }
    }, 500);
  },

  /* =========================================================
     MATCHING ENGINE
     ========================================================= */

  normalize: function (text) {
    return text.toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')  // strip accents
      .replace(/[^\w\s]/g, ' ')                          // strip punctuation
      .replace(/\s+/g, ' ')                               // collapse whitespace
      .trim();
  },

  escapeRegex: function (str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  },

  matchesKeyword: function (normalized, keyword) {
    var escaped = this.escapeRegex(keyword.toLowerCase());
    var re = new RegExp('\\b' + escaped);
    return re.test(normalized);
  },

  scoreRule: function (normalized, rule) {
    var score = 0;
    var matched = 0;
    for (var i = 0; i < rule.keywords.length; i++) {
      var kw = rule.keywords[i].toLowerCase();
      if (this.matchesKeyword(normalized, kw)) {
        score += kw.length + (kw.indexOf(' ') !== -1 ? 10 : 0);
        matched++;
      }
    }
    return { score: score, matched: matched };
  },

  matchProduct: function (normalized) {
    if (typeof PRODUCTS === 'undefined' || typeof formatPrice === 'undefined') return null;

    for (var i = 0; i < PRODUCTS.length; i++) {
      var p = PRODUCTS[i];

      var fullName = p.name.toLowerCase()
        .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
        .replace(/[^\w\s]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();

      if (normalized.indexOf(fullName) !== -1) {
        return p.name + ' — ' + formatPrice(p.price) + '\n\n' + p.description;
      }

      var idPhrase = p.id.replace(/-/g, ' ');
      if (idPhrase !== fullName && normalized.indexOf(idPhrase) !== -1) {
        return p.name + ' — ' + formatPrice(p.price) + '\n\n' + p.description;
      }

      var idWords = p.id.split('-');
      if (idWords.length >= 2) {
        var prefix2 = idWords.slice(0, 2).join(' ');
        if (prefix2 !== idPhrase && prefix2 !== fullName && normalized.indexOf(prefix2) !== -1) {
          return p.name + ' — ' + formatPrice(p.price) + '\n\n' + p.description;
        }
      }
    }
    return null;
  },

  buildPriceList: function () {
    if (typeof PRODUCTS === 'undefined' || typeof formatPrice === 'undefined') {
      return '• Espresso drinks: R32–R48\n• Cold Brew: R45\n• Retail beans (250g): R145–R185';
    }
    return PRODUCTS.map(function (p) {
      return '• ' + p.name + ' — ' + formatPrice(p.price);
    }).join('\n');
  },

  getResponse: function (text) {
    var normalized = this.normalize(text);

    /* 1. Direct product match — returns rich price + description */
    var product = this.matchProduct(normalized);
    if (product) {
      return { text: product, isFallback: false };
    }

    /* 2. Score every rule, pick the best */
    var best = null, bestScore = 0;
    for (var i = 0; i < this.rules.length; i++) {
      var result = this.scoreRule(normalized, this.rules[i]);
      if (result.matched > 0 && result.score > bestScore) {
        bestScore = result.score;
        best = this.rules[i];
      }
    }

    if (best) {
      var reply = best.responseFn ? best.responseFn(this) : best.response;
      return { text: reply, isFallback: false };
    }

    /* 3. Fallback */
    var fb = this.fallbacks[Math.floor(Math.random() * this.fallbacks.length)];
    return { text: fb, isFallback: true };
  },

  /* =========================================================
     UI HELPERS
     ========================================================= */

  addMessage: function (text, sender) {
    var messages = document.getElementById('chatMessages');
    if (!messages) return;
    var bubble = document.createElement('div');
    bubble.className = 'chat-bubble ' + (sender === 'user' ? 'chat-bubble-user' : 'chat-bubble-bot');
    bubble.textContent = text;
    messages.appendChild(bubble);
    messages.scrollTop = messages.scrollHeight;
  },

  addSuggestions: function (questions) {
    var messages = document.getElementById('chatMessages');
    if (!messages) return;
    var self = this;
    var wrap = document.createElement('div');
    wrap.className = 'chat-suggestions';
    questions.forEach(function (q) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'chat-suggestion';
      btn.textContent = q;
      btn.addEventListener('click', function () {
        wrap.remove();
        self.send(q);
      });
      wrap.appendChild(btn);
    });
    messages.appendChild(wrap);
    messages.scrollTop = messages.scrollHeight;
  }
};
