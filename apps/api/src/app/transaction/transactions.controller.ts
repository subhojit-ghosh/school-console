import { Body, Controller, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './transactions.dto';

@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Get('/fees/:academicYearId/:classId')
  async getAcademicFees(
    @Param('academicYearId', ParseIntPipe) academicYearId: number,
    @Param('classId', ParseIntPipe) classId: number
  ) {
    return this.transactionsService.getAcademicFees(academicYearId, classId);
  }

  @Get('/student/:studentId/:academicYearId')
  async getStudentTransactions(
    @Param('studentId', ParseIntPipe) studentId: number,
    @Param('academicYearId', ParseIntPipe) academicYearId: number
  ) {
    return this.transactionsService.getStudentTransactions(
      studentId,
      academicYearId
    );
  }

  @Post()
  async collectFee(@Body() dto: CreateTransactionDto) {
    return this.transactionsService.collectFee(dto);
  }
}
