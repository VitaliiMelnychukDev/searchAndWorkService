import { Account } from '../entities/Account';
import { AccountWithoutPassword } from '../types/account';

export class AccountHelper {
  static getAccountWithoutPassword(account: Account): AccountWithoutPassword {
    const newAccount = {
      ...account,
    };

    delete newAccount.password;

    return newAccount;
  }
}
