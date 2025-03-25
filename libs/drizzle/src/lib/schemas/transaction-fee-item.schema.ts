import {
  int,
  mysqlTable,
  serial,
  timestamp,
  varchar,
} from 'drizzle-orm/mysql-core';

export const transactionFeeItemTable = mysqlTable('transaction_fee_items', {
  id: serial().primaryKey(),
  category: varchar({
    length: 255,
  }).notNull(),
  name: varchar({
    length: 255,
  }).notNull(),
  amount: int().notNull(),
  concession: int().notNull(),
  paid: int().notNull(),
  createdAt: timestamp().defaultNow().notNull(),
  updatedAt: timestamp().onUpdateNow(),
});
