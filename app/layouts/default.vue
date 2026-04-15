<script setup lang="ts">
import AppHeader from '~/components/layout/AppHeader.vue'
import AppFooter from '~/components/layout/AppFooter.vue'
</script>

<template>
  <div class="min-h-screen flex flex-col bg-background text-foreground overflow-x-hidden selection:bg-primary/20 selection:text-primary">
    <AppHeader />
    
    <main class="flex-1 w-full pt-20">
      <!-- Added top padding (pt-20) to account for fixed header -->
      <slot />
    </main>

    <AppFooter />
  </div>
</template>
