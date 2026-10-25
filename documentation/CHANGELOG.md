# Historique des évolutions

Ce journal explique les changements de produit et de documentation pour le frontend Vue. Les éléments antérieurs à cette tenue de journal sont reconstitués à partir du code et des décisions produit ; ils ne constituent pas un historique Git.

## État repris du travail antérieur

- **Portail Vue autonome côté interface — réalisé :** pages Vue, navigation à fragments URL, sélecteur et traductions français/anglais/italien. Le projet reste à extraire dans un dépôt Git indépendant ; l’API est un service séparé.
- **Navigation et abonnement — ajustés :** sous-menus rendus visibles et menu recentré dans le parcours Abonnement ; texte principal réduit et icônes cœur remplacées par une présentation plus cohérente avec l’identité visuelle.
- **Partenaires et ODD — ajoutés :** section partenaires et présentation de l’ODD 3 de l’ONU dans l’interface.
- **Observatoire de l’accès — ajouté/ajusté :** analyse des réseaux et carte d’inégalité avec calculs de distance et conclusions côté frontend, sans appel API pour cette carte.
- **Authentification frontend — retirée :** pas de connexion/inscription proposée dans cette interface. Les protections de l’API restent indépendantes et ne sont pas désactivées.
- **Pages RGPD — créées puis précisées :** page pédagogique sur les droits, les données de santé, les limites de l’anonymisation et les éléments qui doivent être confirmés par le responsable du traitement.
- **Gestion des traitements — spécifiée, non implémentée :** e-mail vérifié, double contrôle du consentement, preuve versionnée, alertes, modification, suppression et retrait. Voir [`TREATMENT_MANAGEMENT_API.md`](./TREATMENT_MANAGEMENT_API.md).
- **Limites d’intégration identifiées :** certains dashboards sont indisponibles ou en démonstration ; le formulaire Vue de traitement n’a pas encore le parcours cible de consentement et de gestion.

## 25 octobre 2026

- **Docker ajouté :** build multi-stage (Node 22 puis Nginx), configuration de fallback SPA et Docker Compose avec URL API injectée au build ; `.dockerignore` exclut les dépendances, le build local et les fichiers `.env`.
- **Guide de dépôt autonome ajouté :** instructions pour copier le frontend hors du dépôt parent, vérifier les fichiers, initialiser Git et pousser vers un dépôt distant distinct.
- **README actualisé :** précise que Vue est le frontend final visé, distinct du portail React, et documente installation, configuration API, limites actuelles et organisation documentaire.
- **Documentation organisée :** les PRD ont été regroupés dans `prd_files/` ; `documentation/` sert au guide projet, à ce journal et au contrat de parcours backend.
- **PRD contextualisé pour Vue :** les chemins React historiques sont identifiés comme références d’origine ; les exigences ne sont plus présentées comme des fonctionnalités toutes livrées.
- **Page RGPD corrigée en français, anglais et italien :** distingue les catégories de données prévues par l’API séparée de ce que le formulaire Vue collecte aujourd’hui.
- **État actuel du formulaire expliqué :** collecte d’informations de santé et d’accès, option d’alerte facultative, absence actuelle d’e-mail vérifié et de case de consentement explicite, récapitulatif partiel et absence de gestion self-service. Le texte présente ces éléments comme des lacunes à traiter, non comme des fonctions existantes.
- **Images locales et sensibilisation — ajoutées :** photos de santé communautaire intégrées au bundle dans `public/images/`, illustration originale pour la section de premiers secours, présentations adaptées aux écrans mobiles et sources/licences consignées dans [`ASSETS.md`](./ASSETS.md). Le contenu médical n’a pas été supprimé.
