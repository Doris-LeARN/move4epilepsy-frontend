# Déploiement du frontend Move4Epilepsy

Le frontend Vue est un site statique servi par Nginx dans Docker. Il ne se
connecte jamais directement à PostgreSQL : les lectures et écritures passent par
l’API Move4Epilepsy. Pour déployer la base et l’API, suivre aussi le guide
`DEPLOIEMENT.md` du dépôt `move4epilepsy-api`.

## Prérequis

- Node.js 22.12 ou ultérieur et npm pour le développement local.
- Docker avec Docker Compose v2 pour le déploiement conteneurisé.
- Une API joignable depuis le navigateur et configurée pour autoriser l’origine
  du frontend dans `BACKEND_CORS_ORIGINS`.

## Développement local

Depuis la racine de `move4epilepsy-frontend` :

```bash
npm ci
cp .env.example .env
```

Dans `.env`, configurer l’adresse de l’API locale :

```dotenv
VITE_API_BASE_URL=http://localhost:8002/api/v1
```

Démarrer l’interface et ouvrir l’adresse indiquée par Vite, généralement
`http://localhost:5173` :

```bash
npm run dev -- --host 127.0.0.1
```

L’API doit autoriser `http://localhost:5173` dans `BACKEND_CORS_ORIGINS`. Pour
valider le frontend avant publication :

```bash
npm test
npm run build
```

## Déploiement Docker

Dans `.env`, définir l’URL publique de l’API et le port frontend :

```dotenv
VITE_API_BASE_URL=https://api.example.com/api/v1
FRONTEND_PORT=8080
```

Remplacer `api.example.com` par le domaine HTTPS réellement déployé. Cette URL
est publique et intégrée au bundle au build; ne placer aucun secret dans une
variable `VITE_*`.

Vérifier la configuration puis construire et démarrer le site :

```bash
docker compose config --quiet
docker compose up -d --build
docker compose ps
docker compose logs --tail=100 frontend
curl --fail --head http://127.0.0.1:8080
```

Le reverse proxy HTTPS doit envoyer le trafic du domaine frontend au port publié
`8080`. L’API doit autoriser l’origine HTTPS exacte du frontend avec CORS.

Après une modification de `VITE_API_BASE_URL`, reconstruire l’image avec
`--build` : un simple redémarrage ne change pas la valeur intégrée au bundle.

## Vérifier l’accès aux données

Remplacer les domaines d’exemple puis contrôler l’API et le site :

```bash
curl --fail https://api.example.com/health
curl --fail https://api.example.com/api/v1/medications
curl --fail --head https://app.example.com
curl --include --request OPTIONS https://api.example.com/api/v1/medications \
  --header 'Origin: https://app.example.com' \
  --header 'Access-Control-Request-Method: GET'
```

La réponse CORS doit contenir
`Access-Control-Allow-Origin: https://app.example.com`. Tester ensuite une page
qui charge des données, par exemple `/#patient-search`.

## Mise à jour et arrêt

Pour publier une nouvelle version frontend :

```bash
git pull
npm ci
npm test
npm run build
docker compose up -d --build
```

Consulter les logs ou arrêter le conteneur :

```bash
docker compose logs -f frontend
docker compose down
```

## Dépannage

- **Erreur CORS** : ajouter l’origine exacte du frontend à
  `BACKEND_CORS_ORIGINS`, puis redémarrer l’API.
- **L’API est introuvable** : en production, `localhost` désigne l’appareil de
  l’utilisateur; `VITE_API_BASE_URL` doit utiliser le domaine public de l’API.
- **L’ancienne URL API reste utilisée** : modifier `.env`, puis reconstruire
  l’image avec `docker compose up -d --build`.
- **La page répond mais n’affiche pas les données** : contrôler l’URL API dans
  le bundle, les logs backend, CORS et la réponse de `/api/v1/medications`.