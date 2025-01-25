import Elysia, { t } from 'elysia'
import { db } from '../../db'
import { auth } from '../auth'
import * as bcrypt from 'bcrypt'

export const authenticateWithPassword = new Elysia().use(auth).post(
    '/auth/password',
    async ({ body, jwt, cookie: { authToken }, signUser }) => {
        const { email, password } = body

        const user = await db.query.users.findFirst({
            where(fields, { eq }) {
                return eq(fields.email, email)
            },
        })

        if (!user) {
            return {
                status: 404,
                message: 'User not found',
            }
        }

        const comparePasswords = await bcrypt.compare(password, user.password)

        if (!comparePasswords) {
            return {
                status: 401,
                message: 'Password incorrect!',
            }
        }

        const token = await jwt.sign({
            sub: user?.id,
            role: user?.role,
        })

        authToken.value = token
        authToken.httpOnly = true
        authToken.maxAge = 60 * 60 * 24 * 7
        authToken.path = '/'

        await signUser({
            sub: user.id,
            role: user.role,
        })

        return token
    },
    {
        body: t.Object({
            email: t.String({ format: 'email' }),
            password: t.String(),
            redirectLink: t.String(),
        }),
    }
)
