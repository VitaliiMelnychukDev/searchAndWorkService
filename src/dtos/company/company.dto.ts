import { IsEmail, IsOptional, Length } from 'class-validator';

export class CompanyDto {
  @Length(2, 256)
  title: string;

  @Length(2, 1024)
  description: string;

  @Length(2, 256)
  address: string;

  @IsEmail()
  email: string;

  @IsOptional()
  @Length(8, 20)
  phone: string;
}
