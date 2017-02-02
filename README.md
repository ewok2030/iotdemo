# IoT Demo
A NodeJS project for Azure IoT Hub demo. 

* Server - **WORK IN PROGRESS**
  * A server side NodeJS app using Mongo and Express, transpiled via Babel
* Client - **WORK IN PROGRESS**
  * A client web React/Redux app with hot reload via Webpack and Babel
* Device
  * A simulated IoT device which uses the [Azure IoT SDK for NodeJS](https://github.com/azure/azure-iot-sdk-node) 

## Device
To run the simulated device, populate the device keys in [device/config.js](./device/config.js) and run `npm run device`
