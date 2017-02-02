import { clientFromConnectionString } from 'azure-iot-device-mqtt';
import { Message } from 'azure-iot-device';


/* eslint-disable no-console */
export default class Device {

  constructor(hub, id, key, defaultProps) {
    this.hub = hub;
    this.id = id;
    this.key = key;
    this.properties = { ...defaultProps };

    // Connection String
    const connectionString = `HostName=${this.hub};DeviceId=${this.id};SharedAccessKey=${this.key};`;
    this._client = clientFromConnectionString(connectionString);
    // this._interval = setInterval(this.sendMessage, this.properties.interval);

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
            // Create listner for interval property
            twin.on('properties.desired.interval', (newInterval) => {
              // Check if this is interval
              if (newInterval > 500 && newInterval < 20000) {
                this.properties = { ...this.properties, interval: newInterval };
                clearInterval(this._interval);
                this._interval = setInterval(this.sendMessage, this.properties.interval);

                twin.properties.reported.update({ interval: this.properties.interval }, (err3) => {
                  if (err3) {
                    console.log(`error reporting updated twin: ${err3}`);
                  } else {
                    console.log(`interval updated to ${this.properties.interval}`);
                  }
                });
              } else {
                console.log(`interval request of ${newInterval} is invalid...ignoring`);
              }
            });

            // Create listner for mode property
            twin.on('properties.desired.mode', (newMode) => {
              if (newMode === 'active' || newMode === 'inactive' || newMode === 'sleeping') {
                this.properties = { ...this.properties, mode: newMode };

                twin.properties.reported.update({ mode: this.properties.mode }, (err3) => {
                  if (err3) {
                    console.log(`error reporting updated twin: ${err3}`);
                  } else {
                    console.log(`mode updated to ${this.properties.mode}`);
                  }
                });
              } else {
                console.log(`mode request of '${newMode}' is invalid...ignoring`);
              }
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

  sendMessage = () => {
    const data = {
      recordTimestamp: new Date(),
      weather: {
        windSpeed: 4 + (Math.random() * 6),
        temperature: 70 + (Math.random() * 10),
        pressure: 14 + (Math.random() * 0.5),
      },
      status: {
        mode: this.properties.mode,
        speed: 4 + (Math.random() * 6),
      },
    };

    const message = new Message(JSON.stringify(data));
    console.log(message.getData());
    this._client.sendEvent(message, (e, result) => {
      if (e) console.log(`send error: ${e.toString()}`);
      if (result) console.log(`send status: ${result.constructor.name}`);
    });
  }
}
