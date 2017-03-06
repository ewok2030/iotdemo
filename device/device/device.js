import { clientFromConnectionString } from 'azure-iot-device-mqtt';
import { Message } from 'azure-iot-device';
import { Gpio } from 'onoff';
import sensor from 'node-dht-sensor';

/* eslint-disable no-console */
export default class Device {

  constructor(conStr) {
    // Create a client
    this._client = clientFromConnectionString(conStr);

    // Some local properties, not to be configured via Twin
    this._local = {
      flashLength: 100,
      sensorType: 22,
      minInterval: 1000,
      maxInterval: 60000,
    };
  }

  initialize() {
    this._client.getTwin((err, twin) => {
      if (err) {
        console.error(`could not get twin: ${err}`);
        return;
      }

      this._twin = twin;
      // Initialize
      this.properties = {
        interval: twin.properties.desired.interval,
        transmit: twin.properties.desired.transmit,
        flash: twin.properties.desired.flash,
        gpio: { led: twin.properties.desired.gpio.led, sensor: twin.properties.desired.gpio.sensor },
      };
      console.log(`device properties initialized: ${JSON.stringify(this.properties)}`);
      this._twin.properties.reported.update(this.properties, (err2) => {
        if (err2) console.log(`error reporting updated twin: ${err2}`);
      });

      // Create listener for properties
      this._twin.on('properties.desired.interval', this.handleIntervalUpdate);
      this._twin.on('properties.desired.transmit', this.handleTransmitUpdate);
      this._twin.on('properties.desired.flash', this.handleFlashUpdate);
      this._twin.on('properties.desired.gpio.led', this.handleLedUpdate);
      this._twin.on('properties.desired.gpio.sensor', this.handleSensorUpdate);

      // Initialize the device
      this.initializeLed();
      this.initializeInterval();
    });
  }

  initializeLed() {
    if (this._led) this._led.unexport();
    this._led = Gpio(this.properties.gpio.led, 'out');
  }

  initializeInterval() {
    if (this._interval) clearInterval(this._interval);
    this._interval = setInterval(this.sendMessage, this.properties.interval);
  }

  handleIntervalUpdate = (interval) => {
    // Validate the properties!
    if (interval < this._local.minInterval || interval > this._local.maxInterval) {
      console.error(`desired transmission interval of ${interval} [ms] is not valid (${this._local.minInterval} <= x <= ${this._local.maxInterval}). Ignoring.`);
      return;
    }
    console.log(`transmission interval has been updated to ${interval}`);
    this.properties.interval = interval;
    this.initializeInterval();
    this._twin.properties.reported.update({ interval: this.properties.interval }, (err) => {
      if (err) console.log(`error reporting updated twin: ${err}`);
    });
  }

  handleTransmitUpdate = (transmit) => {
    console.log(`transmission state has been updated to ${transmit}`);
    // If not already in desired state, do something
    if (this.properties.transmit !== transmit) {
      this.properties.transmit = transmit;
      this.initializeInterval();
    }
    this._twin.properties.reported.update({ transmit: this.properties.transmit }, (err) => {
      if (err) console.log(`error reporting updated twin: ${err}`);
    });
  }

  handleFlashUpdate = (flash) => {
    console.log(`flash has been updated to ${flash}`);
    this.properties.flash = flash;
    this._twin.properties.reported.update({ flash: this.properties.flash }, (err) => {
      if (err) console.log(`error reporting updated twin: ${err}`);
    });
  }

  handleLedUpdate = (led) => {
    console.log(`gpio LED pin has been updated to ${JSON.stringify(led)}`);
    // Reinitialize LED if necessary
    if (this.properties.gpio.led !== led) {
      this.properties.gpio.led = led;
      this.initializeLed();
    }
    this._twin.properties.reported.update({ gpio: { led: this.properties.gpio.led } }, (err) => {
      if (err) console.log(`error reporting updated twin: ${err}`);
    });
  }

  handleSensorUpdate = (pin) => {
    console.log(`gpio sensor pin has been updated to ${JSON.stringify(pin)}`);
    this.properties.gpio.sensor = pin;
    this._twin.properties.reported.update({ gpio: { sensor: this.properties.gpio.sensor } }, (err) => {
      if (err) console.log(`error reporting updated twin: ${err}`);
    });
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
    sensor.read(this._local.sensorType, this.properties.gpio.sensor, (err, temp, hum) => {
      if (err) {
        console.error(`error reading sensor: ${err}`);
        return;
      }
      // Create payload for the message
      const data = {
        telemetry: {
          timestamp: new Date(),
          temperature: temp,
          humidity: hum,
        },
        status: {
          flash: this.properties.flash,
        },
      };
      const message = new Message(JSON.stringify(data));
      console.log(message.getData());

      if (this.properties.flash) this.flashLed(this._local.flashLength);

      if (this.properties.transmit) {
        this._client.sendEvent(message, (e, result) => {
          if (e) console.log(`send error: ${e.toString()}`);
          if (result) {
            console.log(`>>>>> Message status: ${result.constructor.name}`);
          }
        });
      }
    });
  }
}
