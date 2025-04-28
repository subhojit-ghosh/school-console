import { Body, Controller, Get, Param, Post, Put, Query } from '@nestjs/common';
import {
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

  @Put(':id')
  async update(@Body() body: UpdateAcademicFeeDto, @Param('id') id: number) {
    return this.academicFeeService.update(id, body);
  }

  @Post('bulk-add-edit')
  async bulkAddEdit(@Body() body: UpdateAcademicFeeDto[]) {
    return this.academicFeeService.bulkAddEdit(body);
  }

  @Post('delete/:id')
  async deleteByid(@Param('id') id: string) {
    return this.academicFeeService.deleteById(id);
  }
}
