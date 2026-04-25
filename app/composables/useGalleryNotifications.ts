import { toast } from 'vue-sonner'

export const useGalleryNotifications = () => {
    const showNotification = (type: 'success' | 'error', message: string) => {
        if (type === 'success') {
            toast.success(message)
        } else {
            toast.error(message)
        }
    }

    return {
        showNotification
    }
}
