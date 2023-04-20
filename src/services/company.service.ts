import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Company } from '../entities/Company';
import { CompanyDto } from '../dtos/company/company.dto';
import { CompanyError } from '../types/error';
import { ITokenPayload } from '../types/token';
import { PaginationDto } from '../dtos/base/pagination.dto';
import { PaginationService } from './pagination.service';
import { SearchCompanies } from '../types/company';

@Injectable()
export class CompanyService {
  constructor(
    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,

    private paginationService: PaginationService,
  ) {}

  async get(companyId: number): Promise<Company> {
    return await this.getCompany(companyId);
  }

  async getCompanies(
    searchData: PaginationDto,
    tokenPayload: ITokenPayload,
  ): Promise<SearchCompanies> {
    try {
      const [result, total] = await this.companyRepository.findAndCount({
        ...this.paginationService.getPaginationParams(searchData),
        where: {
          accountId: tokenPayload.accountId,
        },
      });

      return {
        companies: result,
        total,
      };
    } catch {
      throw new BadRequestException(CompanyError.GetCompanyFail);
    }
  }

  async create(
    companyData: CompanyDto,
    tokenPayload: ITokenPayload,
  ): Promise<Company> {
    const company: Company | null = await this.companyRepository.findOne({
      where: {
        email: companyData.email,
      },
    });

    if (company) {
      throw new BadRequestException(CompanyError.CompanyWithEmailAlreadyExists);
    }

    const newCompany = this.setCompanyData(new Company(), companyData);
    newCompany.accountId = tokenPayload.accountId;

    try {
      return await this.companyRepository.save(newCompany);
    } catch {
      throw new BadRequestException(CompanyError.CreateCompanyFail);
    }
  }

  async update(
    companyData: CompanyDto,
    companyId: number,
    tokenPayload: ITokenPayload,
  ): Promise<Company> {
    const company = await this.getCompany(companyId, tokenPayload);
    if (company.email !== companyData.email) {
      const existedCompany: Company | null =
        await this.companyRepository.findOne({
          where: {
            email: companyData.email,
          },
        });

      if (existedCompany) {
        throw new BadRequestException(
          CompanyError.CompanyWithEmailAlreadyExists,
        );
      }
    }

    const updatedCompany = this.setCompanyData(company, companyData);

    try {
      return await this.companyRepository.save(updatedCompany);
    } catch {
      throw new BadRequestException(CompanyError.UpdateCompanyFail);
    }
  }

  private async getCompany(
    companyId: number,
    tokenPayload?: ITokenPayload,
  ): Promise<Company> {
    const company: Company | null = await this.companyRepository.findOne({
      where: {
        id: companyId,
      },
    });

    if (!company) {
      throw new NotFoundException(CompanyError.CompanyDoesNotExist);
    }

    if (tokenPayload && company.accountId !== tokenPayload.accountId) {
      throw new UnauthorizedException();
    }

    return company;
  }

  private setCompanyData(company: Company, companyData: CompanyDto): Company {
    company.title = companyData.title;
    company.description = companyData.description;
    company.email = companyData.email;
    company.address = companyData.address;
    company.phone = companyData.phone || null;

    return company;
  }
}
