# Parcours API : traitements, consentement et alertes

**Projet de référence :** frontend Vue Move4Epilepsy  
**Statut :** spécification fonctionnelle à valider par l'équipe backend avant implémentation  
**Périmètre :** enregistrement, preuve du consentement, alertes e-mail, accès, modification, suppression et retrait du consentement.

Ce document est placé dans le projet frontend final pour servir de contrat de travail avec l'équipe backend. Il ne signifie pas que les routes ou champs décrits sont déjà implémentés dans l'API. Les noms et schémas exacts restent à définir côté backend.

## Objectif

Permettre à une personne de partager un ou plusieurs traitements sans créer de compte patient ni fournir son nom, tout en utilisant une adresse e-mail vérifiée pour les alertes de disponibilité obligatoires dans le parcours produit et pour retrouver/gérer ses déclarations.

L'e-mail associé à une déclaration de traitement est une donnée personnelle et peut révéler une information de santé. Les traitements, localisations et récits ne sont donc pas réputés anonymes du seul fait que le formulaire ne demande ni nom ni compte.

## Parcours d'enregistrement

1. **Saisie** : la personne remplit le formulaire de traitement, fournit son adresse e-mail et voit une information claire sur les usages, les alertes, la gestion ultérieure et le retrait.
2. **Premier consentement** : la personne coche explicitement la case prévue dans le formulaire ; elle n'est jamais précochée. Les décisions concernant l'analyse des déclarations et les alertes sont conservées séparément.
3. **Vérification de l'e-mail** : l'API envoie un code temporaire à usage unique. La vérification doit précéder la confirmation finale. Une demande de code ne crée pas de traitement définitif.
4. **Récapitulatif** : le frontend présente l'ensemble des informations saisies, l'adresse vérifiée, les finalités et les décisions de consentement. La personne peut revenir corriger le formulaire.
5. **Confirmation finale** : seule l'action explicite « Confirmer et enregistrer » crée la déclaration. L'API vérifie la preuve e-mail toujours valide et persiste, dans une opération cohérente, le traitement et la preuve de consentement.
6. **Alertes** : les alertes de disponibilité par e-mail sont requises dans le parcours produit retenu. Les événements déclencheurs, la fréquence et l'utilisation de l'adresse doivent être expliqués avant le consentement. Les courriels contiennent le minimum nécessaire et évitent les détails cliniques.

Le parcours React possède déjà le double contrôle d'interface (case puis récapitulatif avec confirmation). Le formulaire Vue doit conserver cette intention. À ce jour, le formulaire Vue ne transmet pas encore de preuve de consentement, et le backend actuel ne conserve pas les données nécessaires au parcours cible.

## Preuve du consentement

L'API doit conserver une preuve minimale, versionnée et horodatée, séparée du contenu clinique autant que possible :

- identifiant interne de la déclaration ;
- finalité et décision associée, au minimum analyse et alertes ;
- version exacte du texte d'information/consentement ;
- horodatage du choix explicite au formulaire ;
- horodatage de la confirmation finale ;
- état et date de vérification de l'e-mail ;
- horodatage du retrait, s'il a lieu.

Le consentement enregistré par l'interface ne détermine pas à lui seul la base légale applicable. Le responsable du traitement doit confirmer la base et la condition particulière applicable aux données de santé, ainsi que la justification du caractère obligatoire de l'e-mail et des alertes, avant toute mise en production.

## Accès ultérieur, modification et suppression

1. La personne saisit l'adresse utilisée pour ses déclarations.
2. L'API envoie un code à usage unique. Une fois le code vérifié, elle émet une session temporaire de gestion.
3. Cette session donne accès exclusivement aux déclarations rattachées à l'adresse vérifiée. Les réponses ne doivent pas permettre de découvrir si une adresse ou une déclaration existe.
4. La personne peut consulter ses déclarations et modifier les champs autorisés. Une modification ne doit ni remplacer l'historique du consentement ni modifier le lien de contact sans nouvelle vérification.
5. La personne peut sélectionner un ou plusieurs traitements et demander leur suppression. Une confirmation explicite est requise ; une suppression groupée est atomique.
6. Une action distincte permet de retirer le consentement. Selon la règle produit retenue, cela arrête les alertes et déclenche la suppression des déclarations concernées, sous réserve des obligations légales applicables.

L'API ne doit jamais permettre la gestion self-service d'un traitement en se basant seulement sur son identifiant, son âge, sa ville ou son médicament. La vérification de propriété est appliquée à chaque lecture, modification et suppression.

## Contrat de routes indicatif

Ces chemins sont des propositions de discussion, pas une exigence de nommage. Le backend choisit les routes et DTO finaux avant que le frontend ne les intègre.

| Action | Route indicative | Résultat attendu |
|---|---|---|
| Demander la vérification e-mail avant soumission | `POST /patients/treatments/verification/request` | Envoi d'un code temporaire ; aucun traitement créé. |
| Confirmer l'e-mail | `POST /patients/treatments/verification/confirm` | Preuve temporaire de soumission, limitée à la création. |
| Créer un traitement | `POST /patients/treatments` | Création uniquement après e-mail vérifié et confirmation finale ; enregistre aussi les choix/version/horodatages de consentement. |
| Demander l'accès de gestion | `POST /patients/treatments/management/request` | Envoi d'un OTP ; réponse non énumérante. |
| Confirmer et ouvrir la session | `POST /patients/treatments/management/confirm` | Session temporaire liée à l'adresse vérifiée. |
| Consulter ses traitements | `GET /patients/treatments/mine` | Uniquement les déclarations liées à la session vérifiée. |
| Modifier un traitement | `PATCH /patients/treatments/{id}/mine` | Mise à jour partielle de champs autorisés avec vérification de propriété. |
| Supprimer une sélection | Route de suppression groupée à définir | Confirmation requise ; transaction atomique pour la sélection. |
| Retirer le consentement | Route de retrait à définir | Horodate le retrait, arrête les alertes et applique la politique de suppression. |

Les codes OTP ne doivent jamais être transmis dans une URL ou écrits dans les journaux. La session de gestion doit avoir une durée limitée et une portée minimale ; une preuve de soumission ne doit pas donner accès à la consultation des traitements existants.

## Protection et suppression des données

- Limiter les tentatives et le débit des demandes de codes ; appliquer une expiration et un usage unique.
- Stocker les codes de manière à ne pas conserver leur valeur en clair lorsque possible ; exclure codes, jetons et contenu médical des logs.
- Ne pas permettre l'énumération des adresses ou des traitements par différences de messages, statuts ou temps de réponse.
- Ne pas exposer l'e-mail dans les dashboards, API publiques ou exports analytiques.
- À la suppression ou au retrait, arrêter les alertes et tâches planifiées associées, retirer les déclarations des vues/caches/exports renouvelables et recalculer les indicateurs concernés.
- Ne conserver que des agrégats réellement et irréversiblement anonymisés. La pseudonymisation ou la suppression de l'e-mail seule ne garantit pas l'anonymat.
- Définir les délais de purge des sauvegardes et la durée distincte de conservation de la preuve minimale de consentement/retrait ; documenter les exceptions légales et ne pas promettre un effacement immédiat non garanti.

## Critères de validation backend

- Le dépôt échoue si l'e-mail n'est pas vérifié, si le consentement requis manque ou si la confirmation finale n'a pas été effectuée.
- La preuve versionnée du premier consentement et de la confirmation finale est persistée.
- Les OTP expirés, déjà utilisés ou dépassant les limites sont refusés.
- Une adresse vérifiée ne peut accéder qu'à ses propres déclarations.
- Une modification partielle ne change pas l'historique de consentement ; toute modification de finalité ou d'usage exige le traitement adéquat du consentement.
- Les suppressions individuelles et groupées sont testées ; les suppressions groupées sont atomiques et nécessitent une confirmation.
- Le retrait arrête les alertes liées et retire les déclarations des analyses selon la politique convenue.
- Les erreurs et limites de débit n'exposent pas l'existence d'une adresse ou d'un traitement.

## Points à confirmer avant intégration frontend

- Routes, formats de requête/réponse et codes d'erreur définitifs.
- Modèle de données pour l'adresse vérifiée, les alertes et l'historique de consentement.
- Durée et limites OTP, durée/session de gestion, et politiques anti-abus.
- Règle de consentement et action exacte au retrait/suppression, après validation juridique.
- Politique et délais de purge, y compris sauvegardes et données dérivées.
- Texte d'information et version à transmettre/enregistrer.
