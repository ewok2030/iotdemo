# IoT Demo
A NodeJS project for Azure IoT Hub demo. 

* Server - **WORK IN PROGRESS**
  * A server side NodeJS app using Mongo and Express, transpiled via Babel
* Client - **WORK IN PROGRESS**
  * A client web React/Redux app with hot reload via Webpack and Babel
* Device
  * A simulated IoT device which uses the [Azure IoT SDK for NodeJS](https://github.com/azure/azure-iot-sdk-node) 

## Device Twin
The following [device twin](https://docs.microsoft.com/en-us/azure/iot-hub/iot-hub-devguide-device-twins) properties can be used to control the device behavior.

```JavaScript
{
  "message": {
    "transmit": true, \\ should transmit to reading to IoT Hub?
    "interval": 60000, \\ how often to read temp [ms]
    "flash": true \\ flash the led when reading sensor?
  },
  "fileupload" : {
    "transmit": true, \\ should transmit files?
    "counter": 60 \\ how many readings to make before uploading file
  }
}

```

