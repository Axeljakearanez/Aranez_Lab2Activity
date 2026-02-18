// 1️⃣ Global variables
let currentUser = null;
window.db = {
  accounts: JSON.parse(localStorage.getItem('accounts')) || []
};

// 2️⃣ Navigation helper
function navigateTo(hash) {
  window.location.hash = hash;
}

// 3️⃣ Router
function handleRouting() {
  const hash = window.location.hash || '#/';

  // Hide all pages
  document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));

  // Redirect unauthorized users (login/profile/admin logic untouched)
  if (hash === '#/profile' && !currentUser) {
    navigateTo('#/login');
    return;
  }
  if (hash === '#/admin' && (!currentUser || currentUser.role !== 'admin')) {
    navigateTo('#/');
    return;
  }

  // Map hash to page IDs
  let targetPage = 'home-page';
  if (hash === '#/') targetPage = 'home-page';
  if (hash === '#/login') targetPage = 'login-page';
  if (hash === '#/register') targetPage = 'register-page';
  if (hash === '#/profile') targetPage = 'profile-page';
  if (hash === '#/admin') targetPage = 'admin-page';
  if (hash === '#/verify-email') targetPage = 'verify-page';

  // Show the target page
  const pageEl = document.getElementById(targetPage);
  if (pageEl) pageEl.classList.add('active');

  // 🔹 If verify page, show verification message
  if (targetPage === 'verify-page') {
    const email = localStorage.getItem('unverified_email');
    const msg = document.getElementById('verifyMessage');
    if (email && msg) {
      msg.textContent = `Verification sent to ${email}`;
    }
  }
}

// 4️⃣ Registration only (login untouched)
function registerUser() {
  const firstName = document.getElementById('firstName').value.trim();
  const lastName = document.getElementById('lastName').value.trim();
  const email = document.getElementById('regEmail').value.trim();
  const password = document.getElementById('regPassword').value;

  if (!firstName || !lastName || !email || !password) {
    alert("Please fill in all fields");
    return;
  }
  if (password.length < 6) {
    alert("Password must be at least 6 characters");
    return;
  }

  const exists = window.db.accounts.find(acc => acc.email === email);
  if (exists) {
    alert("Email already exists");
    return;
  }

  const newAccount = { firstName, lastName, email, password, role: "user", verified: false };
  window.db.accounts.push(newAccount);
  localStorage.setItem('accounts', JSON.stringify(window.db.accounts));
  localStorage.setItem('unverified_email', email);

  navigateTo('#/verify-email');
}

// 5️⃣ Email Verification only
function simulateVerification() {
  const email = localStorage.getItem('unverified_email');
  const user = window.db.accounts.find(acc => acc.email === email);

  if (user) {
    user.verified = true;
    localStorage.setItem('accounts', JSON.stringify(window.db.accounts));
    localStorage.removeItem('unverified_email');
    alert(`Email ${email} verified!`);
    navigateTo('#/login');
  } else {
    alert("No unverified email found");
  }
}

// 6️⃣ Event listeners
window.addEventListener('hashchange', handleRouting);
window.addEventListener('load', () => {
  if (!window.location.hash) navigateTo('#/register'); // default to register
  handleRouting();

  // 🔹 Only hook Register & Verify buttons
  const regBtn = document.getElementById('registerBtn');
  if (regBtn) regBtn.addEventListener('click', registerUser);

  const verifyBtn = document.getElementById('verifyBtn');
  if (verifyBtn) verifyBtn.addEventListener('click', simulateVerification);
});
