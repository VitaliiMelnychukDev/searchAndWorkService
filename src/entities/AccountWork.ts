import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import {
  defaultWorkInitiator,
  defaultWorkStatus,
  WorkInitiator,
  workInitiators,
  WorkStatus,
  workStatuses,
} from '../types/accountWork';
import { Account } from './Account';
import { Work } from './Work';

@Entity('accountWorks')
export class AccountWork {
  @PrimaryColumn()
  accountId: number;

  @PrimaryColumn()
  workId: number;

  @Column({ type: 'float' })
  payment: number;

  @Column({
    type: 'enum',
    enum: workInitiators,
    default: defaultWorkInitiator,
  })
  initiator: WorkInitiator;

  @Column({
    type: 'enum',
    enum: workStatuses,
    default: defaultWorkStatus,
  })
  status: WorkStatus;

  @Column({ type: 'int' })
  availableTill: number;

  @Column({ type: 'varchar', length: 256, nullable: true })
  employerFeedback?: number;

  @Column({ type: 'int', nullable: true })
  employerSatisfactionPoints?: number;

  @Column({ type: 'varchar', length: 256, nullable: true })
  workerFeedback?: number;

  @Column({ type: 'int', nullable: true })
  workerSatisfactionPoints?: number;

  @ManyToOne(() => Account, (account) => account.accountWorks)
  account: Account;

  @ManyToOne(() => Work, (work) => work.accountWorks)
  work: Work;
}
