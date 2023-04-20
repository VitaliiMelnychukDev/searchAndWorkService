export enum AccountError {
  CreateAccountFail = 'CreateAccountFail',
  AccountEmailExists = 'AccountEmailExists',
  ActivateAccountFail = 'ActivateAccountFail',
  SetAccountRoleFail = 'SetAccountRoleFail',
  AccountNotFound = 'AccountNotFound',
  GetAccountsFail = 'GetAccountsFail',
  SendAccountRegisteredEventFail = 'SendAccountRegisteredEventFail',
}

export enum AuthError {
  LoginAccountFail = 'LoginAccountFail',
  RefreshTokenFail = 'RefreshTokenFail',
  LogoutFail = 'LogoutFail',
}

export enum CityError {
  CreateCityFail = 'CreateCityFail',
  DeleteCityFail = 'DeleteCityFail',
  GetCityFail = 'GetCityFail',
  CityDoesNotExist = 'CityDoesNotExist',
  CityAlreadyExist = 'CityAlreadyExist',
}

export enum CategoryError {
  CreateCategoryFail = 'CreateCategoryFail',
  DeleteCategoryFail = 'DeleteCategoryFail',
  GetCategoryFail = 'GetCategoryFail',
  CategoryDoesNotExist = 'CategoryDoesNotExist',
  CategoryAlreadyExist = 'CategoryAlreadyExist',
}

export enum TokenError {
  TokenIsNotValid = 'TokenIsNotValid',
}
