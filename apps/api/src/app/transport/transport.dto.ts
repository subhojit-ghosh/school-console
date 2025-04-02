import { PartialType } from '@nestjs/mapped-types';
import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateTransportDto {
  @IsInt()
  @IsOptional()
  id: number;

  @IsInt()
  @IsNotEmpty()
  academicYearId: number;

  @IsInt()
  @IsNotEmpty()
  baseAmount: number;

  @IsInt()
  @IsNotEmpty()
  perKmCharge: number;
}

export class UpdateTransportDto extends PartialType(CreateTransportDto) {}

export class CreateTransportFeeDto {
  @IsInt()
  @IsOptional()
  id: number;

  @IsInt()
  @IsNotEmpty()
  studentId: number;

  @IsInt()
  @IsNotEmpty()
  academicYearId: number;

  @IsNotEmpty()
  months: string[];

  @IsInt()
  @IsNotEmpty()
  baseAmount: number;

  @IsInt()
  @IsNotEmpty()
  perKmCharge: number;

  @IsInt()
  @IsNotEmpty()
  amount: number;

  @IsString()
  @IsNotEmpty()
  mode: string;

  @IsOptional()
  note: string;
}
