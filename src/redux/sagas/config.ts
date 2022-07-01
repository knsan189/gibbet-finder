// import { all, call, fork, put, select, takeLatest } from "@redux-saga/core/effects";
// import {
//   AddRaid,
//   PartyActionTypes,
//   PartyState,
//   RemoveRaid,
// } from "../../@types/redux/config.interface";
// import { Raid } from "../../@types/types";
// import RaidService from "../../service/RaidService";
// import { RootState } from "../reducers";
// import { setRaidList } from "../reducers/config";

import { all } from "@redux-saga/core/effects";

// const { ADD_RAID, REMOVE_RAID } = PartyActionTypes;

// function* addRaid({ payload }: AddRaid) {
//   try {
//     const { title } = payload;
//     const response: Raid = yield call(RaidService.addRaid, title);
//     const { raidList }: PartyState = yield select((state: RootState) => state.party);

//     if (!raidList) {
//       throw new Error("no raidlist");
//     }

//     yield put(setRaidList([...raidList, response]));
//   } catch (error) {
//     yield;
//   }
// }

// function* removeRaid({ payload }: RemoveRaid) {
//   try {
//     yield;
//   } catch (error) {
//     yield;
//   }
// }

// function* addRaidWatcher() {
//   yield takeLatest(ADD_RAID, addRaid);
// }

// function* removeRaidWatcher() {
//   yield takeLatest(REMOVE_RAID, removeRaid);
// }

export default function* ConfigSaga() {
  yield all([]);
}
