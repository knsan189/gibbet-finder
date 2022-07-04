export enum GibbetActionTypes {
  GET_GIBBET_LIST = "GET_GIBBET_LIST",
  SET_GIBBET_LIST = "SET_GIBBET_LIST",
}

export type GibbetAction = GetGibbetList | SetGibbetList;

export interface GibbetState {
  gibbets: Gibbet[];
  status: "ok" | "loading" | "error";
}

export interface GetGibbetList {
  payload: {};
  type: GibbetActionTypes.GET_GIBBET_LIST;
}

export interface SetGibbetList {
  payload: { gibbets: Gibbet[] };
  type: GibbetActionTypes.SET_GIBBET_LIST;
}

export type Gibbet = {
  serverName: string;
  islandName: string;
  reason: string;
  charList: string[];
};
