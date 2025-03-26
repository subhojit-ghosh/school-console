import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { CreateTransactionDto } from './transactions.dto';
import { TransactionsService } from './transactions.service';

@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Get('/fees/:academicYearId/:classId/:studentId')
  async getStudentFeeSummary(
    @Param('academicYearId', ParseIntPipe) academicYearId: number,
    @Param('classId', ParseIntPipe) classId: number,
    @Param('classId', ParseIntPipe) studentId: number
  ) {
    return this.transactionsService.getStudentFeeSummary(
      academicYearId,
      classId,
      studentId
    );
  }

  @Post()
  async create(@Body() dto: CreateTransactionDto) {
    return this.transactionsService.create(dto);
  }
}
