<script setup lang="ts">
import Panzoom from "@panzoom/panzoom"
import ImagePin from "./ImagePin.vue"
import { useGalleryService } from "~/services/galleryService"
import { useIntersectionObserver } from "@vueuse/core"

const { data, loading, fetchAll } = useGalleryService()

const canvas = ref()
const wrapper = ref()
const zoomIn = ref()
const zoomOut = ref()
const resetView = ref()

// State untuk Modal
const selectedCard = ref<any>(null)

// State untuk Edge Hit
const edgeHit = ref({ top: false, right: false, bottom: false, left: false })
let edgeHitTimeout: ReturnType<typeof setTimeout> | null = null

const openModal = (data: any) => {
  selectedCard.value = data
}

const closeModal = () => {
  selectedCard.value = null
}

onMounted(() => {
  let hasFetched = false;
  useIntersectionObserver(wrapper, (entries) => {
    const isIntersecting = entries[0]?.isIntersecting;
    if (isIntersecting && !hasFetched) {
      hasFetched = true;
      fetchAll();
    }
  });

  const wrapperRect = wrapper.value.getBoundingClientRect();
  const startScale = 0.5;

  // Visual delta to center the 8000x4500 canvas
  const dx = (wrapperRect.width - 8000) / 2;
  const dy = (wrapperRect.height - 4500) / 2;

  // Divide by startScale to compensate for CSS transform-origin scale reductions
  const startX = dx / startScale;
  const startY = dy / startScale;

  const panzoom = Panzoom(canvas.value, {
    maxScale: 3.5,
    minScale: 0.5,
    startScale: startScale,
    startX: startX,
    startY: startY,
    contain: "outside",
    step: 0.1,
    cursor: "grab",
  })
  wrapper.value.addEventListener("wheel", panzoom.zoomWithWheel)
  zoomIn.value.addEventListener("click", () => panzoom.zoomIn())
  resetView.value.addEventListener("click", () => panzoom.reset())
  zoomOut.value.addEventListener("click", () => panzoom.zoomOut())

  // Edge Hit Logic
  canvas.value.addEventListener("panzoompan", () => {
    if (!wrapper.value || !canvas.value) return;

    const wrapperRect = wrapper.value.getBoundingClientRect();
    const canvasRect = canvas.value.getBoundingClientRect();

    const threshold = 3;
    edgeHit.value = {
      top: canvasRect.top >= wrapperRect.top - threshold,
      right: canvasRect.right <= wrapperRect.right + threshold,
      bottom: canvasRect.bottom <= wrapperRect.bottom + threshold,
      left: canvasRect.left >= wrapperRect.left - threshold,
    };

    if (edgeHitTimeout) clearTimeout(edgeHitTimeout);
  });

  canvas.value.addEventListener("panzoomend", () => {
    if (edgeHitTimeout) clearTimeout(edgeHitTimeout);
    edgeHitTimeout = setTimeout(() => {
      edgeHit.value = { top: false, right: false, bottom: false, left: false };
    }, 500);
  });
})

</script>

<template>
  <div class="relative w-full h-full rounded-lg overflow-hidden shadow-lg bg-secondary">
    <!-- Loading Animation -->
    <div v-if="loading" class="absolute inset-0 z-50 flex items-center justify-center bg-secondary/80 backdrop-blur-sm">
      <div class="flex flex-col items-center gap-4">
        <div class="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent shadow-md"></div>
        <p class="text-sm font-medium text-foreground animate-pulse">Memuat foto...</p>
      </div>
    </div>

    <!-- Edge hit visual indicators -->
    <div
      :class="['absolute top-0 left-0 right-0 h-8 bg-gradient-to-b from-primary/40 to-transparent pointer-events-none transition-opacity duration-300 z-10', edgeHit.top ? 'opacity-100' : 'opacity-0']">
    </div>
    <div
      :class="['absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-primary/40 to-transparent pointer-events-none transition-opacity duration-300 z-10', edgeHit.bottom ? 'opacity-100' : 'opacity-0']">
    </div>
    <div
      :class="['absolute top-0 bottom-0 left-0 w-8 bg-gradient-to-r from-primary/40 to-transparent pointer-events-none transition-opacity duration-300 z-10', edgeHit.left ? 'opacity-100' : 'opacity-0']">
    </div>
    <div
      :class="['absolute top-0 bottom-0 right-0 w-8 bg-gradient-to-l from-primary/40 to-transparent pointer-events-none transition-opacity duration-300 z-10', edgeHit.right ? 'opacity-100' : 'opacity-0']">
    </div>

    <div ref="wrapper" class="w-full h-125 overflow-hidden shadow-inner relative"
      style="background-image: radial-gradient(circle, rgb(0,0,0) 1px, transparent 1px); background-size: 20px 20px;">
      <div ref="canvas" class="w-[8000px] h-[4500px] relative">
        <ImagePin v-for="pramuka in data" :key="pramuka.id" v-bind="pramuka" @open-detail="openModal" />
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
              <img :src="selectedCard.image_url" :alt="selectedCard.title" class="w-full h-full object-cover" />
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