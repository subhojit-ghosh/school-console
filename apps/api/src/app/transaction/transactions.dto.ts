import {
  IsNotEmpty,
  IsNumber,
  IsString,
  ValidateNested,
  ArrayMinSize,
  IsOptional,
  IsIn,
  IsInt,
  IsPositive,
} from 'class-validator';
import { Type } from 'class-transformer';

class TransactionItemDto {
  @IsNotEmpty()
  @IsNumber()
  academicFeeId: number;

  @IsNotEmpty()
  @IsNumber()
  concession: number;

  @IsNotEmpty()
  @IsNumber()
  paid: number;
}

export class CreateTransactionDto {
  @IsNotEmpty()
  @IsNumber()
  academicYearId: number;

  @IsNotEmpty()
  @IsNumber()
  studentId: number;

  @IsNotEmpty()
  @IsNumber()
  classId: number;

  @IsNotEmpty()
  @IsString()
  mode: string; // Cash, Card, Online, etc.

  @IsOptional()
  @IsString()
  note?: string;

  @ValidateNested({ each: true })
  @ArrayMinSize(1)
  @Type(() => TransactionItemDto)
  items: TransactionItemDto[];
}

export class TransactionQueryDto {
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
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  classId?: number;
}
