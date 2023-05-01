import { Module } from '@nestjs/common';
import { HashService } from './services/hash.service';
import { TokenService } from './services/token.service';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';
import { AccountService } from './services/account.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Account } from './entities/Account';
import { Token } from './entities/Token';
import { dataSourceOptions } from './config/data-source.config';
import { PaginationService } from './services/pagination.service';
import { AuthGuard } from './guards/auth.guard';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './guards/roles.guard';
import { Category } from './entities/Category';
import { City } from './entities/City';
import { Work } from './entities/Work';
import { CityController } from './controllers/city.controller';
import { CityService } from './services/city.service';
import { CategoryService } from './services/category.service';
import { CategoryController } from './controllers/category.controller';
import { WorkService } from './services/work.service';
import { WorkController } from './controllers/work.controller';
import { AccountController } from './controllers/account.controller';
import { AccountWork } from './entities/AccountWork';
import { AccountHour } from './entities/AccountHour';
import { AccountWorkCategory } from './entities/AccountWorkCategory';
import { AccountWorkCategoryController } from './controllers/account-work-category.controller';
import { AccountWorkCategoryService } from './services/account-work-category.service';
import { AccountHourController } from './controllers/account-hour.controller';
import { AccountHourService } from './services/account-hour.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Account,
      Token,
      City,
      Category,
      Work,
      AccountWork,
      AccountHour,
      AccountWorkCategory,
    ]),
    TypeOrmModule.forRoot(dataSourceOptions),
  ],
  controllers: [
    AuthController,
    CityController,
    CategoryController,
    WorkController,
    AccountController,
    AccountWorkCategoryController,
    AccountHourController,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    HashService,
    TokenService,
    AuthService,
    AccountService,
    PaginationService,
    CityService,
    CategoryService,
    WorkService,
    AccountWorkCategoryService,
    AccountHourService,
  ],
})
export class AppModule {}
