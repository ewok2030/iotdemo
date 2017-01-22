import { clientFromConnectionString } from 'azure-iot-device-mqtt';
import { Message } from 'azure-iot-device';

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
            twin.on('properties.desired', (delta) => {
              if (delta.interval > 500 && delta.interval < 20000) {
                this.properties = { ...this.properties, ...delta };
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
                console.log(`interval request of ${delta.interval} is invalid...ignoring`);
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
    const data = { deviceId: this.id, windSpeed: 10 + (Math.random() * 4) };
    const message = new Message(JSON.stringify(data));
    console.log(message.getData());
    this._client.sendEvent(message, (e, result) => {
      if (e) console.log(`send error: ${e.toString()}`);
      if (result) console.log(`send status: ${result.constructor.name}`);
    });
  }
}
