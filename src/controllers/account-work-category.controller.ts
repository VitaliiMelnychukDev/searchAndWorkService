import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  ValidationPipe,
} from '@nestjs/common';
import { AuthNeeded } from '../decorators/auth.decorator';
import { Roles } from '../decorators/roles.decorator';
import { AccountRole } from '../types/account';
import { IResponse, IResponseNoData } from '../types/general';
import { AccountCategoryMessage } from '../types/message';
import { IAuthorizedRequest } from '../types/request';
import { AccountWorkCategoryService } from '../services/account-work-category.service';
import { AccountWorkCategoryDto } from '../dtos/account-work-category/account-work-category.dto';
import { AccountWorkCategory } from '../entities/AccountWorkCategory';

@Controller('account-category')
export class AccountWorkCategoryController {
  constructor(private accountWorkCategoryService: AccountWorkCategoryService) {}

  @Get('getAll')
  @AuthNeeded()
  async getAll(
    @Req() request: IAuthorizedRequest,
  ): Promise<IResponse<AccountWorkCategory[]>> {
    const accountCategories = await this.accountWorkCategoryService.getAll(
      request.account.accountId,
    );

    return {
      success: true,
      data: accountCategories,
    };
  }

  @Get(':id')
  @AuthNeeded()
  async get(
    @Param('id') categoryId: number,
    @Req() request: IAuthorizedRequest,
  ): Promise<IResponse<AccountWorkCategory>> {
    const accountCategory = await this.accountWorkCategoryService.get(
      request.account.accountId,
      categoryId,
    );

    return {
      success: true,
      data: accountCategory,
    };
  }

  @Post()
  @AuthNeeded()
  @Roles(AccountRole.User)
  async create(
    @Body(new ValidationPipe()) accountCategoryData: AccountWorkCategoryDto,
    @Req() request: IAuthorizedRequest,
  ): Promise<IResponse<AccountWorkCategory>> {
    const accountCategory = await this.accountWorkCategoryService.create(
      request.account.accountId,
      accountCategoryData.categoryId,
      accountCategoryData.description,
    );

    return {
      success: true,
      data: accountCategory,
    };
  }

  @Put()
  @AuthNeeded()
  @Roles(AccountRole.User)
  async update(
    @Body(new ValidationPipe()) accountCategoryData: AccountWorkCategoryDto,
    @Req() request: IAuthorizedRequest,
  ): Promise<IResponse<AccountWorkCategory>> {
    const accountCategory = await this.accountWorkCategoryService.update(
      request.account.accountId,
      accountCategoryData.categoryId,
      accountCategoryData.description,
    );

    return {
      success: true,
      data: accountCategory,
    };
  }

  @Delete(':id')
  @AuthNeeded()
  @Roles(AccountRole.User)
  async remove(
    @Param('id') categoryId: number,
    @Req() request: IAuthorizedRequest,
  ): Promise<IResponseNoData> {
    await this.accountWorkCategoryService.delete(
      request.account.accountId,
      categoryId,
    );

    return {
      success: true,
      message: AccountCategoryMessage.AccountCategorySuccessfullyRemoved,
    };
  }
}
