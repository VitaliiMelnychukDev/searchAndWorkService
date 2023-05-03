import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Req,
  ValidationPipe,
} from '@nestjs/common';
import { AccountWorkService } from '../services/account-work.service';
import { AuthNeeded } from '../decorators/auth.decorator';
import { SuggestDto } from '../dtos/account-work/suggest.dto';
import { IResponse, IResponseNoData } from '../types/general';
import { IAuthorizedRequest } from '../types/request';
import { AccountWorkMessage } from '../types/message';
import { Roles } from '../decorators/roles.decorator';
import { AccountRole } from '../types/account';
import { AccountWork } from '../entities/AccountWork';
import { WorkStatus } from '../types/accountWork';

@Controller('account-work')
export class AccountWorkController {
  constructor(private accountWorkService: AccountWorkService) {}

  @Post('suggest-work')
  @AuthNeeded()
  @Roles(AccountRole.User)
  async suggestWork(
    @Body(new ValidationPipe()) suggestData: SuggestDto,
    @Req() request: IAuthorizedRequest,
  ): Promise<IResponseNoData> {
    await this.accountWorkService.proposeWork(
      suggestData.workId,
      suggestData.workerId,
      request.account,
    );

    return {
      success: true,
      message: AccountWorkMessage.WorkSuccessfullySuggested,
    };
  }

  @Get('workers/:workId')
  @AuthNeeded()
  @Roles(AccountRole.User)
  async searchWorkWorkers(
    @Param('workId') workId: number,
    @Req() request: IAuthorizedRequest,
  ): Promise<IResponse<AccountWork[]>> {
    const workers = await this.accountWorkService.searchWorkWorkers(
      workId,
      request.account,
    );

    return {
      success: true,
      data: workers,
    };
  }

  @Patch('approve-work/:workId')
  @AuthNeeded()
  @Roles(AccountRole.User)
  async approveAccountWork(
    @Param('workId') workId: number,
    @Req() request: IAuthorizedRequest,
  ): Promise<IResponseNoData> {
    await this.accountWorkService.setWorkStatus(
      workId,
      WorkStatus.Approved,
      request.account,
    );

    return {
      success: true,
      message: AccountWorkMessage.WorkSuccessfullyApproved,
    };
  }

  @Patch('reject-work/:workId')
  @AuthNeeded()
  @Roles(AccountRole.User)
  async rejectAccountWork(
    @Param('workId') workId: number,
    @Req() request: IAuthorizedRequest,
  ): Promise<IResponseNoData> {
    await this.accountWorkService.setWorkStatus(
      workId,
      WorkStatus.Rejected,
      request.account,
    );

    return {
      success: true,
      message: AccountWorkMessage.WorkSuccessfullyRejected,
    };
  }

  @Get('account-works')
  @AuthNeeded()
  @Roles(AccountRole.User)
  async searchAccountWorks(
    @Req() request: IAuthorizedRequest,
  ): Promise<IResponse<AccountWork[]>> {
    const workers = await this.accountWorkService.searchAccountWorks(
      request.account,
    );

    return {
      success: true,
      data: workers,
    };
  }
}
