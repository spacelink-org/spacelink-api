import Elysia, { t } from 'elysia'
import { db } from '@/db'
import { customers, tokens, users } from '@/db/schema'
import { createId } from '@paralleldrive/cuid2'
import * as bcrypt from 'bcrypt'
import { auth } from '../auth'
import { resend } from '@/config/resend.config'
import { InvitationEmail } from '@/lib/mail/templates/invitation-email'
import { eq } from 'drizzle-orm'

export const createCustomer = new Elysia().use(auth).post(
    '/customers/create',
    async ({ body, getCurrentUser }) => {
        const { name, email, phone, password, document } = body
        const { sub: userId } = await getCurrentUser()

        const invitedByUser = await db.query.users.findFirst({
            where: eq(users.id, userId),
        })

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
                    status: 'confirm_pending',
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

            await resend.emails.send({
                from: 'MembersClub <noreply@spacelinkbrasil.com.br>',
                to: email,
                subject: 'Bem vindo ao MembersClub!',
                react: InvitationEmail({
                    username: name,
                    inviteLink: `${process.env.BASE_URL}/?token=${token}`,
                    invitedByUsername: invitedByUser?.name,
                }),
            })
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
