<script setup lang="ts">
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import {
  ArrowRight, BarChart3, BookOpen, Brain, Building, CheckCircle, Heart, Lightbulb,
  MapPin, MessageCircle, Network, Shield, ShieldCheck, Sparkles, Target, Users,
} from 'lucide-vue-next';
import AccessInequalityMap from './AccessInequalityMap.vue';
import AccessNetworkAnalysis from './AccessNetworkAnalysis.vue';
import ChatPage from './ChatPage.vue';
import InformationPages from './InformationPages.vue';
import OpinionsPage from './OpinionsPage.vue';
import PatientSearchPage from './PatientSearchPage.vue';
import PerceptionsPage from './PerceptionsPage.vue';
import ProtectedDataPage from './ProtectedDataPage.vue';
import PublicSubmissionPage from './PublicSubmissionPage.vue';
import RgpdPage from './RgpdPage.vue';
import ServicesSearchPage from './ServicesSearchPage.vue';
import SubscriptionPage from './SubscriptionPage.vue';
import TruthPage from './TruthPage.vue';
import type { PageId } from '../router/routes';

const props = defineProps<{ page: PageId }>();
const emit = defineEmits<{ navigate: [page: string] }>();
const { t } = useI18n();

const pageLabelKeys: Partial<Record<PageId, string>> = {
  home: 'navigation.home', resources: 'navigation.resources', rights: 'navigation.rights',
  contact: 'navigation.contact', search: 'navigation.searchServices', medication: 'navigation.medication',
  trends: 'navigation.trends', awareness: 'navigation.awareness', opinions: 'navigation.opinions',
  truth: 'navigation.truth', about: 'navigation.about', chat: 'navigation.chat', team: 'navigation.team',
  'pharmacy-dashboard': 'navigation.pharmacyDashboard', privacy: 'navigation.privacy',
  rgpd: 'navigation.dataProtection',
  'pharmacy-stock': 'navigation.stockManagement', 'patient-search': 'navigation.medicationSearch',
  partner: 'navigation.becomePartner', 'medicine-report': 'navigation.reportMedicine',
  'medication-registration': 'navigation.myTreatment', 'epilepsy-perceptions': 'navigation.perceptions',
  'doctor-dashboard': 'navigation.doctorDashboard', 'access-dashboard': 'navigation.globalDashboard',
  'predictive-dashboard': 'navigation.predictiveDashboard', subscription: 'navigation.subscriptions',
  'admin-dashboard': 'navigation.administration', 'locations-map': 'navigation.inequalityMap',
  terms: 'footer.termsOfUse', 'network-analysis': 'navigation.networkAnalysis',
};
const title = computed(() => t(pageLabelKeys[props.page] ?? 'navigation.home'));

const overviewCards = computed(() => [
  { value: '50M+', label: t('homepage.stats.epilepticPeople'), tone: 'violet' },
  { value: '30%', label: t('homepage.stats.accessDifficulties'), tone: 'blue' },
  { value: '85%', label: t('homepage.stats.facePrejudices'), tone: 'rose' },
  { value: '70%', label: t('homepage.stats.canControl'), tone: 'green' },
]);

const solutions = computed(() => [
  { icon: BookOpen, title: t('homepage.solutions.dataCollection.title'), description: t('homepage.solutions.dataCollection.description'), page: 'medication-registration' },
  { icon: BarChart3, title: t('homepage.solutions.intelligentAnalysis.title'), description: t('homepage.solutions.intelligentAnalysis.description'), page: 'access-dashboard' },
  { icon: Brain, title: t('homepage.solutions.aiPredictions.title'), description: t('homepage.solutions.aiPredictions.description'), page: 'predictive-dashboard' },
  { icon: Target, title: t('homepage.solutions.targetedActions.title'), description: t('homepage.solutions.targetedActions.description'), page: 'trends' },
  { icon: MessageCircle, title: t('homepage.solutions.communityChat.title'), description: t('homepage.solutions.communityChat.description'), page: 'chat' },
  { icon: Lightbulb, title: t('homepage.solutions.awareness.title'), description: t('homepage.solutions.awareness.description'), page: 'awareness' },
  { icon: BookOpen, title: t('homepage.solutions.resources.title'), description: t('homepage.solutions.resources.description'), page: 'resources' },
  { icon: Shield, title: t('homepage.solutions.rights.title'), description: t('homepage.solutions.rights.description'), page: 'rights' },
]);

const sdgImpacts = ['riskZones', 'adaptedServices', 'costOptimization'];
const partners = [
  { initials: 'SDA', name: 'Science de Données au féminin en Afrique francophone', website: 'https://sdafrique.org', siteLabel: 'sdafrique.org', description: 'homepage.partners.sda' },
  { initials: 'XP', name: 'Xponsor', website: 'http://www.xponsorapp.com/', siteLabel: 'xponsorapp.com', description: 'homepage.partners.xponsor' },
  { initials: 'ML', name: 'Mollet', website: 'https://lnkd.in/eqzd6f6Y', siteLabel: 'Mollet.app', description: 'homepage.partners.mollet' },
];

const genericDescription = computed(() => {
  const descriptions: Partial<Record<PageId, string>> = {
    truth: t('truthPage.intro'),
    'epilepsy-perceptions': t('perceptions.intro'),
    search: 'Trouvez des services et des ressources utiles près de chez vous.',
    medication: 'Informations et outils pour faciliter l’accès aux traitements antiépileptiques.',
    trends: 'Explorez les tendances et les indicateurs d’accès aux traitements.',
    'network-analysis': t('networkAnalysis.intro'),
    chat: 'Un espace de dialogue communautaire respectueux pour partager vos expériences.',
    'access-dashboard': 'Visualisez les indicateurs globaux de disponibilité et d’accès aux soins.',
    'predictive-dashboard': t('predictiveDashboard.demoBanner'),
    'locations-map': 'Visualisez les inégalités d’accès et les ressources par territoire.',
    'pharmacy-dashboard': 'Retrouvez les indicateurs essentiels de votre activité officinale.',
    'pharmacy-stock': 'Consultez et gérez les informations de disponibilité des médicaments.',
    'doctor-dashboard': 'Accédez aux informations utiles au suivi des patients.',
    'patient-search': 'Recherchez un médicament et identifiez les pharmacies susceptibles de le proposer.',
    'medication-registration': 'Partagez de façon sécurisée votre expérience d’accès au traitement.',
    'medicine-report': 'Signalez une disponibilité ou une difficulté d’accès à un médicament.',
    'admin-dashboard': 'Outils de supervision et de gestion de la plateforme.',
    subscription: 'Découvrez les formules destinées aux pharmacies partenaires.',
    partner: 'Rejoignez les partenaires qui améliorent l’accès aux médicaments antiépileptiques.',
    opinions: 'Votre expérience contribue à mieux comprendre les besoins des personnes concernées.',
    contact: 'Notre équipe est à votre écoute pour toute question sur la plateforme.',
    resources: 'Guides, outils et informations pour mieux comprendre l’épilepsie et les traitements.',
    rights: 'Informations sur le droit à la santé et à la non-discrimination.',
    privacy: 'La confidentialité et la protection des données sont au cœur de notre démarche.',
    rgpd: t('gdpr.pageIntro'),
    terms: 'Conditions d’utilisation du portail Move4Epilepsy.',
  };
  return descriptions[props.page] ?? 'Découvrez les ressources et les outils de la plateforme Move4Epilepsy.';
});

const dashboardStats = [
  { label: 'Pays couverts', value: '25+', change: '+3.2%' },
  { label: 'Médicaments suivis', value: '18', change: 'Catalogue' },
  { label: 'Disponibilité moyenne', value: '72%', change: '+5.4%' },
  { label: 'Données déclarées', value: '1 248', change: 'Actualisé' },
];

const isDashboard = computed(() => props.page === 'predictive-dashboard');
const isProtectedDataPage = computed(() => [
  'access-dashboard', 'trends', 'pharmacy-dashboard', 'pharmacy-stock', 'doctor-dashboard', 'admin-dashboard',
].includes(props.page));
const isSearch = computed(() => props.page === 'search');
</script>

<template>
  <div v-if="page === 'home'" class="home-page">
    <section class="hero">
      <div class="hero-content">
        <p class="eyebrow"><Sparkles :size="17" /> Move4Epilepsy</p>
        <h1>{{ t('homepage.hero.title') }} <span>{{ t('homepage.hero.titleHighlight') }}</span></h1>
        <p class="hero-copy">{{ t('homepage.hero.description') }}</p>
        <div class="hero-actions">
          <button class="button button-primary button-large" @click="emit('navigate', 'about')">{{ t('homepage.hero.discover') }} <ArrowRight :size="19" /></button>
          <button class="button button-white button-large" @click="emit('navigate', 'opinions')">{{ t('homepage.hero.participate') }}</button>
        </div>
        <div class="stats-grid">
          <article v-for="stat in overviewCards" :key="stat.label" class="stat-card">
            <strong>{{ stat.value }}</strong><span>{{ stat.label }}</span>
          </article>
        </div>
      </div>
      <div class="hero-art" aria-hidden="true">
        <div class="hero-orbit orbit-one"></div><div class="hero-orbit orbit-two"></div>
        <img class="hero-photo" src="/images/community-health-worker-togo.jpg" alt="" width="260" height="260">
        <div class="floating-card floating-card-top"><Shield :size="22" /><span>Accès équitable</span></div>
        <div class="floating-card floating-card-bottom"><BarChart3 :size="22" /><span>Données & prévention</span></div>
      </div>
    </section>

    <section class="content-section mission-section">
      <div class="section-heading"><span class="section-kicker">Notre engagement</span><h2>Notre vision, notre mission</h2><p>Les valeurs fondamentales qui guident notre action pour transformer l'accès aux soins.</p></div>
      <div class="mission-grid">
        <article class="mission-card"><div class="round-icon purple"><Heart :size="25" /></div><h3>Notre vision</h3><p>Un avenir où toute personne atteinte d’épilepsie accède aux médicaments dont elle a besoin, sans que sa situation ou son lieu de vie ne soit un obstacle.</p></article>
        <article class="mission-card"><div class="round-icon blue"><Target :size="25" /></div><h3>Notre mission</h3><p>Mobiliser les données, la science et la communauté pour améliorer l’accès aux traitements et lutter contre la désinformation sur l’épilepsie.</p></article>
      </div>
    </section>

    <section class="content-section tinted-section">
      <div class="section-heading"><span class="section-kicker">{{ t('homepage.problems.title') }}</span><h2>{{ t('homepage.solutions.title') }}</h2><p>{{ t('homepage.solutions.description') }}</p></div>
      <div class="solution-grid">
        <button v-for="solution in solutions" :key="solution.title" class="solution-card" @click="emit('navigate', solution.page)">
          <span class="solution-icon"><component :is="solution.icon" :size="24" /></span>
          <h3>{{ solution.title }}</h3><p>{{ solution.description }}</p><span class="text-link">En savoir plus <ArrowRight :size="15" /></span>
        </button>
      </div>
    </section>

    <section class="content-section feature-section">
      <div class="section-heading"><span class="section-kicker">Une approche responsable</span><h2>{{ t('homepage.features.title') }}</h2><p>{{ t('homepage.features.description') }}</p></div>
      <div class="feature-grid">
        <article><Shield /><h3>{{ t('homepage.features.dataSecurity.title') }}</h3><p>{{ t('homepage.features.dataSecurity.description') }}</p></article>
        <article><BarChart3 /><h3>{{ t('homepage.features.realTimeAnalysis.title') }}</h3><p>{{ t('homepage.features.realTimeAnalysis.description') }}</p></article>
        <article><Users /><h3>{{ t('homepage.features.activeCommunity.title') }}</h3><p>{{ t('homepage.features.activeCommunity.description') }}</p></article>
        <article><CheckCircle /><h3>{{ t('homepage.features.medicalValidation.title') }}</h3><p>{{ t('homepage.features.medicalValidation.description') }}</p></article>
      </div>
    </section>
    <section class="content-section sdg-section">
      <div class="section-heading"><span class="section-kicker">{{ t('homepage.sdgs.kicker') }}</span><h2>{{ t('homepage.sdgs.title') }}</h2><p>{{ t('homepage.sdgs.description') }}</p></div>
      <div class="sdg-highlight">
        <img
          class="sdg-illustration"
          src="/images/sdg-health-equity.svg"
          :alt="t('homepage.sdgs.imageAlt')"
          width="200"
          height="160"
          loading="lazy"
        >
        <span class="sdg-number">3</span>
        <div><h3>{{ t('homepage.sdgs.goalTitle') }}</h3><p>{{ t('homepage.sdgs.goalDescription') }}</p></div>
      </div>
      <div class="sdg-grid">
        <article v-for="impact in sdgImpacts" :key="impact" class="sdg-card">
          <span class="sdg-target">3.8</span>
          <h3>{{ t(`homepage.sdgs.impacts.${impact}.title`) }}</h3>
          <p>{{ t(`homepage.sdgs.impacts.${impact}.description`) }}</p>
        </article>
      </div>
      <p class="sdg-target-note"><strong>{{ t('homepage.sdgs.targetTitle') }}</strong> {{ t('homepage.sdgs.targetDescription') }}</p>
    </section>
    <section class="home-cta"><div><h2>{{ t('homepage.cta.title') }}</h2><p>{{ t('homepage.cta.description') }}</p></div><div class="hero-actions"><button class="button button-white" @click="emit('navigate', 'opinions')">{{ t('homepage.cta.shareExperience') }}</button><button class="button button-primary" @click="emit('navigate', 'access-dashboard')">{{ t('homepage.cta.exploreData') }}</button></div></section>
    <section class="content-section partners-section">
      <div class="section-heading"><span class="section-kicker">{{ t('homepage.partners.kicker') }}</span><h2>{{ t('homepage.partners.title') }}</h2><p>{{ t('homepage.partners.description') }}</p></div>
      <div class="partners-grid">
        <article v-for="partner in partners" :key="partner.initials" class="partner-card">
          <span class="partner-mark" :class="partner.initials.toLowerCase()">{{ partner.initials }}</span>
          <h3>{{ partner.name }}</h3>
          <p>{{ t(partner.description) }}</p>
          <a :href="partner.website" target="_blank" rel="noopener noreferrer">{{ partner.siteLabel }} <ArrowRight :size="15" /></a>
        </article>
      </div>
      <button class="button button-primary partners-cta" @click="emit('navigate', 'partner')">{{ t('homepage.partners.becomePartner') }} <ArrowRight :size="16" /></button>
    </section>
  </div>

  <section v-else class="route-page">
    <div class="route-heading">
      <div><span class="section-kicker">Move4Epilepsy</span><h1>{{ title }}</h1><p>{{ genericDescription }}</p></div>
      <span class="route-icon"><component :is="page === 'subscription' || page === 'partner' ? Building : page === 'network-analysis' ? Network : page === 'rgpd' ? ShieldCheck : page === 'locations-map' ? MapPin : page === 'chat' ? MessageCircle : page.includes('dashboard') ? BarChart3 : page === 'resources' ? BookOpen : page === 'awareness' ? Lightbulb : BookOpen" :size="28" /></span>
    </div>

    <RgpdPage v-if="page === 'rgpd'" />

    <AccessNetworkAnalysis v-else-if="page === 'network-analysis'" />

    <template v-else-if="isDashboard">
      <div class="demo-notice"><Sparkles :size="19" /><span>{{ t('predictiveDashboard.demoBanner') }}</span></div>
      <div class="dashboard-grid">
        <article v-for="stat in dashboardStats" :key="stat.label" class="dashboard-stat panel"><span>{{ stat.label }}</span><strong>{{ stat.value }}</strong><small>{{ stat.change }}</small></article>
      </div>
      <div class="dashboard-content-grid">
        <article class="panel chart-panel"><div class="panel-heading"><div><h2>{{ page === 'predictive-dashboard' ? t('predictiveDashboard.g1Title') : 'Disponibilité par zone' }}</h2><p>Indicateurs de démonstration</p></div><BarChart3 /></div>
          <div class="bar-chart" role="img" aria-label="Graphique des indicateurs"><div v-for="(height, index) in [46, 72, 56, 88, 64, 78, 52, 92, 68, 82, 58, 76]" :key="index" class="chart-column"><span :style="{ height: `${height}%` }"></span><small>{{ ['Jan', 'Fév', 'Mar', 'Avr'][index % 4] }}</small></div></div>
        </article>
        <article class="panel chart-panel"><div class="panel-heading"><div><h2>{{ page === 'predictive-dashboard' ? t('predictiveDashboard.g4Title') : 'Résumé des données' }}</h2><p>Répartition indicative</p></div><Target /></div>
          <div class="donut-wrap"><div class="donut-chart"><span>72%<small>accès</small></span></div><ul><li><i class="legend-dot violet-dot"></i>Disponible <strong>72%</strong></li><li><i class="legend-dot blue-dot"></i>Limité <strong>18%</strong></li><li><i class="legend-dot grey-dot"></i>Indisponible <strong>10%</strong></li></ul></div>
        </article>
      </div>
      <div v-if="page === 'predictive-dashboard'" class="dashboard-grid extra-charts"><article class="panel chart-panel"><h2>{{ t('predictiveDashboard.g2Title') }}</h2><p>{{ t('predictiveDashboard.g2Subtitle') }}</p><div class="horizontal-bars"><span>Bénin <i style="--bar: 83%"></i></span><span>France <i style="--bar: 68%"></i></span><span>Italie <i style="--bar: 54%"></i></span></div></article><article class="panel chart-panel"><h2>{{ t('predictiveDashboard.g3Title') }}</h2><p>{{ t('predictiveDashboard.g3Subtitle') }}</p><div class="risk-summary"><strong>12</strong><span>zones prioritaires à surveiller</span></div></article></div>
    </template>

    <PatientSearchPage v-else-if="page === 'patient-search'" />

    <ServicesSearchPage v-else-if="isSearch" @navigate="emit('navigate', $event)" />

    <OpinionsPage v-else-if="page === 'opinions'" />

    <PerceptionsPage v-else-if="page === 'epilepsy-perceptions'" />

    <SubscriptionPage v-else-if="page === 'subscription'" @navigate="emit('navigate', $event)" />

    <TruthPage v-else-if="page === 'truth'" />

    <ProtectedDataPage v-else-if="isProtectedDataPage" :page="page" />

    <InformationPages
      v-else-if="['about', 'awareness', 'contact', 'medication', 'resources', 'rights', 'team'].includes(page)"
      :page="page"
      @navigate="emit('navigate', $event)"
    />

    <PublicSubmissionPage v-else-if="page === 'medication-registration' || page === 'medicine-report' || page === 'partner'" :page="page" />

    <ChatPage v-else-if="page === 'chat'" />

    <AccessInequalityMap v-else-if="page === 'locations-map'" />

    <template v-else>
      <div class="info-card-grid">
        <article class="panel info-card"><div class="round-icon purple"><BookOpen :size="22" /></div><h2>{{ title }}</h2><p>{{ genericDescription }}</p><button v-if="page !== 'privacy' && page !== 'terms'" class="text-link-button" @click="emit('navigate', 'resources')">Explorer les ressources <ArrowRight :size="16" /></button><p v-else>Pour toute question concernant vos données personnelles, contactez move4epilepsy@gmail.com.</p></article>
        <article class="panel info-card"><div class="round-icon blue"><Shield :size="22" /></div><h2>Une plateforme engagée</h2><p>Move4Epilepsy s’engage pour un accès plus équitable aux médicaments antiépileptiques et des informations fiables sur l’épilepsie.</p><button class="text-link-button" @click="emit('navigate', 'about')">À propos du projet <ArrowRight :size="16" /></button></article>
      </div>
    </template>
  </section>
</template>
