<script setup lang="ts">
import { useHead } from '#imports'
import { news } from '~/lib/dummyData'

useHead({
  title: 'News & Articles',
  meta: [
    { name: 'description', content: 'Kabar terbaru dan artikel kegiatan kepramukaan dari Pramuka SMAN 1 Pasawahan.' }
  ]
})
</script>

<template>
  <div class="flex flex-col min-h-screen bg-background pt-10">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
      <!-- Header -->
      <div class="pt-12 pb-20 border-b border-border">
        <h1 class="font-display text-5xl md:text-6xl font-bold text-foreground mb-6">Chronicles</h1>
        <p class="text-xl text-muted-foreground leading-relaxed max-w-2xl">
          Cerita, opini, dan rekaman jurnalistik terkait setiap napas langkah pergerakan kepanduan pangkalan kami.
        </p>
      </div>

      <!-- Articles Grid -->
      <div class="py-24 grid md:grid-cols-2 lg:grid-cols-3 gap-10">
        <article 
          v-for="item in news" 
          :key="item.id" 
          class="group flex flex-col cursor-pointer"
        >
          <!-- Image -->
          <div class="relative h-64 overflow-hidden rounded-sm mb-6 bg-muted">
            <div class="absolute inset-0 bg-primary/0 group-hover:bg-primary/10 transition-colors duration-300 z-10"></div>
            <img 
              :src="item.image" 
              :alt="item.title"
              class="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500"
            />
          </div>
          
          <!-- Meta -->
          <div class="flex items-center gap-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
            <span>{{ new Date(item.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) }}</span>
            <span class="w-1 h-1 rounded-full bg-border"></span>
            <span class="text-primary">{{ item.readTime }}</span>
          </div>

          <!-- Content -->
          <h2 class="font-display text-2xl font-bold text-foreground mb-3 leading-snug group-hover:text-primary transition-colors">
            {{ item.title }}
          </h2>
          <p class="text-muted-foreground leading-relaxed line-clamp-3 mb-6">
            {{ item.excerpt }}
          </p>

          <!-- Author -->
          <div class="mt-auto pt-4 border-t border-border flex items-center justify-between">
            <span class="text-sm font-medium text-foreground">By {{ item.author }}</span>
            <span class="text-primary opacity-0 group-hover:opacity-100 transform translate-x-[-10px] group-hover:translate-x-0 transition-all duration-300">Read &rarr;</span>
          </div>
        </article>
      </div>
    </div>
  </div>
</template>
