import { clientFromConnectionString } from 'azure-iot-device-mqtt';
import { Message } from 'azure-iot-device';
import { Gpio } from 'onoff';


/* eslint-disable no-console */
export default class Device {

  constructor(hub, id, key, pin, defaultProps) {
    this.hub = hub;
    this.id = id;
    this.key = key;
    this.pin = pin;
    this.properties = { ...defaultProps };

    // Connection String
    const connectionString = `HostName=${this.hub};DeviceId=${this.id};SharedAccessKey=${this.key};`;
    this._client = clientFromConnectionString(connectionString);
    // this._interval = setInterval(this.sendMessage, this.properties.interval);

    this._led = Gpio(this.pin, 'out');

    this._client.on('disconnect', () => {
      clearInterval(this._interval);
      this._client.removeAllListeners();
    });
  }

  connect() {
    this._client.open((err) => {
      if (err) {
        console.error(`could not connect to IoT Hub: ${err}`);
      } else {
        console.log(`device connected to hub: ${this.hub}`);

        this._client.getTwin((err2, twin) => {
          if (err2) {
            console.error('could not get twin');
          } else {
            // Create listener for interval property
            twin.on('properties.desired.interval', (interval) => {
              // Validate the properties!
              if (interval < 1000 || interval > 60000) {
                console.error(`desired transmission interval of ${interval} is not valid (1000 <= x <= 60000). Ignoring.`);
                return;
              }
              console.log(`transmission interval has been updated to ${interval}`);
              this.properties.interval = interval;
              this.resetInterval();

              // Report back to the IoT Hub the state of properties
              twin.properties.reported.update({ interval: this.properties.interval }, (err3) => {
                if (err3) console.log(`error reporting updated twin: ${err3}`);
              });
            });

            // Create listner for transmit property
            twin.on('properties.desired.transmit', (transmit) => {
              console.log(`transmission state has been updated to ${transmit}`);

              // If not already in desired state, do something
              if (this.properties.transmit !== transmit) {
                this.properties.transmit = transmit;
                this.resetInterval();
              }

              // Report back to the IoT Hub the state of properties
              twin.properties.reported.update({ transmit: this.properties.transmit }, (err3) => {
                if (err3) console.log(`error reporting updated twin: ${err3}`);
              });
            });

            // Create listner for flash property
            twin.on('properties.desired.flash', (flash) => {
              console.log(`flash has been updated to ${flash}`);
              this.properties.flash = flash;
              // Report back to the IoT Hub the state of properties
              twin.properties.reported.update({ flash: this.properties.flash }, (err3) => {
                if (err3) console.log(`error reporting updated twin: ${err3}`);
              });
            });
          }
        });
      }
    });
  }

  disconnect() {
    this._client.close((err) => {
      console.error(`could not disconnect: ${err}`);
    });
  }

  resetInterval() {
    clearInterval(this._interval);
    if (this.properties.transmit) {
      this._interval = setInterval(this.sendMessage, this.properties.interval);
    }
  }

  flashLed() {
    this._led.write(1);
    setTimeout(() => {
      this._led.write(0);
    }, 500);
  }

  sendMessage = () => {
    const data = {
      telemetry: {
        timestamp: new Date(),
        temperature: 70 + (Math.random() * 10),
        humidity: 40 + (Math.random() * 5),
      },
      status: {
        flash: this.properties.flash,
      },
    };

    const message = new Message(JSON.stringify(data));
    console.log(message.getData());

    // Turn on LED for 1/2 second?
    this._client.sendEvent(message, (e, result) => {
      if (e) console.log(`send error: ${e.toString()}`);
      if (result) {
        if (this.properties.flash) this.flashLed();
        console.log(`send status: ${result.constructor.name}`);
      }
    });
  }
}
