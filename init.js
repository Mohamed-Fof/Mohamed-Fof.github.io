/* Chargé dans <head>, avant l'affichage : applique le thème (choix enregistré, sinon celui du système)
   et signale que JavaScript est actif, pour que les animations d'entrée partent d'un état caché. */
(function () {
  var racine = document.documentElement, theme;
  try { theme = localStorage.getItem('theme'); } catch (e) { /* stockage indisponible */ }
  if (theme !== 'dark' && theme !== 'light') {
    theme = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  racine.setAttribute('data-theme', theme);
  racine.classList.add('js');
})();
