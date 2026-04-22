<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useI18n } from '#imports'
import { useActivityService } from '~/services/activityService'

const { t } = useI18n()
const siteUrl = 'https://pramukasmanpas.vercel.app'

useSeoMeta({
  title: () => t('seo.activities.title'),
  description: () => t('seo.activities.description'),
  ogTitle: () => `${t('seo.activities.title')} - Pramuka SMA Negeri 1 Pasawahan`,
  ogDescription: () => t('seo.activities.description'),
  ogImage: `${siteUrl}/images/pramuka1.webp`,
  ogUrl: `${siteUrl}/activities`,
  twitterTitle: () => `${t('seo.activities.title')} - Pramuka SMA Negeri 1 Pasawahan`,
  twitterDescription: () => t('seo.activities.description'),
  twitterImage: `${siteUrl}/images/pramuka1.webp`,
})

const { data, loading, fetchAll } = useActivityService()

const currentPage = ref(1)
const itemsPerPage = 3

const paginatedActivities = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return data.value.slice(start, end)
})

const totalPages = computed(() => Math.ceil(data.value.length / itemsPerPage))

const goToPage = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
    window.scrollTo({ top: 300, behavior: 'smooth' })
  }
}

onMounted(() => {
  fetchAll('activity_date', false) // urut berdasarkan tanggal, descending
})
</script>

<template>
  <div class="flex flex-col min-h-screen">
    <!-- Header -->
    <header class="bg-background py-24 border-b border-border relative overflow-hidden">
      <!-- Decorative Lines -->
      <div class="absolute top-0 right-10 w-px h-full bg-border/40"></div>
      <div class="absolute top-0 left-20 w-px h-full bg-border/40"></div>

      <div class="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl relative z-10 text-center">
        <h1 class="font-display text-5xl md:text-7xl font-bold text-foreground mb-6">{{ $t('activities.header.title') }}
        </h1>
        <p class="text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
          {{ $t('activities.header.description') }}
        </p>
      </div>
    </header>

    <!-- Activity List -->
    <section class="py-24 bg-card">
      <div class="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div class="space-y-32">

          <!-- Loading State -->
          <div v-if="loading" class="flex justify-center items-center py-20">
              <div class="h-12 w-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
          </div>

          <template v-else>
            <article v-for="(activity, index) in paginatedActivities" :key="activity.id"
              class="grid lg:grid-cols-2 gap-12 lg:gap-24 items-center">
              <!-- Alternate image placement based on index -->
              <div class="relative h-[400px] lg:h-[550px] overflow-hidden rounded-sm group"
                :class="index % 2 !== 0 ? 'lg:order-2' : ''">
                <div class="absolute inset-0 bg-primary/10 transition-opacity duration-500 group-hover:opacity-0 z-10">
                </div>
                <!-- Binding .cover_image from Activity model -->
                <img :src="activity.cover_image" :alt="activity.title"
                  class="w-full h-full object-cover filter grayscale-[30%] group-hover:grayscale-0 transition-all duration-700 group-hover:scale-[1.03]" loading="lazy" />
              </div>

              <div :class="index % 2 !== 0 ? 'lg:order-1' : ''">
                <span
                  class="inline-block px-3 py-1 mb-6 text-sm font-semibold uppercase tracking-wider text-accent border border-accent/30 rounded-full">
                  KEGIATAN
                </span>
                <h2 class="font-display text-4xl font-bold text-foreground mb-4">{{ activity.title }}</h2>
                <div class="flex items-center gap-4 text-sm text-muted-foreground mb-8 font-medium">
                  <span class="flex items-center gap-1">
                    <span class="w-1.5 h-1.5 rounded-full bg-primary"></span>
                    {{ activity.activity_date }}
                  </span>
                  <span>&bull;</span>
                  <span>{{ activity.location || 'SMAN 1 Pasawahan' }}</span>
                </div>
                <p class="text-lg leading-relaxed text-foreground/80 whitespace-pre-line">
                  {{ activity.description }}
                </p>
              </div>
            </article>
          </template>

          <!-- Empty State -->
          <div v-if="!loading && data.length === 0" class="text-center py-16 text-muted-foreground">
            <p class="text-lg font-medium">Belum ada kegiatan yang dipublikasikan.</p>
          </div>

        </div>

        <!-- Pagination UI -->
        <div v-if="!loading && totalPages > 1" class="flex justify-center items-center gap-2 mt-20">
          <button @click="goToPage(currentPage - 1)" :disabled="currentPage === 1"
            class="w-10 h-10 flex items-center justify-center rounded-sm border border-border bg-background text-foreground hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
            &larr;
          </button>
          
          <button v-for="page in totalPages" :key="page" @click="goToPage(page)"
            :class="page === currentPage ? 'bg-primary text-primary-foreground border-primary' : 'bg-background text-foreground border-border hover:bg-muted'"
            class="w-10 h-10 flex items-center justify-center font-medium rounded-sm border transition-colors">
            {{ page }}
          </button>
          
          <button @click="goToPage(currentPage + 1)" :disabled="currentPage === totalPages"
            class="w-10 h-10 flex items-center justify-center rounded-sm border border-border bg-background text-foreground hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
            &rarr;
          </button>
        </div>

      </div>
    </section>
  </div>
</template>
