import {
  FindUserRequest,
  ResponseError,
  SetUser,
  UserAction,
  UserActionTypes,
  UserState,
} from "../../@types/redux/user.interface";
import { User } from "../../@types/type";

const { FIND_USER_REQUEST, SET_USER, RESPONSE_ERROR } = UserActionTypes;

export const findUserRequest = (nickname: string): FindUserRequest => ({
  payload: { nickname },
  type: FIND_USER_REQUEST,
});

export const setUser = (user?: User): SetUser => ({
  payload: { user },
  type: SET_USER,
});

export const responseError = (): ResponseError => ({
  payload: {},
  type: RESPONSE_ERROR,
});

const initialState: UserState = {
  user: undefined,
  status: "ok",
};

const UserReducer = (state = initialState, action: UserAction): UserState => {
  switch (action.type) {
    case FIND_USER_REQUEST:
      return {
        ...state,
        status: "loading",
      };
    case SET_USER:
      return {
        user: action.payload.user,
        status: "ok",
      };
    case RESPONSE_ERROR:
      return {
        ...state,
        status: "error",
      };
    default:
      return state;
  }
};

export default UserReducer;
