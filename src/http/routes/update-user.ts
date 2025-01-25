import { db } from '@/db'
import { users } from '@/db/schema'
import { eq } from 'drizzle-orm'
import Elysia, { t } from 'elysia'

export const updateUser = new Elysia().put(
    '/users/edit/:id',
    async ({ params, body }) => {
        const { id: userId } = params
        const { name, email, phone, document } = body

        const user = await db
            .update(users)
            .set({
                name,
                email,
                phone,
                document,
            })
            .where(eq(users.id, userId))

        return user
    },
    {
        params: t.Object({
            id: t.String(),
        }),
        body: t.Object({
            name: t.Optional(t.String()),
            email: t.Optional(t.String()),
            phone: t.Optional(t.String()),
            document: t.Optional(t.String()),
        }),
    }
)
