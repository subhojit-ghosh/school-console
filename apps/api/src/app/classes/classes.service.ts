import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { DRIZZLE, DrizzleDB, classesTable } from '@school-console/drizzle';
import { and, asc, count, desc, eq, like, ne } from 'drizzle-orm';
import { ClassQueryDto, CreateClassDto, UpdateClassDto } from './classes.dto';

@Injectable()
export class ClassesService {
  constructor(@Inject(DRIZZLE) private db: DrizzleDB) {}

  async findAll(query: ClassQueryDto) {
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
      whereConditions.push(like(classesTable.name, `%${name}%`));
    }

    const [classes, totalRecords] = await Promise.all([
      this.db
        .select({
          id: classesTable.id,
          name: classesTable.name,
          sections: classesTable.sections,
          createdAt: classesTable.createdAt,
          updatedAt: classesTable.updatedAt,
        })
        .from(classesTable)
        .where(whereConditions.length > 0 ? and(...whereConditions) : undefined)
        .orderBy(
          sortOrder === 'asc'
            ? asc(classesTable[sortBy])
            : desc(classesTable[sortBy])
        )
        .limit(size)
        .offset(offset),
      this.db
        .select({ count: count() })
        .from(classesTable)
        .where(whereConditions.length > 0 ? and(...whereConditions) : undefined)
        .then((res) => res[0].count),
    ]);

    const totalPages = Math.ceil(totalRecords / size);

    return {
      size,
      page,
      totalPages,
      totalRecords,
      data: classes,
    };
  }

  async create(payload: CreateClassDto) {
    const isClassNameExists = await this.db
      .select({ count: count() })
      .from(classesTable)
      .where(eq(classesTable.name, payload.name))
      .then((res) => res[0].count > 0);

    if (isClassNameExists) {
      throw new BadRequestException('Name already exists');
    }

    return await this.db.insert(classesTable).values(payload);
  }

  async update(id: number, classData: UpdateClassDto) {
    const isClassNameExists = await this.db
      .select({ count: count() })
      .from(classesTable)
      .where(
        and(eq(classesTable.name, classData.name), ne(classesTable.id, id))
      )
      .then((res) => res[0].count > 0);

    if (isClassNameExists) {
      throw new BadRequestException('Name already exists');
    }

    return await this.db
      .update(classesTable)
      .set(classData)
      .where(eq(classesTable.id, id));
  }
}
