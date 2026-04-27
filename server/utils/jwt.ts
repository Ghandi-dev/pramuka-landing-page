import jwt, { type SignOptions } from 'jsonwebtoken'

export const signToken = (payload: object, expiresIn: SignOptions['expiresIn'] = '1d') => {
    const config = useRuntimeConfig()
    return jwt.sign(payload, config.jwtSecret, { expiresIn })
}

export const verifyToken = (token: string) => {
    const config = useRuntimeConfig()
    return jwt.verify(token, config.jwtSecret)
}
