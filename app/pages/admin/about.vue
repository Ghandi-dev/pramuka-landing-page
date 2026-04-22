<script setup lang="ts">
import { h } from 'vue'
import { Plus, Pencil, Trash2 } from 'lucide-vue-next'
import type { ColumnDef } from '@tanstack/vue-table'
import { useAboutService, type About } from '~/services/aboutService'
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
useHead({ title: 'Kelola Tentang Kami', meta: [{ name: 'robots', content: 'noindex, nofollow' }] })

const { data, loading, fetchAll, insert, update, remove } = useAboutService()

// Dialog state
const dialogOpen = ref(false)
const isEditing = ref(false)
const confirmOpen = ref(false)
const deleteTarget = ref<About | null>(null)
const saving = ref(false)
const deleting = ref(false)
const notification = ref<{ type: 'success' | 'error'; message: string } | null>(null)

const form = ref({
    vision: '',
    mission: '',
    history: '',
    quote: '',
})
const editId = ref<string | null>(null)

const showNotification = (type: 'success' | 'error', message: string) => {
    notification.value = { type, message }
    setTimeout(() => { notification.value = null }, 3000)
}

const columns: ColumnDef<About, any>[] = [
    { accessorKey: 'vision', header: 'Visi', cell: ({ row }) => h('span', { class: 'font-medium line-clamp-2' }, row.getValue('vision')) },
    { accessorKey: 'quote', header: 'Kutipan', cell: ({ row }) => h('span', { class: 'text-muted-foreground' }, row.getValue('quote') || '-') },
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
    form.value = { vision: '', mission: '', history: '', quote: '' }
    dialogOpen.value = true
}

const openEdit = (item: About) => {
    isEditing.value = true
    editId.value = item.id
    form.value = { vision: item.vision, mission: item.mission || '', history: item.history || '', quote: item.quote || '' }
    dialogOpen.value = true
}

const openDelete = (item: About) => {
    deleteTarget.value = item
    confirmOpen.value = true
}

const handleSave = async () => {
    saving.value = true
    try {
        if (isEditing.value && editId.value) {
            await update(editId.value, form.value)
            showNotification('success', 'Data Tentang Kami berhasil diperbarui')
        } else {
            await insert(form.value)
            showNotification('success', 'Data Tentang Kami berhasil ditambahkan')
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
        showNotification('success', 'Data berhasil dihapus')
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
                <h1 class="text-2xl lg:text-3xl font-display font-bold text-foreground tracking-tight">Tentang Kami</h1>
                <p class="text-muted-foreground mt-1">Kelola data informasi Ambalan</p>
            </div>
            <Button @click="openCreate">
                <Plus class="w-4 h-4 mr-2" />
                Tambah Data
            </Button>
        </div>

        <!-- Table -->
        <AdminDataTable :columns="columns" :data="data" :loading="loading" search-placeholder="Cari data..." />

        <!-- Create/Edit Dialog -->
        <Dialog v-model:open="dialogOpen">
            <DialogContent class="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>{{ isEditing ? 'Edit Data' : 'Tambah Data' }}</DialogTitle>
                </DialogHeader>
                <form @submit.prevent="handleSave" class="space-y-4 pt-2">
                    <div class="space-y-2">
                        <Label for="vision">Visi</Label>
                        <Textarea id="vision" v-model="form.vision" placeholder="Visi Ambalan" required class="min-h-[80px]" />
                    </div>
                    <div class="space-y-2">
                        <Label for="mission">Misi</Label>
                        <Textarea id="mission" v-model="form.mission" placeholder="Misi Ambalan" class="min-h-[120px]" />
                    </div>
                    <div class="space-y-2">
                        <Label for="history">Sejarah</Label>
                        <Textarea id="history" v-model="form.history" placeholder="Sejarah singkat" class="min-h-[120px]" />
                    </div>
                    <div class="space-y-2">
                        <Label for="quote">Kutipan Pelantikan/Slogan</Label>
                        <Input id="quote" v-model="form.quote" placeholder="Contoh: Satyaku Kudarmakan, Darmaku Kubaktikan" />
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
