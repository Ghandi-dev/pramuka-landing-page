<script setup lang="ts">
defineProps<{
    src: string
    alt?: string
}>()
</script>

<template>
    <div
        class="bg-white/80 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-white/20 transform rotate-[-5deg] hover:rotate-0 transition-transform duration-300">
        <img :src="src" :alt="alt || 'Error Illustration'" class="w-40 md:w-56 object-contain" />
    </div>
</template>