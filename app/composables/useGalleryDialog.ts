import { ref } from 'vue'
import type { GalleryItem } from '~/services/galleryService'

export const useGalleryDialog = () => {
    const dialogOpen = ref(false)
    const isEditing = ref(false)
    const confirmOpen = ref(false)
    const deleteTarget = ref<GalleryItem | null>(null)
    const form = ref({ title: '', description: '', image_url: '' })
    const editId = ref<string | null>(null)
    const selectedFile = ref<File | null>(null)

    const openCreate = () => {
        isEditing.value = false
        editId.value = null
        form.value = { title: '', description: '', image_url: '' }
        selectedFile.value = null
        dialogOpen.value = true
    }

    const openEdit = (item: GalleryItem) => {
        isEditing.value = true
        editId.value = item.id
        form.value = { title: item.title, description: item.description || '', image_url: item.image_url }
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

    return {
        dialogOpen,
        isEditing,
        confirmOpen,
        deleteTarget,
        form,
        editId,
        selectedFile,
        openCreate,
        openEdit,
        openDelete,
        onFileSelected
    }
}
