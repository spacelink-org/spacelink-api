import jwt from '@elysiajs/jwt'
import Elysia, { Static, t } from 'elysia'
import { env } from '../env'
import { UnauthorizedError } from './errors/unauthorized-error'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const jwtPayloadSchema = t.Object({
    sub: t.String(),
    role: t.String(),
})

export const auth = new Elysia()
    .error({
        UNAUTHORIZED: UnauthorizedError,
    })
    .onError(({ code, error, set }) => {
        switch (code) {
            case 'UNAUTHORIZED':
                set.status = 401
                return { code, message: error.message }
        }
    })
    .use(
        jwt({
            name: 'jwt',
            secret: env.JWT_SECRET_KEY,
            schema: t.Object({
                sub: t.String(),
                role: t.String(),
            }),
        })
    )
    .derive({ as: 'scoped' }, ({ jwt, cookie: { authToken } }) => {
        return {
            getCurrentUser: async () => {
                const token = authToken.value

                if (!token) {
                    throw new Error('deu ruim ai')
                }

                const payload = await jwt.verify(token)

                return payload
            },
            signUser: async (payload: Static<typeof jwtPayloadSchema>) => {
                authToken.value = await jwt.sign(payload)
                authToken.httpOnly = true
                authToken.maxAge = 60 * 60 * 24 * 7
                authToken.path = '/'
                authToken.domain = env.DOMAIN
                console.log('Cookie configured:', authToken.value)
            },
            signOut: () => {
                authToken.remove()
            },
        }
    })
