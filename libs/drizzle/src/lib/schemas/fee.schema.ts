import { FeeCategory } from '@school-console/utils';
import {
  bigint,
  date,
  int,
  mysqlEnum,
  mysqlTable,
  serial,
  timestamp,
  varchar,
} from 'drizzle-orm/mysql-core';
import { academicYearsTable } from './academic-year.schema';
import { classesTable } from './class.schema';

export const feeTable = mysqlTable('fees', {
  id: serial().primaryKey(),
  academicYearId: bigint({ mode: 'number', unsigned: true })
    .notNull()
    .references(() => academicYearsTable.id),
  name: varchar({ length: 100 }).notNull(),
  category: mysqlEnum(
    Object.values(FeeCategory) as [string, ...string[]]
  ).notNull(),
  classId: bigint({ mode: 'number', unsigned: true }).references(
    () => classesTable.id
  ),
  amount: int().notNull(),
  dueDate: date(),
  createdAt: timestamp().defaultNow().notNull(),
  updatedAt: timestamp().onUpdateNow(),
});
