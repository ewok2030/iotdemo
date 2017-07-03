import { clientFromConnectionString } from 'azure-iot-device-mqtt';
import { Message } from 'azure-iot-device';
import uuidv1 from 'uuid/v1';
import fs from 'fs';

/* eslint-disable no-console */
export default class DummyDevice {

  constructor(config, twin) {
    this._client = clientFromConnectionString(config.connectionString);
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
      this._twin.on('properties.desired.message.interval', this.handleMessageIntervalUpdate);
      this._twin.on('properties.desired.message.transmit', this.handleMessageTransmitUpdate);
      this._twin.on('properties.desired.message.flash', this.handleFlashUpdate);
      this._twin.on('properties.desired.fileupload.interval', this.handleUploadIntervalUpdate);
      this._twin.on('properties.desired.fileupload.transmit', this.handleUploadTransmitUpdate);

      // Initialize the device
      this.startMessaging();
      this.startUploading();
    });
  }

  startMessaging() {
    if (this._messageInterval) clearInterval(this._messageInterval);
    this._messageInterval = setInterval(this.sendMessage, this.properties.message.interval);
  }

  startUploading() {
    if (this._uploadInterval) clearInterval(this._uploadInterval);
    this._uploadInterval = setInterval(this.readyToUpload, this.properties.fileupload.interval);
  }

  handleMessageIntervalUpdate = (interval) => {
    // Validate the properties!
    if (interval < this.config.message.interval.min || interval > this.config.message.interval.max) {
      console.error(`desired message transmission interval of ${interval} [ms] is not valid (${this.config.messsage.interval.min} <= x <= ${this.config.message.interval.max}). Ignoring.`);
      return;
    }
    console.log(`message transmission interval has been updated to ${interval}`);
    this.properties.message.interval = interval;
    this.startMessaging();
    this._twin.properties.reported.update({ message: { interval: this.properties.message.interval } }, (err) => {
      if (err) console.log(`error reporting updated twin: ${err}`);
    });
  }

  handleUploadIntervalUpdate = (interval) => {
    // Validate the properties!
    if (interval < this.config.fileupload.interval.min || interval > this.config.fileupload.interval.max) {
      console.error(`desired file upload interval of ${interval} [ms] is not valid (${this.config.fileupload.interval.min} <= x <= ${this.config.fileupload.interval.max}). Ignoring.`);
      return;
    }
    console.log(`file upload interval has been updated to ${interval}`);
    this.properties.fileupload.interval = interval;
    this.startUploading();
    this._twin.properties.reported.update({ fileupload: { interval: this.properties.fileupload.interval } }, (err) => {
      if (err) console.log(`error reporting updated twin (fileupload): ${err}`);
    });
  }

  handleMessageTransmitUpdate = (transmit) => {
    console.log(`message transmission state has been updated to ${transmit}`);
    this.properties.message.transmit = transmit;
    this._twin.properties.reported.update({ message: { transmit: this.properties.message.transmit } }, (err) => {
      if (err) console.log(`error reporting updated twin: ${err}`);
    });
  }

  handleUploadTransmitUpdate = (transmit) => {
    console.log(`file upload transmission state has been updated to ${transmit}`);
    this.properties.fileupload.transmit = transmit;
    this._twin.properties.reported.update({ fileupload: { transmit: this.properties.fileupload.transmit } }, (err) => {
      if (err) console.log(`error reporting updated twin (fileupload): ${err}`);
    });
  }

  handleFlashUpdate = (flash) => {
    console.log(`message with flash has been updated to ${flash}`);
    this.properties.message.flash = flash;
    this._twin.properties.reported.update({ message: { flash: this.properties.message.flash } }, (err) => {
      if (err) console.log(`error reporting updated twin: ${err}`);
    });
  }

  sendMessage = () => {
    // Create payload for the message
    const data = {
      sourceTimestamp: new Date(),
      temperature: -1 * Math.random(),
      humidity: -1 * Math.random(),
      status: {
        flash: this.properties.message.flash,
      },
    };

    const message = new Message(JSON.stringify(data));
    message.messageId = uuidv1();

    // log the message in file
    this.appendMessageToFile(message);

    // send the data message
    if (this.properties.message.transmit) this.transmitEvent(message);

    // upload file if ready
    if (this.properties.fileupload.transmit && this._readyToUpload) this.uploadFile();
  }

  transmitEvent(message) {
    this._client.sendEvent(message, (e, result) => {
      if (e) console.log(`Send Message Error: ${e.toString()}`);
      if (result) {
        console.log(`Send Message >>> ${message.getData()}`);
      }
    });
  }

  appendMessageToFile(message) {
    if (!fs.existsSync(this.config.fileupload.tempfile)) {
      // no header will be written to the file
      fs.writeFileSync(this.config.fileupload.tempfile, `${message.getData()}\n`);
    } else {
      fs.appendFileSync(this.config.fileupload.tempfile, `${message.getData()}\n`);
    }
  }

  readyToUpload = () => {
    this._readyToUpload = true;
  }

  uploadFile() {
    const dt = new Date();
    const year = dt.getUTCFullYear();
    const month = dt.getUTCMonth();
    const day = dt.getUTCDate();
    const now = dt.toISOString().replace(new RegExp(':', 'g'), '');
    const fname = `sensordata/${year}/${month}/${day}/${now}.csv`;

    this._readyToUpload = false;

    fs.stat(this.config.fileupload.tempfile, (err, fstats) => {
      const filestream = fs.createReadStream(this.config.fileupload.tempfile);

      this._client.uploadToBlob(fname, filestream, fstats.size, (err2) => {
        if (err2) console.error(`error uploading file: ${fname}; error: ${err2}`);
        else {
          console.log(`uploaded file ${fname}; deleting the file`);
          fs.unlink(this.config.fileupload.tempfile);
        }
        filestream.destroy();
      });
    });
  } // upload
}
