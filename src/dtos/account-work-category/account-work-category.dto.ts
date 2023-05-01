import { AccountWorkCategoryBaseDto } from './base.dto';
import { IsNumber, Length } from 'class-validator';
import { Type } from 'class-transformer';

export class AccountWorkCategoryDto {
  @Type(() => Number)
  @IsNumber()
  categoryId?: number;

  @Length(2, 256)
  description: string;
}
