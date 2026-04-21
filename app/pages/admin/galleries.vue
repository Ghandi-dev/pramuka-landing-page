<script setup lang="ts">
import { ref, onMounted, watch, nextTick } from 'vue'
import { useGalleryService, type GalleryItem } from '~/services/galleryService'

import { useGalleryNotifications } from '~/composables/useGalleryNotifications'
import { useGalleryDialog } from '~/composables/useGalleryDialog'
import { useGalleryPinboard } from '~/composables/useGalleryPinboard'

import GalleryHeader from '~/components/admin/gallery/GalleryHeader.vue'
import GalleryTabs from '~/components/admin/gallery/GalleryTabs.vue'
import GalleryGrid from '~/components/admin/gallery/GalleryGrid.vue'
import GalleryPinboard from '~/components/admin/gallery/GalleryPinboard.vue'
import GalleryFormDialog from '~/components/admin/gallery/GalleryFormDialog.vue'
import GalleryDeleteDialog from '~/components/admin/gallery/GalleryDeleteDialog.vue'

definePageMeta({ layout: 'admin', middleware: 'admin' })
useHead({ title: 'Kelola Galeri' })

const { data, loading, fetchAll, insert, update, remove, uploadImage, deleteImage } = useGalleryService()

const activeTab = ref<'grid' | 'pinboard'>('grid')

// Composables
const { notification, showNotification } = useGalleryNotifications()
const {
    dialogOpen, isEditing, confirmOpen, deleteTarget, form, editId, selectedFile,
    openCreate, openEdit, openDelete, onFileSelected
} = useGalleryDialog()

const {
    pinboardCanvas, pinboardWrapper, edgeHit, initPinboard, onPinPointerDown
} = useGalleryPinboard(data)

// Local state for actions
const saving = ref(false)
const deleting = ref(false)
const uploading = ref(false)

const galleryPinboardRef = ref<{ pinboardCanvas: HTMLElement, pinboardWrapper: HTMLElement } | null>(null)

const handlePointerDown = (e: PointerEvent, item: GalleryItem) => {
    onPinPointerDown(e, item)
}

watch(activeTab, (tab) => {
    if (tab === 'pinboard') {
        nextTick(() => {
            if (galleryPinboardRef.value) {
                pinboardCanvas.value = galleryPinboardRef.value.pinboardCanvas
                pinboardWrapper.value = galleryPinboardRef.value.pinboardWrapper
            }
            initPinboard()
        })
    }
})

const generateInitialPosition = (existing: GalleryItem[], canvasWidth = 8000, canvasHeight = 4500) => {
    const centerX = canvasWidth / 2
    const centerY = canvasHeight / 2

    const radius = 350
    const minDistance = 140

    for (let i = 0; i < 50; i++) {
        const x = Math.round(centerX + (Math.random() - 0.5) * radius * 2)
        const y = Math.round(centerY + (Math.random() - 0.5) * radius * 2)

        const isTooClose = existing.some(item => {
            const dx = item.x - x
            const dy = item.y - y
            return Math.sqrt(dx * dx + dy * dy) < minDistance
        })

        if (!isTooClose) return { x, y }
    }

    for (let i = 1; i <= 100; i++) {
        const angle = i * Math.PI * 0.5
        const spiralRadius = radius + (i * 10)
        const x = Math.round(centerX + Math.cos(angle) * spiralRadius)
        const y = Math.round(centerY + Math.sin(angle) * spiralRadius)

        const isTooClose = existing.some(item => {
            const dx = item.x - x
            const dy = item.y - y
            return Math.sqrt(dx * dx + dy * dy) < minDistance
        })

        if (!isTooClose) return { x, y }
    }

    return {
        x: centerX + Math.random() * 200 - 100,
        y: centerY + Math.random() * 200 - 100
    }
}

const handleSave = async () => {
    try {
        saving.value = true
        let imageUrl = form.value.image_url
        let oldImageUrl: string | null = null

        if (isEditing.value && editId.value) {
            const originalItem = data.value.find(item => item.id === editId.value)
            oldImageUrl = originalItem?.image_url || null
        }

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
            await update(editId.value, { title: form.value.title, description: form.value.description, image_url: imageUrl })
            showNotification('success', 'Foto berhasil diperbarui')
            if (oldImageUrl && oldImageUrl !== imageUrl) {
                await deleteImage(oldImageUrl)
            }
        } else {
            const pos = generateInitialPosition(data.value)
            await insert({
                title: form.value.title,
                description: form.value.description,
                image_url: imageUrl,
                x: pos.x,
                y: pos.y,
                rotation: Math.random() * 6 - 3
            })
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

onMounted(() => {
    fetchAll();
})
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

        <GalleryHeader @add="openCreate" />

        <GalleryTabs v-model="activeTab" />

        <GalleryGrid v-if="activeTab === 'grid'" :data="data" :loading="loading" @edit="openEdit"
            @delete="openDelete" />

        <GalleryPinboard v-show="activeTab === 'pinboard'" ref="galleryPinboardRef" :data="data" :edge-hit="edgeHit"
            @pointerdown="handlePointerDown" />

        <GalleryFormDialog v-model="dialogOpen" :is-editing="isEditing" :saving="saving" :uploading="uploading"
            :form="form" @save="handleSave" @file-selected="onFileSelected" />

        <GalleryDeleteDialog v-model="confirmOpen" :deleting="deleting" @confirm="handleDelete" />
    </div>
</template>

<style scoped>
.notification-enter-active {
    animation: slideIn 0.3s ease;
}

.notification-leave-active {
    animation: slideIn 0.3s ease reverse;
}

@keyframes slideIn {
    from {
        transform: translateX(100%);
        opacity: 0;
    }

    to {
        transform: translateX(0);
        opacity: 1;
    }
}
</style>
