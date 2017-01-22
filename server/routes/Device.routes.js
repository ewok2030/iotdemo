import { Router } from 'express';
import * as deviceController from '../controllers/Device.controller';

const router = new Router();

// Get All
router.route('/').get(deviceController.getDevices);

// Get
router.route('/:id').get(deviceController.getDevice);

// Create
router.route('/').post(deviceController.addDevice);

// Update
router.route('/:id').put(deviceController.updateDevice);

// Delete
router.route('/:id').delete(deviceController.deleteDevice);

export default router;
