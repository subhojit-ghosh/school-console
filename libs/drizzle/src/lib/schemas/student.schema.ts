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
    regId: varchar({ length: 100 }),
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

    fatherQualification: varchar({ length: 255 }),
    fatherProfession: varchar({ length: 255 }),
    fatherAnnualIncome: varchar({ length: 255 }),
    fatherAddress: text(),
    fatherCity: varchar({ length: 10 }),
    fatherPin: varchar({ length: 6 }),
    fatherState: varchar({ length: 100 }),
    fatherCountry: varchar({ length: 5 }),
    fatherMobile: varchar({ length: 10 }),
    fatherEmail: text(),
    fatherPlace: text(),

    motherQualification: varchar({ length: 255 }),
    motherProfession: varchar({ length: 255 }),
    motherAnnualIncome: varchar({ length: 255 }),
    motherAddress: text(),
    motherCity: varchar({ length: 10 }),
    motherPin: varchar({ length: 6 }),
    motherState: varchar({ length: 100 }),
    motherCountry: varchar({ length: 5 }),
    motherMobile: varchar({ length: 10 }),
    motherEmail: text(),
    motherPlace: text(),

    guardianQualification: varchar({ length: 255 }),
    guardianProfession: varchar({ length: 255 }),
    guardianAnnualIncome: varchar({ length: 255 }),
    guardianAddress: text(),
    guardianCity: varchar({ length: 10 }),
    guardianPin: varchar({ length: 6 }),
    guardianState: varchar({ length: 100 }),
    guardianCountry: varchar({ length: 5 }),
    guardianMobile: varchar({ length: 10 }),
    guardianEmail: text(),
    guardianPlace: text(),

    isEnrolled: boolean().default(false),
    enrolledId: varchar({ length: 10 }),
    enrolledNo: varchar({ length: 10 }),

    studentPhoto: text(),
    fatherPhoto: text(),
    motherPhoto: text(),
    studentBirthCertificate: text(),
    studentVacinationRecord: text(),
    medicalHistory: boolean().default(false),
    medicalHistoryDetails: text(),
    studentMedicalRecord: text(),

    fatherSignature: text(),
    motherSignature: text(),
    guardainSignature: text(),

    createdAt: timestamp().defaultNow().notNull(),
    updatedAt: timestamp().onUpdateNow(),
  },
  (table) => [index('id_idx').on(table.id), index('name_idx').on(table.name)]
);
