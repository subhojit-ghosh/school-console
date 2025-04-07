import {
  bigint,
  int,
  mysqlTable,
  serial,
  timestamp,
} from 'drizzle-orm/mysql-core';
import { academicYearsTable } from './academic-year.schema';
import { studentsTable } from './student.schema';
import { transportFeesTable } from './transport-fees.schema';

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
  month: int().notNull(),
  createdAt: timestamp().defaultNow().notNull(),
  updatedAt: timestamp().onUpdateNow(),
});
