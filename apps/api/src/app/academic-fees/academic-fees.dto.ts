import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsDateString,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  ValidateNested,
} from 'class-validator';

class FeeItem {
  @IsNumber()
  @IsOptional()
  id: number;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  amount: number;

  @IsDateString()
  @IsOptional()
  dueDate: Date;
}

export class AcademicFeeDto {
  @IsInt()
  @IsPositive()
  academicYearId: number;

  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  classId: number;

  @ValidateNested({ each: true })
  @ArrayMinSize(1)
  @Type(() => FeeItem)
  items: FeeItem[];
}

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

  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  amount: number;

  @IsDateString()
  @IsOptional()
  dueDate: Date;
}

export class UpdateAcademicFeeDto extends CreateAcademicFeeDto {
  @IsInt()
  @IsOptional()
  id: number;
}

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
  @Type(() => Number)
  @IsInt()
  classId?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  academicYearId?: number;
}
