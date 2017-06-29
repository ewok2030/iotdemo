import DummyDevice from './rpi/DummyDevice';
import deviceConfig from './config/config';
import defaultTwin from './config/twin';

/* eslint-disable no-console */
console.log(deviceConfig);

const device = new DummyDevice(deviceConfig, defaultTwin);

device.initialize();
