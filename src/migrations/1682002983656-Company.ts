import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';
import { Account1681997490311 } from './1681997490311-Account';

export class Company1682002983656 implements MigrationInterface {
  public static tableName = 'companies';
  public static accountIdForeignKey = `foreign_key_${Company1682002983656.tableName}_accountId`;

  public async up(queryRunner: QueryRunner): Promise<void> {
    const accountIdColumn = 'accountId';
    await queryRunner.createTable(
      new Table({
        name: Company1682002983656.tableName,
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
            name: 'title',
            type: 'varchar',
            length: '256',
          },
          {
            name: 'description',
            type: 'varchar',
            length: '1024',
          },
          {
            name: 'address',
            type: 'varchar',
            length: '256',
          },
          {
            name: 'email',
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
            name: 'active',
            type: 'boolean',
            default: true,
          },
        ],
      }),
    );

    const accountIdForeignKey = new TableForeignKey({
      name: Company1682002983656.accountIdForeignKey,
      columnNames: [accountIdColumn],
      referencedColumnNames: ['id'],
      referencedTableName: Account1681997490311.tableName,
      onDelete: 'CASCADE',
    });

    await queryRunner.createForeignKey(
      Company1682002983656.tableName,
      accountIdForeignKey,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey(
      Company1682002983656.tableName,
      Company1682002983656.accountIdForeignKey,
    );
    await queryRunner.dropTable(Company1682002983656.tableName);
  }
}
