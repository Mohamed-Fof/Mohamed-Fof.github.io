# Mohamed Fofana — Portfolio

Portfolio personnel déployé sur GitHub Pages.

🌐 **Site en ligne :** [https://Mohamed-Fof.github.io](https://Mohamed-Fof.github.io)

---

## Contenu

- **Accueil** : présentation, disponibilité, chiffres clés
- **Projets** : scoring de risque de crédit et Olist Analytics (études de cas avec graphiques), puis autres projets
- **Parcours** : expérience, formation et distinction
- **Compétences**, bandeau **MF Consulting** (agent Momo) et **Contact**
- Page **Jeux & Société** : laboratoire interactif de théorie des jeux

## Fichiers

| Fichier | Rôle |
|---|---|
| `index.html`, `site.css`, `site.js` | page d'accueil, son style et ses animations |
| `init.js` | thème et état initial, chargé avant l'affichage |
| `app.js` | traductions FR / EN et bascule de thème (partagé avec `jeux.html`) |
| `chat.js` | widget de l'agent Momo |
| `jeux.html`, `jeux.js`, `style.css`, `script.js` | page Jeux & Société |

## Sécurité

- Politique CSP stricte déclarée dans la page : aucun script ni style en ligne, connexions limitées au backend de Momo et à l'application de scoring
- Liens externes en `noopener noreferrer`, politique de référent `strict-origin-when-cross-origin`
- Les réponses du chatbot sont échappées avant affichage

## Stack technique

| Composant | Technologie |
|---|---|
| Frontend | HTML / CSS / JavaScript |
| Hébergement | GitHub Pages |
| Chatbot backend | Node.js serverless (Vercel) |
| IA | Claude API (Anthropic) |
| Emails | Resend |

## Déploiement

Le site est automatiquement publié à chaque push sur la branche `main`.

```bash
git add index.html style.css script.js
git commit -m "Description"
git push
```

## Contact

📧 fofana12ad@gmail.com  
💼 [linkedin.com/in/mohamed-fofana-05720a28b](https://www.linkedin.com/in/mohamed-fofana-05720a28b/)
