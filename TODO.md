# À faire

Liste des prochaines tâches pour LoL en 1 minute. Coche une case (`- [x]`) quand c'est terminé, et indique la pull request qui l'a réglée.

## Contenu des fiches

- [ ] **Reprendre « Quand il devient fort » pour les 172 autres champions** (Ahri est déjà fait, voir #2).
  Ce champ doit donner les fenêtres de puissance face à l'adversaire direct (même voie, ou jungle contre jungle) : niveaux clés, sort qui change tout quand il est disponible, bon schéma d'échange.
  Exemple : Ahri a un bon niveau 1 (auto, W, auto pour Électrocution), elle est dangereuse dès que son charme (E) est disponible, puis au niveau 6 avec son R.
  Ce segment s'adresse à celui qui affronte le champion **directement** : il donne quand et comment il est dangereux en face à face, avec de quoi l'affronter. Ses forces générales, celles qu'on croise depuis une autre voie ou en jungle, sont déjà couvertes par « Ses forces », « Ses faiblesses » et « Comment le battre » : ne pas les répéter ici.
  Méthode prévue : par lots de 10 à 20 champions, en commençant par les plus joués. Sources : guides onetricks.gg Grand Maître et plus, puis relecture par un joueur.
  Penser à reporter chaque correction dans les traductions anglaise et espagnole.
- [ ] **Relire les fiches des champions les plus joués** (plan, conseils, forces et faiblesses), en priorité ceux que les débutants affrontent le plus.
- [ ] **Faire relire les traductions** anglaise et espagnole par des joueurs de ces langues.
- [ ] **Kindred** : les titres de section disent « him » en anglais, alors que la fiche parle de deux personnages (« they »).

## Fonctionnalités

- [ ] **Conseils par voie** : préciser la voie concernée par chaque fiche, ou proposer des conseils différents selon la voie (par exemple Nidalee en jungle et en voie du haut).
- [ ] **Badge « À revoir »** sur les fiches vérifiées à un ancien patch (le champ `patch` de chaque fiche le permet déjà).
- [ ] **Suggestion de langue** discrète (« Read in English? ») pour les visiteurs dont le navigateur est en anglais ou en espagnol, sans redirection automatique.

## Site et référencement

- [ ] **Nom de domaine** propre au lieu de `lol-en-1-minute.vercel.app`.
- [ ] **Mesure d'audience** (par exemple Vercel Web Analytics) pour savoir quels champions sont consultés.
- [ ] **Google Search Console** : ajouter la balise de validation, puis envoyer `/sitemap.xml` (522 pages en 3 langues).
- [ ] **Ko-fi** : remettre le lien (`KOFI_URL` dans `src/config.js`) une fois le projet validé par Riot.

## Dépôt GitHub

- [ ] Supprimer l'ancienne branche `preview-design` (à faire depuis GitHub : je n'ai pas les droits pour la supprimer).
