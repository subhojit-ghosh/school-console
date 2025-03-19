import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsDateString,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';

export class CreateAcademicYearDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsDateString()
  @IsNotEmpty()
  startDate: Date;

  @IsDateString()
  @IsNotEmpty()
  endDate: Date;

  @IsOptional()
  studentIdPrefix: string;
}

export class UpdateAcademicYearDto extends CreateAcademicYearDto {}

export class UpdateAcademicYearStatusDto {
  @IsBoolean()
  @IsNotEmpty()
  isActive: boolean;
}

export class AcademicYearQueryDto {
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
  @IsString()
  sortBy?: string;

  @IsOptional()
  @IsIn(['asc', 'desc'])
  sortOrder?: 'asc' | 'desc';

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  studentIdPrefix?: string;
}
