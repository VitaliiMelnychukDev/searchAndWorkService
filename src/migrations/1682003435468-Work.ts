import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';
import { Company1682002983656 } from './1682002983656-Company';
import { Category1682002531140 } from './1682002531140-Category';
import { City1682002849806 } from './1682002849806-City';

export class Work1682003435468 implements MigrationInterface {
  public static tableName = 'works';
  public static companyIdForeignKey = `foreign_key_${Work1682003435468.tableName}_companyId`;
  public static categoryIdForeignKey = `foreign_key_${Work1682003435468.tableName}_categoryId`;
  public static cityIdForeignKey = `foreign_key_${Work1682003435468.tableName}_cityId`;

  public async up(queryRunner: QueryRunner): Promise<void> {
    const companyIdColumn = 'companyId';
    const categoryIdColumn = 'categoryId';
    const cityIdColumn = 'cityId';

    await queryRunner.createTable(
      new Table({
        name: Work1682003435468.tableName,
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: companyIdColumn,
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
            name: 'expireAt',
            type: 'bigInt',
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

    const companyIdForeignKey = new TableForeignKey({
      name: Work1682003435468.companyIdForeignKey,
      columnNames: [companyIdColumn],
      referencedColumnNames: ['id'],
      referencedTableName: Company1682002983656.tableName,
      onDelete: 'CASCADE',
    });

    await queryRunner.createForeignKey(
      Work1682003435468.tableName,
      companyIdForeignKey,
    );

    const categoryIdForeignKey = new TableForeignKey({
      name: Work1682003435468.categoryIdForeignKey,
      columnNames: [categoryIdColumn],
      referencedColumnNames: ['id'],
      referencedTableName: Category1682002531140.tableName,
      onDelete: 'CASCADE',
    });

    await queryRunner.createForeignKey(
      Work1682003435468.tableName,
      categoryIdForeignKey,
    );

    const cityIdForeignKey = new TableForeignKey({
      name: Work1682003435468.cityIdForeignKey,
      columnNames: [cityIdColumn],
      referencedColumnNames: ['id'],
      referencedTableName: City1682002849806.tableName,
      onDelete: 'CASCADE',
    });

    await queryRunner.createForeignKey(
      Work1682003435468.tableName,
      cityIdForeignKey,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey(
      Work1682003435468.tableName,
      Work1682003435468.cityIdForeignKey,
    );
    await queryRunner.dropForeignKey(
      Work1682003435468.tableName,
      Work1682003435468.categoryIdForeignKey,
    );
    await queryRunner.dropForeignKey(
      Work1682003435468.tableName,
      Work1682003435468.companyIdForeignKey,
    );
    await queryRunner.dropTable(Work1682003435468.tableName);
  }
}
