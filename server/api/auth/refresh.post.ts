import { signToken } from "~~/server/utils/jwt"
import { useSupabaseAdmin } from "~~/server/utils/supabaseAdmin"

export default defineEventHandler(async (event) => {
    const refreshToken = getCookie(event, 'refresh_token')

    if (!refreshToken) {
        throw createError({
            statusCode: 401,
            statusMessage: 'Refresh token tidak ditemukan'
        })
    }

    const supabase = useSupabaseAdmin()

    // 1. Check token in database
    const { data: tokenData, error: tokenError } = await supabase
        .from('refresh_tokens')
        .select('user_id, expires_at')
        .eq('token', refreshToken)
        .single()

    if (tokenError || !tokenData) {
        throw createError({
            statusCode: 401,
            statusMessage: 'Refresh token tidak valid'
        })
    }

    // 2. Check expiration
    if (new Date(tokenData.expires_at) < new Date()) {
        await supabase.from('refresh_tokens').delete().eq('token', refreshToken)
        throw createError({
            statusCode: 401,
            statusMessage: 'Refresh token kedaluwarsa'
        })
    }

    // 3. Get user profile for payload
    const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', tokenData.user_id)
        .single()

    if (profileError || !profile) {
        throw createError({
            statusCode: 401,
            statusMessage: 'User tidak ditemukan'
        })
    }

    // 4. Issue new access token
    const accessToken = signToken({
        id: tokenData.user_id,
        role: profile.role
    }, '1h')

    return {
        token: accessToken
    }
})
