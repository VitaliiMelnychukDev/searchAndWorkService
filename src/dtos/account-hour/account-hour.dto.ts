import { Type } from 'class-transformer';
import { IsIn, IsNumber } from 'class-validator';
import { AccountHourType, accountHourTypes } from '../../types/account';

export class AccountHourDto {
  @Type(() => Number)
  @IsNumber()
  startTime: number;

  @Type(() => Number)
  @IsNumber()
  endTime: number;

  @Type(() => String)
  @IsIn(accountHourTypes)
  type: AccountHourType;
}
