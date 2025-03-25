import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  academicFeeTable,
  DRIZZLE,
  DrizzleDB,
  transactionTable,
} from '@school-console/drizzle';
import { and, eq, sum } from 'drizzle-orm';
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
    // Fetch academic fee details
    const fee = await this.db
      .select()
      .from(academicFeeTable)
      .where(
        and(
          eq(academicFeeTable.id, dto.feeId),
          eq(academicFeeTable.academicYearId, dto.academicYearId)
        )
      )
      .then((res) => res[0]);

    if (!fee) {
      throw new NotFoundException('Academic Fee not found');
    }

    // Fetch previous transactions
    const previousPayments = await this.getStudentTransactions(
      dto.studentId,
      dto.academicYearId
    );

    const totalPaid = previousPayments?.totalPaid
      ? Number(previousPayments.totalPaid)
      : 0;
    const totalDue = Number(fee.amount) - totalPaid;

    if (dto.paid > totalDue) {
      throw new BadRequestException('Paid amount exceeds due balance');
    }

    // Save transaction
    const result = await this.db.insert(transactionTable).values({
      academicYearId: dto.academicYearId,
      studentId: dto.studentId,
      classId: dto.classId,
      payable: fee.amount,
      paid: dto.paid,
      due: totalDue - dto.paid,
      mode: dto.mode,
    });

    return { message: 'Transaction saved successfully', result };
  }
}
