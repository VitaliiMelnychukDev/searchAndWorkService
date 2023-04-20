export enum AccountRole {
  Admin = 'admin',
  User = 'user',
  Company = 'company',
}

export const accountRoles: AccountRole[] = [
  AccountRole.Admin,
  AccountRole.Company,
  AccountRole.User,
];

export interface IUpdateAccount {
  email?: string;

  name?: string;

  password?: string;

  role?: AccountRole;

  active?: boolean;
}

export interface IAccount {
  id: number;

  email: string;

  name: string;

  role: AccountRole;

  active: boolean;
}

export const defaultRole: AccountRole = AccountRole.User;

export const rolesDecoratorKey = 'roles';
