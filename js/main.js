/* Hendrick Café — App Bootstrap */
console.log('[Hendrick] main.js loaded');

document.addEventListener('DOMContentLoaded', function () {

  /* Products (guarded) */
  try {
    if (typeof renderProducts === 'function' && typeof PRODUCTS !== 'undefined') {
      renderProducts(document.getElementById('productGrid'));
    } else {
      console.error('[Hendrick] products.js missing or failed to load');
    }
  } catch (e) { console.error('[Hendrick] render products failed:', e); }

  /* Cart (guarded) */
  try {
    if (typeof Cart !== 'undefined') {
      Cart.load();
      Cart.render();
    } else {
      console.error('[Hendrick] cart.js missing or failed to load');
    }
  } catch (e) { console.error('[Hendrick] cart init failed:', e); }

  /* Chatbot (guarded) */
  try {
    if (typeof ChatBot !== 'undefined') {
      ChatBot.init();
    } else {
      console.error('[Hendrick] chatbot.js missing or failed to load');
    }
  } catch (e) { console.error('[Hendrick] chat init failed:', e); }

  /* Footer year (always runs) */
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* Mobile nav toggle */
  var navToggle = document.getElementById('navToggle');
  var navLinks = document.getElementById('navLinks');
  if (navToggle && navLinks) {
    navToggle.addEventListener('click', function () {
      navLinks.classList.toggle('is-open');
      navToggle.classList.toggle('is-open');
    });
    navLinks.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        navLinks.classList.remove('is-open');
        navToggle.classList.remove('is-open');
      });
    });
  }

  /* Cart drawer */
  var cartDrawer = document.getElementById('cartDrawer');
  var cartBackdrop = document.getElementById('cartBackdrop');
  var cartCloseBtn = document.getElementById('cartClose');

  function openCart() {
    if (cartDrawer) { cartDrawer.classList.add('is-open'); cartDrawer.setAttribute('aria-hidden', 'false'); }
    if (cartBackdrop) cartBackdrop.classList.add('is-open');
    document.body.classList.add('no-scroll');
  }

  function closeCart() {
    if (cartDrawer) { cartDrawer.classList.remove('is-open'); cartDrawer.setAttribute('aria-hidden', 'true'); }
    if (cartBackdrop) cartBackdrop.classList.remove('is-open');
    document.body.classList.remove('no-scroll');
  }

  document.querySelectorAll('[data-open-cart]').forEach(function (btn) {
    btn.addEventListener('click', openCart);
  });
  if (cartCloseBtn) cartCloseBtn.addEventListener('click', closeCart);
  if (cartBackdrop) cartBackdrop.addEventListener('click', closeCart);

  /* Toast */
  var toastTimer;
  function showToast(msg) {
    var toast = document.getElementById('toast');
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add('is-visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      toast.classList.remove('is-visible');
    }, 2400);
  }

  /* Delegated cart clicks */
  document.body.addEventListener('click', function (e) {
    var addBtn = e.target.closest('[data-add-to-cart]');
    if (addBtn) {
      var productId = addBtn.getAttribute('data-add-to-cart');
      if (typeof Cart !== 'undefined') {
        Cart.add(productId);
        var product = (typeof PRODUCTS !== 'undefined')
          ? PRODUCTS.find(function (p) { return p.id === productId; })
          : null;
        showToast((product ? product.name : 'Item') + ' added to cart');
      }
      return;
    }

    var removeBtn = e.target.closest('[data-cart-remove]');
    if (removeBtn && typeof Cart !== 'undefined') {
      Cart.remove(removeBtn.getAttribute('data-cart-remove'));
      return;
    }

    var qtyBtn = e.target.closest('[data-cart-action]');
    if (qtyBtn && typeof Cart !== 'undefined') {
      var id = qtyBtn.getAttribute('data-cart-id');
      var action = qtyBtn.getAttribute('data-cart-action');
      var item = Cart.items.find(function (i) { return i.id === id; });
      if (!item) return;
      if (action === 'inc') Cart.setQty(id, item.qty + 1);
      if (action === 'dec') Cart.setQty(id, item.qty - 1);
      return;
    }
  });

  /* Checkout button */
  var checkoutBtn = document.getElementById('checkoutBtn');
  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', function () {
      if (typeof Cart !== 'undefined' && Cart.items.length === 0) {
        showToast('Your cart is empty — add a coffee first');
        return;
      }
      showToast('Checkout coming soon — call +27 21 555 0142 to order');
    });
  }

  /* Contact form */
  var contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      showToast("Thanks! We'll be in touch shortly.");
      contactForm.reset();
    });
  }

  /* Escape closes overlays */
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      closeCart();
      if (typeof ChatBot !== 'undefined') ChatBot.close();
    }
  });

});
