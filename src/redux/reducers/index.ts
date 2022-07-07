import { AnyAction, combineReducers, Reducer } from "redux";
import { RootStateInterface } from "../../@types/redux/rootState";
import GibbetReducer from "./gibbet";
import SnackbarReducer from "./snackbar";
import UserReducer from "./user";

const rootReducer: Reducer<RootStateInterface, AnyAction> = combineReducers<RootStateInterface>({
  user: UserReducer,
  gibbets: GibbetReducer,
  snackbar: SnackbarReducer,
});

export default rootReducer;
export type RootState = ReturnType<typeof rootReducer>;
