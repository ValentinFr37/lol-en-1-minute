# LoL en 1 minute

Comprendre et contrer n'importe quel champion de League of Legends **pendant l'écran de chargement**.

Le site est pensé pour les débutants : tu tapes le nom du champion adverse sur ton téléphone, et tu as en moins d'une minute :

- ce qu'il faut surveiller en priorité ;
- comment le battre ;
- ses forces et ses faiblesses ;
- ses sorts résumés en une ligne.

## Fonctionnalités

- **Recherche instantanée** : tolère les fautes de frappe et les accents, et reconnaît les surnoms (`mf`, `j4`, `kog`…). Appuie sur `Entrée` pour ouvrir le premier résultat, `/` pour revenir dans la recherche et `Échap` pour quitter une fiche.
- **Filtre par rôle** : assassin, combattant, mage, tireur, support, tank.
- **Données officielles toujours à jour** : champions, sorts et images viennent de [Data Dragon](https://developer.riotgames.com/docs/lol#data-dragon) (Riot Games), dans la langue de la page, au dernier patch.
- **Fiches rédigées à la main** : le contenu « comment le battre » est écrit par un joueur. S'il n'existe pas encore de fiche pour un champion, le site affiche un résumé automatique de ses sorts.
- **Mobile d'abord**, sans backend ni base de données pour le MVP : le site est un front statique très rapide.
- **Référencement** : chaque page (accueil + une par champion) est pré-rendue en HTML au build, avec son titre, sa description, ses balises de partage (Open Graph, Twitter) et des données structurées (schema.org). Le build génère aussi `sitemap.xml`, `robots.txt` et une vraie page 404.

## Stack

- React 19 + Vite
- Vitest pour les tests unitaires
- ESLint
- Déploiement prévu sur Vercel (`vercel.json` gère les routes de l'application)

Aucune librairie de routage : deux pages ne le justifiaient pas. Un mini-routeur basé sur l'History API se trouve dans `src/lib/router.js`.

## Démarrer

Prérequis : Node.js 20.19 ou plus récent.

```bash
npm install
npm run dev     # http://localhost:5173
npm test        # tests unitaires
npm run lint
npm run build   # version de production dans dist/ (avec pré-rendu, voir plus bas)
npm run preview # sert dist/ en local
```

## Comment fonctionne le build

`npm run build` enchaîne trois étapes :

1. `vite build` : construit l'application pour le navigateur ;
2. `vite build --ssr src/entry-server.jsx` : construit la même application pour Node ;
3. `node scripts/prerender.js` : récupère les données Riot du dernier patch, génère avec React le HTML de l'accueil et de chaque champion (`dist/champion/Darius.html`…), puis écrit `sitemap.xml`, `robots.txt` et `404.html`.

Chaque page contient ses données : dans le navigateur, React reprend la main sur le HTML existant (hydratation) sans rien retélécharger. `vercel.json` (`cleanUrls`) sert `champion/Darius.html` à l'adresse `/champion/Darius`.

Le build a besoin d'accéder à Data Dragon. S'il échoue (serveurs de Riot indisponibles), Vercel garde la version précédente en ligne. L'adresse du site utilisée dans les balises se règle avec la variable `VITE_SITE_URL` (par défaut `https://lol-en-1-minute.vercel.app`).

## Organisation

```
src/
  content/champions/   fiches rédigées (une par champion)
  data/nicknames.js    surnoms reconnus par la recherche
  lib/ddragon.js       accès à Data Dragon, cache, mise en forme des données
  lib/search.js        recherche tolérante (normalisation, surnoms, fautes de frappe)
  lib/router.js        mini-routeur
  lib/seo.js           titre, description, balises de partage et données structurées
  entry-server.jsx     point d'entrée du pré-rendu
scripts/prerender.js   génère les pages HTML, le sitemap et robots.txt
  pages/               accueil et fiche champion
  components/          composants partagés
```

## Charte visuelle

Base gris neutre, avec l'illustration officielle du champion fondue dans le haut de la page. Les couleurs vives sont réservées à ce qui doit se repérer vite ; toutes sont des variables en haut de `src/styles.css` :

- **une couleur par touche de sort** (`--key-p` … `--key-r`), identique partout. Dans une fiche, une touche citée seule (« son E », « (Q) ») est automatiquement affichée avec sa couleur ;
- **une couleur par rôle** (`--role-assassin`, `--role-mage`…) ;
- **rouge** (`--threat`) pour ce qu'il faut craindre, **vert** (`--counter`) pour comment gagner, **or** (`--gold`) pour les actions.

## Ajouter une fiche

Crée `src/content/champions/<id>.json`, où `<id>` est l'identifiant Riot du champion en minuscules : `darius`, `missfortune`, `kogmaw`, ou `monkeyking` pour Wukong. Vite charge automatiquement tous les fichiers de ce dossier.

Inspire-toi de `darius.json` :

| Champ         | Contenu                                                    |
| ------------- | ---------------------------------------------------------- |
| `plan`        | Son plan de jeu en une phrase                              |
| `aSurveiller` | La menace numéro 1 et comment réagir                       |
| `genre`       | Optionnel : `"f"` pour une championne (« Comment la battre », « Quand elle devient forte ») |
| `menace`      | Optionnel : la touche du sort à surveiller (`"E"`). Sinon, la première touche citée dans `aSurveiller` est utilisée |
| `contrer`     | 3 conseils concrets pour le battre                         |
| `forces`      | 3 forces                                                   |
| `faiblesses`  | 3 faiblesses                                               |
| `sorts`       | Un résumé d'une ligne pour `P`, `Q`, `W`, `E` et `R`       |
| `momentFort`  | Ses fenêtres de puissance face à son adversaire direct (même voie ou jungle contre jungle) : niveaux clés, sort qui change tout quand il est disponible, bon schéma d'échange. Ex. Ahri : bon niveau 1 (auto, W, auto), dangereuse quand son charme (E) est prêt, puis au niveau 6 |
| `patch`       | Le patch où la fiche a été vérifiée (ou `null`)            |

Règle d'or : chaque phrase doit pouvoir se lire en quelques secondes.

## Langues

Le site existe en français (à la racine : `/champion/Darius`), en anglais (`/en/champion/Darius`) et en espagnol (`/es/champion/Darius`). Un drapeau dans l'en-tête mène à la même page dans une autre langue. Chaque version a son titre, sa description et des balises `hreflang` qui relient les trois pages pour Google ; le sitemap les liste toutes.

- **Textes de l'interface** : `src/i18n.js` (un bloc par langue).
- **Données Riot** : noms, titres et sorts viennent de Data Dragon dans la langue de la page (`fr_FR`, `en_US`, `es_ES`).
- **Fiches traduites** : `src/content/champions/en/<id>.json` et `src/content/champions/es/<id>.json`. Elles ne contiennent que les textes (`plan`, `aSurveiller`, `contrer`, `forces`, `faiblesses`, `sorts`, `momentFort`) ; `genre`, `menace`, `patch` et `auteur` restent dans la fiche française, qui fait référence.

Quand tu corriges une fiche française, pense à reporter la correction dans ses deux traductions. Les tests vérifient que chaque traduction existe, garde des phrases courtes et cite exactement les mêmes touches (Q, W, E, R) que la fiche française.

Pour ajouter une langue : une entrée dans `LANGS` et ses textes dans `src/i18n.js`, son drapeau dans `src/components/LanguageSwitcher.jsx`, puis un dossier de fiches traduites.

## Mentions légales

LoL en 1 minute n'est pas approuvé par Riot Games et ne reflète pas les opinions de Riot Games ni de quiconque officiellement impliqué dans la production ou la gestion de League of Legends. League of Legends et Riot Games sont des marques commerciales ou des marques déposées de Riot Games, Inc.
