import {
  ConfigAction,
  ConfigActionTypes,
  ConfigState,
  ToggleDarkMode,
} from "../../@types/redux/config.interface";

const { TOGGLE_DARK_MODE } = ConfigActionTypes;

export const toggleDarkMode = (checked: boolean): ToggleDarkMode => ({
  type: TOGGLE_DARK_MODE,
  payload: { checked },
});

const initialState: ConfigState = {
  status: "ok",
  theme: "light",
};

const ConfigReducer = (state = initialState, action: ConfigAction): ConfigState => {
  switch (action.type) {
    case TOGGLE_DARK_MODE:
      return { ...state, theme: action.payload.checked ? "dark" : "light" };
    default:
      return state;
  }
};

export default ConfigReducer;
