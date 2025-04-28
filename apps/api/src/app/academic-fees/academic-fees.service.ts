import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { DRIZZLE, DrizzleDB, academicFeeTable } from '@school-console/drizzle';
import { and, asc, count, desc, eq, like, ne } from 'drizzle-orm';
import {
  CreateAcademicFeeDto,
  FeeQueryDto,
  UpdateAcademicFeeDto,
} from './academic-fees.dto';

@Injectable()
export class AcademicFeeService {
  constructor(@Inject(DRIZZLE) private db: DrizzleDB) {}

  async findAll(query: FeeQueryDto) {
    const {
      page = 1,
      size = 10,
      sortBy = 'id',
      sortOrder = 'asc',
      name,
      academicYearId,
      classId,
    } = query;
    const offset = (page - 1) * size;

    const whereConditions: any = [];
    if (name) {
      whereConditions.push(like(academicFeeTable.name, `%${name}%`));
    }
    if (academicYearId) {
      whereConditions.push(eq(academicFeeTable.academicYearId, academicYearId));
    }
    if (classId) {
      whereConditions.push(eq(academicFeeTable.classId, classId));
    }

    const [fee, totalRecords] = await Promise.all([
      this.db
        .select({
          id: academicFeeTable.id,
          academicYearId: academicFeeTable.academicYearId,
          classId: academicFeeTable.classId,
          name: academicFeeTable.name,
          amount: academicFeeTable.amount,
          dueDate: academicFeeTable.dueDate,
        })
        .from(academicFeeTable)
        .where(whereConditions.length > 0 ? and(...whereConditions) : undefined)
        .orderBy(
          sortOrder === 'asc'
            ? asc(academicFeeTable[sortBy])
            : desc(academicFeeTable[sortBy])
        )
        .limit(size)
        .offset(offset),
      this.db
        .select({ count: count() })
        .from(academicFeeTable)
        .where(whereConditions.length > 0 ? and(...whereConditions) : undefined)
        .then((res) => res[0].count),
    ]);

    const totalPages = Math.ceil(totalRecords / size);

    return {
      size,
      page,
      totalPages,
      totalRecords,
      data: fee,
    };
  }

  async create(fee: CreateAcademicFeeDto) {
    const isFeeNameExists = await this.db
      .select({ count: count() })
      .from(academicFeeTable)
      .where(
        and(
          eq(academicFeeTable.name, fee.name),
          eq(academicFeeTable.academicYearId, fee.academicYearId),
          eq(academicFeeTable.classId, fee.classId)
        )
      )
      .then((res) => res[0].count > 0);

    if (isFeeNameExists) {
      throw new BadRequestException(
        'Name already exists for this academic year and class'
      );
    }

    return await this.db.insert(academicFeeTable).values(fee);
  }

  async update(id: number, fee: UpdateAcademicFeeDto) {
    const isFeeNameExists = await this.db
      .select({ count: count() })
      .from(academicFeeTable)
      .where(
        and(
          eq(academicFeeTable.name, fee.name),
          eq(academicFeeTable.academicYearId, fee.academicYearId),
          eq(academicFeeTable.classId, fee.classId),
          ne(academicFeeTable.id, id)
        )
      )
      .then((res) => res[0].count > 0);

    if (isFeeNameExists) {
      throw new BadRequestException(
        'Name already exists for this academic year and class'
      );
    }

    return await this.db
      .update(academicFeeTable)
      .set(fee)
      .where(eq(academicFeeTable.id, id));
  }

  async bulkAddEdit(fees: UpdateAcademicFeeDto[]) {
    const editRecords: UpdateAcademicFeeDto[] = fees.filter((item) => item.id);
    const addRecords: CreateAcademicFeeDto[] = fees
      .filter((item) => !item.id)
      .map((rec) => ({ ...rec, id: undefined }));
    console.log('debug-fees', editRecords, addRecords);

    if (editRecords.length > 0) {
      const promises = editRecords.map((rec) =>
        this.db
          .update(academicFeeTable)
          .set({ ...rec })
          .where(eq(academicFeeTable.id, rec.id))
      );
      const data = await Promise.all(promises);
    }

    if (addRecords.length > 0)
      await this.db.insert(academicFeeTable).values(addRecords);
    return {
      data: 'Data Edited successfully.',
    };
  }

  async deleteById(id: string) {
    return await this.db
      .delete(academicFeeTable)
      .where(eq(academicFeeTable.id, Number(id)));
  }
}
