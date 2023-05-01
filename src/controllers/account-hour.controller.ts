import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  ValidationPipe,
} from '@nestjs/common';
import { AuthNeeded } from '../decorators/auth.decorator';
import { IAuthorizedRequest } from '../types/request';
import { IResponse, IResponseNoData } from '../types/general';
import { Roles } from '../decorators/roles.decorator';
import { AccountRole } from '../types/account';
import { AccountHourMessage } from '../types/message';
import { AccountHourService } from '../services/account-hour.service';
import { AccountHour } from '../entities/AccountHour';
import { AccountHourDto } from '../dtos/account-hour/account-hour.dto';

@Controller('account-hour')
export class AccountHourController {
  constructor(private accountHourService: AccountHourService) {}

  @Get('getAll')
  @AuthNeeded()
  async getAll(
    @Req() request: IAuthorizedRequest,
  ): Promise<IResponse<AccountHour[]>> {
    const accountHours = await this.accountHourService.getAll(
      request.account.accountId,
    );

    return {
      success: true,
      data: accountHours,
    };
  }

  @Get(':id')
  @AuthNeeded()
  async get(
    @Param('id') id: number,
    @Req() request: IAuthorizedRequest,
  ): Promise<IResponse<AccountHour>> {
    const accountHour = await this.accountHourService.get(
      id,
      request.account.accountId,
    );

    return {
      success: true,
      data: accountHour,
    };
  }

  @Post()
  @AuthNeeded()
  @Roles(AccountRole.User)
  async create(
    @Body(new ValidationPipe()) accountHourData: AccountHourDto,
    @Req() request: IAuthorizedRequest,
  ): Promise<IResponse<AccountHour>> {
    const accountHour = await this.accountHourService.create(
      request.account.accountId,
      accountHourData,
    );

    return {
      success: true,
      data: accountHour,
    };
  }

  @Put(':id')
  @AuthNeeded()
  @Roles(AccountRole.User)
  async update(
    @Param('id') id: number,
    @Body(new ValidationPipe()) accountHourData: AccountHourDto,
    @Req() request: IAuthorizedRequest,
  ): Promise<IResponse<AccountHour>> {
    const accountHour = await this.accountHourService.update(
      id,
      request.account.accountId,
      accountHourData,
    );

    return {
      success: true,
      data: accountHour,
    };
  }

  @Delete(':id')
  @AuthNeeded()
  @Roles(AccountRole.User)
  async remove(
    @Param('id') id: number,
    @Req() request: IAuthorizedRequest,
  ): Promise<IResponseNoData> {
    await this.accountHourService.delete(id, request.account.accountId);

    return {
      success: true,
      message: AccountHourMessage.AccountHourSuccessfullyRemoved,
    };
  }
}
