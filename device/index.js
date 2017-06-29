import DummyDevice from './rpi/DummyDevice';
import Device from './rpi/Device';
import deviceConfig from './config/config';
import defaultTwin from './config/twin';

/* eslint-disable no-console */
console.log(deviceConfig);

const device = (deviceConfig.dummy) ? new DummyDevice(deviceConfig, defaultTwin) : new Device(deviceConfig, defaultTwin);
device.initialize();
