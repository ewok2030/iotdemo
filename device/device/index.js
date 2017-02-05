import Device from './device';
import { device as deviceConfig } from './config';

/* eslint-disable no-console */
console.log(deviceConfig);

const device = new Device(deviceConfig.connectionString, deviceConfig.ledPin, deviceConfig.defaultProperties);

device.connect();
