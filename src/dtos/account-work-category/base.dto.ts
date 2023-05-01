import { IsNumber, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class AccountWorkCategoryBaseDto {
  @Type(() => Number)
  @IsNumber()
  accountId?: number;

  @Type(() => Number)
  @IsNumber()
  categoryId?: number;
}
