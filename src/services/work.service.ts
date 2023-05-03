import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Like, MoreThan, Repository } from 'typeorm';
import { PaginationService } from './pagination.service';
import { ITokenPayload } from '../types/token';
import { WorkError } from '../types/error';
import { Work } from '../entities/Work';
import { WorkDto } from '../dtos/work/work.dto';
import { City } from '../entities/City';
import { Category } from '../entities/Category';
import { SearchDto } from '../dtos/base/pagination.dto';
import { SearchWork, Worker } from '../types/work';
import { Account } from '../entities/Account';
import { AccountHelper } from '../helpers/account.helper';
import { AccountHourType } from '../types/account';

@Injectable()
export class WorkService {
  constructor(
    @InjectRepository(Work)
    private readonly workRepository: Repository<Work>,

    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,

    @InjectRepository(City)
    private readonly cityRepository: Repository<City>,

    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,

    private paginationService: PaginationService,
  ) {}

  async searchWorkers(
    workId: number,
    tokenPayload: ITokenPayload,
  ): Promise<Worker[]> {
    const work = await this.getWork(workId, tokenPayload);

    try {
      const workers: Worker[] = await this.accountRepository
        .createQueryBuilder('account')
        .select('account.phone', 'phone')
        .addSelect('account.id', 'id')
        .addSelect('account.email', 'email')
        .addSelect('account.name', 'name')
        .addSelect('workCategories.description', 'categoryDescription')
        .addSelect('category.title', 'categoryName')
        .addSelect('accountWorks.workId', 'workId')
        .addSelect('city.title', 'cityName')
        .addSelect('hours.startTime', 'startTime')
        .addSelect('hours.endTime', 'endTime')
        .leftJoin('account.workCategories', 'workCategories')
        .leftJoin('workCategories.category', 'category')
        .leftJoin('account.hours', 'hours')
        .leftJoin('account.city', 'city')
        .leftJoin(
          'account.accountWorks',
          'accountWorks',
          'accountWorks.workId = :workId',
          {
            workId: work.id,
          },
        )
        .where('workCategories.categoryId = :workCategoryId', {
          workCategoryId: work.categoryId,
        })
        .andWhere('account.cityId = :accountCityId', {
          accountCityId: work.cityId,
        })
        .andWhere('account.id != :accountId', {
          accountId: work.accountId,
        })
        .andWhere('hours.startTime <= :workStartTime', {
          workStartTime: work.startTime,
        })
        .andWhere('hours.endTime >= :workEndTime', {
          workEndTime: work.endTime,
        })
        .andWhere('hours.startTime >= :nowTime', {
          nowTime: new Date().getTime(),
        })
        .andWhere('hours.type = :hourType', {
          hourType: AccountHourType.Available,
        })
        .andWhere('hours.type = :hourType', {
          hourType: AccountHourType.Available,
        })
        .execute();

      return workers;
    } catch (e) {
      throw new BadRequestException(WorkError.SearchWorkersFail);
    }
  }

  async get(id: number): Promise<Work> {
    return await this.getWork(id);
  }

  async getOwnWorks(
    searchData: SearchDto,
    tokenPayload?: ITokenPayload,
  ): Promise<SearchWork> {
    return await this.searchWorks(searchData, tokenPayload.accountId);
  }

  async getWorks(searchData: SearchDto): Promise<SearchWork> {
    return await this.searchWorks(searchData);
  }

  private async searchWorks(
    searchData: SearchDto,
    accountId?: number,
  ): Promise<SearchWork> {
    try {
      let whereOptions: FindOptionsWhere<Work> | FindOptionsWhere<Work>[] = {
        removed: false,
      };

      if (accountId) {
        whereOptions.accountId = accountId;
      } else {
        whereOptions.endTime = MoreThan(new Date().getTime());
      }

      if (searchData.searchTerm) {
        whereOptions = [
          {
            title: Like(`%${searchData.searchTerm}%`),
            ...whereOptions,
          },
          {
            description: Like(`%${searchData.searchTerm}%`),
            ...whereOptions,
          },
        ];
      }

      const [result, total] = await this.workRepository.findAndCount({
        ...this.paginationService.getPaginationParams(searchData),
        where: whereOptions,
        order: {
          id: 'DESC',
        },
        relations: ['account', 'category', 'city'],
      });

      result.forEach((work) => {
        work.account = AccountHelper.getAccountWithoutPassword(
          work.account,
        ) as Account;
      });

      return {
        works: result,
        total,
      };
    } catch {
      throw new BadRequestException(WorkError.GetWorkFail);
    }
  }

  async create(workData: WorkDto, tokenPayload: ITokenPayload): Promise<Work> {
    await this.validateWorkDto(workData, WorkError.CreateWorkFail);

    const work = this.setWorkData(new Work(), workData);
    work.createdAt = new Date().getTime();
    work.accountId = tokenPayload.accountId;

    try {
      return await this.workRepository.save(work);
    } catch (e) {
      throw new BadRequestException(WorkError.CreateWorkFail);
    }
  }

  async update(
    workData: WorkDto,
    workId: number,
    tokenPayload: ITokenPayload,
  ): Promise<Work> {
    await this.validateWorkDto(workData, WorkError.UpdateWorkFail);

    const work = await this.getWork(workId, tokenPayload);

    const updatedWork = this.setWorkData(work, workData);

    try {
      return await this.workRepository.save(updatedWork);
    } catch {
      throw new BadRequestException(WorkError.UpdateWorkFail);
    }
  }

  async remove(workId: number, tokenPayload: ITokenPayload): Promise<void> {
    const work = await this.getWork(workId, tokenPayload);
    work.removed = true;

    try {
      await this.workRepository.save(work);
    } catch {
      throw new BadRequestException(WorkError.DeleteWorkFail);
    }
  }

  private async validateWorkDto(
    workData: WorkDto,
    error: WorkError,
  ): Promise<void> {
    if (
      workData.startTime <= new Date().getTime() ||
      workData.endTime <= new Date().getTime() ||
      workData.startTime >= workData.endTime
    ) {
      throw new BadRequestException(WorkError.SaveWorkFail);
    }

    let city: City | null = null;

    try {
      city = await this.cityRepository.findOne({
        where: {
          id: workData.cityId,
        },
      });
    } catch {
      throw new BadRequestException(error);
    }

    if (!city) {
      throw new NotFoundException(WorkError.CityDoesNotExist);
    }

    let category: Category | null = null;

    try {
      category = await this.categoryRepository.findOne({
        where: {
          id: workData.categoryId,
        },
      });
    } catch {
      throw new BadRequestException(error);
    }

    if (!category) {
      throw new NotFoundException(WorkError.CategoryDoesNotExist);
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

  private setWorkData(work: Work, workData: WorkDto): Work {
    work.title = workData.title;
    work.description = workData.description;
    work.email = workData.email;
    work.phone = workData.phone || null;
    work.payment = workData.payment;
    work.startTime = workData.startTime;
    work.endTime = workData.endTime;
    work.countWorkers = workData.countWorkers;
    work.address = workData.address;
    work.categoryId = workData.categoryId;
    work.cityId = workData.cityId;

    return work;
  }
}
