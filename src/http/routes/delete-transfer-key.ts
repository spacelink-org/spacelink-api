import Elysia from 'elysia'
import { auth } from '../auth'
import { db } from '@/db'
import { transferKeys } from '@/db/schema'
import { eq } from 'drizzle-orm'

export const deleteTransferKey = new Elysia()
    .use(auth)
    .delete(
        '/transfers/keys/delete/:keyId',
        async ({ getCurrentUser, params }) => {
            const user = await getCurrentUser()

            if (!user) {
                return new Response('Unauthorized', { status: 401 })
            }

            const deletedKey = await db
                .delete(transferKeys)
                .where(eq(transferKeys.id, params.keyId))

            return deletedKey
        }
    )
