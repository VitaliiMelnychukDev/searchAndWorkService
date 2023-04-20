import { IsNumber, IsOptional, Length } from 'class-validator';
import { Type } from 'class-transformer';

export class PaginationDto {
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  page?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  limit?: number;
}

export class SearchDto extends PaginationDto {
  @IsOptional()
  @Type(() => String)
  @Length(1, 100)
  searchTerm?: string;
}
