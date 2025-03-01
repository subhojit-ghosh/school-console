import {
  json,
  mysqlTable,
  serial,
  timestamp,
  varchar,
} from 'drizzle-orm/mysql-core';

export const classesTable = mysqlTable('classes', {
  id: serial().primaryKey(),
  name: varchar({ length: 100 }).notNull(),
  sections: json().notNull(),
  createdAt: timestamp().defaultNow().notNull(),
  updatedAt: timestamp().onUpdateNow(),
});
