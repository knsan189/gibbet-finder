import { GibbetState } from "./gitbbet.interface";
import { UserState } from "./user.interface";

export interface RootStateInterface {
  user: UserState;
  gibbets: GibbetState;
}
