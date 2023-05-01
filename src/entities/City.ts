import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Work } from './Work';
import { Account } from './Account';

@Entity('cities')
export class City {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 256 })
  title: string;

  @OneToMany(() => Work, (work) => work.city)
  works: Work[];

  @OneToMany(() => Account, (account) => account.city)
  accounts: Account[];
}
