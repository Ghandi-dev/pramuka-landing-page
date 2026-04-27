import type { SupabaseClient } from '@supabase/supabase-js'
import useSupabaseCrud from '~/composables/useSupabaseCrud'
import { useImageService } from './imageService'

export interface OrganizationMember {
    id: string
    name: string
    position: string
    photo: string | null
    order_number: number
}

export function useMemberService() {
    const nuxtApp = useNuxtApp()
    const supabase = nuxtApp.$supabase as SupabaseClient
    const crud = useSupabaseCrud<OrganizationMember>('organization_members')
    const { uploadImage, deleteImage } = useImageService()

    const fetchAllOrdered = async () => {
        crud.loading.value = true
        crud.error.value = null
        try {
            const { data: result, error: err } = await supabase
                .from('organization_members')
                .select('*')
                .order('order_number', { ascending: true })

            if (err) throw err
            crud.data.value = (result as OrganizationMember[]) ?? []
        } catch (e: any) {
            crud.error.value = e.message || 'Failed to fetch members'
        } finally {
            crud.loading.value = false
        }
    }

    const reorder = async (items: { id: string; order_number: number }[]) => {
        const promises = items.map((item) =>
            supabase
                .from('organization_members')
                .update({ order_number: item.order_number })
                .eq('id', item.id)
        )
        const results = await Promise.all(promises)
        const failed = results.find((r) => r.error)
        if (failed?.error) throw failed.error
    }

    const removeMember = async (id: string, photoUrl?: string | null) => {
        return await crud.remove(id, photoUrl)
    }

    return {
        ...crud,
        remove: removeMember,
        fetchAllOrdered,
        reorder,
        uploadPhoto: uploadImage,
        deleteImage,
    }
}
