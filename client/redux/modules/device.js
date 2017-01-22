import axios from 'axios';

// Action types
const GET_DEVICE = 'redux-starter/device/GET_DEVICE';
const GET_DEVICE_ERROR = 'redux-starter/device/GET_DEVICE_ERROR';

// Initial state
const initialState = {
  active: null,
  data: [],
};

// Reducer
export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case GET_DEVICE:
      return {
        ...state,
        active: action.data,
      };
    case GET_DEVICE_ERROR:
      return {
        ...state,
        active: null,
        error: action.error,
      };
    default:
      return state;
  }
}

// Action Creators
export const getDevice = id => (dispatch) => {
  axios.get(`/api/device/${id}`).then((response) => {
    dispatch({ type: GET_DEVICE, data: response.data });
  }).catch((response) => {
    dispatch({ type: GET_DEVICE_ERROR, error: response.data });
  });
};
