import Elysia, { t } from 'elysia'
import { db } from '../../db'
import { tokens } from '@/db/schema'
import { v4 as uuidv4 } from 'uuid'
import { resend } from '@/config/resend.config'
import ResetPasswordEmail from '@/lib/mail/templates/reset-password-email'

export const sendPasswordRecoveryEmail = new Elysia().post(
    '/recovery/send-recovery-password-email',
    async ({ body }) => {
        const { email } = body

        const user = await db.query.users.findFirst({
            where(fields, { eq }) {
                return eq(fields.email, email)
            },
        })

        if (!user) {
            throw new Error('User not exists!')
        }

        const resetPasswordToken = await db.query.tokens.findFirst({
            where(fields, { eq }) {
                return eq(fields.userId, user.id)
            },
        })

        if (resetPasswordToken) {
            await resend.emails.send({
                from: 'MembersClub <noreply@spacelinkbrasil.com.br>',
                to: email,
                subject: 'Recuperação de senha',
                react: ResetPasswordEmail({
                    username: user.name,
                    link: `${process.env.BASE_URL}/auth/reset-password/${resetPasswordToken.code}`,
                }),
            })

            return {
                code: 200,
                message: 'Recovery token already exists!',
            }
        }

        const tokenCode = uuidv4()

        const [createResetToken] = await db
            .insert(tokens)
            .values({
                code: tokenCode,
                tokenType: 'reset_password',
                userId: user.id,
            })
            .returning({
                code: tokens.code,
            })

        await resend.emails.send({
            from: 'MembersClub <noreply@spacelinkbrasil.com.br>',
            to: email,
            subject: 'Recuperação de senha',
            react: ResetPasswordEmail({
                username: user.name,
                link: `${process.env.BASE_URL}/auth/reset-password/${tokenCode}`,
            }),
        })

        console.log(`Token created successfully: ${createResetToken.code}`)
    },
    {
        body: t.Object({
            email: t.String(),
        }),
    }
)
