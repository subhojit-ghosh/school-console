import { Body, Controller, Get, Param, Post, Put, Query } from '@nestjs/common';
import { CreateFeeDto, FeeQueryDto, UpdateFeeDto } from './fees.dto';
import { FeeService } from './fees.service';

@Controller('fees')
export class FeeController {
  constructor(private readonly feeService: FeeService) {}

  @Get()
  async findAll(@Query() query: FeeQueryDto) {
    return this.feeService.findAll(query);
  }

  @Post()
  async create(@Body() body: CreateFeeDto) {
    return this.feeService.create(body);
  }

  @Put(':id')
  async update(@Body() body: UpdateFeeDto, @Param('id') id: number) {
    return this.feeService.update(id, body);
  }
}
