import { db } from '@/db'
import { customers, users } from '@/db/schema'
import { eq } from 'drizzle-orm'
import Elysia, { t } from 'elysia'

export const deleteUser = new Elysia().post(
    '/users/delete/:id',
    async ({ body }) => {
        const { id: userId } = body

        await db.delete(users).where(eq(users.id, userId))

        await db.delete(customers).where(eq(customers.userId, userId))

        return {
            status: 200,
            message: 'User deleted successfully',
        }
    },
    {
        body: t.Object({
            id: t.String(),
        }),
    }
)
