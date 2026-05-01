<script setup lang="ts">
import TwibbonGenerator from "~/components/twibbon/TwibbonGenerator.vue";
import {
  useTwibbonCampaignService,
  type TwibbonCampaign,
} from "~/services/twibbonService";

const { fetchByField } = useTwibbonCampaignService();
const route = useRoute();
const { t } = useI18n();
const siteUrl = useRuntimeConfig().public.siteUrl as string;

const { data: campaign, pending: loading } = await useAsyncData<TwibbonCampaign | null>(
  `twibbon-campaign-${route.params.slug}`,
  async () => {
    if (route.params.slug) {
      return await fetchByField("slug", route.params.slug as string);
    }
    return null;
  }
);

// Dynamic SEO Meta
useSeoMeta({
  title: () => campaign.value ? `${campaign.value.title} - Twibbon SMAN 1 Pasawahan` : t('twibbon.page.notFound'),
  description: () => campaign.value?.description || t('twibbon.page.notFoundDesc'),
  ogTitle: () => campaign.value ? `${campaign.value.title} - SMANPAS` : t('twibbon.page.notFound'),
  ogDescription: () => campaign.value?.description,
  ogImage: () => campaign.value?.frame_url,
  ogUrl: () => `${siteUrl}${route.path}`,
  twitterCard: 'summary_large_image',
});
</script>

<template>
  <div class="min-h-screen bg-gradient-to-b from-primary/5 to-background">
    <!-- Header -->
    <div class="bg-card border-b">
      <div class="container mx-auto px-4 py-6">
        <NuxtLink
          to="/"
          class="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="w-4 h-4 mr-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M15 19l-7-7 7-7"
            />
          </svg>
          {{ $t('twibbon.page.back') }}
        </NuxtLink>

        <h1 v-if="campaign" class="text-3xl font-bold text-foreground">
          {{ campaign.title }}
        </h1>
        <p v-if="campaign?.description" class="mt-2 text-muted-foreground">
          {{ campaign.description }}
        </p>
      </div>
    </div>

    <!-- Content -->
    <div class="container mx-auto px-4 py-8">
      <div v-if="loading" class="flex justify-center py-20">
        <div
          class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"
        ></div>
      </div>

      <div v-else-if="campaign" class="max-w-2xl mx-auto">
        <TwibbonGenerator
          :frame-url="campaign.frame_url"
          :title="campaign.title"
        />
      </div>

      <div
        v-else
        class="flex flex-col items-center justify-center py-20 text-center"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="w-16 h-16 text-muted-foreground mb-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="1.5"
            d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <h2 class="text-xl font-semibold text-foreground">
          {{ $t('twibbon.page.notFound') }}
        </h2>
        <p class="text-muted-foreground mt-2">
          {{ $t('twibbon.page.notFoundDesc') }}
        </p>
        <NuxtLink
          to="/"
          class="mt-6 inline-flex items-center px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
        >
          {{ $t('twibbon.page.backHome') }}
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
