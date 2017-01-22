import Device from './device';

import { hub, device as deviceConfig } from './config';

console.log(hub);
console.log(deviceConfig);

const device = new Device(hub.host, deviceConfig.id, deviceConfig.key, { interval: 1000 });

device.connect();
