import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import ReactPDF from '@react-pdf/renderer';
import {
  academicFeeTable,
  academicYearsTable,
  classesTable,
  DRIZZLE,
  DrizzleDB,
  studentsTable,
  transactionItemTable,
  transactionTable,
  usersTable,
} from '@school-console/drizzle';
import { titleCase } from '@school-console/utils';
import { and, asc, count, desc, eq, inArray, like, or } from 'drizzle-orm';
import { readFileSync } from 'fs';
import { join } from 'path';
import * as qrcode from 'qrcode';
import writtenNumber from 'written-number';
import TransactionReceipt from '../templates/transactions/recept';
import { CreateTransactionDto, TransactionQueryDto } from './transactions.dto';

@Injectable()
export class TransactionsService {
  constructor(@Inject(DRIZZLE) private db: DrizzleDB) {}

  async findAll(query: TransactionQueryDto) {
    const {
      page = 1,
      size = 10,
      sortBy = 'createdAt',
      sortOrder = 'asc',
      classId,
      isEnrolled,
      student,
    } = query;

    const offset = (page - 1) * size;

    const whereConditions: any = [];
    if (classId) {
      whereConditions.push(eq(transactionTable.classId, classId));
    }
    if (typeof isEnrolled === 'boolean') {
      whereConditions.push(eq(studentsTable.isEnrolled, isEnrolled));
    }
    if (student) {
      whereConditions.push(
        or(
          isEnrolled
            ? like(studentsTable.enrolledNo, `%${student}%`)
            : like(studentsTable.regId, `%${student}%`),
          like(studentsTable.name, `%${student}%`)
        )
      );
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
        .where(whereConditions.length > 0 ? and(...whereConditions) : undefined)
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
        .where(whereConditions.length > 0 ? and(...whereConditions) : undefined)
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

  async findItems(id: number) {
    const items = await this.db
      .select({
        id: transactionItemTable.id,
        academicFeeId: transactionItemTable.academicFeeId,
        amount: transactionItemTable.amount,
        lateFine: transactionItemTable.lateFine,
        lateDays: transactionItemTable.lateDays,
        concession: transactionItemTable.concession,
        payable: transactionItemTable.payable,
        paid: transactionItemTable.paid,
        due: transactionItemTable.due,
        academicFeeName: academicFeeTable.name,
      })
      .from(transactionItemTable)
      .innerJoin(
        academicFeeTable,
        eq(transactionItemTable.academicFeeId, academicFeeTable.id)
      )
      .where(eq(transactionItemTable.transactionId, id));

    return items;
  }

  async getStudentFeeSummary(
    academicYearId: number,
    classId: number,
    studentId: number
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
      })
      .from(academicFeeTable)
      .where(
        and(
          eq(academicFeeTable.academicYearId, academicYearId),
          eq(academicFeeTable.classId, classId)
        )
      );

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

      const lateFine = lateDays * academicYear.lateFinePerDay;

      totalDue += lateFine;

      return {
        ...fee,
        totalPaid,
        totalConcession,
        totalPayable,
        totalDue,
        isOverdue,
        lateDays,
        lateFine,
      };
    });

    const totalPaid = feesWithDue.reduce((sum, fee) => sum + fee.totalPaid, 0);
    const totalDue = feesWithDue.reduce((sum, fee) => sum + fee.totalDue, 0);
    const totalLateFine = feesWithDue.reduce(
      (sum, fee) => sum + fee.lateFine,
      0
    );
    const overDue = feesWithDue.reduce((sum, fee) => {
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
        totalLateFine,
        overDue,
      },
    };
  }

  async create(dto: CreateTransactionDto, userId: number) {
    const { feesWithDue } = await this.getStudentFeeSummary(
      dto.academicYearId,
      dto.classId,
      dto.studentId
    );

    const fees = feesWithDue.filter(
      (fee) =>
        dto.items.find((item) => item.academicFeeId === fee.id) &&
        fee.totalDue > 0
    );

    const totalAmount = fees.reduce((sum, fee) => sum + fee.amount, 0);
    const lateFine = fees.reduce((sum, fee) => sum + fee.lateFine, 0);
    const concession = dto.items.reduce(
      (sum, item) => sum + item.concession,
      0
    );
    const payable = totalAmount + lateFine - concession;
    const paid = dto.items.reduce((sum, item) => sum + item.paid, 0);
    const due = payable - paid;

    let id: number | null = null;

    await this.db.transaction(async (trx) => {
      const [{ id: transactionId }] = await trx
        .insert(transactionTable)
        .values({
          academicYearId: dto.academicYearId,
          studentId: dto.studentId,
          classId: dto.classId,
          userId,
          totalAmount,
          lateFine,
          payable,
          concession,
          paid,
          due,
          mode: dto.mode,
        })
        .$returningId();

      id = transactionId;

      const items = dto.items.map((item) => {
        const fee = fees.find((fee) => fee.id === item.academicFeeId);
        if (!fee) {
          throw new BadRequestException(
            `Fee with ID ${item.academicFeeId} not found`
          );
        }

        const payable = fee.amount + fee.lateFine - item.concession;

        return {
          transactionId,
          academicFeeId: item.academicFeeId,
          amount: fee.amount,
          lateFine: fee.lateFine,
          lateDays: fee.lateDays,
          concession: item.concession,
          payable,
          paid: item.paid,
          due: payable - item.paid,
        };
      });

      await trx.insert(transactionItemTable).values(items);
    });

    return { id, message: 'Transaction saved successfully' };
  }

  async getReceipt(id: string) {
    const transaction: any = await this.db
      .select({
        id: transactionTable.id,
        regNo: studentsTable.isEnrolled
          ? studentsTable.enrolledNo
          : studentsTable.regId,
        session: academicYearsTable.name,
        studentName: studentsTable.name,
        className: classesTable.name,
        date: transactionTable.createdAt,
        fathersName: studentsTable.fathersName,
        mode: transactionTable.mode,
        note: transactionTable.note,
        isEnrolled: studentsTable.isEnrolled,
        totalAmount: transactionTable.totalAmount,
        receivedBy: usersTable.name,
      })
      .from(transactionTable)
      .innerJoin(classesTable, eq(transactionTable.classId, classesTable.id))
      .innerJoin(
        academicYearsTable,
        eq(transactionTable.academicYearId, academicYearsTable.id)
      )
      .innerJoin(
        studentsTable,
        eq(transactionTable.studentId, studentsTable.id)
      )
      .innerJoin(usersTable, eq(transactionTable.userId, usersTable.id))
      .where(eq(transactionTable.id, Number(id)))
      .then((res) => {
        let obj = {};
        if (res.length > 0) {
          obj = { ...res[0] };
        }
        return obj;
      });

    const transactionItems = await this.db
      .select({
        academicFeeName: academicFeeTable.name,
        amount: transactionItemTable.amount,
        concession: transactionItemTable.concession,
        payable: transactionItemTable.payable,
        paid: transactionItemTable.paid,
        due: transactionItemTable.due,
      })
      .from(transactionItemTable)
      .innerJoin(
        academicFeeTable,
        eq(transactionItemTable.academicFeeId, academicFeeTable.id)
      )
      .where(eq(transactionItemTable.transactionId, Number(id)));

    const totalPaidAmount = transactionItems.reduce(
      (acc, item) => acc + item.paid,
      0
    );
    const totalPayableAmount = transactionItems.reduce(
      (acc, item) => acc + item.payable,
      0
    );
    const totalDueAmount = transactionItems.reduce(
      (acc, item) => acc + item.due,
      0
    );

    const data: any = {
      ...transaction,
      items: transactionItems,
      totalPayableAmount,
      totalPaidAmount,
      totalDueAmount,
      totalInWords: titleCase(
        writtenNumber(totalPaidAmount).replace(/-/g, ' ')
      ),
    };

    const qrCodeDataURL = await qrcode.toDataURL(
      `Transaction ID #${transaction.id} | JDS Public School`
    );
    data.qrCodeDataURL = qrCodeDataURL;

    const logo = readFileSync(
      join(__dirname, '../../../', 'storage/logo-circle.png')
    );
    return await ReactPDF.renderToStream(
      <TransactionReceipt logo={logo.toString('base64')} data={data} />
    );
  }
}
