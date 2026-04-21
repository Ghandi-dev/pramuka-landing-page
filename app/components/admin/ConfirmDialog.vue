<script setup lang="ts">
import { AlertTriangle } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'

const props = defineProps<{
    open: boolean
    title?: string
    description?: string
    loading?: boolean
}>()

const emit = defineEmits<{
    (e: 'update:open', value: boolean): void
    (e: 'confirm'): void
}>()

const close = () => emit('update:open', false)
</script>

<template>
    <Dialog :open="open" @update:open="(val: boolean) => emit('update:open', val)">
        <DialogContent class="sm:max-w-md">
            <DialogHeader>
                <DialogTitle class="flex items-center gap-2">
                    <div class="h-10 w-10 rounded-full bg-destructive/10 flex items-center justify-center shrink-0">
                        <AlertTriangle class="w-5 h-5 text-destructive" />
                    </div>
                    {{ title || 'Konfirmasi Hapus' }}
                </DialogTitle>
                <DialogDescription class="pt-2">
                    {{ description || 'Apakah Anda yakin ingin menghapus data ini? Tindakan ini tidak dapat dibatalkan.' }}
                </DialogDescription>
            </DialogHeader>
            <div class="flex justify-end gap-3 pt-4">
                <Button variant="outline" @click="close" :disabled="loading">Batal</Button>
                <Button variant="destructive" @click="emit('confirm')" :disabled="loading">
                    <span v-if="loading" class="flex items-center gap-2">
                        <span class="h-4 w-4 border-2 border-current border-r-transparent rounded-full animate-spin" />
                        Menghapus...
                    </span>
                    <span v-else>Hapus</span>
                </Button>
            </div>
        </DialogContent>
    </Dialog>
</template>
