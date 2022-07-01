import { all, fork } from "@redux-saga/core/effects";
import UserSaga from "./user";

function* rootSaga() {
  yield all([fork(UserSaga)]);
}

export default rootSaga;
