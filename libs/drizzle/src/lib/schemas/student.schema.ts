import { index, mysqlTable, timestamp, varchar } from 'drizzle-orm/mysql-core';

export const studentsTable = mysqlTable(
  'students',
  {
    id: varchar({ length: 100 }).primaryKey(),
    name: varchar({ length: 100 }).notNull(),
    fatherName: varchar({ length: 100 }).notNull(),
    createdAt: timestamp().defaultNow().notNull(),
    updatedAt: timestamp().onUpdateNow(),
  },
  (table) => [index('id_idx').on(table.id), index('name_idx').on(table.name)]
);
