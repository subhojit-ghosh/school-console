import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  academicYearsTable,
  classesTable,
  DRIZZLE,
  DrizzleDB,
  studentsTable,
} from '@school-console/drizzle';
import { and, asc, count, desc, eq, like, max } from 'drizzle-orm';
import * as fs from 'fs';
import { join } from 'path';
import { uploadDirectoryFor } from '../utils';
import {
  CreateStudentDto,
  CreateStudentPersonalInfoDto,
  RemoveDocumentByIdDto,
  StudentDocumentDto,
  StudentQueryDto,
  UpdateStudentDto,
  UpdateStudentGuardianInfoDto,
} from './students.dto';
import { StudentPhotoDocumentType } from './types/student';

@Injectable()
export class StudentsService {
  constructor(
    @Inject(DRIZZLE) private db: DrizzleDB,
    private configService: ConfigService
  ) {}

  async findAll(query: StudentQueryDto) {
    const {
      page = 1,
      size = 10,
      sortBy = 'createdAt',
      sortOrder = 'asc',
      id,
      name,
      fathersName,
      isEnrolled,
      classId,
    } = query;
    const offset = (page - 1) * size;
    const whereConditions: any = [];
    if (id) {
      whereConditions.push(like(studentsTable.id, `%${id}%`));
    }
    if (name) {
      whereConditions.push(like(studentsTable.name, `%${name}%`));
    }
    if (fathersName) {
      whereConditions.push(like(studentsTable.fathersName, `%${fathersName}%`));
    }
    if (isEnrolled) {
      whereConditions.push(eq(studentsTable.isEnrolled, true));
    }
    console.log(classId)
    if (classId) {
      whereConditions.push(eq(studentsTable.classId, classId));
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

  removeFile(file) {
    const filePath = join(
      __dirname,
      this.configService.get('FILE_UPLOAD_PATH') as string,
      file
    );
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
  }

  makeFilePath(fileName) {
    return fileName ? uploadDirectoryFor.studentDoc + '/' + fileName : fileName;
  }

  async uploadDocuments(
    id: string,
    student: StudentDocumentDto,
    files: StudentPhotoDocumentType
  ) {
    const isStudentIdExists: any = await this.db
      .select({
        count: count(),
        studentPhoto: studentsTable.studentPhoto,
        fatherPhoto: studentsTable.fatherPhoto,
        motherPhoto: studentsTable.motherPhoto,
        studentBirthCertificate: studentsTable.studentBirthCertificate,
        studentVacinationRecord: studentsTable.studentVacinationRecord,
        studentMedicalRecord: studentsTable.studentMedicalRecord,

        fatherSignature: studentsTable.fatherSignature,
        motherSignature: studentsTable.motherSignature,
        guardainSignature: studentsTable.guardainSignature,
      })
      .from(studentsTable)
      .where(and(eq(studentsTable.id, Number(id))))
      .then((res) => (res[0].count > 0 ? res[0] : {}));

    // console.log('debug-obj', isStudentIdExists);
    delete isStudentIdExists.count;

    const fileKeys = files;
    const {
      studentPhoto,
      fatherPhoto,
      motherPhoto,
      studentBirthCertificate,
      studentVacinationRecord,
      studentMedicalRecord,

      fatherSignature,
      motherSignature,
      guardainSignature,
    } = files;

    for (const [k, v] of Object.entries(isStudentIdExists)) {
      if (v && Array.isArray(fileKeys[k]) && k !== 'studentMedicalRecord')
        this.removeFile(v as string);
    }

    if (
      (student.medicalHistory === 'Y' &&
        isStudentIdExists.studentMedicalRecord &&
        studentMedicalRecord) ||
      (student.medicalHistory === 'N' && isStudentIdExists.studentMedicalRecord)
    )
      this.removeFile(isStudentIdExists.studentMedicalRecord);

    const set = {
      studentPhoto: this.makeFilePath(
        (studentPhoto && studentPhoto[0].filename) ||
          isStudentIdExists.studentPhoto ||
          null
      ),
      fatherPhoto: this.makeFilePath(
        (fatherPhoto && fatherPhoto[0].filename) ||
          isStudentIdExists.fatherPhoto ||
          null
      ),
      motherPhoto: this.makeFilePath(
        (motherPhoto && motherPhoto[0].filename) ||
          isStudentIdExists.motherPhoto ||
          null
      ),
      studentBirthCertificate: this.makeFilePath(
        (studentBirthCertificate && studentBirthCertificate[0].filename) ||
          isStudentIdExists.studentBirthCertificate ||
          null
      ),
      studentVacinationRecord: this.makeFilePath(
        (studentVacinationRecord && studentVacinationRecord[0].filename) ||
          isStudentIdExists.studentVacinationRecord ||
          null
      ),
      studentMedicalRecord:
        student.medicalHistory === 'N'
          ? null
          : studentMedicalRecord && studentMedicalRecord[0].filename
          ? this.makeFilePath(studentMedicalRecord[0].filename)
          : this.makeFilePath(isStudentIdExists.studentMedicalRecord),
      fatherSignature: this.makeFilePath(
        (fatherSignature && fatherSignature[0].filename) ||
          isStudentIdExists.fatherSignature ||
          null
      ),
      motherSignature: this.makeFilePath(
        (motherSignature && motherSignature[0].filename) ||
          isStudentIdExists.motherSignature ||
          null
      ),
      guardainSignature: this.makeFilePath(
        (guardainSignature && guardainSignature[0].filename) ||
          isStudentIdExists.guardainSignature ||
          null
      ),

      medicalHistory: student.medicalHistory === 'Y' ? true : false,
      medicalHistoryDetails:
        student.medicalHistory === 'N' ? null : student.medicalHistoryDetails,
    };

    return await this.db
      .update(studentsTable)
      .set(set)
      .where(eq(studentsTable.id, Number(id)));
  }

  async removeDocumentById(id: string, body: RemoveDocumentByIdDto) {
    const isStudent: any = await this.db
      .select({
        count: count(),
      })
      .from(studentsTable)
      .where(
        and(
          eq(studentsTable.id, Number(id)),
          eq(studentsTable[body.fileKey], body.fileName)
        )
      )
      .then((res) => (res[0].count > 0 ? res[0] : {}));

    this.removeFile(body.fileName);
    return await this.db.update(studentsTable).set({
      [body.fileKey]: null,
    });
  }

  async findAllClassesForStudentsDropdown(classId: string, enrolled = 0) {
    return await this.db
      .select({
        id: studentsTable.id,
        name: studentsTable.name,
        regId: studentsTable.regId,
        isEnrolled: studentsTable.isEnrolled,
        enrolledNo: studentsTable.enrolledNo,
      })
      .from(studentsTable)
      .where(
        and(
          eq(studentsTable.classId, Number(classId)),
          eq(studentsTable.isEnrolled, Boolean(enrolled))
        )
      )
      .orderBy(desc(studentsTable.name));
  }
}
