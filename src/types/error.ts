export enum AccountError {
  CreateAccountFail = 'CreateAccountFail',
  AccountEmailExists = 'AccountEmailExists',
  ActivateAccountFail = 'ActivateAccountFail',
  SetAccountRoleFail = 'SetAccountRoleFail',
  AccountNotFound = 'AccountNotFound',
  GetAccountsFail = 'GetAccountsFail',
  SendAccountRegisteredEventFail = 'SendAccountRegisteredEventFail',
  CityDoesNotExist = 'CityDoesNotExist',
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

export enum CompanyError {
  CreateCompanyFail = 'CreateCompanyFail',
  UpdateCompanyFail = 'UpdateCompanyFail',
  GetCompanyFail = 'GetCompanyFail',
  CompanyDoesNotExist = 'CompanyDoesNotExist',
  CompanyWithEmailAlreadyExists = 'CompanyWithEmailAlreadyExists',
}

export enum WorkError {
  CreateWorkFail = 'CreateWorkFail',
  UpdateWorkFail = 'UpdateWorkFail',
  GetWorkFail = 'GetWorkFail',
  WorkDoesNotExist = 'WorkDoesNotExist',
  CityDoesNotExist = 'CityDoesNotExist',
  CompanyDoesNotExist = 'CompanyDoesNotExist',
  CategoryDoesNotExist = 'CategoryDoesNotExist',
  WorkErrorOccurred = 'WorkErrorOccurred',
  DeleteWorkFail = 'DeleteWorkFail',
  SaveWorkFail = 'SaveWorkFail',
  SearchWorkersFail = 'SearchWorkersFail',
}

export enum AccountWorkError {
  SendPropositionFail = 'SendPropositionFail',
  SearchWorkWorkersFail = 'SearchWorkWorkersFail',
  SearchAccountWorksFail = 'SearchAccountWorksFail',
  AccountWorkDoesNotExists = 'AccountWorkDoesNotExists',
  SetAccountWorkStatusFail = 'SetAccountWorkStatusFail',
}

export enum TokenError {
  TokenIsNotValid = 'TokenIsNotValid',
}

export enum AccountWorkCategoryError {
  AccountCategoryDidNotFound = 'AccountCategoryDidNotFound',
  CategoryDidNotFound = 'CategoryDidNotFound',
  CreateAccountCategoryFail = 'CreateAccountCategoryFail',
  GetAccountCategoriesFail = 'GetAccountCategoriesFail',
  DeleteAccountCategoryFail = 'DeleteAccountCategoryFail',
  UpdateAccountCategoryFail = 'UpdateAccountCategoryFail',
}

export enum AccountHourError {
  SaveAccountHourFail = 'SaveAccountHourFail',
  AccountHourDidNotFound = 'AccountHourDidNotFound',
  CreateAccountHourFail = 'CreateAccountHourFail',
  GetAccountHourFail = 'GetAccountHourFail',
  DeleteAccountHourFail = 'DeleteAccountHourFail',
  UpdateAccountHourFail = 'UpdateAccountHourFail',
}
