/* =========================================
   Hendrick Café — Product Catalogue
   ========================================= */

const PRODUCTS = [
  {
    id: 'house-espresso',
    name: 'House Espresso',
    category: 'Espresso Bar',
    price: 32,
    description: 'Our signature blend pulled short and sweet. Dark chocolate, toasted hazelnut and a whisper of brown sugar.',
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'cortado',
    name: 'Cortado',
    category: 'Espresso Bar',
    price: 38,
    description: 'Equal parts espresso and silky steamed milk. Balanced, bold and served in a glass.',
    image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'flat-white',
    name: 'Flat White',
    category: 'Espresso Bar',
    price: 42,
    description: 'Velvety micro-foam poured over a double ristretto. Smooth, rich and quietly perfect.',
    image: 'https://images.unsplash.com/photo-1521302200778-33500795e128?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'cappuccino',
    name: 'Cappuccino',
    category: 'Espresso Bar',
    price: 40,
    description: 'Classic Italian style with a dusting of cocoa. Light, airy and unapologetically traditional.',
    image: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'cafe-latte',
    name: 'Café Latte',
    category: 'Espresso Bar',
    price: 42,
    description: 'Silky steamed milk with a gentle pull of espresso. Comfort in a cup.',
    image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'mocha',
    name: 'Mocha',
    category: 'Espresso Bar',
    price: 48,
    description: 'Espresso, dark chocolate and steamed milk, topped with a soft crown of cream.',
    image: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'cold-brew',
    name: 'Cold Brew',
    category: 'Cold Drinks',
    price: 45,
    description: 'Steeped for 18 hours, smooth and chocolatey. Served over ice with a splash of milk on request.',
    image: 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'house-blend-beans',
    name: 'House Blend Beans · 250g',
    category: 'Retail Beans',
    price: 145,
    description: 'Take our signature roast home. Whole beans or ground to your brew method — packed the day it is roasted.',
    image: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'single-origin-beans',
    name: 'Single Origin · 250g',
    category: 'Retail Beans',
    price: 185,
    description: 'Ethiopian Yirgacheffe. Bright, floral and citrus-forward — a cup that tastes like the place it came from.',
    image: 'https://images.unsplash.com/photo-1442512595331-e89e73853f31?auto=format&fit=crop&w=800&q=80'
  }
];

/**
 * Format a number as South African rand: R32.00
 */
function formatPrice(value) {
  return 'R' + Number(value).toFixed(2);
}

/**
 * Render the product grid into a container element.
 */
function renderProducts(container) {
  if (!container) return;
  container.innerHTML = PRODUCTS.map(function (p) {
    return [
      '<article class="product-card">',
      '  <div class="product-image-wrap">',
      '    <img src="' + p.image + '" alt="' + p.name + '" class="product-image" loading="lazy" />',
      '    <span class="product-category">' + p.category + '</span>',
      '  </div>',
      '  <div class="product-body">',
      '    <h3 class="product-name">' + p.name + '</h3>',
      '    <p class="product-description">' + p.description + '</p>',
      '    <div class="product-footer">',
      '      <span class="product-price">' + formatPrice(p.price) + '</span>',
      '      <button class="btn-add" data-add-to-cart="' + p.id + '">Add to cart</button>',
      '    </div>',
      '  </div>',
      '</article>'
    ].join('');
  }).join('');
}
