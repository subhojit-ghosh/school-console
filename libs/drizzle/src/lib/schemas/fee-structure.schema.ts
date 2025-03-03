import {
  bigint,
  mysqlTable,
  serial,
  timestamp,
  varchar,
} from 'drizzle-orm/mysql-core';
import { academicYearsTable } from './academic-year.schema';
import { classesTable } from './class.schema';

export const feeStructuresTable = mysqlTable('fee_structures', {
  id: serial().primaryKey(),
  academicYearId: bigint({ mode: 'number', unsigned: true })
    .notNull()
    .references(() => academicYearsTable.id),
  classId: bigint({ mode: 'number', unsigned: true })
    .notNull()
    .references(() => classesTable.id),
  name: varchar({ length: 100 }).notNull(),
  createdAt: timestamp().defaultNow().notNull(),
  updatedAt: timestamp().onUpdateNow(),
});
