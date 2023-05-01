import { IsEmail, IsNumber, IsOptional, Length, IsInt } from 'class-validator';
import { Type } from 'class-transformer';

export class WorkDto {
  @IsInt()
  categoryId: number;

  @IsInt()
  cityId: number;

  @Length(2, 256)
  address: string;

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

  @Type(() => Number)
  @IsNumber()
  startTime: number;

  @Type(() => Number)
  @IsNumber()
  endTime: number;

  @Type(() => Number)
  @IsNumber()
  countWorkers: number;
}
