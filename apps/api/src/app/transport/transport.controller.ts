import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { TransportService } from './transport.service';
import {
  CreateTransportDto,
  CreateTransportFeeDto,
  UpdateTransportDto,
} from './transport.dto';

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
}
