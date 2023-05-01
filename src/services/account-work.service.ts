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

    try {
      return await this.accountWorkRepository.save(accountWork);
    } catch {
      throw new BadRequestException(AccountWorkError.SendPropositionFail);
    }
  }

  async approveWork(workId: number, accountId: number): Promise<void> {}

  async rejectWork(workId: number, accountId: number): Promise<void> {}

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

    work.account = AccountHelper.getAccountWithoutPassword(
      work.account,
    ) as Account;

    if (!work || work.removed) {
      throw new NotFoundException(WorkError.WorkDoesNotExist);
    }

    if (tokenPayload && work.accountId !== tokenPayload.accountId) {
      throw new UnauthorizedException();
    }

    return work;
  }

  private async getAccountWork(
    workId: number,
    tokenPayload?: ITokenPayload,
  ): Promise<Work> {
    const work: Work | null = await this.workRepository.findOne({
      where: {
        id: workId,
      },
      relations: ['account', 'category', 'city'],
    });

    work.account = AccountHelper.getAccountWithoutPassword(
      work.account,
    ) as Account;

    if (!work || work.removed) {
      throw new NotFoundException(WorkError.WorkDoesNotExist);
    }

    if (tokenPayload && work.accountId !== tokenPayload.accountId) {
      throw new UnauthorizedException();
    }

    return work;
  }
}
