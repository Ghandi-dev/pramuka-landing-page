<script setup lang="ts">
import { UploadCloud, X, Loader2 } from 'lucide-vue-next'

const props = defineProps<{
    modelValue?: string | null
    loading?: boolean
}>()

const emit = defineEmits<{
    (e: 'update:modelValue', value: string | null): void
    (e: 'file-selected', file: File): void
}>()

const preview = ref<string | null>(props.modelValue ?? null)
const isDragging = ref(false)

watch(() => props.modelValue, (val) => {
    preview.value = val ?? null
})

const handleFileChange = (e: Event) => {
    const target = e.target as HTMLInputElement
    if (target.files && target.files[0]) {
        processFile(target.files[0])
    }
}

const handleDrop = (e: DragEvent) => {
    isDragging.value = false
    const files = e.dataTransfer?.files
    if (files && files[0]) {
        processFile(files[0])
    }
}

const processFile = (file: File) => {
    const reader = new FileReader()
    reader.onload = (e) => {
        preview.value = e.target?.result as string
    }
    reader.readAsDataURL(file)
    emit('file-selected', file)
}

const clearImage = () => {
    preview.value = null
    emit('update:modelValue', null)
}
</script>

<template>
    <div class="flex flex-col gap-3">
        <!-- Preview -->
        <div v-if="preview || modelValue"
            class="relative rounded-lg overflow-hidden h-48 w-full border border-border bg-muted group">
            <img :src="preview || modelValue!" class="w-full h-full object-cover" />
            <button v-if="!loading" @click.prevent="clearImage"
                class="absolute top-2 right-2 h-7 w-7 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:scale-110">
                <X class="w-4 h-4" />
            </button>
            <div v-if="loading"
                class="absolute inset-0 bg-background/60 backdrop-blur-sm flex items-center justify-center">
                <Loader2 class="w-6 h-6 animate-spin text-primary" />
            </div>
        </div>

        <!-- Upload Zone -->
        <div v-else
            class="flex items-center justify-center w-full h-48 border-2 border-dashed rounded-lg transition-colors cursor-pointer relative"
            :class="isDragging ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50 hover:bg-muted/50 bg-background'"
            @dragover.prevent="isDragging = true" @dragleave.prevent="isDragging = false" @drop.prevent="handleDrop">
            <input type="file" accept="image/*" class="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                @change="handleFileChange" />
            <div class="flex flex-col items-center gap-2 text-muted-foreground pointer-events-none">
                <div
                    class="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-1">
                    <UploadCloud class="h-6 w-6" />
                </div>
                <p class="text-sm font-medium">Klik atau seret gambar</p>
                <p class="text-xs">PNG, JPG, WEBP (max 5MB)</p>
            </div>
        </div>
    </div>
</template>
