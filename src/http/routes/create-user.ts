import Elysia, { t } from 'elysia'
import { db } from '@/db'
import { customers, tokens, users } from '@/db/schema'
import { createId } from '@paralleldrive/cuid2'
import chalk from 'chalk'
import * as bcrypt from 'bcrypt'
import { auth } from '../auth'

export const createUser = new Elysia().use(auth).post(
    '/users/create',
    async ({ body, getCurrentUser }) => {
        const { name, email, phone, password, document } = body
        const { sub: userId } = await getCurrentUser()

        const createUserByEmail = db.transaction(async (tx) => {
            const hashedPassword = await bcrypt.hash(password, 12)

            const [user] = await tx
                .insert(users)
                .values({
                    name,
                    email,
                    phone,
                    document,
                    role: 'customer',
                    password: hashedPassword,
                    memberId: userId,
                })
                .returning({
                    id: users.id,
                })

            const token = createId()

            await tx.insert(tokens).values({
                code: token,
                userId: user.id,
                tokenType: 'register',
            })

            await tx.insert(customers).values({
                userId: user.id,
                customerStatus: 'pending_validation',
            })

            // TODO: add send email method later
            console.log(
                chalk.greenBright(`${process.env.BASE_URL}/?token=${token}`)
            )
        })

        return createUserByEmail
    },
    {
        body: t.Object({
            name: t.String(),
            email: t.String({ format: 'email' }),
            phone: t.String(),
            password: t.String(),
            document: t.String(),
        }),
    }
)
