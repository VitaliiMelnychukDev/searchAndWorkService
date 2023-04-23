import { Account } from '../entities/Account';
import { HashService } from './hash.service';
import { AuthError } from '../types/error';
import { LoginDto } from '../dtos/auth/login.dto';
import { Token } from '../entities/Token';
import { ILogin, ITokenPayload, ITokens } from '../types/token';
import { TokenService } from './token.service';
import { Repository } from 'typeorm';
import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Account)
    private readonly accountRepository: Repository<Account>,
    @InjectRepository(Token)
    private readonly tokenRepository: Repository<Token>,
    private hashService: HashService,
    private tokenService: TokenService,
  ) {}

  async login(loginData: LoginDto): Promise<ILogin> {
    let account: Account | null = null;

    try {
      account = await this.accountRepository.findOneBy({
        email: loginData.email,
      });
    } catch {
      throw new UnauthorizedException(AuthError.LoginAccountFail);
    }

    if (!account || !account.active) {
      throw new UnauthorizedException(AuthError.LoginAccountFail);
    }

    const passwordIsValid: boolean = await this.hashService.isMatch(
      loginData.password,
      account.password,
    );

    if (!passwordIsValid) {
      throw new UnauthorizedException(AuthError.LoginAccountFail);
    }

    try {
      const tokens = await this.generateTokens(account);

      return {
        ...tokens,
        user: this.tokenService.verifyAndGetAccessTokenData(tokens.accessToken),
      };
    } catch (e) {
      throw new UnauthorizedException(AuthError.LoginAccountFail);
    }
  }

  async refreshTokens(refreshToken: string): Promise<ITokens> {
    const token: Token = await this.getRefreshToken(
      refreshToken,
      AuthError.RefreshTokenFail,
    );

    if (token.expireAt < new Date().getTime()) {
      throw new BadRequestException(AuthError.RefreshTokenFail);
    }

    await this.deleteToken(refreshToken, AuthError.RefreshTokenFail);

    return this.generateTokens(token.account);
  }

  async logout(refreshToken: string, account: ITokenPayload): Promise<void> {
    const token: Token = await this.getRefreshToken(
      refreshToken,
      AuthError.RefreshTokenFail,
    );

    if (token.account.id !== account.accountId) {
      throw new BadRequestException(AuthError.LogoutFail);
    }

    await this.deleteToken(refreshToken, AuthError.LogoutFail);
  }

  private async generateTokens(account: Account): Promise<ITokens> {
    const newToken = new Token();
    newToken.accountId = account.id;
    newToken.refreshToken = this.tokenService.generateRefreshToken();
    newToken.expireAt = this.tokenService.getRefreshTokenExpiration();

    await this.tokenRepository.save(newToken);

    const accessToken = this.tokenService.generateAccessToken({
      accountId: account.id,
      email: account.email,
      name: account.name,
      role: account.role,
    });

    return {
      accessToken,
      refreshToken: newToken.refreshToken,
    };
  }

  private async getRefreshToken(
    refreshToken: string,
    errorMessage: AuthError,
  ): Promise<Token | null> {
    let token: Token | null = null;
    try {
      token = await this.tokenRepository.findOne({
        where: {
          refreshToken,
        },
        relations: {
          account: true,
        },
      });
    } catch {
      throw new BadRequestException(errorMessage);
    }

    if (!token || !token.account?.active) {
      throw new BadRequestException(errorMessage);
    }

    return token;
  }

  private async deleteToken(
    refreshToken: string,
    errorMessage: AuthError,
  ): Promise<void> {
    try {
      await this.tokenRepository.delete({
        refreshToken,
      });
    } catch {
      throw new BadRequestException(errorMessage);
    }
  }
}
