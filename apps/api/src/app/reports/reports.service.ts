import { Inject, Injectable } from '@nestjs/common';
import {
  academicFeeTable,
  academicYearsTable,
  classesTable,
  DRIZZLE,
  DrizzleDB,
  studentsTable,
  transactionItemTable,
  transactionTable,
} from '@school-console/drizzle';
import {
  and,
  asc,
  count,
  desc,
  eq,
  inArray,
  like,
  gte,
  lte,
  or,
  sql,
} from 'drizzle-orm';
import {
  CollectionSummaryQueryDto,
  DuesReportQueryDto,
  TransactionHistoryQueryDto,
  ConcessionReportQueryDto,
} from './reports.dto';
import ExcelJS from 'exceljs';
import { Response } from 'express';

@Injectable()
export class ReportsService {
  constructor(@Inject(DRIZZLE) private db: DrizzleDB) {}

  private buildTransactionDateWhere(
    query: CollectionSummaryQueryDto
  ): (
    | ReturnType<typeof and>
    | ReturnType<typeof gte>
    | ReturnType<typeof lte>
  )[] {
    const conditions: (
      | ReturnType<typeof and>
      | ReturnType<typeof gte>
      | ReturnType<typeof lte>
    )[] = [];

    if (query.academicYearId) {
      conditions.push(
        eq(transactionTable.academicYearId, query.academicYearId)
      );
    }

    if (query.classId) {
      conditions.push(eq(transactionTable.classId, query.classId));
    }

    if (query.userId) {
      conditions.push(eq(transactionTable.userId, query.userId));
    }

    if (query.dateFrom) {
      conditions.push(
        gte(transactionTable.createdAt, new Date(query.dateFrom))
      );
    }

    if (query.dateTo) {
      // include entire end day
      const to = new Date(query.dateTo);
      to.setHours(23, 59, 59, 999);
      conditions.push(lte(transactionTable.createdAt, to));
    }

    return conditions;
  }

  async getCollectionSummary(query: CollectionSummaryQueryDto) {
    const groupBy = query.groupBy || 'day';

    let periodExpression;

    if (groupBy === 'month') {
      periodExpression = sql`DATE_FORMAT(${transactionTable.createdAt}, '%Y-%m')`;
    } else if (groupBy === 'year') {
      periodExpression = sql`DATE_FORMAT(${transactionTable.createdAt}, '%Y')`;
    } else {
      // day
      periodExpression = sql`DATE(${transactionTable.createdAt})`;
    }

    const whereConditions = this.buildTransactionDateWhere(query);

    const rows = await this.db
      .select({
        period: periodExpression.as('period'),
        academicYearId: transactionTable.academicYearId,
        classId: transactionTable.classId,
        totalAmount: sql<number>`SUM(${transactionTable.totalAmount})`,
        totalPaid: sql<number>`SUM(${transactionTable.paid})`,
        totalDue: sql<number>`SUM(${transactionTable.due})`,
        totalLateFine: sql<number>`SUM(${transactionTable.lateFine})`,
        totalConcession: sql<number>`SUM(${transactionTable.concession})`,
      })
      .from(transactionTable)
      .where(
        whereConditions.length > 0
          ? (and(...whereConditions) as ReturnType<typeof and>)
          : undefined
      )
      .groupBy(
        periodExpression,
        transactionTable.academicYearId,
        transactionTable.classId
      )
      .orderBy(periodExpression);

    return rows;
  }

  async getTransactionHistory(query: TransactionHistoryQueryDto) {
    const {
      page = 1,
      size = 10,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      academicYearId,
      classId,
      isEnrolled,
      student,
      dateFrom,
      dateTo,
      mode,
    } = query;

    const offset = (page - 1) * size;

    const whereConditions: any[] = [];

    if (academicYearId) {
      whereConditions.push(eq(transactionTable.academicYearId, academicYearId));
    }

    if (classId) {
      whereConditions.push(eq(transactionTable.classId, classId));
    }

    if (typeof isEnrolled === 'boolean') {
      whereConditions.push(eq(studentsTable.isEnrolled, isEnrolled));
    }

    if (student) {
      whereConditions.push(
        or(
          like(studentsTable.enrolledNo, `%${student}%`),
          like(studentsTable.regId, `%${student}%`),
          like(studentsTable.name, `%${student}%`)
        )
      );
    }

    if (dateFrom) {
      whereConditions.push(
        gte(transactionTable.createdAt, new Date(dateFrom))
      );
    }

    if (dateTo) {
      const to = new Date(dateTo);
      to.setHours(23, 59, 59, 999);
      whereConditions.push(lte(transactionTable.createdAt, to));
    }

    if (mode) {
      whereConditions.push(eq(transactionTable.mode, mode));
    }

    const [transactions, totalRecords] = await Promise.all([
      this.db
        .select({
          id: transactionTable.id,
          academicYearId: transactionTable.academicYearId,
          studentId: transactionTable.studentId,
          classId: transactionTable.classId,
          totalAmount: transactionTable.totalAmount,
          lateFine: transactionTable.lateFine,
          payable: transactionTable.payable,
          concession: transactionTable.concession,
          paid: transactionTable.paid,
          due: transactionTable.due,
          mode: transactionTable.mode,
          createdAt: transactionTable.createdAt,
          class: classesTable.name,
          studentName: studentsTable.name,
          isEnrolled: studentsTable.isEnrolled,
          enrolledNo: studentsTable.enrolledNo,
          regId: studentsTable.regId,
        })
        .from(transactionTable)
        .innerJoin(classesTable, eq(transactionTable.classId, classesTable.id))
        .innerJoin(
          studentsTable,
          eq(transactionTable.studentId, studentsTable.id)
        )
        .where(
          whereConditions.length > 0 ? and(...(whereConditions as [any, ...any[]])) : undefined
        )
        .orderBy(
          sortOrder === 'asc'
            ? asc(transactionTable[sortBy])
            : desc(transactionTable[sortBy])
        )
        .limit(size)
        .offset(offset),
      this.db
        .select({ count: count() })
        .from(transactionTable)
        .innerJoin(classesTable, eq(transactionTable.classId, classesTable.id))
        .innerJoin(
          studentsTable,
          eq(transactionTable.studentId, studentsTable.id)
        )
        .where(
          whereConditions.length > 0 ? and(...(whereConditions as [any, ...any[]])) : undefined
        )
        .then((res) => res[0].count),
    ]);

    const totalPages = Math.ceil(totalRecords / size);
    return {
      size,
      page,
      totalPages,
      totalRecords,
      data: transactions,
    };
  }

  async exportCollectionSummary(
    query: CollectionSummaryQueryDto,
    res: Response
  ) {
    const rows = await this.getCollectionSummary(query);

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Collection Summary');

    worksheet.columns = [
      { header: 'Period', key: 'period', width: 15 },
      { header: 'Academic Year ID', key: 'academicYearId', width: 18 },
      { header: 'Class ID', key: 'classId', width: 10 },
      { header: 'Total Amount', key: 'totalAmount', width: 15 },
      { header: 'Total Paid', key: 'totalPaid', width: 15 },
      { header: 'Total Due', key: 'totalDue', width: 15 },
      { header: 'Total Late Fine', key: 'totalLateFine', width: 18 },
      { header: 'Total Concession', key: 'totalConcession', width: 18 },
    ];

    rows.forEach((row) => {
      worksheet.addRow({
        period: row.period,
        academicYearId: row.academicYearId,
        classId: row.classId,
        totalAmount: row.totalAmount,
        totalPaid: row.totalPaid,
        totalDue: row.totalDue,
        totalLateFine: row.totalLateFine,
        totalConcession: row.totalConcession,
      });
    });

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
    res.setHeader(
      'Content-Disposition',
      'attachment; filename="collection-summary.xlsx"'
    );

    await workbook.xlsx.write(res);
    res.end();
  }

  async exportTransactionHistory(
    query: TransactionHistoryQueryDto,
    res: Response
  ) {
    // For now reuse current page/size; can be extended to batch later
    const history = await this.getTransactionHistory({
      ...query,
      page: query.page ?? 1,
      size: query.size ?? 1000,
    });

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Transaction History');

    worksheet.columns = [
      { header: 'ID', key: 'id', width: 10 },
      { header: 'Student', key: 'student', width: 30 },
      { header: 'Class', key: 'className', width: 15 },
      { header: 'Total Amount', key: 'totalAmount', width: 15 },
      { header: 'Late Fine', key: 'lateFine', width: 12 },
      { header: 'Concession', key: 'concession', width: 12 },
      { header: 'Payable', key: 'payable', width: 15 },
      { header: 'Paid', key: 'paid', width: 15 },
      { header: 'Due', key: 'due', width: 15 },
      { header: 'Mode', key: 'mode', width: 12 },
      { header: 'Date', key: 'createdAt', width: 20 },
    ];

    history.data.forEach((row) => {
      worksheet.addRow({
        id: row.id,
        student: `${row.studentName} (${
          row.isEnrolled ? row.enrolledNo : row.regId
        })`,
        className: row.class,
        totalAmount: row.totalAmount,
        lateFine: row.lateFine,
        concession: row.concession,
        payable: row.payable,
        paid: row.paid,
        due: row.due,
        mode: row.mode,
        createdAt: row.createdAt,
      });
    });

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
    res.setHeader(
      'Content-Disposition',
      'attachment; filename="transaction-history.xlsx"'
    );

    await workbook.xlsx.write(res);
    res.end();
  }

  async getConcessionReport(query: ConcessionReportQueryDto) {
    const {
      page = 1,
      size = 10,
      academicYearId,
      classId,
      isEnrolled,
      student,
      dateFrom,
      dateTo,
      mode,
    } = query;

    const offset = (page - 1) * size;

    const whereConditions: any[] = [];

    if (academicYearId) {
      whereConditions.push(eq(transactionTable.academicYearId, academicYearId));
    }

    if (classId) {
      whereConditions.push(eq(transactionTable.classId, classId));
    }

    if (typeof isEnrolled === 'boolean') {
      whereConditions.push(eq(studentsTable.isEnrolled, isEnrolled));
    }

    if (student) {
      whereConditions.push(
        or(
          like(studentsTable.enrolledNo, `%${student}%`),
          like(studentsTable.regId, `%${student}%`),
          like(studentsTable.name, `%${student}%`)
        )
      );
    }

    if (dateFrom) {
      whereConditions.push(
        gte(transactionTable.createdAt, new Date(dateFrom))
      );
    }

    if (dateTo) {
      const to = new Date(dateTo);
      to.setHours(23, 59, 59, 999);
      whereConditions.push(lte(transactionTable.createdAt, to));
    }

    if (mode) {
      whereConditions.push(eq(transactionTable.mode, mode));
    }

    const [rows, totalRecords] = await Promise.all([
      this.db
        .select({
          studentId: studentsTable.id,
          studentName: studentsTable.name,
          isEnrolled: studentsTable.isEnrolled,
          enrolledNo: studentsTable.enrolledNo,
          regId: studentsTable.regId,
          classId: classesTable.id,
          className: classesTable.name,
          academicYearId: transactionTable.academicYearId,
          totalConcession: sql<number>`SUM(${transactionTable.concession})`,
          transactionCount: count(transactionTable.id),
        })
        .from(transactionTable)
        .innerJoin(classesTable, eq(transactionTable.classId, classesTable.id))
        .innerJoin(
          studentsTable,
          eq(transactionTable.studentId, studentsTable.id)
        )
        .where(
          whereConditions.length > 0
            ? and(...(whereConditions as [any, ...any[]]))
            : undefined
        )
        .groupBy(
          studentsTable.id,
          studentsTable.name,
          studentsTable.isEnrolled,
          studentsTable.enrolledNo,
          studentsTable.regId,
          classesTable.id,
          classesTable.name,
          transactionTable.academicYearId
        )
        .orderBy(desc(sql`SUM(${transactionTable.concession})`))
        .limit(size)
        .offset(offset),
      this.db
        .select({ count: count() })
        .from(transactionTable)
        .innerJoin(classesTable, eq(transactionTable.classId, classesTable.id))
        .innerJoin(
          studentsTable,
          eq(transactionTable.studentId, studentsTable.id)
        )
        .where(
          whereConditions.length > 0
            ? and(...(whereConditions as [any, ...any[]]))
            : undefined
        )
        .then((res) => res[0].count),
    ]);

    const totalPages = Math.ceil(totalRecords / size);

    return {
      size,
      page,
      totalPages,
      totalRecords,
      data: rows,
    };
  }

  async exportConcessionReport(
    query: ConcessionReportQueryDto,
    res: Response
  ) {
    const report = await this.getConcessionReport({
      ...query,
      page: query.page ?? 1,
      size: query.size ?? 5000,
    });

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Concession Report');

    worksheet.columns = [
      { header: 'Student', key: 'student', width: 30 },
      { header: 'Class', key: 'className', width: 15 },
      { header: 'Total Concession', key: 'totalConcession', width: 18 },
      { header: 'Transactions', key: 'transactionCount', width: 15 },
    ];

    report.data.forEach((row) => {
      worksheet.addRow({
        student: `${row.studentName} (${
          row.isEnrolled ? row.enrolledNo : row.regId
        })`,
        className: row.className,
        totalConcession: row.totalConcession,
        transactionCount: row.transactionCount,
      });
    });

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
    res.setHeader(
      'Content-Disposition',
      'attachment; filename="concession-report.xlsx"'
    );

    await workbook.xlsx.write(res);
    res.end();
  }

  async getDues(query: DuesReportQueryDto) {
    const { academicYearId, classId, studentId } = query;
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
          dueDate: fee.dueDate,
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

  async exportDues(query: DuesReportQueryDto, res: Response) {
    const dues = await this.getDues(query);

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Outstanding Dues');

    worksheet.columns = [
      { header: 'Student', key: 'student', width: 30 },
      { header: 'Fee Name', key: 'feeName', width: 25 },
      { header: 'Due Date', key: 'dueDate', width: 15 },
      { header: 'Amount', key: 'amount', width: 12 },
      { header: 'Late Fine', key: 'lateFine', width: 12 },
      { header: 'Late Days', key: 'lateDays', width: 12 },
      { header: 'Total Concession', key: 'totalConcession', width: 18 },
      { header: 'Total Payable', key: 'totalPayable', width: 15 },
      { header: 'Total Paid', key: 'totalPaid', width: 15 },
      { header: 'Total Due', key: 'totalDue', width: 15 },
      { header: 'Overdue', key: 'overdue', width: 10 },
    ];

    dues.forEach((student) => {
      student.dues.forEach((item) => {
        worksheet.addRow({
          student: `${student.name} (${
            student.isEnrolled ? student.enrolledNo : student.regId
          })`,
          feeName: item.name,
          dueDate: item.dueDate
            ? new Date(item.dueDate).toISOString().split('T')[0]
            : '',
          amount: item.amount,
          lateFine: item.lateFine,
          lateDays: item.lateDays,
          totalConcession: item.totalConcession,
          totalPayable: item.totalPayable,
          totalPaid: item.totalPaid,
          totalDue: item.totalDue,
          overdue: item.isOverdue ? 'Yes' : 'No',
        });
      });
    });

    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
    res.setHeader(
      'Content-Disposition',
      'attachment; filename="dues-report.xlsx"'
    );

    await workbook.xlsx.write(res);
    res.end();
  }
}
