import Device from './device';
import deviceConfig from './config';

/* eslint-disable no-console */
console.log(deviceConfig);

const device = new Device(deviceConfig.connectionString);

device.connect();
