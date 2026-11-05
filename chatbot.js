const ChatBot = {
  initialized: false,

  rules: [
    {
      keywords: ['hello', 'hi ', 'hey', 'howzit', 'good morning', 'good afternoon', 'good evening'],
      response: "Hello! Welcome to Hendrick Café ☕ I'm here to help with our menu, prices, opening hours, delivery and anything else you'd like to know. What can I help with?"
    },
    {
      keywords: ['hour', 'open', 'close', 'closing', 'opening', 'what time'],
      response: "We're open:\n• Monday – Friday: 6:30am – 6:00pm\n• Saturday: 7:00am – 5:00pm\n• Sunday & Public Holidays: 8:00am – 3:00pm\n\nBreakfast is served from open until 11:30am."
    },
    {
      keywords: ['where', 'location', 'address', 'find you', 'direction', 'located', 'parking'],
      response: "You'll find us at 42 Kloof Street, Gardens, Cape Town. We're just off the main strip — look for the green awning and the smell of fresh espresso. Street parking is available nearby."
    },
    {
      keywords: ['menu', 'what do you sell', 'products', 'offer', 'drinks', 'options', 'what can i get'],
      response: "Our menu covers espresso classics (House Espresso, Cortado, Flat White, Cappuccino, Latte, Mocha), cold drinks (Cold Brew), and retail beans (House Blend 250g and Single Origin 250g). Scroll up to browse the full catalogue!"
    },
    {
      keywords: ['price', 'cost', 'how much', 'rand', 'expensive', 'cheap', 'pricing'],
      response: "Most espresso drinks are between R32 and R48. Cold Brew is R45, and retail beans (250g) are R145 for the House Blend or R185 for Single Origin. All prices include VAT."
    },
    {
      keywords: ['deliver', 'delivery', 'shipping', 'courier', 'takeaway', 'take away', 'order online'],
      response: "We offer same-day courier delivery across Cape Town. Free on orders over R350, otherwise R60 flat. You can also collect from our Kloof Street store in about 15 minutes."
    },
    {
      keywords: ['bean', 'retail', 'bag', 'ground', 'whole', 'roast', 'origin'],
      response: "Our beans are roasted weekly in small batches. The House Blend (R145/250g) is a rich, chocolatey everyday cup. The Single Origin (R185/250g) is an Ethiopian Yirgacheffe — bright, floral and citrus-forward. We can grind to your brew method in-store."
    },
    {
      keywords: ['book', 'reservation', 'table', 'seat', 'private', 'event', 'group'],
      response: "We'd love to host you. For tables of six or more, please call +27 21 555 0142 or email hello@hendrickcafe.co.za. Smaller groups can just walk in — we usually have space."
    },
    {
      keywords: ['wifi', 'internet', 'work', 'laptop', 'plug', 'power'],
      response: "Yes — free fibre WiFi and plenty of plug points. We're a popular spot for remote work. We just ask that you order something every couple of hours during peak times."
    },
    {
      keywords: ['about', 'story', 'who are you', 'hendrick', 'history', 'founded'],
      response: "Hendrick Café started in 2019 as a two-person roastery on Kloof Street. Today we're a neighbourhood café and micro-roastery — we roast every bean ourselves, source from ethical South African importers, and pour every cup with the same care we did on day one."
    },
    {
      keywords: ['contact', 'phone', 'email', 'call', 'reach', 'whatsapp'],
      response: "You can reach us at:\n📞 +27 21 555 0142\n✉️ hello@hendrickcafe.co.za\n📍 42 Kloof Street, Gardens, Cape Town\n\nOr use the contact form on this page — we usually reply within a few hours."
    },
    {
      keywords: ['pay', 'payment', 'card', 'cash', 'eft', 'snapscan', 'payfast'],
      response: "We accept all major cards, cash, EFT and SnapScan in-store. Online orders are handled via PayFast — secure, instant and local."
    },
    {
      keywords: ['vegan', 'dairy', 'milk', 'oat', 'almond', 'soy', 'plant', 'alternative', 'gluten'],
      response: "Absolutely. We stock oat, almond, soy and lactose-free milk at no extra charge. Most of our drinks are naturally vegan when made with plant milk. Ask us about gluten-free options too."
    },
    {
      keywords: ['rooibos', 'tea', 'chai', 'hot chocolate', 'matcha'],
      response: "Beyond coffee we pour Rooibos lattes, masala chai, matcha and single-origin hot chocolate. Our Rooibos Cappuccino is a local favourite — R38."
    },
    {
      keywords: ['thank', 'thanks', 'appreciate', 'cheers'],
      response: "You're very welcome! Enjoy your coffee ☕ — and if you need anything else, I'm right here."
    },
    {
      keywords: ['bye', 'goodbye', 'see you', 'later', 'exit'],
      response: "Thanks for stopping by Hendrick Café. See you soon! ☕"
    }
  ],

  fallbacks: [
    "That's a great question — I'm still learning, so I might not have that answer yet. You can reach the team at hello@hendrickcafe.co.za, or ask me about our menu, prices, opening hours or location.",
    "I'm not sure about that one just yet. Try asking about our coffee, prices, opening hours, or how to find us. For anything else, hello@hendrickcafe.co.za is the best route.",
    "Hmm, I don't have that one in my notes. Ask me about the menu, prices, hours, delivery or our beans — or pop into the café and chat to us in person."
  ],

  init: function () {
    if (this.initialized) return;
    this.initialized = true;

    var toggle = document.getElementById('chatToggle');
    var win = document.getElementById('chatWindow');
    var close = document.getElementById('chatClose');
    var form = document.getElementById('chatForm');
    var input = document.getElementById('chatInput');

    if (!toggle || !win || !form || !input) return;

    var self = this;

    toggle.addEventListener('click', function () {
      if (win.classList.contains('is-open')) {
        self.close();
      } else {
        self.open();
      }
    });

    if (close) close.addEventListener('click', function () { self.close(); });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var text = input.value.trim();
      if (!text) return;
      input.value = '';
      self.send(text);
    });

    /* Welcome message */
    this.addMessage(
      "Hi there 👋 Welcome to Hendrick Café. I can help with our menu, prices, opening hours, delivery and more. What would you like to know?",
      'bot'
    );
  },

  open: function () {
    var win = document.getElementById('chatWindow');
    var toggle = document.getElementById('chatToggle');
    if (win) {
      win.classList.add('is-open');
      win.setAttribute('aria-hidden', 'false');
    }
    if (toggle) toggle.classList.add('is-open');
    setTimeout(function () {
      var input = document.getElementById('chatInput');
      if (input) input.focus();
    }, 200);
  },

  close: function () {
    var win = document.getElementById('chatWindow');
    var toggle = document.getElementById('chatToggle');
    if (win) {
      win.classList.remove('is-open');
      win.setAttribute('aria-hidden', 'true');
    }
    if (toggle) toggle.classList.remove('is-open');
  },

  send: function (text) {
    this.addMessage(text, 'user');
    var self = this;
    setTimeout(function () {
      var reply = self.getResponse(text);
      self.addMessage(reply, 'bot');
    }, 500);
  },

  getResponse: function (text) {
    var lower = text.toLowerCase();
    for (var i = 0; i < this.rules.length; i++) {
      var rule = this.rules[i];
      for (var k = 0; k < rule.keywords.length; k++) {
        if (lower.indexOf(rule.keywords[k]) !== -1) {
          return rule.response;
        }
      }
    }
    return this.fallbacks[Math.floor(Math.random() * this.fallbacks.length)];
  },

  addMessage: function (text, sender) {
    var messages = document.getElementById('chatMessages');
    if (!messages) return;
    var bubble = document.createElement('div');
    bubble.className = 'chat-bubble ' + (sender === 'user' ? 'chat-bubble-user' : 'chat-bubble-bot');
    bubble.textContent = text;
    messages.appendChild(bubble);
    messages.scrollTop = messages.scrollHeight;
  }
};
