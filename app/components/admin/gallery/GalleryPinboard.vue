<script setup lang="ts">
import { ref } from "vue";
import { Lock, Unlock } from "lucide-vue-next";
import Button from "~/components/ui/button/Button.vue";
import type { GalleryItem } from "~/services/galleryService";

defineProps<{
    data: GalleryItem[];
}>();

defineEmits<{
    (e: "pointerdown", event: PointerEvent, item: GalleryItem): void;
}>();

const pinboardCanvas = ref<HTMLElement | null>(null);
const pinboardWrapper = ref<HTMLElement | null>(null);
const edgeTop = ref<HTMLElement | null>(null);
const edgeBottom = ref<HTMLElement | null>(null);
const edgeLeft = ref<HTMLElement | null>(null);
const edgeRight = ref<HTMLElement | null>(null);

const editMode = ref(false);

defineExpose({
    pinboardCanvas,
    pinboardWrapper,
    edgeTop,
    edgeBottom,
    edgeLeft,
    edgeRight,
    editMode,
});
</script>

<template>
    <div class="relative border border-border rounded-lg overflow-hidden bg-muted/30 select-none">
        <!-- Edge hit visual indicators -->
        <div ref="edgeTop"
            class="absolute top-0 left-0 right-0 h-8 bg-gradient-to-b from-primary/40 to-transparent pointer-events-none transition-opacity duration-300 z-10 opacity-0">
        </div>
        <div ref="edgeBottom"
            class="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-primary/40 to-transparent pointer-events-none transition-opacity duration-300 z-10 opacity-0">
        </div>
        <div ref="edgeLeft"
            class="absolute top-0 bottom-0 left-0 w-8 bg-gradient-to-r from-primary/40 to-transparent pointer-events-none transition-opacity duration-300 z-10 opacity-0">
        </div>
        <div ref="edgeRight"
            class="absolute top-0 bottom-0 right-0 w-8 bg-gradient-to-l from-primary/40 to-transparent pointer-events-none transition-opacity duration-300 z-10 opacity-0">
        </div>

        <!-- Edit mode toggle -->
        <Button size="sm" :variant="editMode ? 'default' : 'outline'"
            class="absolute top-3 right-3 z-20 gap-1.5 shadow-lg" @click="editMode = !editMode">
            <Unlock v-if="editMode" class="w-3.5 h-3.5" />
            <Lock v-else class="w-3.5 h-3.5" />
            {{ editMode ? "Mode Edit" : "Terkunci" }}
        </Button>

        <div ref="pinboardWrapper"
            class="w-full h-[600px] overflow-hidden relative cursor-grab active:cursor-grabbing will-change-transform"
            style="
        background-image: radial-gradient(
          circle,
          currentColor 1px,
          transparent 1px
        );
        background-size: 20px 20px;
        opacity: 0.9;
      ">
            <div ref="pinboardCanvas" class="w-[8000px] h-[4500px] relative will-change-transform preserve-3d">
                <div v-for="item in data" :key="item.id" class="absolute w-40 select-none touch-none group"
                    :class="editMode ? 'cursor-move' : 'cursor-default'"
                    :style="{ left: `${item.x}px`, top: `${item.y}px` }"
                    @pointerdown="editMode && $emit('pointerdown', $event, item)" @dragstart.prevent>
                    <div class="bg-card rounded-lg shadow-md border border-border overflow-hidden group-hover:shadow-xl group-hover:scale-105 transition-all duration-200"
                        :style="{ transform: `rotate(${item.rotation || 0}deg)` }">
                        <div class="w-full flex items-center justify-center overflow-hidden bg-muted">
                            <img :src="item.image_url" :alt="item.title"
                                class="w-full h-auto object-contain pointer-events-none" loading="lazy" />
                        </div>

                        <div class="p-2 text-center pointer-events-none">
                            <p class="text-xs font-medium text-foreground truncate">
                                {{ item.title }}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div
            class="absolute bottom-3 left-1/2 -translate-x-1/2 bg-background/80 backdrop-blur-sm text-muted-foreground text-xs px-3 py-1.5 rounded-full border border-border text-center">
            {{
                editMode
                    ? "Seret gambar untuk mengubah posisi • Scroll untuk zoom"
                    : 'Klik tombol "Mode Edit" untuk mengubah posisi gambar'
            }}
        </div>
    </div>
</template>
