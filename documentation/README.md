# Documentation du frontend Vue Move4Epilepsy

## Objectif et séparation des projets

Ce dossier contient le frontend final Move4Epilepsy, construit avec Vue 3, TypeScript et Vite. Il est distinct du portail historique React `move4epilepsy-portalLocal`. L’API `move4epilepsy-api` est un projet backend séparé ; elle n’est ni incluse ni modifiée ici.

Le frontend est prévu pour être extrait dans un dépôt Git indépendant. Tant que cela n’a pas été fait, vérifier la racine Git active avant toute opération de commit ou de publication : le dossier peut encore être placé à l’intérieur du dépôt général `Projet`.

## Structure de l’application

- `src/App.vue` initialise l’application et la navigation.
- `src/components/PageView.vue` sélectionne le contenu selon la route hash (`/#home`, `/#access-dashboard`, etc.).
- `src/components/` contient les pages et les composants de fonctionnalité.
- `src/locales/{fr,en,it}/translation.json` porte les traductions.
- `src/services/api.ts` centralise les requêtes HTTP ; l’URL de base est `VITE_API_BASE_URL`.
- `public/` contient les ressources copiées sans transformation par Vite.
- `prd_files/` contient le PRD produit dans ses formats Markdown, HTML et Word.

## Comportements et statut connus

- L’interface ne propose pas de connexion frontend. Cela n’autorise pas l’accès aux routes backend protégées et ne modifie pas leur contrôle d’accès.
- La recherche et la carte de l’inégalité d’accès présentent une estimation de proximité et des conclusions calculées côté client ; cette carte n’interroge pas l’API.
- Le formulaire public de traitement envoie actuellement les informations saisies à l’endpoint de traitement de l’API. Il ne met pas encore en œuvre l’e-mail vérifié, la preuve de consentement attendue, ni la consultation/modification/suppression ultérieure. Son écran de récapitulatif n’affiche qu’une partie des réponses.
- L’alerte de disponibilité du formulaire reste facultative dans le code Vue actuel. Les exigences décidées pour l’e-mail, les alertes et le consentement sont à intégrer après validation du contrat backend.
- Certains dashboards affichent un état indisponible ou des données de démonstration plutôt qu’une intégration complète. Ne pas présenter les exemples de démonstration comme des données patients réelles.
- La page RGPD est informative. Elle décrit séparément les champs prévus par l’API et l’état actuel des formulaires Vue ; elle ne certifie pas la conformité légale ou technique du service.
- Le frontend dispose d’un Dockerfile multi-stage et d’un Compose pour servir le bundle avec Nginx. La création du dépôt Git autonome reste à effectuer.

## Construire et vérifier

Depuis la racine du frontend :

```bash
npm ci
npm run build
```

Pour le développement local, copier `.env.example` vers `.env` et configurer `VITE_API_BASE_URL`. Ne jamais placer de secret dans une variable `VITE_*` : sa valeur est livrée au navigateur.

## Docker et publication Git

Voir [`DOCKER_AND_GIT.md`](./DOCKER_AND_GIT.md) pour construire et lancer le conteneur, puis copier le frontend dans un dossier autonome et créer son dépôt Git sans inclure les fichiers locaux.

## Documents

- [`../prd_files/PRD.md`](../prd_files/PRD.md) — exigences produit et historique des versions.
- [`TREATMENT_MANAGEMENT_API.md`](./TREATMENT_MANAGEMENT_API.md) — proposition de parcours et de contrat backend, à valider.
- [`CHANGELOG.md`](./CHANGELOG.md) — résumé des évolutions et de leur état.
