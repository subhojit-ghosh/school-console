import {
  bigint,
  boolean,
  char,
  date,
  index,
  json,
  mysqlTable,
  serial,
  text,
  timestamp,
  varchar,
} from 'drizzle-orm/mysql-core';
import { classesTable } from './class.schema';

export const studentsTable = mysqlTable(
  'students',
  {
    id: serial().primaryKey(),
    classId: bigint({
      mode: 'number',
      unsigned: true,
    })
      .notNull()
      .references(() => classesTable.id),
    name: varchar({ length: 100 }),
    dob: date().notNull(),
    gender: char({ length: 1 }).notNull(),
    religion: varchar({
      length: 11,
    }).notNull(),
    nationality: varchar({
      length: 11,
    }).notNull(),
    nativeLanguage: varchar({
      length: 11,
    }).notNull(),
    caste: varchar({
      length: 11,
    }).notNull(),
    fathersName: varchar({ length: 100 }).notNull(),
    fathersPhone: varchar({ length: 10 }).notNull(),
    mothersName: varchar({ length: 100 }).notNull(),
    mothersPhone: varchar({ length: 10 }).notNull(),

    presentAddess: text(),
    presentPo: text(),
    presentPs: varchar({
      length: 100,
    }),
    presentPin: varchar({ length: 6 }),
    isBothAddressSame: boolean(),
    permanentAddess: text(),
    permanentPo: text(),
    permanentPs: varchar({
      length: 100,
    }),
    permanentPin: varchar({ length: 6 }),

    previousSchoolDetails: json(),
    siblingDetails: json(),

    fatherQualification: varchar({ length: 255 }).notNull(),
    fatherProfession: varchar({ length: 255 }).notNull(),
    fatherAnnualIncome: varchar({ length: 255 }).notNull(),
    fatherAddress: text(),
    fatherCity: varchar({ length: 10 }).notNull(),
    fatherPin: varchar({ length: 6 }).notNull(),
    fatherState: varchar({ length: 100 }).notNull(),
    fatherCountry: varchar({ length: 5 }).notNull(),
    fatherMobile: varchar({ length: 10 }).notNull(),
    fatherEmail: text(),
    fatherPlace: text(),

    motherQualification: varchar({ length: 255 }).notNull(),
    motherProfession: varchar({ length: 255 }).notNull(),
    motherAnnualIncome: varchar({ length: 255 }).notNull(),
    motherAddress: text(),
    motherCity: varchar({ length: 10 }).notNull(),
    motherPin: varchar({ length: 6 }).notNull(),
    motherState: varchar({ length: 100 }).notNull(),
    motherCountry: varchar({ length: 5 }).notNull(),
    motherMobile: varchar({ length: 10 }).notNull(),
    motherEmail: text(),
    motherPlace: text(),

    guardianQualification: varchar({ length: 255 }).notNull(),
    guardianProfession: varchar({ length: 255 }).notNull(),
    guardianAnnualIncome: varchar({ length: 255 }).notNull(),
    guardianAddress: text(),
    guardianCity: varchar({ length: 10 }).notNull(),
    guardianPin: varchar({ length: 6 }).notNull(),
    guardianState: varchar({ length: 100 }).notNull(),
    guardianCountry: varchar({ length: 5 }).notNull(),
    guardianMobile: varchar({ length: 10 }).notNull(),
    guardianEmail: text(),
    guardianPlace: text(),

    createdAt: timestamp().defaultNow().notNull(),
    updatedAt: timestamp().onUpdateNow(),
  },
  (table) => [index('id_idx').on(table.id), index('name_idx').on(table.name)]
);
