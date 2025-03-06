import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { DRIZZLE, DrizzleDB, feeTable } from '@school-console/drizzle';
import { and, asc, count, desc, eq, like, ne } from 'drizzle-orm';
import { CreateFeeDto, FeeQueryDto, UpdateFeeDto } from './fees.dto';

@Injectable()
export class FeeService {
  constructor(@Inject(DRIZZLE) private db: DrizzleDB) {}

  async findAll(query: FeeQueryDto) {
    const {
      page = 1,
      size = 10,
      sortBy = 'createdAt',
      sortOrder = 'asc',
      name,
      category,
      academicYearId,
      classId,
    } = query;
    const offset = (page - 1) * size;

    const whereConditions: any = [];
    if (name) {
      whereConditions.push(like(feeTable.name, `%${name}%`));
    }
    if (category) {
      whereConditions.push(eq(feeTable.category, category));
    }
    if (academicYearId) {
      whereConditions.push(eq(feeTable.academicYearId, academicYearId));
    }
    if (classId) {
      whereConditions.push(eq(feeTable.classId, classId));
    }

    const [fee, totalRecords] = await Promise.all([
      this.db
        .select({
          id: feeTable.id,
          academicYearId: feeTable.academicYearId,
          classId: feeTable.classId,
          name: feeTable.name,
          category: feeTable.category,
          amount: feeTable.amount,
          dueDate: feeTable.dueDate,
        })
        .from(feeTable)
        .where(whereConditions.length > 0 ? and(...whereConditions) : undefined)
        .orderBy(
          sortOrder === 'asc' ? asc(feeTable[sortBy]) : desc(feeTable[sortBy])
        )
        .limit(size)
        .offset(offset),
      this.db
        .select({ count: count() })
        .from(feeTable)
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

  async create(fee: CreateFeeDto) {
    const isFeeNameExists = await this.db
      .select({ count: count() })
      .from(feeTable)
      .where(
        and(
          eq(feeTable.name, fee.name),
          eq(feeTable.category, fee.category),
          eq(feeTable.academicYearId, fee.academicYearId)
        )
      )
      .then((res) => res[0].count > 0);

    if (isFeeNameExists) {
      throw new BadRequestException(
        'Name already exists for this academic year and category'
      );
    }

    return await this.db.insert(feeTable).values(fee);
  }

  async update(id: number, fee: UpdateFeeDto) {
    const isFeeNameExists = await this.db
      .select({ count: count() })
      .from(feeTable)
      .where(
        and(
          eq(feeTable.name, fee.name),
          eq(feeTable.category, fee.category),
          eq(feeTable.academicYearId, fee.academicYearId),
          ne(feeTable.id, id)
        )
      )
      .then((res) => res[0].count > 0);

    if (isFeeNameExists) {
      throw new BadRequestException(
        'Name already exists for this academic year and category'
      );
    }

    return await this.db.update(feeTable).set(fee).where(eq(feeTable.id, id));
  }
}
