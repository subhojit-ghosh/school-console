import {
  bigint,
  int,
  mysqlTable,
  serial,
  text,
  timestamp,
  varchar,
} from 'drizzle-orm/mysql-core';
import { transportFeesTable } from './transport-fees.schema';
import { studentsTable } from './student.schema';
import { academicYearsTable } from './academic-year.schema';

export const transportFeeItemsTable = mysqlTable('transport-fee-items', {
  id: serial().primaryKey(),

  transportFeeId: bigint({
    mode: 'number',
    unsigned: true,
  })
    .notNull()
    .references(() => transportFeesTable.id),

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

  month: bigint({
    mode: 'number',
  }),

  createdAt: timestamp().defaultNow().notNull(),
  updatedAt: timestamp().onUpdateNow(),
});
