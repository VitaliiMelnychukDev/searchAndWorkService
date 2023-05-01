import { RegisterDto } from '../dtos/auth/register.dto';
import { Account } from '../entities/Account';
import { AccountRole } from '../types/account';
import { HashService } from './hash.service';
import { AccountError } from '../types/error';
import { Repository } from 'typeorm';
import { PaginationService } from './pagination.service';
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { City } from '../entities/City';

@Injectable()
export class AccountService {
  constructor(
    private hashService: HashService,
    private paginationService: PaginationService,
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,
    @InjectRepository(City)
    private readonly cityRepository: Repository<City>,
  ) {}

  async create(account: RegisterDto): Promise<void> {
    const existedAccount: Account | null = await this.getAccount(
      account.email,
      AccountError.CreateAccountFail,
    );

    if (existedAccount) {
      throw new BadRequestException(AccountError.AccountEmailExists);
    }

    let city: City | null = null;

    try {
      city = await this.cityRepository.findOne({
        where: { id: account.cityId },
      });
    } catch {
      throw new BadRequestException(AccountError.CreateAccountFail);
    }

    if (!city) {
      throw new BadRequestException(AccountError.CityDoesNotExist);
    }

    const newAccount = new Account();
    newAccount.role = account.role || AccountRole.User;
    newAccount.email = account.email;
    newAccount.name = account.name;
    newAccount.phone = account.phone;
    newAccount.active = false;
    newAccount.cityId = account.cityId;
    newAccount.imageSrc = account.imageSrc || null;
    newAccount.address = account.address;
    newAccount.password = await this.hashService.hashString(account.password);

    await this.saveAccount(newAccount, AccountError.CreateAccountFail);
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
