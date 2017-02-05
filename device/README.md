# IoT Demo
A NodeJS project for Azure IoT Hub demo. 

## Device
To run the simulated device, populate the device keys in [device/config.js](./device/device/config.js) and run `npm start`

# Device Twin
The device's behaviour is controlled via [Device Twin](https://docs.microsoft.com/en-us/azure/iot-hub/iot-hub-devguide-device-twins) properties as stored in the Iot Hub device registry. 

The twin properties for this demo are:
```javascript
{
  "interval": 2000,
  "transmit": true,
  "flash": true,
}
```
| Property | Description | Type |
| --- | --- | --- |
| interval | The frequency in milliseconds which to transmit data to the IoT Hub. The valid range is 2000 &gt; interval &lt; 60000. Requests to go outside that inverval will be ignored. | integer |
| transmit | If device should transmit data. | boolean |
| flash | If the device should flash the LED when transmitting data. | boolean |
