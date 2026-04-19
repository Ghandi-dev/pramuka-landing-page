<script setup lang="ts">
import { useHead } from '#imports'
import { activities } from '~/lib/dummyData'

useHead({
  title: 'Activities',
  meta: [
    { name: 'description', content: 'Daftar kegiatan dan galeri Pramuka SMAN 1 Pasawahan.' }
  ]
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

          <article v-for="(activity, index) in activities" :key="activity.id"
            class="grid lg:grid-cols-2 gap-12 lg:gap-24 items-center">
            <!-- Alternate image placement based on index -->
            <div class="relative h-[400px] lg:h-[550px] overflow-hidden rounded-sm group"
              :class="index % 2 !== 0 ? 'lg:order-2' : ''">
              <div class="absolute inset-0 bg-primary/10 transition-opacity duration-500 group-hover:opacity-0 z-10">
              </div>
              <img :src="activity.image" :alt="activity.title"
                class="w-full h-full object-cover filter grayscale-[30%] group-hover:grayscale-0 transition-all duration-700 group-hover:scale-[1.03]" />
            </div>

            <div :class="index % 2 !== 0 ? 'lg:order-1' : ''">
              <span
                class="inline-block px-3 py-1 mb-6 text-sm font-semibold uppercase tracking-wider text-accent border border-accent/30 rounded-full">
                {{ activity.category }}
              </span>
              <h2 class="font-display text-4xl font-bold text-foreground mb-4">{{ activity.title }}</h2>
              <div class="flex items-center gap-4 text-sm text-muted-foreground mb-8 font-medium">
                <span class="flex items-center gap-1"><span class="w-1.5 h-1.5 rounded-full bg-primary"></span>{{
                  activity.date }}</span>
                <span>&bull;</span>
                <span>{{ activity.location }}</span>
              </div>
              <p class="text-lg leading-relaxed text-foreground/80">
                {{ activity.description }}
              </p>
            </div>
          </article>

        </div>
      </div>
    </section>
  </div>
</template>
