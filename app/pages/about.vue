<script setup lang="ts">
import { useHead } from '#imports'

useHead({
  title: 'About Us',
  meta: [
    { name: 'description', content: 'Sejarah dan Visi Misi Pramuka SMA Negeri 1 Pasawahan.' }
  ]
})
</script>

<template>
  <div class="flex flex-col min-h-screen bg-card pt-10">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
      <!-- Header -->
      <div class="pb-16 border-b border-border text-center">
        <h1 class="font-display text-5xl md:text-6xl font-bold text-foreground mb-6">{{ $t('about.header.title') }}</h1>
        <p class="text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
          {{ $t('about.header.description') }}
        </p>
      </div>

      <!-- Ambalan Logos -->
      <div class="py-16 mx-auto flex flex-row items-center justify-center gap-8 sm:gap-32 border-b border-border">
        <div class="flex flex-col items-center gap-4 sm:gap-6 group w-[120px] sm:w-auto">
          <div
            class="relative w-28 h-28 sm:w-40 sm:h-40 md:w-48 md:h-48 p-3 sm:p-4 bg-white dark:bg-background border border-border rounded-full shadow-sm group-hover:border-primary/50 group-hover:shadow-md transition-all duration-300">
            <img src="/images/logo_pa.webp" alt="Logo Ambalan Putra"
              class="w-full h-full object-contain scale-95 group-hover:scale-100 transition-transform duration-300" />
          </div>
          <h3
            class="font-display text-base sm:text-2xl font-bold text-foreground text-center group-hover:text-primary transition-colors">
            Ambalan Putra</h3>
        </div>

        <div class="flex flex-col items-center gap-4 sm:gap-6 group w-[120px] sm:w-auto">
          <div
            class="relative w-28 h-28 sm:w-40 sm:h-40 md:w-48 md:h-48 p-3 sm:p-4 bg-white dark:bg-background border border-border rounded-full shadow-sm group-hover:border-accent/50 group-hover:shadow-md transition-all duration-300">
            <img src="/images/logo_pi.webp" alt="Logo Ambalan Putri"
              class="w-full h-full object-contain scale-95 group-hover:scale-100 transition-transform duration-300" />
          </div>
          <h3
            class="font-display text-base sm:text-2xl font-bold text-foreground text-center group-hover:text-accent transition-colors">
            Ambalan Putri</h3>
        </div>
      </div>

      <!-- Core Details -->
      <div class="py-24 grid lg:grid-cols-12 gap-16 items-start border-b border-border">
        <div class="lg:col-span-4 sticky top-32">
          <h2 class="font-display text-3xl font-bold text-foreground">{{ $t('about.history.title') }}</h2>
          <div class="mt-6 w-12 h-1 bg-primary rounded-full"></div>
        </div>
        <div class="lg:col-span-8 prose prose-lg prose-neutral dark:prose-invert">
          <p class="text-lg leading-relaxed text-foreground/90">
            {{ $t('about.history.paragraph1') }}
          </p>
          <p class="text-lg leading-relaxed text-foreground/90 mt-6">
            {{ $t('about.history.paragraph2') }}
          </p>
          <blockquote
            class="my-10 pl-6 border-l-4 border-primary italic text-2xl font-display text-muted-foreground font-medium">
            {{ $t('about.history.quote') }}
          </blockquote>
        </div>
      </div>

      <!-- Vision Mission -->
      <div class="py-24 grid lg:grid-cols-2 gap-16">
        <div class="bg-background p-10 md:p-14 rounded-sm border border-border shadow-sm">
          <h3 class="font-display text-2xl font-bold text-foreground mb-6">Visi Ambalan</h3>
          <p class="text-lg text-muted-foreground leading-relaxed">
            Terwujudnya kader Pramuka Penegak yang berbudi pekerti luhur, berkarakter kuat, mandiri, peduli lingkungan,
            dan berpegang teguh pada nilai-nilai Pancasila dalam menyongsong era globalisasi.
          </p>
        </div>

        <div class="bg-background p-10 md:p-14 rounded-sm border border-border shadow-sm">
          <h3 class="font-display text-2xl font-bold text-foreground mb-6">Misi Ambalan</h3>
          <ul class="space-y-4 text-lg text-muted-foreground list-disc list-inside">
            <li>Menyelenggarakan latihan rutin yang inovatif, edukatif, dan rekreatif.</li>
            <li>Meningkatkan kualitas keterampilan manajerial dan kepemimpinan.</li>
            <li>Menumbuhkan kesadaran pelestarian alam lewat kegiatan kemah bakti.</li>
            <li>Mempererat tali persaudaraan antar anggota.</li>
          </ul>
        </div>
      </div>

      <!-- Call to Action -->
      <div class="py-24 text-center">
        <p class="text-2xl font-display text-foreground font-semibold mb-8">{{ $t('about.cta.text') }}</p>
        <NuxtLink :to="$localePath('/contact')"
          class="inline-flex h-14 items-center justify-center rounded-sm bg-primary px-10 text-base font-medium text-primary-foreground transition-all hover:bg-primary/90">
          {{ $t('about.cta.button') }}
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
