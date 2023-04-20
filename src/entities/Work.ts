import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Company } from './Company';
import { Category } from './Category';
import { City } from './City';

@Entity('works')
export class Work {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  companyId: number;

  @Column({ type: 'int' })
  categoryId: number;

  @Column({ type: 'int' })
  cityId: number;

  @Column({ type: 'float' })
  payment: number;

  @Column({ type: 'varchar', length: 256 })
  title: string;

  @Column({ type: 'varchar', length: 1024 })
  description: string;

  @Column({ type: 'varchar', length: 256 })
  email: string;

  @Column({ type: 'varchar', length: 256 })
  phone?: string;

  @Column({ type: 'int' })
  createdAt: number;

  @Column({ type: 'int' })
  expireAt: number;

  @Column({ type: 'boolean', default: false })
  blocked: boolean;

  @Column({ type: 'boolean', default: true })
  active: boolean;

  @Column({ type: 'boolean', default: false })
  removed: boolean;

  @ManyToOne(() => Company, (company) => company.works)
  company?: Company;

  @ManyToOne(() => Category, (category) => category.works)
  category?: Category;

  @ManyToOne(() => City, (city) => city.works)
  city?: City;
}
