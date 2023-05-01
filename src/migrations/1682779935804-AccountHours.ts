import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';
import { Account1682778152102 } from './1682778152102-Account';
import { accountHourTypes } from '../types/account';

export class AccountHours1682779935804 implements MigrationInterface {
  public static tableName = 'accountHours';
  public static accountIdForeignKey = `foreign_key_${AccountHours1682779935804.tableName}_accountId`;
  public async up(queryRunner: QueryRunner): Promise<void> {
    const accountIdColumn = 'accountId';

    await queryRunner.createTable(
      new Table({
        name: AccountHours1682779935804.tableName,
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: accountIdColumn,
            type: 'int',
          },
          {
            name: 'startTime',
            type: 'bigInt',
          },
          {
            name: 'endTime',
            type: 'bigInt',
          },
          {
            name: 'type',
            type: 'enum',
            enum: accountHourTypes,
          },
        ],
      }),
    );

    const accountIdForeignKey = new TableForeignKey({
      name: AccountHours1682779935804.accountIdForeignKey,
      columnNames: [accountIdColumn],
      referencedColumnNames: ['id'],
      referencedTableName: Account1682778152102.tableName,
      onDelete: 'RESTRICT',
    });

    await queryRunner.createForeignKey(
      AccountHours1682779935804.tableName,
      accountIdForeignKey,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey(
      AccountHours1682779935804.tableName,
      AccountHours1682779935804.accountIdForeignKey,
    );
    await queryRunner.dropTable(AccountHours1682779935804.tableName);
  }
}
