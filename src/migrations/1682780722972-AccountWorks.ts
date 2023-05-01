import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';
import { Account1682778152102 } from './1682778152102-Account';
import { Work1682780352184 } from './1682780352184-Work';
import { accountRoles } from '../types/account';
import { workInitiators, workStatuses } from '../types/accountWork';

export class AccountWorks1682780722972 implements MigrationInterface {
  public static tableName = 'accountWorks';
  public static accountIdForeignKey = `foreign_key_${AccountWorks1682780722972.tableName}_accountId`;
  public static workIdForeignKey = `foreign_key_${AccountWorks1682780722972.tableName}_workId`;

  public async up(queryRunner: QueryRunner): Promise<void> {
    const accountIdColumn = 'accountId';
    const workIdColumn = 'workId';

    await queryRunner.createTable(
      new Table({
        name: AccountWorks1682780722972.tableName,
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
            name: workIdColumn,
            type: 'int',
          },
          {
            name: 'payment',
            type: 'float',
          },
          {
            name: 'initiator',
            type: 'enum',
            enum: workInitiators,
          },
          {
            name: 'status',
            type: 'enum',
            enum: workStatuses,
          },
          {
            name: 'availableTill',
            type: 'int',
          },
          {
            name: 'employerFeedback',
            type: 'varchar',
            length: '256',
          },
          {
            name: 'employerSatisfactionPoints',
            type: 'int',
          },
          {
            name: 'workerFeedback',
            type: 'varchar',
            length: '256',
          },
          {
            name: 'workerSatisfactionPoints',
            type: 'int',
          },
        ],
      }),
    );

    const accountIdForeignKey = new TableForeignKey({
      name: AccountWorks1682780722972.accountIdForeignKey,
      columnNames: [accountIdColumn],
      referencedColumnNames: ['id'],
      referencedTableName: Account1682778152102.tableName,
      onDelete: 'RESTRICT',
    });

    await queryRunner.createForeignKey(
      AccountWorks1682780722972.tableName,
      accountIdForeignKey,
    );

    const categoryIdForeignKey = new TableForeignKey({
      name: AccountWorks1682780722972.workIdForeignKey,
      columnNames: [workIdColumn],
      referencedColumnNames: ['id'],
      referencedTableName: Work1682780352184.tableName,
      onDelete: 'RESTRICT',
    });

    await queryRunner.createForeignKey(
      AccountWorks1682780722972.tableName,
      categoryIdForeignKey,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey(
      AccountWorks1682780722972.tableName,
      AccountWorks1682780722972.workIdForeignKey,
    );
    await queryRunner.dropForeignKey(
      AccountWorks1682780722972.tableName,
      AccountWorks1682780722972.accountIdForeignKey,
    );
    await queryRunner.dropTable(AccountWorks1682780722972.tableName);
  }
}
