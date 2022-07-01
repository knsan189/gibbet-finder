import { User } from "../type";

export enum UserActionTypes {
  FIND_USER_REQUEST = "FIND_USER_REQUEST",
  SET_USER = "SET_USER",
}

export type UserAction = FindUserRequest | SetUser;

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
