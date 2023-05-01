import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { defaultRole, AccountRole, accountRoles } from '../types/account';
import { Token } from './Token';
import { City } from './City';
import { AccountWorkCategory } from './AccountWorkCategory';
import { AccountHour } from './AccountHour';
import { Work } from './Work';
import { AccountWork } from './AccountWork';

@Entity('accounts')
export class Account {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    length: 256,
    unique: true,
  })
  @Column({ type: 'varchar', length: 256 })
  email: string;

  @Column({ type: 'varchar', length: 256 })
  phone?: string;

  @Column({ type: 'varchar', length: 256 })
  name: string;

  @Column({ type: 'varchar', length: 256 })
  password: string;

  @Column({
    type: 'enum',
    enum: accountRoles,
    default: defaultRole,
  })
  role: AccountRole;

  @Column({ type: 'varchar', length: 256, default: null })
  imageSrc?: string;

  @Column({ type: 'int', default: null })
  cityId?: number;

  @Column({ type: 'varchar', length: 256 })
  address: string;

  @Column({ type: 'boolean', default: false })
  active: boolean;

  @OneToMany(() => Token, (token) => token.account)
  tokens: Token[];

  @ManyToOne(() => City, (city) => city.accounts)
  city: City;

  @OneToMany(() => AccountWorkCategory, (workCategory) => workCategory.account)
  workCategories: AccountWorkCategory[];

  @OneToMany(() => AccountHour, (hour) => hour.account)
  hours: AccountHour[];

  @OneToMany(() => Work, (work) => work.account)
  works: Work[];

  @OneToMany(() => AccountWork, (accountWork) => accountWork.account)
  accountWorks: AccountWork[];
}
