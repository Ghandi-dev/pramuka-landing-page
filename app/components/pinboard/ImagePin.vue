<script setup lang="ts">
const props = defineProps({
  image: String,
  x: Number,
  y: Number,
  title: String
})

// Definisikan emit agar bisa didengar oleh parent
const emit = defineEmits(['open-detail'])

const handleDoubleClick = () => {
  emit('open-detail', props)
}
</script>

<template>
  <div
    class="absolute w-[240px] bg-white shadow-lg transition-all duration-200 ease-in-out z-10 hover:scale-105 hover:shadow-2xl hover:z-20 cursor-pointer select-none"
    :style="{ left: `${x}px`, top: `${y}px` }" @dblclick="handleDoubleClick">
    <div
      class="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 bg-red-600 rounded-full border-[3px] border-white shadow-md z-30 flex items-center justify-center">
      <div class="w-1.5 h-1.5 bg-white/40 rounded-full mb-1 ml-1"></div>
    </div>

    <div class="w-full p-4 h-[250px] overflow-hidden">
      <img :src="image" :alt="title" class="w-full h-full object-cover" loading="lazy" />
    </div>

    <div class="p-3">
      <h3 class="m-0 text-base font-bold text-gray-800 leading-tight">{{ title }}</h3>
      <p class="m-0 mt-1 text-xs text-gray-500 leading-normal">Double click to see details.</p>
    </div>
  </div>
</template>