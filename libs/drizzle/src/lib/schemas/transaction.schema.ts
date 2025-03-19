import {
  bigint,
  index,
  int,
  mysqlTable,
  serial,
  timestamp,
  varchar,
} from 'drizzle-orm/mysql-core';
import { academicYearsTable } from './academic-year.schema';
import { classesTable } from './class.schema';
import { studentsTable } from './student.schema';

export const transactionTable = mysqlTable(
  'transactions',
  {
    id: serial().primaryKey(),
    academicYearId: bigint({ mode: 'number', unsigned: true })
      .notNull()
      .references(() => academicYearsTable.id),
    studentId: bigint({ mode: 'number', unsigned: true })
      .notNull()
      .references(() => studentsTable.id),
    classId: bigint({ mode: 'number', unsigned: true }).references(
      () => classesTable.id
    ),
    payable: int().notNull(),
    paid: int().notNull(),
    due: int().notNull(),
    mode: varchar({ length: 100 }).notNull(),
    createdAt: timestamp().defaultNow().notNull(),
    updatedAt: timestamp().onUpdateNow(),
  },
  (table) => [
    index('academic_year_id_idx').on(table.academicYearId),
    index('student_id_idx').on(table.studentId),
    index('class_id_idx').on(table.classId),
  ]
);
