import { Body, Controller, Get, Param, Post, Put, Query } from '@nestjs/common';
import {
  CreateFeeStructureDto,
  FeeStructureQueryDto,
  UpdateFeeStructureDto,
} from './fee-structures.dto';
import { FeeStructuresService } from './fee-structures.service';

@Controller('fee-structures')
export class FeeStructuresController {
  constructor(private readonly feeStructuresService: FeeStructuresService) {}

  @Get()
  async findAll(@Query() query: FeeStructureQueryDto) {
    return this.feeStructuresService.findAll(query);
  }

  @Post()
  async create(@Body() body: CreateFeeStructureDto) {
    return this.feeStructuresService.create(body);
  }

  @Put(':id')
  async update(@Body() body: UpdateFeeStructureDto, @Param('id') id: number) {
    return this.feeStructuresService.update(id, body);
  }
}
