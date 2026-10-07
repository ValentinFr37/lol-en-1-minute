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
- **Données officielles toujours à jour** : champions, sorts et images viennent de [Data Dragon](https://developer.riotgames.com/docs/lol#data-dragon) (Riot Games), en français, au dernier patch.
- **Fiches rédigées à la main** : le contenu « comment le battre » est écrit par un joueur. S'il n'existe pas encore de fiche pour un champion, le site affiche un résumé automatique de ses sorts.
- **Mobile d'abord**, sans backend ni base de données pour le MVP : le site est un front statique très rapide.

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
npm run build   # version de production dans dist/
```

## Organisation

```
src/
  content/champions/   fiches rédigées (une par champion)
  data/nicknames.js    surnoms reconnus par la recherche
  lib/ddragon.js       accès à Data Dragon, cache, mise en forme des données
  lib/search.js        recherche tolérante (normalisation, surnoms, fautes de frappe)
  lib/router.js        mini-routeur
  pages/               accueil et fiche champion
  components/          composants partagés
```

## Ajouter une fiche

Crée `src/content/champions/<id>.json`, où `<id>` est l'identifiant Riot du champion en minuscules : `darius`, `missfortune`, `kogmaw`, ou `monkeyking` pour Wukong. Vite charge automatiquement tous les fichiers de ce dossier.

Inspire-toi de `darius.json` :

| Champ         | Contenu                                                    |
| ------------- | ---------------------------------------------------------- |
| `plan`        | Son plan de jeu en une phrase                              |
| `aSurveiller` | La menace numéro 1 et comment réagir                       |
| `contrer`     | 3 conseils concrets pour le battre                         |
| `forces`      | 3 forces                                                   |
| `faiblesses`  | 3 faiblesses                                               |
| `sorts`       | Un résumé d'une ligne pour `P`, `Q`, `W`, `E` et `R`       |
| `momentFort`  | Le moment de la partie où il devient dangereux             |
| `patch`       | Le patch où la fiche a été vérifiée (ou `null`)            |

Règle d'or : chaque phrase doit pouvoir se lire en quelques secondes.

## Mentions légales

LoL en 1 minute n'est pas approuvé par Riot Games et ne reflète pas les opinions de Riot Games ni de quiconque officiellement impliqué dans la production ou la gestion de League of Legends. League of Legends et Riot Games sont des marques commerciales ou des marques déposées de Riot Games, Inc.
