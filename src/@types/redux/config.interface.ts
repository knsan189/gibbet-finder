export enum ConfigActionTypes {
  SET_STATUS = "SET_STATUS",
}

export type ConfigAction = SetStatus;

export interface ConfigState {
  status: "ok" | "loading" | "error";
}

export interface SetStatus {
  payload: {};
  type: ConfigActionTypes.SET_STATUS;
}
