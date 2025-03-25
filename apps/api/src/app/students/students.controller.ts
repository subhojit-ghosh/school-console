import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  CreateStudentDto,
  CreateStudentPersonalInfoDto,
  RemoveDocumentByIdDto,
  StudentDocumentDto,
  StudentQueryDto,
  UpdateStudentDto,
  UpdateStudentGuardianInfoDto,
} from './students.dto';
import { StudentsService } from './students.service';
import {
  FileFieldsInterceptor,
  FileInterceptor,
} from '@nestjs/platform-express';
import { StudentPhotoDocumentType } from './types/student';
import { AuthUser, IAuthUser } from '../auth/auth-user.decorator';
import { AuthGuard } from '../auth/auth.guard';

@Controller('students')
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  @Get()
  async findAll(@Query() query: StudentQueryDto) {
    return this.studentsService.findAll(query);
  }

  @Get('enrolled')
  async findAllEnrolled(@Query() query: StudentQueryDto) {
    return this.studentsService.findAllEnrolled(query);
  }

  @Get(':id')
  async getStudentById(@Param('id') id: string) {
    return this.studentsService.findById(id);
  }

  @Get('byclass/dropdown/:id/:enrolled')
  async findAllClassesForStudentsDropdown(
    @Param('id') id: string,
    @Param('enrolled') enrolled: string
  ) {
    return this.studentsService.findAllClassesForStudentsDropdown(
      id,
      Number(enrolled)
    );
  }

  @Post('personal')
  async studentInfo(@Body() body: CreateStudentPersonalInfoDto) {
    return this.studentsService.createStudentPersonalInfo(body);
  }

  @Put('guardian-info/:id')
  async updateGuardianInfo(
    @Body() body: UpdateStudentGuardianInfoDto,
    @Param('id') id: string
  ) {
    return this.studentsService.updateStudentGuardianInfo(id, body);
  }

  @Post()
  async create(@Body() body: CreateStudentDto) {
    return this.studentsService.create(body);
  }

  @Put(':id')
  async update(@Body() body: UpdateStudentDto, @Param('id') id: string) {
    return this.studentsService.update(id, body);
  }

  @Put('enrolled/:id')
  async enrolledStudent(@Param('id') id: string) {
    return this.studentsService.enrolledStudent(id);
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    console.log('debug-file', file);
    return 'Ani';
  }

  @Post('uploads/:id')
  @UseInterceptors(
    FileFieldsInterceptor([
      {
        name: 'studentPhoto',
        maxCount: 1,
      },
      {
        name: 'fatherPhoto',
        maxCount: 1,
      },
      {
        name: 'motherPhoto',
        maxCount: 1,
      },
      {
        name: 'studentBirthCertificate',
        maxCount: 1,
      },
      {
        name: 'studentVacinationRecord',
        maxCount: 1,
      },
      {
        name: 'studentMedicalRecord',
        maxCount: 1,
      },
      {
        name: 'fatherSignature',
        maxCount: 1,
      },
      {
        name: 'motherSignature',
        maxCount: 1,
      },
      {
        name: 'guardainSignature',
        maxCount: 1,
      },
    ])
  )
  uploadFiles(
    @Param('id') id: string,
    @Body() body: StudentDocumentDto,
    @UploadedFiles() files: StudentPhotoDocumentType
  ) {
    return this.studentsService.uploadDocuments(id, body, files);
  }

  @Post('delete/document/:id')
  removeDocument(@Param('id') id: string, @Body() body: RemoveDocumentByIdDto) {
    return this.studentsService.removeDocumentById(id, body);
  }
}
