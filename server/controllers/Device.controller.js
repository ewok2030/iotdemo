import Task from '../models/Device.model';

export function getDevices(req, res) {
  Device.find().exec((err, docs) => {
    if (err) {
      res.status(500).send(err);
    }
    res.json(docs);
  });
}

export function getDevice(req, res) {
  Device.findById(req.params.id).exec((err, doc) => {
    if (err) {
      res.status(500).send(err);
    }
    res.json(doc);
  });
}

export function addDevice(req, res) {
  // Check for required fields
  if (!req.body.device.title || !req.body.post.status || !req.body.post.dateCreated) {
    res.status(403).end();
  }

  const newDoc = new Device(req.body.device);

  newDoc.save((err, saved) => {
    if (err) {
      res.status(500).send(err);
    }
    res.json(saved);
  });
}

export function updateDevice(req, res) {
  Device.findByIdAndUpdate(req.params.id, {
    $set: req.body,
  }, { new: true }).exec((err, doc) => {
    if (err) {
      res.status(500).send(err);
    }
    res.json(doc);
  });
}

export function deleteDevice(req, res) {
  // Device.findByIdAndRemove(id, options, callback)
  Device.findById(req.params.id).exec((err, doc) => {
    if (err) {
      res.status(500).send(err);
    }
    doc.remove(() => {
      res.status(200).end();
    });
  });
}
