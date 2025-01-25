import Elysia, { t } from 'elysia'
import { db } from '../../db'
import dayjs from 'dayjs'
import { auth } from '../auth'
import { tokens } from '../../db/schema'
import { eq } from 'drizzle-orm'

export const authenticateFromLink = new Elysia().use(auth).get(
    '/auth/link',
    async ({ query, jwt: { sign }, cookie: { authToken }, redirect }) => {
        const { code, redirectLink } = query

        const authLinkFromCode = await db.query.tokens.findFirst({
            where(fields, { eq }) {
                return eq(fields.code, code)
            },
        })

        if (!authLinkFromCode) {
            throw new Error('Token not found')
        }

        const daysSince = dayjs().diff(authLinkFromCode.createdAt, 'days')

        if (daysSince > 7) {
            throw new Error('Token expired')
        }

        const user = await db.query.users.findFirst({
            where(fields, { eq }) {
                return eq(fields.id, authLinkFromCode.userId)
            },
        })

        if (!user) {
            throw new Error('User not found')
        }

        const token = await sign({
            sub: user?.id,
            role: user?.role,
        })

        authToken.value = token
        authToken.httpOnly = true
        authToken.maxAge = 60 * 60 * 24 * 7
        authToken.path = '/'

        await db.delete(tokens).where(eq(tokens.code, code))

        return redirect(redirectLink)
    },
    {
        query: t.Object({
            code: t.String(),
            redirectLink: t.String(),
        }),
    }
)
