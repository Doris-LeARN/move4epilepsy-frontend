# Docker et dépôt Git indépendant

Ce guide concerne le frontend Vue uniquement. L’API `move4epilepsy-api` reste un service séparé et n’est ni construite ni démarrée par ce Compose.

## Conteneurisation locale

Prérequis : Docker avec le plugin `docker compose`.

Depuis la racine du frontend :

```bash
cp .env.example .env
```

Renseigner les variables dans `.env` :

```dotenv
VITE_API_BASE_URL=http://localhost:8000/api/v1
FRONTEND_PORT=8080
```

`VITE_API_BASE_URL` est intégrée au bundle au moment du build et doit être une URL accessible depuis le navigateur de l’utilisateur. Pour un déploiement, remplacer `localhost` par l’URL HTTPS publique de l’API. Ne jamais mettre un secret dans une variable `VITE_*` : les valeurs sont visibles dans le navigateur.

Construire et démarrer le frontend :

```bash
docker compose config
docker compose build
docker compose up -d
docker compose ps
```

Ouvrir `http://localhost:8080` ou tester la réponse :

```bash
curl -I http://localhost:8080
```

Voir les journaux et arrêter :

```bash
docker compose logs -f frontend
docker compose down
```

Le Dockerfile utilise deux étapes : compilation et vérification TypeScript avec Node 22, puis service des fichiers statiques avec Nginx. La configuration Nginx renvoie les chemins de la SPA vers `index.html`. L’API doit autoriser l’origine du frontend avec CORS.

### Vérification locale du 25 octobre 2026

Le port `8080` était libre avant le démarrage du frontend : `lsof -nP -iTCP:8080 -sTCP:LISTEN` ne retournait aucun processus. Après le démarrage, le conteneur publiait bien `0.0.0.0:8080->80/tcp` et `curl http://localhost:8080` retournait `HTTP 200`. Aucun conflit de port n’a donc été constaté.

Le build de production (`npm run build`), la validation Compose (`docker compose config`) et la construction de l’image ont réussi. Pour le contrôle, l’URL de l’API a été fournie dans l’environnement de chaque commande :

```bash
VITE_API_BASE_URL=http://localhost:8000/api/v1 docker compose ps
VITE_API_BASE_URL=http://localhost:8000/api/v1 docker compose logs -f frontend
VITE_API_BASE_URL=http://localhost:8000/api/v1 docker compose down
```

Sans fichier `.env`, Compose exige cette variable même pour des commandes telles que `ps` et `down`. Pour éviter de la répéter, copiez `.env.example` en `.env` et adaptez ses valeurs comme décrit plus haut.

## Dépôt Git et branches

Ce dossier est la racine du dépôt Git autonome du frontend. Il ne faut pas le recopier dans un dépôt parent. La branche `develop` est créée à partir de `main` après le commit initial :

```bash
git init -b main
git add .
git status --short
git commit -m "Initialise le frontend Vue Move4Epilepsy"
git switch -c develop
```

Dans l’état constaté le 25 octobre 2026, le dépôt local est initialisé, le commit `66ba350` (`Initialise le frontend Vue Move4Epilepsy`) est le commit initial de `main`, et `develop` a été créée depuis ce commit. Le worktree était propre et aucun dépôt distant (`origin`) n’était configuré. Aucun push ni aucune pull request n’a donc été effectué.

Créez un dépôt distant vide, puis ajoutez-le et publiez les deux branches :

```bash
git remote add origin https://github.com/TON-ORG/move4epilepsy-frontend.git
git push -u origin main
git push -u origin develop
```

Remplacez `TON-ORG` par l’organisation ou le compte propriétaire. Pour les évolutions, créez une branche de travail depuis `develop`, puis ouvrez une pull request vers `develop`. Si le dépôt distant existe déjà avec des commits, récupérez et vérifiez d’abord son historique ; ne poussez pas avant d’avoir confirmé que `main` est bien la branche de base attendue.

## Vérifications avant publication

- `npm ci && npm run build` réussit.
- `docker compose config` affiche la configuration attendue et l’image démarre localement.
- `VITE_API_BASE_URL` pointe vers l’API destinée à cet environnement et cette API accepte l’origine frontend.
- Aucun secret, fichier `.env`, donnée de santé réelle ou artefact local n’est commité.
- Le dépôt distant est bien le nouveau dépôt frontend, distinct du portail React et de l’API.
