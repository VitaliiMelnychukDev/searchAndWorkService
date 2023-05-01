import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';
import { Account1682778152102 } from './1682778152102-Account';
import { Category1682778069019 } from './1682778069019-Category';
import { City1682777978678 } from './1682777978678-City';

export class Work1682780352184 implements MigrationInterface {
  public static tableName = 'works';
  public static accountIdForeignKey = `foreign_key_${Work1682780352184.tableName}_accountId`;
  public static categoryIdForeignKey = `foreign_key_${Work1682780352184.tableName}_categoryId`;
  public static cityIdForeignKey = `foreign_key_${Work1682780352184.tableName}_cityId`;

  public async up(queryRunner: QueryRunner): Promise<void> {
    const accountIdColumn = 'accountId';
    const categoryIdColumn = 'categoryId';
    const cityIdColumn = 'cityId';

    await queryRunner.createTable(
      new Table({
        name: Work1682780352184.tableName,
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
            name: categoryIdColumn,
            type: 'int',
          },
          {
            name: cityIdColumn,
            type: 'int',
          },
          {
            name: 'address',
            type: 'varchar',
            length: '256',
          },
          {
            name: 'payment',
            type: 'float',
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
            name: 'email',
            type: 'varchar',
            length: '256',
          },
          {
            name: 'phone',
            type: 'varchar',
            length: '256',
            isNullable: true,
          },
          {
            name: 'createdAt',
            type: 'bigInt',
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
            name: 'countWorkers',
            type: 'int',
          },
          {
            name: 'blocked',
            type: 'boolean',
            default: false,
          },
          {
            name: 'active',
            type: 'boolean',
            default: true,
          },
          {
            name: 'removed',
            type: 'boolean',
            default: false,
          },
        ],
      }),
    );

    const accountIdForeignKey = new TableForeignKey({
      name: Work1682780352184.accountIdForeignKey,
      columnNames: [accountIdColumn],
      referencedColumnNames: ['id'],
      referencedTableName: Account1682778152102.tableName,
      onDelete: 'RESTRICT',
    });

    await queryRunner.createForeignKey(
      Work1682780352184.tableName,
      accountIdForeignKey,
    );

    const categoryIdForeignKey = new TableForeignKey({
      name: Work1682780352184.categoryIdForeignKey,
      columnNames: [categoryIdColumn],
      referencedColumnNames: ['id'],
      referencedTableName: Category1682778069019.tableName,
      onDelete: 'RESTRICT',
    });

    await queryRunner.createForeignKey(
      Work1682780352184.tableName,
      categoryIdForeignKey,
    );

    const cityIdForeignKey = new TableForeignKey({
      name: Work1682780352184.cityIdForeignKey,
      columnNames: [cityIdColumn],
      referencedColumnNames: ['id'],
      referencedTableName: City1682777978678.tableName,
      onDelete: 'RESTRICT',
    });

    await queryRunner.createForeignKey(
      Work1682780352184.tableName,
      cityIdForeignKey,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey(
      Work1682780352184.tableName,
      Work1682780352184.cityIdForeignKey,
    );
    await queryRunner.dropForeignKey(
      Work1682780352184.tableName,
      Work1682780352184.categoryIdForeignKey,
    );
    await queryRunner.dropForeignKey(
      Work1682780352184.tableName,
      Work1682780352184.accountIdForeignKey,
    );
    await queryRunner.dropTable(Work1682780352184.tableName);
  }
}
