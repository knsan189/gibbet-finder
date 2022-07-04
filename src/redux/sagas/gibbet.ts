import { all, call, fork, put, takeLatest } from "@redux-saga/core/effects";
import { GetGibbetList, Gibbet, GibbetActionTypes } from "../../@types/redux/gitbbet.interface";
import UserService from "../../service/UserService";
import { setGibbetList } from "../reducers/gibbet";

const { GET_GIBBET_LIST } = GibbetActionTypes;

function* getGibbetList() {
  try {
    const gibbets: Gibbet[] = yield call(UserService.getGibbets);
    yield put(setGibbetList(gibbets));
  } catch (error) {
    yield;
  }
}

export function* getGibbetListWatcher() {
  yield takeLatest(GET_GIBBET_LIST, getGibbetList);
}
export default function* GibbetSaga() {
  yield all([fork(getGibbetListWatcher)]);
}
