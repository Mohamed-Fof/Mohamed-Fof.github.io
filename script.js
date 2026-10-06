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

// ===== MOTION : un seul système d'animation pour tout le site =====
// Pour revenir en arrière : supprimer ce bloc et le bloc « MOTION » de style.css.
(function () {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) return;

  // 1. Apparition au défilement : fondu + légère montée, en cascade dans une même grille
  const CIBLES = [
    '.section-header', '.about-text > *', '.about-passion', '.timeline-item', '.projet-card', '.skill-category',
    '.momo-item', '.momo-bot',
    '.famille > :not(.types-grille):not(.jeux-liste)', '.type-jeu', '.jeu-ext', '.notion', '.jeu-lab'
  ].join(',');
  // Un élément déjà contenu dans un bloc animé ne s'anime pas une seconde fois
  const els = [...document.querySelectorAll(CIBLES)].filter(el => !el.parentElement.closest(CIBLES));
  if (!els.length) return;
  document.documentElement.classList.add('motion');
  els.forEach(el => {
    const freres = [...el.parentElement.children].filter(c => els.includes(c));
    el.style.setProperty('--i', Math.min(freres.indexOf(el), 6));
    el.classList.add('reveal');
  });
  const io = new IntersectionObserver(entries => entries.forEach(e => {
    if (!e.isIntersecting) return;
    const el = e.target;
    io.unobserve(el);
    el.classList.add('visible');
    // Une fois arrivé, on rend l'élément à son style normal (ses effets de survol fonctionnent à nouveau)
    const fin = ev => {
      if (ev.target !== el || ev.propertyName !== 'transform') return;
      el.removeEventListener('transitionend', fin);
      el.classList.remove('reveal', 'visible');
      el.style.removeProperty('--i');
    };
    el.addEventListener('transitionend', fin);
  }), { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  els.forEach(el => io.observe(el));

  // 2. Laboratoire (Jeux & Société) : les scores rebondissent, la courbe d'évolution se trace
  const rejouer = (el, cls) => { el.classList.remove(cls); void el.offsetWidth; el.classList.add(cls); };
  ['score-moi', 'score-adv'].forEach(id => {
    const el = document.getElementById(id);
    if (el) new MutationObserver(() => rejouer(el, 'rebond')).observe(el, { childList: true, characterData: true, subtree: true });
  });
  const graphe = document.getElementById('evo-graphe');
  if (graphe) new MutationObserver(() => { if (graphe.children.length) rejouer(graphe, 'trace'); }).observe(graphe, { childList: true });
})();

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
// Portrait du hero : légère inclinaison 3D qui suit la souris (ordinateur uniquement, mouvement réduit respecté)
const portrait = document.querySelector('.portrait');
const hero = document.querySelector('.hero');
if (portrait && hero &&
    window.matchMedia('(hover: hover) and (pointer: fine)').matches &&
    !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  let raf = 0;
  hero.addEventListener('pointermove', e => {
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(() => {
      const r = portrait.getBoundingClientRect();
      const x = (e.clientX - (r.left + r.width / 2)) / window.innerWidth;
      const y = (e.clientY - (r.top + r.height / 2)) / window.innerHeight;
      portrait.style.setProperty('--rx', (x * 12).toFixed(2) + 'deg');
      portrait.style.setProperty('--ry', (-y * 12).toFixed(2) + 'deg');
    });
  });
  hero.addEventListener('pointerleave', () => {
    cancelAnimationFrame(raf);
    portrait.style.setProperty('--rx', '0deg');
    portrait.style.setProperty('--ry', '0deg');
  });
}
