import { createClient } from '@supabase/supabase-js'

export const useSupabaseAdmin = () => {
    const config = useRuntimeConfig()
    
    if (!config.public.supabaseUrl || !config.supabaseServiceKey) {
        throw createError({
            statusCode: 500,
            statusMessage: 'Supabase configuration is missing.'
        })
    }

    return createClient(config.public.supabaseUrl, config.supabaseServiceKey, {
        auth: {
            autoRefreshToken: false,
            persistSession: false
        }
    })
}
