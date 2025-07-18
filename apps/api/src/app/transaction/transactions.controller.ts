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
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthUser, IAuthUser } from '../auth/auth-user.decorator';
import { AuthGuard } from '../auth/auth.guard';
import { CreateTransactionDto, TransactionQueryDto } from './transactions.dto';
import { TransactionsService } from './transactions.service';

@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Get()
  async findAll(@Query() query: TransactionQueryDto) {
    return this.transactionsService.findAll(query);
  }

  @Get(':id/items')
  async findItems(@Param('id') id: string) {
    return this.transactionsService.findItems(Number(id));
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
      studentId
    );
  }

  @UseGuards(AuthGuard)
  @Post()
  async create(@Body() dto: CreateTransactionDto, @AuthUser() user: IAuthUser) {
    return this.transactionsService.create(dto, user.id);
  }

  @UseGuards(AuthGuard)
  @Post('/receipt/:id')
  async fetchRecepit(
    @Param('id') id: string,
    @Res({ passthrough: true }) res: Response
  ) {
    res.header('Content-Type', 'application/pdf');
    return new StreamableFile(
      (await this.transactionsService.getReceipt(id)) as any
    );
  }
}
