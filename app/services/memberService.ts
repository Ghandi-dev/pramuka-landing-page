import type { SupabaseClient } from '@supabase/supabase-js'
import useSupabaseCrud from '~/composables/useSupabaseCrud'

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

    const uploadPhoto = async (file: File): Promise<string> => {
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

    return {
        ...crud,
        fetchAllOrdered,
        reorder,
        uploadPhoto,
    }
}
