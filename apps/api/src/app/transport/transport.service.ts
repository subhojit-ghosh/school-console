import { Inject, Injectable } from '@nestjs/common';
import {
  CreateTransportDto,
  CreateTransportFeeDto,
  UpdateTransportDto,
} from './transport.dto';
import {
  DRIZZLE,
  DrizzleDB,
  studentsTable,
  transportFeeItemsTable,
  transportFeesTable,
  transportTable,
} from '@school-console/drizzle';
import { and, count, eq } from 'drizzle-orm';
import { on } from 'events';

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
    return await this.db
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
}
