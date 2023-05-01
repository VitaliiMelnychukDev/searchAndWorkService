import { InjectRepository } from '@nestjs/typeorm';
import {
  FindOptionsWhere,
  LessThan,
  LessThanOrEqual,
  MoreThan,
  MoreThanOrEqual,
  Not,
  Repository,
} from 'typeorm';
import { BadRequestException } from '@nestjs/common';
import { AccountHour } from '../entities/AccountHour';
import { AccountHourError } from '../types/error';
import { AccountHourDto } from '../dtos/account-hour/account-hour.dto';

export class AccountHourService {
  constructor(
    @InjectRepository(AccountHour)
    private readonly accountHourRepository: Repository<AccountHour>,
  ) {}
  async create(
    accountId: number,
    accountHour: AccountHourDto,
  ): Promise<AccountHour> {
    await this.validateAccountHour(accountId, accountHour);
    const newAccountHour = new AccountHour();
    newAccountHour.accountId = accountId;
    newAccountHour.startTime = accountHour.startTime;
    newAccountHour.endTime = accountHour.endTime;
    newAccountHour.type = accountHour.type;

    try {
      return await this.accountHourRepository.save(newAccountHour);
    } catch (e) {
      console.log('E: ', e);
      throw new BadRequestException(AccountHourError.CreateAccountHourFail);
    }
  }

  async get(id: number, accountId: number): Promise<AccountHour> {
    return await this.getAccountHour(id, accountId);
  }

  async getAll(accountId: number): Promise<AccountHour[]> {
    try {
      return await this.accountHourRepository.find({
        where: {
          accountId,
        },
      });
    } catch {
      throw new BadRequestException(AccountHourError.GetAccountHourFail);
    }
  }

  async update(
    id: number,
    accountId: number,
    accountHour: AccountHourDto,
  ): Promise<AccountHour> {
    await this.validateAccountHour(accountId, accountHour, id);

    const existedAccountHour = await this.getAccountHour(id, accountId);

    existedAccountHour.startTime = accountHour.startTime;
    existedAccountHour.endTime = accountHour.endTime;
    existedAccountHour.type = accountHour.type;

    try {
      return await this.accountHourRepository.save(existedAccountHour);
    } catch {
      throw new BadRequestException(AccountHourError.UpdateAccountHourFail);
    }
  }

  async delete(id: number, accountId: number): Promise<void> {
    const accountHour = await this.getAccountHour(id, accountId);

    try {
      await this.accountHourRepository.delete(accountHour);
    } catch {
      throw new BadRequestException(AccountHourError.DeleteAccountHourFail);
    }
  }

  private async validateAccountHour(
    accountId: number,
    accountHour: AccountHourDto,
    id?: number,
  ): Promise<void> {
    if (
      accountHour.startTime <= new Date().getTime() ||
      accountHour.endTime <= new Date().getTime() ||
      accountHour.startTime >= accountHour.endTime
    ) {
      throw new BadRequestException(AccountHourError.SaveAccountHourFail);
    }

    let whereOptions:
      | FindOptionsWhere<AccountHour>
      | FindOptionsWhere<AccountHour>[] = {
      accountId,
    };

    if (id) {
      whereOptions.id = Not(id);
    }

    whereOptions = [
      {
        startTime: LessThan(accountHour.startTime),
        endTime: MoreThan(accountHour.startTime),
        ...whereOptions,
      },
      {
        startTime: LessThan(accountHour.endTime),
        endTime: MoreThan(accountHour.endTime),
        ...whereOptions,
      },
      {
        startTime: MoreThanOrEqual(accountHour.startTime),
        endTime: LessThanOrEqual(accountHour.endTime),
        ...whereOptions,
      },
    ];

    let accountHours: AccountHour[] = [];

    try {
      accountHours = await this.accountHourRepository.find({
        where: whereOptions,
      });
    } catch (e) {
      throw new BadRequestException(AccountHourError.SaveAccountHourFail);
    }

    if (accountHours.length) {
      throw new BadRequestException(AccountHourError.SaveAccountHourFail);
    }
  }

  private async getAccountHour(
    id: number,
    accountId: number,
  ): Promise<AccountHour> {
    let accountHour: AccountHour | null = null;

    try {
      accountHour = await this.accountHourRepository.findOne({
        where: {
          id,
          accountId,
        },
      });
    } catch {
      throw new BadRequestException(AccountHourError.AccountHourDidNotFound);
    }

    if (!accountHour) {
      throw new BadRequestException(AccountHourError.AccountHourDidNotFound);
    }

    return accountHour;
  }
}
