import { pgEnum, pgTable, real, text, timestamp } from 'drizzle-orm/pg-core'
import { createId } from '@paralleldrive/cuid2'

export const roleEnum = pgEnum('user_role', [
    'administrator',
    'customer',
    'member',
])

export const statusEnum = pgEnum('user_status', [
    'confirm_pending',
    'payment_pending',
    'active',
    'blocked',
    'suspended',
])

export const users = pgTable('users', {
    id: text('id')
        .$defaultFn(() => createId())
        .primaryKey(),
    name: text('name').notNull(),
    email: text('email').notNull().unique(),
    document: text('document').notNull().unique(),
    password: text('password').notNull(),
    phone: text('phone'),
    role: roleEnum('role').default('customer').notNull(),
    status: statusEnum('status').default('confirm_pending').notNull(),
    wallet: real('wallet').default(0).notNull(),
    memberId: text('member_id'),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
})
