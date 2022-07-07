import { responseError } from "./../reducers/user";
import { all, call, fork, put, takeLatest } from "@redux-saga/core/effects";
import { FindUserRequest, UserActionTypes } from "../../@types/redux/user.interface";
import { User } from "../../@types/type";
import UserService from "../../service/UserService";
import { enqueueSnackbar } from "../reducers/snackbar";
import { setUser } from "../reducers/user";

const { FIND_USER_REQUEST } = UserActionTypes;

function* findUserRequest({ payload }: FindUserRequest) {
  try {
    const user: User = yield call(UserService.getChar, payload.nickname);
    yield put(setUser(user));
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
