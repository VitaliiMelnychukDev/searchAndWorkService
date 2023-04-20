import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
  TableIndex,
} from 'typeorm';
import { Account1681997490311 } from './1681997490311-Account';

export class Token1681998285815 implements MigrationInterface {
  public static tableName = 'tokens';
  public static accountIdIndex = `index_${Token1681998285815.tableName}_accountId`;
  public static tokenIndex = `index_${Token1681998285815.tableName}_token`;
  public static accountIdForeignKey = `foreign_key_${Token1681998285815.tableName}_accountId`;
  public async up(queryRunner: QueryRunner): Promise<void> {
    const accountIdColumn = 'accountId';
    const tokenColumn = 'refreshToken';

    await queryRunner.createTable(
      new Table({
        name: Token1681998285815.tableName,
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
            name: tokenColumn,
            type: 'varchar',
            length: '256',
            isUnique: true,
          },
          {
            name: 'expireAt',
            type: 'bigInt',
          },
        ],
      }),
    );

    const accountIdIndex = new TableIndex({
      name: Token1681998285815.accountIdIndex,
      columnNames: [accountIdColumn],
    });

    await queryRunner.createIndex(Token1681998285815.tableName, accountIdIndex);

    const tokenIndex = new TableIndex({
      name: Token1681998285815.tokenIndex,
      columnNames: [tokenColumn],
    });

    await queryRunner.createIndex(Token1681998285815.tableName, tokenIndex);

    const accountIdForeignKey = new TableForeignKey({
      name: Token1681998285815.accountIdForeignKey,
      columnNames: [accountIdColumn],
      referencedColumnNames: ['id'],
      referencedTableName: Account1681997490311.tableName,
      onDelete: 'CASCADE',
    });

    await queryRunner.createForeignKey(
      Token1681998285815.tableName,
      accountIdForeignKey,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey(
      Token1681998285815.tableName,
      Token1681998285815.accountIdForeignKey,
    );
    await queryRunner.dropIndex(
      Token1681998285815.tableName,
      Token1681998285815.tokenIndex,
    );
    await queryRunner.dropIndex(
      Token1681998285815.tableName,
      Token1681998285815.accountIdIndex,
    );
    await queryRunner.dropTable(Token1681998285815.tableName);
  }
}
