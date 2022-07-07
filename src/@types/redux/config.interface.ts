export enum ConfigActionTypes {
  SET_STATUS = "SET_STATUS",
  TOGGLE_DARK_MODE = "TOGGLE_DARK_MODE",
}

export type ConfigAction = SetStatus | ToggleDarkMode;

export interface ConfigState {
  status: "ok" | "loading" | "error";
  theme: "dark" | "light";
}

export interface SetStatus {
  payload: {};
  type: ConfigActionTypes.SET_STATUS;
}

export interface ToggleDarkMode {
  payload: { checked: boolean };
  type: ConfigActionTypes.TOGGLE_DARK_MODE;
}
