import { Controller, Get, Req } from '@nestjs/common';
import { AuthNeeded } from '../decorators/auth.decorator';
import { IAuthorizedRequest } from '../types/request';
import { IResponse, IResponseNoData } from '../types/general';
import { ITokenPayload } from '../types/token';

@Controller('account')
export class AccountController {
  @Get('')
  @AuthNeeded()
  async get(
    @Req() request: IAuthorizedRequest,
  ): Promise<IResponse<ITokenPayload>> {
    return {
      success: true,
      data: request.account,
    };
  }
}
