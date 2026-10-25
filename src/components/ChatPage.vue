<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { LockKeyhole, MessageCircle, RefreshCw } from 'lucide-vue-next';
import { apiRequest } from '../services/api';

interface ChatChannel {
  id: string;
  name: string;
  description?: string | null;
}

interface ChatMessage {
  id: string;
  content: string;
  pseudonym?: string | null;
  user_role?: string | null;
  created_at: string;
}

const { t, locale } = useI18n();
const channels = ref<ChatChannel[]>([]);
const selectedChannelId = ref('');
const messages = ref<ChatMessage[]>([]);
const showRoles = ref(true);
const loadingChannels = ref(true);
const loadingMessages = ref(false);
const error = ref('');
const channelsById = computed(() => new Map(channels.value.map((channel) => [channel.id, channel])));

async function loadMessages(channelId: string) {
  if (!channelId) {
    messages.value = [];
    return;
  }
  loadingMessages.value = true;
  error.value = '';
  try {
    messages.value = await apiRequest<ChatMessage[]>(
      `/chat/channels/${encodeURIComponent(channelId)}/messages?limit=50`,
    );
  } catch (cause) {
    messages.value = [];
    error.value = cause instanceof Error ? cause.message : t('chatPage.loadError');
  } finally {
    loadingMessages.value = false;
  }
}

async function loadChannels() {
  loadingChannels.value = true;
  error.value = '';
  try {
    channels.value = await apiRequest<ChatChannel[]>('/chat/channels');
    selectedChannelId.value = channels.value[0]?.id ?? '';
    if (selectedChannelId.value) await loadMessages(selectedChannelId.value);
  } catch (cause) {
    error.value = cause instanceof Error ? cause.message : t('chatPage.loadError');
  } finally {
    loadingChannels.value = false;
  }
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat(locale.value, { dateStyle: 'short', timeStyle: 'short' }).format(new Date(date));
}

watch(selectedChannelId, (channelId, previousId) => {
  if (previousId && channelId !== previousId) void loadMessages(channelId);
});

onMounted(loadChannels);
</script>

<template>
  <section class="chat-page">
    <aside class="panel chat-sidebar">
      <h2>{{ t('chatPage.channels') }}</h2>
      <p v-if="loadingChannels">{{ t('chatPage.loadingChannels') }}</p>
      <p v-else-if="channels.length === 0">{{ t('chatPage.noChannels') }}</p>
      <button
        v-for="channel in channels"
        :key="channel.id"
        type="button"
        class="chat-channel"
        :class="{ selected: channel.id === selectedChannelId }"
        @click="selectedChannelId = channel.id"
      >
        <strong>{{ channel.name }}</strong>
        <span v-if="channel.description">{{ channel.description }}</span>
      </button>
      <button class="button button-secondary chat-refresh" type="button" :disabled="loadingChannels" @click="loadChannels">
        <RefreshCw :size="16" />{{ t('chatPage.refresh') }}
      </button>
    </aside>

    <div class="panel chat-conversation">
      <header class="chat-conversation-heading">
        <div><MessageCircle :size="20" /><strong>{{ channelsById.get(selectedChannelId)?.name ?? t('chatPage.title') }}</strong></div>
        <label class="chat-role-toggle">
          <input v-model="showRoles" type="checkbox">
          {{ t('chatPage.showRoles') }}
        </label>
      </header>

      <p v-if="error" class="form-alert error-alert" role="alert">{{ t('chatPage.loadError') }} {{ error }}</p>
      <p v-else-if="loadingMessages" class="empty-state" role="status">{{ t('chatPage.loadingMessages') }}</p>
      <p v-else-if="messages.length === 0" class="empty-state">{{ t('chatPage.noMessages') }}</p>
      <div v-else class="chat-message-list">
        <article v-for="message in messages" :key="message.id" class="chat-message">
          <header>
            <strong>{{ message.pseudonym || t('chatPage.anonymous') }}</strong>
            <span v-if="showRoles && message.user_role" class="chat-message-role">{{ message.user_role }}</span>
            <time :datetime="message.created_at">{{ formatDate(message.created_at) }}</time>
          </header>
          <p>{{ message.content }}</p>
        </article>
      </div>

      <div class="chat-readonly-notice">
        <LockKeyhole :size="18" />
        <p>{{ t('chatPage.readOnlyNotice') }}</p>
      </div>
    </div>
  </section>
</template>
