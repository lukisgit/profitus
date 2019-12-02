import {applyMiddleware, createStore} from "redux";
import thunk from "redux-thunk";
import logger from "redux-logger";

export interface IStore {
  data: any[];
  fetching: boolean;
  error: boolean;
  filterColumnIndex: number;
  filterColumnType: 'asc' | 'desc';
}

interface IStorePayload {
  data: any[];
  index: number;
}

const initialState: IStore = {
  data: [],
  fetching: false,
  error: false,
  filterColumnIndex: 0,
  filterColumnType: 'asc'
};

export enum ACTIONS {
  GET_DATA_STARTED = 'GET_DATA_STARTED',
  GET_DATA_SUCCESS = 'GET_DATA_SUCCESS',
  GET_DATA_ERROR = 'GET_DATA_ERROR',
  FILTER_DATA = 'FILTER_DATA'
}

function rootReducer (state = initialState, action: {type: ACTIONS, payload: Partial<IStorePayload> }): IStore {
  switch(action.type){
    case ACTIONS.GET_DATA_STARTED : {
      if(state.fetching){
        return state;
      }
      return { ...state, fetching: true };
    }
    case ACTIONS.GET_DATA_SUCCESS : {
      return { ...state, data: !!action.payload.data ? action.payload.data : state.data, error: false, fetching: false };
    }
    case ACTIONS.GET_DATA_ERROR: {
      return { ...state, error: false };
    }
    case ACTIONS.FILTER_DATA: {
      const filterType = state.filterColumnType === 'asc' ? 'desc' : 'asc';
      return { ...state, filterColumnIndex: action.payload.index != null ? action.payload.index : state.filterColumnIndex, filterColumnType: filterType };
    }
    default: {
      return state;
    }
  }
}

const store = createStore(rootReducer, {}, applyMiddleware(logger, thunk));

export default store;