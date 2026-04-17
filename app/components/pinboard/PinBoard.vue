<script setup lang="ts">
import Panzoom from "@panzoom/panzoom"
import { pramukaImagesForPinBoard } from '~/lib/dummyData'
import ImagePin from "./ImagePin.vue"

const canvas = ref()
const wrapper = ref()
const zoomIn = ref()
const zoomOut = ref()
const resetView = ref()
const pramukaImages = ref(pramukaImagesForPinBoard)

// State untuk Modal
const selectedCard = ref<any>(null)

const openModal = (data: any) => {
  selectedCard.value = data
}

const closeModal = () => {
  selectedCard.value = null
}

onMounted(() => {

  const panzoom = Panzoom(canvas.value, {
    maxScale: 3.5,
    minScale: 0.5,
    startScale: 0.5,
    startX: -400,
    startY: -200,
    contain: "outside",
    step: 0.1,
    animate: true,
    cursor: "grab",
  })
  wrapper.value.addEventListener("wheel", panzoom.zoomWithWheel)
  zoomIn.value.addEventListener("click", () => panzoom.zoomIn())
  resetView.value.addEventListener("click", () => panzoom.reset())
  zoomOut.value.addEventListener("click", () => panzoom.zoomOut())
})

</script>

<template>
  <div class="relative w-full h-full rounded-lg overflow-hidden shadow-lg bg-secondary">

    <div ref="wrapper" class="w-full h-125 overflow-hidden shadow-inner"
      style="background-image: radial-gradient(circle, rgb(0,0,0) 1px, transparent 1px); background-size: 20px 20px;">
      <div ref="canvas" class="w-2000 h-1125 relative">
        <ImagePin v-for="pramuka in pramukaImages" :key="pramuka.id" v-bind="pramuka" @open-detail="openModal" />
      </div>
    </div>

    <!-- Intruksi -->
    <div
      class="absolute bottom-4 left-1/2 -translate-x-1/2 z-40 bg-black/50 text-white p-3 rounded-lg text-sm text-center">
      <!-- Desktop -->
      <p class="hidden sm:block">
        Double-click to view details • Drag to pan • Scroll to zoom
      </p>

      <!-- Mobile -->
      <p class="sm:hidden">
        Tap to view details • Drag to pan • Pinch to zoom
      </p>
    </div>

    <!-- ✅ Tombol kontrol zoom -->
    <div class="absolute bottom-4 right-4 z-40 flex flex-col gap-2">
      <button ref="zoomIn"
        class="w-9 h-9 rounded-full bg-white/90 hover:bg-white shadow-md flex items-center justify-center text-gray-700 hover:text-gray-900 transition backdrop-blur-sm border border-gray-200"
        title="Zoom In">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"
          stroke-width="2.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
        </svg>
      </button>

      <button ref="zoomOut"
        class="w-9 h-9 rounded-full bg-white/90 hover:bg-white shadow-md flex items-center justify-center text-gray-700 hover:text-gray-900 transition backdrop-blur-sm border border-gray-200"
        title="Zoom Out">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"
          stroke-width="2.5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M4 12h16" />
        </svg>
      </button>

      <!-- Divider -->
      <div class="w-full h-px bg-gray-200 mx-auto" />

      <button ref="resetView"
        class="w-9 h-9 rounded-full bg-white/90 hover:bg-white shadow-md flex items-center justify-center text-gray-700 hover:text-gray-900 transition backdrop-blur-sm border border-gray-200"
        title="Reset View">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"
          stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round"
            d="M9 9V4.5M9 9H4.5M9 9 3.75 3.75M9 15v4.5M9 15H4.5M9 15l-5.25 5.25M15 9h4.5M15 9V4.5M15 9l5.25-5.25M15 15h4.5M15 15v4.5m0-4.5 5.25 5.25" />
        </svg>
      </button>
    </div>

    <Transition name="fade">
      <div v-if="selectedCard"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        @click.self="closeModal">
        <div class="bg-white rounded-2xl max-w-sm w-full overflow-hidden shadow-2xl animate-in zoom-in duration-300">
          <div class="relative p-4">
            <div class="w-full aspect-3/4 h-auto overflow-hidden rounded-lg shadow-inner bg-gray-100">
              <img :src="selectedCard.image" :alt="selectedCard.title" class="w-full h-full object-cover" />
            </div>
            <button @click="closeModal"
              class="absolute top-6 right-6 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full backdrop-blur-md h-10 w-10 flex items-center justify-center transition z-10">
              ✕
            </button>
          </div>
          <div class="text-center p-6 pt-0">
            <h2 class="text-2xl font-bold text-gray-900 mb-2 leading-tight">
              {{ selectedCard.title }}
            </h2>
          </div>
        </div>
      </div>
    </Transition>

  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>