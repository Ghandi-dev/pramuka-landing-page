<script setup lang="ts">
import Panzoom from "@panzoom/panzoom"
import { pramukaImagesForPinBoard } from '~/lib/dummyData'
import ImagePin from "./ImagePin.vue"

const board = ref()
const container = ref()
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
  const panzoom = Panzoom(board.value, {
    maxScale: 1.5,
    minScale: 0.5,
    contain: "outside",
    startScale: 0.5,
  })

  container.value.addEventListener("wheel", panzoom.zoomWithWheel)
})
</script>

<template>
  <div class="relative w-screen h-screen overflow-hidden bg-[#f3f3f3]">

    <div ref="container" class="w-full h-full cursor-grab active:cursor-grabbing shadow-inner"
      style="background-image: linear-gradient(90deg, #80808033 1px, transparent 0), linear-gradient(#80808033 1px, transparent 0); background-size: 70px 70px;">

      <div ref="board" class="w-[4000px] h-[4000px] relative">
        <ImagePin v-for="pramuka in pramukaImages" :key="pramuka.id" v-bind="pramuka" @open-detail="openModal" />
      </div>
    </div>

    <Transition name="fade">
      <div v-if="selectedCard"
        class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        @click.self="closeModal">

        <div class="bg-white rounded-2xl max-w-sm w-full overflow-hidden shadow-2xl animate-in zoom-in duration-300">

          <div class="relative p-4">

            <div class="w-full aspect-[3/4] h-auto overflow-hidden rounded-lg shadow-inner bg-gray-100">
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
            <p class="text-sm text-gray-500">Detail kegiatan pramuka</p>
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