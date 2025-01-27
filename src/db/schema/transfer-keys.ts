import { createId } from '@paralleldrive/cuid2'
import { pgEnum, pgTable, text, timestamp } from 'drizzle-orm/pg-core'
import { users } from './users'

export const transferKeyTypeEnum = pgEnum('transfer_key_type', [
    'pix',
    'bank_account',
])

export const transferKeys = pgTable('transfer_keys', {
    id: text('id')
        .$defaultFn(() => createId())
        .primaryKey(),
    key: text('key')
        .$defaultFn(() => createId())
        .unique(),
    userId: text('user_id').references(() => users.id, {
        onDelete: 'set null',
    }),
    type: transferKeyTypeEnum('type').default('pix').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
})
