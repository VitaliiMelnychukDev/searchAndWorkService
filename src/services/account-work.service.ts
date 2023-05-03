import { AccountWork } from '../entities/AccountWork';
import { InjectRepository } from '@nestjs/typeorm';
import { Work } from '../entities/Work';
import { LessThanOrEqual, MoreThanOrEqual, Repository } from 'typeorm';
import { AccountHour } from '../entities/AccountHour';
import { ITokenPayload } from '../types/token';
import { AccountHelper } from '../helpers/account.helper';
import { Account } from '../entities/Account';
import {
  BadRequestException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { AccountWorkError, WorkError } from '../types/error';
import { WorkInitiator, WorkStatus } from '../types/accountWork';

export class AccountWorkService {
  private readonly availableTillDays = 20;
  constructor(
    @InjectRepository(Work)
    private readonly workRepository: Repository<Work>,
    @InjectRepository(AccountWork)
    private readonly accountWorkRepository: Repository<AccountWork>,

    @InjectRepository(AccountHour)
    private readonly accountHourRepository: Repository<AccountHour>,
  ) {}
  async proposeWork(
    workId: number,
    workerId: number,
    tokenPayload: ITokenPayload,
  ): Promise<AccountWork> {
    const work = await this.getWork(workId, tokenPayload);

    let accountHour: AccountHour | null = null;
    try {
      accountHour = await this.accountHourRepository.findOne({
        where: {
          startTime: LessThanOrEqual(work.startTime),
          endTime: MoreThanOrEqual(work.endTime),
        },
      });
    } catch {
      throw new BadRequestException(AccountWorkError.SendPropositionFail);
    }

    if (!accountHour) {
      throw new BadRequestException(AccountWorkError.SendPropositionFail);
    }

    const accountWork = new AccountWork();
    accountWork.workId = workId;
    accountWork.accountId = workerId;
    accountWork.payment = work.payment;
    accountWork.initiator = WorkInitiator.Employer;
    accountWork.status = WorkStatus.Proposed;
    accountWork.availableTill = this.getAvailableTill();

    try {
      return await this.accountWorkRepository.save(accountWork);
    } catch (e) {
      throw new BadRequestException(AccountWorkError.SendPropositionFail);
    }
  }

  async searchWorkWorkers(
    workId: number,
    tokenPayload: ITokenPayload,
  ): Promise<AccountWork[]> {
    await this.getWork(workId, tokenPayload);

    try {
      const accountWorks: AccountWork[] = await this.accountWorkRepository.find(
        {
          where: {
            workId,
          },
          relations: [
            'account',
            'work',
            'account.workCategories',
            'work.city',
            'work.category',
          ],
        },
      );

      return accountWorks.map((accountWork) => {
        accountWork.account = AccountHelper.getAccountWithoutPassword(
          accountWork.account,
        ) as Account;
        return accountWork;
      });
    } catch (e) {
      throw new BadRequestException(AccountWorkError.SearchWorkWorkersFail);
    }
  }

  async searchAccountWorks(
    tokenPayload: ITokenPayload,
  ): Promise<AccountWork[]> {
    try {
      const accountWorks: AccountWork[] = await this.accountWorkRepository.find(
        {
          where: {
            accountId: tokenPayload.accountId,
          },
          relations: [
            'account',
            'work',
            'account.workCategories',
            'work.city',
            'work.category',
          ],
        },
      );

      return accountWorks.map((accountWork) => {
        accountWork.account = AccountHelper.getAccountWithoutPassword(
          accountWork.account,
        ) as Account;
        return accountWork;
      });
    } catch (e) {
      throw new BadRequestException(AccountWorkError.SearchAccountWorksFail);
    }
  }

  async setWorkStatus(
    workId: number,
    status: WorkStatus,
    tokenPayload: ITokenPayload,
  ): Promise<void> {
    const accountWork = await this.getAccountWork(workId, tokenPayload);

    try {
      accountWork.status = status;

      await this.accountWorkRepository.save(accountWork);
    } catch {
      throw new BadRequestException(AccountWorkError.SetAccountWorkStatusFail);
    }
  }

  private async getWork(
    workId: number,
    tokenPayload?: ITokenPayload,
  ): Promise<Work> {
    const work: Work | null = await this.workRepository.findOne({
      where: {
        id: workId,
      },
      relations: ['account', 'category', 'city'],
    });

    if (!work || work.removed) {
      throw new NotFoundException(WorkError.WorkDoesNotExist);
    }

    if (tokenPayload && work.accountId !== tokenPayload.accountId) {
      throw new UnauthorizedException();
    }

    work.account = AccountHelper.getAccountWithoutPassword(
      work.account,
    ) as Account;

    return work;
  }

  public getAvailableTill(): number {
    const date = new Date();
    date.setDate(date.getDate() + this.availableTillDays);

    return date.getTime();
  }

  private async getAccountWork(
    workId: number,
    tokenPayload?: ITokenPayload,
  ): Promise<AccountWork> {
    const accountWork: AccountWork | null =
      await this.accountWorkRepository.findOne({
        where: {
          workId,
          accountId: tokenPayload.accountId,
        },
      });

    if (!accountWork) {
      throw new NotFoundException(AccountWorkError.AccountWorkDoesNotExists);
    }

    return accountWork;
  }
}
