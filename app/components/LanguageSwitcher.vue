<template>
  <div class="relative inline-flex items-center p-1 bg-white border-2 border-black">
    <!-- Active Indicator -->
    <div
      class="absolute left-1 top-1 bottom-1 w-[calc(50%-4px)] bg-black transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] pointer-events-none"
      :class="currentLocale === 'en' ? 'translate-x-full' : 'translate-x-0'"></div>

    <NuxtLink :to="switchLocalePath('id')"
      class="relative z-10 px-4 py-1.5 text-xs font-bold tracking-widest uppercase transition-colors duration-300 select-none"
      :class="currentLocale === 'id' ? 'text-white' : 'text-black/50 hover:text-black'" aria-label="Bahasa Indonesia">
      ID
    </NuxtLink>

    <NuxtLink :to="switchLocalePath('en')"
      class="relative z-10 px-4 py-1.5 text-xs font-bold tracking-widest uppercase transition-colors duration-300 select-none"
      :class="currentLocale === 'en' ? 'text-white' : 'text-black/50 hover:text-black'" aria-label="English">
      EN
    </NuxtLink>
  </div>
</template>

<script setup lang="ts">
const { locale } = useI18n()
const switchLocalePath = useSwitchLocalePath()

const currentLocale = computed(() => locale.value)
</script>
