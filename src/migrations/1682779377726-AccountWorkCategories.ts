import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';
import { Account1682778152102 } from './1682778152102-Account';
import { City1682777978678 } from './1682777978678-City';

export class AccountWorkCategories1682779377726 implements MigrationInterface {
  public static tableName = 'accountWorkCategories';
  public static accountIdForeignKey = `foreign_key_${AccountWorkCategories1682779377726.tableName}_accountId`;
  public static categoryIdForeignKey = `foreign_key_${AccountWorkCategories1682779377726.tableName}_categoryId`;
  public async up(queryRunner: QueryRunner): Promise<void> {
    const accountIdColumn = 'accountId';
    const categoryIdColumn = 'categoryId';

    await queryRunner.createTable(
      new Table({
        name: AccountWorkCategories1682779377726.tableName,
        columns: [
          {
            name: accountIdColumn,
            type: 'int',
            isPrimary: true,
          },
          {
            name: categoryIdColumn,
            type: 'int',
            isPrimary: true,
          },
          {
            name: 'description',
            type: 'varchar',
            length: '1024',
            isUnique: true,
          },
        ],
      }),
    );

    const accountIdForeignKey = new TableForeignKey({
      name: AccountWorkCategories1682779377726.accountIdForeignKey,
      columnNames: [accountIdColumn],
      referencedColumnNames: ['id'],
      referencedTableName: Account1682778152102.tableName,
      onDelete: 'RESTRICT',
    });

    await queryRunner.createForeignKey(
      AccountWorkCategories1682779377726.tableName,
      accountIdForeignKey,
    );

    const categoryIdForeignKey = new TableForeignKey({
      name: AccountWorkCategories1682779377726.categoryIdForeignKey,
      columnNames: [categoryIdColumn],
      referencedColumnNames: ['id'],
      referencedTableName: City1682777978678.tableName,
      onDelete: 'RESTRICT',
    });

    await queryRunner.createForeignKey(
      AccountWorkCategories1682779377726.tableName,
      categoryIdForeignKey,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey(
      AccountWorkCategories1682779377726.tableName,
      AccountWorkCategories1682779377726.categoryIdForeignKey,
    );
    await queryRunner.dropForeignKey(
      AccountWorkCategories1682779377726.tableName,
      AccountWorkCategories1682779377726.accountIdForeignKey,
    );
    await queryRunner.dropTable(AccountWorkCategories1682779377726.tableName);
  }
}
