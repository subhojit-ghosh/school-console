import { Inject, Injectable } from '@nestjs/common';
import {
  academicFeeTable,
  academicYearsTable,
  DRIZZLE,
  DrizzleDB,
  studentsTable,
  transactionItemTable,
  transactionTable,
} from '@school-console/drizzle';
import { and, eq, inArray } from 'drizzle-orm';

@Injectable()
export class ReportsService {
  constructor(@Inject(DRIZZLE) private db: DrizzleDB) {}

  async getDues(
    academicYearId: number,
    classId: number,
    studentId?: number | null
  ) {
    const academicYear = await this.db
      .select({
        lateFinePerDay: academicYearsTable.lateFinePerDay,
      })
      .from(academicYearsTable)
      .where(eq(academicYearsTable.id, academicYearId))
      .then((res) => res[0]);

    const academicFees = await this.db
      .select({
        id: academicFeeTable.id,
        name: academicFeeTable.name,
        amount: academicFeeTable.amount,
        dueDate: academicFeeTable.dueDate,
        classId: academicFeeTable.classId,
      })
      .from(academicFeeTable)
      .where(
        and(
          eq(academicFeeTable.academicYearId, academicYearId),
          eq(academicFeeTable.classId, classId)
        )
      );

    const students = await this.db
      .select({
        id: studentsTable.id,
        name: studentsTable.name,
        isEnrolled: studentsTable.isEnrolled,
        regId: studentsTable.regId,
        enrolledNo: studentsTable.enrolledNo,
      })
      .from(studentsTable)
      .where(
        and(
          eq(studentsTable.classId, classId),
          studentId ? eq(studentsTable.id, studentId) : undefined
        )
      );

    const transactions = await this.db
      .select({
        id: transactionTable.id,
        studentId: transactionTable.studentId,
      })
      .from(transactionTable)
      .where(
        and(
          eq(transactionTable.academicYearId, academicYearId),
          eq(transactionTable.classId, classId),
          studentId ? eq(transactionTable.studentId, studentId) : undefined
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

    const studentDues = students.map((student) => {
      const studentTransactions = transactions.filter(
        (transaction) => transaction.studentId === student.id
      );

      const studentFees = academicFees.map((fee) => {
        const relatedItems = studentTransactions.flatMap((transaction) =>
          transactionItems.filter(
            (item) =>
              item.academicFeeId === fee.id &&
              item.transactionId === transaction.id
          )
        );

        const totalPaid = relatedItems.reduce(
          (sum, item) => sum + item.amount,
          0
        );
        const totalConcession = relatedItems.reduce(
          (sum, item) => sum + (item.concession || 0),
          0
        );
        const totalPayable = fee.amount - totalConcession;
        let totalDue = Math.max(0, totalPayable - totalPaid);

        let isOverdue = false;
        let lateDays = 0;

        if (fee.dueDate && totalDue > 0) {
          isOverdue = fee.dueDate ? new Date(fee.dueDate) < new Date() : false;

          lateDays = isOverdue
            ? Math.ceil(
                (new Date().getTime() - new Date(fee.dueDate).getTime()) /
                  (1000 * 60 * 60 * 24)
              ) - 1
            : 0;
        }

        const lateFine = lateDays * (academicYear.lateFinePerDay || 0);

        totalDue += lateFine;

        return {
          id: fee.id,
          name: fee.name,
          amount: fee.amount,
          totalConcession,
          totalPaid,
          totalPayable,
          totalDue,
          isOverdue,
          lateDays,
          lateFine,
        };
      });

      return {
        ...student,
        dues: studentFees,
        totalAmount: studentFees.reduce((sum, fee) => sum + fee.amount, 0),
        totalConcession: studentFees.reduce(
          (sum, fee) => sum + fee.totalConcession,
          0
        ),
        totalPaid: studentFees.reduce((sum, fee) => sum + fee.totalPaid, 0),
        totalDue: studentFees.reduce((sum, fee) => sum + fee.totalDue, 0),
        totalLateFine: studentFees.reduce((sum, fee) => sum + fee.lateFine, 0),
        totalOverdue: studentFees
          .filter((fee) => fee.isOverdue)
          .reduce((sum, fee) => sum + fee.totalDue, 0),
      };
    });

    return studentDues;
  }
}
