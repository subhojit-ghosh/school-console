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
    concession: int().notNull(),
    paid: int().notNull(),
    createdAt: timestamp().defaultNow().notNull(),
    updatedAt: timestamp().onUpdateNow(),
  },
  (table) => [index('transaction_id_idx').on(table.transactionId)]
);
