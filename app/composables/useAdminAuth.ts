import type { SupabaseClient } from '@supabase/supabase-js'
import type { Profiles } from '~/services/userService'

export const useAdminAuth = () => {
    const profile = useState<Profiles | null>('admin-profile', () => null)
    const loading = useState<boolean>('admin-profile-loading', () => false)

    const fetchProfile = async () => {
        // Only fetch if not already loaded or explicit refresh
        const nuxtApp = useNuxtApp()
        const supabase = nuxtApp.$supabase as SupabaseClient
        
        loading.value = true
        try {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) throw new Error('No user session found')

            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', user.id)
                .single()

            if (error) throw error
            profile.value = data as Profiles
            return data as Profiles
        } catch (e) {
            profile.value = null
            return null
        } finally {
            loading.value = false;
        }
    }

    const clearProfile = () => {
        profile.value = null
    }

    return {
        profile,
        loading,
        fetchProfile,
        clearProfile
    }
}
