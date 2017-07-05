import { Gpio } from 'onoff';
import sensor from 'node-dht-sensor';
import DummyDevice from './DummyDevice';

/* eslint-disable no-console */
export default class Device extends DummyDevice {
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

  readData = () => {
    // flash the LED
    if (this.properties.message.flash) this.flashLed(this.config.led.flashLength);

    sensor.read(this.config.sensor.type, this.config.sensor.gpio, (err, temperature, humidity) => {
      if (err) throw err;

      // Create payload for the message
      this.sendMessage({
        sourceTimestamp: new Date(),
        temperature,
        humidity,
        status: {
          flash: this.properties.message.flash,
        },
      });
    });
  }

}
