/* ===== THEME TOGGLE ===== */
(function() {
  const saved = localStorage.getItem('theme') || 'light';
  document.documentElement.setAttribute('data-theme', saved);
  updateThemeIcon(saved);
})();

function updateThemeIcon(theme) {
  const sun = document.getElementById('icon-sun');
  const moon = document.getElementById('icon-moon');
  if (!sun || !moon) return;
  if (theme === 'dark') {
    sun.style.display = 'block';
    moon.style.display = 'none';
  } else {
    sun.style.display = 'none';
    moon.style.display = 'block';
  }
}

function toggleTheme() {
  const current = document.documentElement.getAttribute('data-theme') || 'light';
  const next = current === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
  updateThemeIcon(next);
}

/* ===== i18n FR/EN TOGGLE ===== */
const i18n = {
  fr: {
    /* — NAV — */
    nav_accueil:'Accueil', nav_about:'À propos', nav_exp:'Expérience',
    nav_projets:'Projets', nav_comp:'Compétences', nav_contact:'Contact', nav_agence:'Mon Agence',
    /* — HERO — */
    hero_hello:'Bonjour, je suis',
    hero_subtitle:'Étudiant en Master 1 Mathématiques Appliquées, Statistique',
    hero_desc:'Passionné par l\'IA, la Data Science, les Statistiques, la Finance et l\'assurance. Je développe des compétences en programmation, en analyse de données et en modélisation statistique pour résoudre des problèmes complexes et prendre des décisions éclairées.',
    hero_btn_projects:'Voir mes projets', hero_btn_contact:'Me contacter', hero_btn_cv:'Télécharger mon CV',
    /* — ABOUT — */
    about_title:'À propos de moi',
    about_bio1:'Étudiant en Master 1 Mathématiques Appliquées, Statistique à l\'Université Clermont Auvergne, issu d\'une Licence MIASHS parcours Économie à l\'Université Grenoble Alpes.',
    about_bio2:'J\'ai un fort intérêt pour les mathématiques appliquées, notamment les statistiques, les probabilités, l\'intelligence artificielle et la data science, ainsi que leurs applications en finance et en assurance.',
    /* — FORMATION — */
    edu_title:'Formation',
    edu_year_uca:'2026 – 2028', edu_prog_uca:'Master Mathématiques Appliquées, Statistique', edu_loc_uca:'Clermont-Ferrand, France',
    edu_year_uga:'2024 – 2026', edu_prog_uga:'Licence MIASHS – Parcours Sciences Économiques', edu_loc_uga:'Grenoble, France<br/>Admis Éco-Stat ISFA Lyon | ISADS Paris Saclay',
    edu_year_nangui:'2022 – 2024', edu_prog_nangui:'Licence Mathématiques – Informatique', edu_loc_nangui:'Abidjan, Côte d\'Ivoire<br/>Major de promotion',
    edu_tags_uca:'<span>Statistiques Bayésiennes</span><span>Probabilités</span><span>Algorithme stochastique</span><span>IA</span><span>Analyse de données</span><span>Data Mining</span><span>Gestion Financière Marketing</span><span>SAS</span>',
    edu_tags_uga:'<span>Machine Learning</span><span>Statistique paramétrique</span><span>IA</span><span>Théorie des jeux</span><span>Économétrie</span><span>Programmation Avancée</span><span>Gestion de projet</span><span>Stage</span>',
    edu_tags_nangui:'<span>Modélisation Mathématiques</span><span>Probabilités-Statistiques</span><span>Comptabilité</span><span>Algorithmique et Programmation</span><span>Base de données</span><span>Gestion de projet</span>',
    /* — EXPÉRIENCE — */
    exp_title:'Expérience Professionnelle',
    exp1_date:'Sep. 2025 – Jan. 2026', exp1_title:'Data Science Intern',
    exp1_org:'Laboratoire AGEIS – Université Grenoble Alpes',
    exp1_type:'<em>Applied Health Econometrics – Stage Semestre 5</em>',
    exp1_li1:'Analyse des inégalités de genre dans l\'espérance de vie à partir de jeux de données internationaux',
    exp1_li2:'Analyse de données et modélisation économétrique incluant des méthodes de Machine Learning',
    exp1_li3:'Livrables : code, rapport de stage, article scientifique publié dans <em>Discover Public Health</em>',
    exp2_date:'Mai 2025 – Juil. 2025', exp2_title:'Research Intern – Économie Énergie & Environnement',
    exp2_org:'Laboratoire GAEL – Université Grenoble Alpes',
    exp2_type:'<em>Stage d\'Excellence – Projet RES4City</em>',
    exp2_li1:'Analyse techno-économique de scénarios énergétiques et traitement de données',
    exp2_li2:'Modélisation statistique, simulations Monte Carlo et analyse financière sous incertitude',
    exp3_date:'Sep. 2025 – Mai 2026', exp3_title:'Tuteur Académique – Mathématiques & Informatique',
    exp3_org:'UFR SHS – Université Grenoble Alpes',
    exp3_type:'<em>CDD – Contrat à Durée Déterminée</em>',
    exp3_li1:'Parrain et Tuteur académique en licence 1 et 2 MIASHS de l\'UFR SHS',

    /* — EXP 4 — */
    exp4_date:'2025 – Présent',
    exp4_title:'Fondateur & Consultant — MF Consulting',
    exp4_org:'MF Consulting',
    exp4_type:'<em>Entrepreneur — Accompagnement étudiant international</em>',
    exp4_li1:'Création et gestion d\'une agence d\'accompagnement pour étudiants souhaitant étudier en France',
    exp4_li2:'Suivi de dossiers, préparation aux entretiens Campus France et accompagnement visa',
    exp4_li3:'Développement d\'un agent IA conversationnel (Momo) pour automatiser le premier contact client',
    /* — PROJETS — */
    projets_title:'Projets Académiques',
    proj1_domain:'Machine Learning', proj1_title:'Risque de Défaut de Crédit',
    proj1_desc:'Classification binaire pour estimer la probabilité de défaut. Analyse de données, évaluation de performances et interprétation des résultats pour aide à la décision.',
    proj2_domain:'Économétrie', proj2_title:'Déterminants des Prix Immobiliers',
    proj2_desc:'Analyse exploratoire, estimation OLS, validation des hypothèses économétriques (hétéroscédasticité, autocorrélation), sélection de modèle.',
    proj3_domain:'Informatique', proj3_title:'Programmation Logique – Jeu "Flaunt" (Hofstadter)',
    proj3_desc:'Conception d\'un agent stratégique adaptatif basé sur la logique et l\'analyse du comportement adverse pour un tournoi inter-cohortes.',
    proj4_domain:'Micro-Économie', proj4_title:'L\'Économie est-elle une Science Expérimentale ?',
    proj4_desc:'Projet de groupe : économie expérimentale et comportementale via quiz et vidéos éducatives sur Moodle pour étudiants de L1.',
    /* — COMPÉTENCES — */
    comp_title:'Compétences', comp_prog:'Programmation', comp_ds:'Data Science & IA',
    comp_stats:'Statistiques & Finance', comp_tools:'Outils & Technologies',
    /* — CONTACT — */
    contact_title:'Me Contacter',
    contact_intro:'Ouvert aux opportunités de stage, alternance ou collaboration sur des projets Data/IA/Finance.',
    /* — Momo — */
    momo_title:'Mon Agence — MF Consulting',
    momo_subtitle:'J\'accompagne les étudiants internationaux dans la réalisation de leurs projets d\'études en France 🇫🇷<br/>Mon objectif : aider chaque étudiant à poursuivre ses rêves académiques avec un accompagnement personnalisé et humain.',
    momo_tagline:'Avec sérieux, écoute et expertise, je guide les étudiants à chaque étape de leur parcours vers la France.',
    momo_s1:'Suivi et préparation du dossier d\'admission',
    momo_s2:'Rédaction et correction de la lettre de motivation',
    momo_s3:'Préparation à l\'entretien Campus France',
    momo_s4:'Accompagnement jusqu\'à l\'obtention du visa',
    momo_bot_desc:'Discutez avec notre agent pour démarrer votre dossier gratuitement',
    momo_bot_status:'🟢 En ligne 24h/24',
    momo_btn:'💬 Démarrer mon dossier avec Momo',
    momo_note:'Gratuit · Sans engagement · Réponse en 24h',
    /* — FOOTER — */
    footer_main:'© 2026 Mohamed Fofana — Clermont-Ferrand, France',
    
    /* — ABOUT info — */
    about_location:'Clermont-Ferrand, France',
    about_univ:'Université Clermont Auvergne',
    about_langs:'Français (natif) | Anglais (B1) | Allemand (débutant)',
    /* — EXP tags — */
    exp_tags_gael:'<span>Python</span><span>MATLAB</span><span>Monte Carlo</span><span>Finance</span><span>Statistiques</span>',
    exp_tags_tuteur:'<span>Enseignement</span><span>Analyse 1,2,3</span><span>Algèbre 1,2,3</span><span>Probabilités 1 et 2</span><span>Intro. Statistiques</span>',
    exp_tags_ageis:'<span>Python</span><span>R</span><span>Machine Learning</span><span>Économétrie</span><span>Santé publique</span>',
    exp_tags_founder:'<span>Entrepreneuriat</span><span>Consulting</span><span>IA</span><span>Accompagnement</span>',
    /* — PROJET tags — */
    proj_tags_1:'<span>R</span><span>RStudio</span><span>R Shiny Dashboard</span><span>ML Supervisé</span><span>Classification</span><span>Risk Credit</span><span>Finance</span>',
    proj_tags_2:'<span>Python</span><span>Gretl</span><span>Estimation</span><span>Analyse exploratoire</span><span>Régression OLS</span>',
    proj_tags_3:'<span>SWI Prolog</span><span>IA</span><span>Logique</span><span>Stratégie</span>',
    proj_tags_4:'<span>LaTeX</span><span>Moodle</span><span>Éco. Expérimentale</span>',
    footer_sub:'Fait avec ❤️ | HTML · CSS · JavaScript',
    momo_bot_title:'Momo',
    /* — COMPÉTENCES tags — */
    skills_ds:'<span>Machine Learning</span><span>Data Analysis</span><span>Predictive Modeling</span><span>Économétrie</span><span>Régression OLS</span><span>Monte Carlo</span><span>Séries temporelles</span><span>Tests statistiques</span>',
    skills_stats:'<span>Probabilités</span><span>ANOVA</span><span>Théorie des portefeuilles</span><span>Gestion du risque</span><span>Panel data</span><span>Inférence statistique</span><span>Économie industrielle</span><span>Théorie des jeux</span>',
    skills_tools:'<span>Git / GitHub</span><span>VS Code</span><span>Linux / UNIX</span><span>LaTeX</span><span>Gretl</span><span>SWI Prolog</span><span>Microsoft Office</span><span>Shell</span>',
  },
  en: {
    /* — NAV — */
    nav_accueil:'Home', nav_about:'About', nav_exp:'Experience',
    nav_projets:'Projects', nav_comp:'Skills', nav_contact:'Contact', nav_agence:'My Agency',
    /* — HERO — */
    hero_hello:'Hello, I am',
    hero_subtitle:'Master 1 in Applied Mathematics & Statistics',
    hero_desc:'Passionate about AI, Data Science, Statistics, Finance and Insurance. I develop skills in programming, data analysis and statistical modelling to solve complex problems and make informed decisions.',
    hero_btn_projects:'View my projects', hero_btn_contact:'Contact me', hero_btn_cv:'Download my CV',
    /* — ABOUT — */
    about_title:'About me',
    about_bio1:'Master\'s student in Applied Mathematics and Statistics at Université Clermont Auvergne, with a BSc in MIASHS (Economics track) from Université Grenoble Alpes.',
    about_bio2:'I have a strong interest in applied mathematics, including statistics, probability, artificial intelligence and data science, and their applications in finance and insurance.',
    /* — FORMATION — */
    edu_title:'Education',
    edu_year_uca:'2026 – 2028', edu_prog_uca:'MSc Applied Mathematics & Statistics', edu_loc_uca:'Clermont-Ferrand, France',
    edu_year_uga:'2024 – 2026', edu_prog_uga:'BSc MIASHS – Economics Track', edu_loc_uga:'Grenoble, France<br/>Admitted: Éco-Stat ISFA Lyon | ISADS Paris Saclay',
    edu_year_nangui:'2022 – 2024', edu_prog_nangui:'BSc Mathematics & Computer Science', edu_loc_nangui:'Abidjan, Côte d\'Ivoire<br/>Top of class',
    edu_tags_uca:'<span>Bayesian Statistics</span><span>Probability</span><span>Stochastic Algorithms</span><span>AI</span><span>Data Analysis</span><span>Data Mining</span><span>Financial & Marketing Management</span><span>SAS</span>',
    edu_tags_uga:'<span>Machine Learning</span><span>Parametric Statistics</span><span>AI</span><span>Game Theory</span><span>Econometrics</span><span>Advanced Programming</span><span>Project Management</span><span>Internship</span>',
    edu_tags_nangui:'<span>Mathematical Modelling</span><span>Probability & Statistics</span><span>Accounting</span><span>Algorithms & Programming</span><span>Databases</span><span>Project Management</span>',
    /* — EXPERIENCE — */
    exp_title:'Professional Experience',
    exp1_date:'Sep. 2025 – Jan. 2026', exp1_title:'Data Science Intern',
    exp1_org:'AGEIS Laboratory – Université Grenoble Alpes',
    exp1_type:'<em>Applied Health Econometrics – Semester 5 Internship</em>',
    exp1_li1:'Analysis of gender inequalities in life expectancy using international datasets',
    exp1_li2:'Data analysis and econometric modelling including Machine Learning methods',
    exp1_li3:'Deliverables: code, internship report, scientific article published in <em>Discover Public Health</em>',
    exp2_date:'May 2025 – Jul. 2025', exp2_title:'Research Intern – Energy & Environmental Economics',
    exp2_org:'GAEL Laboratory – Université Grenoble Alpes',
    exp2_type:'<em>Excellence Internship – RES4City Project</em>',
    exp2_li1:'Techno-economic analysis of energy scenarios and data processing',
    exp2_li2:'Statistical modelling, Monte Carlo simulations and financial analysis under uncertainty',
    exp3_date:'Sep. 2025 – May 2026', exp3_title:'Academic Tutor – Mathematics & Computer Science',
    exp3_org:'UFR SHS – Université Grenoble Alpes',
    exp3_type:'<em>Fixed-term Contract (CDD)</em>',
    exp3_li1:'Academic mentor and tutor for 1st and 2nd year MIASHS students at UFR SHS',

    /* — EXP 4 — */
    exp4_date:'2025 – Present',
    exp4_title:'Founder & Consultant — MF Consulting',
    exp4_org:'MF Consulting',
    exp4_type:'<em>Entrepreneur — International Student Support</em>',
    exp4_li1:'Founded and managed a consulting agency to support international students aiming to study in France',
    exp4_li2:'Application file support, Campus France interview coaching and visa guidance',
    exp4_li3:'Developed an AI chatbot (Momo) to automate initial client onboarding',
    /* — PROJETS — */
    projets_title:'Academic Projects',
    proj1_domain:'Machine Learning', proj1_title:'Credit Default Risk',
    proj1_desc:'Binary classification to estimate default probability. Data analysis, performance evaluation and result interpretation for decision-making.',
    proj2_domain:'Econometrics', proj2_title:'Determinants of Housing Prices',
    proj2_desc:'Exploratory analysis, OLS estimation, validation of econometric assumptions (heteroscedasticity, autocorrelation), model selection.',
    proj3_domain:'Computer Science', proj3_title:'Logic Programming – "Flaunt" Game (Hofstadter)',
    proj3_desc:'Design of an adaptive strategic agent based on logic and analysis of opponent behaviour for an inter-cohort tournament.',
    proj4_domain:'Microeconomics', proj4_title:'Is Economics an Experimental Science?',
    proj4_desc:'Group project: experimental and behavioural economics through quizzes and educational videos on Moodle for first-year students.',
    /* — COMPÉTENCES — */
    comp_title:'Skills', comp_prog:'Programming', comp_ds:'Data Science & AI',
    comp_stats:'Statistics & Finance', comp_tools:'Tools & Technologies',
    /* — CONTACT — */
    contact_title:'Get in Touch',
    contact_intro:'Open to internship, work-study or collaboration opportunities in Data / AI / Finance.',
    /* — Momo — */
    momo_title:'My Agency — MF Consulting',
    momo_subtitle:'I support international students in achieving their academic goals in France 🇫🇷<br/>My mission: help every student pursue their academic dreams with personalised, human guidance.',
    momo_tagline:'With dedication, attentiveness and expertise, I guide students at every step of their journey to France.',
    momo_s1:'Application file monitoring and preparation',
    momo_s2:'Writing and proofreading the motivation letter',
    momo_s3:'Campus France interview preparation',
    momo_s4:'Support until visa approval',
    momo_bot_desc:'Chat with our agent to start your application for free',
    momo_bot_status:'🟢 Online 24/7',
    momo_btn:'💬 Start my application with Momo',
    momo_note:'Free · No commitment · Response within 24h',
    /* — FOOTER — */
    footer_main:'© 2026 Mohamed Fofana — Clermont-Ferrand, France',
    
    /* — ABOUT info — */
    about_location:'Clermont-Ferrand, France',
    about_univ:'Clermont Auvergne University',
    about_langs:'French (native) | English (B1) | German (beginner)',
    /* — EXP tags — */
    exp_tags_gael:'<span>Python</span><span>MATLAB</span><span>Monte Carlo</span><span>Finance</span><span>Statistics</span>',
    exp_tags_tuteur:'<span>Teaching</span><span>Analysis 1,2,3</span><span>Algebra 1,2,3</span><span>Probability 1 & 2</span><span>Intro. Statistics</span>',
    exp_tags_ageis:'<span>Python</span><span>R</span><span>Machine Learning</span><span>Econometrics</span><span>Public Health</span>',
    exp_tags_founder:'<span>Entrepreneurship</span><span>Consulting</span><span>AI</span><span>Student Support</span>',
    /* — PROJET tags — */
    proj_tags_1:'<span>R</span><span>RStudio</span><span>R Shiny Dashboard</span><span>Supervised ML</span><span>Classification</span><span>Credit Risk</span><span>Finance</span>',
    proj_tags_2:'<span>Python</span><span>Gretl</span><span>Estimation</span><span>Exploratory Analysis</span><span>OLS Regression</span>',
    proj_tags_3:'<span>SWI Prolog</span><span>AI</span><span>Logic</span><span>Strategy</span>',
    proj_tags_4:'<span>LaTeX</span><span>Moodle</span><span>Exp. Economics</span>',
    footer_sub:'Made with ❤️ | HTML · CSS · JavaScript',
    momo_bot_title:'Momo',
    /* — SKILLS tags — */
    skills_ds:'<span>Machine Learning</span><span>Data Analysis</span><span>Predictive Modeling</span><span>Econometrics</span><span>OLS Regression</span><span>Monte Carlo</span><span>Time Series</span><span>Statistical Tests</span>',
    skills_stats:'<span>Probability</span><span>ANOVA</span><span>Portfolio Theory</span><span>Risk Management</span><span>Panel Data</span><span>Statistical Inference</span><span>Industrial Economics</span><span>Game Theory</span>',
    skills_tools:'<span>Git / GitHub</span><span>VS Code</span><span>Linux / UNIX</span><span>LaTeX</span><span>Gretl</span><span>SWI Prolog</span><span>Microsoft Office</span><span>Shell</span>',
  }
};

let currentLang = localStorage.getItem('lang') || 'fr';

function applyLang(lang) {
  const dict = i18n[lang];
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (dict[key] !== undefined) el.textContent = dict[key];
  });
  document.querySelectorAll('[data-i18n-html]').forEach(el => {
    const key = el.getAttribute('data-i18n-html');
    if (dict[key] !== undefined) el.innerHTML = dict[key];
  });
  document.getElementById('lang-label').textContent = lang === 'fr' ? 'EN' : 'FR';
  document.documentElement.lang = lang;
}

function toggleLang() {
  currentLang = currentLang === 'fr' ? 'en' : 'fr';
  localStorage.setItem('lang', currentLang);
  applyLang(currentLang);
}

applyLang(currentLang);

document.getElementById('lang-toggle').addEventListener('click', toggleLang);
document.getElementById('theme-toggle').addEventListener('click', toggleTheme);
