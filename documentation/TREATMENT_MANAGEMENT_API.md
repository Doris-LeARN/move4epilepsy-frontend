# Parcours API : traitements, consentement et alertes

**Projet de référence :** frontend Vue Move4Epilepsy  
**Statut :** création, vérification e-mail, consentements versionnés et analyses publiques implémentés ; l'interface patient de gestion reste à intégrer
**Périmètre :** enregistrement, preuve du consentement, alertes e-mail, accès, modification, suppression et retrait du consentement.

Ce document décrit le parcours actuellement utilisé par le frontend et les routes disponibles dans l'API. Les textes d'information, la base légale et les règles de conservation restent à valider par le responsable du traitement avant la mise en production.

## Objectif

Permettre à une personne de partager un traitement sans créer de compte patient. Une adresse e-mail vérifiée est requise pour l'enregistrement et la gestion ultérieure ; l'analyse agrégée et les alertes de disponibilité sont des choix distincts et facultatifs.

L'e-mail associé à une déclaration de traitement est une donnée personnelle et peut révéler une information de santé. Les traitements, localisations et récits ne sont donc pas réputés anonymes du seul fait que le formulaire ne demande ni nom ni compte.

## Parcours d'enregistrement

1. **Saisie** : toutes les réponses structurées du questionnaire médical, d'accès et psychosocial/professionnel sont requises. Des réponses explicites « préfère ne pas répondre » ou « ne sait pas » sont proposées quand elles sont pertinentes ; les questions conditionnelles ne sont requises que lorsqu'elles s'appliquent. Les commentaires libres et le consentement à l'analyse restent facultatifs.
2. **Récapitulatif** : le frontend affiche une sélection de réponses, l'adresse e-mail à vérifier, le choix facultatif d'analyse agrégée et le choix d'alertes. La personne peut revenir modifier le formulaire.
3. **Vérification de l'e-mail** : l'API envoie un code temporaire à usage unique. La vérification précède l'enregistrement ; la demande de code ne crée pas de traitement.
4. **Choix et preuve de consentement** : le frontend transmet séparément l'option d'analyse et celle des alertes, avec la version `v3`. L'API crée un brouillon de consentement à durée limitée.
5. **Confirmation finale** : l'action « Confirmer et enregistrer » transmet la preuve e-mail et le jeton du brouillon. L'API vérifie les deux, enregistre le traitement et consomme le brouillon. Une demande d'alerte sans consentement correspondant est refusée.
6. **Gestion ultérieure** : l'API propose vérification e-mail, consultation, modification, suppression et retrait/suppression des déclarations. Le frontend ne propose pas encore cette interface patient.

## Preuve du consentement

L'API doit conserver une preuve minimale, versionnée et horodatée, séparée du contenu clinique autant que possible :

- identifiant interne de la déclaration ;
- finalité et décision associée, au minimum analyse et alertes ;
- version exacte du texte d'information/consentement ;
- horodatage du choix explicite au formulaire ;
- horodatage de la confirmation finale ;
- état et date de vérification de l'e-mail ;
- état et date de retrait uniquement si cette preuve est conservée selon une politique approuvée.

Le consentement d'analyse et le consentement d'alertes sont enregistrés séparément avec la version du texte et des horodatages. Le consentement enregistré par l'interface ne détermine pas à lui seul la base légale applicable. Le responsable du traitement doit valider la base et la condition particulière applicable aux données de santé avant toute mise en production.
À ce jour, la route de retrait supprime les déclarations sélectionnées ; elle ne conserve pas de journal distinct du retrait. Cette politique et les obligations de conservation doivent être validées avant production.

## Accès ultérieur, modification et suppression

1. La personne saisit l'adresse utilisée pour ses déclarations.
2. L'API envoie un code à usage unique. Une fois le code vérifié, elle émet une session temporaire de gestion.
3. Cette session donne accès exclusivement aux déclarations rattachées à l'adresse vérifiée. Les réponses ne doivent pas permettre de découvrir si une adresse ou une déclaration existe.
4. La personne peut consulter ses déclarations et modifier les champs autorisés. Une modification ne doit ni remplacer l'historique du consentement ni modifier le lien de contact sans nouvelle vérification.
5. La personne peut sélectionner un ou plusieurs traitements et demander leur suppression. Une confirmation explicite est requise ; une suppression groupée est atomique.
6. Une action distincte permet de retirer le consentement. Selon la règle produit retenue, cela arrête les alertes et déclenche la suppression des déclarations concernées, sous réserve des obligations légales applicables.

L'API ne doit jamais permettre la gestion self-service d'un traitement en se basant seulement sur son identifiant, son âge, sa ville ou son médicament. La vérification de propriété est appliquée à chaque lecture, modification et suppression.

## Contrat API actuellement implémenté

Les chemins ci-dessous sont relatifs au préfixe `/api/v1` et correspondent aux routes disponibles.

| Action | Route indicative | Résultat attendu |
|---|---|---|
| Demander un code de vérification | `POST /patients/treatments/email-verification/request` | Champ `purpose` : `registration` ou `management`; aucun traitement créé. |
| Confirmer l'e-mail | `POST /patients/treatments/email-verification/confirm` | Retourne un jeton de création ou une session de gestion selon le `purpose`. |
| Créer le brouillon de consentement | `POST /patients/treatments/consent` | Enregistre les choix d'analyse et d'alertes avec la version du texte ; retourne un jeton temporaire. |
| Créer un traitement | `POST /patients/treatments` | Exige les jetons e-mail et consentement valides ; crée le traitement et consomme le brouillon. |
| Consulter ses traitements | `GET /patients/treatments/mine` | Session de gestion requise ; limite les résultats à l'adresse vérifiée. |
| Modifier un traitement | `PATCH /patients/treatments/mine/{id}` | Mise à jour partielle ; identité et preuve de consentement non modifiables. |
| Supprimer une sélection | `DELETE /patients/treatments/mine` | Session requise ; suppression atomique des traitements sélectionnés appartenant à l'adresse. |
| Retirer le consentement | `POST /patients/treatments/mine/consent/withdraw` | Supprime les traitements sélectionnés ; la politique de conservation doit être validée. |
| Révoquer la session de gestion | `POST /patients/treatments/mine/session/revoke` | Invalide la session courante. |

Les codes OTP ne doivent jamais être transmis dans une URL ou écrits dans les journaux. La session de gestion doit avoir une durée limitée et une portée minimale ; une preuve de soumission ne doit pas donner accès à la consultation des traitements existants.

## Protection et suppression des données

- Limiter les tentatives et le débit des demandes de codes ; appliquer une expiration et un usage unique.
- Stocker les codes de manière à ne pas conserver leur valeur en clair lorsque possible ; exclure codes, jetons et contenu médical des logs.
- Ne pas permettre l'énumération des adresses ou des traitements par différences de messages, statuts ou temps de réponse.
- Ne pas exposer l'e-mail dans les dashboards, API publiques ou exports analytiques.
- À la suppression ou au retrait, arrêter les alertes et tâches planifiées associées, retirer les déclarations des vues/caches/exports renouvelables et recalculer les indicateurs concernés.
- Ne conserver que des agrégats réellement et irréversiblement anonymisés. La pseudonymisation ou la suppression de l'e-mail seule ne garantit pas l'anonymat.
- Définir les délais de purge des sauvegardes et la durée distincte de conservation de la preuve minimale de consentement/retrait ; documenter les exceptions légales et ne pas promettre un effacement immédiat non garanti.

## Analyses publiques agrégées

`GET /api/v1/patients/analytics/public` alimente les dashboards globaux, tendances, projections et cartes publiques.

- Les calculs incluent uniquement les traitements dont `consent_analysis` vaut `true`.
- La réponse contient des agrégats, jamais d'identifiant de traitement, d'e-mail, de récit libre ou de ligne patient.
- Le seuil minimal d'affichage est de 10 déclarations par groupe. Les petits groupes sont regroupés ou masqués ; si l'échantillon global est inférieur à 10, les ventilations sont supprimées.
- Les champs structurés sont inclus dans les ventilations disponibles et dans les indicateurs de complétude ; les champs libres (effets secondaires, difficultés, commentaires, actions et noms saisis) servent uniquement à mesurer la complétude, leur contenu n'est pas analysé automatiquement.
- Les réponses structurées documentent aussi les changements de traitement attribués au coût, les contextes de discrimination et les besoins prioritaires de soutien aux droits. Elles peuvent éclairer le plaidoyer et la conception d'aides, mais ne prouvent pas à elles seules une causalité ni ne remplacent une évaluation représentative.
- Les coûts et revenus sont recueillis, mais ne sont pas comparés par montant entre pays car la devise n'est pas encore demandée ; ils restent inclus dans la complétude des réponses.
- Les lieux sont appariés exclusivement à des noms de villes béninoises reconnus exactement. Le formulaire ne recueillant pas de pays distinct, les lieux ambigus ou non reconnus ne sont pas géocodés ni affichés. Les coordonnées ne sont pas déduites d'une adresse libre.
- La projection éventuelle est une extrapolation linéaire descriptive du nombre de déclarations mensuelles, disponible uniquement avec au moins six mois répondant au seuil. Elle n'utilise pas les variables individuelles du questionnaire et ne constitue pas une prédiction clinique, de disponibilité ou de risque.
- Les résultats décrivent les déclarations consentantes de la plateforme et ne sont pas représentatifs de la population générale.

## Référentiel et médicaments absents

- Le formulaire propose un seul menu de médicaments, recherché et regroupé par catégories antiépileptiques, antidépresseurs, anxiolytiques et antipsychotiques.
- La liste de médicaments déjà présente dans le prototype est conservée comme référentiel provisoire, et n'est pas présentée comme médicalement validée. Aucun nouveau nom n'est ajouté au catalogue par la saisie patient.
- La sélection reste mono-médicament par déclaration dans cette version. Une déclaration de plusieurs médicaments est reportée, car le dosage et les autres réponses sont actuellement portés par un seul traitement.
- La catégorie est transmise avec le traitement sélectionné. Un nom absent peut être associé à la catégorie choisie ou à une catégorie inconnue. Le nom saisi est affiché au récapitulatif avant confirmation. Après confirmation du patient, l'API crée le traitement et une proposition distincte au statut `pending_validation`, avec la catégorie si connue, le pays et la ville/zone déclarés. La proposition n'est pas ajoutée à `medications`.
- Le statut en attente n'interrompt pas l'enregistrement du patient et ne déclenche pas d'action d'un administrateur ou d'un professionnel dans ce parcours. Les outils de validation et leurs rôles restent à concevoir séparément.
- Dans le dépôt API, `scripts/migrate_medication_categories.py` prépare les domaines, catégories et la table `unlisted_medication_submissions`; elle doit être exécutée sur l'environnement cible avant déploiement.

Les indicateurs privés sont distincts :

- `GET /api/v1/pharmacies/analytics/mine` exige une session pharmacien et ne retourne que le stock de la pharmacie liée au compte.
- `GET /api/v1/admin/dashboard/stats` exige le rôle administrateur et retourne des indicateurs opérationnels agrégés.
- L'authentification web utilise le cookie `access_token` HttpOnly émis par `/api/v1/auth/login`. Le frontend ne lit ni ne conserve le jeton.

## Vérifications et limites avant production

- La création doit échouer sans preuve e-mail valide, sans brouillon de consentement valide ou si une alerte est demandée sans consentement correspondant. Le consentement à l'analyse est facultatif.
- La preuve versionnée des choix et de la confirmation finale est persistée ; les versions obsolètes sont refusées.
- Les OTP expirés, déjà utilisés ou dépassant les limites sont refusés.
- Une session de gestion vérifiée ne peut accéder qu'aux déclarations de son adresse.
- Une modification partielle ne change pas les champs de consentement ; toute modification de finalité ou d'usage exige le traitement adéquat du consentement.
- Les suppressions groupées sont atomiques. Le retrait via l'API supprime les déclarations sélectionnées ; l'interface patient reste à intégrer.
- Les migrations `scripts/migrate_patient_psychosocial_analytics.py` et `scripts/migrate_patient_consent_workflow.py` doivent être exécutées et vérifiées sur l'environnement cible avant déploiement.
- La migration additive `scripts/migrate_patient_advocacy_analytics.py` ajoute trois colonnes facultatives pour les déclarations existantes. Elle n'a pas été exécutée ; la lancer uniquement après validation de l'environnement cible et sauvegarde appropriée.
- Les textes d'information, la base légale, les durées de conservation, la suppression des données dérivées et le besoin d'une preuve distincte de retrait restent à valider avec le responsable du traitement.
- Les tests API nécessitent une base de test disponible ; les changements n'ont pas été validés sur une base de production.

## Travaux frontend restant à faire

- Ajouter une interface patient pour consulter, modifier et supprimer ses propres déclarations, ainsi que retirer son consentement.
- Afficher un récapitulatif complet des réponses avant l'enregistrement, si cela est validé par le responsable du traitement.
