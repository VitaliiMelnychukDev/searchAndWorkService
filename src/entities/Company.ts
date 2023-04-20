import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Account } from './Account';
import { Work } from './Work';

@Entity('companies')
export class Company {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  accountId: number;

  @Column({ type: 'varchar', length: 256 })
  name: string;

  @Column({ type: 'varchar', length: 1024 })
  description: string;

  @Column({ type: 'varchar', length: 256 })
  address: string;

  @Column({ type: 'varchar', length: 256 })
  email: string;

  @Column({ type: 'varchar', length: 256 })
  phone?: string;

  @Column({ type: 'boolean', default: true })
  active: boolean;

  @ManyToOne(() => Account, (account) => account.companies)
  account?: Account;

  @OneToMany(() => Work, (work) => work.company)
  works: Work[];
}
