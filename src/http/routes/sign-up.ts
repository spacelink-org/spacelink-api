import { db } from '@/db'
import { tokens, users } from '@/db/schema'
import Elysia, { t } from 'elysia'
import * as bcrypt from 'bcrypt'
import { createId } from '@paralleldrive/cuid2'
import { resend } from '@/config/resend.config'
import { ConfirmEmailTemplate } from '@/lib/mail/templates/email-confirmation'
import { env } from '@/env'

export const signUp = new Elysia().post(
    '/sign-up',
    async ({ body }) => {
        const { name, email, password, document, phone } = body

        const hashPassword = await bcrypt.hash(password, 12)

        const signUpTransaction = await db.transaction(async (tx) => {
            const [user] = await tx
                .insert(users)
                .values({
                    name,
                    email,
                    password: hashPassword,
                    document,
                    phone,
                    status: 'confirm_pending',
                })
                .returning({
                    id: users.id,
                    name: users.name,
                })

            const [token] = await tx
                .insert(tokens)
                .values({
                    code: createId(),
                    userId: user.id,
                    tokenType: 'register',
                })
                .returning({
                    code: tokens.code,
                })

            return resend.emails.send({
                from: 'Members Club <noreply@spacelinkbrasil.com.br>',
                to: email,
                subject: 'Bem vindo ao Members Club',
                react: ConfirmEmailTemplate({
                    username: user.name,
                    confirmLink: `${env.BASE_URL}${token.code}`,
                }),
            })
        })

        return signUpTransaction
    },
    {
        body: t.Object({
            name: t.String(),
            email: t.String(),
            password: t.String(),
            document: t.String(),
            phone: t.String(),
        }),
    }
)
