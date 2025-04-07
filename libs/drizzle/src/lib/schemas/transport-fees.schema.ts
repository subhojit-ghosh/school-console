import {
  bigint,
  int,
  mysqlTable,
  serial,
  text,
  timestamp,
  varchar,
} from 'drizzle-orm/mysql-core';
import { academicYearsTable } from './academic-year.schema';
import { studentsTable } from './student.schema';
import { usersTable } from './user.schema';

export const transportFeesTable = mysqlTable('transport-fees', {
  id: serial().primaryKey(),
  academicYearId: bigint({
    mode: 'number',
    unsigned: true,
  })
    .notNull()
    .references(() => academicYearsTable.id),
  studentId: bigint({
    mode: 'number',
    unsigned: true,
  })
    .notNull()
    .references(() => studentsTable.id),
  userId: bigint({ mode: 'number', unsigned: true }).references(
    () => usersTable.id
  ),
  baseAmount: int().notNull(),
  perKmCharge: int().notNull(),
  amount: int().notNull(),
  payableAmount: int().default(0),
  mode: varchar({
    length: 255,
  }).notNull(),
  note: text(),
  createdAt: timestamp().defaultNow().notNull(),
  updatedAt: timestamp().onUpdateNow(),
});
