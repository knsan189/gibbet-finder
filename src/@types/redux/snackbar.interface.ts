import { OptionsObject, SnackbarKey, SnackbarMessage } from "notistack";

export interface SnackbarState {
  notifications: Notification[];
}

export enum SnackbarActionTypes {
  ENQUEUE_SNACKBAR = "ENQUEUE_SNACKBAR",
  CLOSE_SNACKBAR = "CLOSE_SNACKBAR",
  REMOVE_SNACKBAR = "REMOVE_SNACKBAR",
}

export type SnackbarAction = EnqueueSnackbar | CloseSnackbar | RemoveSnackbar;

export interface EnqueueSnackbar {
  type: SnackbarActionTypes.ENQUEUE_SNACKBAR;
  notification: Notification;
}

export interface CloseSnackbar {
  type: SnackbarActionTypes.CLOSE_SNACKBAR;
  key: SnackbarKey;
  dismissAll: boolean;
}

export interface RemoveSnackbar {
  type: SnackbarActionTypes.REMOVE_SNACKBAR;
  key: SnackbarKey;
}

export interface Notification {
  key?: SnackbarKey;
  message: SnackbarMessage;
  options?: OptionsObject;
  dismissed?: boolean;
}
