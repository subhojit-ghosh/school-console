import {
  index,
  int,
  mysqlTable,
  timestamp,
  varchar,
} from 'drizzle-orm/mysql-core';

export const studentsTable = mysqlTable(
  'students',
  {
    id: int().primaryKey().autoincrement(),
    regNo: varchar({ length: 100 }).notNull().unique(),
    regYear: varchar({ length: 50 }).notNull(),
    name: varchar({ length: 100 }).notNull(),
    fatherName: varchar({ length: 100 }).notNull(),
    createdAt: timestamp().defaultNow().notNull(),
    updatedAt: timestamp().onUpdateNow(),
  },
  (table) => [
    index('reg_no_idx').on(table.regNo),
    index('name_idx').on(table.name),
  ]
);
