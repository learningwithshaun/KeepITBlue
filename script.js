/* =============================================
   KEEPITBLUE — Main JS
   ============================================= */

/* ---------- Scroll-to-top button ---------- */
const scrollBtn = document.createElement('button');
scrollBtn.id = 'scrollTop';
scrollBtn.innerHTML = '&#8679;';
scrollBtn.setAttribute('aria-label', 'Scroll to top');
document.body.appendChild(scrollBtn);

scrollBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

/* ---------- Nav scroll effect + scroll-top visibility ---------- */
window.addEventListener('scroll', () => {
  const header = document.querySelector('.header');
  if (header) header.classList.toggle('scrolled', window.scrollY > 60);
  scrollBtn.classList.toggle('show', window.scrollY > 220);
  revealOnScroll();
});

/* ---------- Mobile hamburger menu ---------- */
document.addEventListener('DOMContentLoaded', () => {

  const header = document.querySelector('.header');
  const nav    = header?.querySelector('nav');

  if (header && nav) {
    const burger = document.createElement('div');
    burger.className = 'hamburger';
    burger.setAttribute('aria-label', 'Toggle menu');
    burger.setAttribute('role', 'button');
    burger.setAttribute('tabindex', '0');
    burger.innerHTML = '<span></span><span></span><span></span>';
    header.appendChild(burger);

    burger.addEventListener('click', () => {
      burger.classList.toggle('open');
      nav.classList.toggle('open');
    });

    burger.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') burger.click();
    });

    // Close on outside click
    document.addEventListener('click', e => {
      if (!header.contains(e.target)) {
        burger.classList.remove('open');
        nav.classList.remove('open');
      }
    });
  }

  /* ---------- Hero animation ---------- */
  const h1 = document.querySelector('.hero-content h1');
  const hp = document.querySelector('.hero-content p');
  if (h1) setTimeout(() => h1.classList.add('visible'), 300);
  if (hp) setTimeout(() => hp.classList.add('visible'), 500);

  /* ---------- Scroll-reveal: register elements ---------- */
  document
    .querySelectorAll(
      '.project-card, .opportunity-item, .team-member, .donation-card, .gallery-container img, .get-involved-container, .info-section, .history-section'
    )
    .forEach(el => el.classList.add('reveal'));

  revealOnScroll(); // run once on load

  /* ---------- Timeline list animation ---------- */
  document.querySelectorAll('ul li').forEach((li, i) => {
    li.style.setProperty('--li-index', i);
    li.classList.add('timeline-item');
  });

  /* ---------- Stats counter & project filter ---------- */
  initStatsCounter();
  initProjectFilter();

  /* ---------- Donation form ---------- */
  const donationForm = document.getElementById('donation-form');
  if (donationForm) setupDonationForm(donationForm);

  /* ---------- Payment method conditional fields ---------- */
  const paymentSelect = document.getElementById('payment-method');
  const cardDetails   = document.getElementById('credit-card-details');
  const paypalInfo    = document.getElementById('paypal-info');

  if (paymentSelect) {
    const updatePaymentUI = () => {
      const val = paymentSelect.value;
      if (cardDetails) cardDetails.style.display = (val === 'credit-card' || val === 'debit-card') ? 'block' : 'none';
      if (paypalInfo)  paypalInfo.style.display  = val === 'paypal' ? 'block' : 'none';
    };
    paymentSelect.addEventListener('change', updatePaymentUI);
    updatePaymentUI();
  }
});

/* ---------- Stats counter ---------- */
function initStatsCounter() {
  const stats = document.querySelectorAll('.stat-number');
  if (!stats.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = +el.dataset.target;
      const duration = 1600;
      const step = target / (duration / 16);
      let current = 0;
      const timer = setInterval(() => {
        current = Math.min(current + step, target);
        el.textContent = Math.floor(current).toLocaleString();
        if (current >= target) clearInterval(timer);
      }, 16);
      observer.unobserve(el);
    });
  }, { threshold: 0.5 });

  stats.forEach(el => observer.observe(el));
}

/* ---------- Project filter ---------- */
function initProjectFilter() {
  const btns  = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('.project-card[data-category]');
  if (!btns.length) return;

  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      btns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      cards.forEach(card => {
        const show = filter === 'all' || card.dataset.category === filter;
        card.classList.toggle('hidden', !show);
        if (show) card.classList.remove('hidden');
      });
    });
  });
}

/* ---------- Scroll reveal helper ---------- */
function revealOnScroll() {
  const vp = window.innerHeight * 0.93;
  document.querySelectorAll('.reveal').forEach(el => {
    if (el.getBoundingClientRect().top < vp) el.classList.add('visible');
  });

  // Timeline items
  document.querySelectorAll('ul li').forEach(li => {
    if (li.getBoundingClientRect().top < vp) li.classList.add('visible');
  });
}

/* ---------- Donation form setup ---------- */
function setupDonationForm(form) {
  const modal        = document.getElementById('donation-modal');
  const modalContent = document.getElementById('modal-content');

  // Add close button if not present
  ensureModalClose(modal);

  form.addEventListener('submit', e => {
    e.preventDefault();
    if (!validateDonationForm(form)) return;

    const name   = document.getElementById('full-name').value.trim();
    const email  = document.getElementById('email').value.trim();
    const phone  = document.getElementById('phone').value.trim();
    const amount = parseFloat(document.getElementById('amount').value).toFixed(2);
    const method = document.getElementById('payment-method');
    const methodText = method.options[method.selectedIndex].text;

    modalContent.innerHTML = `
      <button class="modal-close" aria-label="Close">&times;</button>
      <div class="modal-icon">💙</div>
      <h2>Thank You, ${escHtml(name)}!</h2>
      <p>Your donation has been received. Here's a summary:</p>
      <p><strong>Email:</strong> ${escHtml(email)}</p>
      ${phone ? `<p><strong>Phone:</strong> ${escHtml(phone)}</p>` : ''}
      <p><strong>Amount:</strong> $${amount}</p>
      <p><strong>Payment method:</strong> ${escHtml(methodText)}</p>
      <br>
      <button id="close-modal" style="width:100%">Done</button>
    `;

    openModal(modal);

    modalContent.querySelector('#close-modal').addEventListener('click', () => closeModal(modal));
    modalContent.querySelector('.modal-close').addEventListener('click', () => closeModal(modal));

    form.reset();
    showToast('Donation submitted — thank you! 💙');
  });
}

/* ---------- Donation form validation ---------- */
function validateDonationForm(form) {
  clearErrors(form);
  let valid = true;

  const name   = form.querySelector('#full-name');
  const email  = form.querySelector('#email');
  const amount = form.querySelector('#amount');

  if (!name.value.trim())              { showError(name,   'Full name is required.');       valid = false; }
  if (!isValidEmail(email.value))       { showError(email,  'Enter a valid email address.'); valid = false; }
  if (!amount.value || amount.value < 1){ showError(amount, 'Please enter an amount ≥ $1.'); valid = false; }

  return valid;
}

/* ---------- Helpers ---------- */
function isValidEmail(v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()); }

function showError(input, msg) {
  input.classList.add('error');
  const span = document.createElement('span');
  span.className = 'field-error';
  span.textContent = msg;
  input.parentNode.appendChild(span);
}

function clearErrors(form) {
  form.querySelectorAll('.error').forEach(el => el.classList.remove('error'));
  form.querySelectorAll('.field-error').forEach(el => el.remove());
}

function escHtml(str) {
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

function openModal(modal) {
  if (!modal) return;
  modal.style.display = 'flex';
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';

  modal.addEventListener('click', e => {
    if (e.target === modal) closeModal(modal);
  }, { once: true });
}

function closeModal(modal) {
  if (!modal) return;
  modal.style.display = 'none';
  modal.classList.remove('active');
  document.body.style.overflow = '';
}

function ensureModalClose(modal) {
  if (!modal) return;
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeModal(modal);
  });
}

/* ---------- Toast ---------- */
let toastTimer;
function showToast(msg) {
  let toast = document.getElementById('toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast';
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 3400);
}