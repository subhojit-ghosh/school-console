import { Body, Controller, Get, Param, Post, Put, Query } from '@nestjs/common';
import {
  AcademicFeeDto,
  CreateAcademicFeeDto,
  FeeQueryDto,
  UpdateAcademicFeeDto,
} from './academic-fees.dto';
import { AcademicFeeService } from './academic-fees.service';

@Controller('academic-fees')
export class AcademicFeeController {
  constructor(private academicFeeService: AcademicFeeService) {}

  @Get()
  async findAll(@Query() query: FeeQueryDto) {
    return this.academicFeeService.findAll(query);
  }

  @Post()
  async create(@Body() body: CreateAcademicFeeDto) {
    return this.academicFeeService.create(body);
  }

  @Put()
  async upsert(@Body() body: AcademicFeeDto) {
    return this.academicFeeService.upsert(body);
  }

  @Put(':id')
  async update(@Body() body: UpdateAcademicFeeDto, @Param('id') id: number) {
    return this.academicFeeService.update(id, body);
  }
}
