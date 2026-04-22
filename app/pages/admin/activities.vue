<script setup lang="ts">
import { h } from 'vue'
import { Plus, Pencil, Trash2 } from 'lucide-vue-next'
import type { ColumnDef } from '@tanstack/vue-table'
import { useActivityService, type Activity } from '~/services/activityService'
import Button from '~/components/ui/button/Button.vue'
import DataTable from '~/components/admin/DataTable.vue'
import ConfirmDialog from '~/components/admin/ConfirmDialog.vue'
import ImageUploader from '~/components/admin/ImageUploader.vue'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'

definePageMeta({ layout: 'admin' })
useHead({ title: 'Kelola Kegiatan', meta: [{ name: 'robots', content: 'noindex, nofollow' }] })

const { data, loading, fetchAll, insert, update, remove, uploadImage, deleteImage } = useActivityService()

const dialogOpen = ref(false)
const isEditing = ref(false)
const confirmOpen = ref(false)
const deleteTarget = ref<Activity | null>(null)
const saving = ref(false)
const deleting = ref(false)
const notification = ref<{ type: 'success' | 'error'; message: string } | null>(null)

const selectedFile = ref<File | null>(null)
const uploading = ref(false)

const form = ref({
    title: '',
    description: '',
    activity_date: '',
    location: '',
    cover_image: '',
})
const editId = ref<string | null>(null)

const showNotification = (type: 'success' | 'error', message: string) => {
    notification.value = { type, message }
    setTimeout(() => { notification.value = null }, 3000)
}

const columns: ColumnDef<Activity, any>[] = [
    { accessorKey: 'title', header: 'Judul Kegiatan', cell: ({ row }) => h('span', { class: 'font-medium' }, row.getValue('title')) },
    { accessorKey: 'activity_date', header: 'Tanggal' },
    { accessorKey: 'location', header: 'Lokasi' },
    {
        id: 'actions',
        header: 'Aksi',
        cell: ({ row }) => {
            return h('div', { class: 'flex items-center gap-1' }, [
                h(Button, {
                    variant: 'ghost', size: 'icon', class: 'h-8 w-8',
                    onClick: () => openEdit(row.original)
                }, () => h(Pencil, { class: 'w-4 h-4' })),
                h(Button, {
                    variant: 'ghost', size: 'icon', class: 'h-8 w-8 text-destructive hover:text-destructive',
                    onClick: () => openDelete(row.original)
                }, () => h(Trash2, { class: 'w-4 h-4' })),
            ])
        },
    },
]

const openCreate = () => {
    isEditing.value = false
    editId.value = null
    selectedFile.value = null
    form.value = { title: '', description: '', activity_date: new Date().toISOString().split('T')[0]!, location: '', cover_image: '' }
    dialogOpen.value = true
}

const openEdit = (item: Activity) => {
    isEditing.value = true
    editId.value = item.id
    selectedFile.value = null
    form.value = { title: item.title, description: item.description || '', activity_date: item.activity_date, location: item.location || '', cover_image: item.cover_image || '' }
    dialogOpen.value = true
}

const openDelete = (item: Activity) => {
    deleteTarget.value = item
    confirmOpen.value = true
}

const handleSave = async () => {
    saving.value = true
    try {
        let imageUrl = form.value.cover_image
        let oldImageUrl: string | null = null

        if (isEditing.value && editId.value) {
           const originalActivity = data.value.find(a => a.id === editId.value)
           oldImageUrl = originalActivity?.cover_image || null
        }

        if (selectedFile.value) {
            uploading.value = true
            imageUrl = await uploadImage(selectedFile.value)
            form.value.cover_image = imageUrl
            uploading.value = false
        }

        if (isEditing.value && editId.value) {
            await update(editId.value, form.value)
            showNotification('success', 'Kegiatan berhasil diperbarui')
            if (oldImageUrl && oldImageUrl !== imageUrl) {
                await deleteImage(oldImageUrl)
            }
        } else {
            await insert(form.value)
            showNotification('success', 'Kegiatan berhasil ditambahkan')
        }
        dialogOpen.value = false
        await fetchAll()
    } catch (e: any) {
        console.log(e);
        showNotification('error', e.message || 'Gagal menyimpan')
    } finally {
        saving.value = false
        uploading.value = false
    }
}

const handleDelete = async () => {
    if (!deleteTarget.value) return
    deleting.value = true
    try {
        if (deleteTarget.value.cover_image) {
            await deleteImage(deleteTarget.value.cover_image)
        }
        await remove(deleteTarget.value.id)
        showNotification('success', 'Kegiatan berhasil dihapus')
        confirmOpen.value = false
        await fetchAll()
    } catch (e: any) {
        showNotification('error', e.message || 'Gagal menghapus')
    } finally {
        deleting.value = false
    }
}

onMounted(() => fetchAll())
</script>

<template>
    <div class="flex flex-col gap-6">
        <!-- Notification -->
        <Transition name="notification">
            <div v-if="notification" :class="[
                'fixed top-4 right-4 z-[100] px-4 py-3 rounded-lg shadow-lg text-sm font-medium max-w-sm',
                notification.type === 'success' ? 'bg-emerald-600 text-white' : 'bg-destructive text-destructive-foreground'
            ]">
                {{ notification.message }}
            </div>
        </Transition>

        <!-- Header -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
                <h1 class="text-2xl lg:text-3xl font-display font-bold text-foreground tracking-tight">Kegiatan</h1>
                <p class="text-muted-foreground mt-1">Kelola kegiatan pramuka</p>
            </div>
            <Button @click="openCreate">
                <Plus class="w-4 h-4 mr-2" />
                Tambah Kegiatan
            </Button>
        </div>

        <!-- Table -->
        <DataTable :columns="columns" :data="data" :loading="loading" search-placeholder="Cari kegiatan..." />

        <!-- Create/Edit Dialog -->
        <Dialog v-model:open="dialogOpen">
            <DialogContent class="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>{{ isEditing ? 'Edit Kegiatan' : 'Tambah Kegiatan' }}</DialogTitle>
                </DialogHeader>
                <form @submit.prevent="handleSave" class="space-y-4 pt-2">
                    <div class="space-y-2">
                        <Label for="title">Judul</Label>
                        <Input id="title" v-model="form.title" placeholder="Judul kegiatan" required />
                    </div>
                    <div class="space-y-2">
                        <Label for="description">Deskripsi</Label>
                        <Textarea id="description" v-model="form.description" placeholder="Deskripsi kegiatan..."
                            class="min-h-[100px]" />
                    </div>
                    <div class="grid grid-cols-2 gap-4">
                        <div class="space-y-2">
                            <Label for="activity_date">Tanggal</Label>
                            <Input id="activity_date" type="date" v-model="form.activity_date" required />
                        </div>
                        <div class="space-y-2">
                            <Label for="location">Lokasi</Label>
                            <Input id="location" v-model="form.location" placeholder="Contoh: Lapangan Sekolah" />
                        </div>
                    </div>
                    <div class="space-y-2">
                        <Label>Cover Image</Label>
                        <ImageUploader 
                            v-model="form.cover_image" 
                            :loading="uploading" 
                            @file-selected="f => selectedFile = f"
                            @update:modelValue="val => { if (!val) selectedFile = null }"
                        />
                    </div>
                    <div class="flex justify-end gap-3 pt-2">
                        <Button type="button" variant="outline" @click="dialogOpen = false">Batal</Button>
                        <Button type="submit" :disabled="saving || uploading">
                            {{ saving || uploading ? 'Menyimpan...' : 'Simpan' }}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>

        <!-- Delete Confirmation -->
        <ConfirmDialog v-model:open="confirmOpen" :loading="deleting" @confirm="handleDelete" />
    </div>
</template>

<style scoped>
.notification-enter-active { animation: slideIn 0.3s ease; }
.notification-leave-active { animation: slideIn 0.3s ease reverse; }
@keyframes slideIn { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
</style>
