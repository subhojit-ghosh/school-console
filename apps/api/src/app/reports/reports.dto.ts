import { Transform, Type } from 'class-transformer';
import {
  IsBoolean,
  IsDateString,
  IsIn,
  IsInt,
  IsNumber,
  IsOptional,
  IsPositive,
} from 'class-validator';

export class BaseReportFilterDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  academicYearId?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  classId?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  userId?: number;

  @IsOptional()
  @IsDateString()
  dateFrom?: string;

  @IsOptional()
  @IsDateString()
  dateTo?: string;

  @IsOptional()
  @IsIn(['Cash', 'Card', 'Online', 'UPI', 'Cheque'])
  mode?: string;

  @IsOptional()
  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  isEnrolled?: boolean;
}

export class CollectionSummaryQueryDto extends BaseReportFilterDto {
  @IsOptional()
  @IsIn(['day', 'month', 'year'])
  groupBy?: 'day' | 'month' | 'year';
}

export class DuesReportQueryDto extends BaseReportFilterDto {
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  academicYearId!: number;

  @Type(() => Number)
  @IsInt()
  @IsPositive()
  classId!: number;

  @IsOptional()
  @Transform(({ value }) =>
    value === '' || value === null || typeof value === 'undefined'
      ? undefined
      : Number(value)
  )
  studentId?: number;
}
