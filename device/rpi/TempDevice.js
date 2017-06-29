import { Message } from 'azure-iot-device';
import { Gpio } from 'onoff';
import sensor from 'node-dht-sensor';
import uuidv1 from 'uuid/v1';

export default class TempDevice extends DummyDevice {
  constructor(config, twin) {
    super(config, twin);
    this._led = Gpio(this.config.led.gpio, 'out');
  }

  flashLed(len) {
    // Turn on voltage to the pin
    this._led.write(1);
    setTimeout(() => {
      // Turn off the voltage to the pin
      this._led.write(0);
    }, len);
  }

  sendMessage = () => {
    sensor.read(this.config.sensor.type, this.config.sensor.gpio, (err, temp, hum) => {
      if (err) {
        console.error(`error reading sensor: ${err}`);
        return;
      }
      // Create payload for the message
      const data = {
        sourceTimestamp: new Date(),
        temperature: temp,
        humidity: hum,
        status: {
          flash: this.properties.message.flash,
        },
      };
      const message = new Message(JSON.stringify(data));
      message.messageId = uuidv1();

      // flash the LED
      if (this.properties.message.flash) this.flashLed(this.config.led.flashLength);
      // send the data message
      if (this.properties.message.transmit) super.sendEvent(message);
    });
  }

}