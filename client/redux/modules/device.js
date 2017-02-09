import { axios } from 'axios';

// Action types
const GET_TWIN_SUCCESS = 'iotdemo/device/GET_TWIN_SUCCESS';
const GET_TWIN_ERROR = 'iotdemo/device/GET_TWIN_ERROR';

const UPDATE_TWIN_SUCCESS = 'iotdemo/device/UPDATE_TWIN_SUCCESS';
const UPDATE_TWIN_ERROR = 'iotdemo/device/UPDATE_TWIN_ERROR';


// Initial state
const initialState = {
  deviceId: null,
  twin: null,
  isConnected: false,
};

// Reducer
export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
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
    default:
      return state;
  }
}

export const getTwin = deviceId => (dispatch) => {
  axios.get(`/api/device/${deviceId}/twin`).then((response) => {
    dispatch({ type: GET_TWIN_SUCCESS, data: response.data });
  }).catch((response) => {
    dispatch({ type: GET_TWIN_ERROR, error: response.data });
  });
};

export const updateTwin = (deviceId, patch) => (dispatch) => {
  axios.post(`/api/device/${deviceId}/twin`, patch).then((response) => {
    dispatch({ type: UPDATE_TWIN_SUCCESS, data: response.data });
  }).catch((response) => {
    dispatch({ type: UPDATE_TWIN_ERROR, error: response.data });
  });
};
