import { RegisterDto } from '../dtos/auth/register.dto';
import { AccountService } from '../services/account.service';
import { IResponse, IResponseNoData } from '../types/general';
import { LoginDto } from '../dtos/auth/login.dto';
import { AuthService } from '../services/auth.service';
import { ITokens } from '../types/token';
import { AuthMessage, AccountMessage } from '../types/message';
import { ValidateDto } from '../dtos/auth/validate.dto';
import { IValidate } from '../types/auth';
import { TokenService } from '../services/token.service';
import { RefreshDto } from '../dtos/auth/refresh.dto';
import { IAuthorizedRequest } from '../types/request';
import {
  Body,
  Controller,
  Post,
  Req,
  UnauthorizedException,
  ValidationPipe,
} from '@nestjs/common';
import { TokenError } from '../types/error';
import { AuthNeeded } from '../decorators/auth.decorator';

@Controller('auth')
export class AuthController {
  constructor(
    private accountService: AccountService,
    private authService: AuthService,
  ) {}

  @Post('/register')
  async register(
    @Body(new ValidationPipe()) registerBody: RegisterDto,
  ): Promise<IResponseNoData> {
    await this.accountService.create(registerBody);

    return {
      success: true,
      message: AccountMessage.AccountSuccessfullyRegistered,
    };
  }

  @Post('/login')
  async login(
    @Body(new ValidationPipe()) loginBody: LoginDto,
  ): Promise<IResponse<ITokens>> {
    const tokens = await this.authService.login(loginBody);

    return {
      data: tokens,
    };
  }

  @Post('/validate')
  validate(
    @Body(new ValidationPipe()) validateBody: ValidateDto,
  ): IResponse<IValidate> {
    const response: IResponse<IValidate> = {
      data: {
        tokenValid: false,
      },
    };

    try {
      new TokenService().verifyAndGetAccessTokenData(validateBody.token);

      response.data.tokenValid = true;
    } catch {
      throw new UnauthorizedException(TokenError.TokenIsNotValid);
    }

    return response;
  }

  @Post('/refresh')
  async refresh(
    @Body(new ValidationPipe()) refreshBody: RefreshDto,
  ): Promise<IResponse<ITokens>> {
    const tokens: ITokens = await this.authService.refreshTokens(
      refreshBody.refreshToken,
    );

    return {
      data: tokens,
    };
  }

  @Post('/logout')
  @AuthNeeded()
  async logout(
    @Body(new ValidationPipe()) logoutBody: RefreshDto,
    @Req() request: IAuthorizedRequest,
  ): Promise<IResponseNoData> {
    await this.authService.logout(logoutBody.refreshToken, request.account);

    return {
      success: true,
      message: AuthMessage.AccountSuccessfullyLoggedOut,
    };
  }
}
