import { ref } from 'vue'
import { toast } from 'vue-sonner'

interface BaseItem {
    id: string;
    [key: string]: any;
}

interface CrudService<T> {
    data: Ref<T[]>;
    loading: Ref<boolean>;
    fetchAll: () => Promise<void>;
    insert: (item: any) => Promise<any>;
    update: (id: string, item: any, oldImageUrl?: string | null) => Promise<any>;
    remove: (id: string, imageUrl?: string | null) => Promise<any>;
    uploadImage?: (file: File) => Promise<string>;
    [key: string]: any;
}

export function useAdminPage<T extends BaseItem>(
    service: CrudService<T>,
    options: {
        itemName: string,
        imageField?: string,
        onSuccess?: () => void,
        defaultForm?: any
    }
) {
    const dialogOpen = ref(false)
    const isEditing = ref(false)
    const confirmOpen = ref(false)
    const deleteTarget = ref<T | null>(null)
    const saving = ref(false)
    const deleting = ref(false)
    const uploading = ref(false)
    
    const editId = ref<string | null>(null)
    const form = ref({ ...(options.defaultForm || {}) })
    const selectedFile = ref<File | null>(null)

    const openCreate = () => {
        isEditing.value = false
        editId.value = null
        selectedFile.value = null
        form.value = { ...(options.defaultForm || {}) }
        dialogOpen.value = true
    }

    const openEdit = (item: T) => {
        isEditing.value = true
        editId.value = item.id
        selectedFile.value = null
        form.value = { ...item }
        dialogOpen.value = true
    }

    const openDelete = (item: T) => {
        deleteTarget.value = item
        confirmOpen.value = true
    }

    const onFileSelected = (file: File) => {
        selectedFile.value = file
    }

    const handleSave = async () => {
        saving.value = true
        try {
            let imageUrl = options.imageField ? form.value[options.imageField] : null
            let oldImageUrl: string | null = null

            if (isEditing.value && editId.value) {
                const original = service.data.value.find(i => i.id === editId.value)
                oldImageUrl = options.imageField ? original?.[options.imageField] : null
            }

            if (selectedFile.value && service.uploadImage) {
                uploading.value = true
                imageUrl = await service.uploadImage(selectedFile.value)
                if (options.imageField) {
                    form.value[options.imageField] = imageUrl
                }
                uploading.value = false
            }

            if (isEditing.value && editId.value) {
                await service.update(editId.value, form.value, oldImageUrl)
                toast.success(`${options.itemName} berhasil diperbarui`)
            } else {
                await service.insert(form.value)
                toast.success(`${options.itemName} berhasil ditambahkan`)
            }

            dialogOpen.value = false
            await service.fetchAll()
            if (options.onSuccess) options.onSuccess()
        } catch (e: any) {
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
            const imageUrl = options.imageField ? deleteTarget.value[options.imageField] : null
            await service.remove(deleteTarget.value.id, imageUrl)
            toast.success(`${options.itemName} berhasil dihapus`)
            confirmOpen.value = false
            await service.fetchAll()
        } catch (e: any) {
            toast.error(e.message || 'Gagal menghapus')
        } finally {
            deleting.value = false
        }
    }

    return {
        dialogOpen,
        isEditing,
        confirmOpen,
        deleteTarget,
        saving,
        deleting,
        uploading,
        form,
        editId,
        selectedFile,
        openCreate,
        openEdit,
        openDelete,
        onFileSelected,
        handleSave,
        handleDelete
    }
}
