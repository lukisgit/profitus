import {ACTIONS} from "../store";
import {Dispatch} from "redux";

export async function getContent (dispatch: Dispatch, url: string) {
  dispatch({ type: ACTIONS.GET_DATA_STARTED, payload: {} });
  try {
    const response = await fetch(url);
    const result = await response.json();
    dispatch({ type: ACTIONS.GET_DATA_SUCCESS, payload: { data: result } });
  } catch (err) {
    dispatch({ type: ACTIONS.GET_DATA_ERROR, payload: {} });
  }
}