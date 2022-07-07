import { SnackbarKey } from "notistack";
import {
  CloseSnackbar,
  EnqueueSnackbar,
  Notification,
  RemoveSnackbar,
  SnackbarAction,
  SnackbarActionTypes,
  SnackbarState,
} from "../../@types/redux/snackbar.interface";

const { ENQUEUE_SNACKBAR, CLOSE_SNACKBAR, REMOVE_SNACKBAR } = SnackbarActionTypes;

export const enqueueSnackbar = (notification: Notification): EnqueueSnackbar => {
  const key = notification.options && notification.options.key;

  return {
    type: ENQUEUE_SNACKBAR,
    notification: {
      ...notification,
      key: key || new Date().getTime() + Math.random(),
    },
  };
};

export const closeSnackbar = (key: SnackbarKey): CloseSnackbar => ({
  type: CLOSE_SNACKBAR,
  dismissAll: Boolean(!key), // dismiss all if no key has been defined
  key,
});

export const removeSnackbar = (key: SnackbarKey): RemoveSnackbar => ({
  type: REMOVE_SNACKBAR,
  key,
});

const initialState: SnackbarState = {
  notifications: [],
};

const SnackbarReducer = (state = initialState, action: SnackbarAction): SnackbarState => {
  switch (action.type) {
    case ENQUEUE_SNACKBAR:
      return {
        ...state,
        notifications: [
          ...state.notifications,
          {
            key: action.notification.key,
            ...action.notification,
          },
        ],
      };

    case CLOSE_SNACKBAR:
      return {
        ...state,
        notifications: state.notifications.map((notification) =>
          action.dismissAll || notification.key === action.key
            ? { ...notification, dismissed: true }
            : { ...notification },
        ),
      };

    case REMOVE_SNACKBAR:
      return {
        ...state,
        notifications: state.notifications.filter(
          (notification) => notification.key !== action.key,
        ),
      };

    default:
      return state;
  }
};

export default SnackbarReducer;
