import { ConfigState } from "./config.interface";
import { GibbetState } from "./gitbbet.interface";
import { SnackbarState } from "./snackbar.interface";
import { UserState } from "./user.interface";

export interface RootStateInterface {
  config: ConfigState;
  user: UserState;
  gibbets: GibbetState;
  snackbar: SnackbarState;
}
