import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from '../entities/Category';
import { AccountWorkCategory } from '../entities/AccountWorkCategory';
import { AccountWorkCategoryError } from '../types/error';

@Injectable()
export class AccountWorkCategoryService {
  constructor(
    @InjectRepository(AccountWorkCategory)
    private readonly accountWorkCategoryRepository: Repository<AccountWorkCategory>,

    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}
  async create(
    accountId: number,
    categoryId: number,
    description: string,
  ): Promise<AccountWorkCategory> {
    let category: Category | null = null;

    try {
      category = await this.categoryRepository.findOne({
        where: {
          id: categoryId,
        },
      });
    } catch {
      throw new BadRequestException(
        AccountWorkCategoryError.CreateAccountCategoryFail,
      );
    }
    if (!category) {
      throw new BadRequestException(
        AccountWorkCategoryError.CategoryDidNotFound,
      );
    }

    const accountCategory = new AccountWorkCategory();
    accountCategory.accountId = accountId;
    accountCategory.categoryId = categoryId;
    accountCategory.description = description;

    try {
      return await this.accountWorkCategoryRepository.save(accountCategory);
    } catch {
      throw new BadRequestException(
        AccountWorkCategoryError.CreateAccountCategoryFail,
      );
    }
  }

  async get(
    accountId: number,
    categoryId: number,
  ): Promise<AccountWorkCategory> {
    return await this.getAccountCategory(accountId, categoryId);
  }

  async getAll(accountId: number): Promise<AccountWorkCategory[]> {
    try {
      return await this.accountWorkCategoryRepository.find({
        where: {
          accountId,
        },
      });
    } catch {
      throw new BadRequestException(
        AccountWorkCategoryError.GetAccountCategoriesFail,
      );
    }
  }

  async update(
    accountId: number,
    categoryId: number,
    description: string,
  ): Promise<AccountWorkCategory> {
    const accountCategory = await this.getAccountCategory(
      accountId,
      categoryId,
    );

    accountCategory.description = description;

    try {
      return await this.accountWorkCategoryRepository.save(accountCategory);
    } catch {
      throw new BadRequestException(
        AccountWorkCategoryError.UpdateAccountCategoryFail,
      );
    }
  }

  async delete(accountId: number, categoryId: number): Promise<void> {
    const accountCategory = await this.getAccountCategory(
      accountId,
      categoryId,
    );

    try {
      await this.accountWorkCategoryRepository.delete(accountCategory);
    } catch {
      throw new BadRequestException(
        AccountWorkCategoryError.DeleteAccountCategoryFail,
      );
    }
  }

  private async getAccountCategory(
    accountId: number,
    categoryId: number,
  ): Promise<AccountWorkCategory> {
    let accountCategory: AccountWorkCategory | null = null;

    try {
      accountCategory = await this.accountWorkCategoryRepository.findOne({
        where: {
          accountId,
          categoryId,
        },
      });
    } catch {
      throw new BadRequestException(
        AccountWorkCategoryError.AccountCategoryDidNotFound,
      );
    }

    if (!accountCategory) {
      throw new BadRequestException(
        AccountWorkCategoryError.AccountCategoryDidNotFound,
      );
    }

    return accountCategory;
  }
}
