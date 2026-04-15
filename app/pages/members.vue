<script setup lang="ts">
import { useHead } from '#imports'
import { members } from '~/lib/dummyData'

useHead({
  title: 'Members',
  meta: [
    { name: 'description', content: 'Struktur Organisasi dan Dewan Ambalan Pramuka SMAN 1 Pasawahan.' }
  ]
})
</script>

<template>
  <div class="flex flex-col min-h-screen bg-card pt-10">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
      <!-- Header -->
      <div class="pt-12 pb-20 text-center">
        <h1 class="font-display text-5xl md:text-6xl font-bold text-foreground mb-6">The Vanguard</h1>
        <p class="text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
          Mengenal sosok-sosok di balik kemudi Ambalan. Pemimpin, pelatih, dan pembina yang menjadi nafas Gerakan Pramuka di SMAN 1 Pasawahan.
        </p>
      </div>

      <!-- Members Grid -->
      <div class="py-12 border-t border-border">
        <div class="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          <div 
            v-for="member in members" 
            :key="member.id"
            class="group bg-background rounded-sm border border-border p-6 hover:border-primary/50 transition-colors duration-300"
          >
            <div class="relative w-24 h-24 mb-6 rounded-full overflow-hidden border-2 border-transparent group-hover:border-primary transition-colors p-1">
              <div class="w-full h-full rounded-full overflow-hidden bg-muted">
                 <img 
                  :src="member.image" 
                  :alt="member.name"
                  class="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                />
              </div>
            </div>
            
            <h3 class="font-display text-xl font-bold text-foreground mb-1 group-hover:text-primary transition-colors">{{ member.name }}</h3>
            <p class="text-sm font-semibold tracking-wide uppercase text-accent mb-4">{{ member.role }}</p>
            <p class="text-sm text-muted-foreground leading-relaxed">
              {{ member.bio }}
            </p>
          </div>
        </div>
      </div>
      
      <!-- Call to Action Banner -->
      <div class="my-24 p-12 bg-primary text-primary-foreground rounded-sm flex flex-col md:flex-row items-center justify-between gap-8">
        <div class="max-w-xl">
          <h3 class="font-display text-3xl font-bold mb-4">Siap Mengabdi?</h3>
          <p class="text-primary-foreground/80 text-lg">
            Roda regenerasi terus berjalan. Tempa diri Anda bersama kami menjadi bagian dari Dewan Ambalan selanjutnya.
          </p>
        </div>
        <NuxtLink to="/contact" class="inline-flex h-14 items-center justify-center rounded-sm bg-background px-10 text-base font-semibold text-primary transition-all hover:scale-105 shrink-0 shadow-xl">
          Start Your Journey
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
