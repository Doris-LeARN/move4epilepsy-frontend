<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { MessageCircle, Send, Star } from 'lucide-vue-next';
import { apiRequest } from '../services/api';

interface Opinion {
  id: string;
  author: string;
  content: string;
  rating: number;
  category: string | null;
  created_at: string;
}

const { t, locale } = useI18n();
const opinions = ref<Opinion[]>([]);
const author = ref('');
const content = ref('');
const rating = ref(5);
const category = ref('');
const loading = ref(true);
const submitting = ref(false);
const error = ref('');
const success = ref('');
const categories = ['patient', 'caregiver', 'professional', 'general'];
const averageRating = computed(() => {
  if (!opinions.value.length) return '—';
  return (opinions.value.reduce((sum, opinion) => sum + opinion.rating, 0) / opinions.value.length).toFixed(1);
});

async function loadOpinions() {
  loading.value = true;
  error.value = '';
  try {
    opinions.value = await apiRequest<Opinion[]>('/opinions?limit=100');
  } catch (cause) {
    error.value = cause instanceof Error ? cause.message : t('opinionsPage.loadError');
  } finally {
    loading.value = false;
  }
}

async function submitOpinion() {
  if (submitting.value) return;
  submitting.value = true;
  error.value = '';
  success.value = '';
  try {
    await apiRequest<Opinion>('/opinions', {
      method: 'POST',
      body: JSON.stringify({
        author: author.value.trim(),
        content: content.value.trim(),
        rating: rating.value,
        category: category.value || null,
      }),
    });
    author.value = '';
    content.value = '';
    rating.value = 5;
    category.value = '';
    success.value = t('opinionsPage.submitSuccess');
    await loadOpinions();
  } catch (cause) {
    error.value = cause instanceof Error ? cause.message : t('opinionsPage.submitError');
  } finally {
    submitting.value = false;
  }
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat(locale.value, { dateStyle: 'medium' }).format(new Date(date));
}

onMounted(loadOpinions);
</script>

<template>
  <div class="community-page">
    <section class="panel community-intro">
      <span class="round-icon purple"><MessageCircle :size="24" /></span>
      <h2>{{ t('opinionsPage.title') }}</h2>
      <p>{{ t('opinionsPage.intro') }}</p>
    </section>

    <section class="panel opinion-form-panel">
      <h2>{{ t('opinionsPage.shareTitle') }}</h2>
      <form class="data-form opinion-form" @submit.prevent="submitOpinion">
        <div class="form-grid">
          <label>
            {{ t('opinionsPage.name') }}
            <input v-model="author" required maxlength="100" autocomplete="name">
          </label>
          <label>
            {{ t('opinionsPage.category') }}
            <select v-model="category">
              <option value="">{{ t('opinionsPage.categoryAll') }}</option>
              <option v-for="item in categories" :key="item" :value="item">{{ t(`opinionsPage.categories.${item}`) }}</option>
            </select>
          </label>
          <label class="form-wide">
            {{ t('opinionsPage.message') }}
            <textarea v-model="content" required maxlength="3000" rows="4"></textarea>
          </label>
          <label>
            {{ t('opinionsPage.rating') }}
            <select v-model.number="rating">
              <option v-for="score in [5, 4, 3, 2, 1]" :key="score" :value="score">{{ score }} / 5</option>
            </select>
          </label>
        </div>
        <p v-if="error" class="form-alert error-alert" role="alert">{{ error }}</p>
        <p v-if="success" class="form-alert success-alert" role="status">{{ success }}</p>
        <button class="button button-primary" type="submit" :disabled="submitting">
          <Send :size="17" />{{ submitting ? t('opinionsPage.sending') : t('opinionsPage.submit') }}
        </button>
      </form>
    </section>

    <section class="opinion-list-section">
      <header class="opinion-list-header">
        <h2>{{ t('opinionsPage.listTitle') }}</h2>
        <span>{{ t('opinionsPage.average', { rating: averageRating, count: opinions.length }) }}</span>
      </header>
      <p v-if="loading" class="panel empty-state" role="status">{{ t('opinionsPage.loading') }}</p>
      <div v-else-if="error && opinions.length === 0" class="panel empty-state" role="alert">
        <p>{{ t('opinionsPage.listError') }}</p>
        <button class="button button-primary" type="button" @click="loadOpinions">{{ t('opinionsPage.retry') }}</button>
      </div>
      <div v-else-if="opinions.length === 0" class="panel empty-state">{{ t('opinionsPage.empty') }}</div>
      <div v-else class="opinion-list">
        <article v-for="opinion in opinions" :key="opinion.id" class="panel opinion-card">
          <div class="opinion-card-heading">
            <strong>{{ opinion.author }}</strong>
            <time :datetime="opinion.created_at">{{ formatDate(opinion.created_at) }}</time>
          </div>
          <div class="opinion-rating" :aria-label="t('opinionsPage.ratingValue', { rating: opinion.rating })">
            <Star v-for="score in 5" :key="score" :size="16" :fill="score <= opinion.rating ? 'currentColor' : 'none'" />
          </div>
          <span v-if="opinion.category" class="opinion-category">{{ t(`opinionsPage.categories.${opinion.category}`) }}</span>
          <p>{{ opinion.content }}</p>
        </article>
      </div>
      <p v-if="error && opinions.length > 0" class="form-alert error-alert" role="alert">{{ error }}</p>
    </section>
  </div>
</template>
