export enum UserActionTypes {
  FIND_USER_REQUEST = "FIND_USER_REQUEST",
  SET_USER = "SET_USER",
  SET_HISTORIES = "SET_HISTORIES",
  RESPONSE_ERROR = "RESPONSE_ERROR",
}

export type UserAction = FindUserRequest | SetUser | SetHistories | ResponseError;

export interface UserState {
  user?: User;
  histories: History[];
  status: "ok" | "loading" | "error";
}

export interface FindUserRequest {
  payload: { nickname: string };
  type: UserActionTypes.FIND_USER_REQUEST;
}

export interface SetUser {
  payload: { user?: User };
  type: UserActionTypes.SET_USER;
}

export interface SetHistories {
  payload: { histories: History[] };
  type: UserActionTypes.SET_HISTORIES;
}

export interface ResponseError {
  payload: {};
  type: UserActionTypes.RESPONSE_ERROR;
}

export interface History {
  keyword: string;
  date: Date | string;
}
