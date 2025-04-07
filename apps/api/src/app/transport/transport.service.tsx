import { Inject, Injectable } from '@nestjs/common';
import { CreateTransportFeeDto, UpdateTransportDto } from './transport.dto';
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
  usersTable,
} from '@school-console/drizzle';
import { and, count, eq } from 'drizzle-orm';
import ReactPDF from '@react-pdf/renderer';
import * as qrcode from 'qrcode';
import writtenNumber from 'written-number';
import { readFileSync } from 'fs';
import { join } from 'path';
import { IAuthUser } from '../auth/auth-user.decorator';
import { titleCase } from '@school-console/utils';
import TransportReceipt from '../templates/transports/recept';

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

  async createTransportFee(
    createTransportFeeDto: CreateTransportFeeDto,
    user: IAuthUser
  ) {
    const transportFee = await this.db
      .insert(transportFeesTable)
      .values({ ...createTransportFeeDto, id: undefined, userId: user.id })
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
    const transportFees: any = await this.db
      .select({
        id: transportFeesTable.id,
        regNo: studentsTable.isEnrolled
          ? studentsTable.enrolledNo
          : studentsTable.regId,
        session: academicYearsTable.name,
        // receiptNo: 1,
        studentName: studentsTable.name,
        className: classesTable.name,
        date: transportFeesTable.createdAt,
        fathersName: studentsTable.fathersName,
        mode: transportFeesTable.mode,
        note: transportFeesTable.note,

        isEnrolled: studentsTable.isEnrolled,
        totalPayable: transportFeesTable.payableAmount,
        totalAmount: transportFeesTable.amount,
        receivedBy: usersTable.name,
      })
      .from(transportFeesTable)
      .innerJoin(
        studentsTable,
        eq(transportFeesTable.studentId, studentsTable.id)
      )
      .innerJoin(classesTable, eq(studentsTable.classId, classesTable.id))
      .innerJoin(
        academicYearsTable,
        eq(transportFeesTable.academicYearId, academicYearsTable.id)
      )
      .innerJoin(usersTable, eq(transportFeesTable.userId, usersTable.id))
      .where(eq(transportFeesTable.id, Number(id)))
      .then((res) => {
        let obj = {};
        if (res.length > 0) {
          obj = { ...res[0] };
        }
        return obj;
      });

    const transportFeeItems = await this.db
      .select({
        month: transportFeeItemsTable.month,
      })
      .from(transportFeeItemsTable)
      .where(eq(transportFeeItemsTable.transportFeeId, Number(id)));

    const data: any = {
      ...transportFees,
      items: transportFeeItems,
      totalPayableAmount: transportFees.totalPayable,
      totalAmount: transportFees.totalAmount,
      totalDueAmount: 0,
      user: user,
      totalInWords: titleCase(
        writtenNumber(transportFees.totalAmount).replace(/-/g, ' ')
      ),
    };

    const qrCodeDataURL = await qrcode.toDataURL(
      `Transport ID #${transportFees.id} | JDS Public School`
    );
    data.qrCodeDataURL = qrCodeDataURL;
    // return data;

    const logo = readFileSync(
      join(__dirname, '../../../', 'storage/logo-circle.png')
    );
    return await ReactPDF.renderToStream(
      <TransportReceipt logo={logo.toString('base64')} data={data} />
    );
  }
}
