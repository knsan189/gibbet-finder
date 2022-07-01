import { ConfigAction, ConfigState } from "../../@types/redux/config.interface";

const initialState: ConfigState = {
  status: "ok",
};

const ConfigReducer = (state = initialState, action: ConfigAction): ConfigState => {
  switch (action.type) {
    default:
      return state;
  }
};

export default ConfigReducer;
