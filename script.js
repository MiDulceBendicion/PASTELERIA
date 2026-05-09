// CURSOR
const cursor = document.getElementById('cursor');
const ring = document.getElementById('cursor-ring');
let mx = 0, my = 0, rx = 0, ry = 0;

document.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  cursor.style.transform = `translate(${mx - 4}px, ${my - 4}px)`;
});

(function animateRing() {
  rx += (mx - rx) * 0.12;
  ry += (my - ry) * 0.12;
  ring.style.transform = `translate(${rx - 18}px, ${ry - 18}px)`;
  requestAnimationFrame(animateRing);
})();

document.querySelectorAll('a, button, .cat-btn').forEach(el => {
  el.addEventListener('mouseenter', () => ring.classList.add('hover'));
  el.addEventListener('mouseleave', () => ring.classList.remove('hover'));
});

// SCROLL HEADER
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 60);
});

// MOBILE MENU
function toggleMobile() {
  document.getElementById('mobileNav').classList.toggle('active');
}
function closeMobile() {
  document.getElementById('mobileNav').classList.remove('active');
}

// REVEAL ON SCROLL
const reveals = document.querySelectorAll('.reveal');
const io = new IntersectionObserver(entries => {
  entries.forEach((e, i) => {
    if (e.isIntersecting) {
      e.target.style.transitionDelay = (i * 0.05) + 's';
      e.target.classList.add('visible');
    }
  });
}, { threshold: 0.1 });
reveals.forEach(el => io.observe(el));

// CART
let cart = JSON.parse(localStorage.getItem('dg_cart') || '[]');
const cartDrawer = document.getElementById('cartDrawer');
const overlay = document.getElementById('overlay');

document.getElementById('openCart').onclick = () => {
  cartDrawer.classList.add('active');
  overlay.classList.add('active');
};
document.getElementById('closeCart').onclick = closeCart;
overlay.onclick = () => { closeCart(); closeMobile(); };

function closeCart() {
  cartDrawer.classList.remove('active');
  overlay.classList.remove('active');
}

function addToCart(name, price, btn) {
  cart.push({ name, price });
  save();
  btn.textContent = '✓';
  btn.classList.add('added');
  setTimeout(() => { btn.textContent = '+'; btn.classList.remove('added'); }, 1200);
}

function removeItem(i) {
  cart.splice(i, 1); save();
}

function save() {
  localStorage.setItem('dg_cart', JSON.stringify(cart));
  render();
}

function render() {
  const cnt = document.getElementById('cartContent');
  const count = document.getElementById('cartCount');
  const total = document.getElementById('totalPrice');
  count.textContent = cart.length;
  if (!cart.length) {
    cnt.innerHTML = '<div class="cart-empty">Tu carrito está vacío 🍰</div>';
    total.textContent = 'S/ 0';
    return;
  }
  let sum = 0;
  cnt.innerHTML = cart.map((item, i) => {
    sum += item.price;
    return `<div class="cart-item">
      <div>
        <h4>${item.name}</h4>
        <div class="cart-item-price">S/ ${item.price.toFixed(2)}</div>
      </div>
      <button class="cart-remove" onclick="removeItem(${i})">✕</button>
    </div>`;
  }).join('');
  total.textContent = `S/ ${sum.toFixed(2)}`;
}

// FILTER
function filterProducts(cat, btn) {
  document.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
  document.querySelectorAll('.product-card').forEach(card => {
    card.style.display = (cat === 'all' || card.classList.contains(cat)) ? '' : 'none';
  });
}

render();