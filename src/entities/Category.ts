import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Work } from './Work';
import { AccountWorkCategory } from './AccountWorkCategory';

@Entity('categories')
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 256 })
  title: string;

  @OneToMany(() => Work, (work) => work.category)
  works: Work[];

  @OneToMany(() => AccountWorkCategory, (workCategory) => workCategory.category)
  workCategories: AccountWorkCategory[];
}
