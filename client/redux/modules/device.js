import axios from 'axios';

// Action types
const NEW_MESSAGE = 'server/NEW_MESSAGE';
const CLEAR_MESSAGES = 'client/CLEAR_MESSAGES';
const CONNECTION_OPEN = 'server/CONNECTION_OPEN';
const CONNECTION_CLOSED = 'server/CONNECTION_CLOSED';
const GET_TWIN_SUCCESS = 'client/GET_TWIN_SUCCESS';
const GET_TWIN_ERROR = 'client/GET_TWIN_ERROR';
const UPDATE_TWIN_SUCCESS = 'client/UPDATE_TWIN_SUCCESS';
const UPDATE_TWIN_ERROR = 'client/UPDATE_TWIN_ERROR';

// Initial state
const initialState = {
  deviceId: null,
  twin: null,
  isConnected: false,
  messages: [],
};

// Reducer
export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case CONNECTION_OPEN:
      return {
        ...state,
        isConnected: true,
      };
    case CONNECTION_CLOSED:
      return {
        ...state,
        isConnected: true,
      };
    case GET_TWIN_SUCCESS:
      return {
        ...state,
        deviceId: action.data.deviceId,
        twin: { ...action.data.twin },
      };
    case GET_TWIN_ERROR:
      return {
        ...state,
        twin: null,
      };
    case UPDATE_TWIN_SUCCESS:
      return {
        ...state,
        twin: { ...action.data.twin },
      };
    case UPDATE_TWIN_ERROR:
      return {
        ...state,
        twin: null,
      };
    case NEW_MESSAGE: {
      return {
        ...state,
        messages: [...state.messages, action.data.message],
      };
    }
    case CLEAR_MESSAGES:
      return {
        ...state,
        messages: [],
      };
    default:
      return state;
  }
}

// Actions
export const getTwin = deviceId => (dispatch) => {
  axios.get(`/api/device/${deviceId}/twin`).then((response) => {
    dispatch({ type: GET_TWIN_SUCCESS, data: { deviceId, twin: response.data } });
  }).catch((response) => {
    dispatch({ type: GET_TWIN_ERROR, error: response.data });
  });
};

export const updateTwin = (deviceId, patch) => (dispatch) => {
  axios.post(`/api/device/${deviceId}/twin`, patch).then((response) => {
    dispatch({ type: UPDATE_TWIN_SUCCESS, data: { deviceId, twin: response.data } });
  }).catch((response) => {
    dispatch({ type: UPDATE_TWIN_ERROR, error: response.data });
  });
};

export const clearMessages = () => (dispatch) => {
  dispatch({ type: CLEAR_MESSAGES });
};
