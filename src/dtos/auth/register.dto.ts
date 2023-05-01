import { AccountRole } from '../../types/account';
import {
  IsEmail,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';

const allowedRegisterRoles = [AccountRole.User];

export class RegisterDto {
  @IsEmail()
  email: string;

  @Length(2, 100)
  name: string;

  @Length(8, 20)
  password: string;

  @IsOptional()
  @Length(8, 20)
  phone?: string;

  @IsOptional()
  @IsIn(allowedRegisterRoles)
  role: AccountRole;

  @IsInt()
  cityId: number;

  @IsString()
  address: string;

  @IsOptional()
  @IsString()
  imageSrc: string;
}
