import config from '../config';
import { Registry } from 'azure-iothub';

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
  registry.updateTwin(req.params.id, req.body, (error, twin) => {
    if (error) {
      res.status(404).send(error);
    } else {
      res.json(twin.properties);
    }
  });
}
