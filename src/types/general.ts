import {
  AuthMessage,
  AccountMessage,
  CityMessage,
  CategoryMessage,
  WorkMessage,
  AccountCategoryMessage,
  AccountHourMessage,
} from './message';

type Message =
  | AccountMessage
  | AuthMessage
  | CityMessage
  | CategoryMessage
  | WorkMessage
  | AccountCategoryMessage
  | AccountHourMessage;

export interface IResponseNoData {
  success?: boolean;
  message?: Message;
}

export interface IResponse<T> extends IResponseNoData {
  data: T;
}
