import type { SupabaseClient } from '@supabase/supabase-js'

export default function useSupabaseCrud<T extends Record<string, any>>(tableName: string) {
    const nuxtApp = useNuxtApp()
    const supabase = nuxtApp.$supabase as SupabaseClient

    const data = ref<T[]>([]) as Ref<T[]>
    const loading = ref(false)
    const error = ref<string | null>(null)

    const fetchAll = async (
        orderBy: string = 'created_at',
        ascending: boolean = false,
        limit?: number
    ) => {
        loading.value = true
        error.value = null

        try {
            let query = supabase
                .from(tableName)
                .select('*')
                .order(orderBy, { ascending })

            if (limit) {
                query = query.limit(limit)
            }

            const { data: result, error: err } = await query

            if (err) throw err

            data.value = (result as T[]) ?? []
        } catch (e: any) {
            error.value = e.message || 'Failed to fetch data'
        } finally {
            loading.value = false
        }
    }

    const fetchCount = async (): Promise<number> => {
        const { count, error: err } = await supabase
            .from(tableName)
            .select('*', { count: 'exact', head: true })

        if (err) throw err
        return count ?? 0
    }

    const insert = async (item: Partial<T>) => {
        loading.value = true
        error.value = null
        try {
            const { data: result, error: err } = await supabase
                .from(tableName)
                .insert(item as any)
                .select()
                .single()

            if (err) throw err
            return result as T
        } catch (e: any) {
            error.value = e.message || 'Failed to insert'
            throw e
        } finally {
            loading.value = false
        }
    }

    const update = async (id: string, item: Partial<T>) => {
        loading.value = true
        error.value = null
        try {
            const { data: result, error: err } = await supabase
                .from(tableName)
                .update(item as any)
                .eq('id', id)
                .select()
                .single()

            if (err) throw err
            return result as T
        } catch (e: any) {
            error.value = e.message || 'Failed to update'
            throw e
        } finally {
            loading.value = false
        }
    }

    const remove = async (id: string) => {
        loading.value = true
        error.value = null
        try {
            const { error: err } = await supabase
                .from(tableName)
                .delete()
                .eq('id', id)

            if (err) throw err
        } catch (e: any) {
            error.value = e.message || 'Failed to delete'
            throw e
        } finally {
            loading.value = false
        }
    }

    return {
        data,
        loading,
        error,
        fetchAll,
        fetchCount,
        insert,
        update,
        remove,
    }
}
