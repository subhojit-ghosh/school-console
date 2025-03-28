import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
  Res,
  StreamableFile,
} from '@nestjs/common';
import { CreateTransactionDto, TransactionQueryDto } from './transactions.dto';
import { TransactionsService } from './transactions.service';
import { ReadStream } from 'fs';

@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Get()
  async findAll(@Query() query: TransactionQueryDto) {
    return this.transactionsService.findAll(query);
  }

  @Get('/fees/:academicYearId/:classId/:studentId')
  async getStudentFeeSummary(
    @Param('academicYearId', ParseIntPipe) academicYearId: number,
    @Param('classId', ParseIntPipe) classId: number,
    @Param('studentId', ParseIntPipe) studentId: number
  ) {
    return this.transactionsService.getStudentFeeSummary(
      academicYearId,
      classId,
      studentId,
      5
    );
  }

  @Post()
  async create(@Body() dto: CreateTransactionDto) {
    return this.transactionsService.create(dto);
  }

  @Post('/receipt/:id')
  async fetchRecepit(
    @Param('id') id: string,
    @Res({ passthrough: true }) res: Response
  ) {
    //@ts-ignore
    res.header('Content-Type', 'application/pdf');
    return new StreamableFile(
      (await this.transactionsService.getReceipt(id)) as any
    );
  }
}
