import {
  bigint,
  decimal,
  mysqlTable,
  serial,
  timestamp,
  varchar,
} from 'drizzle-orm/mysql-core';
import { feeStructuresTable } from './fee-structure.schema';

export const feeStructureItemsTable = mysqlTable('fee_structure_items', {
  id: serial().primaryKey(),
  feeStructureId: bigint({ mode: 'number', unsigned: true })
    .notNull()
    .references(() => feeStructuresTable.id),
  name: varchar({ length: 100 }).notNull(),
  description: varchar({ length: 200 }),
  amount: decimal({ precision: 10, scale: 2 }).notNull(),
  createdAt: timestamp().defaultNow().notNull(),
  updatedAt: timestamp().onUpdateNow(),
});
