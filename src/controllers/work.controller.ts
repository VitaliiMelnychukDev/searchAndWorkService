import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  ValidationPipe,
} from '@nestjs/common';
import { Roles } from '../decorators/roles.decorator';
import { AccountRole } from '../types/account';
import { AuthNeeded } from '../decorators/auth.decorator';
import { IAuthorizedRequest } from '../types/request';
import { IResponse, IResponseNoData } from '../types/general';
import { PaginationDto, SearchDto } from '../dtos/base/pagination.dto';
import { WorkService } from '../services/work.service';
import { WorkDto } from '../dtos/work/work.dto';
import { Work } from '../entities/Work';
import { SearchWork, Worker } from '../types/work';
import { WorkMessage } from '../types/message';

@Controller('work')
export class WorkController {
  constructor(private workService: WorkService) {}

  @Post('')
  @AuthNeeded()
  @Roles(AccountRole.User)
  async create(
    @Body(new ValidationPipe()) workData: WorkDto,
    @Req() request: IAuthorizedRequest,
  ): Promise<IResponse<Work>> {
    const work = await this.workService.create(workData, request.account);

    return {
      success: true,
      data: work,
    };
  }

  @Put(':id')
  @AuthNeeded()
  @Roles(AccountRole.User)
  async update(
    @Body(new ValidationPipe()) workData: WorkDto,
    @Param('id') id: number,
    @Req() request: IAuthorizedRequest,
  ): Promise<IResponse<Work>> {
    const work = await this.workService.update(workData, id, request.account);

    return {
      success: true,
      data: work,
    };
  }

  @Get('search-workers/:id')
  @AuthNeeded()
  async searchWorkers(
    @Param('id') id: number,
    @Req() request: IAuthorizedRequest,
  ): Promise<IResponse<Worker[]>> {
    const workers = await this.workService.searchWorkers(id, request.account);

    return {
      success: true,
      data: workers,
    };
  }

  @Get('search')
  async search(
    @Query(new ValidationPipe()) searchData: SearchDto,
    @Req() request: IAuthorizedRequest,
  ): Promise<IResponse<SearchWork>> {
    const works = await this.workService.getWorks(searchData);

    return {
      success: true,
      data: works,
    };
  }

  @Get('getAccountWorks')
  @AuthNeeded()
  @Roles(AccountRole.User)
  async getAccountWorks(
    @Query(new ValidationPipe()) paginationData: PaginationDto,
    @Req() request: IAuthorizedRequest,
  ): Promise<IResponse<SearchWork>> {
    const works = await this.workService.getOwnWorks(
      paginationData,
      request.account,
    );

    return {
      success: true,
      data: works,
    };
  }

  @Get(':id')
  async get(@Param('id') id: number): Promise<IResponse<Work>> {
    const work = await this.workService.get(id);

    return {
      success: true,
      data: work,
    };
  }

  @Delete(':id')
  @AuthNeeded()
  @Roles(AccountRole.User)
  async remove(
    @Param('id') id: number,
    @Req() request: IAuthorizedRequest,
  ): Promise<IResponseNoData> {
    await this.workService.remove(id, request.account);

    return {
      success: true,
      message: WorkMessage.WorkSuccessfullyRemoved,
    };
  }
}
