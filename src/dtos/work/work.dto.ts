import { IsEmail, IsNumber, IsOptional, Length, IsInt } from 'class-validator';

export class WorkDto {
  @IsInt()
  companyId: number;

  @IsInt()
  categoryId: number;

  @IsInt()
  cityId: number;

  @IsNumber()
  payment: number;

  @Length(2, 256)
  title: string;

  @Length(2, 1024)
  description: string;

  @IsEmail()
  email: string;

  @IsOptional()
  @Length(8, 20)
  phone: string;
}
