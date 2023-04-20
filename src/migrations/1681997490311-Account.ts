import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm';
import { AccountRole, accountRoles } from '../types/account';
import { HashService } from '../services/hash.service';
import { Account } from '../entities/Account';

export class Account1681997490311 implements MigrationInterface {
  public static tableName = 'accounts';
  public static emailIndex = `index_${Account1681997490311.tableName}_email`;
  public static roleIndex = `index_${Account1681997490311.tableName}_role`;
  public async up(queryRunner: QueryRunner): Promise<void> {
    const emailColumn = 'email';
    const roleColumn = 'role';

    await queryRunner.createTable(
      new Table({
        name: Account1681997490311.tableName,
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: emailColumn,
            type: 'varchar',
            length: '256',
            isUnique: true,
          },
          {
            name: 'phone',
            type: 'varchar',
            length: '256',
            isNullable: true,
          },
          {
            name: 'name',
            type: 'varchar',
            length: '256',
          },
          {
            name: 'password',
            type: 'varchar',
            length: '256',
          },
          {
            name: roleColumn,
            type: 'enum',
            enum: accountRoles,
          },
          {
            name: 'active',
            type: 'boolean',
            default: false,
          },
        ],
      }),
    );

    const emailIndex = new TableIndex({
      name: Account1681997490311.emailIndex,
      columnNames: [emailColumn],
    });

    await queryRunner.createIndex(Account1681997490311.tableName, emailIndex);

    const roleIndex = new TableIndex({
      name: Account1681997490311.roleIndex,
      columnNames: [roleColumn],
    });

    await queryRunner.createIndex(Account1681997490311.tableName, roleIndex);

    const hashService = new HashService();
    const accountRepository = queryRunner.manager.getRepository(Account);
    const defaultAdmin = new Account();
    defaultAdmin.email = 'defaultadmin_user@searchandwork.com';
    defaultAdmin.name = 'Admin Admin';
    defaultAdmin.password = await hashService.hashString('test1234');
    defaultAdmin.role = AccountRole.Admin;
    defaultAdmin.active = true;

    await accountRepository.save(defaultAdmin);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropIndex(
      Account1681997490311.tableName,
      Account1681997490311.roleIndex,
    );
    await queryRunner.dropIndex(
      Account1681997490311.tableName,
      Account1681997490311.emailIndex,
    );
    await queryRunner.dropTable(Account1681997490311.tableName);
  }
}
