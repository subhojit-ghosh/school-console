import { Controller, Get, Query, Res } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { CollectionSummaryQueryDto, DuesReportQueryDto } from './reports.dto';
import { Response } from 'express';

@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('collection-summary')
  getCollectionSummary(@Query() query: CollectionSummaryQueryDto) {
    return this.reportsService.getCollectionSummary(query);
  }

  @Get('collection-summary/export')
  exportCollectionSummary(
    @Query() query: CollectionSummaryQueryDto,
    @Res() res: Response
  ) {
    return this.reportsService.exportCollectionSummary(query, res);
  }

  @Get('dues')
  getDues(@Query() query: DuesReportQueryDto) {
    return this.reportsService.getDues(query);
  }

  @Get('dues/export')
  exportDues(@Query() query: DuesReportQueryDto, @Res() res: Response) {
    return this.reportsService.exportDues(query, res);
  }
}
