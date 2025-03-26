import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import {
  academicFeeTable,
  DRIZZLE,
  DrizzleDB,
  transactionItemTable,
  transactionTable,
} from '@school-console/drizzle';
import { and, eq, inArray, sum } from 'drizzle-orm';
import { CreateTransactionDto } from './transactions.dto';

@Injectable()
export class TransactionsService {
  constructor(@Inject(DRIZZLE) private db: DrizzleDB) {}

  async getAcademicFees(academicYearId: number, classId: number) {
    // Fetch all distinct categories
    const academicRecords = await this.db
      .selectDistinct({
        id: academicFeeTable.id,
        name: academicFeeTable.name,
        category: academicFeeTable.category,
        amount: academicFeeTable.amount,
      })
      .from(academicFeeTable)
      .where(
        and(
          eq(academicFeeTable.academicYearId, academicYearId),
          eq(academicFeeTable.classId, classId)
        )
      )
      .orderBy(academicFeeTable.category);
    const distinctCategory = [
      ...new Set(academicRecords.map((rec) => rec.category)),
    ];
    const obj = {};
    distinctCategory.forEach((rec) => {
      const tempData = academicRecords.filter(
        (acdRec) => String(acdRec.category) === String(rec)
      );
      obj[rec] = tempData;
    });

    return obj;
  }

  async getStudentTransactions(studentId: number, academicYearId: number) {
    // Fetch student transaction history
    return await this.db
      .select({
        totalPaid: sum(transactionTable.paid),
        totalDue: sum(transactionTable.due),
      })
      .from(transactionTable)
      .where(
        and(
          eq(transactionTable.studentId, studentId),
          eq(transactionTable.academicYearId, academicYearId)
        )
      )
      .then((res) => res[0]);
  }

  async collectFee(dto: CreateTransactionDto) {
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
