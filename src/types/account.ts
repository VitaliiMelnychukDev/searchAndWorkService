import { Account } from '../entities/Account';

export enum AccountRole {
  Admin = 'admin',
  User = 'user',
}

export const accountRoles: AccountRole[] = [
  AccountRole.Admin,
  AccountRole.User,
];

export enum AccountHourType {
  Available = 'available',
  Exception = 'exception',
}

export const accountHourTypes: AccountHourType[] = [
  AccountHourType.Available,
  AccountHourType.Exception,
];

export const defaultAccountHourType = AccountHourType.Available;

export const defaultRole: AccountRole = AccountRole.User;

export const rolesDecoratorKey = 'roles';

export type AccountWithoutPassword = Omit<Account, 'password'>;
