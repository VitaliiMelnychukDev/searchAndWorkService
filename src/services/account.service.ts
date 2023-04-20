import { RegisterDto } from '../dtos/auth/register.dto';
import { Account } from '../entities/Account';
import { AccountRole, IAccount } from '../types/account';
import { HashService } from './hash.service';
import { AccountError } from '../types/error';
import { SearchDto } from '../dtos/account/search.dto';
import { FindOptionsWhere, Like, Repository } from 'typeorm';
import { PaginationService } from './pagination.service';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class AccountService {
  constructor(
    private hashService: HashService,
    private paginationService: PaginationService,
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,
  ) {}

  async create(account: RegisterDto): Promise<void> {
    const existedAccount: Account | null = await this.getAccount(
      account.email,
      AccountError.CreateAccountFail,
    );

    if (existedAccount) {
      throw new BadRequestException(AccountError.AccountEmailExists);
    }

    const newAccount = new Account();
    newAccount.role = account.role || AccountRole.User;
    newAccount.email = account.email;
    newAccount.name = account.name;
    newAccount.phone = account.phone;
    newAccount.active = false;
    newAccount.password = await this.hashService.hashString(account.password);

    await this.saveAccount(newAccount, AccountError.CreateAccountFail);
  }

  async getAccounts(searchParams: SearchDto): Promise<IAccount[]> {
    const sharedWhereOptions: FindOptionsWhere<Account> = {};
    if (searchParams.role) {
      sharedWhereOptions.role = searchParams.role;
    }

    let whereOptions: FindOptionsWhere<Account> | FindOptionsWhere<Account>[] =
      {};
    if (!searchParams.searchTerm) {
      whereOptions = sharedWhereOptions;
    } else {
      whereOptions = [
        {
          email: Like(`%${searchParams.searchTerm}%`),
          ...sharedWhereOptions,
        },
        {
          name: Like(`%${searchParams.searchTerm}%`),
          ...sharedWhereOptions,
        },
      ];
    }

    try {
      return await this.accountRepository.find({
        ...this.paginationService.getPaginationParams(searchParams),
        where: whereOptions,
        select: {
          email: true,
          name: true,
          role: true,
          active: true,
          id: true,
        },
      });
    } catch {
      throw new BadRequestException(AccountError.GetAccountsFail);
    }
  }

  private async getAccount(
    email: string,
    errorMessage: AccountError,
  ): Promise<Account> {
    if (!email) {
      throw new BadRequestException(errorMessage);
    }

    try {
      return await this.accountRepository.findOneBy({ email });
    } catch {
      throw new BadRequestException(errorMessage);
    }
  }

  private async saveAccount(
    account: Account,
    errorMessage: AccountError,
  ): Promise<void> {
    try {
      await this.accountRepository.save(account);
    } catch {
      throw new BadRequestException(errorMessage);
    }
  }
}
