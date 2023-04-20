import { DataSourceOptions } from 'typeorm/data-source/DataSourceOptions';
import { join } from 'path';
import { Account } from '../entities/Account';
import { Token } from '../entities/Token';
import { City } from '../entities/City';
import { Category } from '../entities/Category';
import { Company } from '../entities/Company';
import { Work } from '../entities/Work';

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'test1234',
  database: 'searchAndWork',
  entities: [Account, Token, City, Category, Company, Work],
  migrations: [join(__dirname, '../migrations/*.{ts,js}')],
  synchronize: false,
};
