/* Hendrick Café — Shopping Cart */
console.log('[Hendrick] cart.js loaded');

var CART_STORAGE_KEY = 'hendrick-cafe-cart';

var Cart = {
  items: [],

  load: function () {
    try {
      var saved = localStorage.getItem(CART_STORAGE_KEY);
      var parsed = saved ? JSON.parse(saved) : [];
      this.items = Array.isArray(parsed) ? parsed : [];
    } catch (err) {
      this.items = [];
    }
  },

  save: function () {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(this.items));
    } catch (err) {}
  },

  add: function (productId) {
    var existing = this.items.find(function (i) { return i.id === productId; });
    if (existing) {
      existing.qty += 1;
    } else {
      this.items.push({ id: productId, qty: 1 });
    }
    this.save();
    this.render();
  },

  remove: function (productId) {
    this.items = this.items.filter(function (i) { return i.id !== productId; });
    this.save();
    this.render();
  },

  setQty: function (productId, qty) {
    if (qty <= 0) { this.remove(productId); return; }
    var item = this.items.find(function (i) { return i.id === productId; });
    if (item) {
      item.qty = qty;
      this.save();
      this.render();
    }
  },

  totalCount: function () {
    return this.items.reduce(function (sum, i) { return sum + i.qty; }, 0);
  },

  totalPrice: function () {
    return this.items.reduce(function (sum, i) {
      var product = PRODUCTS.find(function (p) { return p.id === i.id; });
      return sum + (product ? product.price * i.qty : 0);
    }, 0);
  },

  render: function () {
    var countEl = document.getElementById('cartCount');
    var count = this.totalCount();
    if (countEl) {
      countEl.textContent = count;
      countEl.style.display = count > 0 ? 'flex' : 'none';
    }

    var itemsEl = document.getElementById('cartItems');
    if (!itemsEl) return;

    if (this.items.length === 0) {
      itemsEl.innerHTML =
        '<div class="cart-empty">' +
        '  <p>Your cart is empty.</p>' +
        '  <p class="cart-empty-sub">Add a coffee to begin.</p>' +
        '</div>';
    } else {
      itemsEl.innerHTML = this.items.map(function (item) {
        var p = PRODUCTS.find(function (prod) { return prod.id === item.id; });
        if (!p) return '';
        return [
          '<div class="cart-item">',
          '  <img src="' + p.image + '" alt="' + p.name + '" class="cart-item-image" />',
          '  <div class="cart-item-body">',
          '    <div class="cart-item-head">',
          '      <h4>' + p.name + '</h4>',
          '      <button class="cart-item-remove" data-cart-remove="' + p.id + '" aria-label="Remove item">&times;</button>',
          '    </div>',
          '    <span class="cart-item-price">' + formatPrice(p.price) + '</span>',
          '    <div class="qty-control">',
          '      <button class="qty-btn" data-cart-action="dec" data-cart-id="' + p.id + '" aria-label="Decrease quantity">−</button>',
          '      <span class="qty-value">' + item.qty + '</span>',
          '      <button class="qty-btn" data-cart-action="inc" data-cart-id="' + p.id + '" aria-label="Increase quantity">+</button>',
          '    </div>',
          '  </div>',
          '</div>'
        ].join('');
      }).join('');
    }

    var subtotalEl = document.getElementById('cartSubtotal');
    if (subtotalEl) subtotalEl.textContent = formatPrice(this.totalPrice());
  }
};
