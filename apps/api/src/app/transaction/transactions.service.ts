import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import {
  academicFeeTable,
  DRIZZLE,
  DrizzleDB,
  transactionItemTable,
  transactionTable,
} from '@school-console/drizzle';
import { and, eq, inArray } from 'drizzle-orm';
import { CreateTransactionDto } from './transactions.dto';

@Injectable()
export class TransactionsService {
  constructor(@Inject(DRIZZLE) private db: DrizzleDB) {}

  async getStudentFeeSummary(
    academicYearId: number,
    classId: number,
    studentId: number
  ) {
    const academicFees = await this.db
      .select({
        id: academicFeeTable.id,
        name: academicFeeTable.name,
        category: academicFeeTable.category,
        amount: academicFeeTable.amount,
        dueDate: academicFeeTable.dueDate,
      })
      .from(academicFeeTable)
      .where(
        and(
          eq(academicFeeTable.academicYearId, academicYearId),
          eq(academicFeeTable.classId, classId)
        )
      )
      .orderBy(academicFeeTable.category);

    const transactions = await this.db
      .select()
      .from(transactionTable)
      .where(
        and(
          eq(transactionTable.academicYearId, academicYearId),
          eq(transactionTable.classId, classId),
          eq(transactionTable.studentId, studentId)
        )
      );

    const transactionItems = await this.db
      .select()
      .from(transactionItemTable)
      .where(
        inArray(
          transactionItemTable.transactionId,
          transactions.map((transaction) => transaction.id)
        )
      );

    const feesWithDue = academicFees.map((fee) => {
      const relatedItems = transactionItems.filter(
        (item) => item.academicFeeId === fee.id
      );

      const totalPaid = relatedItems.reduce((sum, item) => sum + item.paid, 0);
      const totalConcession = relatedItems.reduce(
        (sum, item) => sum + item.concession,
        0
      );
      const totalPayable = fee.amount - totalConcession;
      const totalDue = totalPayable - totalPaid;
      const isOverdue = fee.dueDate
        ? new Date(fee.dueDate) < new Date()
        : false;

      return {
        ...fee,
        totalPaid,
        totalConcession,
        totalPayable,
        totalDue,
        isOverdue,
      };
    });

    const totalPaid = feesWithDue.reduce((sum, fee) => sum + fee.totalPaid, 0);
    const totalDue = feesWithDue.reduce((sum, fee) => sum + fee.totalDue, 0);
    const currentDue = feesWithDue.reduce((sum, fee) => {
      if (fee.isOverdue) {
        return sum + fee.totalDue;
      }
      return sum;
    }, 0);

    return {
      feesWithDue,
      stats: {
        totalPaid,
        totalDue,
        currentDue,
      },
    };
  }

  async create(dto: CreateTransactionDto) {
    const fees = await this.db
      .select()
      .from(academicFeeTable)
      .where(
        and(
          inArray(
            academicFeeTable.id,
            dto.items.map((item) => item.academicFeeId)
          ),
          eq(academicFeeTable.academicYearId, dto.academicYearId)
        )
      );

    const totalAmount = fees.reduce((sum, fee) => sum + fee.amount, 0);
    const concession = dto.items.reduce(
      (sum, item) => sum + item.concession,
      0
    );
    const payable = totalAmount - concession;
    const paid = dto.items.reduce((sum, item) => sum + item.paid, 0);
    const due = payable - paid;

    await this.db.transaction(async (trx) => {
      const [{ id: transactionId }] = await trx
        .insert(transactionTable)
        .values({
          academicYearId: dto.academicYearId,
          studentId: dto.studentId,
          classId: dto.classId,
          totalAmount,
          payable,
          concession,
          paid,
          due,
          mode: dto.mode,
        })
        .$returningId();

      const items = dto.items.map((item) => {
        const fee = fees.find((fee) => fee.id === item.academicFeeId);
        if (!fee) {
          throw new BadRequestException(
            `Fee with ID ${item.academicFeeId} not found`
          );
        }
        return {
          transactionId,
          academicFeeId: item.academicFeeId,
          amount: fee.amount,
          concession: item.concession,
          payable: fee.amount - item.concession,
          paid: item.paid,
          due: fee.amount - item.concession - item.paid,
        };
      });

      await trx.insert(transactionItemTable).values(items);
    });

    return { message: 'Transaction saved successfully' };
  }
}
