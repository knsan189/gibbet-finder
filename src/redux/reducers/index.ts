import { AnyAction, combineReducers, Reducer } from "redux";
import { RootStateInterface } from "../../@types/redux/rootState";
import UserReducer from "./user";

const rootReducer: Reducer<RootStateInterface, AnyAction> = combineReducers<RootStateInterface>({
  user: UserReducer,
});

export default rootReducer;
export type RootState = ReturnType<typeof rootReducer>;
