import { GibbetState } from "./gitbbet.interface";
import { SnackbarState } from "./snackbar.interface";
import { UserState } from "./user.interface";

export interface RootStateInterface {
  user: UserState;
  gibbets: GibbetState;
  snackbar: SnackbarState;
}
