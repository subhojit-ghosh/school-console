import {
  boolean,
  index,
  integer,
  pgEnum,
  pgTable,
  timestamp,
  unique,
  varchar,
} from 'drizzle-orm/pg-core';

export const userRoleEnum = pgEnum('userRole', ['admin', 'staff']);

export const usersTable = pgTable(
  'users',
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    name: varchar({ length: 255 }).notNull(),
    username: varchar({ length: 255 }).notNull(),
    password: varchar({ length: 255 }).notNull(),
    role: userRoleEnum().notNull(),
    isActive: boolean().notNull().default(false),
    createdAt: timestamp().defaultNow().notNull(),
    updatedAt: timestamp(),
  },
  (table) => [
    // Single indexes

    // Composite indexes
    index('username_is_active_idx').on(table.username, table.isActive),

    // Unique indexes
    unique('username_unique_idx').on(table.username),
  ]
);
