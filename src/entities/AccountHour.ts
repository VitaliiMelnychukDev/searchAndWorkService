import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import {
  AccountHourType,
  accountHourTypes,
  defaultAccountHourType,
} from '../types/account';
import { Account } from './Account';

@Entity('accountHours')
export class AccountHour {
  @PrimaryGeneratedColumn()
  id;

  @Column({ type: 'int' })
  accountId: number;

  @Column({ type: 'int' })
  startTime: number;

  @Column({ type: 'int' })
  endTime: number;

  @Column({
    type: 'enum',
    enum: accountHourTypes,
    default: defaultAccountHourType,
  })
  type: AccountHourType;

  @ManyToOne(() => Account, (account) => account.hours)
  account: Account;
}
