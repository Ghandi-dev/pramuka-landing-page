import { ref } from 'vue'

export const useGalleryNotifications = () => {
    const notification = ref<{ type: 'success' | 'error'; message: string } | null>(null)

    const showNotification = (type: 'success' | 'error', message: string) => {
        notification.value = { type, message }
        setTimeout(() => { notification.value = null }, 3000)
    }

    return {
        notification,
        showNotification
    }
}
