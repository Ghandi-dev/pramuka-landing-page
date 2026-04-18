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
        const fileExt = file.name.split('.').pop()
        const fileName = `members/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`

        const { error: uploadError } = await supabase.storage
            .from('gallery')
            .upload(fileName, file)

        if (uploadError) throw uploadError

        const { data } = supabase.storage
            .from('gallery')
            .getPublicUrl(fileName)

        return data.publicUrl
    }

    return {
        ...crud,
        fetchAllOrdered,
        reorder,
        uploadPhoto,
    }
}
