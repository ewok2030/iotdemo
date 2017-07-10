import { Registry } from 'azure-iothub';
import { DocumentClient } from 'documentdb';
import config from '../config';

export function getDevices(req, res) {
  const registry = Registry.fromConnectionString(config.hub);
  registry.list((error, devices) => {
    if (error) {
      res.status(400).send(error.message);
    } else {
      res.json(devices);
    }
  });
}

export function getDevice(req, res) {
  const registry = Registry.fromConnectionString(config.hub);
  registry.get(req.params.id, (error, device) => {
    if (error) {
      res.status(400).send(error.message);
    } else {
      res.json(device);
    }
  });
}

export function getDeviceTwin(req, res) {
  const registry = Registry.fromConnectionString(config.hub);
  registry.getTwin(req.params.id, (error, twin) => {
    if (error) {
      res.status(400).send(error.message);
    } else {
      res.json(twin.properties);
    }
  });
}

export function updateDeviceTwin(req, res) {
  const registry = Registry.fromConnectionString(config.hub);
  registry.updateTwin(req.params.id, { properties: { desired: req.body } }, '*', (error, twin) => {
    if (error) {
      res.status(400).send(error.message);
    } else {
      // the twin does not contain the device's response to the update request
      res.json(twin.properties);
    }
  });
}

export function getDeviceMessages(req, res) {
  const client = new DocumentClient(config.documentdbHost, { masterKey: config.documentdbKey });
  let hours = 1;
  if ('hours' in req.query) {
    // override the default
    hours = Number(req.query.hours);
  }
  client.queryDocuments(
    config.documentdbCollectionUri,
    `SELECT d.sourcetimestamp, d.temperature, d.humidity 
    FROM iotmessages d 
    WHERE d.vesselid = "${req.params.id}" AND d.sourcetimestamp > "${new Date(new Date() - ((60 * 60 * 1000) * hours)).toISOString()}"`).toArray((err, results) => {
      if (err) {
        res.status(400).send(JSON.stringify(err));
      } else {
        res.json(results);
      } // return results
    });
} // getDeviceHistory
