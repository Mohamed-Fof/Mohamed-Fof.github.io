/* Le Laboratoire de la Confiance
   Quatre expériences autour du dilemme du prisonnier itéré :
   1. un duel où le visiteur joue contre un agent,
   2. un match que l'on regarde se dérouler entre deux agents,
   3. un tournoi entre les cinq agents,
   4. une évolution de population sur vingt générations.
   Inspiré de « L'évolution de la Confiance » de Nicky Case. */

// Laboratoire isolé dans sa propre portée : il cohabite avec le widget de chat.
(function () {
  'use strict';


  const TOURS = 10;

  // Gains classiques : [celui qui joue, l'autre].
  const GAINS = { CC: [2, 2], CT: [-1, 3], TC: [3, -1], TT: [0, 0] };

  const ORDRE = ['copieur', 'mouton', 'tricheur', 'rancunier', 'detective'];

  const COULEURS = {
    copieur: '#2563eb', mouton: '#16a34a', tricheur: '#dc2626',
    rancunier: '#f59e0b', detective: '#7c3aed'
  };

  /* Chaque agent décide son coup à partir de ses propres coups et de ceux de l'adversaire. */
  const STRATEGIES = {
    copieur: (mes, ses) => (ses.length === 0 ? 'C' : ses[ses.length - 1]),
    mouton: () => 'C',
    tricheur: () => 'T',
    rancunier: (mes, ses) => (ses.includes('T') ? 'T' : 'C'),
    // Teste l'adversaire sur quatre tours, puis l'exploite s'il ne riposte jamais.
    detective: (mes, ses) => {
      const test = ['C', 'T', 'C', 'C'];
      if (ses.length < 4) return test[ses.length];
      return ses.slice(0, 4).includes('T') ? ses[ses.length - 1] : 'T';
    }
  };

  /* Un visage par agent, pour qu'on les reconnaisse d'un coup d'œil. */
  const visage = (fond, trait, traits) =>
    `<svg viewBox="0 0 64 64" aria-hidden="true" focusable="false">
       <circle cx="32" cy="32" r="27" fill="${fond}" stroke="${trait}" stroke-width="3"/>
       <g stroke="${trait}" stroke-width="3" stroke-linecap="round" fill="none">${traits}</g>
     </svg>`;

  const VISAGES = {
    // Réciproque : regard franc, sourire mesuré.
    copieur: visage('#dbeafe', '#1d4ed8',
      `<circle cx="24" cy="28" r="2.6" fill="#1d4ed8" stroke="none"/>
       <circle cx="40" cy="28" r="2.6" fill="#1d4ed8" stroke="none"/>
       <path d="M24 40c2.6 2.8 5 4 8 4s5.4-1.2 8-4"/>`),
    // Confiant : yeux fermés, large sourire.
    mouton: visage('#dcfce7', '#15803d',
      `<path d="M20 29c1.8-2.6 4.6-2.6 6.4 0"/>
       <path d="M37.6 29c1.8-2.6 4.6-2.6 6.4 0"/>
       <path d="M21 38c2.8 5 6.6 7.4 11 7.4s8.2-2.4 11-7.4"/>`),
    // Opportuniste : regard en coin, sourire narquois.
    tricheur: visage('#fee2e2', '#b91c1c',
      `<path d="M18 23l9 4"/><path d="M46 23l-9 4"/>
       <circle cx="25" cy="31" r="2.4" fill="#b91c1c" stroke="none"/>
       <circle cx="39" cy="31" r="2.4" fill="#b91c1c" stroke="none"/>
       <path d="M23 41c4.4 3 9.6 2.2 13-1.8"/>`),
    // Intransigeant : sourcils froncés, bouche fermée.
    rancunier: visage('#fef3c7', '#b45309',
      `<path d="M19 26l8 2.6"/><path d="M45 26l-8 2.6"/>
       <circle cx="25" cy="33" r="2.4" fill="#b45309" stroke="none"/>
       <circle cx="39" cy="33" r="2.4" fill="#b45309" stroke="none"/>
       <path d="M24 42h16"/>`),
    // Analyste : monocle, expression neutre.
    detective: visage('#f3e8ff', '#6d28d9',
      `<circle cx="24" cy="29" r="2.6" fill="#6d28d9" stroke="none"/>
       <circle cx="40" cy="29" r="6.5"/>
       <circle cx="40" cy="29" r="2.4" fill="#6d28d9" stroke="none"/>
       <path d="M45 34l4.5 6"/>
       <path d="M25 41c4 1.8 8.6 1.8 13 0"/>`)
  };

  const TEXTES = {
    fr: {
      copieur: "« Tit for Tat ». Coopère au premier tour, puis copie votre coup précédent. Vainqueur des tournois d'Axelrod en 1980.",
      mouton: "« Always Cooperate ». Coopère à tous les tours, quoi qu'il arrive.",
      tricheur: "« Always Defect ». Trahit à tous les tours, quoi que vous fassiez.",
      rancunier: "« Grudger ». Coopère jusqu'à votre première trahison, puis ne pardonne plus jamais.",
      detective: "« Detective ». Vous sonde sur quatre tours, puis vous exploite si vous ne ripostez jamais.",
      fin_tricheur: "Face à quelqu'un qui trahit toujours, la confiance coûte cher. Repérer ce profil vite est la vraie compétence.",
      fin_coop: "La coopération a payé. Sur une partie répétée, être fiable rapporte plus qu'un bon coup isolé.",
      fin_trahison: "Vous avez surtout trahi. Le gain arrive vite, puis l'autre s'adapte et tout le monde y perd.",
      fin_mixte: "Partie équilibrée. C'est souvent là que se joue la vraie difficulté : savoir quand faire confiance.",
      total: "Total des deux joueurs : {x} points sur 40 possibles.",
      pts: "pts",
      victoire: "{x} termine en tête.",
      match_gagne: "{x} l'emporte {a} à {b}.",
      match_nul: "Égalité parfaite, {a} partout.",
      evo_fin: "Après 20 générations, la population est dominée par {x}.",
      evo_partage: "Après 20 générations, la population se partage entre plusieurs stratégies.",
      bruit_on: "Avec 5 % d'erreurs, les stratégies qui pardonnent résistent mieux que les rancunières.",
      bruit_off: "Sans erreur de communication, riposter immédiatement ne coûte rien."
    },
    en: {
      copieur: "'Tit for Tat'. Cooperates first, then copies your previous move. Winner of Axelrod's 1980 tournaments.",
      mouton: "'Always Cooperate'. Cooperates every round, whatever happens.",
      tricheur: "'Always Defect'. Betrays every round, whatever you do.",
      rancunier: "'Grudger'. Cooperates until your first betrayal, then never forgives.",
      detective: "'Detective'. Probes you over four rounds, then exploits you if you never retaliate.",
      fin_tricheur: "Against someone who always betrays, trust is expensive. Spotting that profile early is the real skill.",
      fin_coop: "Cooperation paid off. Over a repeated game, being reliable earns more than a single good move.",
      fin_trahison: "You mostly betrayed. The gain comes fast, then the other adapts and everyone loses.",
      fin_mixte: "A balanced game. That is usually where the real difficulty lies: knowing when to trust.",
      total: "Both players combined: {x} points out of a possible 40.",
      pts: "pts",
      victoire: "{x} finishes first.",
      match_gagne: "{x} wins {a} to {b}.",
      match_nul: "A perfect tie, {a} each.",
      evo_fin: "After 20 generations, the population is dominated by {x}.",
      evo_partage: "After 20 generations, the population is shared between several strategies.",
      bruit_on: "With 5% mistakes, forgiving strategies hold up better than unforgiving ones.",
      bruit_off: "With no communication errors, retaliating immediately costs nothing."
    }
  };

  const lang = () => (localStorage.getItem('lang') === 'en' ? 'en' : 'fr');
  const t = cle => TEXTES[lang()][cle];
  const $ = id => document.getElementById(id);
  const nomAgent = id => {
    const el = document.querySelector(`[data-nom="${id}"]`);
    return el ? el.textContent : id;
  };

  /* ---------- Moteur commun ---------- */

  const brouiller = coup => (Math.random() < 0.05 ? (coup === 'C' ? 'T' : 'C') : coup);

  // Joue une partie complète entre deux agents et renvoie leurs scores.
  function partie(idA, idB, bruit) {
    const a = [], b = [];
    let sa = 0, sb = 0;
    for (let i = 0; i < TOURS; i++) {
      let ca = STRATEGIES[idA](a, b);
      let cb = STRATEGIES[idB](b, a);
      if (bruit) { ca = brouiller(ca); cb = brouiller(cb); }
      const [ga, gb] = GAINS[ca + cb];
      sa += ga; sb += gb;
      a.push(ca); b.push(cb);
    }
    return [sa, sb];
  }

  function pastille(coup) {
    const p = document.createElement('span');
    p.className = 'pastille' + (coup ? (coup === 'C' ? ' coop' : ' trahi') : ' vide');
    return p;
  }

  /* ---------- 1. Duel contre le visiteur ---------- */

  let strategie = 'copieur';
  let mesCoups = [], sesCoups = [], scoreMoi = 0, scoreAdv = 0;

  function reinitialiser() {
    mesCoups = []; sesCoups = []; scoreMoi = 0; scoreAdv = 0;
    afficherDuel();
  }

  function jouer(monCoup) {
    if (mesCoups.length >= TOURS) return;
    const sonCoup = STRATEGIES[strategie](sesCoups, mesCoups);
    const [g1, g2] = GAINS[monCoup + sonCoup];
    mesCoups.push(monCoup); sesCoups.push(sonCoup);
    scoreMoi += g1; scoreAdv += g2;
    afficherDuel();
  }

  function afficherDuel() {
    const fini = mesCoups.length >= TOURS;
    $('visage-duel').innerHTML = VISAGES[strategie];
    $('score-moi').textContent = scoreMoi;
    $('score-adv').textContent = scoreAdv;
    $('tour').textContent = `${Math.min(mesCoups.length + 1, TOURS)} / ${TOURS}`;
    $('strat-desc').textContent = t(strategie);

    $('histo').innerHTML = '';
    for (let i = 0; i < TOURS; i++) {
      const tour = document.createElement('div');
      tour.className = 'histo-tour';
      tour.appendChild(pastille(mesCoups[i]));
      tour.appendChild(pastille(sesCoups[i]));
      $('histo').appendChild(tour);
    }

    $('btn-coop').disabled = fini;
    $('btn-trahir').disabled = fini;
    $('btn-rejouer').hidden = !fini;

    if (fini) {
      const tauxCoop = mesCoups.filter(c => c === 'C').length / TOURS;
      let verdict;
      if (strategie === 'tricheur') verdict = t('fin_tricheur');
      else if (tauxCoop >= 0.7) verdict = t('fin_coop');
      else if (tauxCoop <= 0.3) verdict = t('fin_trahison');
      else verdict = t('fin_mixte');
      $('verdict').textContent = `${verdict} ${t('total').replace('{x}', scoreMoi + scoreAdv)}`;
    } else {
      $('verdict').textContent = '';
    }
  }

  /* ---------- 2. Match : deux agents que l'on regarde jouer ---------- */

  let minuteur = null;

  function remplirSelecteurs() {
    [['sel-a', 'copieur'], ['sel-b', 'tricheur']].forEach(([id, defaut]) => {
      const sel = $(id);
      const choisi = sel.value || defaut;
      sel.innerHTML = '';
      ORDRE.forEach(a => {
        const o = document.createElement('option');
        o.value = a;
        o.textContent = nomAgent(a);
        sel.appendChild(o);
      });
      sel.value = choisi;
    });
    majVisagesMatch();
  }

  function majVisagesMatch() {
    $('visage-a').innerHTML = VISAGES[$('sel-a').value];
    $('visage-b').innerHTML = VISAGES[$('sel-b').value];
  }

  function lancerMatch() {
    if (minuteur) return;
    const idA = $('sel-a').value, idB = $('sel-b').value;
    const bruit = $('bruit').checked;
    const a = [], b = [];
    let sa = 0, sb = 0, i = 0;

    $('match-histo').innerHTML = '';
    $('match-note').textContent = '';
    $('match-score-a').textContent = '0';
    $('match-score-b').textContent = '0';
    $('btn-match').disabled = true;

    minuteur = setInterval(() => {
      let ca = STRATEGIES[idA](a, b);
      let cb = STRATEGIES[idB](b, a);
      if (bruit) { ca = brouiller(ca); cb = brouiller(cb); }
      const [ga, gb] = GAINS[ca + cb];
      sa += ga; sb += gb;
      a.push(ca); b.push(cb);

      const tour = document.createElement('div');
      tour.className = 'histo-tour apparait';
      tour.appendChild(pastille(ca));
      tour.appendChild(pastille(cb));
      $('match-histo').appendChild(tour);
      $('match-score-a').textContent = sa;
      $('match-score-b').textContent = sb;

      if (++i >= TOURS) {
        clearInterval(minuteur);
        minuteur = null;
        $('btn-match').disabled = false;
        $('match-note').textContent = sa === sb
          ? t('match_nul').replace('{a}', sa)
          : t('match_gagne')
              .replace('{x}', nomAgent(sa > sb ? idA : idB))
              .replace('{a}', Math.max(sa, sb)).replace('{b}', Math.min(sa, sb));
      }
    }, 550);
  }

  /* ---------- 3. Tournoi entre les cinq agents ---------- */

  function lancerTournoi() {
    const bruit = $('bruit').checked;
    const scores = Object.fromEntries(ORDRE.map(id => [id, 0]));
    for (let i = 0; i < ORDRE.length; i++) {
      for (let j = i; j < ORDRE.length; j++) {
        const [a, b] = partie(ORDRE[i], ORDRE[j], bruit);
        scores[ORDRE[i]] += a;
        scores[ORDRE[j]] += b;
      }
    }
    const classement = ORDRE.slice().sort((x, y) => scores[y] - scores[x]);
    const max = Math.max(...Object.values(scores), 1);

    $('tournoi-res').innerHTML = '';
    classement.forEach((id, rang) => {
      const ligne = document.createElement('div');
      ligne.className = 'rang';
      ligne.innerHTML =
        `<span class="rang-pos">${rang + 1}</span>` +
        `<span class="rang-visage">${VISAGES[id]}</span>` +
        `<span class="rang-nom">${nomAgent(id)}</span>` +
        `<span class="rang-barre"><span style="width:${Math.max(4, (scores[id] / max) * 100)}%;background:${COULEURS[id]}"></span></span>` +
        `<span class="rang-pts">${scores[id]} ${t('pts')}</span>`;
      $('tournoi-res').appendChild(ligne);
    });
    $('tournoi-note').textContent =
      t('victoire').replace('{x}', nomAgent(classement[0])) + ' ' + (bruit ? t('bruit_on') : t('bruit_off'));
  }

  /* ---------- 4. Évolution d'une population ---------- */

  const GENERATIONS = 20;

  function lancerEvolution() {
    const bruit = $('bruit').checked;
    let population = [];
    ORDRE.forEach(id => { for (let i = 0; i < 5; i++) population.push(id); });
    const historique = [];

    for (let g = 0; g < GENERATIONS; g++) {
      historique.push(ORDRE.map(id => population.filter(p => p === id).length));
      const scores = population.map(() => 0);
      for (let i = 0; i < population.length; i++) {
        for (let j = i + 1; j < population.length; j++) {
          const [a, b] = partie(population[i], population[j], bruit);
          scores[i] += a; scores[j] += b;
        }
      }
      // Les cinq plus faibles adoptent la stratégie des cinq meilleurs.
      const rangs = population.map((id, i) => ({ id, s: scores[i] })).sort((x, y) => y.s - x.s);
      population = rangs.slice(0, rangs.length - 5).map(r => r.id)
        .concat(rangs.slice(0, 5).map(r => r.id));
    }
    historique.push(ORDRE.map(id => population.filter(p => p === id).length));

    $('evo-graphe').innerHTML = '';
    historique.forEach(gen => {
      const col = document.createElement('div');
      col.className = 'evo-col';
      gen.forEach((n, k) => {
        if (n === 0) return;
        const seg = document.createElement('span');
        seg.style.height = (n / 25 * 100) + '%';
        seg.style.background = COULEURS[ORDRE[k]];
        col.appendChild(seg);
      });
      $('evo-graphe').appendChild(col);
    });

    const final = historique[historique.length - 1];
    const iMax = final.indexOf(Math.max(...final));
    $('evo-note').textContent = final[iMax] >= 15
      ? t('evo_fin').replace('{x}', nomAgent(ORDRE[iMax]))
      : t('evo_partage');
  }

  /* ---------- Interface ---------- */

  document.querySelectorAll('.strat').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.strat').forEach(b => b.classList.remove('actif'));
      btn.classList.add('actif');
      strategie = btn.dataset.strat;
      reinitialiser();
    });
  });

  document.querySelectorAll('.lab-onglet').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.lab-onglet').forEach(b => b.classList.remove('actif'));
      document.querySelectorAll('.lab-panneau').forEach(p => { p.hidden = true; });
      btn.classList.add('actif');
      $(btn.dataset.panneau).hidden = false;
    });
  });

  // Visages dans la légende de l'évolution.
  document.querySelectorAll('.evo-legende [data-visage]').forEach(el => {
    el.innerHTML = VISAGES[el.dataset.visage];
  });

  $('btn-coop').addEventListener('click', () => jouer('C'));
  $('btn-trahir').addEventListener('click', () => jouer('T'));
  $('btn-rejouer').addEventListener('click', reinitialiser);
  $('btn-match').addEventListener('click', lancerMatch);
  $('btn-tournoi').addEventListener('click', lancerTournoi);
  $('btn-evolution').addEventListener('click', lancerEvolution);
  $('sel-a').addEventListener('change', majVisagesMatch);
  $('sel-b').addEventListener('change', majVisagesMatch);

  // app.js gère le sélecteur de langue : on réaffiche juste après son passage.
  const boutonLangue = $('lang-toggle');
  if (boutonLangue) boutonLangue.addEventListener('click', () => setTimeout(() => {
    afficherDuel();
    remplirSelecteurs();
    if ($('tournoi-res').children.length) lancerTournoi();
    if ($('evo-graphe').children.length) lancerEvolution();
  }, 0));

  remplirSelecteurs();
  afficherDuel();

})();
