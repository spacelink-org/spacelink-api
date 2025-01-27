import Elysia, { t } from 'elysia'
import { db } from '../../db'
import { auth } from '../auth'
import * as bcrypt from 'bcrypt'

export const signIn = new Elysia().use(auth).post(
    '/sign-in',
    async ({ body, jwt, cookie: { authToken }, signUser }) => {
        const { email, password } = body

        const user = await db.query.users.findFirst({
            where(fields, { eq }) {
                return eq(fields.email, email)
            },
        })

        if (!user) {
            throw new Error('User not found')
        }

        const comparePasswords = await bcrypt.compare(password, user.password)

        if (!comparePasswords) {
            throw new Error('Password incorrect!')
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

        return {
            status: 200,
            message: 'User authenticated successfully',
        }
    },
    {
        body: t.Object({
            email: t.String({ format: 'email' }),
            password: t.String(),
            redirectLink: t.String(),
        }),
    }
)
