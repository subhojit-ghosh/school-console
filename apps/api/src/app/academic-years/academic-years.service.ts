import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import {
  DRIZZLE,
  DrizzleDB,
  academicYearsTable,
} from '@school-console/drizzle';
import { extractNumber } from '@school-console/utils';
import { and, asc, count, desc, eq, gte, like, lte, ne, or } from 'drizzle-orm';
import {
  AcademicYearQueryDto,
  CreateAcademicYearDto,
  UpdateAcademicYearDto,
} from './academic-years.dto';

@Injectable()
export class AcademicYearsService {
  constructor(@Inject(DRIZZLE) private db: DrizzleDB) {}

  async findAll(query: AcademicYearQueryDto) {
    const {
      page = 1,
      size = 10,
      sortBy = 'createdAt',
      sortOrder = 'asc',
      name,
    } = query;
    const offset = (page - 1) * size;

    const whereConditions: any = [];
    if (name) {
      whereConditions.push(like(academicYearsTable.name, `%${name}%`));
    }

    const [academicYears, totalRecords] = await Promise.all([
      this.db
        .select({
          id: academicYearsTable.id,
          name: academicYearsTable.name,
          startDate: academicYearsTable.startDate,
          endDate: academicYearsTable.endDate,
          studentIdPrefix: academicYearsTable.studentIdPrefix,
          lateFinePerDay: academicYearsTable.lateFinePerDay,
          isActive: academicYearsTable.isActive,
          createdAt: academicYearsTable.createdAt,
          updatedAt: academicYearsTable.updatedAt,
        })
        .from(academicYearsTable)
        .where(whereConditions.length > 0 ? and(...whereConditions) : undefined)
        .orderBy(
          sortOrder === 'asc'
            ? asc(academicYearsTable[sortBy])
            : desc(academicYearsTable[sortBy])
        )
        .limit(size)
        .offset(offset),
      this.db
        .select({ count: count() })
        .from(academicYearsTable)
        .where(whereConditions.length > 0 ? and(...whereConditions) : undefined)
        .then((res) => res[0].count),
    ]);

    const totalPages = Math.ceil(totalRecords / size);

    return {
      size,
      page,
      totalPages,
      totalRecords,
      data: academicYears,
    };
  }

  async nextStudentIdPrefix() {
    const academicYear = await this.db
      .select({
        studentIdPrefix: academicYearsTable.studentIdPrefix,
      })
      .from(academicYearsTable)
      .orderBy(desc(academicYearsTable.studentIdPrefix))
      .limit(1);

    if (academicYear.length === 0) {
      return {
        prefix: 'J-11',
      };
    }

    const lastNumber = extractNumber(academicYear[0].studentIdPrefix);

    if (!lastNumber) {
      return 'J-11';
    }

    return {
      nextNumber: lastNumber + 1,
      prefix: `J-${lastNumber + 1}`,
    };
  }

  async findAllForDropdown() {
    const academicYears = await this.db
      .select({
        id: academicYearsTable.id,
        name: academicYearsTable.name,
        isActive: academicYearsTable.isActive,
      })
      .from(academicYearsTable)
      .orderBy(desc(academicYearsTable.name));

    return {
      data: academicYears,
    };
  }

  async create(academicYear: CreateAcademicYearDto) {
    const isAcademicYearNameExists = await this.db
      .select({ count: count() })
      .from(academicYearsTable)
      .where(eq(academicYearsTable.name, academicYear.name))
      .then((res) => res[0].count > 0);

    if (isAcademicYearNameExists) {
      throw new BadRequestException('Name already exists');
    }

    const isDateOverlapping = await this.db
      .select({ count: count() })
      .from(academicYearsTable)
      .where(
        or(
          and(
            gte(academicYearsTable.startDate, academicYear.startDate),
            lte(academicYearsTable.startDate, academicYear.endDate)
          ),
          and(
            gte(academicYearsTable.endDate, academicYear.startDate),
            lte(academicYearsTable.endDate, academicYear.endDate)
          )
        )
      )
      .then((res) => res[0].count > 0);

    if (isDateOverlapping) {
      throw new BadRequestException(
        'Date range overlaps with an existing academic year'
      );
    }

    const isStudentPrefixExists = await this.db
      .select({
        name: academicYearsTable.name,
        count: count(),
      })
      .from(academicYearsTable)
      .where(
        eq(academicYearsTable.studentIdPrefix, academicYear.studentIdPrefix)
      )
      .then((res) => (res[0].count > 0 ? { name: res[0].name } : {}));

    if (isStudentPrefixExists && isStudentPrefixExists.name) {
      throw new BadRequestException(
        `Student Prefix already exists for academic year ${isStudentPrefixExists.name}.`
      );
    }

    return await this.db.insert(academicYearsTable).values(academicYear);
  }

  async update(id: number, academicYear: UpdateAcademicYearDto) {
    const isAcademicYearNameExists = await this.db
      .select({ count: count() })
      .from(academicYearsTable)
      .where(
        and(
          eq(academicYearsTable.name, academicYear.name),
          ne(academicYearsTable.id, id)
        )
      )
      .then((res) => res[0].count > 0);

    if (isAcademicYearNameExists) {
      throw new BadRequestException('Name already exists');
    }

    const isDateOverlapping = await this.db
      .select({ count: count() })
      .from(academicYearsTable)
      .where(
        and(
          ne(academicYearsTable.id, id),
          or(
            and(
              gte(academicYearsTable.startDate, academicYear.startDate),
              lte(academicYearsTable.startDate, academicYear.endDate)
            ),
            and(
              gte(academicYearsTable.endDate, academicYear.startDate),
              lte(academicYearsTable.endDate, academicYear.endDate)
            )
          )
        )
      )
      .then((res) => res[0].count > 0);

    if (isDateOverlapping) {
      throw new BadRequestException(
        'Date range overlaps with an existing academic year'
      );
    }

    const isStudentPrefixExists = await this.db
      .select({
        name: academicYearsTable.name,
        count: count(),
      })
      .from(academicYearsTable)
      .where(
        and(
          eq(academicYearsTable.studentIdPrefix, academicYear.studentIdPrefix),
          ne(academicYearsTable.id, id)
        )
      )
      .then((res) => (res[0].count > 0 ? { name: res[0].name } : {}));

    if (isStudentPrefixExists && isStudentPrefixExists.name) {
      throw new BadRequestException(
        `Student Prefix already exists for academic year ${isStudentPrefixExists.name}.`
      );
    }

    return await this.db
      .update(academicYearsTable)
      .set(academicYear)
      .where(eq(academicYearsTable.id, id));
  }

  async updateStatus(id: number, isActive: boolean) {
    await this.db
      .update(academicYearsTable)
      .set({
        isActive: false,
      })
      .where(eq(academicYearsTable.isActive, true));

    return await this.db
      .update(academicYearsTable)
      .set({
        isActive,
      })
      .where(eq(academicYearsTable.id, id));
  }
}
