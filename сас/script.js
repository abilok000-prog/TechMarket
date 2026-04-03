const PRODUCTS = [
  {
    id: 1,
    name: "iPhone 17 Pro",
    category: "smartphone",
    price: 699000,
    oldPrice: 750000,
    specs: "A19 Pro • 256GB • 48MP ProRAW • 6.3\" OLED",
    emoji: "📱",
    badge: "hot",
    image: "https://tse4.mm.bing.net/th/id/OIP.LCfZ-oSu8BW6Rp4JnXvE1AHaEJ?w=1024&h=574&rs=1&pid=ImgDetMain&o=7&rm=3", // iPhone Style
    brand: "Apple",
    rating: 4.9,
    reviews: 312
  },
  {
    id: 2,
    name: "iPhone 16 Pro Max",
    category: "smartphone",
    price: 589000,
    oldPrice: 630000,
    specs: "A18 Pro • 256GB • 48MP • 6.9\" OLED",
    emoji: "📱",
    badge: "sale",
    image: "https://images.unsplash.com/photo-1678685888221-cda773a3dcdb?q=80&w=1000&auto=format&fit=crop", 
    brand: "Apple",
    rating: 4.8,
    reviews: 540
  },
  {
    id: 3,
    name: "Samsung Galaxy S25 Ultra",
    category: "smartphone",
    price: 540000,
    oldPrice: null,
    specs: "Snapdragon 8 Elite • 512GB • 200MP • S Pen",
    emoji: "📱",
    badge: "new",
    image: "https://images.samsung.com/is/image/samsung/p6pim/kz_ru/s2602/gallery/kz-ru-galaxy-s26-ultra-s948-582105-sm-s948bzkqskz-thumb-551279119?$Q90_330_330_F_PNG$",
    brand: "Samsung",
    rating: 4.7,
    reviews: 198
  },
  {
    id: 7,
    name: "Sony Alpha A7 V",
    category: "camera",
    price: 780000,
    oldPrice: 850000,
    specs: "61MP Full-Frame • 4K120 • AI AF • IBIS",
    emoji: "📷",
    badge: "hot",
    image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=1000&auto=format&fit=crop", // Camera
    brand: "Sony",
    rating: 4.9,
    reviews: 78
  },
  {
    id: 11,
    name: "Samsung QLED 65\" Q90D",
    category: "tv",
    price: 560000,
    oldPrice: 640000,
    specs: "4K 240Hz • MiniLED • HDR2000 • Smart TV",
    emoji: "📺",
    badge: "hot",
    image: "https://images.samsung.com/is/image/samsung/p6pim/kz_ru/qe65qn90dauxce/gallery/kz-ru-qled-qn90d-qe65qn90dauxce-541246439?$Q90_1920_1280_F_PNG$", // TV
    brand: "Samsung",
    rating: 4.7,
    reviews: 96
  },
  {
    id: 14,
    name: "Apple Vision Pro 2",
    category: "smart",
    price: 1500000,
    oldPrice: null,
    specs: "M4 + R2 • visionOS 3 • 4K Per Eye • 3D Camera",
    emoji: "🥽",
    badge: "hot",
    image: "https://th.bing.com/th/id/OIP.NcLwt7tlZcXZXLEYMsnKDgHaE8?w=280&h=186&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3", // Vision Pro
    brand: "Apple",
    rating: 4.8,
    reviews: 67
  },
  {
    id: 16,
    name: "Apple Watch Ultra 3",
    category: "smart",
    price: 420000,
    oldPrice: null,
    specs: "Titanium • 72h Battery • Precision GPS L5",
    emoji: "⌚",
    badge: "new",
    image: "https://images.unsplash.com/photo-1434493907317-a46b5bbe7834?q=80&w=1000&auto=format&fit=crop", // Smart Watch
    brand: "Apple",
    rating: 4.9,
    reviews: 118
  }
];

const PROMO_CODES = {
  'SUPERPRICE2026': { discount: 10, label: '10% жеңілдік' },
  'TECHMARKET': { discount: 15, label: '15% жеңілдік' },
  'NEWUSER': { discount: 20, label: '20% жеңілдік' }
};

// ===== STATE =====
let cart = JSON.parse(localStorage.getItem('tmCart') || '[]');
let wishlist = JSON.parse(localStorage.getItem('tmWish') || '[]');
let currentPromo = null;
let toastTimer = null;

// ===== CART =====
function getCartCount() { return cart.reduce((s, i) => s + i.qty, 0); }
function getCartTotal() { return cart.reduce((s, i) => s + i.price * i.qty, 0); }

function saveCart() {
  localStorage.setItem('tmCart', JSON.stringify(cart));
  updateCartBadge();
}

function updateCartBadge() {
  const badges = document.querySelectorAll('.cart-count-badge');
  badges.forEach(b => {
    const count = getCartCount();
    b.textContent = count;
    b.style.display = count > 0 ? 'flex' : 'none';
  });
}

function addToCart(id) {
  const product = PRODUCTS.find(p => p.id === id);
  if (!product) return;
  const existing = cart.find(x => x.id === id);
  if (existing) existing.qty++;
  else cart.push({ id, name: product.name, price: product.price, emoji: product.emoji, image: product.image, qty: 1 });
  saveCart();
  showToast('✅', product.name + ' себетке қосылды!');
  if (typeof renderProducts === 'function') renderProducts();
}

function removeFromCart(id) {
  cart = cart.filter(x => x.id !== id);
  saveCart();
}

function changeQty(id, delta) {
  const item = cart.find(x => x.id === id);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) cart = cart.filter(x => x.id !== id);
  saveCart();
}

function clearCart() {
  if (confirm('Себетті тазалауды растаңыз')) {
    cart = []; saveCart();
    if (typeof renderCart === 'function') renderCart();
  }
}

function checkout() {
  const user = localStorage.getItem('tmUser');
  if (!user) { window.location.href = 'login.html'; return; }
  cart = []; saveCart();
  document.querySelector('.cart-page-content').style.display = 'none';
  document.getElementById('orderSuccess').style.display = 'block';
}

// ===== WISHLIST =====
function saveWishlist() { localStorage.setItem('tmWish', JSON.stringify(wishlist)); }

function toggleWishlist(id) {
  const idx = wishlist.indexOf(id);
  if (idx === -1) {
    wishlist.push(id);
    showToast('❤️', 'Таңдаулыларға қосылды!');
  } else {
    wishlist.splice(idx, 1);
  }
  saveWishlist();
  if (typeof renderProducts === 'function') renderProducts();
}

// ===== TOAST =====
function showToast(icon, msg) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  document.getElementById('toastIcon').textContent = icon;
  document.getElementById('toastMsg').textContent = msg;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2800);
}

// ===== AUTH UI =====
function initAuthUI() {
  const user = localStorage.getItem('tmUser');
  const loginBtn = document.getElementById('loginNavBtn');
  const userMenu = document.getElementById('userMenu');
  const userAvatar = document.getElementById('userAvatar');
  const userDropdown = document.getElementById('userDropdown');

  if (user) {
    const u = JSON.parse(user);
    if (loginBtn) loginBtn.style.display = 'none';
    if (userMenu) userMenu.style.display = 'block';
    if (userAvatar) userAvatar.textContent = u.name ? u.name.charAt(0).toUpperCase() : '👤';
    if (document.getElementById('dropdownName')) document.getElementById('dropdownName').textContent = u.name || 'Қонақ';
    if (document.getElementById('dropdownEmail')) document.getElementById('dropdownEmail').textContent = u.email !== 'guest' ? u.email : 'Қонақ режімі';
  } else {
    if (loginBtn) loginBtn.style.display = 'flex';
    if (userMenu) userMenu.style.display = 'none';
  }

  if (userAvatar && userDropdown) {
    userAvatar.addEventListener('click', () => userDropdown.classList.toggle('show'));
    document.addEventListener('click', (e) => {
      if (!userMenu.contains(e.target)) userDropdown.classList.remove('show');
    });
  }
}

function logout() {
  localStorage.removeItem('tmUser');
  window.location.reload();
}

// ===== NAV SCROLL =====
function initNavScroll() {
  const nav = document.querySelector('nav');
  if (!nav) return;
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 20);
  });
}

// ===== PROMO CODE =====
function applyPromo() {
  const input = document.getElementById('promoInput');
  const feedback = document.getElementById('promoFeedback');
  if (!input) return;
  const code = input.value.trim().toUpperCase();
  const promo = PROMO_CODES[code];
  if (promo) {
    currentPromo = promo;
    feedback.textContent = '🎉 ' + promo.label + ' қолданылды!';
    feedback.className = 'promo-success show';
    if (typeof renderCartSummary === 'function') renderCartSummary();
  } else {
    feedback.textContent = '❌ Промокод табылмады';
    feedback.className = 'promo-success show';
    feedback.style.color = 'var(--error)';
    feedback.style.background = '#ef444410';
    currentPromo = null;
  }
}

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
  initNavScroll();
  initAuthUI();
  updateCartBadge();
});
