# Product Requirements Document (PRD)
## Move4Epilepsy - Plateforme Mondiale d'Accès aux Médicaments Antiépileptiques

**Version:** 1.8
**Date:** Novembre 2026
**Statut:** Référentiel produit du portail React historique et du frontend Vue ; les exigences et références de code ne sont pas toutes implémentées dans Vue.  
**Dernière mise à jour:** Novembre 2026 — intégration du formulaire Vue de déclaration, vérification de l'e-mail et consentements séparés

> **Périmètre de ce document :** ce PRD conserve les exigences et références historiques du portail React. Les chemins `src/pages/*.tsx` sont des références à cette version, pas à l’application Vue. Les exigences non encore disponibles dans le frontend Vue ne doivent pas être interprétées comme des fonctionnalités livrées. Voir [`documentation/README.md`](../documentation/README.md) pour l’architecture et l’état effectif du frontend final.

---

## 📋 Table des Matières

1. [Vue d'Ensemble](#vue-densemble)
2. [Vision et Objectifs](#vision-et-objectifs)
   - 2.4 [Technology Readiness Levels (TRL)](#24-technology-readiness-levels-trl)
3. [Personas et Utilisateurs](#personas-et-utilisateurs)
4. [Fonctionnalités Détaillées](#fonctionnalités-détaillées)
   - 4.13 [Pages Légales et Conformité](#413-pages-légales-et-conformité-priorité-haute)
5. [Architecture Technique](#architecture-technique)
6. [Expérience Utilisateur](#expérience-utilisateur)
7. [Métriques et KPIs](#métriques-et-kpis)
8. [Roadmap](#roadmap)
9. [Contraintes et Risques](#contraintes-et-risques)
10. [Appendices](#appendices)

---

## 1. Vue d'Ensemble

### 1.1 Description du Produit

Move4Epilepsy est une plateforme web intelligente qui utilise l'intelligence artificielle et l'analyse de données pour améliorer l'accès équitable aux médicaments antiépileptiques dans le monde entier. La plateforme résout les problèmes d'asymétrie d'information et d'inadéquation entre l'offre et la demande de médicaments antiépileptiques.

### 1.2 Problème Résolu

**Problèmes identifiés :**
- **Inégalités d'accès** : 30% des patients épileptiques rencontrent des difficultés d'accès aux médicaments
- **Asymétrie d'information** : Les patients ne savent pas où trouver leurs médicaments, les pharmacies ne connaissent pas la demande locale
- **Ruptures de stock** : Manque de visibilité sur les stocks et les besoins
- **Désinformation** : 85% des personnes ont des préjugés sur l'épilepsie
- **Manque de données centralisées** : Données fragmentées empêchant une compréhension globale

### 1.3 Solution Proposée

Une plateforme unifiée qui :
- Connecte intelligemment les patients aux pharmacies avec stocks disponibles
- Prédit les ruptures de stock grâce à l'IA
- Collecte des déclarations de santé et d'accès aux médicaments, avec accès restreint et analyses agrégées lorsque la ré-identification est empêchée
- Éduque et sensibilise sur l'épilepsie
- Fournit des analytics aux professionnels de santé

### 1.4 Alignement Stratégique

- **ODD 3.8 de l'ONU** : Couverture Sanitaire Universelle
- **Mission** : Améliorer l'accès équitable aux soins pour tous
- **Vision** : Réduire les inégalités d'accès de 50% d'ici 2027

---

## 2. Vision et Objectifs

### 2.1 Vision Produit

Créer la plateforme de référence mondiale pour l'accès aux médicaments antiépileptiques, en éliminant les barrières géographiques, économiques et informationnelles.

### 2.2 Objectifs Business

| Objectif | Métrique | Cible 2027 |
|----------|----------|------------|
| Réduction des inégalités d'accès | % de patients trouvant leurs médicaments | -50% |
| Base de données | Nombre de traitements enregistrés | 100,000+ |
| Précision prédictive | Précision des modèles IA | 95%+ |
| Couverture géographique | Pays actifs | 20+ pays |
| Engagement pharmaciens | Taux d'adoption pharmacies | 30%+ |

### 2.3 Objectifs Utilisateurs

**Pour les Patients :**
- Trouver leurs médicaments en moins de 3 pharmacies visitées
- Réduire le temps d'attente de 70%
- Recevoir des alertes en temps réel de disponibilité

**Pour les Pharmaciens :**
- Optimiser la gestion des stocks
- Anticiper la demande locale
- Augmenter le chiffre d'affaires de 20%

**Pour les Médecins :**
- Accéder à des analytics sur l'efficacité des traitements
- Identifier les zones à risque de rupture
- Améliorer les prescriptions basées sur les données

### 2.4 Technology Readiness Levels (TRL)

Nous utilisons l'échelle TRL (Technology Readiness Level) pour évaluer le niveau de maturité de chaque fonctionnalité. Cette échelle de 1 à 9 permet une évaluation cohérente de la progression technologique.

**Échelle TRL :**

| TRL | Niveau | Description | Move4Epilepsy |
|-----|--------|-------------|---------------|
| **1** | Observation | Observation et rapports de principes scientifiques | N/A |
| **2** | Concept | Concept et application technologique formalisés | — |
| **3** | Preuve Expérimentale | Preuve expérimentale du concept | — |
| **4** | Prototype Lab | Prototype technologique développé en lab | - |
| **5** | Prototype Validé | Prototype validé en environnement pertinent | Chat, Sensibilisation |
| **6** | Prototype Testé | Prototype testé en environnement opérationnel | Chat, Tendances |
| **7** | En Pré-Production | Démonstration complète en environnement opérationnel | Recherche, Matching, Stocks, Dashboard |
| **8** | Production | Système complet et qualifié en production | Recherche, Matching, Alertes, Stocks, Enregistrement |
| **9** | Production Éprouvée | Système éprouvé en exploitation opérationnelle | Recherche, Matching, Alertes, Abonnements |

**Fonctionnalités par TRL :**

- **TRL 8-9 (Production Éprouvée)** : Recherche de médicaments, Matching intelligent, Système d'alertes, Gestion des stocks, Enregistrement de traitements, Abonnements
- **TRL 7 (En Pré-Production)** : Dashboard global, Prédiction de ruptures (optimisation en cours)
- **TRL 6-7 (Prototype Testé)** : Chat communautaire, Système d'éducation, Questionnaires de perception

---

## 3. Personas et Utilisateurs

### 3.1 Personas Principaux

#### 3.1.1 Patient Épileptique (Utilisateur Principal)

**Profil :**
- Âge : 25-65 ans
- Localisation : Principalement Bénin, expansion internationale
- Besoins : Trouver rapidement ses médicaments, éviter les ruptures
- Frustrations : Visiter plusieurs pharmacies, ruptures imprévisibles
- Objectifs : Continuité du traitement, réduction de l'anxiété

**Cas d'usage :**
- Recherche de médicament en 3 étapes (médicament → zone → résultats)
- Création d'alertes de disponibilité
- Enregistrement de traitement avec données d'accès
- Accès à l'éducation sur l'épilepsie

#### 3.1.2 Pharmacien

**Profil :**
- Gestionnaire de pharmacie
- Besoins : Gérer les stocks, comprendre la demande, optimiser les commandes
- Frustrations : Ruptures inattendues, manque de visibilité sur la demande
- Objectifs : Réduire les ruptures, augmenter les ventes

**Cas d'usage :**
- Déclaration de stocks avec prix, délais, quantités
- Consultation du dashboard avec analytics
- Réception d'alertes de forte demande locale
- Gestion des abonnements

#### 3.1.3 Médecin/Neurologue

**Profil :**
- Professionnel de santé spécialisé
- Besoins : Analytics patients, identification des problèmes d'accès
- Objectifs : Améliorer les prescriptions, suivre l'efficacité

**Cas d'usage :**
- Consultation du dashboard médecin
- Analyse des traitements patients
- Identification des zones à risque
- Recommandations basées sur les données

#### 3.1.4 Administrateur

**Profil :**
- Gestionnaire de la plateforme
- Besoins : Vue globale, gestion des utilisateurs, analytics
- Objectifs : Optimiser la plateforme, assurer la qualité des données

**Cas d'usage :**
- Dashboard admin avec métriques globales
- Gestion des utilisateurs et rôles
- Modération du contenu
- Analyse des tendances

### 3.2 Rôles et Permissions

| Rôle | Accès | Restrictions |
|------|-------|--------------|
| **Anonyme** | Recherche médicaments, formulaires publics | Pas d'accès aux dashboards |
| **Patient** | Toutes les fonctionnalités publiques + alertes personnelles | Pas d'accès aux dashboards |
| **Pharmacien** | Dashboard pharmacie, gestion stocks, analytics zone | Accès limité à sa zone géographique |
| **Médecin** | Dashboard médecin, analytics patients | Accès aux données agrégées autorisées, sans coordonnées ni dossiers identifiants |
| **Admin** | Accès complet, gestion utilisateurs | Aucune restriction |

---

## 4. Fonctionnalités Détaillées

### 4.1 Recherche de Médicaments (Priorité: Haute) - TRL 8-9

**Description :** Système de recherche en 3 étapes permettant aux patients de trouver leurs médicaments.

**Flux utilisateur :**
1. **Étape 1** : Sélection du médicament antiépileptique
2. **Étape 2** : Sélection de la zone géographique (Département > Commune)
3. **Étape 3** : Lancement de la recherche et affichage des résultats

**Résultats de recherche :**
- Liste des pharmacies avec disponibilité
- Statut : Disponible / Indisponible / Non confirmé
- Informations : Nom, adresse, téléphone, distance
- Actions : Appeler, voir sur carte, réserver

**Critères d'acceptation :**
- ✅ Recherche fonctionne sans authentification
- ✅ Résultats triés par distance et disponibilité
- ✅ Affichage du statut en temps réel
- ✅ Intégration avec système de matching intelligent

**Fichiers associés :**
- `src/pages/PatientSearchPage.tsx`
- `src/services/matchingService.ts`

---

### 4.2 Matching Intelligent (Priorité: Haute) - TRL 7-8

**Description :** Algorithme de connexion automatique patients/pharmacies basé sur un score de pertinence.

**Algorithme de scoring :**
- **Disponibilité** : 40% (médicament en stock)
- **Distance** : 40% (proximité géographique)
- **Prix** : 20% (prix compétitif)

**Fonctionnalités :**
- Filtrage automatique par distance maximale
- Tri par score de pertinence décroissant
- Calcul en temps réel
- Cache pour performance

**Critères d'acceptation :**
- ✅ Score calculé correctement selon la formule
- ✅ Résultats triés par pertinence
- ✅ Filtrage par distance fonctionnel
- ✅ Performance < 500ms pour 100 pharmacies

**Fichiers associés :**
- `src/services/matchingService.ts`

---

### 4.3 Système d'Alertes Bidirectionnel (Priorité: Haute) - TRL 7-8

**Description :** Système d'alertes permettant aux patients et pharmacies de communiquer.

**Alertes Patients → Pharmacies :**
- Patient crée une alerte pour un médicament dans une zone
- Pharmacie reçoit notification de forte demande locale
- Permet à la pharmacie d'anticiper les besoins

**Alertes Pharmacies → Patients :**
- Pharmacie déclare un stock disponible
- Patients avec alertes actives dans la zone reçoivent notification
- Notification par email et/ou SMS

**Critères d'acceptation :**
- ✅ Création d'alerte patient fonctionnelle
- ✅ Notification automatique quand stock disponible
- ✅ Gestion des alertes (activer/désactiver/supprimer)
- ✅ Notifications en temps réel

**Fichiers associés :**
- `src/services/alertService.ts`
- `src/pages/PatientSearchPage.tsx`

---

### 4.4 Gestion des Stocks Pharmacies (Priorité: Haute) - TRL 7-8

**Description :** Interface complète pour les pharmaciens pour déclarer et gérer leurs stocks.

**Données collectées :**
- **Quantité en stock** : Nombre d'unités disponibles
- **Prix unitaire** : Prix en monnaie locale
- **Délai de réapprovisionnement** : Jours avant réappro
- **Quantité minimale de commande** : Seuil de commande
- **Historique des ruptures** : Suivi des ruptures passées

**Fonctionnalités :**
- Déclaration de stock par médicament
- Mise à jour en temps réel
- Visualisation de l'historique
- Prédictions de rupture (jours avant rupture)

**Critères d'acceptation :**
- ✅ Déclaration de stock complète
- ✅ Mise à jour en temps réel
- ✅ Calcul automatique des jours avant rupture
- ✅ Historique accessible

**Fichiers associés :**
- `src/pages/PharmacyStockPage.tsx`
- `src/services/pharmacyService.ts`

---

### 4.5 Enregistrement de Traitements Patients (Priorité: Moyenne) - TRL 8

**Description :** Formulaire enrichi pour collecter les données d'accès aux médicaments.

**Données collectées :**
- Informations de traitement (médicament, dosage, fréquence)
- **Période de traitement** (pour les analyses temporelles) :
  - `treatment_start_date` : Date de début du traitement
  - `treatment_end_date` : Date de fin du traitement (optionnel)
  - `treatment_is_ongoing` : Statut « traitement en cours » (booléen)
- **Données d'accès enrichies** :
  - `found_medication` : Facilité à trouver (facile/difficile/impossible)
  - `pharmacies_visited` : Nombre de pharmacies visitées **avant de trouver le médicament** (parcours patient)
  - `waiting_time` : Délai d'obtention (immédiat, jours, semaines)
  - `stockout_frequency` : Fréquence des ruptures (jamais/rarement/souvent)
  - Alertes de disponibilité : elles sont facultatives. Si la personne en demande une, elle doit donner un accord distinct et explicite à l'utilisation de son adresse vérifiée pour ces alertes. Le booléen `wants_alert` ne constitue ni la preuve de vérification, ni celle du consentement.
- **Données socio-économiques et cliniques** (optionnelles) : niveau d'études, revenus, statut d'emploi, effets secondaires, difficultés, commentaires libres, nombre de comprimés (matin/midi/soir), médicament sans alternative, etc.
- **Adresse e-mail** : requise et vérifiée pour enregistrer une déclaration et permettre au déclarant de retrouver et gérer ses traitements. Aucun nom ni compte patient n'est requis. L'e-mail est une donnée personnelle et son association à un traitement révèle potentiellement une information de santé ; il ne doit pas être exposé dans les dashboards, exports analytiques ou courriels au-delà du nécessaire.

**Consentement et confirmation :**
- Le formulaire Vue recueille un accord facultatif, non précoché, pour les analyses agrégées. Si une alerte est demandée, un second accord distinct, non précoché, est requis pour l'envoi de cette alerte ; demander une alerte ne vaut pas consentement.
- Le parcours vérifie l'adresse par un code à usage unique à six chiffres, valable 10 minutes et soumis à une limite de tentatives et de renvois. La vérification est requise avant la confirmation finale ; aucun traitement définitif n'est créé au stade du formulaire, de la demande ou de la vérification du code.
- Après vérification, le formulaire présente un récapitulatif. La confirmation finale est la seule étape qui crée le traitement. L'API enregistre séparément les choix d'analyse et d'alerte, la version du texte (actuellement `v3`), les horodatages et la vérification de l'e-mail.
- Le service d'e-mail doit être configuré pour livrer les codes. En développement, un serveur SMTP local de capture peut être utilisé ; ne pas afficher ni journaliser les codes ou jetons.
- Les traitements et coordonnées ne sont pas réputés anonymes du seul fait qu'aucun nom ou compte n'est demandé. Les champs de santé, la localisation et l'e-mail peuvent permettre une identification directe ou indirecte ; limiter les accès et agréger les statistiques avant publication.
- Le formulaire explique l'utilisation de l'adresse et, lorsque la personne la demande, les alertes par e-mail. La base légale et la condition applicable aux données de santé doivent être validées par le responsable du traitement avant mise en production. La case de consentement et la confirmation de formulaire ne remplacent pas cette validation.

**État de livraison du frontend Vue (novembre 2026) :**
- ✅ Déclaration publique : demande et confirmation du code, récapitulatif, consentement facultatif aux analyses et consentement distinct aux alertes lorsqu'elles sont demandées, puis création après confirmation finale.
- ✅ Les champs obligatoires incomplets sont bloqués avant l'accès au récapitulatif. Les réponses d'erreur de validation de l'API sont présentées de façon lisible.
- ⏳ La gestion ultérieure (liste, modification, suppression, retrait et révocation de session) est exposée par l'API mais n'est pas encore intégrée dans le frontend Vue.
- Les routes de vérification, consentement et création sont disponibles dans l'API : `POST /api/v1/patients/treatments/email-verification/request`, `POST /api/v1/patients/treatments/email-verification/confirm`, `POST /api/v1/patients/treatments/consent` et `POST /api/v1/patients/treatments`.

**Gestion ultérieure :**
- La personne saisit son adresse puis la vérifie à nouveau par un code à usage unique avant de consulter ses traitements associés, les modifier ou les supprimer. Les réponses de l'API ne révèlent pas si une adresse ou une déclaration existe.
- Autoriser la modification individuelle des traitements et la sélection d'un ou plusieurs traitements pour suppression.
- Toute suppression doit être confirmée explicitement et exécutée côté API ; une suppression groupée est atomique.
- Le retrait du consentement doit arrêter les alertes concernées et lancer la suppression du ou des traitements visés selon la règle produit, sous réserve des obligations légales applicables. Retirer aussi les enregistrements supprimés des vues analytiques et recalculer les indicateurs concernés.
- Définir et expliquer le délai de purge des sauvegardes. Ne conserver que des résultats agrégés rendus irréversiblement anonymes ; définir séparément la durée de conservation de la preuve de consentement.

**Critères d'acceptation :**
- ✅ Formulaire accessible sans authentification
- ✅ Toutes les données d'accès collectées
- ✅ E-mail vérifié avant l'enregistrement de la déclaration
- ✅ Consentement d'analyse facultatif et consentement aux alertes séparé, uniquement si une alerte est demandée
- ✅ Consentement et confirmation finale conservés avec version et horodatage
- ⏳ Gestion self-service dans le frontend, après vérification de l'e-mail (API disponible, interface à intégrer)
- ✅ Validation des données

**Fichiers associés :**
- `src/pages/MedicationRegistrationPage.tsx`
- `src/services/patientService.ts`
- `src/utils/dataAnonymization.ts`

---

### 4.6 Dashboards Analytics

#### 4.6.1 Dashboard Global d'Accès (Priorité: Moyenne) - TRL 7

**Description :** Dashboard global de l'accès aux médicaments — toutes les analyses sont calculées à partir des données réelles de l'API (GET `/patients/treatments`, base move4epilepsy-api). Aucune donnée improvisée ; les indicateurs utilisent les dates de début, de fin et le statut « en cours » des traitements.

**Actions utilisateur :**
- **Actualiser le dashboard** : rechargement des données et des analyses
- **Enregistrer un traitement** : lien vers le formulaire d'enregistrement

**Sections du dashboard (avec loaders par section pendant le chargement) :**

1. **Géolocalisation de la demande**  
   Carte Leaflet (fond OpenStreetMap). Les adresses issues de la base sont géocodées via l’API Nominatim (OpenStreetMap) ; marqueurs par localisation avec popup (effectifs, efficacité moyenne, comprimés/jour, coût, ruptures, charge en comprimés, médicaments sans alternative).

2. **Indicateurs globaux**  
   Traitements analysés, taux d'accès moyen, barrière financière (%), comprimés/jour moyenne.

3. **Analyse de l'accès aux traitements**  
   Répartition des modes d'accès déclarés, nombre moyen de pharmacies visitées avant d'obtenir le médicament, délai d'obtention le plus fréquent.

4. **Analyse démographique**  
   Répartition par tranches d'âge et par sexe (graphiques âge/sexe).

5. **Évolution temporelle de l'accès et des ruptures**  
   Par période (mois) : nombre de traitements actifs, taux d'accès, taux de rupture ; **médicaments (effectifs) par période** dans le tableau et dans le tooltip du graphique. Périodes calculées à partir des dates de début, de fin et du statut « en cours ».

6. **Répartition des traitements par médicament**  
   Top des médicaments les plus enregistrés (graphique en camembert).

7. **Charge en comprimés et importance des médicaments**  
   Par médicament : charge moyenne en comprimés/jour, part sans alternative en cas de rupture ; mise en avant de l’importance clinique des médicaments sans alternative.

8. **Situations où l'accès est le plus fragile**  
   Croisement charge en comprimés, ruptures, absence d’alternative ; score de fragilité et tableau des médicaments les plus sensibles.

9. **Ruptures de stock : importance et conséquences**  
   Effectifs avec/sans rupture, efficacité perçue, parcours patient (pharmacies visitées), conclusions sous forme de cartes (Alerte, Point clé, Observation).

10. **Analyse socio-économique de l'accès**  
    Impact du niveau d'études, des revenus et du statut d'emploi sur les difficultés d'accès ; barres de progression et graphiques par statut d'emploi et par tranche de revenu ; mise en avant des profils vulnérables (ex. chômeur, sans salaire déclaré).

11. **Effets secondaires les plus fréquents**  
    Graphique et conclusions à partir des champs libres déclarés.

12. **Difficultés d'accès les plus fréquentes**  
    Graphique et conclusions sur les obstacles mentionnés.

13. **Commentaires additionnels des patients**  
    Thèmes les plus cités dans les commentaires libres, avec conclusions.

**Données et technique :**
- Source : API move4epilepsy-api, endpoint GET `/patients/treatments` (limite adaptée pour l’analytics).
- Périodes temporelles : basées uniquement sur `treatment_start_date`, `treatment_end_date`, `treatment_is_ongoing` (pas sur `created_at`).
- Loaders : chaque section affiche un état de chargement dédié (spinner + message), comme pour la géolocalisation.

**Fichiers associés :**
- `src/pages/AccessDashboard.tsx`
- `src/services/patientService.api.ts` (méthode `getTemporalAccessAnalysis`, géocodage Nominatim côté front)

#### 4.6.2 Dashboard Pharmacien (Priorité: Haute) - TRL 7-8

**Description :** Analytics pour les pharmaciens sur leur zone.

**Métriques affichées :**
- Stocks actuels et prédictions
- Demandes locales
- Alertes de forte demande
- Performance de la pharmacie

**Fichiers associés :**
- `src/pages/PharmacyDashboard.tsx`

#### 4.6.3 Dashboard Médecin (Priorité: Moyenne) - TRL 7

**Description :** Analytics sur les traitements patients.

**Métriques affichées :**
- Efficacité des traitements
- Zones à risque de rupture
- Recommandations basées sur les données
- Statistiques patients agrégées, sans coordonnées ni dossiers identifiants

**Fichiers associés :**
- `src/pages/DoctorDashboard.tsx`

#### 4.6.4 Dashboard Admin (Priorité: Haute) - TRL 7-8

**Description :** Vue complète pour la gestion de la plateforme.

**Métriques affichées :**
- Utilisateurs actifs
- Statistiques globales
- Gestion des utilisateurs
- Modération du contenu

**Fichiers associés :**
- `src/pages/AdminDashboard.tsx`

---

### 4.7 Système d'Abonnements (Priorité: Moyenne) - TRL 7-8

**Description :** Plans d'abonnement adaptés par pays avec tarification locale.

**Plans disponibles :**
- **Basic** : Fonctionnalités essentielles
- **Professional** : Analytics avancés
- **Premium** : Toutes les fonctionnalités + support prioritaire

**Tarification :**
- Adaptée au pouvoir d'achat local
- Paiements en monnaie locale
- Essai gratuit 30 jours

**Critères d'acceptation :**
- ✅ Plans configurables par pays
- ✅ Tarification adaptée
- ✅ Gestion des paiements
- ✅ Essai gratuit fonctionnel

**Fichiers associés :**
- `src/pages/SubscriptionPage.tsx`
- `src/services/subscriptionService.ts`

---

### 4.8 Chat Communautaire (Priorité: Basse) - TRL 6-7

**Description :** Espace de discussion **simple** (sans bot, sans analyse automatique) où la communauté peut échanger librement sur l'épilepsie **sans tabou** — partager vécu, questions, soutien et informations dans un cadre bienveillant.

**Fonctionnalités :**
- **Salon public** : canaux thématiques (ex. Général, Support, Médicaments) ouverts à tous
- **Messagerie privée (inbox)** : possibilité d'écrire en **tête-à-tête** à une personne de son choix
- **Pseudonymes** : protection de la vie privée tout en favorisant l'expression libre
- **Modération humaine** : signalement d'abus et modération manuelle
- **Liberté de parole** : espace dédié à briser les tabous autour de l'épilepsie

**Critères d'acceptation :**
- ✅ Canaux publics fonctionnels
- ✅ Messagerie privée (inbox) entre utilisateurs
- ✅ Pseudonymes uniques
- ✅ Signalement et modération humaine opérationnels

**Fichiers associés :**
- `src/pages/ChatPage.tsx`
- `src/services/chatService.ts`

---

### 4.9 Éducation et Sensibilisation (Priorité: Moyenne) - TRL 6-7

**Pages éducatives :**
- **Awareness** : Sensibilisation sur l'épilepsie
- **Truth** : Combattre les idées reçues
- **Resources** : Ressources éducatives
- **Rights** : Droits des patients

**Fichiers associés :**
- `src/pages/AwarenessPage.tsx`
- `src/pages/TruthPage.tsx`
- `src/pages/ResourcesPage.tsx`
- `src/pages/RightsPage.tsx`

---

### 4.10 Autres Fonctionnalités - TRL 6-7

- **Questionnaires de Perception** : `EpilepsyPerceptionsPage.tsx`
- **Signalement de Médicaments** : `MedicineReportPage.tsx`
- **Partenariats** : `PartnerPage.tsx`
- **Carte des Localisations** : `LocationsMapPage.tsx`
- **Tendances** : `TrendsPage.tsx`

---

### 4.13 Pages Légales et Conformité (Priorité: Haute)

#### 4.13.1 Information sur la protection des données (RGPD)

**Description :** Informer clairement sur les données et les usages avant la collecte, les droits des personnes et les moyens de les exercer. La page pédagogique complète la politique de confidentialité, mais ne constitue ni un avis juridique ni une preuve de conformité.

**Route :**
- Route principale : `#protection-des-donnees` (explicite et claire)
- Routes de compatibilité : `#privacy`, `#rgpd` (redirigent vers la route principale)

**Sections principales :**

1. **Principes de protection**
   - Ne pas qualifier d'anonymes des données liées à un e-mail vérifié, ni des données de santé ou de localisation potentiellement ré-identifiantes.
   - Expliquer les finalités, la base légale à valider, les destinataires, la durée de conservation, les droits et les contacts du responsable.
   - Collecter seulement les informations nécessaires, protéger l'accès et publier des statistiques agrégées uniquement lorsque la ré-identification est raisonnablement empêchée.

2. **Mesures de sécurité**
   - Décrire uniquement les mesures effectivement mises en place et vérifiées.
   - Les codes de vérification doivent être temporaires, protégés contre les tentatives répétées, non inclus dans les URL ou journaux et ne donner accès qu'aux traitements de l'adresse vérifiée.

3. **Données et finalités**
   - Décrire les données de traitement et d'accès, coordonnées de contact/alerte, preuve de consentement et données techniques réellement utilisées.
   - Distinguer les données nécessaires à l'alerte des données exploitées à des fins d'analyse.

4. **Droits et gestion des traitements**
   - Permettre à la personne qui vérifie son e-mail de consulter, rectifier et supprimer un ou plusieurs de ses traitements.
   - Le retrait du consentement met fin aux alertes concernées et entraîne la suppression des traitements associés conformément à la règle produit et aux obligations applicables.

5. **Droits des personnes selon le RGPD**
   - Droit d'information (Art. 13-14 RGPD)
   - Droit d'accès (Art. 15 RGPD)
   - Droit de rectification (Art. 16 RGPD)
   - Droit à l'effacement (Art. 17 RGPD)
   - Droit à la portabilité (Art. 20 RGPD)
   - Droit d'opposition (Art. 21 RGPD)
   - Droit à la limitation (Art. 18 RGPD)
   - Droit de retrait du consentement (Art. 7.3 RGPD)

6. **Cadre légal et responsabilités**
    - Identifier le responsable du traitement, ses coordonnées, les bases légales et conditions applicables aux données de santé, les sous-traitants/destinataires, l'hébergement et les transferts, ainsi que les durées de conservation.
    - Les législations nationales et certifications ne sont mentionnées comme applicables ou obtenues qu'après vérification et validation documentées.

7. **Consentement**
    - Présenter le choix dans le formulaire puis un récapitulatif complet avant enregistrement définitif.
    - Conserver les versions et horodatages de ces étapes ; fournir une action compréhensible pour retirer le consentement.
    - Ne pas inventer d'identité de responsable, d'adresse DPO, de certification ou de délai juridique non confirmé.

**Critères d'acceptation :**
- Page accessible depuis les liens légaux et distincte des conditions d'utilisation.
- Informations exactes, compréhensibles et cohérentes avec les pratiques réellement en place.
- Coordonnées et informations légales requises validées avant publication ; aucun engagement de conformité ou certification non vérifié.

**Fichiers associés :**
- `src/pages/PrivacyPage.tsx`
- `src/App.tsx` (routage)

---

#### 4.13.2 Page de Conditions d'Utilisation

**Description :** Page complète dédiée aux conditions d'utilisation de la plateforme Move4Epilepsy.

**Route :**
- Route principale : `#conditions-utilisation` (explicite et claire)
- Route de compatibilité : `#terms` (redirige vers la route principale)

**Sections principales :**

1. **Acceptation des Conditions**
   - Acceptation pleine et entière
   - Modifications des conditions
   - Acceptation continue

2. **Utilisation de la Plateforme**
   - Usage légitime et conforme
   - Informations exactes et à jour
   - Interdiction d'usage frauduleux
   - Responsabilité du compte

3. **Propriété Intellectuelle**
   - Protection des contenus
   - Droits d'auteur
   - Propriété intellectuelle des contenus ; traitement des données personnelles régi par les informations de confidentialité et le cadre légal applicable
   - Droits des utilisateurs

4. **Utilisations Interdites**
   - Accès non autorisé
   - Transmission de virus
   - Usurpation d'identité
   - Collecte automatisée
   - Informations médicales erronées
   - Violation des lois

5. **Comptes Utilisateurs**
   - Âge minimum (18 ans)
   - Un compte par personne
   - Responsabilité des activités
   - Suspension/suppression en cas de violation

6. **Responsabilités et Limitations**
   - Plateforme fournie "en l'état"
   - Pas de garantie d'exactitude
   - Limitation de responsabilité
   - Ne remplace pas les conseils médicaux
   - Interruption/modification possible

7. **Modifications et Disponibilité**
   - Modifications possibles à tout moment
   - Disponibilité 24/7 non garantie
   - Communication des modifications importantes
   - Interruptions techniques

8. **Droit Applicable et Juridiction**
   - Droit applicable selon juridiction
   - Compétence des tribunaux
   - Version française faisant foi
   - Invalidité partielle

9. **Droits des Utilisateurs**
   - Droit d'accès
   - Droit de rectification
   - Droit de résiliation
   - Droit de portabilité

10. **Contact et Support**
    - Formulaire de contact
    - Email : contact@move4epilepsy.fr
    - Délai de réponse : 48 heures

11. **Mentions Légales**
    - Éditeur de la plateforme
    - Hébergement (Supabase)
    - Dernière mise à jour
    - Liens utiles

**Critères d'acceptation :**
- ✅ Page accessible via route explicite `#conditions-utilisation`
- ✅ Compatibilité avec route `#terms`
- ✅ Toutes les sections documentées
- ✅ Liens vers page de protection des données
- ✅ Design cohérent avec le reste de la plateforme
- ✅ Accessible depuis le footer

**Fichiers associés :**
- `src/pages/TermsOfUsePage.tsx`
- `src/App.tsx` (routage)

**Intégration :**
- Lien dans le footer : "Conditions d'utilisation" → `#conditions-utilisation`
- Lien dans la page de protection des données (référence croisée)

---

## 5. Architecture Technique

### 5.1 Stack Technologique

**Frontend :**
- **React 18.3.1** : Framework UI
- **TypeScript 5.5.3** : Typage statique
- **Tailwind CSS 3.4.1** : Framework CSS
- **Vite 7.1.4** : Build tool
- **React Router** : Navigation (via hash routing)
- **i18next** : Internationalisation (FR, EN, IT)
- **Lucide React** : Icônes
- **Recharts** : Graphiques
- **Leaflet** : Cartes interactives

**Backend :**
- **API move4epilepsy-api** (FastAPI) : Endpoints pour les traitements patients (GET/POST `/patients/treatments`), médicaments, pharmacies, etc. Données stockées en base (PostgreSQL ou équivalent). Le dashboard global d’accès consomme exclusivement cette API pour ses analyses.
- **Supabase** (selon déploiement) : Backend-as-a-Service optionnel
  - PostgreSQL : Base de données
  - Row Level Security (RLS) : Sécurité granulaire
  - Real-time : Notifications instantanées
  - Authentication : Gestion des utilisateurs
  - Storage : Stockage de fichiers

**Outils de Développement :**
- **Vitest** : Tests unitaires
- **ESLint** : Linting
- **PostCSS** : Traitement CSS
- **TypeScript Strict Mode** : Sécurité de type

### 5.2 Architecture Base de Données

**Tables Principales :**

#### Gestion des Utilisateurs
- `user_profiles` : Profils utilisateurs avec pseudonymes
- `user_roles` : Rôles (admin, pharmacien, medecin, patient)

#### Médicaments et Stocks
- `medications` : Catalogue des médicaments antiépileptiques
- `pharmacies` : Réseau de pharmacies avec géolocalisation
- `pharmacy_stocks` : Stocks détaillés (quantité, prix, délais, historique)

#### Recherche et Alertes
- `patient_searches` : Analytics de recherche
- `search_alerts` : Alertes patients
- `alerts` : Système d'alertes bidirectionnel
- `stockout_alerts` : Suivi des ruptures de stock

#### Données Cliniques
- `patient_treatments` : Déclarations de traitements et données d'accès/santé, potentiellement ré-identifiantes. Champs principaux : `medication_name`, `treatment_start_date`, `treatment_end_date`, `treatment_is_ongoing`, `found_medication`, `pharmacies_visited` (nombre de pharmacies visitées avant de trouver le médicament), `waiting_time`, `stockout_frequency`, `effectiveness`, `education_level`, `minimum_salary`, `employment_status`, `has_alternative_medication`, `morning_pills` / `noon_pills` / `evening_pills`, `side_effects`, `difficulties`, `additional_comments`, etc. État : l'API enregistre l'e-mail vérifié, les choix de consentement séparés avec leur version et leurs horodatages, et utilise des codes/jetons temporaires pour la vérification. Le frontend Vue intègre la déclaration ; la gestion ultérieure reste à intégrer.
- Une preuve de consentement distincte des données cliniques doit conserver les finalités, les versions de texte, les horodatages des deux confirmations et le retrait éventuel, selon une durée documentée. Les codes OTP et sessions de gestion sont temporaires et ne sont pas stockés en clair.

#### Communauté
- `chat_channels` : Canaux de discussion publics
- `chat_messages` : Messages des salons publics
- `direct_messages` : Messagerie privée (inbox) entre utilisateurs
- `message_reports` : Signalements (modération humaine)

#### Abonnements
- `subscription_plans` : Plans d'abonnement
- `country_pricing` : Tarification par pays
- `pharmacy_subscriptions` : Abonnements actifs
- `subscription_payments` : Historique paiements

#### Analytics
- `demand_analytics` : Analyses de demande
- `stockout_predictions` : Prédictions IA

### 5.3 Sécurité et protection des données

- Les traitements et coordonnées associés sont des données personnelles/sensibles à protéger, même lorsque le formulaire ne demande ni nom ni compte.
- Les lectures et modifications globales restent réservées aux rôles autorisés. La gestion par e-mail vérifié doit être strictement limitée aux traitements associés à cette adresse et ne doit pas exposer de données à des tiers.
- Les codes de vérification et jetons de gestion sont temporaires, à usage contrôlé, limités en tentatives et exclus des URL/journaux. Les réponses ne doivent pas permettre l'énumération d'adresses ou de traitements.
- Les suppressions doivent être appliquées en base et propagées aux vues, caches et agrégats concernés ; documenter les exceptions et délais de purge des sauvegardes.
- Les mesures techniques, certifications, politiques RLS, durées de conservation et affirmations de conformité doivent être documentées uniquement après vérification du déploiement réel.

### 5.4 Performance

**Optimisations :**
- Index sur colonnes fréquemment requêtées
- Cache pour résultats de matching
- Lazy loading des composants
- Code splitting par route

**Métriques cibles :**
- Temps de chargement initial : < 2s
- Temps de réponse API : < 500ms
- Matching intelligent : < 500ms pour 100 pharmacies

---

## 6. Expérience Utilisateur

### 6.1 Design System

**Palette de Couleurs :**
- **Lavender** : Couleur principale (#BA55D3, #E6E6FA)
- **Purple** : Couleur secondaire (#9932CC, #8B008B)
- **Semantic Colors** : Vert (succès), Rouge (erreur), Bleu (info)

**Composants UI :**
- Cards avec ombres et hover effects
- Boutons avec transitions fluides
- Formulaires avec validation
- Modals responsives

### 6.2 Responsive Design

- **Mobile First** : Optimisé pour mobile
- **Breakpoints** : sm, md, lg, xl
- **Touch Friendly** : Boutons et interactions adaptés

### 6.3 Internationalisation

**Langues supportées :**
- Français (FR) - Par défaut
- Anglais (EN)
- Italien (IT)

**Fichiers de traduction :**
- `src/locales/fr/translation.json`
- `src/locales/en/translation.json`
- `src/locales/it/translation.json`

### 6.4 Accessibilité

- Navigation au clavier
- Contraste de couleurs WCAG AA
- Labels ARIA
- Structure sémantique HTML

---

## 7. Métriques et KPIs

### 7.1 Métriques Utilisateurs

| Métrique | Description | Cible |
|----------|-------------|-------|
| **Utilisateurs actifs mensuels (MAU)** | Nombre d'utilisateurs uniques par mois | 10,000+ |
| **Taux d'adoption pharmacies** | % de pharmacies utilisant la plateforme | 30%+ |
| **Recherches réussies** | % de recherches trouvant un médicament | 80%+ |
| **Taux de création d'alertes** | % d'utilisateurs créant des alertes | 40%+ |

### 7.2 Métriques Produit

| Métrique | Description | Cible |
|----------|-------------|-------|
| **Temps moyen de recherche** | Temps pour trouver un médicament | < 2 min |
| **Nombre de pharmacies visitées** | Moyenne avant de trouver | < 2 |
| **Précision matching** | % de matches pertinents | 90%+ |
| **Taux de notification** | % d'alertes déclenchées | 70%+ |

### 7.3 Métriques Business

| Métrique | Description | Cible |
|----------|-------------|-------|
| **Taux d'abonnement pharmacies** | % de pharmacies abonnées | 20%+ |
| **Rétention utilisateurs** | % d'utilisateurs actifs après 30 jours | 60%+ |
| **Taux de conversion** | % de recherches → réservations | 30%+ |

### 7.4 Métriques Techniques

| Métrique | Description | Cible |
|----------|-------------|-------|
| **Temps de chargement** | Temps de chargement initial | < 2s |
| **Temps de réponse API** | Latence moyenne API | < 500ms |
| **Uptime** | Disponibilité de la plateforme | 99.5%+ |
| **Taux d'erreur** | % de requêtes en erreur | < 0.1% |

---

## 8. Roadmap

### 8.1 Phase 1 : MVP (Terminé ✅)

**Période :** 2024-2025  
**Statut :** ✅ Complètement déployé en production

**Fonctionnalités livrées :**
- ✅ Recherche de médicaments en 3 étapes (TRL 8-9)
- ✅ Système d'authentification (admin, pharmacien, médecin) (TRL 8)
- ✅ Gestion des stocks pharmacies (TRL 7-8)
- ✅ Dashboards de base (TRL 7-8)
- ✅ Système d'alertes bidirectionnel (TRL 7-8)
- ✅ Enregistrement de traitements patients (TRL 8)
- ✅ Matching intelligent (TRL 7-8)
- ✅ Système d'abonnements (TRL 7-8)
- ✅ Chat communautaire — salons publics + inbox privée (TRL 6-7)
- ✅ Pages d'éducation et sensibilisation (TRL 6-7)

### 8.2 Phase 2 : Amélioration et Expansion (En cours 🚧)

**Période :** Q2 2025 - Q3 2026  
**Statut :** 🚧 Actuellement en développement

**Fonctionnalités livrées récemment :**
- ✅ Dashboard global d'accès enrichi (toutes les sections décrites en 4.6.1) - TRL 7
- ✅ Géolocalisation de la demande (carte Leaflet, géocodage OpenStreetMap/Nominatim)
- ✅ Évolution temporelle avec médicaments par période (dates début/fin, statut « en cours »)
- ✅ Loaders par section du dashboard
- ✅ Analyse socio-économique, effets secondaires, difficultés, commentaires
- ✅ Interface multilingue (FR, EN, IT)
- ✅ Système de paiement USD pour abonnements

**Fonctionnalités en développement :**
- 🚧 Optimisation du matching intelligent (TRL 7 → 8)
- 🚧 Amélioration des prédictions IA
- 🚧 Expansion géographique (pays supplémentaires)
- 🚧 Amélioration des analytics et dashboards
- 🚧 Refinement de l'expérience utilisateur

**Timeline :** Objectif fin Q3 2026

### 8.3 Phase 3 : Intelligence Avancée (Planifié 📅)

**Période :** Q4 2026 - Q1 2027  
**Statut:** 📅 En planification R&D

**Fonctionnalités prévues :**
- 📅 Modèles de prédiction de demande avancés
- 📅 Détection automatique de ruptures (amélioration)
- 📅 Recommandations personnalisées intelligentes
- 📅 Analyse prédictive des tendances améliorée

**Ressources :** 2 Data Scientists FTE  
**Budget estimé :** ~3000-5000 USD/mois (infrastructure ML)  
**Timeline :** 12-18 mois de R&D et déploiement progressif

### 8.4 Phase 4 : Mobile et Expansion (Futur 🔮)

**Période :** 2027+  
**Statut :** 🔮 Planification à long terme

**Fonctionnalités futures :**
- 🔮 Application mobile native (iOS/Android)
- 🔮 Notifications push géolocalisées
- 🔮 Géolocalisation en temps réel (parcours patient)
- 🔮 Intégration avec systèmes de santé nationaux
- 🔮 API publique pour partenaires tiers
- 🔮 Expansion à d'autres pathologies

**Timeline :** À partir de 2027

---

## 9. Contraintes et Risques

### 9.1 Contraintes Techniques

**Contraintes identifiées :**
- Dépendance à Supabase (vendor lock-in potentiel)
- Performance limitée par la base de données
- Scalabilité dépendante de l'infrastructure Supabase
- Limitations de l'API Supabase (rate limiting)

**Mitigation :**
- Monitoring de la performance
- Optimisation des requêtes
- Cache stratégique
- Plan de migration si nécessaire

### 9.2 Contraintes Business

**Contraintes identifiées :**
- Adoption des pharmaciens (nécessite changement de comportement)
- Conformité réglementaire par pays
- Gestion des paiements multi-devises
- Support multilingue

**Mitigation :**
- Programme d'onboarding pharmaciens
- Consultation légale par pays
- Intégration de processeurs de paiement locaux
- Expansion progressive des langues

### 9.3 Risques

| Risque | Impact | Probabilité | Mitigation |
|--------|--------|-------------|------------|
| **Faible adoption pharmaciens** | Élevé | Moyen | Programme d'incitation, démonstration de valeur |
| **Problèmes de performance** | Moyen | Faible | Monitoring, optimisation continue |
| **Conformité réglementaire** | Élevé | Faible | Consultation légale préalable |
| **Qualité des données** | Moyen | Moyen | Validation, modération |
| **Sécurité des données** | Élevé | Faible | Audit sécurité, conformité RGPD |

---

### 4.13 Droits RGPD et gestion des traitements (Priorité : Haute)

**Objectif :** permettre à une personne sans compte patient ni nom déclaré de contrôler les traitements associés à son adresse e-mail vérifiée, et aux utilisateurs authentifiés de gérer leurs autres données.

**Fonctionnalités :**
- Pour un traitement, recueillir le consentement au formulaire puis exiger la confirmation d'un récapitulatif complet avant l'enregistrement définitif.
- Exiger une adresse e-mail vérifiée dans le parcours traitement afin d'envoyer les alertes de disponibilité et de permettre la récupération/gestion des déclarations.
- Après vérification de l'adresse par code temporaire, permettre de consulter et modifier les traitements associés, puis de sélectionner une ou plusieurs déclarations à supprimer.
- Afficher une confirmation explicite avant chaque suppression et identifier clairement son caractère définitif.
- Permettre le retrait du consentement ; arrêter les alertes associées et supprimer les traitements concernés selon la règle produit validée.
- Permettre à l'auteur d'une opinion de demander sa suppression.
- Permettre une demande de suppression complète du compte et des données personnelles associées.
- Déconnecter l'utilisateur après la suppression complète et invalider sa session.

**Règles de conservation :**
- L'e-mail nécessaire à la gestion et aux alertes est lié à des données de santé et doit être protégé comme donnée personnelle, jamais présenté comme anonyme.
- Après suppression valide, retirer le contenu clinique et l'adresse liée des systèmes actifs, des vues analytiques, caches et tâches d'alertes concernés ; définir le délai de purge des sauvegardes.
- Des statistiques ne peuvent être conservées que si elles sont agrégées et irréversiblement anonymisées.
- La preuve minimale du consentement et de son retrait suit une durée de conservation distincte, déterminée et justifiée par le responsable du traitement ; ne pas conserver le contenu médical dans les journaux d'audit.
- Une exception légale à l'effacement doit être validée, limitée, documentée et expliquée à la personne.

**Critères d'acceptation :**
- L'API conserve la preuve versionnée et horodatée du consentement au formulaire et de la confirmation finale.
- Aucune consultation, modification ou suppression self-service n'est autorisée sans vérification récente de l'e-mail associé.
- Aucune déclaration d'une autre adresse n'est retournée ou modifiée ; les réponses d'erreur ne permettent pas d'énumérer les traitements.
- La suppression groupée est atomique et les traitements supprimés cessent d'alimenter les analyses et alertes.
- Aucun traitement ou avis n'est supprimé avant confirmation explicite.
- La suppression de compte explique ce qui est supprimé et ce qui peut rester sous forme anonymisée.
- Les endpoints backend appliquent l'autorisation au propriétaire de la donnée ou à l'administrateur habilité.
- Les opérations sont journalisées avec un minimum de métadonnées, sans conserver le contenu médical supprimé ni les codes OTP.

**Contrats API attendus :**
- Parcours de déclaration déjà intégré au frontend Vue :
  - `POST /api/v1/patients/treatments/email-verification/request`
  - `POST /api/v1/patients/treatments/email-verification/confirm`
  - `POST /api/v1/patients/treatments/consent`
  - `POST /api/v1/patients/treatments`
- Routes de gestion disponibles dans l'API, interface frontend à intégrer :
  - `GET /api/v1/patients/treatments/mine`
  - `PATCH /api/v1/patients/treatments/mine/{treatment_id}`
  - `DELETE /api/v1/patients/treatments/mine`
  - `POST /api/v1/patients/treatments/mine/consent/withdraw`
  - `POST /api/v1/patients/treatments/mine/session/revoke`
- `DELETE /api/v1/patients/treatments/{treatment_id}`
- `DELETE /api/v1/opinions/{opinion_id}`
- `DELETE /api/v1/auth/me`

---

## 10. Appendices

### 10.1 Glossaire

- **RLS** : Row Level Security - Sécurité au niveau des lignes
- **Matching Intelligent** : Algorithme de connexion patients/pharmacies
- **ODD** : Objectif de Développement Durable (ONU)
- **IA** : Intelligence Artificielle
- **MVP** : Minimum Viable Product

### 10.2 Références

- **Documentation Supabase** : https://supabase.com/docs
- **ODD 3.8 ONU** : Couverture Sanitaire Universelle
- **RGPD** : Règlement Général sur la Protection des Données

### 10.3 Contacts

- **Équipe Produit** : À définir
- **Support Technique** : support@move4epilepsy.fr
- **Contact Général** : contact@move4epilepsy.fr

### 10.4 Historique des Versions

| Version | Date | Auteur | Changements |
|---------|------|--------|-------------|
| 1.0 | Janvier 2025 | Équipe Move4Epilepsy | Version initiale du PRD |
| 1.1 | Février 2025 | Équipe Move4Epilepsy | Dashboard global d'accès : description complète des 13 sections, géolocalisation Leaflet/Nominatim, évolution temporelle avec médicaments par période, loaders par section, analyse socio-économique. Enregistrement des traitements : précision sur période (dates début/fin, en cours) et sur pharmacies_visited (avant de trouver le médicament). Base de données : détail des champs patient_treatments et référence à l'API move4epilepsy-api. Roadmap : géolocalisation et dashboard enrichi marqués livrés en Phase 2. |
| 1.5 | Juin 2026 | Équipe Move4Epilepsy | Clarification Chat communautaire (4.8) : chat simple, salons publics + messagerie privée (inbox), modération humaine, espace sans tabou. |
| 1.6 | Juin 2026 | Équipe Move4Epilepsy | Suppression complète de la section 4.12 (analyse automatique des opinions) et de toutes les références associées dans le TRL, la roadmap et le chat. |
| 1.7 | Octobre 2026 | Équipe Move4Epilepsy | Parcours traitements : e-mail vérifié requis pour alertes et gestion, double confirmation et preuve de consentement, modification/suppression self-service, retrait et purge analytique ; correction des affirmations non vérifiées d'anonymisation totale/conformité. |
| 1.8 | Novembre 2026 | Équipe Move4Epilepsy | Mise à jour du PRD après intégration du parcours de déclaration dans le frontend Vue : vérification par code e-mail, récapitulatif avant création, consentement d'analyse facultatif et consentement distinct aux alertes, état livré/non livré et routes API réelles. |

---

## 📝 Notes de Mise à Jour

Ce document est un document vivant et sera mis à jour au fur et à mesure de l'évolution du produit. Les mises à jour importantes seront documentées dans la section "Historique des Versions".

**Prochaines révisions prévues :**
- Après chaque release majeure
- Lors de changements significatifs de fonctionnalités
- À la demande de l'équipe produit

---

**Document créé le :** Janvier 2025  
**Dernière mise à jour :** Novembre 2026
**Statut :** ✅ Approuvé pour développement
