import { Length } from 'class-validator';

export class CreateDto {
  @Length(2, 100)
  title: string;
}
