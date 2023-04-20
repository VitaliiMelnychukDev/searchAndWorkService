import {
  AuthMessage,
  AccountMessage,
  CityMessage,
  CategoryMessage,
} from './message';

type Message = AccountMessage | AuthMessage | CityMessage | CategoryMessage;

export interface IResponseNoData {
  success?: boolean;
  message?: Message;
}

export interface IResponse<T> extends IResponseNoData {
  data: T;
}
