<script setup lang="ts">
import 'vue-sonner/style.css'
import { Toaster } from '@/components/ui/sonner'

// App.vue acts as the entry point for Nuxt layout and pages.
</script>

<template>
  <Toaster position="top-right" rich-colors />
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
