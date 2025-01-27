import { db } from '@/db'
import { transferKeys } from '@/db/schema'
import Elysia from 'elysia'
import { auth } from '../auth'
import { eq } from 'drizzle-orm'

export const getTransferKeys = new Elysia()
    .use(auth)
    .get('/transfers/keys', async ({ getCurrentUser }) => {
        const user = await getCurrentUser()

        if (!user) {
            return new Response('Unauthorized', { status: 401 })
        }

        const keys = await db.query.transferKeys.findMany({
            where: eq(transferKeys.userId, user.sub),
        })

        if (!keys) {
            return new Response('No keys found', { status: 404 })
        }

        return keys
    })
