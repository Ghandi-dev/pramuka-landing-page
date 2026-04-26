import type { SupabaseClient } from '@supabase/supabase-js'
import useSupabaseCrud from '~/composables/useSupabaseCrud'
import { useImageService } from './imageService'

export interface GalleryItem {
    id: string
    title: string
    description: string
    image_url: string
    x: number
    y: number
    rotation: number
    created_at: string
}

export function useGalleryService() {
    const nuxtApp = useNuxtApp()
    const supabase = nuxtApp.$supabase as SupabaseClient
    const crud = useSupabaseCrud<GalleryItem>('galleries')
    const { uploadImage, deleteImage } = useImageService()

    const updatePosition = async (id: string, x: number, y: number) => {
        const { error: err } = await supabase
            .from('galleries')
            .update({ x, y })
            .eq('id', id)

        if (err) throw err
    }

    return {
        ...crud,
        uploadImage,
        updatePosition,
        deleteImage,
    }
}
