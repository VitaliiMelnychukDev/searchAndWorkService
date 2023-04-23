import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Company } from '../entities/Company';
import { FindOptionsWhere, In, Like, MoreThan, Repository } from 'typeorm';
import { PaginationService } from './pagination.service';
import { ITokenPayload } from '../types/token';
import { WorkError } from '../types/error';
import { Work } from '../entities/Work';
import { WorkDto } from '../dtos/work/work.dto';
import { City } from '../entities/City';
import { Category } from '../entities/Category';
import { SearchDto } from '../dtos/base/pagination.dto';
import { SearchWork } from '../types/work';

@Injectable()
export class WorkService {
  private readonly expirationDays = 10;
  constructor(
    @InjectRepository(Work)
    private readonly workRepository: Repository<Work>,

    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,

    @InjectRepository(City)
    private readonly cityRepository: Repository<City>,

    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,

    private paginationService: PaginationService,
  ) {}

  async get(companyId: number): Promise<Work> {
    return await this.getWork(companyId);
  }

  async getOwnWorks(
    searchData: SearchDto,
    tokenPayload?: ITokenPayload,
  ): Promise<SearchWork> {
    let companyIds: number[] = [];

    try {
      const companies = await this.companyRepository.find({
        where: {
          accountId: tokenPayload.accountId,
        },
      });

      companyIds = companies.map((company) => company.id);
    } catch {
      throw new BadRequestException(WorkError.GetWorkFail);
    }

    return await this.searchWorks(searchData, companyIds);
  }

  async getWorks(searchData: SearchDto): Promise<SearchWork> {
    return await this.searchWorks(searchData);
  }

  private async searchWorks(
    searchData: SearchDto,
    companyIds: number[] = [],
  ): Promise<SearchWork> {
    try {
      let whereOptions: FindOptionsWhere<Work> | FindOptionsWhere<Work>[] = {
        removed: false,
      };

      if (companyIds.length) {
        whereOptions.companyId = In(companyIds);
      } else {
        whereOptions.expireAt = MoreThan(new Date().getTime());
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
          expireAt: 'DESC',
        },
        relations: ['company', 'category', 'city'],
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
    await this.validateWorkDto(
      workData,
      tokenPayload,
      WorkError.CreateWorkFail,
    );

    const work = this.setWorkData(new Work(), workData);
    work.createdAt = new Date().getTime();

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
    await this.validateWorkDto(
      workData,
      tokenPayload,
      WorkError.UpdateWorkFail,
    );

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
    tokenPayload: ITokenPayload,
    error: WorkError,
  ): Promise<void> {
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

    let company: Company | null = null;

    try {
      company = await this.companyRepository.findOne({
        where: {
          id: workData.companyId,
        },
      });
    } catch {
      throw new BadRequestException(error);
    }

    if (!company) {
      throw new NotFoundException(WorkError.CompanyDoesNotExist);
    }

    if (company.accountId !== tokenPayload.accountId) {
      throw new UnauthorizedException();
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
      relations: ['company', 'category', 'city'],
    });

    if (!work || work.removed) {
      throw new NotFoundException(WorkError.WorkDoesNotExist);
    }

    if (tokenPayload) {
      let company: Company | null = null;

      try {
        company = await this.companyRepository.findOne({
          where: {
            id: work.companyId,
          },
        });
      } catch {
        throw new BadRequestException(WorkError.WorkErrorOccurred);
      }

      if (!company) {
        throw new NotFoundException(WorkError.CompanyDoesNotExist);
      }

      if (company.accountId !== tokenPayload.accountId) {
        throw new UnauthorizedException();
      }
    }

    return work;
  }

  private setWorkData(work: Work, workData: WorkDto): Work {
    work.title = workData.title;
    work.description = workData.description;
    work.email = workData.email;
    work.phone = workData.phone || null;
    work.payment = workData.payment;
    work.companyId = workData.companyId;
    work.categoryId = workData.categoryId;
    work.cityId = workData.cityId;
    const date = new Date();
    date.setDate(date.getDate() + this.expirationDays);
    work.expireAt = date.getTime();

    return work;
  }
}
