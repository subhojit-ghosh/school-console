import {
  boolean,
  char,
  index,
  mysqlEnum,
  mysqlTable,
  serial,
  timestamp,
  varchar,
} from 'drizzle-orm/mysql-core';

export const usersTable = mysqlTable(
  'users',
  {
    id: serial().primaryKey(),
    name: varchar({ length: 100 }).notNull(),
    username: varchar({ length: 100 }).notNull().unique(),
    password: char({ length: 60 }).notNull(),
    role: mysqlEnum(['admin', 'staff']).notNull(),
    isActive: boolean().notNull().default(false).notNull(),
    createdAt: timestamp().defaultNow().notNull(),
    updatedAt: timestamp().onUpdateNow(),
  },
  (table) => [
    index('username_is_active_idx').on(table.username, table.isActive),
  ]
);
