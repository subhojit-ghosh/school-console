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
import { transactionTable } from './transaction.schema';
import { studentsTable } from './student.schema';

export const transportFeesTable = mysqlTable('transport-fees', {
  id: serial().primaryKey(),
  studentId: bigint({
    mode: 'number',
    unsigned: true,
  })
    .notNull()
    .references(() => studentsTable.id),

  academicYearId: bigint({
    mode: 'number',
    unsigned: true,
  })
    .notNull()
    .references(() => academicYearsTable.id),

  baseAmount: bigint({ mode: 'number' }),
  perKmCharge: bigint({ mode: 'number' }),
  amount: bigint({
    mode: 'number',
    unsigned: true,
  }),

  mode: varchar({
    length: 255,
  }),
  note: text(),

  createdAt: timestamp().defaultNow().notNull(),
  updatedAt: timestamp().onUpdateNow(),
});
