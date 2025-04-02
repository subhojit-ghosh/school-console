import {
  bigint,
  int,
  mysqlTable,
  serial,
  timestamp,
} from 'drizzle-orm/mysql-core';
import { academicYearsTable } from './academic-year.schema';

export const transportTable = mysqlTable('transport', {
  id: serial().primaryKey(),
  academicYearId: bigint({
    mode: 'number',
    unsigned: true,
  })
    .notNull()
    .references(() => academicYearsTable.id),
  baseAmount: bigint({ mode: 'number' }),
  perKmCharge: bigint({ mode: 'number' }),

  createdAt: timestamp().defaultNow().notNull(),
  updatedAt: timestamp().onUpdateNow(),
});
