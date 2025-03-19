import { FeeCategory } from '@school-console/utils';
import { Type } from 'class-transformer';
import {
  IsDateString,
  IsEnum,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  ValidateIf,
} from 'class-validator';

export class CreateAcademicFeeDto {
  @IsInt()
  @IsPositive()
  academicYearId: number;

  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  classId: number;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEnum(FeeCategory)
  @IsNotEmpty()
  category: string;

  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  amount: number;

  @IsDateString()
  @IsOptional()
  @ValidateIf((o) => o.category !== FeeCategory.Enrollment)
  dueDate: Date;
}

export class UpdateAcademicFeeDto extends CreateAcademicFeeDto {}

export class FeeQueryDto {
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
  category?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  classId?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  academicYearId?: number;
}
