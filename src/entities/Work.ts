import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Category } from './Category';
import { City } from './City';
import { Account } from './Account';
import { AccountWork } from './AccountWork';

@Entity('works')
export class Work {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  accountId: number;

  @Column({ type: 'int' })
  categoryId: number;

  @Column({ type: 'int' })
  cityId: number;

  @Column({ type: 'varchar', length: 256 })
  address: string;

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
  startTime: number;

  @Column({ type: 'int' })
  endTime: number;

  @Column({ type: 'int' })
  countWorkers: number;

  @Column({ type: 'boolean', default: false })
  blocked: boolean;

  @Column({ type: 'boolean', default: true })
  active: boolean;

  @Column({ type: 'boolean', default: false })
  removed: boolean;

  @ManyToOne(() => Category, (category) => category.works)
  category?: Category;

  @ManyToOne(() => City, (city) => city.works)
  city?: City;

  @ManyToOne(() => Account, (account) => account.works)
  account: Account;

  @OneToMany(() => AccountWork, (accountWork) => accountWork.work)
  accountWorks: AccountWork[];
}
