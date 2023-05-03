import { Type } from 'class-transformer';
import { IsNumber } from 'class-validator';

export class SuggestDto {
  @Type(() => Number)
  @IsNumber()
  workId: number;
  @Type(() => Number)
  @IsNumber()
  workerId: number;
}
