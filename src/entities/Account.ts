import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { defaultRole, AccountRole, accountRoles } from '../types/account';
import { Token } from './Token';
import { Company } from './Company';

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

  @Column({ type: 'boolean', default: false })
  active: boolean;

  @OneToMany(() => Token, (token) => token.account)
  tokens: Token[];

  @OneToMany(() => Company, (company) => company.account)
  companies: Company[];
}
