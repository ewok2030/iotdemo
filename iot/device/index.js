import Device from './device';
import { hub, device as deviceConfig } from './config';

/* eslint-disable no-console */
console.log(hub);
console.log(deviceConfig);

const device = new Device(hub.host, deviceConfig.id, deviceConfig.key, deviceConfig.pin, deviceConfig.defaultProperties);

device.connect();
