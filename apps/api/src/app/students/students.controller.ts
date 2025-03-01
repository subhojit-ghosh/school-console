import { Body, Controller, Get, Param, Post, Put, Query } from '@nestjs/common';
import {
  CreateStudentDto,
  StudentQueryDto,
  UpdateStudentDto,
} from './students.dto';
import { StudentsService } from './students.service';

@Controller('students')
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  @Get()
  async findAll(@Query() query: StudentQueryDto) {
    return this.studentsService.findAll(query);
  }

  @Post()
  async create(@Body() body: CreateStudentDto) {
    return this.studentsService.create(body);
  }

  @Put(':id')
  async update(@Body() body: UpdateStudentDto, @Param('id') id: string) {
    return this.studentsService.update(id, body);
  }
}
