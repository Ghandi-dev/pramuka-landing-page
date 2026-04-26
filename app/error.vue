<script setup lang="ts">
import type { NuxtError } from '#app'

defineProps({
  error: {
    type: Object as () => NuxtError,
    required: true
  }
})

const handleError = () => clearError({ redirect: '/' })
</script>

<template>
  <div
    class="min-h-screen bg-gray-50 flex items-center justify-center p-6 sm:p-12 relative overflow-hidden font-outfit">
    <!-- Background Decor -->
    <div class="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
      <div class="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-500/10 blur-3xl"></div>
      <div class="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-amber-500/10 blur-3xl"></div>
    </div>

    <div class="w-full max-w-2xl text-center relative z-10 flex flex-col items-center justify-center space-y-8">
      <!-- Error Graphic -->
      <div class="relative w-full flex items-center justify-center py-10">
        <Error404 src="/images/404.webp"
          message="Ciee... nyasar ya? Halaman yang kamu cari sepertinya sudah pindah atau memang tidak pernah ada." />
      </div>

      <!-- Actions -->
      <div class="flex flex-col sm:flex-row items-center gap-4 pt-6">
        <Button size="lg"
          class="w-full sm:w-auto px-8 rounded-full shadow-lg hover:-translate-y-1 hover:shadow-xl transition-all duration-300 font-semibold bg-primary text-white hover:bg-gray-800"
          @click="handleError">
          🏠 Kembali ke Beranda
        </Button>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
