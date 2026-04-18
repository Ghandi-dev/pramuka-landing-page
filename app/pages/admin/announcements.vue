<script setup lang="ts">
import { h } from 'vue'
import { Plus, Pencil, Trash2 } from 'lucide-vue-next'
import type { ColumnDef } from '@tanstack/vue-table'
import { useAnnouncementService, type Announcement } from '~/services/announcementService'
import Button from '~/components/ui/button/Button.vue'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import ConfirmDialog from '~/components/admin/ConfirmDialog.vue'



definePageMeta({ layout: 'admin',middleware:'admin' })
useHead({ title: 'Kelola Pengumuman' })

const { data, loading, fetchAll, insert, update, remove } = useAnnouncementService()

// Dialog state
const dialogOpen = ref(false)
const isEditing = ref(false)
const confirmOpen = ref(false)
const deleteTarget = ref<Announcement | null>(null)
const saving = ref(false)
const deleting = ref(false)
const notification = ref<{ type: 'success' | 'error'; message: string } | null>(null)

const form = ref({
    title: '',
    content: '',
    date: new Date().toISOString().split('T')[0]!,
    status: 'Aktif',
})
const editId = ref<string | null>(null)

const showNotification = (type: 'success' | 'error', message: string) => {
    notification.value = { type, message }
    setTimeout(() => { notification.value = null }, 3000)
}

const columns: ColumnDef<Announcement, any>[] = [
    { accessorKey: 'title', header: 'Judul', cell: ({ row }) => h('span', { class: 'font-medium' }, row.getValue('title')) },
    { accessorKey: 'date', header: 'Tanggal' },
    {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => {
            const status = row.getValue('status') as string
            return h('span', {
                class: [
                    'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold',
                    status === 'Aktif'
                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                        : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
                ].join(' ')
            }, status)
        }
    },
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
    form.value = { title: '', content: '', date: new Date().toISOString().split('T')[0]!, status: 'Aktif' }
    dialogOpen.value = true
}

const openEdit = (item: Announcement) => {
    isEditing.value = true
    editId.value = item.id
    form.value = { title: item.title, content: item.content || '', date: item.date, status: item.status }
    dialogOpen.value = true
}

const openDelete = (item: Announcement) => {
    deleteTarget.value = item
    confirmOpen.value = true
}

const handleSave = async () => {
    saving.value = true
    try {
        if (isEditing.value && editId.value) {
            await update(editId.value, form.value)
            showNotification('success', 'Pengumuman berhasil diperbarui')
        } else {
            await insert(form.value)
            showNotification('success', 'Pengumuman berhasil ditambahkan')
        }
        dialogOpen.value = false
        await fetchAll()
    } catch (e: any) {
        showNotification('error', e.message || 'Gagal menyimpan')
    } finally {
        saving.value = false
    }
}

const handleDelete = async () => {
    if (!deleteTarget.value) return
    deleting.value = true
    try {
        await remove(deleteTarget.value.id)
        showNotification('success', 'Pengumuman berhasil dihapus')
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
                <h1 class="text-2xl lg:text-3xl font-display font-bold text-foreground tracking-tight">Pengumuman</h1>
                <p class="text-muted-foreground mt-1">Kelola pengumuman pramuka</p>
            </div>
            <Button @click="openCreate">
                <Plus class="w-4 h-4 mr-2" />
                Tambah Pengumuman
            </Button>
        </div>

        <!-- Table -->
        <AdminDataTable :columns="columns" :data="data" :loading="loading" search-placeholder="Cari pengumuman..." />

        <!-- Create/Edit Dialog -->
        <Dialog v-model:open="dialogOpen">
            <DialogContent class="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>{{ isEditing ? 'Edit Pengumuman' : 'Tambah Pengumuman' }}</DialogTitle>
                </DialogHeader>
                <form @submit.prevent="handleSave" class="space-y-4 pt-2">
                    <div class="space-y-2">
                        <Label for="title">Judul</Label>
                        <Input id="title" v-model="form.title" placeholder="Judul pengumuman" required />
                    </div>
                    <div class="space-y-2">
                        <Label for="content">Konten</Label>
                        <Textarea id="content" v-model="form.content" placeholder="Isi pengumuman..." class="min-h-[120px]" />
                    </div>
                    <div class="grid grid-cols-2 gap-4">
                        <div class="space-y-2">
                            <Label for="date">Tanggal</Label>
                            <Input id="date" type="date" v-model="form.date" required />
                        </div>
                        <div class="space-y-2">
                            <Label for="status">Status</Label>
                            <select id="status" v-model="form.status"
                                class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                                <option value="Aktif">Aktif</option>
                                <option value="Tidak Aktif">Tidak Aktif</option>
                            </select>
                        </div>
                    </div>
                    <div class="flex justify-end gap-3 pt-2">
                        <Button type="button" variant="outline" @click="dialogOpen = false">Batal</Button>
                        <Button type="submit" :disabled="saving">
                            {{ saving ? 'Menyimpan...' : 'Simpan' }}
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
