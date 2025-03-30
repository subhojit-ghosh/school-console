import {
  bigint,
  date,
  index,
  int,
  mysqlEnum,
  mysqlTable,
  serial,
  timestamp,
  varchar,
} from 'drizzle-orm/mysql-core';
import { academicYearsTable } from './academic-year.schema';
import { classesTable } from './class.schema';

export const academicFeeTable = mysqlTable(
  'academic_fees',
  {
    id: serial().primaryKey(),
    academicYearId: bigint({ mode: 'number', unsigned: true })
      .notNull()
      .references(() => academicYearsTable.id),
    name: varchar({ length: 100 }).notNull(),
    classId: bigint({ mode: 'number', unsigned: true }).references(
      () => classesTable.id
    ),
    amount: int().notNull(),
    dueDate: date(),
    createdAt: timestamp().defaultNow().notNull(),
    updatedAt: timestamp().onUpdateNow(),
  },
  (table) => [
    index('academic_year_id_class_id_idx').on(
      table.academicYearId,
      table.classId
    ),
  ]
);
