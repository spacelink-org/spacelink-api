import { db } from '@/db'
import { users } from '@/db/schema'
import { eq } from 'drizzle-orm'
import Elysia, { t } from 'elysia'

export const deleteUser = new Elysia().post(
    '/users/delete/:id',
    async ({ body }) => {
        const { id: userId } = body

        const user = await db.delete(users).where(eq(users.id, userId))

        return user
    },
    {
        body: t.Object({
            id: t.String(),
        }),
    }
)
