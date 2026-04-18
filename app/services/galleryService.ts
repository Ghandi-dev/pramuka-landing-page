import type { SupabaseClient } from '@supabase/supabase-js'
import useSupabaseCrud from '~/composables/useSupabaseCrud'

export interface GalleryItem {
    id: string
    title: string
    image_url: string
    x: number
    y: number
    created_at: string
}

export function useGalleryService() {
    const nuxtApp = useNuxtApp()
    const supabase = nuxtApp.$supabase as SupabaseClient
    const crud = useSupabaseCrud<GalleryItem>('galleries')

    const uploadImage = async (file: File): Promise<string> => {
        const fileExt = file.name.split('.').pop()
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
        const filePath = `${fileName}`

        const { error: uploadError } = await supabase.storage
            .from('gallery')
            .upload(filePath, file)

        if (uploadError) throw uploadError

        const { data } = supabase.storage
            .from('gallery')
            .getPublicUrl(filePath)

        return data.publicUrl
    }

    const updatePosition = async (id: string, x: number, y: number) => {
        const { error: err } = await supabase
            .from('galleries')
            .update({ x, y })
            .eq('id', id)

        if (err) throw err
    }

    const deleteImage = async (imageUrl: string) => {
        // Extract file path from URL
        const parts = imageUrl.split('/gallery/')
        if (parts.length > 1) {
            await supabase.storage.from('gallery').remove([parts[1]!])
        }
    }

    return {
        ...crud,
        uploadImage,
        updatePosition,
        deleteImage,
    }
}
