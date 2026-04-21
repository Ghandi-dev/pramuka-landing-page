<script setup lang="ts">
import { Pencil, Trash2, Images } from 'lucide-vue-next'
import Button from '~/components/ui/button/Button.vue'
import type { GalleryItem } from '~/services/galleryService'

defineProps<{
    data: GalleryItem[]
    loading: boolean
}>()

defineEmits<{
    (e: 'edit', item: GalleryItem): void
    (e: 'delete', item: GalleryItem): void
}>()
</script>

<template>
    <div>
        <!-- Loading skeleton -->
        <div v-if="loading" class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <div v-for="i in 8" :key="i" class="aspect-square rounded-lg bg-muted animate-pulse" />
        </div>

        <div v-else-if="data.length === 0" class="text-center py-16 text-muted-foreground">
            <Images class="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p class="text-lg font-medium">Belum ada foto</p>
            <p class="text-sm mt-1">Klik "Tambah Foto" untuk menambahkan foto pertama.</p>
        </div>

        <div v-else class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <div v-for="item in data" :key="item.id"
                class="group relative aspect-square rounded-lg overflow-hidden border border-border bg-muted">
                <img :src="item.image_url" :alt="item.title" class="w-full h-full object-cover" loading="lazy" />
                <!-- Desktop: full overlay on hover -->
                <div class="hidden md:flex absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex-col items-center justify-center gap-2 p-4">
                    <p class="text-white text-sm font-medium text-center line-clamp-2">{{ item.title }}</p>
                    <div class="flex gap-2">
                        <Button size="sm" variant="secondary" @click="$emit('edit', item)">
                            <Pencil class="w-3 h-3 mr-1" /> Edit
                        </Button>
                        <Button size="sm" variant="destructive" @click="$emit('delete', item)">
                            <Trash2 class="w-3 h-3 mr-1" /> Hapus
                        </Button>
                    </div>
                </div>
                <!-- Mobile: persistent bottom bar -->
                <div class="md:hidden absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent p-3 pt-6">
                    <p class="text-white text-xs font-medium line-clamp-1 mb-2">{{ item.title }}</p>
                    <div class="flex gap-2">
                        <Button size="sm" variant="secondary" class="h-7 text-xs px-2" @click="$emit('edit', item)">
                            <Pencil class="w-3 h-3 mr-1" /> Edit
                        </Button>
                        <Button size="sm" variant="destructive" class="h-7 text-xs px-2" @click="$emit('delete', item)">
                            <Trash2 class="w-3 h-3 mr-1" /> Hapus
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
