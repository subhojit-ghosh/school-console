import { Inject, Injectable } from '@nestjs/common';
import {
  CreateTransportDto,
  CreateTransportFeeDto,
  UpdateTransportDto,
} from './transport.dto';
import {
  academicFeeTable,
  academicYearsTable,
  classesTable,
  DRIZZLE,
  DrizzleDB,
  studentsTable,
  transactionItemTable,
  transactionTable,
  transportFeeItemsTable,
  transportFeesTable,
  transportTable,
} from '@school-console/drizzle';
import { and, count, eq } from 'drizzle-orm';
import ReactPDF from '@react-pdf/renderer';
import * as qrcode from 'qrcode';
import writtenNumber from 'written-number';
import { readFileSync } from 'fs';
import { join } from 'path';
import { IAuthUser } from '../auth/auth-user.decorator';
import { titleCase } from '@school-console/utils';
import TransactionReceipt from '../templates/transactions/recept';

@Injectable()
export class TransportService {
  constructor(@Inject(DRIZZLE) private db: DrizzleDB) {}

  async settingsByAcadId(acadId: string) {
    return this.db.query.transportTable.findFirst({
      columns: {
        createdAt: false,
        updatedAt: false,
      },
      where: eq(transportTable.academicYearId, Number(acadId)),
    });
  }

  async settings(transport: UpdateTransportDto) {
    if (transport.id) {
      const recordExists = await this.db
        .select({
          value: count(),
        })
        .from(transportTable)
        .where(eq(transportTable.id, Number(transport.id)))
        .then((res) => (res && res[0] ? res[0] : null));
      if (recordExists)
        return await this.db
          .update(transportTable)
          .set({ ...(transport as any) })
          .where(eq(transportTable.id, Number(transport.id)));
    }
    return await this.db
      .insert(transportTable)
      .values({ ...(transport as any) });
  }

  async createTransportFee(createTransportFeeDto: CreateTransportFeeDto) {
    const transportFee = await this.db
      .insert(transportFeesTable)
      .values({ ...createTransportFeeDto, id: undefined })
      .$returningId();
    const arrOfInsert: any = createTransportFeeDto.months.map((month) => ({
      ...createTransportFeeDto,
      month: Number(month),
      months: undefined,
      id: undefined,
      transportFeeId: transportFee[0].id,
    }));
    return await this.db.insert(transportFeeItemsTable).values(arrOfInsert);
  }

  async findTransportFeeItems(academicYearId: string, studentId: string) {
    const feeItems = await this.db
      .select({
        month: transportFeeItemsTable.month,
      })
      .from(transportFeeItemsTable)
      .where(
        and(
          eq(transportFeeItemsTable.academicYearId, Number(academicYearId)),
          eq(transportFeeItemsTable.studentId, Number(studentId))
        )
      );

    const studentRecord = await this.db
      .select({
        isTransportTaken: studentsTable.isTransportTaken,
        transportKm: studentsTable.transportKm,
      })
      .from(studentsTable)
      .where(and(eq(studentsTable.id, Number(studentId))))
      .then((res) => (res.length > 0 ? res[0] : {}));

    return {
      feeItems,
      studentRecord,
    };
  }

  async findAll(academicYearId: string) {
    return await this.db
      .select({
        id: transportFeesTable.id,
        studentName: studentsTable.name,
        baseAmount: transportFeesTable.baseAmount,
        perKmCharge: transportFeesTable.perKmCharge,
        amount: transportFeesTable.amount,
        mode: transportFeesTable.mode,
        note: transportFeesTable.note,
        createdAt: transportFeesTable.createdAt,
      })
      .from(transportFeesTable)
      .innerJoin(
        studentsTable,
        eq(transportFeesTable.studentId, studentsTable.id)
      )
      .where(eq(transportFeesTable.academicYearId, Number(academicYearId)));
  }

  async findTransportItemById(transportId: string) {
    return await this.db
      .select()
      .from(transportFeeItemsTable)
      .where(eq(transportFeeItemsTable.transportFeeId, Number(transportId)));
  }

  findOne(id: number) {
    return `This action returns a #${id} transport`;
  }

  update(id: number, updateTransportDto: UpdateTransportDto) {
    return `This action updates a #${id} transport`;
  }

  remove(id: number) {
    return `This action removes a #${id} transport`;
  }

  async getReceipt(id: string, user: IAuthUser) {
    const transaction: any = await this.db
      .select({
        id: transactionTable.id,
        regNo: studentsTable.isEnrolled
          ? studentsTable.enrolledNo
          : studentsTable.regId,
        session: academicYearsTable.name,
        receiptNo: transactionItemTable.id,
        studentName: studentsTable.name,
        className: classesTable.name,
        date: transactionTable.createdAt,
        fathersName: studentsTable.fathersName,
        mode: transactionTable.mode,
        note: transactionTable.note,

        isEnrolled: studentsTable.isEnrolled,
        totalAmount: transactionTable.totalAmount,
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
      .innerJoin(
        transactionItemTable,
        eq(transactionTable.id, transactionItemTable.transactionId)
      )
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

    const totalAmount = transactionItems.reduce(
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
      totalPayableAmount: totalPayableAmount,
      totalAmount: totalAmount,
      totalDueAmount: totalDueAmount,
      user: user,
      totalInWords: titleCase(writtenNumber(totalAmount).replace(/-/g, ' ')),
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
