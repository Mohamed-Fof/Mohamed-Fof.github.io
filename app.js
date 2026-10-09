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
    nav_projets:'Projets', nav_comp:'Compétences', nav_agence:'Mon Agence',
    /* — HERO — */
    hero_hello:'Bonjour, je suis',
    hero_subtitle:'Étudiant en Master 1 Mathématiques Appliquées, Statistique',
    hero_desc:'Passionné par l\'IA, la Data Science et les Statistiques. Je développe des compétences en programmation, en analyse de données et en modélisation statistique pour résoudre des problèmes complexes et prendre des décisions éclairées.',
    hero_btn_exp:'Voir mes expériences', hero_btn_projects:'Voir mes projets', hero_btn_cv:'Télécharger mon CV', hero_badge:'Stage dès avril 2027',
    hero_btn_app:'Voir mon application',
    /* — ABOUT — */
    about_title:'À propos de moi',
    about_passion_title:'Ce qui me passionne',
    about_passion_1:'L\'intelligence artificielle appliquée : machine learning, deep learning et apprentissage par renforcement. Ce qui m\'intéresse avant tout, c\'est l\'IA qui sert vraiment, celle qui automatise et qui aide à décider.',
    about_passion_2:'La théorie des jeux me passionne tout autant. Comprendre comment des décisions individuelles finissent par produire des équilibres collectifs éclaire aussi bien l\'économie que les situations stratégiques du quotidien.',
    about_passion_3:'En parallèle de mes études, j\'ai fondé <strong>MF Consulting</strong>, une agence qui accompagne les étudiants internationaux dans leur projet d\'études en France, du dossier d\'admission jusqu\'à l\'obtention du visa. J\'y applique cette idée avec <strong>Momo</strong>, un agent conversationnel qui automatise le premier contact.',
    about_bio1:'Étudiant en Master 1 Mathématiques Appliquées, Statistique à l\'Université Clermont Auvergne, issu d\'une Licence MIASHS parcours Économie à l\'Université Grenoble Alpes.',
    about_bio2:'Mon socle, ce sont les mathématiques appliquées : statistiques, probabilités et modélisation. Je les mets aujourd\'hui au service de l\'intelligence artificielle et de la data science.',
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
    exp1_date:'Sep. 2025 – Jan. 2026',
    /* — contenus 2026 : page jeux, compétences, expériences — */
    fam_tj_t:'Théorie des jeux',
    fam_tj_d:'L\'étude des décisions quand le résultat de chacun dépend de ce que font les autres. Voici ses grandes familles, puis de quoi l\'expérimenter.',
    fam_ia_t:'Intelligence artificielle et apprentissage',
    fam_ia_d:'Manipuler un modèle vaut mieux que lire sa définition. Ces trois outils font tourner de vrais réseaux de neurones dans votre navigateur.',
    fam_soc_t:'Modèles de société',
    fam_soc_d:'Des articles jouables qui montrent comment des règles simples produisent des phénomènes collectifs inattendus. Signés Nicky Case, la source du laboratoire ci-dessus.',
    fam_cog_t:'Logique et cognition',
    fam_cog_d:'Les épreuves que l\'on retrouve dans les processus de recrutement, et de quoi mesurer ses propres réflexes.',
    g_tfp_t:'TensorFlow Playground',
    g_tfp_d:'Entraînez un réseau de neurones à la main : couches, neurones, fonction d\'activation, taux d\'apprentissage. On voit la frontière de décision se déformer en direct.',
    g_tm_t:'Teachable Machine',
    g_tm_d:'Entraînez un modèle de classification avec votre webcam, sans écrire une ligne de code. La meilleure démonstration de ce qu\'est un jeu de données d\'entraînement.',
    g_qd_t:'Quick, Draw!',
    g_qd_d:'Un réseau de neurones devine vos dessins en moins de vingt secondes. Derrière le jeu, le plus grand jeu de données de dessins au monde.',
    g_trust_t:'L\'évolution de la Confiance',
    g_trust_d:'La référence sur le dilemme du prisonnier itéré : pourquoi et comment la confiance apparaît, et ce que les erreurs de communication y changent.',
    g_poly_t:'La parabole des polygones',
    g_poly_d:'Le modèle de ségrégation de Schelling, rendu jouable. De petites préférences individuelles suffisent à produire une société très ségrégée.',
    g_crowds_t:'La sagesse ou la folie des foules',
    g_crowds_d:'Comment la forme d\'un réseau social décide de ce qui s\'y propage : une idée juste, une rumeur, ou une panique.',
    g_ballot_t:'To Build a Better Ballot',
    g_ballot_d:'Pourquoi le scrutin majoritaire produit des résultats que personne ne voulait, et ce que donnent les autres modes de scrutin.',
    g_loopy_t:'LOOPY',
    g_loopy_d:'Un bac à sable pour dessiner des systèmes avec leurs boucles de rétroaction, puis les faire tourner. Utile bien au-delà du jeu.',
    g_kwy_t:'Tests psychotechniques',
    g_kwy_d:'Suites logiques, matrices, raisonnement spatial et numérique. Le format exact des tests d\'entrée en école et en entreprise.',
    g_hb_t:'Human Benchmark',
    g_hb_d:'Temps de réaction, mémoire visuelle, empan de chiffres, et votre score comparé à des millions de personnes.',
    g_cmg_t:'Jeux de logique',
    g_cmg_d:'Une large collection de casse-têtes de logique pure, du plus simple au franchement retors.',
    g_cours_t:'Le dilemme du prisonnier, le cours',
    g_cours_d:'Un cours complet en français : matrices de gains, équilibre de Nash, tournois d\'Axelrod et variantes du dilemme.',
    t_coop_t:'Coopératifs ou non coopératifs',
    t_coop_d:'Les joueurs peuvent-ils passer des accords contraignants ? Si oui, l\'analyse porte sur le partage du gain entre coalitions. Sinon, chacun décide seul, et c\'est le cadre du dilemme du prisonnier.',
    t_somme_t:'Somme nulle ou somme non nulle',
    t_somme_d:'Dans un jeu à somme nulle, ce que l\'un gagne, l\'autre le perd exactement : les échecs, le poker. En somme non nulle, la coopération peut enrichir tout le monde, ou l\'affrontement appauvrir tout le monde.',
    t_ordre_t:'Simultanés ou séquentiels',
    t_ordre_d:'Pile ou face se joue en même temps et s\'analyse avec une matrice. Les échecs se jouent à tour de rôle et s\'analysent avec un arbre, résolu par récurrence à rebours.',
    t_info_t:'Information complète ou incomplète',
    t_info_d:'Connaît-on les gains et les intentions des autres ? Quand ce n\'est pas le cas, on entre dans les jeux bayésiens, où les joueurs émettent des signaux et se forgent des croyances.',
    t_repete_t:'Jeux répétés',
    t_repete_d:'La même partie recommence avec les mêmes joueurs. La réputation devient un actif, et la coopération peut s\'installer sans contrat. C\'est le cadre du laboratoire ci-dessous.',
    t_evo_t:'Jeux évolutionnaires',
    t_evo_d:'Les stratégies ne sont plus choisies mais héritées : les plus performantes se répandent dans la population. On y cherche les stratégies évolutionnairement stables.',
    notion_titre:'Le dilemme du prisonnier',
    notion_1:'Deux joueurs gagnent plus en coopérant qu\'en se trahissant mutuellement. Mais chacun gagne encore davantage en trahissant l\'autre, qui coopère. Chacun suit donc son intérêt, et tous les deux finissent perdants. C\'est le modèle formel de situations où l\'intérêt individuel s\'oppose à l\'intérêt collectif.',
    notion_2:'Son importance vient de la répétition. Quand les mêmes joueurs se recroisent, la coopération peut émerger sans contrat ni autorité. En 1980, Robert Axelrod fait s\'affronter des programmes envoyés par des chercheurs du monde entier. La stratégie gagnante, Tit for Tat, tenait en quatre lignes : coopérer, puis rendre coup pour coup. Ce résultat structure aujourd\'hui l\'analyse des accords climatiques, de la concurrence entre entreprises et de la confiance en ligne.',
    passerelle:'Reste à l\'éprouver. Les cinq agents ci-dessous appliquent chacun une stratégie différente face à ce même dilemme : affrontez-les, puis regardez laquelle survit quand tout le monde joue.',
    lab_nom:'Le Laboratoire de la Confiance',
    lab_accroche:'Cinq caractères, un même dilemme : coopérer ou trahir. Jouez contre eux, faites-les s\'affronter, puis regardez qui survit.',
    ong_match:'Match',
    match_title:'Regardez-les s\'affronter',
    match_desc:'Choisissez deux caractères et suivez la partie tour par tour.',
    match_vs:'contre',
    match_btn:'Regarder le match',
    jeux_intro:'Une sélection de ressources interactives pour apprendre en jouant : théorie des jeux, intelligence artificielle, modèles de société et tests de logique.',
    strat_copieur:'Donnant-donnant',
    strat_mouton:'Coopérateur naïf',
    strat_tricheur:'Traître systématique',
    strat_rancunier:'Rancunier',
    strat_detective:'Détective',
    exp1_title:'Économétrie appliquée à la santé',
    exp1_type:'<em>Stage de semestre 5</em>',
    exp2_title:'Stage de recherche en économie de l\'énergie et de l\'environnement',
    chat_statut:'En ligne',
    comp_ia:'Machine Learning & IA',
    comp_stats:'Statistiques & modélisation',
    comp_eco:'Économie, jeux & décision',
    comp_tools:'Outils & déploiement',
    comp_appro:'En approfondissement',
    comp_data:'Données & bases de données',
    comp_methode:'Communication & méthode',
    skills_ia:'<span>Machine Learning supervisé</span><span>Classification</span><span>Régression logistique</span><span>Naive Bayes</span><span>Modélisation prédictive</span><span>Data Mining</span><span>Analyse de données</span><span>Algorithmes stochastiques</span><span>Agents conversationnels (LLM)</span><span>API IA</span>',
    skills_stats:'<span>Probabilités</span><span>Statistiques bayésiennes</span><span>Inférence statistique</span><span>Tests statistiques</span><span>Régression OLS</span><span>Diagnostics économétriques</span><span>Séries temporelles</span><span>Données de panel</span><span>Processus stochastiques</span><span>Chaînes de Markov</span><span>Simulation Monte Carlo</span>',
    skills_eco:'<span>Théorie des jeux</span><span>Équilibre de Nash</span><span>Jeux répétés</span><span>Économie industrielle</span><span>Économie expérimentale</span><span>Économie de la santé</span><span>Économie de l\'énergie</span><span>Théorie des portefeuilles</span><span>Gestion du risque</span><span>Recherche opérationnelle</span><span>Optimisation</span>',
    skills_tools:'<span>Git / GitHub</span><span>Docker</span><span>R Shiny</span><span>Render</span><span>Vercel</span><span>Linux / UNIX</span><span>LaTeX</span><span>Gretl</span><span>SWI Prolog</span><span>VS Code</span><span>Shell</span>',
    skills_appro:'<span>Deep Learning</span><span>Réseaux de neurones</span><span>Apprentissage par renforcement</span><span>NLP</span><span>Séries temporelles avancées</span>',
    skills_data:'<span>SQL</span><span>Modélisation relationnelle</span><span>Entrepôts de données</span><span>Nettoyage de données</span><span>Analyse exploratoire</span><span>Visualisation</span>',
    skills_methode:'<span>Rédaction scientifique</span><span>Article publié</span><span>Restitution de résultats</span><span>Gestion de projet</span><span>Pédagogie et tutorat</span><span>Travail en équipe</span>',
    exp1_org:'Laboratoire AGEIS – Université Grenoble Alpes',
    exp1_li1:'Analyse des inégalités de genre dans l\'espérance de vie à partir de jeux de données internationaux',
    exp1_li2:'Analyse de données et modélisation économétrique incluant des méthodes de Machine Learning',
    exp1_li3:'Livrables : code, rapport de stage, article scientifique publié dans <em>Discover Public Health</em>',
    exp2_date:'Mai 2025 – Juil. 2025',
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
    proj1_domain:'Machine Learning', proj1_title:'Scoring de Risque de Crédit',
    proj1_live:'Application en ligne', proj1_demo:'Ouvrir l\'application', proj_code:'Code source',
    proj1_cold:'Hébergement gratuit : le premier chargement peut prendre ~1 min.',
    proj1_desc:'Six modèles comparés sur 32 409 prêts. Modèle retenu : XGBoost avec contraintes de cohérence (AUC 0,92 contre 0,86 en version initiale), aux côtés d\'une grille de score bancaire. Chaque décision est expliquée par les valeurs de Shapley ; application sécurisée, testée et déployée avec Docker.', proj1_guide:'Guide du projet',
    proj2_domain:'Économétrie', proj2_title:'Déterminants des Prix Immobiliers',
    proj2_desc:'Analyse exploratoire, estimation OLS et validation des hypothèses économétriques (hétéroscédasticité, autocorrélation), puis prédiction des prix par apprentissage automatique et comparaison des modèles.',
    proj3_domain:'Informatique', proj3_title:'Programmation Logique – Jeu "Flaunt" (Hofstadter)',
    proj3_desc:'Conception d\'un agent stratégique adaptatif basé sur la logique et l\'analyse du comportement adverse pour un tournoi inter-cohortes.',
    proj4_domain:'Micro-Économie', proj4_title:'L\'Économie est-elle une Science Expérimentale ?',
    proj4_desc:'Projet de groupe : économie expérimentale et comportementale via quiz et vidéos éducatives sur Moodle pour étudiants de L1.',
    /* — JEUX ET SOCIÉTÉ — */
    jeux_title:'Jeux et Société', nav_jeux:'Jeux & Société',
    ong_duel:'Duel',
    ong_tournoi:'Tournoi',
    ong_evolution:'Évolution',
    tournoi_title:'Qui gagne sur la durée ?',
    tournoi_desc:'Les cinq stratégies s\'affrontent toutes entre elles, dix tours par duel. Le classement révèle laquelle tient le mieux dans un monde où tout le monde joue.',
    tournoi_btn:'Lancer le tournoi',
    evo_title:'Et si les meilleures se reproduisaient ?',
    evo_desc:'Vingt-cinq joueurs, cinq de chaque stratégie. À chaque génération, les cinq derniers adoptent la stratégie des cinq premiers. Chaque colonne est une génération.',
    evo_btn:'Lancer l\'évolution',
    lab_bruit:'Ajouter 5 % d\'erreurs de communication',
    lab_title:'À vous de jouer : coopérer ou trahir ?',
    lab_sous_titre:'Dix tours face à la stratégie de votre choix. Coopération mutuelle : 2 points chacun. Trahir seul : 3 points contre 1 point perdu. Trahison mutuelle : rien.',
    lab_vous:'Vous',
    lab_tour:'Tour',
    lab_autre:'L\'autre',
    lab_coop:'Coopérer',
    lab_trahir:'Trahir',
    lab_rejouer:'Rejouer',
    /* — COMPÉTENCES — */
    comp_title:'Compétences', comp_prog:'Programmation',
    /* — CONTACT — */
    /* — Momo — */
    momo_title:'Mon Agence — MF Consulting',
    momo_subtitle:'J\'accompagne les étudiants internationaux dans la réalisation de leurs projets d\'études en France<br/>Mon objectif : aider chaque étudiant à poursuivre ses rêves académiques avec un accompagnement personnalisé et humain.',
    momo_tagline:'Avec sérieux, écoute et expertise, je guide les étudiants à chaque étape de leur parcours vers la France.',
    momo_s1:'Suivi et préparation du dossier d\'admission',
    momo_s2:'Rédaction et correction du CV et de la lettre de motivation',
    momo_s3:'Préparation à l\'entretien Campus France',
    momo_s4:'Accompagnement jusqu\'à l\'obtention du visa',
    momo_bot_desc:'Discutez avec notre agent pour démarrer votre dossier gratuitement',
    momo_bot_status:'En ligne 24h/24',
    momo_btn:'Démarrer mon dossier avec Momo',
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
    proj_tags_1:'<span>R</span><span>XGBoost</span><span>Grille de score</span><span>Valeurs de Shapley</span><span>Shiny</span><span>Docker</span><span>Risque de crédit</span>',
    proj_tags_2:'<span>Python</span><span>Gretl</span><span>Analyse exploratoire</span><span>Régression OLS</span><span>Diagnostics économétriques</span><span>Machine Learning</span><span>Feature engineering</span><span>Validation croisée</span><span>Random Forest</span><span>RMSE / R²</span>',
    proj_tags_3:'<span>SWI Prolog</span><span>IA</span><span>Logique</span><span>Stratégie</span>',
    proj_tags_4:'<span>LaTeX</span><span>Moodle</span><span>Éco. Expérimentale</span>',
    footer_sub:'Transformer les données en décisions · Ouvert aux stages et alternances en Data Science et IA',
    momo_bot_title:'Momo',
    /* — COMPÉTENCES tags — */
  },
  en: {
    /* — NAV — */
    nav_accueil:'Home', nav_about:'About', nav_exp:'Experience',
    nav_projets:'Projects', nav_comp:'Skills', nav_agence:'My Agency',
    /* — HERO — */
    hero_hello:'Hello, I am',
    hero_subtitle:'Master 1 in Applied Mathematics & Statistics',
    hero_desc:'Passionate about AI, Data Science and Statistics. I develop skills in programming, data analysis and statistical modelling to solve complex problems and make informed decisions.',
    hero_btn_exp:'View my experience', hero_btn_projects:'View my projects', hero_btn_cv:'Download my CV', hero_badge:'Internship from April 2027',
    hero_btn_app:'View my app',
    /* — ABOUT — */
    about_title:'About me',
    about_passion_title:'What drives me',
    about_passion_1:'Applied artificial intelligence: machine learning, deep learning and reinforcement learning. What interests me most is AI that genuinely serves a purpose, the kind that automates and supports decisions.',
    about_passion_2:'Game theory fascinates me just as much. Understanding how individual decisions end up producing collective equilibria sheds light on economics as well as on everyday strategic situations.',
    about_passion_3:'Alongside my studies, I founded <strong>MF Consulting</strong>, an agency supporting international students throughout their plans to study in France, from the application file to the visa. I apply that idea with <strong>Momo</strong>, a conversational agent that automates first contact.',
    about_bio1:'Master\'s student in Applied Mathematics and Statistics at Université Clermont Auvergne, with a BSc in MIASHS (Economics track) from Université Grenoble Alpes.',
    about_bio2:'My foundation is applied mathematics: statistics, probability and modelling. I now put it to work in artificial intelligence and data science.',
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
    exp1_date:'Sep. 2025 – Jan. 2026',
    /* — contenus 2026 : page jeux, compétences, expériences — */
    fam_tj_t:'Game theory',
    fam_tj_d:'The study of decisions when each outcome depends on what the others do. Here are its main families, then a way to experiment with it.',
    fam_ia_t:'Artificial intelligence and learning',
    fam_ia_d:'Handling a model beats reading its definition. These three tools run real neural networks in your browser.',
    fam_soc_t:'Models of society',
    fam_soc_d:'Playable essays showing how simple rules produce unexpected collective outcomes. By Nicky Case, the source behind the lab above.',
    fam_cog_t:'Logic and cognition',
    fam_cog_d:'The tests found in recruitment processes, and a way to measure your own reflexes.',
    g_tfp_t:'TensorFlow Playground',
    g_tfp_d:'Train a neural network by hand: layers, neurons, activation function, learning rate. You watch the decision boundary bend in real time.',
    g_tm_t:'Teachable Machine',
    g_tm_d:'Train a classification model with your webcam, without writing a line of code. The clearest demonstration of what a training set is.',
    g_qd_t:'Quick, Draw!',
    g_qd_d:'A neural network guesses your drawings in under twenty seconds. Behind the game sits the largest drawing dataset in the world.',
    g_trust_t:'The Evolution of Trust',
    g_trust_d:'The reference on the iterated prisoner\'s dilemma: why and how trust appears, and what communication errors change.',
    g_poly_t:'Parable of the Polygons',
    g_poly_d:'Schelling\'s segregation model, made playable. Small individual preferences are enough to produce a deeply segregated society.',
    g_crowds_t:'The Wisdom and Madness of Crowds',
    g_crowds_d:'How the shape of a social network decides what spreads through it: a sound idea, a rumour, or a panic.',
    g_ballot_t:'To Build a Better Ballot',
    g_ballot_d:'Why first past the post produces results nobody wanted, and what other voting systems give instead.',
    g_loopy_t:'LOOPY',
    g_loopy_d:'A sandbox for drawing systems with their feedback loops, then running them. Useful well beyond the game.',
    g_kwy_t:'Aptitude tests',
    g_kwy_d:'Logical sequences, matrices, spatial and numerical reasoning. The exact format of school and company entrance tests.',
    g_hb_t:'Human Benchmark',
    g_hb_d:'Reaction time, visual memory, number span, with your score compared to millions of people.',
    g_cmg_t:'Logic games',
    g_cmg_d:'A large collection of pure logic puzzles, from the simple to the genuinely devious.',
    g_cours_t:'The prisoner\'s dilemma, the course',
    g_cours_d:'A full course in French: payoff matrices, Nash equilibrium, Axelrod\'s tournaments and variants of the dilemma.',
    t_coop_t:'Cooperative or non-cooperative',
    t_coop_d:'Can players make binding agreements? If so, the analysis focuses on how coalitions share the payoff. If not, everyone decides alone, which is the setting of the prisoner\'s dilemma.',
    t_somme_t:'Zero sum or non-zero sum',
    t_somme_d:'In a zero-sum game, what one wins the other loses exactly: chess, poker. In a non-zero-sum game, cooperation can enrich everyone, or conflict impoverish everyone.',
    t_ordre_t:'Simultaneous or sequential',
    t_ordre_d:'Matching pennies is played at the same time and analysed with a matrix. Chess is played in turns and analysed with a tree, solved by backward induction.',
    t_info_t:'Complete or incomplete information',
    t_info_d:'Do you know the others\' payoffs and intentions? When you do not, you enter Bayesian games, where players send signals and form beliefs.',
    t_repete_t:'Repeated games',
    t_repete_d:'The same game starts over with the same players. Reputation becomes an asset and cooperation can settle in without a contract. This is the setting of the lab below.',
    t_evo_t:'Evolutionary games',
    t_evo_d:'Strategies are no longer chosen but inherited: the most successful spread through the population. Here one looks for evolutionarily stable strategies.',
    notion_titre:'The prisoner\'s dilemma',
    notion_1:'Two players earn more by cooperating than by betraying each other. Yet each earns even more by betraying a partner who cooperates. Both follow their own interest, and both end up worse off. It is the formal model of situations where individual interest works against the collective one.',
    notion_2:'Its importance comes from repetition. When the same players meet again, cooperation can emerge with no contract and no authority. In 1980 Robert Axelrod pitted programs submitted by researchers worldwide against each other. The winning strategy, Tit for Tat, fitted in four lines: cooperate, then return like for like. That result still shapes how we analyse climate agreements, competition between firms and trust online.',
    passerelle:'Now put it to the test. The five agents below each apply a different strategy to that same dilemma: take them on, then watch which one survives when everyone plays.',
    lab_nom:'The Trust Lab',
    lab_accroche:'Five characters, one dilemma: cooperate or betray. Play against them, pit them against each other, then watch who survives.',
    ong_match:'Match',
    match_title:'Watch them face off',
    match_desc:'Pick two characters and follow the game round by round.',
    match_vs:'versus',
    match_btn:'Watch the match',
    jeux_intro:'A selection of interactive resources to learn by playing: game theory, artificial intelligence, models of society and logic tests.',
    strat_copieur:'Tit for Tat',
    strat_mouton:'Always Cooperate',
    strat_tricheur:'Always Defect',
    strat_rancunier:'Grudger',
    strat_detective:'Detective',
    exp1_title:'Applied Health Econometrics',
    exp1_type:'<em>Semester 5 Internship</em>',
    exp2_title:'Research Intern in Energy and Environmental Economics',
    chat_statut:'Online',
    comp_ia:'Machine Learning & AI',
    comp_stats:'Statistics & Modelling',
    comp_eco:'Economics, Games & Decision',
    comp_tools:'Tools & Deployment',
    comp_appro:'Currently deepening',
    comp_data:'Data & Databases',
    comp_methode:'Communication & Method',
    skills_ia:'<span>Supervised Machine Learning</span><span>Classification</span><span>Logistic Regression</span><span>Naive Bayes</span><span>Predictive Modelling</span><span>Data Mining</span><span>Data Analysis</span><span>Stochastic Algorithms</span><span>Conversational Agents (LLM)</span><span>AI APIs</span>',
    skills_stats:'<span>Probability</span><span>Bayesian Statistics</span><span>Statistical Inference</span><span>Statistical Testing</span><span>OLS Regression</span><span>Econometric Diagnostics</span><span>Time Series</span><span>Panel Data</span><span>Stochastic Processes</span><span>Markov Chains</span><span>Monte Carlo Simulation</span>',
    skills_eco:'<span>Game Theory</span><span>Nash Equilibrium</span><span>Repeated Games</span><span>Industrial Organisation</span><span>Experimental Economics</span><span>Health Economics</span><span>Energy Economics</span><span>Portfolio Theory</span><span>Risk Management</span><span>Operations Research</span><span>Optimisation</span>',
    skills_tools:'<span>Git / GitHub</span><span>Docker</span><span>R Shiny</span><span>Render</span><span>Vercel</span><span>Linux / UNIX</span><span>LaTeX</span><span>Gretl</span><span>SWI Prolog</span><span>VS Code</span><span>Shell</span>',
    skills_appro:'<span>Deep Learning</span><span>Neural Networks</span><span>Reinforcement Learning</span><span>NLP</span><span>Advanced Time Series</span>',
    skills_data:'<span>SQL</span><span>Relational Modelling</span><span>Data Warehousing</span><span>Data Cleaning</span><span>Exploratory Analysis</span><span>Data Visualisation</span>',
    skills_methode:'<span>Scientific Writing</span><span>Published Article</span><span>Presenting Results</span><span>Project Management</span><span>Teaching and Tutoring</span><span>Teamwork</span>',
    exp1_org:'AGEIS Laboratory – Université Grenoble Alpes',
    exp1_li1:'Analysis of gender inequalities in life expectancy using international datasets',
    exp1_li2:'Data analysis and econometric modelling including Machine Learning methods',
    exp1_li3:'Deliverables: code, internship report, scientific article published in <em>Discover Public Health</em>',
    exp2_date:'May 2025 – Jul. 2025',
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
    proj1_domain:'Machine Learning', proj1_title:'Credit Risk Scoring',
    proj1_live:'Live app', proj1_demo:'Open the app', proj_code:'Source code',
    proj1_cold:'Free hosting: the first load may take ~1 min.',
    proj1_desc:'Six models compared on 32,409 loans. Selected model: XGBoost with consistency constraints (AUC 0.92 vs 0.86 initially), alongside a banking scorecard. Every decision is explained with Shapley values; secure, tested app deployed with Docker.', proj1_guide:'Project guide',
    proj2_domain:'Econometrics', proj2_title:'Determinants of Housing Prices',
    proj2_desc:'Exploratory analysis, OLS estimation and validation of econometric assumptions (heteroskedasticity, autocorrelation), then house price prediction with machine learning and model comparison.',
    proj3_domain:'Computer Science', proj3_title:'Logic Programming – "Flaunt" Game (Hofstadter)',
    proj3_desc:'Design of an adaptive strategic agent based on logic and analysis of opponent behaviour for an inter-cohort tournament.',
    proj4_domain:'Microeconomics', proj4_title:'Is Economics an Experimental Science?',
    proj4_desc:'Group project: experimental and behavioural economics through quizzes and educational videos on Moodle for first-year students.',
    /* — JEUX ET SOCIÉTÉ — */
    jeux_title:'Games and Society', nav_jeux:'Games & Society',
    ong_duel:'Duel',
    ong_tournoi:'Tournament',
    ong_evolution:'Evolution',
    tournoi_title:'Who wins in the long run?',
    tournoi_desc:'The five strategies all play each other, ten rounds per duel. The ranking shows which one holds up best in a world where everyone plays.',
    tournoi_btn:'Run the tournament',
    evo_title:'What if the best ones reproduced?',
    evo_desc:'Twenty-five players, five of each strategy. Each generation, the bottom five adopt the strategy of the top five. Each column is one generation.',
    evo_btn:'Run the evolution',
    lab_bruit:'Add 5% communication errors',
    lab_title:'Your turn: cooperate or betray?',
    lab_sous_titre:'Ten rounds against the strategy of your choice. Mutual cooperation: 2 points each. Betraying alone: 3 points against 1 point lost. Mutual betrayal: nothing.',
    lab_vous:'You',
    lab_tour:'Round',
    lab_autre:'Them',
    lab_coop:'Cooperate',
    lab_trahir:'Betray',
    lab_rejouer:'Play again',
    /* — COMPÉTENCES — */
    comp_title:'Skills', comp_prog:'Programming',
    /* — CONTACT — */
    /* — Momo — */
    momo_title:'My Agency — MF Consulting',
    momo_subtitle:'I support international students in achieving their academic goals in France<br/>My mission: help every student pursue their academic dreams with personalised, human guidance.',
    momo_tagline:'With dedication, attentiveness and expertise, I guide students at every step of their journey to France.',
    momo_s1:'Application file monitoring and preparation',
    momo_s2:'CV and cover letter writing and proofreading',
    momo_s3:'Campus France interview preparation',
    momo_s4:'Support until visa approval',
    momo_bot_desc:'Chat with our agent to start your application for free',
    momo_bot_status:'Online 24/7',
    momo_btn:'Start my application with Momo',
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
    proj_tags_1:'<span>R</span><span>XGBoost</span><span>Credit scorecard</span><span>SHAP values</span><span>Shiny</span><span>Docker</span><span>Credit risk</span>',
    proj_tags_2:'<span>Python</span><span>Gretl</span><span>Exploratory Analysis</span><span>OLS Regression</span><span>Econometric Diagnostics</span><span>Machine Learning</span><span>Feature Engineering</span><span>Cross-validation</span><span>Random Forest</span><span>RMSE / R²</span>',
    proj_tags_3:'<span>SWI Prolog</span><span>AI</span><span>Logic</span><span>Strategy</span>',
    proj_tags_4:'<span>LaTeX</span><span>Moodle</span><span>Exp. Economics</span>',
    footer_sub:'Turning data into decisions · Open to internships and apprenticeships in Data Science and AI',
    momo_bot_title:'Momo',
    /* — SKILLS tags — */
  }
};

// Liste blanche : une valeur inattendue dans localStorage ne doit pas casser les traductions
let currentLang = localStorage.getItem('lang') === 'en' ? 'en' : 'fr';

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
