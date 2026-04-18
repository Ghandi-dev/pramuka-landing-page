<script setup lang="ts">
import { Plus, Pencil, Trash2, GripVertical, Images } from 'lucide-vue-next'
import Panzoom from '@panzoom/panzoom'
import { useGalleryService, type GalleryItem } from '~/services/galleryService'
import Button from '~/components/ui/button/Button.vue'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import ConfirmDialog from '~/components/admin/ConfirmDialog.vue'

definePageMeta({ layout: 'admin' ,middleware:'admin'})
useHead({ title: 'Kelola Galeri' })

const { data, loading, fetchAll, insert, update, remove, uploadImage, updatePosition, deleteImage } = useGalleryService()

const activeTab = ref<'grid' | 'pinboard'>('grid')

// Dialog state
const dialogOpen = ref(false)
const isEditing = ref(false)
const confirmOpen = ref(false)
const deleteTarget = ref<GalleryItem | null>(null)
const saving = ref(false)
const deleting = ref(false)
const uploading = ref(false)
const notification = ref<{ type: 'success' | 'error'; message: string } | null>(null)

const form = ref({ title: '', image_url: '' })
const editId = ref<string | null>(null)
const selectedFile = ref<File | null>(null)

const showNotification = (type: 'success' | 'error', message: string) => {
    notification.value = { type, message }
    setTimeout(() => { notification.value = null }, 3000)
}

const openCreate = () => {
    isEditing.value = false
    editId.value = null
    form.value = { title: '', image_url: '' }
    selectedFile.value = null
    dialogOpen.value = true
}

const openEdit = (item: GalleryItem) => {
    isEditing.value = true
    editId.value = item.id
    form.value = { title: item.title, image_url: item.image_url }
    selectedFile.value = null
    dialogOpen.value = true
}

const openDelete = (item: GalleryItem) => {
    deleteTarget.value = item
    confirmOpen.value = true
}

const onFileSelected = (file: File) => {
    selectedFile.value = file
}

const handleSave = async () => {
    saving.value = true
    try {
        let imageUrl = form.value.image_url

        if (selectedFile.value) {
            uploading.value = true
            imageUrl = await uploadImage(selectedFile.value)
            uploading.value = false
        }

        if (!imageUrl) {
            showNotification('error', 'Silakan pilih gambar')
            saving.value = false
            return
        }

        if (isEditing.value && editId.value) {
            await update(editId.value, { title: form.value.title, image_url: imageUrl })
            showNotification('success', 'Foto berhasil diperbarui')
        } else {
            await insert({ title: form.value.title, image_url: imageUrl, x: Math.floor(Math.random() * 1500), y: Math.floor(Math.random() * 800) })
            showNotification('success', 'Foto berhasil ditambahkan')
        }
        dialogOpen.value = false
        await fetchAll()
    } catch (e: any) {
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
        await deleteImage(deleteTarget.value.image_url)
        await remove(deleteTarget.value.id)
        showNotification('success', 'Foto berhasil dihapus')
        confirmOpen.value = false
        await fetchAll()
    } catch (e: any) {
        showNotification('error', e.message || 'Gagal menghapus')
    } finally {
        deleting.value = false
    }
}

// Pinboard
const pinboardCanvas = ref<HTMLElement | null>(null)
const pinboardWrapper = ref<HTMLElement | null>(null)
let panzoomInstance: ReturnType<typeof Panzoom> | null = null

const dragTarget = ref<string | null>(null)
const dragStart = ref({ x: 0, y: 0, origX: 0, origY: 0 })

const initPinboard = () => {
    if (!pinboardCanvas.value || !pinboardWrapper.value) return
    if (panzoomInstance) return

    panzoomInstance = Panzoom(pinboardCanvas.value, {
        maxScale: 3,
        minScale: 0.3,
        startScale: 0.4,
        contain: 'outside',
        cursor: 'grab',
    })
    pinboardWrapper.value.addEventListener('wheel', panzoomInstance.zoomWithWheel)
}

watch(activeTab, (tab) => {
    if (tab === 'pinboard') {
        nextTick(() => initPinboard())
    }
})

const onPinMouseDown = (e: MouseEvent, item: GalleryItem) => {
    e.stopPropagation()
    e.preventDefault()
    if (panzoomInstance) panzoomInstance.setOptions({ disablePan: true })

    dragTarget.value = item.id
    const scale = panzoomInstance?.getScale() || 1
    dragStart.value = { x: e.clientX, y: e.clientY, origX: item.x, origY: item.y }

    const el = (e.currentTarget as HTMLElement)

    const onMove = (me: MouseEvent) => {
        const scale = panzoomInstance?.getScale() || 1
        const dx = (me.clientX - dragStart.value.x) / scale
        const dy = (me.clientY - dragStart.value.y) / scale
        
        // Update the DOM element directly for high performance during drag!
        // We avoid mutating `data.value` here so Vue doesn't re-render the entire array 60 times a second.
        if (el) {
            el.style.left = `${Math.round(dragStart.value.origX + dx)}px`
            el.style.top = `${Math.round(dragStart.value.origY + dy)}px`
        }
    }

    const onUp = async (me: MouseEvent) => {
        document.removeEventListener('mousemove', onMove)
        document.removeEventListener('mouseup', onUp)
        if (panzoomInstance) panzoomInstance.setOptions({ disablePan: false })

        // Save final position to Vue state and Supabase ONLY ONCE on mouse release
        const scale = panzoomInstance?.getScale() || 1
        const dx = (me.clientX - dragStart.value.x) / scale
        const dy = (me.clientY - dragStart.value.y) / scale
        const target = data.value.find((d: GalleryItem) => d.id === dragTarget.value)
        if (target) {
            target.x = Math.round(dragStart.value.origX + dx)
            target.y = Math.round(dragStart.value.origY + dy)
            try {
                await updatePosition(target.id, target.x, target.y)
            } catch (e) {
                console.error('Failed to save position', e)
            }
        }
        dragTarget.value = null
    }

    document.addEventListener('mousemove', onMove)
    document.addEventListener('mouseup', onUp)
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
                <h1 class="text-2xl lg:text-3xl font-display font-bold text-foreground tracking-tight">Galeri</h1>
                <p class="text-muted-foreground mt-1">Kelola foto galeri dan pinboard</p>
            </div>
            <Button @click="openCreate">
                <Plus class="w-4 h-4 mr-2" />
                Tambah Foto
            </Button>
        </div>

        <!-- Tabs -->
        <div class="flex gap-1 bg-muted rounded-lg p-1 w-fit">
            <button @click="activeTab = 'grid'" :class="[
                'px-4 py-2 rounded-md text-sm font-medium transition-all',
                activeTab === 'grid' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'
            ]">
                <Images class="w-4 h-4 inline mr-1.5" />Grid View
            </button>
            <button @click="activeTab = 'pinboard'" :class="[
                'px-4 py-2 rounded-md text-sm font-medium transition-all',
                activeTab === 'pinboard' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'
            ]">
                <GripVertical class="w-4 h-4 inline mr-1.5" />Pinboard Editor
            </button>
        </div>

        <!-- Grid View -->
        <div v-if="activeTab === 'grid'">
            <!-- Loading skeleton -->
            <div v-if="loading" class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                <div v-for="i in 8" :key="i" class="aspect-square rounded-lg bg-muted animate-pulse" />
            </div>

            <div v-else-if="data.length === 0" class="text-center py-16 text-muted-foreground">
                <Images class="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p class="text-lg font-medium">Belum ada foto</p>
                <p class="text-sm mt-1">Klik "Tambah Foto" untuk menambahkan foto pertama.</p>
            </div>

            <div v-else class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                <div v-for="item in data" :key="item.id"
                    class="group relative aspect-square rounded-lg overflow-hidden border border-border bg-muted">
                    <img :src="item.image_url" :alt="item.title" class="w-full h-full object-cover" loading="lazy" />
                    <div
                        class="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-4">
                        <p class="text-white text-sm font-medium text-center line-clamp-2">{{ item.title }}</p>
                        <div class="flex gap-2">
                            <Button size="sm" variant="secondary" @click="openEdit(item)">
                                <Pencil class="w-3 h-3 mr-1" /> Edit
                            </Button>
                            <Button size="sm" variant="destructive" @click="openDelete(item)">
                                <Trash2 class="w-3 h-3 mr-1" /> Hapus
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Pinboard View -->
        <div v-if="activeTab === 'pinboard'"
            class="relative border border-border rounded-lg overflow-hidden bg-muted/30">
            <div ref="pinboardWrapper" class="w-full h-[600px] overflow-hidden"
                style="background-image: radial-gradient(circle, currentColor 1px, transparent 1px); background-size: 20px 20px; opacity: 0.9;">
                <div ref="pinboardCanvas" class="w-[2000px] h-[1200px] relative">
                    <div v-for="item in data" :key="item.id"
                        class="absolute w-36 bg-card rounded-lg shadow-md border border-border overflow-hidden cursor-move hover:shadow-xl hover:scale-105 transition-shadow select-none"
                        :style="{ left: `${item.x}px`, top: `${item.y}px` }" @mousedown="onPinMouseDown($event, item)">
                        <div class="w-full h-32 overflow-hidden">
                            <img :src="item.image_url" :alt="item.title" class="w-full h-full object-cover pointer-events-none" />
                        </div>
                        <div class="p-2 text-center">
                            <p class="text-xs font-medium text-foreground truncate">{{ item.title }}</p>
                        </div>
                    </div>
                </div>
            </div>
            <div class="absolute bottom-3 left-1/2 -translate-x-1/2 bg-background/80 backdrop-blur-sm text-muted-foreground text-xs px-3 py-1.5 rounded-full border border-border">
                Seret gambar untuk mengubah posisi • Scroll untuk zoom
            </div>
        </div>

        <!-- Create/Edit Dialog -->
        <Dialog v-model:open="dialogOpen">
            <DialogContent class="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>{{ isEditing ? 'Edit Foto' : 'Tambah Foto' }}</DialogTitle>
                </DialogHeader>
                <form @submit.prevent="handleSave" class="space-y-4 pt-2">
                    <div class="space-y-2">
                        <Label for="title">Judul Foto</Label>
                        <Input id="title" v-model="form.title" placeholder="Contoh: Api Unggun 2024" required />
                    </div>
                    <div class="space-y-2">
                        <Label>Gambar</Label>
                        <AdminImageUploader :model-value="form.image_url" :loading="uploading"
                            @file-selected="onFileSelected" @update:model-value="(v) => form.image_url = v || ''" />
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
