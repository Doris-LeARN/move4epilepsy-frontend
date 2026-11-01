<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { apiRequest } from '../services/api';

const emit = defineEmits<{ navigate: [page: string] }>();
const { t } = useI18n();
const username = ref('');
const password = ref('');
const role = ref('');
const loading = ref(false);
const error = ref('');
const loggedIn = ref(false);

async function signIn() {
  if (loading.value) return;
  loading.value = true;
  error.value = '';
  try {
    await apiRequest<{ message: string }>('/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ username: username.value, password: password.value }),
    });
    const profile = await apiRequest<{ role: string }>('/auth/me/profile');
    role.value = profile.role;
    loggedIn.value = true;
    password.value = '';
  } catch (cause) {
    error.value = cause instanceof Error ? cause.message : t('auth.loginError');
  } finally {
    loading.value = false;
  }
}

async function signOut() {
  loading.value = true;
  error.value = '';
  try {
    await apiRequest('/auth/logout', { method: 'POST' });
    loggedIn.value = false;
    role.value = '';
  } catch (cause) {
    error.value = cause instanceof Error ? cause.message : t('auth.logoutError');
  } finally {
    loading.value = false;
  }
}

function openDashboard() {
  emit('navigate', role.value === 'admin'
    ? 'admin-dashboard'
    : role.value === 'pharmacien'
      ? 'pharmacy-dashboard'
      : 'access-dashboard');
}
</script>

<template>
  <section class="panel auth-panel">
    <h2>{{ t(loggedIn ? 'auth.connectedTitle' : 'auth.title') }}</h2>
    <p>{{ t(loggedIn ? 'auth.connectedDescription' : 'auth.description') }}</p>
    <p v-if="loggedIn" class="auth-role">{{ t('auth.role') }}: {{ role }}</p>
    <form v-if="!loggedIn" class="auth-form" @submit.prevent="signIn">
      <label>
        {{ t('auth.username') }}
        <input v-model.trim="username" autocomplete="username" required>
      </label>
      <label>
        {{ t('auth.password') }}
        <input v-model="password" type="password" autocomplete="current-password" required>
      </label>
      <button class="button button-primary" type="submit" :disabled="loading">
        {{ loading ? t('common.loading') : t('auth.signIn') }}
      </button>
    </form>
    <p v-if="error" class="form-alert error-alert" role="alert">{{ error }}</p>
    <div v-if="loggedIn" class="auth-actions">
      <button class="button button-primary" type="button" @click="openDashboard">
        {{ t('auth.openDashboard') }}
      </button>
      <button class="button button-white" type="button" :disabled="loading" @click="signOut">
        {{ t('auth.signOut') }}
      </button>
    </div>
  </section>
</template>

<style scoped>
.auth-panel {
  max-width: 34rem;
  margin: 0 auto;
  padding: clamp(1.25rem, 4vw, 2rem);
}

.auth-panel h2 {
  margin-top: 0;
  color: #263c77;
}

.auth-panel > p {
  color: #536176;
  line-height: 1.6;
}

.auth-form,
.auth-actions {
  display: grid;
  gap: 1rem;
}

.auth-form label {
  display: grid;
  gap: 0.4rem;
  font-weight: 600;
}

.auth-form input {
  width: 100%;
  min-height: 2.8rem;
  padding: 0.6rem 0.75rem;
  border: 1px solid #d5dbe6;
  border-radius: 0.5rem;
}

.auth-role {
  font-weight: 700;
}
</style>
