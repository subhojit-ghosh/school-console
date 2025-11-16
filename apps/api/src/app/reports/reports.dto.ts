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
  @Transform(({ value }) =>
    value === '' || value === null || typeof value === 'undefined'
      ? undefined
      : Number(value)
  )
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

export class TransactionHistoryQueryDto extends BaseReportFilterDto {
  @IsOptional()
  @Transform(({ value }) =>
    value === '' || value === null || typeof value === 'undefined'
      ? undefined
      : String(value)
  )
  @IsIn(['Cash', 'Card', 'Online', 'UPI', 'Cheque'])
  mode?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  page?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  size?: number;

  @IsOptional()
  @IsIn(['createdAt'])
  sortBy?: 'createdAt';

  @IsOptional()
  @IsIn(['asc', 'desc'])
  sortOrder?: 'asc' | 'desc';

  @IsOptional()
  @Transform(({ value }) => (value ? String(value) : undefined))
  student?: string;
}

export class ConcessionReportQueryDto extends BaseReportFilterDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  page?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  size?: number;

  @IsOptional()
  @Transform(({ value }) => (value ? String(value) : undefined))
  student?: string;
}
