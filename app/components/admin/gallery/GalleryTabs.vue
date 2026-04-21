<script setup lang="ts">
import { GripVertical, Images } from 'lucide-vue-next'

defineProps<{ modelValue: 'grid' | 'pinboard' }>()
defineEmits(['update:modelValue'])
</script>

<template>
    <div class="flex gap-1 bg-muted rounded-lg p-1 w-fit">
        <button @click="$emit('update:modelValue', 'grid')" :class="[
            'px-4 py-2 rounded-md text-sm font-medium transition-all',
            modelValue === 'grid' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'
        ]">
            <Images class="w-4 h-4 inline mr-1.5" />Grid View
        </button>
        <button @click="$emit('update:modelValue', 'pinboard')" :class="[
            'px-4 py-2 rounded-md text-sm font-medium transition-all',
            modelValue === 'pinboard' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'
        ]">
            <GripVertical class="w-4 h-4 inline mr-1.5" />Pinboard Editor
        </button>
    </div>
</template>
