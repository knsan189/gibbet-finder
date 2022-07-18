import { responseError, setHistories } from "./../reducers/user";
import { all, call, fork, put, select, takeLatest } from "@redux-saga/core/effects";
import {
  FindUserRequest,
  History,
  UserActionTypes,
  UserState,
} from "../../@types/redux/user.interface";
import { User } from "../../@types/type";
import UserService from "../../service/UserService";
import { enqueueSnackbar } from "../reducers/snackbar";
import { setUser } from "../reducers/user";
import { RootState } from "../reducers";

const { FIND_USER_REQUEST } = UserActionTypes;

function* findUserRequest({ payload }: FindUserRequest) {
  try {
    const user: User = yield call(UserService.getChar, payload.nickname);
    yield put(setUser(user));

    const { histories }: UserState = yield select((state: RootState) => state.user);
    const newHistories: History[] = [...histories];

    const targetIndex = newHistories.findIndex((history) => history.keyword === payload.nickname);

    if (targetIndex >= 0) {
      newHistories.splice(targetIndex, 1);
    }

    newHistories.unshift({ keyword: payload.nickname, date: new Date() });

    if (newHistories.length > 10) {
      newHistories.pop();
    }

    yield put(setHistories(newHistories));
  } catch (error: any) {
    if (typeof error === "string") {
      yield put(enqueueSnackbar({ message: error, options: { variant: "error" } }));
    }
    yield put(enqueueSnackbar({ message: error.message, options: { variant: "error" } }));
    yield put(responseError());
  }
}

export function* FindUserRequestWatcher() {
  yield takeLatest(FIND_USER_REQUEST, findUserRequest);
}
export default function* UserSaga() {
  yield all([fork(FindUserRequestWatcher)]);
}
