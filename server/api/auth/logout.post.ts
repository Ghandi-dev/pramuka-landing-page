import { useSupabaseAdmin } from "~~/server/utils/supabaseAdmin"

export default defineEventHandler(async (event) => {
    const refreshToken = getCookie(event, 'refresh_token')
    
    if (refreshToken) {
        const supabase = useSupabaseAdmin()
        // Delete token from DB
        await supabase.from('refresh_tokens').delete().eq('token', refreshToken)
    }

    // Clear cookies
    deleteCookie(event, 'refresh_token')
    deleteCookie(event, 'auth_token')
    
    return {
        message: 'Logout berhasil'
    }
})
