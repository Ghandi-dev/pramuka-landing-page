<script setup lang="ts">
import { h } from 'vue'
import { Plus, Pencil, Trash2, Link2 } from 'lucide-vue-next'
import type { ColumnDef } from '@tanstack/vue-table'
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
import { toast } from 'vue-sonner'
import { useTwibbonCampaignService, type TwibbonCampaign } from '~/services/twibbonService'

definePageMeta({ layout: 'admin' })
useHead({ title: 'Kelola Twibbon', meta: [{ name: 'robots', content: 'noindex, nofollow' }] })

const { data, loading, fetchAll, insert, update, remove, uploadImage, deleteImage } = useTwibbonCampaignService();
const config = useRuntimeConfig()

const dialogOpen = ref(false)
const isEditing = ref(false)
const confirmOpen = ref(false)
const deleteTarget = ref<TwibbonCampaign | null>(null)
const saving = ref(false)
const deleting = ref(false)

const selectedFile = ref<File | null>(null)
const uploading = ref(false)

const form = ref({
    title: '',
    slug: '',
    description: '',
    frame_url: '',
    is_active: true,
})
const editId = ref<string | null>(null)

const copyLink = (slug: string) => {
    const url = `${config.public.siteUrl}/twibbon/${slug}`
    navigator.clipboard.writeText(url)
    toast.success('Link berhasil disalin ke clipboard')
}

const columns: ColumnDef<TwibbonCampaign, any>[] = [
    { accessorKey: 'title', header: 'Judul Twibbon', cell: ({ row }) => h('span', { class: 'font-medium' }, row.getValue('title')) },
    { accessorKey: 'slug', header: 'Slug' },
    {
        accessorKey: 'description',
        header: 'Deskripsi',
        cell: ({ row }) => h('div', {
            class: 'max-w-[200px] lg:max-w-[300px] truncate',
            title: row.getValue('description')
        }, row.getValue('description'))
    },
    {
        accessorKey: 'frame_url',
        header: 'Frame URL',
        cell: ({ row }) => h('div', {
            class: 'max-w-[150px] truncate text-xs text-muted-foreground',
            title: row.getValue('frame_url')
        }, row.getValue('frame_url'))
    },
    { accessorKey: 'is_active', header: 'Aktif' },
    {
        id: 'actions',
        header: 'Aksi',
        cell: ({ row }) => {
            return h('div', { class: 'flex items-center gap-1' }, [
                h(Button, {
                    variant: 'ghost', size: 'icon', class: 'h-8 w-8',
                    title: 'Salin Link',
                    onClick: () => copyLink(row.original.slug)
                }, () => h(Link2, { class: 'w-4 h-4' })),
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
    form.value = {
        title: '',
        slug: '',
        description: '',
        frame_url: '',
        is_active: true,
    }
    dialogOpen.value = true
}

const openEdit = (item: TwibbonCampaign) => {
    isEditing.value = true
    editId.value = item.id
    selectedFile.value = null
    form.value = { title: item.title, slug: item.slug, description: item.description || '', frame_url: item.frame_url || '', is_active: item.is_active }
    dialogOpen.value = true
}

const openDelete = (item: TwibbonCampaign) => {
    deleteTarget.value = item
    confirmOpen.value = true
}

const handleSave = async () => {
    saving.value = true
    try {
        let imageUrl = form.value.frame_url
        let oldImageUrl: string | null = null

        if (isEditing.value && editId.value) {
            const originalTwibbon = data.value.find(a => a.id === editId.value)
            oldImageUrl = originalTwibbon?.frame_url || null
        }

        if (selectedFile.value) {
            uploading.value = true
            imageUrl = await uploadImage(selectedFile.value)
            form.value.frame_url = imageUrl
            uploading.value = false
        }

        if (isEditing.value && editId.value) {
            await update(editId.value, form.value)
            toast.success('Twibbon berhasil diperbarui')
            if (oldImageUrl && oldImageUrl !== imageUrl) {
                await deleteImage(oldImageUrl)
            }
        } else {
            await insert(form.value)
            toast.success('Twibbon berhasil ditambahkan')
        }
        dialogOpen.value = false
        await fetchAll()
    } catch (e: any) {
        console.log(e);
        toast.error(e.message || 'Gagal menyimpan')
    } finally {
        saving.value = false
        uploading.value = false
    }
}

const handleDelete = async () => {
    if (!deleteTarget.value) return
    deleting.value = true
    try {
        if (deleteTarget.value.frame_url) {
            await deleteImage(deleteTarget.value.frame_url)
        }
        await remove(deleteTarget.value.id)
        toast.success('Twibbon berhasil dihapus')
        confirmOpen.value = false
        await fetchAll()
    } catch (e: any) {
        toast.error(e.message || 'Gagal menghapus')
    } finally {
        deleting.value = false
    }
}

onMounted(() => fetchAll())
</script>

<template>
    <div class="flex flex-col gap-6">
        <!-- Header -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
                <h1 class="text-2xl lg:text-3xl font-display font-bold text-foreground tracking-tight">Twibbon</h1>
                <p class="text-muted-foreground mt-1">Kelola Twibbon pramuka</p>
            </div>
            <Button @click="openCreate">
                <Plus class="w-4 h-4 mr-2" />
                Tambah Twibbon
            </Button>
        </div>

        <!-- Table -->
        <DataTable :columns="columns" :data="data" :loading="loading" search-placeholder="Cari Twibbon..." />

        <!-- Create/Edit Dialog -->
        <Dialog v-model:open="dialogOpen">
            <DialogContent class="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>{{ isEditing ? 'Edit Twibbon' : 'Tambah Twibbon' }}</DialogTitle>
                </DialogHeader>
                <form @submit.prevent="handleSave" class="space-y-4 pt-2">
                    <div class="space-y-2">
                        <Label for="title">Judul</Label>
                        <Input id="title" v-model="form.title" placeholder="Judul Twibbon" required />
                    </div>
                    <div class="space-y-2">
                        <Label for="slug">Slug</Label>
                        <Input id="slug" v-model="form.slug" placeholder="Slug Twibbon" required />
                    </div>
                    <div class="space-y-2">
                        <Label for="description">Deskripsi</Label>
                        <Textarea id="description" v-model="form.description" placeholder="Deskripsi Twibbon..."
                            class="min-h-[100px]" />
                    </div>
                    <div class="space-y-2">
                        <Label>Cover Image</Label>
                        <ImageUploader v-model="form.frame_url" :loading="uploading"
                            @file-selected="f => selectedFile = f"
                            @update:modelValue="val => { if (!val) selectedFile = null }" />
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
