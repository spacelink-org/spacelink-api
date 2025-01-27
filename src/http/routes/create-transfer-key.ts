import { db } from '@/db'
import { transferKeys } from '@/db/schema'
import Elysia, { t } from 'elysia'
import { auth } from '../auth'

export const createTransferKey = new Elysia().use(auth).post(
    '/transfers/keys/create',
    async ({ getCurrentUser, body }) => {
        const { key } = body
        const user = await getCurrentUser()

        if (!user) {
            return new Response('Unauthorized', { status: 401 })
        }

        await db.insert(transferKeys).values({
            userId: user.sub,
            key: key,
        })

        return {
            status: 200,
            message: 'Transfer key created successfully',
        }
    },
    {
        body: t.Object({
            key: t.String(),
        }),
    }
)
