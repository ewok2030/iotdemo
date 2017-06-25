import { Registry } from 'azure-iothub';
import config from '../config';

export function getDeviceTwin(req, res) {
  const registry = Registry.fromConnectionString(config.hub);
  registry.getTwin(req.params.id, (error, twin) => {
    if (error) {
      res.status(404).send(error);
    } else {
      res.json(twin.properties);
    }
  });
}

export function updateDeviceTwin(req, res) {
  const registry = Registry.fromConnectionString(config.hub);
  registry.updateTwin(req.params.id, { properties: { desired: req.body } }, '*', (error, twin) => {
    if (error) {
      res.status(404).send(error);
    } else {
      // the twin does not contain the device's response to the update request
      res.json(twin.properties);
    }
  });
}
