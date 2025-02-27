import {
  boolean,
  char,
  index,
  int,
  mysqlEnum,
  mysqlTable,
  timestamp,
  varchar,
} from 'drizzle-orm/mysql-core';

export const usersTable = mysqlTable(
  'users',
  {
    id: int().primaryKey().autoincrement(),
    name: varchar({ length: 100 }).notNull(),
    username: varchar({ length: 100 }).notNull().unique(),
    password: char({ length: 60 }).notNull(),
    role: mysqlEnum(['admin', 'staff']).notNull(),
    isActive: boolean().notNull().default(false),
    createdAt: timestamp().defaultNow().notNull(),
    updatedAt: timestamp(),
  },
  (table) => [
    index('username_is_active_idx').on(table.username, table.isActive),
  ]
);
