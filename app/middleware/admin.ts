import type { SupabaseClient } from '@supabase/supabase-js'

export default defineNuxtRouteMiddleware(async (to, from) => {
    // Skip on server side to avoid redirecting unhydrated state since Supabase uses localStorage
    if (import.meta.server) return

    // Allow access to login page without auth
    if (to.path === '/admin/login') return

    const nuxtApp = useNuxtApp()
    const supabase = nuxtApp.$supabase as SupabaseClient
    const { profile, fetchProfile } = useAdminAuth()

    const {
        data: { session }
    } = await supabase.auth.getSession()

    if (!session) {
        return navigateTo('/admin/login')
    }

    // Fetch profile if not already loaded
    if (!profile.value) {
        await fetchProfile()
    }
})