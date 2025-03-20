import { Body, Controller, Get, Param, Post, Put, Query } from '@nestjs/common';
import {
  CreateStudentDto,
  CreateStudentPersonalInfoDto,
  StudentQueryDto,
  UpdateStudentDto,
  UpdateStudentGuardianInfoDto,
} from './students.dto';
import { StudentsService } from './students.service';

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
}
