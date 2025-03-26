import {
  IsNotEmpty,
  IsNumber,
  IsString,
  ValidateNested,
  ArrayMinSize,
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

  @ValidateNested({ each: true })
  @ArrayMinSize(1)
  @Type(() => TransactionItemDto)
  items: TransactionItemDto[];
}
