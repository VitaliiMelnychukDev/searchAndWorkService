import { AccountRole } from './account';

export type ITokens = {
  accessToken: string;
  refreshToken: string;
};

export type ITokenPayload = {
  accountId: number;
  email: string;
  role: AccountRole;
  name: string;
  cityId: number;
  address: string;
  imageSrc: string;
};

export type ILogin = ITokens & {
  user: ITokenPayload;
};
