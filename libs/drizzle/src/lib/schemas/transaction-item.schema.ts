import {
  bigint,
  index,
  int,
  mysqlTable,
  serial,
  timestamp,
} from 'drizzle-orm/mysql-core';
import { academicFeeTable } from './academic-fee.schema';
import { transactionTable } from './transaction.schema';

export const transactionItemTable = mysqlTable(
  'transaction_items',
  {
    id: serial().primaryKey(),
    transactionId: bigint({ mode: 'number', unsigned: true })
      .notNull()
      .references(() => transactionTable.id),
    academicFeeId: bigint({ mode: 'number', unsigned: true })
      .notNull()
      .references(() => academicFeeTable.id),
    amount: int().notNull(),
    lateFine: int().notNull(),
    lateDays: int().notNull(),
    concession: int().notNull(),
    payable: int().notNull(),
    paid: int().notNull(),
    due: int().notNull(),
    createdAt: timestamp().defaultNow().notNull(),
  },
  (table) => [
    index('transaction_id_idx').on(table.transactionId),
    index('academic_fee_id_idx').on(table.academicFeeId),
  ]
);
