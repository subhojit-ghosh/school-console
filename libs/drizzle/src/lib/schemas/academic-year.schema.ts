import {
  boolean,
  date,
  int,
  mysqlTable,
  serial,
  timestamp,
  varchar,
} from 'drizzle-orm/mysql-core';

export const academicYearsTable = mysqlTable('academic_years', {
  id: serial().primaryKey(),
  name: varchar({ length: 100 }).notNull(),
  startDate: date().notNull(),
  endDate: date().notNull(),
  studentIdPrefix: varchar({ length: 100 }).unique().notNull(),
  lateFinePerDay: int().notNull().default(0),
  isActive: boolean().notNull().default(false).notNull(),
  createdAt: timestamp().defaultNow().notNull(),
  updatedAt: timestamp().onUpdateNow(),
});
