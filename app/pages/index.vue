<script setup lang="ts">
import { useHead } from '#imports'
import PinBoard from '~/components/pinboard/PinBoard.vue';
import { activities } from '~/lib/dummyData'

useHead({
  title: 'Home',
  meta: [
    { name: 'description', content: 'Selamat datang di Pramuka SMA Negeri 1 Pasawahan.' }
  ]
})

const recentActivities = activities.slice(0, 3)
</script>

<template>
  <div class="flex flex-col min-h-screen">
    <!-- Hero Section -->
    <section class="relative w-full min-h-[90vh] flex items-center bg-card overflow-hidden">
      <!-- Decorative background elements -->
      <div class="absolute inset-0 z-0">
        <div class="absolute -top-24 -right-24 w-96 h-96 bg-primary/10 rounded-full blur-3xl mix-blend-multiply"></div>
        <div class="absolute top-1/2 -left-24 w-72 h-72 bg-accent/10 rounded-full blur-3xl mix-blend-multiply"></div>
      </div>

      <div
        class="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl relative z-10 grid lg:grid-cols-2 gap-12 items-center">
        <div class="max-w-2xl">
          <div
            class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold tracking-wide uppercase mb-6">
            <span class="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
            Pangkalan SMAN 1 Pasawahan
          </div>
          <h1
            class="font-display text-5xl md:text-6xl lg:text-7xl font-bold text-foreground leading-[1.1] tracking-tight mb-8">
            Brave.<br />
            <span class="text-primary">Disciplined.</span><br />
            Prepared.
          </h1>
          <p class="text-lg md:text-xl text-muted-foreground leading-relaxed mb-10 max-w-lg">
            Membangun karakter mulia dengan semangat kepanduan di alam raya. Menjadi teladan tangguh untuk masa depan.
          </p>
          <div class="flex flex-col sm:flex-row gap-4">
            <NuxtLink to="/contact"
              class="inline-flex h-12 items-center justify-center rounded-sm bg-primary px-8 text-sm font-medium text-primary-foreground transition-all hover:bg-primary/90 hover:scale-[1.02] hover:shadow-xl hover:shadow-primary/20">
              Join Application
            </NuxtLink>
            <NuxtLink to="/about"
              class="inline-flex h-12 items-center justify-center rounded-sm border-2 border-border bg-transparent px-8 text-sm font-medium text-foreground transition-colors hover:border-primary hover:text-primary">
              Learn Our History
            </NuxtLink>
          </div>
        </div>

        <div class="relative hidden lg:block h-150">
          <div
            class="absolute inset-0 bg-primary/5 rounded-2xl transform rotate-3 scale-105 transition-transform duration-700 hover:rotate-6">
          </div>
          <img src="/images/pramuka1.webp" alt="Pramuka Activities"
            class="relative z-10 w-full h-full object-cover rounded-2xl shadow-2xl grayscale-20 hover:grayscale-0 transition-all duration-700" />
        </div>
      </div>
    </section>

    <!-- Intro Banner -->
    <section class="w-full bg-primary text-primary-foreground py-24">
      <div class="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl text-center">
        <h2 class="font-display text-3xl md:text-5xl font-bold mb-8 leading-tight">
          Satyaku Kudarmakan,<br />Darmaku Kubaktikan.
        </h2>
        <p class="text-lg text-primary-foreground/80 leading-relaxed max-w-3xl mx-auto">
          Lebih dari sekadar ekstrakurikuler, Pramuka SMA Negeri 1 Pasawahan adalah keluarga besar yang menempa
          kepemimpinan, persaudaraan tanpa batas, dan keterampilan bertahan di setiap kondisi.
        </p>
      </div>
    </section>

    <!-- Pinboard -->
    <section class="py-24 bg-background">
      <div class="container px-4 mx-auto">
        <PinBoard />
      </div>
    </section>

    <!-- Recent Activities -->
    <section class="py-24 bg-background">
      <div class="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div class="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div class="max-w-xl">
            <h2 class="font-display text-4xl font-bold text-foreground mb-4">Latest Expedition</h2>
            <p class="text-muted-foreground text-lg">Jejak langkah kami di berbagai medan, dari lapangan sekolah hingga
              puncak gunung.</p>
          </div>
          <NuxtLink to="/activities"
            class="group inline-flex items-center gap-2 text-primary font-semibold hover:text-primary/80 transition-colors">
            View All Documentation
            <span class="transform transition-transform group-hover:translate-x-1">→</span>
          </NuxtLink>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <article v-for="activity in recentActivities" :key="activity.id"
            class="group group/card relative h-112.5 overflow-hidden rounded-sm bg-muted">
            <img :src="activity.image" :alt="activity.title"
              class="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover/card:scale-110" />
            <div class="absolute inset-0 bg-linear-to-t from-black/80 via-black/40 to-transparent"></div>

            <div class="absolute inset-0 p-8 flex flex-col justify-end">
              <span
                class="inline-block px-3 py-1 mb-4 text-xs font-semibold uppercase tracking-wider text-primary-foreground bg-primary/90 rounded-sm w-fit">
                {{ activity.category }}
              </span>
              <h3 class="font-display text-2xl font-bold text-white mb-2">{{ activity.title }}</h3>
              <p class="text-white/80 text-sm mb-4">{{ activity.date }} &bull; {{ activity.location }}</p>

              <div
                class="grid grid-rows-[0fr] group-hover/card:grid-rows-[1fr] transition-[grid-template-rows] duration-500 ease-in-out">
                <div class="overflow-hidden">
                  <p class="text-white/70 text-sm line-clamp-2 mt-2">
                    {{ activity.description }}
                  </p>
                </div>
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>
  </div>
</template>
