# Move4Epilepsy — frontend Vue

Application frontend autonome, écrite avec Vue 3, TypeScript et Vite. Elle est distincte du portail React `move4epilepsy-portalLocal` et destinée à devenir le projet frontend final. Le dossier devra être déplacé ou extrait dans son propre dépôt Git avant publication ; le backend `move4epilepsy-api` reste un service séparé, à configurer indépendamment.

Le frontend reprend l’identité visuelle et une partie des parcours du portail historique. Le PRD décrit les exigences produit ; il ne signifie pas que chacune de ses fonctionnalités est déjà disponible dans cette version Vue. Voir l’état du projet et l’historique des changements dans [`documentation/`](./documentation/).

## Prérequis

- Node.js 20 ou une version LTS ultérieure
- npm
- Une instance de l’API pour tester les fonctions qui en dépendent

## Installation et démarrage

```bash
npm ci
cp .env.example .env
npm run dev
```

Le serveur Vite affiche l’adresse locale à ouvrir dans le navigateur. Les routes de navigation utilisent le fragment URL, par exemple `/#home` et `/#access-dashboard`.

Configurez l’URL de base de l’API dans `.env` :

```dotenv
VITE_API_BASE_URL=http://localhost:8002/api/v1
```

En production, cette variable doit désigner une URL joignable depuis le navigateur de l’utilisateur. Elle est intégrée au bundle lors du build. Le serveur API doit autoriser l’origine du frontend via CORS.

## Scripts

| Commande | Description |
|---|---|
| `npm run dev` | Démarre le serveur de développement Vite. |
| `npm run build` | Vérifie les types Vue/TypeScript puis génère le bundle dans `dist/`. |
| `npm run preview` | Sert localement le bundle de production pour vérification. |
| `npm test` | Exécute les tests unitaires frontend. |

## État et limites actuels

- L’interface est parcourable sans connexion frontend ; cela ne désactive ni ne remplace les contrôles d’accès que l’API doit appliquer.
- Plusieurs pages publiques et visualisations sont disponibles, mais certaines données et certains dashboards dépendent de l’API ou restent en démonstration/indisponibles.
- Le formulaire de déclaration de traitement vérifie l’adresse e-mail et recueille séparément les consentements facultatifs aux analyses et aux alertes. Le parcours de gestion ultérieure des déclarations n’est pas encore intégré.
- Le frontend peut être construit et servi avec Docker Compose. Le dépôt Git autonome est disponible sur GitHub ; `main` contient la base et les évolutions sont proposées par pull request vers `develop`.

## Documentation

- [`prd_files/`](./prd_files/) — PRD en Markdown, HTML et Word.
- [`documentation/README.md`](./documentation/README.md) — architecture, périmètre et statut du frontend Vue.
- [`documentation/CHANGELOG.md`](./documentation/CHANGELOG.md) — journal des évolutions et de leur statut.
- [`documentation/TREATMENT_MANAGEMENT_API.md`](./documentation/TREATMENT_MANAGEMENT_API.md) — parcours cible des traitements, du consentement et des alertes, à valider avec l’équipe backend.
- [`documentation/ASSETS.md`](./documentation/ASSETS.md) — images locales utilisées par l’interface et leurs sources.
- [`documentation/DOCKER_AND_GIT.md`](./documentation/DOCKER_AND_GIT.md) — conteneurisation locale et création du dépôt Git indépendant.

## Docker

```bash
cp .env.example .env
# Configure VITE_API_BASE_URL dans .env
docker compose build
docker compose up -d
```

Le frontend est ensuite disponible par défaut sur `http://localhost:8080`. La configuration Docker et le flux de branches Git sont décrits dans [`documentation/DOCKER_AND_GIT.md`](./documentation/DOCKER_AND_GIT.md).

## Sécurité et données personnelles

Ne placez jamais de secret dans une variable `VITE_*` : ces variables sont visibles dans le code livré au navigateur. Le fichier `.env` local est ignoré par Git. N’utilisez pas de données de santé réelles pour les tests sans environnement et mesures de protection appropriés.

La page RGPD est une explication informative, pas une déclaration de conformité ni un avis juridique. Les informations sur le responsable du traitement, les bases légales, les durées de conservation, les destinataires et l’hébergement doivent être validées avant toute mise en production.
