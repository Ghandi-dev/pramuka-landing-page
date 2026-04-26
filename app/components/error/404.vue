<script setup lang="ts">
defineProps<{
    src: string
    alt?: string
    message?: string
}>()
</script>

<template>
    <div class="flex flex-col items-center justify-center">
        <img :src="src" :alt="alt || 'Error Illustration'" class="w-40 md:w-56 object-contain mb-4" />
        <div class="max-w-md space-y-4">
            <p class="text-lg md:text-xl text-gray-600 font-medium">
                {{ message }}
            </p>
        </div>
    </div>
</template>