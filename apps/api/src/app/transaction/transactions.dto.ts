import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateTransactionDto {
  @IsNotEmpty()
  @IsNumber()
  feeId: number; // Academic Fee ID

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
  @IsNumber()
  payable: number;

  @IsNotEmpty()
  @IsNumber()
  paid: number;

  @IsNotEmpty()
  @IsNumber()
  due: number;

  @IsNotEmpty()
  @IsString()
  mode: string; // Cash, Card, Online, etc.
}
