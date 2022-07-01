import { AnyAction, combineReducers, Reducer } from "redux";
import { RootStateInterface } from "../../@types/redux/rootState";
import PartyReducer from "./config";

const rootReducer: Reducer<RootStateInterface, AnyAction> = combineReducers<RootStateInterface>({
  party: PartyReducer,
});

export default rootReducer;
export type RootState = ReturnType<typeof rootReducer>;
