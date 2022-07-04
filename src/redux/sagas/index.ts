import { all, fork } from "@redux-saga/core/effects";
import GibbetSaga from "./gibbet";
import UserSaga from "./user";

function* rootSaga() {
  yield all([fork(UserSaga), fork(GibbetSaga)]);
}

export default rootSaga;
