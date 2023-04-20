import {
  AuthMessage,
  AccountMessage,
  CityMessage,
  CategoryMessage,
  WorkMessage,
} from './message';

type Message =
  | AccountMessage
  | AuthMessage
  | CityMessage
  | CategoryMessage
  | WorkMessage;

export interface IResponseNoData {
  success?: boolean;
  message?: Message;
}

export interface IResponse<T> extends IResponseNoData {
  data: T;
}
