import {
  index,
  integer,
  pgTable,
  timestamp,
  unique,
  varchar,
} from 'drizzle-orm/pg-core';

export const studentsTable = pgTable(
  'students',
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    regNo: varchar({ length: 255 }).notNull(),
    regYear: varchar({ length: 255 }).notNull(),
    name: varchar({ length: 255 }).notNull(),
    fatherName: varchar({ length: 255 }).notNull(),
    createdAt: timestamp().defaultNow().notNull(),
    updatedAt: timestamp(),
  },
  (table) => [
    // Single indexes
    index('reg_no_idx').on(table.regNo),
    index('name_idx').on(table.name),

    // Composite indexes

    // Unique indexes
    unique('reg_no_unique_idx').on(table.regNo),
  ]
);
