import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
  TableIndex,
} from 'typeorm';
import { Account1682778152102 } from './1682778152102-Account';

export class Token1682779224086 implements MigrationInterface {
  public static tableName = 'tokens';
  public static accountIdIndex = `index_${Token1682779224086.tableName}_accountId`;
  public static tokenIndex = `index_${Token1682779224086.tableName}_token`;
  public static accountIdForeignKey = `foreign_key_${Token1682779224086.tableName}_accountId`;
  public async up(queryRunner: QueryRunner): Promise<void> {
    const accountIdColumn = 'accountId';
    const tokenColumn = 'refreshToken';

    await queryRunner.createTable(
      new Table({
        name: Token1682779224086.tableName,
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
      name: Token1682779224086.accountIdIndex,
      columnNames: [accountIdColumn],
    });

    await queryRunner.createIndex(Token1682779224086.tableName, accountIdIndex);

    const tokenIndex = new TableIndex({
      name: Token1682779224086.tokenIndex,
      columnNames: [tokenColumn],
    });

    await queryRunner.createIndex(Token1682779224086.tableName, tokenIndex);

    const accountIdForeignKey = new TableForeignKey({
      name: Token1682779224086.accountIdForeignKey,
      columnNames: [accountIdColumn],
      referencedColumnNames: ['id'],
      referencedTableName: Account1682778152102.tableName,
      onDelete: 'RESTRICT',
    });

    await queryRunner.createForeignKey(
      Token1682779224086.tableName,
      accountIdForeignKey,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey(
      Token1682779224086.tableName,
      Token1682779224086.accountIdForeignKey,
    );
    await queryRunner.dropIndex(
      Token1682779224086.tableName,
      Token1682779224086.tokenIndex,
    );
    await queryRunner.dropIndex(
      Token1682779224086.tableName,
      Token1682779224086.accountIdIndex,
    );
    await queryRunner.dropTable(Token1682779224086.tableName);
  }
}
