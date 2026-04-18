import type { SupabaseClient } from '@supabase/supabase-js'

export default defineNuxtRouteMiddleware(async (to, from) => {
    const nuxtApp = useNuxtApp()
    const supabase = nuxtApp.$supabase as SupabaseClient


    const {
        data: { session }
    } = await supabase.auth.getSession()

    if (!session) {
        return navigateTo('/admin/login')
    }
})