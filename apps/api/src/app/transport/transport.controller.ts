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
  Delete,
  Patch,
} from '@nestjs/common';
import { TransportService } from './transport.service';
import {
  CreateTransportDto,
  CreateTransportFeeDto,
  UpdateTransportDto,
} from './transport.dto';
import { Response } from 'express';
import { AuthGuard } from '../auth/auth.guard';
import { AuthUser, IAuthUser } from '../auth/auth-user.decorator';

@Controller('transport')
export class TransportController {
  constructor(private readonly transportService: TransportService) {}

  @Get(`settings/:academicYearId`)
  getByAcadId(@Param('academicYearId') academicYearId: string) {
    return this.transportService.settingsByAcadId(academicYearId);
  }

  @Post('settings')
  configureBase(@Body() createTransportDto: CreateTransportDto) {
    return this.transportService.settings(createTransportDto);
  }

  @Post('fees')
  create(@Body() createTransportFeeDto: CreateTransportFeeDto) {
    return this.transportService.createTransportFee(createTransportFeeDto);
  }

  @Get('fee-items/dropdown/:academicYearId/:studentId')
  findFeeDropdownItemsByStudentAcadId(
    @Param('academicYearId') academicYearId: string,
    @Param('studentId') studentId: string
  ) {
    return this.transportService.findTransportFeeItems(
      academicYearId,
      studentId
    );
  }

  @Get('list/:academicYearId')
  findAll(@Param('academicYearId') academicYearId: string) {
    return this.transportService.findAll(academicYearId);
  }

  @Get('fee-item/:transportId')
  findItemByTransportId(@Param('transportId') transportId: string) {
    return this.transportService.findTransportItemById(transportId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.transportService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateTransportDto: UpdateTransportDto
  ) {
    return this.transportService.update(+id, updateTransportDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.transportService.remove(+id);
  }

  @UseGuards(AuthGuard)
  @Post('/receipt/:id')
  async fetchRecepit(
    @Param('id') id: string,
    @Res({ passthrough: true }) res: Response,
    @AuthUser() user: IAuthUser
  ) {
    // return await this.transportService.getReceipt(id, user);
    res.header('Content-Type', 'application/pdf');
    return new StreamableFile(
      (await this.transportService.getReceipt(id, user)) as any
    );
  }
}
