import Device from './rpi/Device';
import deviceConfig from './config/config';
import defaultTwin from './config/twin';

/* eslint-disable no-console */
console.log(deviceConfig);

const device = new Device(deviceConfig, defaultTwin);
device.initialize();
