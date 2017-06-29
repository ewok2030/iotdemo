# IoT Demo
A NodeJS project for Azure IoT Hub demo. 

## Device
To run the simulated device, populate the device keys in [config/config.js](./device/config/config.js) and run `npm start`

# Device Twin
The device's behaviour is controlled via [Device Twin](https://docs.microsoft.com/en-us/azure/iot-hub/iot-hub-devguide-device-twins) properties as stored in the Iot Hub device registry. 

The twin properties for this demo are:
```javascript
{
  "message": {
    "interval": 2000,
    "transmit": true,
    "flash": true
  }
}
```
| Property | Description | Type |
| --- | --- | --- |
| message.interval | The frequency in milliseconds which to transmit data to the IoT Hub. The valid range is 2000 &gt; interval &lt; 3600000. Requests to go outside that inverval will be ignored. | integer |
| message.transmit | If device should transmit streaming message data. | boolean |
| message.flash | If the device should flash the LED when transmitting streaming message data. | boolean |
