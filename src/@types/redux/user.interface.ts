import { User } from "../type";

export enum UserActionTypes {
  FIND_USER_REQUEST = "FIND_USER_REQUEST",
  SET_USER = "SET_USER",
  RESPONSE_ERROR = "RESPONSE_ERROR",
}

export type UserAction = FindUserRequest | SetUser | ResponseError;

export interface UserState {
  user?: User;
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

export interface ResponseError {
  payload: {};
  type: UserActionTypes.RESPONSE_ERROR;
}
