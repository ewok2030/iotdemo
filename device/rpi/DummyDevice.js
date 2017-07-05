import { clientFromConnectionString } from 'azure-iot-device-mqtt';
import { Message } from 'azure-iot-device';
import uuidv1 from 'uuid/v1';
import fs from 'fs';
import tmp from 'tmp';

/* eslint-disable no-console */
export default class DummyDevice {

  constructor(config, twin) {
    this._client = clientFromConnectionString(config.connectionString);
    this._buffer = [];
    this.config = config;
    this.properties = twin;
  }

  initialize() {
    this._client.getTwin((err, twin) => {
      if (err) {
        console.error(`could not get twin: ${err}`);
        return;
      }

      // Create listener for properties
      this._twin = twin;
      this._twin.on('properties.desired.message', this.handleMessageUpdate);
      this._twin.on('properties.desired.fileupload', this.handleUploadUpdate);
    });
  }

  start() {
    if (this._interval) clearInterval(this._interval);
    this._interval = setInterval(this.sendMessage, this.properties.message.interval);
  }

  handleMessageUpdate = (patch) => {
    const { interval } = patch;
    const change = { ...patch };
    // Validate the properties!
    if (interval && (interval < this.config.message.interval.min || interval > this.config.message.interval.max)) {
      console.error(`desired message transmission interval of ${interval} [ms] is not valid (${this.config.messsage.interval.min} <= x <= ${this.config.message.interval.max}). Ignoring.`);
      change.interval = this.properties.message.interval;
    }
    this.handleTwinUpdate({ message: change });
    this.start();
  }

  handleUploadUpdate = (patch) => {
    const { counter } = patch;
    const change = { ...patch };
    // Validate the properties!
    if (counter && (counter < this.config.fileupload.counter.min || counter > this.config.fileupload.counter.max)) {
      console.error(`desired file upload counter of ${counter} is not valid (${this.config.fileupload.counter.min} <= x <= ${this.config.fileupload.counter.max}). Ignoring.`);
      change.counter = this.properties.fileupload.counter;
    }
    this.handleTwinUpdate({ fileupload: change });
  }

  handleTwinUpdate = (patch) => {
    console.log(`desired properties update: ${JSON.stringify(patch)}`);
    this.properties = { ...this.properties, ...patch };
    this._twin.properties.reported.update(patch, (err) => {
      if (err) console.log(`error reporting updated twin: ${err}`);
    });
  }

  readData() {
    // Create dummy payload for the message
    return {
      sourceTimestamp: new Date(),
      temperature: -1 * Math.random(),
      humidity: -1 * Math.random(),
      status: {
        flash: this.properties.message.flash,
      },
    };
  }

  sendMessage = () => {
    // Create payload for the message
    const data = this.readData();
    const message = new Message(JSON.stringify(data));
    message.messageId = uuidv1();

    // log the message in a buffer
    this._buffer.push(data);

    // send the data message
    if (this.properties.message.transmit === true) {
      this._client.sendEvent(message, (e, result) => {
        if (e) console.error(`Send Message Error: ${e.toString()}`);
        if (result) {
          console.log(`Send Message >>> ${message.getData()}`);
        }
      });
    }

    // upload the file
    if (this._buffer.length >= this.properties.fileupload.counter || this._buffer.length >= this.config.fileupload.counter.max) {
      if (this.properties.fileupload.transmit === true) {
        const { _buffer } = this;
        this.uploadFile(_buffer);
      }
      this._buffer = [];
    }
  }

  uploadFile = (data) => {
    const dt = new Date();
    const year = dt.getUTCFullYear();
    const month = dt.getUTCMonth();
    const day = dt.getUTCDate();
    const now = dt.toISOString().replace(new RegExp(':', 'g'), '');
    const fname = `sensordata/${year}/${month}/${day}/${now}.json`;

    const temp = tmp.fileSync();
    fs.writeFileSync(temp.name, data.map(x => JSON.stringify(x)).join('\n'));
    fs.stat(temp.name, (err1, fstats) => {
      if (err1) throw err1;
      const filestream = fs.createReadStream(temp.name);
      this._client.uploadToBlob(fname, filestream, fstats.size, (err2) => {
        if (err2) throw err2;
        // dispose of the filestream
        filestream.destroy();
        fs.unlink(temp.name);
        console.log(`Upload >>> ${fname}`);
      });
    });
  } // upload
}
