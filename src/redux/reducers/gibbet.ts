import {
  GetGibbetList,
  Gibbet,
  GibbetAction,
  GibbetActionTypes,
  GibbetState,
  SetGibbetList,
} from "../../@types/redux/gitbbet.interface";

const { GET_GIBBET_LIST, SET_GIBBET_LIST } = GibbetActionTypes;

export const getGibbetList = (): GetGibbetList => ({
  payload: {},
  type: GET_GIBBET_LIST,
});

export const setGibbetList = (gibbets: Gibbet[]): SetGibbetList => ({
  payload: { gibbets },
  type: SET_GIBBET_LIST,
});

const initialState: GibbetState = {
  gibbets: [],
  status: "ok",
};

const GibbetReducer = (state = initialState, action: GibbetAction): GibbetState => {
  switch (action.type) {
    case GET_GIBBET_LIST:
      return {
        ...state,
        status: "loading",
      };
    case SET_GIBBET_LIST:
      return {
        gibbets: action.payload.gibbets,
        status: "ok",
      };
    default:
      return state;
  }
};

export default GibbetReducer;
