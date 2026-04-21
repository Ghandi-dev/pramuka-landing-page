<script setup lang="ts">
import { useHead } from '#imports'
import { onMounted } from 'vue'
import { useMemberService } from '~/services/memberService'

useHead({
  title: 'Members',
  meta: [
    { name: 'description', content: 'Struktur Organisasi dan Dewan Ambalan Pramuka SMAN 1 Pasawahan.' }
  ]
})

const { data, loading, fetchAllOrdered } = useMemberService()

onMounted(() => {
  fetchAllOrdered()
})
</script>

<template>
  <div class="flex flex-col min-h-screen bg-card pt-10">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
      <!-- Header -->
      <div class="pt-12 pb-20 text-center">
        <h1 class="font-display text-5xl md:text-6xl font-bold text-foreground mb-6">{{ $t('members.header.title') }}
        </h1>
        <p class="text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
          {{ $t('members.header.description') }}
        </p>
      </div>

      <!-- Members Grid -->
      <div class="py-12 border-t border-border">

        <!-- Loading State -->
        <div v-if="loading" class="flex justify-center items-center py-20">
          <div class="h-12 w-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
        </div>

        <!-- Empty State -->
        <div v-else-if="data.length === 0" class="text-center py-16 text-muted-foreground">
          <p class="text-lg font-medium">Bagan Struktur Organisasi Belum Tersedia.</p>
        </div>

        <div v-else class="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          <div v-for="member in data" :key="member.id"
            class="group bg-background rounded-sm border border-border p-6 hover:border-primary/50 transition-colors duration-300">
            <div
              class="relative w-24 h-24 mb-6 rounded-full overflow-hidden border-2 border-transparent group-hover:border-primary transition-colors p-1">
              <div
                class="w-full h-full rounded-full overflow-hidden bg-muted flex items-center justify-center text-3xl font-bold text-muted-foreground">
                <img v-if="member.photo" :src="member.photo" :alt="member.name"
                  class="w-full h-full object-cover transition-all duration-500" />
                <span v-else>{{ member.name.charAt(0) }}</span>
              </div>
            </div>

            <h3 class="font-display text-xl font-bold text-foreground mb-1 group-hover:text-primary transition-colors">
              {{ member.name }}</h3>
            <p class="text-sm font-semibold tracking-wide uppercase text-accent">{{ member.position }}</p>
          </div>
        </div>
      </div>

      <!-- Call to Action Banner -->
      <div
        class="my-24 p-12 bg-primary text-primary-foreground rounded-sm flex flex-col md:flex-row items-center justify-between gap-8">
        <div class="max-w-xl">
          <h3 class="font-display text-3xl font-bold mb-4">{{ $t('members.cta.title') }}</h3>
          <p class="text-primary-foreground/80 text-lg">
            {{ $t('members.cta.description') }}
          </p>
        </div>
        <NuxtLink :to="$localePath('/contact')"
          class="inline-flex h-14 items-center justify-center rounded-sm bg-background px-10 text-base font-semibold text-primary transition-all hover:scale-105 shrink-0 shadow-xl">
          {{ $t('members.cta.button') }}
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
