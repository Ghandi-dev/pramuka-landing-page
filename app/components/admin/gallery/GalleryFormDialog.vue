<script setup lang="ts">
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import Button from '~/components/ui/button/Button.vue'
import ImageUploader from '~/components/admin/ImageUploader.vue'

defineProps<{
    modelValue: boolean
    isEditing: boolean
    saving: boolean
    uploading: boolean
    form: { title: string; description: string; image_url: string }
}>()

defineEmits<{
    (e: 'update:modelValue', value: boolean): void
    (e: 'save'): void
    (e: 'file-selected', file: File): void
}>()
</script>

<template>
    <Dialog :open="modelValue" @update:open="$emit('update:modelValue', $event)">
        <DialogContent class="sm:max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
                <DialogTitle>{{ isEditing ? 'Edit Foto' : 'Tambah Foto' }}</DialogTitle>
            </DialogHeader>
            <form @submit.prevent="$emit('save')" class="space-y-4 pt-2">
                <div class="space-y-2">
                    <Label for="title">Judul Foto</Label>
                    <Input id="title" v-model="form.title" placeholder="Contoh: Api Unggun 2024 / boleh dikosongkan " />
                </div>
                <div class="space-y-2">
                    <Label for="description">Deskripsi</Label>
                    <Textarea id="description" v-model="form.description"
                        placeholder="Keterangan singkat... / boleh dikosongkan " class="h-[100px] resize-none" />
                </div>
                <div class="space-y-2">
                    <Label>Gambar</Label>
                    <ImageUploader :model-value="form.image_url" :loading="uploading"
                        @file-selected="$emit('file-selected', $event)"
                        @update:model-value="(v) => form.image_url = v || ''" />
                </div>
                <div class="flex justify-end gap-3 pt-2">
                    <Button type="button" variant="outline" @click="$emit('update:modelValue', false)">Batal</Button>
                    <Button type="submit" :disabled="saving">
                        {{ saving ? 'Menyimpan...' : 'Simpan' }}
                    </Button>
                </div>
            </form>
        </DialogContent>
    </Dialog>
</template>
