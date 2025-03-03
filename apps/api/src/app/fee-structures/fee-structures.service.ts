import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import {
  DRIZZLE,
  DrizzleDB,
  feeStructureItemsTable,
  feeStructuresTable,
} from '@school-console/drizzle';
import { and, asc, count, desc, eq, like, ne } from 'drizzle-orm';
import {
  CreateFeeStructureDto,
  FeeStructureQueryDto,
  UpdateFeeStructureDto,
} from './fee-structures.dto';

@Injectable()
export class FeeStructuresService {
  constructor(@Inject(DRIZZLE) private db: DrizzleDB) {}

  async findAll(query: FeeStructureQueryDto) {
    const {
      page = 1,
      size = 10,
      sortBy = 'createdAt',
      sortOrder = 'asc',
      name,
      academicYearId,
      classId,
    } = query;
    const offset = (page - 1) * size;

    const whereConditions: any = [];
    if (name) {
      whereConditions.push(like(feeStructuresTable.name, `%${name}%`));
    }
    if (academicYearId) {
      whereConditions.push(
        eq(feeStructuresTable.academicYearId, academicYearId)
      );
    }
    if (classId) {
      whereConditions.push(eq(feeStructuresTable.classId, classId));
    }

    const [feeStructures, totalRecords] = await Promise.all([
      this.db
        .select({
          id: feeStructuresTable.id,
          academicYearId: feeStructuresTable.academicYearId,
          classId: feeStructuresTable.classId,
          name: feeStructuresTable.name,
        })
        .from(feeStructuresTable)
        .where(whereConditions.length > 0 ? and(...whereConditions) : undefined)
        .orderBy(
          sortOrder === 'asc'
            ? asc(feeStructuresTable[sortBy])
            : desc(feeStructuresTable[sortBy])
        )
        .limit(size)
        .offset(offset),
      this.db
        .select({ count: count() })
        .from(feeStructuresTable)
        .where(whereConditions.length > 0 ? and(...whereConditions) : undefined)
        .then((res) => res[0].count),
    ]);

    const totalPages = Math.ceil(totalRecords / size);

    return {
      size,
      page,
      totalPages,
      totalRecords,
      data: feeStructures,
    };
  }

  async create(feeStructure: CreateFeeStructureDto) {
    const isFeeStructureNameExists = await this.db
      .select({ count: count() })
      .from(feeStructuresTable)
      .where(
        and(
          eq(feeStructuresTable.name, feeStructure.name),
          eq(feeStructuresTable.classId, feeStructure.classId),
          eq(feeStructuresTable.academicYearId, feeStructure.academicYearId)
        )
      )
      .then((res) => res[0].count > 0);

    if (isFeeStructureNameExists) {
      throw new BadRequestException(
        'Name already exists for this class and academic year'
      );
    }

    const createdFeeStructure = await this.db
      .insert(feeStructuresTable)
      .values(feeStructure)
      .$returningId();

    const createdItems = await this.db.insert(feeStructureItemsTable).values(
      feeStructure.items.map((item) => ({
        feeStructureId: createdFeeStructure[0].id,
        name: item.name,
        description: item.description,
        amount: item.amount.toString(),
      }))
    );

    return {
      message: 'Fee structure created successfully',
    };
  }

  async update(id: number, feeStructure: UpdateFeeStructureDto) {
    const isFeeStructureNameExists = await this.db
      .select({ count: count() })
      .from(feeStructuresTable)
      .where(
        and(
          eq(feeStructuresTable.name, feeStructure.name),
          eq(feeStructuresTable.classId, feeStructure.classId),
          eq(feeStructuresTable.academicYearId, feeStructure.academicYearId),
          ne(feeStructuresTable.id, id)
        )
      )
      .then((res) => res[0].count > 0);

    if (isFeeStructureNameExists) {
      throw new BadRequestException(
        'Name already exists for this class and academic year'
      );
    }

    await this.db
      .update(feeStructuresTable)
      .set(feeStructure)
      .where(eq(feeStructuresTable.id, id));

    await this.db
      .delete(feeStructureItemsTable)
      .where(eq(feeStructureItemsTable.feeStructureId, id));
  }
}
