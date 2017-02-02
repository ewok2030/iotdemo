import { Registry } from 'azure-iothub';

// Action types
const CONNECT_DEVICE = 'iotdemo/device/CONNET_DEVICE';
const CONNECT_DEVICE_ERROR = 'iotdemo/device/CONNECT_DEVICE_ERROR';
const UPDATE_TWIN = 'iotdemo/device/UPDATE_TWIN';
const UPDATE_TWIN_ERROR = 'iotdemo/device/UPDATE_TWIN_ERROR';


// Initial state
const initialState = {
  data: [],
  twin: null,
  isConnected: null,
};

// Reducer
export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case CONNECT_DEVICE:
      return {
        ...state,
        data: action.data.device,
        twin: action.data.twin,
        isConnected: true,
      };
    case CONNECT_DEVICE_ERROR:
      return {
        ...state,
        isConnected: false,
      };
    case UPDATE_TWIN:
      return {
        ...state,
        twin: { ...state.twin, ...action.data },
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

export const connectDevice = (hub, device) => (dispatch) => {
  const connectionString = `HostName=${hub.host};SharedAccessKeyName=${hub.keyName};SharedAccessKey=${hub.key}`;
  const registry = Registry.fromConnectionString(connectionString);
  registry.getTwin(device.id, (err, twin) => {
    if (err) {
      console.error(`error getting twin for: ${connectionString}`);
    } else {
      dispatch({ type: CONNECT_DEVICE, data: { device, twin: twin.properties } });
      // Create a listener, that will trigger the UPDATE_TWIN action
      twin.on('properties.reported', (patch) => {
        dispatch({ type: UPDATE_TWIN, data: patch });
      });
    }
  });
};


export const updateTwin = (hub, device, patch) => (dispatch) => {
  const connectionString = `HostName=${hub.host};SharedAccessKeyName=${hub.keyName};SharedAccessKey=${hub.key}`;
  const registry = Registry.fromConnectionString(connectionString);
  registry.getTwin(device.id, (err, twin) => {
    if (err) {
      console.error(`error getting twin for: ${connectionString}`);
      dispatch({ type: UPDATE_TWIN_ERROR, error: err });
    } else {
      twin.update(patch, (err2, twin2) => {
        if (err) {
          console.error(`error getting twin for: ${connectionString}`);
          dispatch({ type: UPDATE_TWIN_ERROR, error: err2 });
        } else {
          dispatch({ type: UPDATE_TWIN, data: twin2.properties });
        }
      });
    }
  });
};
