import {
  bigint,
  char,
  int,
  mysqlTable,
  serial,
  timestamp,
  varchar,
} from 'drizzle-orm/mysql-core';
import { academicYearsTable } from './academic-year.schema';
import { classesTable } from './class.schema';
import { studentsTable } from './student.schema';

export const enrollmentsTable = mysqlTable('enrollments', {
  id: serial().primaryKey(),
  academicYearId: bigint({ mode: 'number', unsigned: true })
    .notNull()
    .references(() => academicYearsTable.id),
  studentId: bigint({
    mode: 'number',
    unsigned: true,
  })
    .notNull()
    .references(() => studentsTable.id),
  classId: bigint({ mode: 'number', unsigned: true })
    .notNull()
    .references(() => classesTable.id),
  rollNumber: int().notNull(),
  section: char({ length: 1 }).notNull(),
  createdAt: timestamp().defaultNow().notNull(),
  updatedAt: timestamp().onUpdateNow(),
});
