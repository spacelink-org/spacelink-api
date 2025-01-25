import Elysia, { t } from 'elysia'
import { db } from '../../db'
import { tokens } from '../../db/schema'
import { createId } from '@paralleldrive/cuid2'
import { env } from '../../env'

export const sendAuthLink = new Elysia().post(
    'auth/send-link',
    async ({ body }) => {
        const { email } = body

        const user = await db.query.users.findFirst({
            where(fields, { eq }) {
                return eq(fields.email, email)
            },
        })

        if (!user) {
            throw new Error('User not found')
        }

        const token = createId()

        await db.insert(tokens).values({
            code: token,
            userId: user.id,
        })

        const authLink = new URL('auth/link', env.BASE_URL)

        authLink.searchParams.set('code', token)
        authLink.searchParams.set('redirectLink', env.REDIRECT_URL)

        console.log(authLink.toString())
    },
    {
        body: t.Object({
            email: t.String({ format: 'email' }),
        }),
    }
)
