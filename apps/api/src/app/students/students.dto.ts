import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsDateString,
  IsEmail,
  IsIn,
  IsInt,
  IsJSON,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';

export class CreateStudentDto {
  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  classId: number;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsDateString()
  @IsNotEmpty()
  dob: Date;

  @IsString()
  @IsNotEmpty()
  gender: string;

  @IsString()
  @IsNotEmpty()
  religion: string;

  @IsString()
  @IsNotEmpty()
  nationality: string;

  @IsString()
  @IsNotEmpty()
  nativeLanguage: string;

  @IsString()
  @IsNotEmpty()
  caste: string;

  @IsString()
  @IsNotEmpty()
  fathersName: string;

  @IsString()
  @IsNotEmpty()
  fathersPhone: string;

  @IsString()
  @IsNotEmpty()
  mothersName: string;

  @IsString()
  @IsNotEmpty()
  mothersPhone: string;

  @IsString()
  @IsNotEmpty()
  presentAddess: string;

  @IsString()
  @IsNotEmpty()
  presentPo: string;

  @IsString()
  @IsNotEmpty()
  presentPs: string;

  @IsNumber()
  @IsNotEmpty()
  presentPin: string;

  @IsBoolean()
  @IsNotEmpty()
  isBothAddressSame: boolean;

  @IsString()
  @IsNotEmpty()
  permanentAddess: string;

  @IsString()
  @IsNotEmpty()
  permanentPo: string;

  @IsString()
  @IsNotEmpty()
  permanentPs: string;

  @IsNumber()
  @IsNotEmpty()
  permanentPin: string;

  @IsJSON()
  @IsNotEmpty()
  previousSchoolDetails: JSON;

  @IsJSON()
  @IsNotEmpty()
  siblingDetails: JSON;

  @IsString()
  @IsNotEmpty()
  fatherQualification;

  @IsString()
  @IsNotEmpty()
  fatherProfession;

  @IsNumber()
  @IsNotEmpty()
  fatherAnnualIncome;

  @IsString()
  @IsNotEmpty()
  fatherAddress;

  @IsString()
  @IsNotEmpty()
  fatherCity;

  @IsString()
  @IsNotEmpty()
  fatherPin;

  @IsString()
  @IsNotEmpty()
  fatherState;

  @IsString()
  @IsNotEmpty()
  fatherCountry;

  @IsNumber()
  @IsNotEmpty()
  fatherMobile;

  @IsOptional()
  @IsEmail()
  fatherEmail;

  @IsString()
  @IsOptional()
  fatherPlace;

  // mother
  @IsString()
  @IsNotEmpty()
  motherQualification;

  @IsString()
  @IsNotEmpty()
  motherProfession;

  @IsNumber()
  @IsNotEmpty()
  motherAnnualIncome;

  @IsString()
  @IsNotEmpty()
  motherAddress;

  @IsString()
  @IsNotEmpty()
  motherCity;

  @IsString()
  @IsNotEmpty()
  motherPin;

  @IsString()
  @IsNotEmpty()
  motherState;

  @IsString()
  @IsNotEmpty()
  motherCountry;

  @IsNumber()
  @IsNotEmpty()
  motherMobile;

  @IsOptional()
  @IsEmail()
  motherEmail;

  @IsString()
  @IsOptional()
  motherPlace;

  // guardian
  @IsString()
  @IsNotEmpty()
  guardianQualification;

  @IsString()
  @IsNotEmpty()
  guardianProfession;

  @IsNumber()
  @IsNotEmpty()
  guardianAnnualIncome;

  @IsString()
  @IsNotEmpty()
  guardianAddress;

  @IsString()
  @IsNotEmpty()
  guardianCity;

  @IsString()
  @IsNotEmpty()
  guardianPin;

  @IsString()
  @IsNotEmpty()
  guardianState;

  @IsString()
  @IsNotEmpty()
  guardianCountry;

  @IsNumber()
  @IsNotEmpty()
  guardianMobile;

  @IsOptional()
  @IsEmail()
  guardianEmail;

  @IsString()
  @IsOptional()
  guardianPlace;
}

export class CreateStudentPersonalInfoDto {
  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  classId: number;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsDateString()
  @IsNotEmpty()
  dob: Date;

  @IsString()
  @IsNotEmpty()
  gender: string;

  @IsString()
  @IsNotEmpty()
  religion: string;

  @IsString()
  @IsNotEmpty()
  nationality: string;

  @IsString()
  @IsNotEmpty()
  nativeLanguage: string;

  @IsString()
  @IsNotEmpty()
  caste: string;

  @IsString()
  @IsNotEmpty()
  fathersName: string;

  @IsString()
  @IsNotEmpty()
  fathersPhone: string;

  @IsString()
  @IsNotEmpty()
  mothersName: string;

  @IsString()
  @IsNotEmpty()
  mothersPhone: string;

  @IsString()
  @IsNotEmpty()
  presentAddess: string;

  @IsString()
  @IsNotEmpty()
  presentPo: string;

  @IsString()
  @IsNotEmpty()
  presentPs: string;

  @IsNumber()
  @IsNotEmpty()
  presentPin: string;

  @IsBoolean()
  @IsNotEmpty()
  isBothAddressSame: boolean;

  @IsString()
  @IsNotEmpty()
  permanentAddess: string;

  @IsString()
  @IsNotEmpty()
  permanentPo: string;

  @IsString()
  @IsNotEmpty()
  permanentPs: string;

  @IsNumber()
  @IsNotEmpty()
  permanentPin: string;

  @IsJSON()
  @IsNotEmpty()
  previousSchoolDetails: JSON;

  @IsJSON()
  @IsNotEmpty()
  siblingDetails: JSON;
}

export class UpdateStudentGuardianInfoDto {
  @IsInt()
  @IsNotEmpty()
  id: number;

  @IsOptional()
  regId: string;

  @IsString()
  @IsNotEmpty()
  fatherQualification;

  @IsString()
  @IsNotEmpty()
  fatherProfession;

  @IsNumber()
  @IsNotEmpty()
  fatherAnnualIncome;

  @IsString()
  @IsNotEmpty()
  fatherAddress;

  @IsString()
  @IsNotEmpty()
  fatherCity;

  @IsString()
  @IsNotEmpty()
  fatherPin;

  @IsString()
  @IsNotEmpty()
  fatherState;

  @IsString()
  @IsNotEmpty()
  fatherCountry;

  @IsNumber()
  @IsNotEmpty()
  fatherMobile;

  @IsOptional()
  @IsEmail()
  fatherEmail;

  @IsString()
  @IsOptional()
  fatherPlace;

  // mother
  @IsString()
  @IsNotEmpty()
  motherQualification;

  @IsString()
  @IsNotEmpty()
  motherProfession;

  @IsNumber()
  @IsNotEmpty()
  motherAnnualIncome;

  @IsString()
  @IsNotEmpty()
  motherAddress;

  @IsString()
  @IsNotEmpty()
  motherCity;

  @IsString()
  @IsNotEmpty()
  motherPin;

  @IsString()
  @IsNotEmpty()
  motherState;

  @IsString()
  @IsNotEmpty()
  motherCountry;

  @IsNumber()
  @IsNotEmpty()
  motherMobile;

  @IsOptional()
  @IsEmail()
  motherEmail;

  @IsString()
  @IsOptional()
  motherPlace;

  // guardian
  @IsString()
  @IsNotEmpty()
  guardianQualification;

  @IsString()
  @IsNotEmpty()
  guardianProfession;

  @IsNumber()
  @IsNotEmpty()
  guardianAnnualIncome;

  @IsString()
  @IsNotEmpty()
  guardianAddress;

  @IsString()
  @IsNotEmpty()
  guardianCity;

  @IsString()
  @IsNotEmpty()
  guardianPin;

  @IsString()
  @IsNotEmpty()
  guardianState;

  @IsString()
  @IsNotEmpty()
  guardianCountry;

  @IsNumber()
  @IsNotEmpty()
  guardianMobile;

  @IsOptional()
  @IsEmail()
  guardianEmail;

  @IsString()
  @IsOptional()
  guardianPlace;
}

export class UpdateStudentDto extends CreateStudentDto {}

export class StudentQueryDto {
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
  id?: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  fathersName?: string;
}
