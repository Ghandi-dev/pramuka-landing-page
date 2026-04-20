import type { SupabaseClient } from '@supabase/supabase-js'
import useSupabaseCrud from '~/composables/useSupabaseCrud'

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

    const uploadImage = async (file: File): Promise<string> => {
        const formData = new FormData()
        formData.append('file', file)

        const response = await fetch('/api/upload', {
            method: 'POST',
            body: formData,
        })

        const data = await response.json()

        if (!response.ok) {
            throw new Error(data.statusMessage || data.message || 'Failed to upload image')
        }

        return data.url
    }

    const updatePosition = async (id: string, x: number, y: number) => {
        const { error: err } = await supabase
            .from('galleries')
            .update({ x, y })
            .eq('id', id)

        if (err) throw err
    }

    const deleteImage = async (imageUrl: string) => {
        // Client-side deletion from Cloudinary is not supported via unsigned uploads.
        // It requires an API secret, so we leave the image object orphaned in Cloudinary.
        console.warn('Image deletion from Cloudinary is skipped because it requires a secure server endpoint.')
    }

    return {
        ...crud,
        uploadImage,
        updatePosition,
        deleteImage,
    }
}
