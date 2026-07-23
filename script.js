// Navbar scroll effect
window.addEventListener('scroll', () => {
  const nav = document.getElementById('navbar');
  nav.style.boxShadow = window.scrollY > 50
    ? '0 4px 20px rgba(0,0,0,0.12)' : '0 1px 20px rgba(0,0,0,0.08)';
});

// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    e.preventDefault();
    const el = document.querySelector(a.getAttribute('href'));
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  });
});

// Animate skill bars on scroll
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.fill').forEach(bar => {
        bar.style.width = bar.style.width;
      });
    }
  });
}, { threshold: 0.3 });

document.querySelectorAll('.skill-category').forEach(el => observer.observe(el));

// Animate elements on scroll
const fadeObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.projet-card, .tl-content, .skill-category, .contact-card').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(20px)';
  el.style.transition = 'opacity 0.5s, transform 0.5s';
  fadeObserver.observe(el);
});

// Hamburger menu
const hamburger = document.getElementById('hamburger');
const navUl = document.querySelector('nav ul');

function openMenu() {
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  navUl.style.display = 'flex';
  navUl.style.flexDirection = 'column';
  navUl.style.position = 'absolute';
  navUl.style.top = '70px';
  navUl.style.right = '5%';
  navUl.style.left = '5%';
  navUl.style.background = isDark ? '#1e293b' : '#fff';
  navUl.style.padding = '1rem 1.5rem';
  navUl.style.borderRadius = '12px';
  navUl.style.boxShadow = '0 10px 30px rgba(0,0,0,0.12)';
  navUl.style.gap = '0.8rem';
  navUl.style.zIndex = '999';
  hamburger.textContent = '✕';
}

function closeMenu() {
  navUl.removeAttribute('style');
  hamburger.textContent = '☰';
}

hamburger.addEventListener('click', () => {
  navUl.style.display === 'flex' ? closeMenu() : openMenu();
});

// Fermer le menu au clic sur un lien
navUl.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', closeMenu);
});

// Fermer le menu au clic en dehors
document.addEventListener('click', e => {
  if (!e.target.closest('nav') && navUl.style.display === 'flex') closeMenu();
});