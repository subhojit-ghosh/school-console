import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { DRIZZLE, DrizzleDB, studentsTable } from '@school-console/drizzle';
import { and, asc, count, desc, eq, like, ne } from 'drizzle-orm';
import {
  CreateStudentDto,
  StudentQueryDto,
  UpdateStudentDto,
} from './students.dto';

@Injectable()
export class StudentsService {
  constructor(@Inject(DRIZZLE) private db: DrizzleDB) {}

  async findAll(query: StudentQueryDto) {
    const {
      page = 1,
      size = 10,
      sortBy = 'createdAt',
      sortOrder = 'asc',
      id,
      name,
      fatherName,
    } = query;
    const offset = (page - 1) * size;

    const whereConditions: any = [];
    if (id) {
      whereConditions.push(like(studentsTable.id, `%${id}%`));
    }
    if (name) {
      whereConditions.push(like(studentsTable.name, `%${name}%`));
    }
    if (fatherName) {
      whereConditions.push(like(studentsTable.fatherName, `%${fatherName}%`));
    }

    const [students, totalRecords] = await Promise.all([
      this.db
        .select({
          id: studentsTable.id,
          name: studentsTable.name,
          fatherName: studentsTable.fatherName,
          createdAt: studentsTable.createdAt,
          updatedAt: studentsTable.updatedAt,
        })
        .from(studentsTable)
        .where(whereConditions.length > 0 ? and(...whereConditions) : undefined)
        .orderBy(
          sortOrder === 'asc'
            ? asc(studentsTable[sortBy])
            : desc(studentsTable[sortBy])
        )
        .limit(size)
        .offset(offset),
      this.db
        .select({ count: count() })
        .from(studentsTable)
        .where(whereConditions.length > 0 ? and(...whereConditions) : undefined)
        .then((res) => res[0].count),
    ]);

    const totalPages = Math.ceil(totalRecords / size);

    return {
      size,
      page,
      totalPages,
      totalRecords,
      data: students,
    };
  }

  async create(student: CreateStudentDto) {
    const isStudentIdExists = await this.db
      .select({ count: count() })
      .from(studentsTable)
      .where(eq(studentsTable.id, student.id))
      .then((res) => res[0].count > 0);

    if (isStudentIdExists) {
      throw new BadRequestException('ID already exists');
    }

    return await this.db.insert(studentsTable).values(student);
  }

  async update(id: string, student: UpdateStudentDto) {
    const isStudentIdExists = await this.db
      .select({ count: count() })
      .from(studentsTable)
      .where(and(eq(studentsTable.id, student.id), ne(studentsTable.id, id)))
      .then((res) => res[0].count > 0);

    if (isStudentIdExists) {
      throw new BadRequestException('ID already exists');
    }

    return await this.db
      .update(studentsTable)
      .set(student)
      .where(eq(studentsTable.id, id));
  }
}
