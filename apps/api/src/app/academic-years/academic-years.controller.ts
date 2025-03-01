import { Body, Controller, Get, Param, Post, Put, Query } from '@nestjs/common';
import {
  AcademicYearQueryDto,
  CreateAcademicYearDto,
  UpdateAcademicYearDto,
  UpdateAcademicYearStatusDto,
} from './academic-years.dto';
import { AcademicYearsService } from './academic-years.service';

@Controller('academic-years')
export class AcademicYearsController {
  constructor(private readonly academicYearsService: AcademicYearsService) {}

  @Get()
  async findAll(@Query() query: AcademicYearQueryDto) {
    return this.academicYearsService.findAll(query);
  }

  @Post()
  async create(@Body() body: CreateAcademicYearDto) {
    return this.academicYearsService.create(body);
  }

  @Put(':id')
  async update(@Body() body: UpdateAcademicYearDto, @Param('id') id: number) {
    return this.academicYearsService.update(id, body);
  }

  @Put(':id/status')
  async updateStatus(
    @Body() body: UpdateAcademicYearStatusDto,
    @Param('id') id: number
  ) {
    return this.academicYearsService.updateStatus(id, body.isActive);
  }
}
