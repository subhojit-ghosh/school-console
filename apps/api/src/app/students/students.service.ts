import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import {
  academicYearsTable,
  classesTable,
  DRIZZLE,
  DrizzleDB,
  studentsTable,
} from '@school-console/drizzle';
import { and, asc, count, desc, eq, like, max, ne } from 'drizzle-orm';
import {
  CreateStudentDto,
  CreateStudentPersonalInfoDto,
  StudentQueryDto,
  UpdateStudentDto,
  UpdateStudentGuardianInfoDto,
} from './students.dto';

@Injectable()
export class StudentsService {
  constructor(@Inject(DRIZZLE) private db: DrizzleDB) {}

  async findAllEnrolled(query: StudentQueryDto) {
    const {
      page = 1,
      size = 10,
      sortBy = 'createdAt',
      sortOrder = 'asc',
      id,
      name,
      fathersName,
    } = query;
    const offset = (page - 1) * size;
    const whereConditions: any = [eq(studentsTable.isEnrolled, true)];
    if (id) {
      whereConditions.push(like(studentsTable.id, `%${id}%`));
    }
    if (name) {
      whereConditions.push(like(studentsTable.name, `%${name}%`));
    }
    if (fathersName) {
      whereConditions.push(like(studentsTable.fathersName, `%${fathersName}%`));
    }
    const [students, totalRecords] = await Promise.all([
      this.db
        .select({
          id: studentsTable.id,
          recordNo: studentsTable.enrolledNo,
          name: studentsTable.name,
          fathersName: studentsTable.fathersName,
          mothersName: studentsTable.mothersName,
          createdAt: studentsTable.createdAt,
          updatedAt: studentsTable.updatedAt,
          class: classesTable.name,
        })
        .from(studentsTable)
        .innerJoin(classesTable, eq(studentsTable.classId, classesTable.id))
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

  async findAll(query: StudentQueryDto) {
    const {
      page = 1,
      size = 10,
      sortBy = 'createdAt',
      sortOrder = 'asc',
      id,
      name,
      fathersName,
    } = query;
    const offset = (page - 1) * size;
    const whereConditions: any = [eq(studentsTable.isEnrolled, false)];
    if (id) {
      whereConditions.push(like(studentsTable.id, `%${id}%`));
    }
    if (name) {
      whereConditions.push(like(studentsTable.name, `%${name}%`));
    }
    if (fathersName) {
      whereConditions.push(like(studentsTable.fathersName, `%${fathersName}%`));
    }
    const [students, totalRecords] = await Promise.all([
      this.db
        .select({
          id: studentsTable.id,
          recordNo: studentsTable.regId,
          name: studentsTable.name,
          fathersName: studentsTable.fathersName,
          mothersName: studentsTable.mothersName,
          createdAt: studentsTable.createdAt,
          updatedAt: studentsTable.updatedAt,
          class: classesTable.name,
        })
        .from(studentsTable)
        .innerJoin(classesTable, eq(studentsTable.classId, classesTable.id))
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

  async findById(id: string) {
    return await this.db
      .select()
      .from(studentsTable)
      .where(eq(studentsTable.id, Number(id)))
      .limit(1)
      .then((res) => (res.length ? res[0] : {}));
  }

  async createStudentPersonalInfo(student: CreateStudentPersonalInfoDto) {
    if (student.id) {
      const isStudentIdExists = await this.db
        .select({ count: count() })
        .from(studentsTable)
        .where(eq(studentsTable.id, student.id))
        .then((res) => res[0].count > 0);
      if (isStudentIdExists)
        return await this.db
          .update(studentsTable)
          .set({ ...student })
          .where(eq(studentsTable.id, Number(student.id)));
    }

    const lastRecordId = await this.db
      .select({
        value: count(),
      })
      .from(studentsTable)
      .then((res) => res[0].value);
    return await this.db
      .insert(studentsTable)
      .values({ ...student, regId: `REG-${(lastRecordId || 0) + 1}` });
  }

  async updateStudentGuardianInfo(
    id: string,
    student: UpdateStudentGuardianInfoDto
  ) {
    return await this.db
      .update(studentsTable)
      .set(student)
      .where(eq(studentsTable.id, Number(id)));
  }

  async enrolledStudent(id: string) {
    const lastRecordId = await this.db
      .select({
        value: max(studentsTable.enrolledId),
      })
      .from(studentsTable)
      .then((res) => res[0].value);

    const studentIdPrefix = await this.db
      .select({
        value: academicYearsTable.studentIdPrefix,
      })
      .from(academicYearsTable)
      .where(eq(academicYearsTable.isActive, true))
      .then((res) => res[0]);

    const enrolledId = lastRecordId ? Number(lastRecordId) + 1 : 1;
    const enrolledNo = `${studentIdPrefix.value}${String(enrolledId).padStart(
      6,
      '0'
    )}`;

    return this.db
      .update(studentsTable)
      .set({
        enrolledId: String(enrolledId),
        enrolledNo: enrolledNo,
        isEnrolled: true,
      })
      .where(eq(studentsTable.id, Number(id)));
  }

  async create(student: CreateStudentDto) {
    // const isStudentIdExists = await this.db
    //   .select({ count: count() })
    //   .from(studentsTable)
    //   .where(eq(studentsTable.id, student.id))
    //   .then((res) => res[0].count > 0);

    // if (isStudentIdExists) {
    //   throw new BadRequestException('ID already exists');
    // }

    return await this.db.insert(studentsTable).values(student);
  }

  async update(id: string, student: UpdateStudentDto) {
    // const isStudentIdExists = await this.db
    //   .select({ count: count() })
    //   .from(studentsTable)
    //   .where(and(eq(studentsTable.id, student.id), ne(studentsTable.id, id)))
    //   .then((res) => res[0].count > 0);
    // if (isStudentIdExists) {
    //   throw new BadRequestException('ID already exists');
    // }
    // return await this.db
    //   .update(studentsTable)
    //   .set(student)
    //   .where(eq(studentsTable.id, id));
  }
}
