import { Controller, Get, Query } from '@nestjs/common';
import { ReportsService } from './reports.service';

@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('dues')
  getDues(
    @Query('academicYearId') academicYearId: string,
    @Query('classId') classId: string,
    @Query('studentId') studentId?: string
  ) {
    return this.reportsService.getDues(
      Number(academicYearId),
      Number(classId),
      studentId ? Number(studentId) : null
    );
  }
}
