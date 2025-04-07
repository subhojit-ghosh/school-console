import {
  bigint,
  int,
  mysqlTable,
  serial,
  timestamp,
} from 'drizzle-orm/mysql-core';
import { academicYearsTable } from './academic-year.schema';
import { usersTable } from './user.schema';

export const transportTable = mysqlTable('transport', {
  id: serial().primaryKey(),
  academicYearId: bigint({
    mode: 'number',
    unsigned: true,
  })
    .notNull()
    .references(() => academicYearsTable.id),
  userId: bigint({ mode: 'number', unsigned: true }).references(
    () => usersTable.id
  ),
  baseAmount: bigint({ mode: 'number' }),
  perKmCharge: bigint({ mode: 'number' }),

  createdAt: timestamp().defaultNow().notNull(),
  updatedAt: timestamp().onUpdateNow(),
});
