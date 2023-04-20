import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  ValidationPipe,
} from '@nestjs/common';
import { CompanyService } from '../services/company.service';
import { CompanyDto } from '../dtos/company/company.dto';
import { Roles } from '../decorators/roles.decorator';
import { AccountRole } from '../types/account';
import { AuthNeeded } from '../decorators/auth.decorator';
import { Company } from '../entities/Company';
import { IAuthorizedRequest } from '../types/request';
import { IResponse } from '../types/general';
import { PaginationDto } from '../dtos/base/pagination.dto';
import { SearchCompanies } from '../types/company';

@Controller('company')
export class CompanyController {
  constructor(private companyService: CompanyService) {}

  @Post('')
  @AuthNeeded()
  @Roles(AccountRole.Company)
  async create(
    @Body(new ValidationPipe()) companyData: CompanyDto,
    @Req() request: IAuthorizedRequest,
  ): Promise<IResponse<Company>> {
    const company = await this.companyService.create(
      companyData,
      request.account,
    );

    return {
      success: true,
      data: company,
    };
  }

  @Put(':id')
  @AuthNeeded()
  @Roles(AccountRole.Company)
  async update(
    @Body(new ValidationPipe()) companyData: CompanyDto,
    @Param('id') id: number,
    @Req() request: IAuthorizedRequest,
  ): Promise<IResponse<Company>> {
    const company = await this.companyService.update(
      companyData,
      id,
      request.account,
    );

    return {
      success: true,
      data: company,
    };
  }

  @Get('search')
  @AuthNeeded()
  @Roles(AccountRole.Company)
  async search(
    @Query(new ValidationPipe()) paginationData: PaginationDto,
    @Req() request: IAuthorizedRequest,
  ): Promise<IResponse<SearchCompanies>> {
    const companies = await this.companyService.getCompanies(
      paginationData,
      request.account,
    );

    return {
      success: true,
      data: companies,
    };
  }

  @Get(':id')
  async get(@Param('id') id: number): Promise<IResponse<Company>> {
    const company = await this.companyService.get(id);

    return {
      success: true,
      data: company,
    };
  }
}
