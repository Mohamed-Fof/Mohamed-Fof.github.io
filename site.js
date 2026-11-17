/* Comportements communs à l'accueil et à Jeux & Société : navigation, barre de lecture,
   apparitions au défilement, compteurs ; puis les éléments propres à chaque page.
   Le thème et la langue sont gérés par app.js ; le chat Momo par chat.js. */
(function () {
  'use strict';

  const racine = document.documentElement;
  const mouvementReduit = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $ = s => document.querySelector(s);
  const $$ = s => [...document.querySelectorAll(s)];
  const nav = $('#nav');
  const menuBtn = $('#menu-btn');
  const liens = $('#nav-links');
  const locale = () => (racine.lang === 'en' ? 'en-US' : 'fr-FR');

  /* ---------- Entrée de la page ---------- */
  $$('.intro').forEach((el, i) => el.style.setProperty('--d', i));
  const pret = () => requestAnimationFrame(() => document.body.classList.add('ready'));
  if (document.fonts && document.fonts.ready) Promise.race([document.fonts.ready, new Promise(r => setTimeout(r, 700))]).then(pret);
  else pret();

  /* ---------- Compteurs ---------- */
  const formater = (v, dec) => v.toLocaleString(locale(), { minimumFractionDigits: dec, maximumFractionDigits: dec });
  function compter(el) {
    const cible = +el.dataset.val, dec = +el.dataset.dec;
    if (mouvementReduit) { el.textContent = formater(cible, dec); return; }
    const debut = performance.now(), duree = 1700;
    const pas = t => {
      const p = Math.min((t - debut) / duree, 1);
      el.textContent = formater(cible * (1 - Math.pow(1 - p, 4)), dec);
      if (p < 1) requestAnimationFrame(pas);
    };
    requestAnimationFrame(pas);
  }

  /* ---------- Apparition au défilement, en cascade dans une même grille ---------- */
  const blocs = $$('.reveal');
  blocs.forEach(el => {
    const freres = [...el.parentElement.children].filter(c => c.classList.contains('reveal'));
    if (freres.length > 1) el.style.setProperty('--k', Math.min(freres.indexOf(el), 5));
  });
  $$('.tile .chips').forEach(l => [...l.children].forEach((li, c) => li.style.setProperty('--c', Math.min(c, 12))));

  const entrer = el => { el.classList.add('in'); el.querySelectorAll('.count').forEach(compter); };
  if ('IntersectionObserver' in window && !mouvementReduit) {
    const io = new IntersectionObserver(entrees => entrees.forEach(e => {
      if (!e.isIntersecting) return;
      entrer(e.target);
      io.unobserve(e.target);
    }), { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });
    blocs.forEach(b => io.observe(b));
  } else {
    blocs.forEach(entrer);
  }

  /* ---------- Navigation : bordure, masquage en descente, barre de lecture, frise ---------- */
  const barre = $('.progress span');
  let dernierY = window.scrollY, attente = false;
  function surDefilement() {
    const y = window.scrollY;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    if (barre) barre.style.transform = `scaleX(${max > 0 ? Math.min(y / max, 1) : 0})`;
    nav.classList.toggle('scrolled', y > 8);
    if (!nav.classList.contains('open')) nav.classList.toggle('hidden', y > 520 && y > dernierY + 4);
    if (y < dernierY - 4) nav.classList.remove('hidden');
    dernierY = y;
    remplirFrise();
    attente = false;
  }
  window.addEventListener('scroll', () => { if (!attente) { attente = true; requestAnimationFrame(surDefilement); } }, { passive: true });

  // Lien actif selon la section affichée (accueil uniquement)
  const sections = $$('main section[id]');
  const liensSection = $$('.nav-links a[href*="#"]');
  if (sections.length && 'IntersectionObserver' in window) {
    const espion = new IntersectionObserver(entrees => entrees.forEach(e => {
      if (!e.isIntersecting) return;
      liensSection.forEach(a => a.classList.toggle('active', a.hash === '#' + e.target.id));
    }), { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach(s => espion.observe(s));
  }

  // Menu mobile
  function basculerMenu(ouvrir) {
    if (!menuBtn) return;
    nav.classList.toggle('open', ouvrir);
    menuBtn.setAttribute('aria-expanded', String(ouvrir));
  }
  if (menuBtn) menuBtn.addEventListener('click', () => basculerMenu(!nav.classList.contains('open')));
  if (liens) liens.addEventListener('click', e => { if (e.target.closest('a')) basculerMenu(false); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') basculerMenu(false); });
  document.addEventListener('click', e => { if (!e.target.closest('.nav')) basculerMenu(false); });

  /* ---------- Réseau de neurones de l'accueil ----------
     Les liaisons se dessinent couche par couche, puis des signaux circulent en continu :
     une compétence en entrée → une couche cachée → le neurone central (la photo) → un domaine d'application. */
  const nn = $('#nn');
  if (nn) {
    const SVG = 'http://www.w3.org/2000/svg';
    const couche = x => (x < 160 ? 0 : x < 260 ? 1 : x < 400 ? 2 : 3);
    nn.querySelectorAll('.nn-edges line').forEach(l => l.style.setProperty('--e', couche(+l.getAttribute('x1'))));
    nn.querySelectorAll('.nn-node').forEach(n => n.style.setProperty('--e', couche(+n.getAttribute('cx'))));
    nn.querySelectorAll('.nn-label').forEach(t => t.style.setProperty('--e', t.classList.contains('nn-label-in') ? 0 : 4));

    const noeuds = cls => [...nn.querySelectorAll(cls)];
    const entrees = noeuds('.nn-in'), sorties = noeuds('.nn-out');
    const cachees = noeuds('.nn-hid');
    const h1 = cachees.filter(n => +n.getAttribute('cx') < 300), h2 = cachees.filter(n => +n.getAttribute('cx') > 300);
    const anneau = nn.querySelector('.nn-ring');
    const etiquettes = noeuds('.nn-label-out');
    const cx = +anneau.getAttribute('cx'), cy = +anneau.getAttribute('cy');
    const pos = n => [+n.getAttribute('cx'), +n.getAttribute('cy')];
    const hasard = t => t[Math.floor(Math.random() * t.length)];
    const flash = el => { el.classList.add('on'); setTimeout(() => el.classList.remove('on'), 420); };
    const calque = $('#nn-pulses');

    function signal() {
      const a = hasard(entrees), b = hasard(h1), c = hasard(h2), s = hasard(sorties);
      const [bx, by] = pos(b), [ccx, ccy] = pos(c);
      const etapes = [
        { de: pos(a), a: [bx, by], fin: () => flash(b) },
        { de: [bx, by], a: [cx - 76, cy + (by - cy) * .42], fin: () => flash(anneau) },
        { de: [cx + 76, cy + (ccy - cy) * .42], a: [ccx, ccy], fin: () => flash(c) },
        { de: [ccx, ccy], a: pos(s), fin: () => { flash(s); flash(etiquettes[sorties.indexOf(s)]); } }
      ];
      const point = document.createElementNS(SVG, 'circle');
      point.setAttribute('r', '3.6');
      calque.appendChild(point);
      flash(a);
      let i = 0, t0 = performance.now();
      const duree = 520;
      const pas = t => {
        const e = etapes[i], p = Math.min((t - t0) / duree, 1), q = p < .5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
        point.setAttribute('cx', (e.de[0] + (e.a[0] - e.de[0]) * q).toFixed(1));
        point.setAttribute('cy', (e.de[1] + (e.a[1] - e.de[1]) * q).toFixed(1));
        if (p === 1) { e.fin(); i++; t0 = t; if (i === etapes.length) { point.remove(); return; } }
        requestAnimationFrame(pas);
      };
      requestAnimationFrame(pas);
    }

    if (!mouvementReduit) {
      let minuteur = null;
      const demarrer = () => { if (!minuteur) minuteur = setInterval(signal, 380); };
      const arreter = () => { clearInterval(minuteur); minuteur = null; };
      setTimeout(() => {
        if ('IntersectionObserver' in window) new IntersectionObserver(([e]) => (e.isIntersecting && !document.hidden ? demarrer() : arreter())).observe(nn);
        else demarrer();
        document.addEventListener('visibilitychange', () => (document.hidden ? arreter() : demarrer()));
      }, 2200);
    }
  }

  /* ---------- Courbe ROC : seuil réglable ----------
     Courbe lissée d'AUC 0,92 : TPR = 1 − (1 − FPR)^11,5 (aire = 1 − 1/12,5 = 0,92).
     Plus le seuil est haut, moins on signale de dossiers : les deux taux baissent. */
  const seuil = $('#seuil');
  if (seuil) {
    const k = 11.5;
    const pt = (x, y) => [20 + x * 200, 220 - y * 200];
    function majRoc() {
      const s = seuil.value / 100;
      const fpr = Math.pow(1 - s, 3.3);
      const tpr = 1 - Math.pow(1 - fpr, k);
      const [cx, cy] = pt(fpr, tpr);
      const point = $('#roc-dot');
      point.setAttribute('cx', cx.toFixed(1)); point.setAttribute('cy', cy.toFixed(1));
      const gx = $('#roc-gx'), gy = $('#roc-gy');
      gx.setAttribute('x1', cx); gx.setAttribute('x2', cx); gx.setAttribute('y1', cy); gx.setAttribute('y2', 220);
      gy.setAttribute('x1', 20); gy.setAttribute('x2', cx); gy.setAttribute('y1', cy); gy.setAttribute('y2', cy);
      const pct = v => (v * 100).toLocaleString(locale(), { maximumFractionDigits: 0 }) + (racine.lang === 'en' ? '%' : ' %');
      $('#roc-tpr').textContent = pct(tpr);
      $('#roc-fpr').textContent = pct(fpr);
      seuil.style.setProperty('--p', ((seuil.value - seuil.min) / (seuil.max - seuil.min) * 100) + '%');
    }
    seuil.addEventListener('input', majRoc);
    majRoc();
    // Démonstration : le curseur glisse une fois quand le graphique apparaît
    const carte = seuil.closest('.feature');
    if (carte && !mouvementReduit && 'IntersectionObserver' in window) {
      const demo = new IntersectionObserver(([e]) => {
        if (!e.isIntersecting) return;
        demo.disconnect();
        const t0 = performance.now() + 2200;
        const anim = t => {
          const p = Math.min(Math.max((t - t0) / 1800, 0), 1);
          seuil.value = 50 + Math.sin(p * Math.PI * 2) * 25 * (1 - p);
          majRoc();
          if (p < 1) requestAnimationFrame(anim);
        };
        requestAnimationFrame(anim);
      }, { threshold: .4 });
      demo.observe(carte);
    }
    document.getElementById('lang-toggle').addEventListener('click', () => setTimeout(majRoc, 0));
  }

  /* ---------- Parcours : onglets et frise qui se remplit ---------- */
  const onglets = $$('.tab');
  const encre = $('.tab-ink');
  function placerEncre() {
    const actif = $('.tab.active');
    if (!actif || !encre) return;
    encre.style.width = actif.offsetWidth + 'px';
    encre.style.transform = `translateX(${actif.offsetLeft}px)`;
  }
  onglets.forEach(o => o.addEventListener('click', () => {
    onglets.forEach(t => {
      const actif = t === o;
      t.classList.toggle('active', actif);
      t.setAttribute('aria-selected', String(actif));
      document.getElementById(t.getAttribute('aria-controls')).hidden = !actif;
    });
    placerEncre();
    remplirFrise();
  }));
  placerEncre();
  window.addEventListener('resize', placerEncre);
  document.getElementById('lang-toggle').addEventListener('click', () => setTimeout(placerEncre, 0));
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(placerEncre);

  function remplirFrise() {
    $$('.tl:not([hidden])').forEach(tl => {
      const r = tl.getBoundingClientRect();
      const p = Math.min(Math.max((window.innerHeight * 0.6 - r.top) / r.height, 0), 1);
      tl.style.setProperty('--fill', (p * 100).toFixed(1) + '%');
    });
  }
  surDefilement();

  /* ---------- Contact : copier l'adresse ---------- */
  const copier = $('#copier-email');
  if (copier) copier.addEventListener('click', async () => {
    const label = $('#copier-label');
    const avant = label.textContent;
    try {
      await navigator.clipboard.writeText(copier.dataset.email);
      label.textContent = racine.lang === 'en' ? 'Copied!' : 'Adresse copiée !';
      copier.classList.add('copie');
    } catch (e) {
      window.location.href = 'mailto:' + copier.dataset.email;
      return;
    }
    setTimeout(() => { label.textContent = avant; copier.classList.remove('copie'); }, 2000);
  });

  /* ---------- Jeux & Société : les scores rebondissent, la courbe d'évolution se trace ---------- */
  const rejouer = (el, cls) => { el.classList.remove(cls); void el.offsetWidth; el.classList.add(cls); };
  ['score-moi', 'score-adv'].forEach(id => {
    const el = document.getElementById(id);
    if (el) new MutationObserver(() => rejouer(el, 'rebond')).observe(el, { childList: true, characterData: true, subtree: true });
  });
  const graphe = document.getElementById('evo-graphe');
  if (graphe) new MutationObserver(() => { if (graphe.children.length) rejouer(graphe, 'trace'); }).observe(graphe, { childList: true });

  /* ---------- Réveil de l'application de scoring (accueil) ----------
     Son hébergement gratuit la met en veille ; on la contacte une fois par visite, sans cookie. */
  if ($('#projets')) {
    try {
      if (!sessionStorage.getItem('reveil-scoring')) {
        sessionStorage.setItem('reveil-scoring', '1');
        fetch('https://credit-risk-app-c8ye.onrender.com/', { mode: 'no-cors', cache: 'no-store', credentials: 'omit' }).catch(() => {});
      }
    } catch (e) { /* stockage indisponible */ }
  }
})();
