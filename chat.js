/* Momo, l'agent conversationnel de MF Consulting.
   Widget autonome : il injecte sa bulle et son panneau sur toutes les pages du site.
   Parcours : salutation, nom, téléphone, formation actuelle, CV, puis envoi du dossier par email. */

// Widget isolé dans sa propre portée : chat.js et jeux.js cohabitent sur la même page.
(function () {
  'use strict';


  const BACKEND_URL = 'https://adia-backend.vercel.app';
  const CV_TYPES = ['application/pdf', 'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
  const CV_TAILLE_MAX = 2.5 * 1024 * 1024;   // 2,5 Mo : la limite de corps de requête de Vercel est à 4,5 Mo
  const MSG_MAX = 1000;

  const T = {
    fr: {
      erreur: "Service momentanément indisponible. Vous pouvez écrire directement à fofana12ad@gmail.com.",
      hors_ligne: "Impossible de joindre le serveur. Vérifiez votre connexion, ou écrivez à fofana12ad@gmail.com.",
      trop_vite: "Vous envoyez beaucoup de messages. Patientez quelques instants.",
      cv_type: "Format non accepté. Envoyez un PDF ou un document Word.",
      cv_poids: "Fichier trop lourd (maximum 2,5 Mo).",
      cv_joint: "CV joint : {x}",
      cv_envoye: "Votre CV a bien été transmis.",
      cv_echec: "Vos informations sont enregistrées, mais l'envoi a échoué. Écrivez à fofana12ad@gmail.com.",
      fin: "Dossier transmis à Mohamed. Il vous recontactera très vite. Excellente journée !"
    },
    en: {
      erreur: "Service temporarily unavailable. You can write directly to fofana12ad@gmail.com.",
      hors_ligne: "Could not reach the server. Check your connection, or write to fofana12ad@gmail.com.",
      trop_vite: "You are sending a lot of messages. Please wait a moment.",
      cv_type: "Format not accepted. Please send a PDF or a Word document.",
      cv_poids: "File too large (2.5 MB maximum).",
      cv_joint: "CV attached: {x}",
      cv_envoye: "Your CV has been sent.",
      cv_echec: "Your details were saved, but sending failed. Please write to fofana12ad@gmail.com.",
      fin: "Your file has been sent to Mohamed. He will get back to you shortly. Have a great day!"
    }
  };
  const langue = () => (localStorage.getItem('lang') === 'en' ? 'en' : 'fr');
  const t = cle => T[langue()][cle];

  const AVATAR = `<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round"
    stroke-linejoin="round" aria-hidden="true"><path d="M24 7.5v4.5"/><circle cx="24" cy="5" r="2.3" fill="currentColor" stroke="none"/>
    <rect x="9.5" y="12" width="29" height="23" rx="7.5"/><path d="M6 21.5v5M42 21.5v5"/>
    <circle cx="18.5" cy="22.5" r="2.4" fill="currentColor" stroke="none"/><circle cx="29.5" cy="22.5" r="2.4" fill="currentColor" stroke="none"/>
    <path d="M18.5 29.2c1.5 1.7 3.4 2.5 5.5 2.5s4-.8 5.5-2.5"/></svg>`;

  const ICONE = (b, w = 20) => `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${w}" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${b}</svg>`;
  const I_CHAT = ICONE('<path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>', 24);
  const I_FERMER = ICONE('<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>');
  const I_TROMBONE = ICONE('<path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/>', 18);
  const I_ENVOI = ICONE('<line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>', 18);

  /* ---------- Injection du widget ---------- */

  const widget = document.createElement('div');
  widget.id = 'momo';
  widget.innerHTML = `
    <button type="button" id="momo-bulle" aria-label="Ouvrir le chat" aria-expanded="false">
      ${I_CHAT}<span class="momo-point"></span>
    </button>
    <section id="momo-panneau" hidden aria-labelledby="momo-titre">
      <header class="momo-tete">
        <span class="momo-avatar">${AVATAR}</span>
        <div class="momo-ident">
          <strong id="momo-titre">Momo</strong>
          <span class="momo-statut"><i class="momo-en-ligne"></i><span data-i18n="chat_statut">En ligne</span></span>
        </div>
        <button type="button" id="momo-fermer" aria-label="Fermer le chat">${I_FERMER}</button>
      </header>
      <div id="momo-messages" role="log" aria-live="polite"></div>
      <div id="momo-cv-chip" hidden></div>
      <form id="momo-barre" autocomplete="off">
        <label class="momo-joindre" id="momo-joindre" title="Joindre mon CV">
          ${I_TROMBONE}
          <input type="file" id="momo-fichier" accept=".pdf,.doc,.docx" aria-label="Joindre mon CV" />
        </label>
        <input type="text" id="momo-saisie" maxlength="${MSG_MAX}"
               placeholder="Écrivez votre message..." aria-label="Votre message" />
        <button type="submit" id="momo-envoyer" aria-label="Envoyer">${I_ENVOI}</button>
      </form>
    </section>`;
  document.body.appendChild(widget);

  const $ = id => document.getElementById(id);
  const panneau = $('momo-panneau');
  const messages = $('momo-messages');
  const saisie = $('momo-saisie');

  /* ---------- État ---------- */

  let historique = [];
  let cv = null;            // { nom, type, contenu } le contenu étant en base64
  let termine = false;
  let enAttente = false;

  /* ---------- Rendu ---------- */

  function echapper(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  function tableau(lignes) {
    const rangs = lignes.filter(l => !/^\s*\|[\s\-|:]+\|\s*$/.test(l));
    let html = '<table class="momo-table">';
    rangs.forEach((rang, i) => {
      const cellules = rang.trim().replace(/^\|/, '').replace(/\|$/, '').split('|');
      html += '<tr>' + cellules.map(c => {
        const balise = i === 0 ? 'th' : 'td';
        return `<${balise}>${echapper(c.trim())}</${balise}>`;
      }).join('') + '</tr>';
    });
    return html + '</table>';
  }

  // Le texte vient du modèle : tout est échappé avant d'être mis en forme.
  function formater(brut) {
    const morceaux = [];
    let table = [], texte = [];
    for (const ligne of String(brut).split('\n')) {
      if (/^\s*\|[\s\-|:]+\|\s*$/.test(ligne)) continue;
      if (ligne.trim().startsWith('|')) {
        if (texte.length) { morceaux.push({ t: 'texte', c: texte.join('\n') }); texte = []; }
        table.push(ligne);
      } else {
        if (table.length) { morceaux.push({ t: 'table', c: table }); table = []; }
        texte.push(ligne);
      }
    }
    if (table.length) morceaux.push({ t: 'table', c: table });
    if (texte.length) morceaux.push({ t: 'texte', c: texte.join('\n') });

    return morceaux.map(m => {
      if (m.t === 'table') return tableau(m.c);
      let s = echapper(m.c);
      s = s.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      s = s.replace(/\n/g, '<br/>');
      s = s.replace(/^(<br\/>)+/, '');
      return s;
    }).join('');
  }

  function ajouter(role, texte) {
    const div = document.createElement('div');
    div.className = 'momo-msg momo-' + role;
    div.innerHTML = formater(texte);
    messages.appendChild(div);
    messages.scrollTop = messages.scrollHeight;
    return div;
  }

  function saisieEnCours(actif) {
    const existant = $('momo-points');
    if (!actif) { if (existant) existant.remove(); return; }
    if (existant) return;
    const div = document.createElement('div');
    div.id = 'momo-points';
    div.className = 'momo-msg momo-assistant momo-attente';
    div.innerHTML = '<span></span><span></span><span></span>';
    messages.appendChild(div);
    messages.scrollTop = messages.scrollHeight;
  }

  function verrouiller(actif) {
    enAttente = actif;
    saisie.disabled = actif || termine;
    $('momo-envoyer').disabled = actif || termine;
    $('momo-fichier').disabled = actif || termine;
  }

  /* ---------- Pièce jointe ---------- */

  function afficherChip() {
    const chip = $('momo-cv-chip');
    if (!cv) { chip.hidden = true; chip.textContent = ''; return; }
    chip.hidden = false;
    chip.textContent = t('cv_joint').replace('{x}', cv.nom);
    const retirer = document.createElement('button');
    retirer.type = 'button';
    retirer.setAttribute('aria-label', 'Retirer le CV');
    retirer.textContent = '×';
    retirer.addEventListener('click', () => { cv = null; $('momo-fichier').value = ''; afficherChip(); });
    chip.appendChild(retirer);
  }

  $('momo-fichier').addEventListener('change', e => {
    const f = e.target.files[0];
    if (!f) return;
    const extensionOk = /\.(pdf|docx?)$/i.test(f.name);
    if (!CV_TYPES.includes(f.type) && !extensionOk) { ajouter('systeme', t('cv_type')); e.target.value = ''; return; }
    if (f.size > CV_TAILLE_MAX) { ajouter('systeme', t('cv_poids')); e.target.value = ''; return; }
    const lecteur = new FileReader();
    lecteur.onload = () => {
      cv = { nom: f.name.slice(0, 120), type: f.type || 'application/octet-stream',
             contenu: String(lecteur.result).split(',')[1] };
      afficherChip();
      saisie.focus();
    };
    lecteur.readAsDataURL(f);
  });

  /* ---------- Échanges avec le serveur ---------- */

  async function appeler(corps) {
    const res = await fetch(`${BACKEND_URL}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(corps)
    });
    let data = {};
    try { data = await res.json(); } catch { /* réponse non JSON */ }
    return { res, data };
  }

  // Une fois le questionnaire bouclé, on transmet le dossier et le CV en un seul envoi.
  async function finaliser() {
    try {
      const { res, data } = await appeler({ messages: historique, cv, finaliser: true });
      if (res.ok && data.emailOk) ajouter('systeme', cv ? `${t('cv_envoye')} ${t('fin')}` : t('fin'));
      else ajouter('systeme', t('cv_echec'));
    } catch {
      ajouter('systeme', t('cv_echec'));
    }
    termine = true;
    verrouiller(false);
    saisie.placeholder = t('fin');
  }

  async function envoyer(texte) {
    if (!texte || enAttente || termine) return;
    ajouter('utilisateur', texte);
    historique.push({ role: 'user', content: texte });
    verrouiller(true);
    saisieEnCours(true);

    try {
      const { res, data } = await appeler({ messages: historique });
      saisieEnCours(false);
      if (res.status === 429) { ajouter('systeme', t('trop_vite')); verrouiller(false); return; }
      if (!res.ok || data.error) { ajouter('systeme', t('erreur')); verrouiller(false); return; }

      const reponse = data.reply || '';
      ajouter('assistant', reponse);
      historique.push({ role: 'assistant', content: reponse });

      if (data.completed) await finaliser();
      else verrouiller(false);
    } catch {
      saisieEnCours(false);
      ajouter('systeme', t('hors_ligne'));
      verrouiller(false);
    }
    if (!termine) saisie.focus();
  }

  /* ---------- Ouverture et fermeture ---------- */

  function ouvrir() {
    panneau.hidden = false;
    $('momo-bulle').setAttribute('aria-expanded', 'true');
    $('momo-bulle').classList.add('ouvert');
    if (!messages.children.length) demarrer();
    setTimeout(() => saisie.focus(), 50);
  }

  function fermer() {
    panneau.hidden = true;
    $('momo-bulle').setAttribute('aria-expanded', 'false');
    $('momo-bulle').classList.remove('ouvert');
    $('momo-bulle').focus();
  }

  // C'est l'agent qui engage la conversation dès l'ouverture.
  function demarrer() {
    verrouiller(true);
    saisieEnCours(true);
    appeler({ messages: [{ role: 'user', content: 'Bonjour' }] })
      .then(({ res, data }) => {
        saisieEnCours(false);
        if (res.ok && data.reply) {
          historique = [{ role: 'user', content: 'Bonjour' }, { role: 'assistant', content: data.reply }];
          ajouter('assistant', data.reply);
        } else {
          ajouter('systeme', t('erreur'));
        }
        verrouiller(false);
      })
      .catch(() => { saisieEnCours(false); ajouter('systeme', t('hors_ligne')); verrouiller(false); });
  }

  $('momo-bulle').addEventListener('click', () => (panneau.hidden ? ouvrir() : fermer()));
  $('momo-fermer').addEventListener('click', fermer);
  $('momo-barre').addEventListener('submit', e => {
    e.preventDefault();
    const texte = saisie.value.trim();
    saisie.value = '';
    envoyer(texte);
  });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && !panneau.hidden) fermer(); });

  // Les boutons « Démarrer mon dossier » de la page d'accueil ouvrent le même widget.
  document.querySelectorAll('[data-ouvre-chat]').forEach(b => b.addEventListener('click', ouvrir));

  // app.js retraduit la page au changement de langue : on remet à jour nos textes dynamiques.
  const boutonLangue = document.getElementById('lang-toggle');
  if (boutonLangue) boutonLangue.addEventListener('click', () => setTimeout(() => {
    if (termine) saisie.placeholder = t('fin');
    afficherChip();
  }, 0));

})();
