/* Page d'accueil : navigation, barre de lecture, apparitions au défilement, compteurs.
   Le thème et la langue sont gérés par app.js ; le chat Momo par chat.js. */
(function () {
  'use strict';

  const racine = document.documentElement;
  const mouvementReduit = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const nav = document.getElementById('nav');
  const menuBtn = document.getElementById('menu-btn');
  const liens = document.getElementById('nav-links');

  /* ---------- Entrée de la page ---------- */
  document.querySelectorAll('.intro').forEach((el, i) => el.style.setProperty('--d', i));
  // On attend les polices (au plus 700 ms) pour que le texte n'ondule pas pendant l'animation
  const pret = () => requestAnimationFrame(() => document.body.classList.add('ready'));
  if (document.fonts && document.fonts.ready) {
    Promise.race([document.fonts.ready, new Promise(r => setTimeout(r, 700))]).then(pret);
  } else {
    pret();
  }

  /* ---------- Compteurs : de 0 à la valeur, au format de la langue affichée ---------- */
  const formater = (v, dec) => v.toLocaleString(racine.lang === 'en' ? 'en-US' : 'fr-FR',
    { minimumFractionDigits: dec, maximumFractionDigits: dec });

  function compter(el) {
    const cible = +el.dataset.val, dec = +el.dataset.dec;
    if (mouvementReduit) { el.textContent = formater(cible, dec); return; }
    const debut = performance.now(), duree = 1600;
    const pas = t => {
      const p = Math.min((t - debut) / duree, 1);
      el.textContent = formater(cible * (1 - Math.pow(1 - p, 4)), dec);
      if (p < 1) requestAnimationFrame(pas);
    };
    requestAnimationFrame(pas);
  }

  /* ---------- Apparition au défilement ---------- */
  document.querySelectorAll('.timeline, .others-list, .skills').forEach(liste =>
    [...liste.children].forEach((enfant, k) => enfant.style.setProperty('--k', Math.min(k, 8))));

  const blocs = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !mouvementReduit) {
    const io = new IntersectionObserver(entrees => entrees.forEach(e => {
      if (!e.isIntersecting) return;
      e.target.classList.add('in');
      e.target.querySelectorAll('.count').forEach(compter);
      io.unobserve(e.target);
    }), { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });
    blocs.forEach(b => io.observe(b));
  } else {
    blocs.forEach(b => b.classList.add('in'));
  }

  /* ---------- Navigation : bordure, masquage en descente, barre de lecture ---------- */
  const barre = document.querySelector('.progress span');
  let dernierY = window.scrollY, attente = false;

  function surDefilement() {
    const y = window.scrollY;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    if (barre) barre.style.transform = `scaleX(${max > 0 ? Math.min(y / max, 1) : 0})`;
    nav.classList.toggle('scrolled', y > 8);
    const ouvert = nav.classList.contains('open');
    if (!ouvert) nav.classList.toggle('hidden', y > 480 && y > dernierY + 4);
    if (y < dernierY - 4) nav.classList.remove('hidden');
    dernierY = y;
    attente = false;
  }
  window.addEventListener('scroll', () => {
    if (!attente) { attente = true; requestAnimationFrame(surDefilement); }
  }, { passive: true });
  surDefilement();

  /* ---------- Lien actif selon la section affichée ---------- */
  const sections = [...document.querySelectorAll('main section[id]')];
  const liensNav = [...liens.querySelectorAll('a[href^="#"]')];
  if ('IntersectionObserver' in window) {
    const espion = new IntersectionObserver(entrees => entrees.forEach(e => {
      if (!e.isIntersecting) return;
      liensNav.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + e.target.id));
    }), { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach(s => espion.observe(s));
  }

  /* ---------- Menu mobile ---------- */
  function basculerMenu(ouvrir) {
    nav.classList.toggle('open', ouvrir);
    menuBtn.setAttribute('aria-expanded', String(ouvrir));
  }
  menuBtn.addEventListener('click', () => basculerMenu(!nav.classList.contains('open')));
  liens.addEventListener('click', e => { if (e.target.closest('a')) basculerMenu(false); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') basculerMenu(false); });
  document.addEventListener('click', e => { if (!e.target.closest('.nav')) basculerMenu(false); });

  /* ---------- Réveil de l'application de scoring ----------
     Son hébergement gratuit (Render) la met en veille après 15 minutes sans visite et le réveil
     prend près d'une minute. On la contacte une fois par visite, en arrière-plan, sans cookie. */
  try {
    if (!sessionStorage.getItem('reveil-scoring')) {
      sessionStorage.setItem('reveil-scoring', '1');
      fetch('https://credit-risk-app-c8ye.onrender.com/', { mode: 'no-cors', cache: 'no-store', credentials: 'omit' })
        .catch(() => { /* hors ligne : sans conséquence */ });
    }
  } catch (e) { /* stockage indisponible */ }
})();
