import useSupabaseCrud from '~/composables/useSupabaseCrud'
import { useImageService } from './imageService'

export interface Activity {
    id: string
    title: string
    description: string | null
    activity_date: string
    location: string | null
    cover_image: string
    created_at: string
}

export function useActivityService() {
    const crud = useSupabaseCrud<Activity>('activities')
    const { uploadImage, deleteImage } = useImageService()

    const removeActivity = async (id: string, imageUrl?: string | null) => {
        if (imageUrl) {
            await deleteImage(imageUrl)
        }
        return await crud.remove(id)
    }

    return {
        ...crud,
        remove: removeActivity,
        uploadImage,
        deleteImage,
    }
}
