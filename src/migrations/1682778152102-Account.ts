import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
  TableIndex,
} from 'typeorm';
import { AccountRole, accountRoles } from '../types/account';
import { HashService } from '../services/hash.service';
import { Account } from '../entities/Account';
import { City1682777978678 } from './1682777978678-City';

export class Account1682778152102 implements MigrationInterface {
  public static tableName = 'accounts';
  public static emailIndex = `index_${Account1682778152102.tableName}_email`;
  public static roleIndex = `index_${Account1682778152102.tableName}_role`;
  public static cityIdForeignKey = `foreign_key_${Account1682778152102.tableName}_cityId`;
  public async up(queryRunner: QueryRunner): Promise<void> {
    const emailColumn = 'email';
    const roleColumn = 'role';
    const cityIdColumn = 'cityId';

    await queryRunner.createTable(
      new Table({
        name: Account1682778152102.tableName,
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
            name: 'imageSrc',
            type: 'varchar',
            length: '256',
            isNullable: true,
          },
          {
            name: cityIdColumn,
            type: 'int',
            isNullable: true,
          },
          {
            name: 'address',
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
      name: Account1682778152102.emailIndex,
      columnNames: [emailColumn],
    });

    await queryRunner.createIndex(Account1682778152102.tableName, emailIndex);

    const roleIndex = new TableIndex({
      name: Account1682778152102.roleIndex,
      columnNames: [roleColumn],
    });

    await queryRunner.createIndex(Account1682778152102.tableName, roleIndex);

    const cityIdForeignKey = new TableForeignKey({
      name: Account1682778152102.cityIdForeignKey,
      columnNames: [cityIdColumn],
      referencedColumnNames: ['id'],
      referencedTableName: City1682777978678.tableName,
      onDelete: 'RESTRICT',
    });

    await queryRunner.createForeignKey(
      Account1682778152102.tableName,
      cityIdForeignKey,
    );

    const hashService = new HashService();
    const accountRepository = queryRunner.manager.getRepository(Account);
    const defaultAdmin = new Account();
    defaultAdmin.email = 'defaultadmin_user@searchandwork.com';
    defaultAdmin.name = 'Admin Admin';
    defaultAdmin.password = await hashService.hashString('test1234');
    defaultAdmin.role = AccountRole.Admin;
    defaultAdmin.active = true;
    defaultAdmin.address = 'Sadova 0000';

    await accountRepository.save(defaultAdmin);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey(
      Account1682778152102.tableName,
      Account1682778152102.cityIdForeignKey,
    );
    await queryRunner.dropIndex(
      Account1682778152102.tableName,
      Account1682778152102.roleIndex,
    );
    await queryRunner.dropIndex(
      Account1682778152102.tableName,
      Account1682778152102.emailIndex,
    );
    await queryRunner.dropTable(Account1682778152102.tableName);
  }
}
