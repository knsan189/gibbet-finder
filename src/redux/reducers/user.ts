import {
  FindUserRequest,
  SetUser,
  UserAction,
  UserActionTypes,
  UserState,
} from "../../@types/redux/user.interface";
import { User } from "../../@types/type";

const { FIND_USER_REQUEST, SET_USER } = UserActionTypes;

export const findUserRequest = (nickname: string): FindUserRequest => ({
  payload: { nickname },
  type: FIND_USER_REQUEST,
});

export const setUser = (user?: User): SetUser => ({
  payload: { user },
  type: SET_USER,
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
    default:
      return state;
  }
};

export default UserReducer;
