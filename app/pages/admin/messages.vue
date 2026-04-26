<script setup lang="ts">
import { h } from 'vue'
import { Eye, Trash2, MailOpen, Mail } from 'lucide-vue-next'
import type { ColumnDef } from '@tanstack/vue-table'
import { useContactMessageService, type ContactMessage } from '~/services/contactMessageService'
import Button from '~/components/ui/button/Button.vue'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import ConfirmDialog from '~/components/admin/ConfirmDialog.vue'

import { toast } from 'vue-sonner'

definePageMeta({ layout: 'admin', middleware: 'admin' })
useHead({ title: 'Kelola Pesan', meta: [{ name: 'robots', content: 'noindex, nofollow' }] })

const { data, loading, fetchAll, remove, markAsRead } = useContactMessageService()

// Dialog states
const dialogOpen = ref(false)
const confirmOpen = ref(false)
const viewTarget = ref<ContactMessage | null>(null)
const deleteTarget = ref<ContactMessage | null>(null)
const deleting = ref(false)

const columns: ColumnDef<ContactMessage, any>[] = [
    { accessorKey: 'full_name', header: 'Nama', cell: ({ row }) => h('span', { class: 'font-medium' }, row.getValue('full_name')) },
    { accessorKey: 'email', header: 'Email' },
    { accessorKey: 'subject', header: 'Subjek' },
    { accessorKey: 'created_at', header: 'Tanggal', cell: ({ row }) => new Date(row.getValue('created_at')).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) },
    {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => {
            const status = row.getValue('status') as string
            return h('span', {
                class: [
                    'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold gap-1',
                    status === 'new'
                        ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                        : status === 'read'
                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                            : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400'
                ].join(' ')
            }, [
                h(status === 'new' ? Mail : MailOpen, { class: 'w-3 h-3' }),
                status === 'new' ? 'Baru' : status === 'read' ? 'Dibaca' : 'Dibalas'
            ])
        }
    },
    {
        id: 'actions',
        header: 'Aksi',
        cell: ({ row }) => {
            return h('div', { class: 'flex items-center gap-1' }, [
                h(Button, {
                    variant: 'ghost', size: 'icon', class: 'h-8 w-8 text-primary',
                    onClick: () => openView(row.original)
                }, () => h(Eye, { class: 'w-4 h-4' })),
                h(Button, {
                    variant: 'ghost', size: 'icon', class: 'h-8 w-8 text-destructive hover:text-destructive',
                    onClick: () => openDelete(row.original)
                }, () => h(Trash2, { class: 'w-4 h-4' })),
            ])
        },
    },
]

const openView = async (item: ContactMessage) => {
    viewTarget.value = item
    dialogOpen.value = true

    // Auto status ke 'read' kalau belum
    if (item.status === 'new') {
        try {
            await markAsRead(item.id)
            item.status = 'read' // Local opt update
        } catch (e) {
            console.error('Failed to mark as read', e)
        }
    }
}

const openDelete = (item: ContactMessage) => {
    deleteTarget.value = item
    confirmOpen.value = true
}

const handleDelete = async () => {
    if (!deleteTarget.value) return
    deleting.value = true
    try {
        await remove(deleteTarget.value.id)
        toast.success('Pesan berhasil dihapus')
        confirmOpen.value = false
        await fetchAll('created_at', false) // get latest
    } catch (e: any) {
        toast.error(e.message || 'Gagal menghapus')
    } finally {
        deleting.value = false
    }
}

onMounted(() => {
    fetchAll('created_at', false) // newest first
})
</script>

<template>
    <div class="flex flex-col gap-6">
        <!-- Header -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
                <h1 class="text-2xl lg:text-3xl font-display font-bold text-foreground tracking-tight">Pesan Masuk</h1>
                <p class="text-muted-foreground mt-1">Kelola dan baca pesan dari halaman kontak</p>
            </div>
        </div>

        <!-- Table -->
        <AdminDataTable :columns="columns" :data="data" :loading="loading"
            search-placeholder="Cari pesan atau nama pengirim..." />

        <!-- View Dialog -->
        <Dialog v-model:open="dialogOpen">
            <DialogContent class="sm:max-w-xl">
                <DialogHeader>
                    <DialogTitle>Detail Pesan</DialogTitle>
                </DialogHeader>
                <div v-if="viewTarget" class="space-y-4 pt-4">
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <Label class="text-muted-foreground text-xs">Nama Pengirim</Label>
                            <p class="font-medium mt-1">{{ viewTarget.full_name }}</p>
                        </div>
                        <div>
                            <Label class="text-muted-foreground text-xs">Email Pengirim</Label>
                            <p class="font-medium mt-1 break-all">
                                <a :href="`mailto:${viewTarget.email}`" class="text-primary hover:underline">{{
                                    viewTarget.email }}</a>
                            </p>
                        </div>
                    </div>
                    <div class="pt-2 border-t border-border">
                        <Label class="text-muted-foreground text-xs">Subjek</Label>
                        <p class="font-semibold text-lg mt-1 tracking-tight">{{ viewTarget.subject }}</p>
                    </div>
                    <div class="pt-2">
                        <Label class="text-muted-foreground text-xs">Komentar / Pesan</Label>
                        <div
                            class="p-4 bg-muted/50 rounded-lg whitespace-pre-line text-sm text-foreground mt-2 leading-relaxed">
                            {{ viewTarget.message }}
                        </div>
                    </div>
                    <div class="flex justify-between items-center pt-4 border-t border-border">
                        <span class="text-xs text-muted-foreground">Dikirim: {{ new
                            Date(viewTarget.created_at).toLocaleString('id-ID') }}</span>
                        <Button type="button" @click="dialogOpen = false">Tutup</Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>

        <!-- Delete Confirmation -->
        <ConfirmDialog v-model:open="confirmOpen" :loading="deleting" @confirm="handleDelete" />
    </div>
</template>
