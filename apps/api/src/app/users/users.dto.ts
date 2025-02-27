import { Type } from 'class-transformer';
import {
  IsEnum,
  IsIn,
  IsInt,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';

export enum UserRoleEnum {
  ADMIN = 'admin',
  STAFF = 'staff',
}

export class CreateUserDto {
  @IsString()
  name: string;

  @IsString()
  username: string;

  @IsString()
  password: string;

  @IsEnum(UserRoleEnum)
  role: UserRoleEnum;
}

export class UpdateUserDto {
  @IsString()
  name?: string;

  @IsString()
  username?: string;

  @IsString()
  password?: string;

  @IsEnum(UserRoleEnum)
  role?: UserRoleEnum;
}

export class UserQueryDto {
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
  username?: string;

  @IsOptional()
  @IsEnum(UserRoleEnum)
  role?: UserRoleEnum;
}
