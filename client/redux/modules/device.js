import axios from 'axios';

// Action types
const NEW_MESSAGE = 'client/NEW_MESSAGE';
const INIT_MESSAGES_ERROR = 'client/INIT_MESSAGES_ERROR';
const INIT_MESSAGES_SUCCESS = 'client/INIT_MESSAGES_SUCCESS';
const CLEAR_MESSAGES = 'client/CLEAR_MESSAGES';
const OPEN_CONNECTION = 'server/OPEN_CONNECTION';
const CLOSE_CONNECTION = 'server/CLOSE_CONNECTION';
const CONNECTION_OPEN = 'client/CONNECTION_OPEN';
const CONNECTION_CLOSED = 'client/CONNECTION_CLOSED';
const GET_DEVICES_SUCCESS = 'client/GET_DEVICES_SUCCESS';
const GET_DEVICES_ERROR = 'client/GET_DEVICES_ERROR';
const GET_DEVICE_SUCCESS = 'client/GET_DEVICE_SUCCESS';
const GET_DEVICE_ERROR = 'client/GET_DEVICE_ERROR';
const GET_TWIN_SUCCESS = 'client/GET_TWIN_SUCCESS';
const GET_TWIN_ERROR = 'client/GET_TWIN_ERROR';
const UPDATE_TWIN_SUCCESS = 'client/UPDATE_TWIN_SUCCESS';
const UPDATE_TWIN_ERROR = 'client/UPDATE_TWIN_ERROR';

// Initial state
const initialState = {
  active: null,
  twin: null,
  isConnected: false,
  messages: [],
  devices: [],
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
        isConnected: false,
      };
    case GET_DEVICES_SUCCESS:
      return {
        ...state,
        devices: action.data,
      };
    case GET_DEVICES_ERROR:
      return {
        ...state,
        devices: [],
      };
    case GET_DEVICE_SUCCESS:
      return {
        ...state,
        active: action.data,
      };
    case GET_DEVICE_ERROR:
      return {
        ...state,
        active: null,
      };
    case GET_TWIN_SUCCESS:
      return {
        ...state,
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
    case INIT_MESSAGES_SUCCESS:
      return {
        ...state,
        messages: action.data.messages.map(x => ({ sourceTimestamp: x.sourcetimestamp, temperature: x.temperature, humidity: x.humidity })),
      };
    case NEW_MESSAGE:
      return {
        ...state,
        messages: [...state.messages, action.data.message],
      };
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
export const getDevices = () => (dispatch) => {
  axios.get('/api/device').then((response) => {
    dispatch({ type: GET_DEVICES_SUCCESS, data: response.data });
  }).catch((response) => {
    dispatch({ type: GET_DEVICES_ERROR, error: response.data });
  });
};

export const getDevice = deviceId => (dispatch) => {
  axios.get(`/api/device/${deviceId}`).then((response) => {
    dispatch({ type: GET_DEVICE_SUCCESS, data: response.data });
  }).catch((response) => {
    dispatch({ type: GET_DEVICE_ERROR, error: response.data });
  });
};

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

export const openConnection = () => (dispatch) => {
  dispatch({ type: OPEN_CONNECTION });
}; // openConnection

export const closeConnection = () => (dispatch) => {
  dispatch({ type: CLOSE_CONNECTION });
}; // closeConnection

export const initMessages = (deviceId, hours) => (dispatch) => {
  axios.post(`/api/device/${deviceId}/messages/history?hours=${hours}`).then((response) => {
    dispatch({ type: INIT_MESSAGES_SUCCESS, data: { deviceId, messages: response.data } });
  }).catch((response) => {
    dispatch({ type: INIT_MESSAGES_ERROR, error: response.data });
  });
}; // initMessages

export const clearMessages = () => (dispatch) => {
  dispatch({ type: CLEAR_MESSAGES });
};
