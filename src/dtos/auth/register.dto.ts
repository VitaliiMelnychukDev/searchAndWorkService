import { AccountRole } from '../../types/account';
import { IsEmail, IsIn, IsOptional, Length } from 'class-validator';

const allowedRegisterRoles = [AccountRole.User, AccountRole.Company];

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
}
