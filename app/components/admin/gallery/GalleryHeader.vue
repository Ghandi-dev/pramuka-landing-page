<script setup lang="ts">
import { Plus } from 'lucide-vue-next'
import Button from '~/components/ui/button/Button.vue'

defineEmits(['add'])
</script>

<template>
    <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
            <h1 class="text-2xl lg:text-3xl font-display font-bold text-foreground tracking-tight">Galeri</h1>
            <p class="text-muted-foreground mt-1">Kelola foto galeri dan pinboard</p>
        </div>
        <Button @click="$emit('add')">
            <Plus class="w-4 h-4 mr-2" />
            Tambah Foto
        </Button>
    </div>
</template>
