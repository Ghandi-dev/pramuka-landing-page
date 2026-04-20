<script setup lang="ts">
import { ref } from 'vue'
import type { GalleryItem } from '~/services/galleryService'

defineProps<{
    data: GalleryItem[]
    edgeHit: { top: boolean; right: boolean; bottom: boolean; left: boolean }
}>()

defineEmits<{
    (e: 'pointerdown', event: PointerEvent, item: GalleryItem): void
}>()

const pinboardCanvas = ref<HTMLElement | null>(null)
const pinboardWrapper = ref<HTMLElement | null>(null)

defineExpose({
    pinboardCanvas,
    pinboardWrapper
})
</script>

<template>
    <div class="relative border border-border rounded-lg overflow-hidden bg-muted/30 select-none">
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

        <div ref="pinboardWrapper" class="w-full h-[600px] overflow-hidden relative cursor-grab active:cursor-grabbing"
            style="background-image: radial-gradient(circle, currentColor 1px, transparent 1px); background-size: 20px 20px; opacity: 0.9;">
            <div ref="pinboardCanvas" class="w-[8000px] h-[4500px] relative">
                <div v-for="item in data" :key="item.id" class="absolute w-40 cursor-move select-none touch-none group"
                    :style="{ left: `${item.x}px`, top: `${item.y}px` }"
                    @pointerdown="$emit('pointerdown', $event, item)" @dragstart.prevent>

                    <div class="bg-card rounded-lg shadow-md border border-border overflow-hidden group-hover:shadow-xl group-hover:scale-105 transition-all duration-200"
                        :style="{ transform: `rotate(${item.rotation || 0}deg)` }">
                        <div class="w-full h-48 overflow-hidden">
                            <img :src="item.image_url" :alt="item.title"
                                class="w-full h-full object-cover pointer-events-none" />
                        </div>
                        <div class="p-2 text-center pointer-events-none">
                            <p class="text-xs font-medium text-foreground truncate">{{ item.title }}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div
            class="absolute bottom-3 left-1/2 -translate-x-1/2 bg-background/80 backdrop-blur-sm text-muted-foreground text-xs px-3 py-1.5 rounded-full border border-border">
            Seret gambar untuk mengubah posisi • Scroll untuk zoom
        </div>
    </div>
</template>
