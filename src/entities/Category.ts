import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Work } from './Work';

@Entity('categories')
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 256 })
  title: string;

  @OneToMany(() => Work, (work) => work.category)
  works: Work[];
}
