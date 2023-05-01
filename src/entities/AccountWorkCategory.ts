import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import { Account } from './Account';
import { Category } from './Category';

@Entity('accountWorkCategories')
export class AccountWorkCategory {
  @PrimaryColumn()
  accountId: number;

  @PrimaryColumn()
  categoryId: number;

  @Column({ type: 'varchar', length: 1024 })
  description: string;

  @ManyToOne(() => Account, (account) => account.workCategories)
  account: Account;

  @ManyToOne(() => Category, (category) => category.workCategories)
  category: Category;
}
